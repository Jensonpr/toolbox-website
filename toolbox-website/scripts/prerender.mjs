// Postbuild prerender: spins up vite preview, loads / in Puppeteer after
// React mounts, writes the populated HTML back to dist/index.html.
//
// On Linux (Vercel build container): uses @sparticuz/chromium, which ships a
// statically-compiled Chromium that works without system libs like libnspr4.
// On macOS (local dev): uses PUPPETEER_EXECUTABLE_PATH (point at system Chrome).
import { default as chromium } from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';
import { spawn } from 'child_process';
import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import http from 'http';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const PORT = 4173;
const BASE = `http://localhost:${PORT}`;
const IS_LINUX = process.platform === 'linux';

function waitForServer(timeout = 20_000) {
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

  const page = await browser.newPage();
  await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 30_000 });

  // Wait for React to populate #root (confirms JS executed)
  await page.waitForFunction(
    () => document.getElementById('root')?.children.length > 0,
    { timeout: 15_000 }
  );

  const html = await page.content();
  await browser.close();

  writeFileSync(resolve(ROOT, 'dist', 'index.html'), html, 'utf8');
  console.log('[prerender] dist/index.html written');
} catch (err) {
  console.error('[prerender] FAILED:', err.message);
  exitCode = 1;
} finally {
  preview.kill('SIGTERM');
  process.exit(exitCode);
}
