// Postbuild prerender: spins up vite preview, loads every route in the
// sitemap through Puppeteer after React mounts, and writes each one's
// fully-rendered HTML to its own dist/<route>/index.html.
//
// This matters because vercel.json rewrites every path to /index.html for
// the SPA fallback, but Vercel serves a matching static file over that
// rewrite when one exists. Without a prerendered file per route, every
// blog post (and every other page) was served the HOME PAGE's title,
// meta description, OG/Twitter tags and JSON-LD to any crawler or link
// preview bot that doesn't execute JS - only client-side React ever
// corrected it, which is invisible to those bots.
//
// On Linux (Vercel build container): uses @sparticuz/chromium, which ships a
// statically-compiled Chromium that works without system libs like libnspr4.
// On macOS (local dev): uses PUPPETEER_EXECUTABLE_PATH (point at system Chrome).
import { default as chromium } from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';
import { spawn } from 'child_process';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import http from 'http';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const PORT = 4173;
const BASE = `http://localhost:${PORT}`;
const IS_LINUX = process.platform === 'linux';

function waitForServer(timeout = 90_000) {
  return new Promise((ok, fail) => {
    const deadline = Date.now() + timeout;
    (function attempt() {
      http.get(BASE, res => { res.resume(); ok(); })
        .on('error', () => {
          if (Date.now() > deadline) return fail(new Error(`Preview not ready after ${timeout}ms`));
          setTimeout(attempt, 400);
        });
    })();
  });
}

// Single source of truth for which routes exist: the sitemap already lists
// every real page, so read paths back out of it instead of duplicating them.
function getRoutesFromSitemap() {
  const xml = readFileSync(resolve(ROOT, 'public', 'sitemap.xml'), 'utf8');
  const locs = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
  return locs.map(loc => {
    const path = new URL(loc).pathname;
    return path === '' ? '/' : path;
  });
}

function outputPathFor(route) {
  if (route === '/') return resolve(ROOT, 'dist', 'index.html');
  return resolve(ROOT, 'dist', `.${route}`, 'index.html');
}

const preview = spawn('npx', ['vite', 'preview', '--port', String(PORT)], {
  cwd: ROOT,
  stdio: ['ignore', 'pipe', 'pipe'],
});
preview.stdout.on('data', d => process.stdout.write(d));
preview.stderr.on('data', d => process.stderr.write(d));

let exitCode = 0;
try {
  await waitForServer();
  console.log('[prerender] preview ready');

  const executablePath = IS_LINUX
    ? await chromium.executablePath()
    : process.env.PUPPETEER_EXECUTABLE_PATH;

  if (!executablePath) throw new Error(
    'No Chrome found. On macOS set PUPPETEER_EXECUTABLE_PATH to your Chrome path.'
  );

  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: IS_LINUX
      ? chromium.args
      : ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const routes = getRoutesFromSitemap();
  console.log(`[prerender] ${routes.length} routes from sitemap.xml`);

  const page = await browser.newPage();
  let failures = 0;

  for (const route of routes) {
    try {
      await page.goto(`${BASE}${route}`, { waitUntil: 'domcontentloaded', timeout: 30_000 });

      // Wait for React to populate #root (confirms JS executed) and for
      // this route's own <title> to differ from the raw index.html shell,
      // which is our signal that this route's useEffect(setPageMeta) ran.
      await page.waitForFunction(
        () => document.getElementById('root')?.children.length > 0,
        { timeout: 15_000 }
      );
      // Small settle delay: effects (meta tags, JSON-LD injection) run
      // synchronously after mount, but give animations/observers a beat.
      await new Promise(r => setTimeout(r, 150));

      const html = await page.content();
      const outPath = outputPathFor(route);
      mkdirSync(dirname(outPath), { recursive: true });
      writeFileSync(outPath, html, 'utf8');
      console.log(`[prerender] wrote ${route === '/' ? 'dist/index.html' : `dist${route}/index.html`}`);
    } catch (err) {
      failures++;
      console.error(`[prerender] FAILED for ${route}:`, err.message);
    }
  }

  await browser.close();

  if (failures > 0) {
    console.error(`[prerender] ${failures} of ${routes.length} routes failed`);
    exitCode = 1;
  }
} catch (err) {
  console.error('[prerender] FAILED:', err.message);
  exitCode = 1;
} finally {
  preview.kill('SIGTERM');
  process.exit(exitCode);
}
