import { useState, useEffect, useRef } from "react";

// ─── Icons (inline SVG to avoid lucide import issues) ───────────────────────
const Icon = ({ d, size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d={d} />
  </svg>
);
const IcoMenu = () => <Icon d="M3 12h18M3 6h18M3 18h18" />;
const IcoX = () => <Icon d="M18 6L6 18M6 6l12 12" />;
const IcoCheck = ({ size }) => <Icon d="M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3" size={size} />;
const IcoSmartphone = () => <Icon d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />;
const IcoCreditCard = () => <Icon d="M1 4h22v16H1zM1 10h22" />;
const IcoTag = () => <Icon d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82zM7 7h.01" />;
const IcoChevDown = ({ rotate }) => <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: rotate ? "rotate(180deg)" : "none", transition: "transform 0.3s" }}><path d="M6 9l6 6 6-6" /></svg>;
const IcoChevLeft = () => <Icon d="M15 18l-6-6 6-6" />;
const IcoChevRight = () => <Icon d="M9 18l6-6-6-6" />;
const IcoPlus = ({ rotated }) => <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: rotated ? "rotate(45deg)" : "none", transition: "transform 0.3s" }}><path d="M12 5v14M5 12h14" /></svg>;
const IcoInstagram = () => <Icon d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5z" />;
const IcoFacebook = () => <Icon d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />;
const IcoLinkedin = () => <Icon d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 6a2 2 0 100-4 2 2 0 000 4z" />;
const IcoMail = () => <Icon d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6" />;
const IcoUser = () => <Icon d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" />;
const IcoSend = () => <Icon d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" />;
const IcoBriefcase = () => <Icon d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2M12 12v4M10 14h4" />;
const IcoBuilding = () => <Icon d="M3 21h18M9 21V7l7-4v18M3 21V11l6-4" />;
const IcoInfo = () => <Icon d="M12 22a10 10 0 100-20 10 10 0 000 20zM12 8h.01M11 12h1v4h1" />;
const IcoArrowLeft = () => <Icon d="M19 12H5M12 19l-7-7 7-7" />;

// ─── Data ────────────────────────────────────────────────────────────────────
const VENDORS = [
  { name: "Elite Supplements", logo: "https://res.cloudinary.com/dy4rpazlk/image/upload/v1777016410/Copy_of_Elite_Supplements_Logo_RGB_-_Elite_Supps_Chapel_St_brjj39.png" },
  { name: "Anthem Workwear", logo: "https://res.cloudinary.com/dy4rpazlk/image/upload/v1777016355/Black_logo_1_-_Danna_Campos_mnrq6z.png" },
  { name: "BSCO", logo: "https://res.cloudinary.com/dy4rpazlk/image/upload/v1777016354/Untitled_design_6_b9hlh5.png" },
  { name: "BitPocket", logo: "https://res.cloudinary.com/dy4rpazlk/image/upload/v1777016411/LOGO_largewhite_-_marc_beattie_vi5kjv.png" },
  { name: "Zilly Gear", logo: "https://res.cloudinary.com/dy4rpazlk/image/upload/v1777016353/Untitled_design_9_qvhaav.png" },
  { name: "Hard Hat", logo: "https://res.cloudinary.com/dy4rpazlk/image/upload/v1777016353/Untitled_design_8_qgxiky.png" },
  { name: "Tradie Frames", logo: "https://res.cloudinary.com/dy4rpazlk/image/upload/v1777016352/Untitled_design_13_uyvpqx.png" },
  { name: "Nutrition Warehouse", logo: "https://res.cloudinary.com/dy4rpazlk/image/upload/v1777016352/Untitled_design_12_ej4hui.png" },
  { name: "Edge Endurance", logo: "https://res.cloudinary.com/dy4rpazlk/image/upload/v1777016352/Untitled_design_10_qmifzi.png" },
  { name: "Recovery Lab", logo: "https://res.cloudinary.com/dy4rpazlk/image/upload/v1777016352/Untitled_design_11_ykhwa4.png" },
  { name: "Fitspace", logo: "https://res.cloudinary.com/dy4rpazlk/image/upload/v1777016351/Untitled_design_15_wit0ju.png" },
  { name: "REPS Fitness", logo: "https://res.cloudinary.com/dy4rpazlk/image/upload/v1777016351/Untitled_design_17_sf5u7m.png", scale: 1.4 },
  { name: "Sunday Fairway", logo: "https://res.cloudinary.com/dy4rpazlk/image/upload/v1777016351/Untitled_design_16_irf3fo.png" },
];

const TESTIMONIALS = [
  { text: "Finally, an app that actually looks after the blokes on the tools. Paid for itself in one shop.", author: "Mick R.", trade: "Carpenter (VIC)", seed: "tradie1" },
  { text: "The savings on workwear alone are insane. The Anthem and Hard Hat deals are top notch.", author: "Sarah L.", trade: "Sparky (VIC)", seed: "tradie2" },
  { text: "Showing the digital card in-store is so easy. No messing around with physical vouchers.", author: "Dave K.", trade: "Plumber (VIC)", seed: "tradie3" },
  { text: "Best $4.99 I spend every month. The supplement discounts keep me going through the week.", author: "Jason B.", trade: "Bricky (VIC)", seed: "tradie4" },
  { text: "Membership support is actual humans. Had a question and got a reply in minutes.", author: "Tom H.", trade: "Apprentice (VIC)", seed: "tradie5" },
  { text: "Every apprentice should have this. Makes the weekly budget go way further.", author: "Luke M.", trade: "Landscaper (TAS)", seed: "tradie6" },
];

const LOGO = "https://res.cloudinary.com/dy4rpazlk/image/upload/v1777016811/TheToolbox-White_2x_iqjf8y.png";

// ─── Marquee Carousel ─────────────────────────────────────────────────────────
function Marquee({ items, reverse = false, speed = 80 }) {
  const doubled = [...items, ...items, ...items, ...items];
  return (
    <div style={{ overflow: "hidden", width: "100%", position: "relative" }}>
      <div style={{
        display: "flex",
        gap: "24px",
        animation: `marquee${reverse ? "R" : ""} ${speed}s linear infinite`,
        width: "max-content",
      }}>
        {doubled.map((v, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            height: "120px", minWidth: "240px", padding: "0 40px",
            borderRadius: "24px", border: "1px solid #e2e8f0", background: "#fff",
            flexShrink: 0,
          }}>
            <img src={v.logo} alt={v.name} referrerPolicy="no-referrer"
              style={{ height: "56px", width: "140px", objectFit: "contain", mixBlendMode: "multiply" }} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer({ setPage }) {
  return (
    <footer style={{ background: "#0d1f4e",  padding: "80px 0 40px" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "32px", marginBottom: "48px" }}>
          <div>
            <img src={LOGO} alt="The ToolBox" style={{ height: 36, marginBottom: 24, filter: "brightness(0) invert(1)" }} />
            <p style={{ color: "rgba(255,255,255,0.4)", fontWeight: 700, lineHeight: 1.7, maxWidth: 280 }}>
              Australia's first discount membership app built exclusively for tradies. Reclaiming value for the legends rebuilding the country.
            </p>
          </div>
          {[
            { title: "Company", links: [
              { label: "How it works", href: "#about" },
              { label: "Partner Brands", href: "#vendors" },
              { label: "Pricing", href: "#pricing" },
              { label: "Contact Us", page: "contact" },
              { label: "FAQ", href: "#faq" },
            ]},
            { title: "Partners", links: [
              { label: "Partner With Us", page: "vendor" },
              { label: "Vendor Login", href: "#" },
            ]},
            { title: "Legal", links: [
              { label: "Privacy Policy", page: "privacy" },
              { label: "Terms of Service", page: "terms" },
              { label: "Refund Policy", page: "refunds" },
            ]},
          ].map(col => (
            <div key={col.title}>
              <p style={{ color: "#5ba4cf", fontWeight: 900, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 24 }}>{col.title}</p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 16 }}>
                {col.links.map(l => (
                  <li key={l.label}>
                    {l.page ? (
                      <button onClick={() => setPage(l.page)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.3)", fontWeight: 700, fontSize: 14, textDecoration: "none" }}
                        onMouseOver={e => e.target.style.color = "#fff"} onMouseOut={e => e.target.style.color = "rgba(255,255,255,0.3)"}>
                        {l.label}
                      </button>
                    ) : (
                      <a href={l.href} style={{ color: "rgba(255,255,255,0.3)", fontWeight: 700, fontSize: 14, textDecoration: "none" }}
                        onMouseOver={e => e.target.style.color = "#fff"} onMouseOut={e => e.target.style.color = "rgba(255,255,255,0.3)"}>
                        {l.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{  paddingTop: 32, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ color: "rgba(255,255,255,0.2)", fontSize: 10, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.2em" }}>
            &copy; {new Date().getFullYear()} The ToolBox App Pty Ltd. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: 24 }}>
            {[
              { icon: <IcoInstagram />, href: "https://www.instagram.com/thetoolboxau/" },
              { icon: <IcoFacebook />, href: "#" },
              { icon: <IcoLinkedin />, href: "#" },
            ].map((s, i) => (
              <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,255,255,0.2)", textDecoration: "none" }}
                onMouseOver={e => { e.currentTarget.style.color = "#5ba4cf"; e.currentTarget.style.transform = "scale(1.1)"; }}
                onMouseOut={e => { e.currentTarget.style.color = "rgba(255,255,255,0.2)"; e.currentTarget.style.transform = "scale(1)"; }}>
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Legal Layout ─────────────────────────────────────────────────────────────
function LegalPage({ title, setPage, children }) {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div style={{ minHeight: "100vh", background: "#0d1f4e", color: "#fff", fontFamily: "'Cabinet Grotesk', 'Inter', sans-serif", width: "100%", overflowX: "hidden" }}>
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, background: "rgba(13,31,78,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.05)", height: 80, display: "flex", alignItems: "center" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 32px", width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button onClick={() => setPage("home")} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            <img src={LOGO} alt="The ToolBox" referrerPolicy="no-referrer" style={{ height: 36, objectFit: "contain" }} />
          </button>
          <button onClick={() => setPage("home")} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.6)", fontWeight: 900, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.2em" }}
            onMouseOver={e => e.target.style.color = "#fff"} onMouseOut={e => e.target.style.color = "rgba(255,255,255,0.6)"}>
            Back to Home
          </button>
        </div>
      </nav>
      <main style={{ paddingTop: 160, paddingBottom: 96, maxWidth: 800, margin: "0 auto", padding: "160px 32px 96px" }}>
        <p style={{ color: "#5ba4cf", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 16 }}>Legal Document</p>
        <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", fontWeight: 900, letterSpacing: "-0.04em", marginBottom: 64, fontStyle: "italic", textTransform: "uppercase", lineHeight: 0.9 }}>
          {title}<span style={{ color: "#5ba4cf" }}>.</span>
        </h1>
        <div style={{ color: "rgba(255,255,255,0.7)", fontWeight: 500, lineHeight: 1.8 }}>{children}</div>
      </main>
      <Footer setPage={setPage} />
    </div>
  );
}

function LegalSection({ title, children }) {
  return (
    <div style={{ marginBottom: 48 }}>
      <h2 style={{ fontSize: "1.3rem", fontWeight: 900, color: "#fff", letterSpacing: "-0.02em", fontStyle: "italic", textTransform: "uppercase", marginBottom: 16 }}>{title}</h2>
      {children}
    </div>
  );
}

// ─── Pages ────────────────────────────────────────────────────────────────────
function PrivacyPage({ setPage }) {
  return (
    <LegalPage title="Privacy Policy" setPage={setPage}>
      <LegalSection title="1. Introduction">
        <p>The ToolBox App Pty Ltd ("we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application and website.</p>
      </LegalSection>
      <LegalSection title="2. Information Collection">
        <p>We collect information that you provide directly to us when you create an account, subscribe to our membership, or communicate with us. This may include:</p>
        <ul style={{ paddingLeft: 24, marginTop: 12 }}>
          {["Name and contact information (email address, phone number).", "Trade information and business details.", "Payment information (processed securely through third-party providers).", "Usage data and device information."].map(i => <li key={i} style={{ marginBottom: 8 }}>{i}</li>)}
        </ul>
      </LegalSection>
      <LegalSection title="3. Use of Information">
        <p>We use the information we collect to:</p>
        <ul style={{ paddingLeft: 24, marginTop: 12 }}>
          {["Provide, maintain, and improve our services.", "Process your membership and transactions.", "Send you technical notices, updates, and support messages.", "Communicate with you about discounts, offers, and partner updates.", "Monitor and analyze trends, usage, and activities."].map(i => <li key={i} style={{ marginBottom: 8 }}>{i}</li>)}
        </ul>
      </LegalSection>
      <LegalSection title="4. Disclosure of Information">
        <p>We do not sell your personal information. We may share information with:</p>
        <ul style={{ paddingLeft: 24, marginTop: 12 }}>
          {["Partner vendors (only to verify membership for discounts).", "Service providers who perform services on our behalf.", "Legal authorities if required by law or to protect our rights."].map(i => <li key={i} style={{ marginBottom: 8 }}>{i}</li>)}
        </ul>
      </LegalSection>
      <LegalSection title="5. Security">
        <p>We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access. However, no data transmission over the internet can be guaranteed to be 100% secure.</p>
      </LegalSection>
      <LegalSection title="6. Contact Us">
        <p>If you have any questions about this Privacy Policy, please contact us at support@thetoolbox.group.</p>
      </LegalSection>
      <p style={{ fontSize: 13, opacity: 0.4, marginTop: 48 }}>Last updated: April 21, 2026</p>
    </LegalPage>
  );
}

function TermsPage({ setPage }) {
  return (
    <LegalPage title="Terms of Service" setPage={setPage}>
      <LegalSection title="1. Acceptance of Terms">
        <p>By accessing or using The ToolBox application, you agree to be bound by these Terms of Service. If you do not agree, you are prohibited from using the app.</p>
      </LegalSection>
      <LegalSection title="2. Membership & Subscription">
        <p>The ToolBox offers a paid membership service. By subscribing, you agree to pay the fee stated at the time of purchase. Subscriptions automatically renew unless cancelled.</p>
        <ul style={{ paddingLeft: 24, marginTop: 12 }}>
          {["Monthly Pro: $4.99 per month.", "Annual Gold Saver: $49.99 per year.", "Membership is for individual use only and non-transferable."].map(i => <li key={i} style={{ marginBottom: 8 }}>{i}</li>)}
        </ul>
      </LegalSection>
      <LegalSection title="3. Discount Redemptions">
        <p>Discounts provided by partner vendors are subject to the vendor's own terms and availability. We do not guarantee the evergreen availability of any specific discount and partner lists may change without notice.</p>
      </LegalSection>
      <LegalSection title="4. Prohibited Use">
        <p>You may not:</p>
        <ul style={{ paddingLeft: 24, marginTop: 12 }}>
          {["Share your membership credentials with non-members.", "Attempt to decompile or reverse engineer the application.", "Use the application for any illegal or unauthorized purpose.", "Misrepresent your trade status to obtain membership."].map(i => <li key={i} style={{ marginBottom: 8 }}>{i}</li>)}
        </ul>
      </LegalSection>
      <LegalSection title="5. Limitation of Liability">
        <p>The ToolBox App Pty Ltd shall not be liable for any damages arising out of the use or inability to use the services, or for any disputes between members and partner vendors.</p>
      </LegalSection>
      <LegalSection title="6. Governing Law">
        <p>These terms are governed by and construed in accordance with the laws of Victoria, Australia.</p>
      </LegalSection>
      <p style={{ fontSize: 13, opacity: 0.4, marginTop: 48 }}>Last updated: April 21, 2026</p>
    </LegalPage>
  );
}

function RefundsPage({ setPage }) {
  return (
    <LegalPage title="Refund Policy" setPage={setPage}>
      <LegalSection title="1. Subscription Refunds">
        <p>Due to the immediate access provided to digital discounts and vendor codes, we generally do not offer refunds on membership fees once a subscription period has commenced or the member has accessed the benefits.</p>
      </LegalSection>
      <LegalSection title="2. Cancellation">
        <p>You can cancel your subscription at any time through the app settings or by contacting our support team. Upon cancellation, you will continue to have access until the end of your current billing cycle.</p>
      </LegalSection>
      <LegalSection title="3. Exceptional Circumstances">
        <p>We may, at our sole discretion, provide a refund in exceptional circumstances, such as:</p>
        <ul style={{ paddingLeft: 24, marginTop: 12 }}>
          {["Technical errors preventing access to the service.", "Accidental double-billing.", "Requests made within 24 hours of an accidental renewal (provided no benefits were used)."].map(i => <li key={i} style={{ marginBottom: 8 }}>{i}</li>)}
        </ul>
      </LegalSection>
      <LegalSection title="4. Partner Vendor Disputes">
        <p>The ToolBox is not responsible for the products or services provided by partner vendors. Any refunds for purchases made at a partner vendor must be handled directly with that vendor.</p>
      </LegalSection>
      <LegalSection title="5. Contact Support">
        <p>To discuss a refund request, please email support@thetoolbox.group with your account details and the reason for the request.</p>
      </LegalSection>
      <p style={{ fontSize: 13, opacity: 0.4, marginTop: 48 }}>Last updated: April 21, 2026</p>
    </LegalPage>
  );
}

function VendorPage({ setPage }) {
  const [status, setStatus] = useState("idle");
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const handleSubmit = (e) => { e.preventDefault(); setStatus("submitting"); setTimeout(() => setStatus("success"), 1500); };
  const inp = { width: "100%", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 16, padding: "18px 20px 18px 52px", fontWeight: 700, fontSize: 15, outline: "none", fontFamily: "inherit", boxSizing: "border-box" };
  return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: "'Cabinet Grotesk', 'Inter', sans-serif", width: "100%" }}>
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, background: "rgba(255,255,255,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid #f1f5f9", height: 72, display: "flex", alignItems: "center" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 32px", width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button onClick={() => setPage("home")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, color: "#0d1f4e", fontWeight: 900, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.2em" }}>
            <IcoArrowLeft /> Back to Home
          </button>
          <img src={LOGO} alt="The ToolBox" referrerPolicy="no-referrer" style={{ height: 32, objectFit: "contain", mixBlendMode: "multiply" }} />
        </div>
      </nav>
      <section style={{ paddingTop: 140, paddingBottom: 80 }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 32px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 40, alignItems: "start" }}>
            <div style={{ position: "sticky", top: 140 }}>
              <p style={{ color: "#5ba4cf", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 16 }}>Partner with us</p>
              <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, color: "#0d1f4e", letterSpacing: "-0.04em", lineHeight: 0.9, marginBottom: 32 }}>Join the Network<span style={{ color: "#5ba4cf" }}>.</span></h2>
              <p style={{ color: "rgba(13,31,78,0.6)", fontWeight: 500, marginBottom: 24, lineHeight: 1.7 }}>Ready to get your brand in front of thousands of Australian tradies? Fill out the form and we'll be in touch.</p>
              <div style={{ display: "flex", gap: 16, padding: 16, background: "#f8fafc", borderRadius: 16, border: "1px solid #e2e8f0" }}>
                <IcoInfo />
                <p style={{ fontSize: 13, color: "rgba(13,31,78,0.6)", fontWeight: 500, margin: 0, fontStyle: "italic" }}>We manually vet all partners to ensure the best value for our members.</p>
              </div>
            </div>
            <div style={{ background: "#fff", padding: 40, borderRadius: 40, boxShadow: "0 25px 50px rgba(0,0,0,0.08)", border: "1px solid #f1f5f9" }}>
              {status === "success" ? (
                <div style={{ textAlign: "center", padding: "60px 0" }}>
                  <div style={{ width: 80, height: 80, background: "#dcfce7", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", color: "#16a34a" }}>
                    <IcoCheck size={40} />
                  </div>
                  <h3 style={{ fontSize: "1.8rem", fontWeight: 900, color: "#0d1f4e", marginBottom: 16 }}>Application Sent!</h3>
                  <p style={{ color: "rgba(13,31,78,0.5)", fontWeight: 700, marginBottom: 32, fontStyle: "italic" }}>We'll review your details and get back to you within 48 hours.</p>
                  <button onClick={() => setStatus("idle")} style={{ background: "none", border: "none", cursor: "pointer", color: "#5ba4cf", fontWeight: 900, textTransform: "uppercase", fontSize: 13, letterSpacing: "0.2em", textDecoration: "underline" }}>Submit another application</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
                    {[
                      { label: "Contact Name *", placeholder: "John Smith", type: "text", icon: <IcoUser />, required: true },
                      { label: "Job Title", placeholder: "Director", type: "text", icon: <IcoBriefcase />, required: false },
                    ].map(f => (
                      <div key={f.label}>
                        <label style={{ fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.15em", color: "rgba(13,31,78,0.4)", fontStyle: "italic", display: "block", marginBottom: 8 }}>{f.label}</label>
                        <div style={{ position: "relative" }}>
                          <span style={{ position: "absolute", left: 18, top: "50%", transform: "translateY(-50%)", color: "rgba(13,31,78,0.2)" }}>{f.icon}</span>
                          <input type={f.type} placeholder={f.placeholder} required={f.required} style={inp} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
                    {[
                      { label: "Email Address *", placeholder: "john@business.com", type: "email", icon: <IcoMail />, required: true },
                      { label: "Business Name *", placeholder: "The ToolBox Co.", type: "text", icon: <IcoBuilding />, required: true },
                    ].map(f => (
                      <div key={f.label}>
                        <label style={{ fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.15em", color: "rgba(13,31,78,0.4)", fontStyle: "italic", display: "block", marginBottom: 8 }}>{f.label}</label>
                        <div style={{ position: "relative" }}>
                          <span style={{ position: "absolute", left: 18, top: "50%", transform: "translateY(-50%)", color: "rgba(13,31,78,0.2)" }}>{f.icon}</span>
                          <input type={f.type} placeholder={f.placeholder} required={f.required} style={inp} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.15em", color: "rgba(13,31,78,0.4)", fontStyle: "italic", display: "block", marginBottom: 8 }}>Offer / Discount *</label>
                    <textarea required placeholder="20% off storewide, Buy 1 get 1 Free, etc." rows={5} style={{ width: "100%", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 16, padding: 20, fontWeight: 700, fontSize: 15, outline: "none", fontFamily: "inherit", resize: "vertical", boxSizing: "border-box" }} />
                  </div>
                  <button disabled={status === "submitting"} style={{ width: "100%", background: "#0d1f4e", color: "#fff", padding: "22px", borderRadius: 16, fontWeight: 900, fontSize: "1.2rem", fontStyle: "italic", letterSpacing: "-0.02em", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 12, opacity: status === "submitting" ? 0.5 : 1 }}
                    onMouseOver={e => { if (status !== "submitting") e.currentTarget.style.background = "#5ba4cf"; }}
                    onMouseOut={e => e.currentTarget.style.background = "#0d1f4e"}>
                    {status === "submitting" ? <div style={{ width: 24, height: 24, border: "3px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /> : <><IcoSend />Submit Application</>}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
      <footer style={{ background: "#0d1f4e", padding: "40px 0" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <img src={LOGO} alt="The ToolBox" style={{ height: 32, filter: "brightness(0) invert(1)", opacity: 0.3 }} />
          <p style={{ color: "rgba(255,255,255,0.2)", fontSize: 10, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.2em" }}>
            &copy; {new Date().getFullYear()} The ToolBox App Pty Ltd. Built for tradies.
          </p>
        </div>
      </footer>
    </div>
  );
}

function ContactPage({ setPage }) {
  const [status, setStatus] = useState("idle");
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const handleSubmit = (e) => { e.preventDefault(); setStatus("submitting"); setTimeout(() => setStatus("success"), 1500); };
  const inp = { width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: "18px 20px 18px 52px", fontWeight: 700, fontSize: 15, outline: "none", fontFamily: "inherit", color: "#fff", boxSizing: "border-box" };
  return (
    <div style={{ minHeight: "100vh", background: "#0d1f4e", color: "#fff", fontFamily: "'Cabinet Grotesk', 'Inter', sans-serif", width: "100%", overflowX: "hidden" }}>
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, background: "rgba(13,31,78,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.05)", height: 80, display: "flex", alignItems: "center" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 32px", width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button onClick={() => setPage("home")} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            <img src={LOGO} alt="The ToolBox" referrerPolicy="no-referrer" style={{ height: 36, objectFit: "contain" }} />
          </button>
          <button onClick={() => setPage("home")} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.6)", fontWeight: 900, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.2em" }}>Back to Home</button>
        </div>
      </nav>
      <main style={{ paddingTop: 140, paddingBottom: 80, maxWidth: 1400, margin: "0 auto", padding: "140px 32px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 48 }}>
          <div>
            <p style={{ color: "#5ba4cf", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 16 }}>Get in touch</p>
            <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 900, letterSpacing: "-0.04em", marginBottom: 32, fontStyle: "italic", textTransform: "uppercase", lineHeight: 0.9 }}>Contact us<span style={{ color: "#5ba4cf" }}>.</span></h1>
            <p style={{ color: "rgba(255,255,255,0.6)", fontWeight: 500, lineHeight: 1.7, marginBottom: 48, maxWidth: 360 }}>Have a question about your membership? Or just want to have a yarn? Send us a message and we'll get back to you shortly.</p>
            {[
              { icon: <IcoMail />, label: "Email us", value: "support@thetoolbox.group" },
              { icon: <IcoInstagram />, label: "Follow us", value: "@thetoolboxau" },
            ].map(c => (
              <div key={c.label} style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 32 }}>
                <div style={{ width: 56, height: 56, background: "rgba(255,255,255,0.05)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", color: "#5ba4cf" }}>{c.icon}</div>
                <div>
                  <p style={{ fontSize: 10, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.2em", color: "rgba(255,255,255,0.3)", marginBottom: 4 }}>{c.label}</p>
                  <p style={{ fontSize: "1.1rem", fontWeight: 700 }}>{c.value}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(20px)", padding: 48, borderRadius: 40, border: "1px solid rgba(255,255,255,0.1)" }}>
            {status === "success" ? (
              <div style={{ textAlign: "center", padding: "60px 0" }}>
                <div style={{ width: 80, height: 80, background: "rgba(34,197,94,0.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", color: "#22c55e" }}>
                  <IcoCheck size={40} />
                </div>
                <h3 style={{ fontSize: "1.8rem", fontWeight: 900, marginBottom: 16 }}>Message Sent!</h3>
                <p style={{ color: "rgba(255,255,255,0.4)", fontWeight: 700, marginBottom: 32, fontStyle: "italic" }}>We've received your message and will get back to you as soon as possible.</p>
                <button onClick={() => setStatus("idle")} style={{ background: "none", border: "none", cursor: "pointer", color: "#5ba4cf", fontWeight: 900, textTransform: "uppercase", fontSize: 13, letterSpacing: "0.2em", textDecoration: "underline" }}>Send another message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                {[
                  { label: "Your Name *", placeholder: "John Smith", type: "text", icon: <IcoUser />, required: true },
                  { label: "Email Address *", placeholder: "john@email.com", type: "email", icon: <IcoMail />, required: true },
                ].map(f => (
                  <div key={f.label}>
                    <label style={{ fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.15em", color: "rgba(255,255,255,0.3)", fontStyle: "italic", display: "block", marginBottom: 8 }}>{f.label}</label>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: 18, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.2)" }}>{f.icon}</span>
                      <input type={f.type} placeholder={f.placeholder} required={f.required} style={inp} />
                    </div>
                  </div>
                ))}
                <div>
                  <label style={{ fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.15em", color: "rgba(255,255,255,0.3)", fontStyle: "italic", display: "block", marginBottom: 8 }}>Message *</label>
                  <textarea required placeholder="How can we help?" rows={5} style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: 20, fontWeight: 700, fontSize: 15, outline: "none", fontFamily: "inherit", color: "#fff", resize: "vertical", boxSizing: "border-box" }} />
                </div>
                <button disabled={status === "submitting"} style={{ width: "100%", background: "#fff", color: "#0d1f4e", padding: "22px", borderRadius: 16, fontWeight: 900, fontSize: "1.2rem", fontStyle: "italic", letterSpacing: "-0.02em", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 12, opacity: status === "submitting" ? 0.5 : 1 }}
                  onMouseOver={e => { if (status !== "submitting") e.currentTarget.style.background = "#5ba4cf"; e.currentTarget.style.color = "#fff"; }}
                  onMouseOut={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#0d1f4e"; }}>
                  {status === "submitting" ? <div style={{ width: 24, height: 24, border: "3px solid rgba(13,31,78,0.3)", borderTopColor: "#0d1f4e", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /> : <><IcoSend />Send Message</>}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer setPage={setPage} />
    </div>
  );
}

// ─── Mailchimp Submit ─────────────────────────────────────────────────────────
function submitToMailchimp(email, onSuccess, onError) {
  const MAILCHIMP_URL = "https://us9.list-manage.com/subscribe/post-json?u=481c0bed00a009906e41e9f2f&id=88ab48ec0d&c=?";
  // We need the u param - extract from a hidden input workaround
  // Use the direct post-json endpoint with JSONP
  const url = `https://us9.list-manage.com/subscribe/post-json?u=481c0bed00a009906e41e9f2f&id=88ab48ec0d&EMAIL=${encodeURIComponent(email)}&c=mailchimpCallback`;
  
  window.mailchimpCallback = (data) => {
    delete window.mailchimpCallback;
    if (data.result === "success") {
      onSuccess();
    } else {
      onError(data.msg);
    }
  };

  const script = document.createElement("script");
  script.src = url;
  script.onerror = () => onError("Network error");
  document.head.appendChild(script);
  setTimeout(() => {
    if (window.mailchimpCallback) {
      delete window.mailchimpCallback;
      onError("Request timed out");
    }
    document.head.removeChild(script);
  }, 8000);
}

// ─── Waitlist Inline (used in hero) ──────────────────────────────────────────
function WaitlistInline() {
  const [status, setStatus] = useState("idle");
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setStatus("submitting");
    submitToMailchimp(
      email,
      () => setStatus("success"),
      () => setStatus("error")
    );
  };

  if (status === "success") {
    return (
      <div style={{ background: "rgba(91,164,207,0.1)", border: "1px solid rgba(91,164,207,0.25)", borderRadius: 20, padding: "28px 32px", maxWidth: 520, margin: "0 auto", textAlign: "center" }}>
        <p style={{ fontSize: "1.5rem", marginBottom: 8 }}>🎉</p>
        <p style={{ fontWeight: 900, fontSize: "1.1rem", marginBottom: 6 }}>You're on the list!</p>
        <p style={{ color: "rgba(255,255,255,0.5)", fontWeight: 600, fontSize: 14 }}>Your Founding 500 spot is secured. We'll hit you up the moment the app drops.</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div style={{ background: "rgba(255,80,80,0.1)", border: "1px solid rgba(255,80,80,0.25)", borderRadius: 20, padding: "20px 28px", maxWidth: 520, margin: "0 auto", textAlign: "center" }}>
        <p style={{ fontWeight: 700, fontSize: 14, color: "rgba(255,255,255,0.7)" }}>Something went wrong. Try again or email us at support@thetoolbox.group</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 520, margin: "0 auto" }}>
      <div style={{ position: "relative", flex: 1 }}>
        <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)", pointerEvents: "none" }}>
          <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6"/></svg>
        </span>
        <input
          type="email" required placeholder="your@email.com"
          value={email} onChange={e => setEmail(e.target.value)}
          style={{ width: "100%", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 14, padding: "17px 18px 17px 46px", fontWeight: 700, fontSize: 15, outline: "none", fontFamily: "inherit", color: "#fff", boxSizing: "border-box", transition: "border-color 0.2s" }}
          onFocus={e => e.target.style.borderColor = "rgba(91,164,207,0.7)"}
          onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.15)"}
        />
      </div>
      <button type="submit" disabled={status === "submitting"}
        style={{ background: "#5ba4cf", color: "#fff", padding: "17px 28px", borderRadius: 14, fontWeight: 900, fontSize: "0.95rem", fontStyle: "italic", border: "none", cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s", opacity: status === "submitting" ? 0.7 : 1, flexShrink: 0 }}
        onMouseOver={e => { if (status !== "submitting") { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#0d1f4e"; }}}
        onMouseOut={e => { e.currentTarget.style.background = "#5ba4cf"; e.currentTarget.style.color = "#fff"; }}>
        {status === "submitting"
          ? <div style={{ width: 20, height: 20, border: "3px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          : "Secure My Spot"}
      </button>
    </form>
  );
}

// ─── Waitlist Modal ───────────────────────────────────────────────────────────
function WaitlistModal({ onClose }) {
  const [status, setStatus] = useState("idle");
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("submitting");
    submitToMailchimp(email, () => setStatus("success"), () => setStatus("error"));
  };

  return (
    <div onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(13,31,78,0.9)", backdropFilter: "blur(12px)" }} />
      <div style={{ position: "relative", zIndex: 1, background: "#fff", borderRadius: 28, padding: "36px 28px 28px", maxWidth: 420, width: "100%", boxShadow: "0 40px 80px rgba(0,0,0,0.4)" }}>
        
        <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, background: "rgba(13,31,78,0.06)", border: "none", cursor: "pointer", width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#0d1f4e" }}>
          <IcoX />
        </button>

        {status === "success" ? (
          <div style={{ textAlign: "center", padding: "16px 0 8px" }}>
            <p style={{ fontSize: "2.5rem", marginBottom: 16 }}>🎉</p>
            <h3 style={{ fontSize: "1.6rem", fontWeight: 900, color: "#0d1f4e", letterSpacing: "-0.03em", marginBottom: 10 }}>You're on the list!</h3>
            <p style={{ color: "rgba(13,31,78,0.5)", fontWeight: 600, lineHeight: 1.6, fontSize: 15 }}>
              Founding 500 spot secured. We'll hit you up the moment The ToolBox drops.
            </p>
          </div>
        ) : (
          <>
            <p style={{ fontSize: 11, fontWeight: 900, color: "#5ba4cf", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 12 }}>Founding 500 - Spots filling fast</p>
            <h3 style={{ fontSize: "1.8rem", fontWeight: 900, color: "#0d1f4e", letterSpacing: "-0.03em", lineHeight: 1.05, marginBottom: 10 }}>
              Lock in your price.<br />Forever.
            </h3>
            <p style={{ color: "rgba(13,31,78,0.55)", fontWeight: 600, lineHeight: 1.6, fontSize: 14, marginBottom: 24 }}>
              First 500 members lock in $4.99/mo for life and get an exclusive Founding Member badge in the app.
            </p>

            <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
              {[["$4.99/mo", "forever"], ["500", "spots only"], ["Free", "to download"]].map(([val, label]) => (
                <div key={label} style={{ flex: 1, textAlign: "center", padding: "12px 6px", background: "#f8fafc", borderRadius: 12, border: "1px solid #e2e8f0" }}>
                  <p style={{ fontSize: "1.1rem", fontWeight: 900, color: "#0d1f4e", marginBottom: 2 }}>{val}</p>
                  <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(13,31,78,0.4)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <input type="email" required placeholder="your@email.com"
                value={email} onChange={e => setEmail(e.target.value)}
                style={{ width: "100%", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 14, padding: "16px 18px", fontWeight: 700, fontSize: 15, outline: "none", fontFamily: "inherit", boxSizing: "border-box", color: "#0d1f4e" }}
                onFocus={e => e.target.style.borderColor = "#5ba4cf"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
              <button disabled={status === "submitting"}
                style={{ width: "100%", background: "#0d1f4e", color: "#fff", padding: 18, borderRadius: 14, fontWeight: 900, fontSize: "1.05rem", fontStyle: "italic", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s" }}
                onMouseOver={e => { if (status !== "submitting") e.currentTarget.style.background = "#5ba4cf"; }}
                onMouseOut={e => e.currentTarget.style.background = "#0d1f4e"}>
                {status === "submitting"
                  ? <div style={{ width: 20, height: 20, border: "3px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                  : "Secure My Founding Spot"}
              </button>
              {status === "error" && <p style={{ textAlign: "center", fontSize: 12, color: "#ef4444", fontWeight: 600 }}>Something went wrong. Try again or email support@thetoolbox.group</p>}
              <p style={{ textAlign: "center", fontSize: 12, color: "rgba(13,31,78,0.3)", fontWeight: 600 }}>No spam. We'll only email you when the app launches.</p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Landing Page ─────────────────────────────────────────────────────────────
function LandingPage({ setPage }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navStyle = {
    position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, height: 72,
    background: scrolled ? "rgba(13,31,78,0.95)" : "transparent",
    backdropFilter: scrolled ? "blur(20px)" : "none",
    borderBottom: scrolled ? "1px solid rgba(255,255,255,0.05)" : "none",
    transition: "all 0.4s",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0d1f4e", color: "#fff", fontFamily: "'Cabinet Grotesk', 'Inter', sans-serif", width: "100%", overflowX: "hidden" }}>
      {showModal && <WaitlistModal onClose={() => setShowModal(false)} />}

      {/* Nav */}
      <nav style={navStyle}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 32px", height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 48 }}>
            <img src={LOGO} alt="The ToolBox" style={{ height: 48, objectFit: "contain", display: "block", filter: "brightness(0) invert(1)" }} />
            <div className="desktop-nav" style={{ display: "flex", gap: 40, fontSize: 16, fontWeight: 900 }}>
              {[["How it works", "#about"], ["Vendors", "#vendors"], ["Pricing", "#pricing"], ["FAQ", "#faq"]].map(([label, href]) => (
                <a key={label} href={href} style={{ color: "#fff", textDecoration: "none", transition: "color 0.2s" }}
                  onMouseOver={e => e.target.style.color = "#5ba4cf"} onMouseOut={e => e.target.style.color = "#fff"}>{label}</a>
              ))}
              <button onClick={() => setPage("vendor")} style={{ background: "none", border: "none", cursor: "pointer", color: "#5ba4cf", fontWeight: 900, fontSize: 14 }}
                onMouseOver={e => e.target.style.color = "#fff"} onMouseOut={e => e.target.style.color = "#5ba4cf"}>Partner with us</button>
            </div>
          </div>
          <button onClick={() => setShowModal(true)} style={{ background: "#5ba4cf", color: "#fff", padding: "14px 28px", borderRadius: 14, fontWeight: 900, fontSize: 15, border: "none", cursor: "pointer", whiteSpace: "nowrap" }}
            onMouseOver={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#0d1f4e"; }}
            onMouseOut={e => { e.currentTarget.style.background = "#5ba4cf"; e.currentTarget.style.color = "#fff"; }}>
            Join Waitlist
          </button>
        </div>
      </nav>

      {/* Hero - Signup */}
      <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", background: "#0d1f4e" }}>
        <div style={{ position: "absolute", inset: 0 }}>
          <img src="https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&w=1920&q=80"
            alt="" referrerPolicy="no-referrer" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.12, filter: "grayscale(1)" }} />
          <div style={{ position: "absolute", inset: 0, background: "#0d1f4e" }} />
        </div>

        <div style={{ maxWidth: 560, margin: "0 auto", padding: "100px 24px 60px", position: "relative", zIndex: 10, width: "100%", textAlign: "center" }}>

          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(91,164,207,0.12)", border: "1px solid rgba(91,164,207,0.25)", borderRadius: 100, padding: "7px 16px", marginBottom: 28 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#5ba4cf", animation: "pulse 2s ease-in-out infinite", flexShrink: 0 }} />
            <span style={{ fontSize: 11, fontWeight: 900, color: "#5ba4cf", textTransform: "uppercase", letterSpacing: "0.15em" }}>Founding 500 - Limited spots</span>
          </div>

          <h1 style={{ fontSize: "clamp(2.6rem, 5vw, 4.5rem)", fontWeight: 900, lineHeight: 0.88, letterSpacing: "-0.04em", marginBottom: 24, color: "#fff" }}>
            Stop paying full<br />price on site<span style={{ color: "#5ba4cf" }}>.</span>
          </h1>

          <p style={{ fontSize: "clamp(0.95rem, 3.5vw, 1.15rem)", color: "rgba(255,255,255,0.6)", fontWeight: 500, lineHeight: 1.65, marginBottom: 32, maxWidth: 440, margin: "0 auto 32px" }}>
            Australia's first discount membership app for tradies. Tools, workwear, supplements and more - $4.99 a month, locked in forever for Founding 500 members.
          </p>

          <WaitlistInline />

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginTop: 28 }}>
            <div style={{ display: "flex" }}>
              {["tradie1","tradie2","tradie3","tradie4"].map((seed, i) => (
                <div key={seed} style={{ width: 30, height: 30, borderRadius: "50%", border: "2px solid rgba(13,31,78,0.8)", overflow: "hidden", marginLeft: i === 0 ? 0 : -8 }}>
                  <img src={`https://picsum.photos/seed/${seed}/100/100`} alt="" referrerPolicy="no-referrer" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              ))}
            </div>
            <p style={{ color: "rgba(255,255,255,0.3)", fontWeight: 700, fontSize: 12 }}>Tradies across Victoria already signed up</p>
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: 32, marginTop: 40, paddingTop: 32, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            {[["$4.99", "per month"], ["25+", "partner brands"], ["500", "founding spots"]].map(([val, label]) => (
              <div key={label} style={{ textAlign: "center" }}>
                <p style={{ fontSize: "1.5rem", fontWeight: 900, letterSpacing: "-0.04em", marginBottom: 4 }}>{val}</p>
                <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.12em" }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="about" style={{ background: "#5ba4cf", padding: "96px 0", position: "relative", overflow: "hidden" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 32px", position: "relative", zIndex: 1 }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <p style={{ color: "rgba(13,31,78,0.6)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 16 }}>Simple Process</p>
            <h2 style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontWeight: 900, letterSpacing: "-0.04em", color: "#0d1f4e" }}>How it works.</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
            {[
              { step: "01", title: "Join up", desc: "Download the app and start your $4.99/mo membership.", icon: <IcoSmartphone /> },
              { step: "02", title: "Browse Brands", desc: "Explore 25+ vendors across all your favourite trade categories.", icon: <IcoCreditCard /> },
              { step: "03", title: "Save Big", desc: "Show your digital card in-store or use codes online to redeem your deals.", icon: <IcoTag /> },
            ].map((item, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.35)", backdropFilter: "blur(10px)", padding: 40, borderRadius: 40, border: "1px solid rgba(255,255,255,0.2)", transition: "all 0.3s", cursor: "default" }}
                onMouseOver={e => { e.currentTarget.style.background = "rgba(255,255,255,0.55)"; e.currentTarget.style.transform = "translateY(-10px)"; e.currentTarget.style.boxShadow = "0 30px 60px rgba(0,0,0,0.15)"; }}
                onMouseOut={e => { e.currentTarget.style.background = "rgba(255,255,255,0.35)"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
                  <div style={{ color: "#0d1f4e" }}>{item.icon}</div>
                  <span style={{ fontSize: "4rem", fontWeight: 900, color: "rgba(13,31,78,0.1)", lineHeight: 1, fontStyle: "italic", textTransform: "uppercase" }}>{item.step}</span>
                </div>
                <h3 style={{ fontSize: "1.8rem", fontWeight: 900, letterSpacing: "-0.03em", color: "#0d1f4e", marginBottom: 12 }}>{item.title}</h3>
                <p style={{ color: "rgba(13,31,78,0.7)", fontWeight: 600, lineHeight: 1.6, fontSize: "1.05rem" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission + Vendors */}
      <section style={{ background: "#fff", padding: "96px 0", overflow: "hidden", width: "100%", boxSizing: "border-box" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 32px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 48, alignItems: "center", marginBottom: 64 }}>
          <div>
            <p style={{ color: "#5ba4cf", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 24 }}>Our Mission</p>
            <h2 style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 0.9, color: "#0d1f4e", marginBottom: 40 }}>
              Built by the trade<span style={{ color: "#5ba4cf" }}>,</span><br /> for the trade<span style={{ color: "#5ba4cf" }}>.</span>
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 20, fontSize: "1.1rem", color: "rgba(13,31,78,0.7)", fontWeight: 500, lineHeight: 1.7, maxWidth: 480 }}>
              <p>The ToolBox wasn't born in a boardroom - it was born on site. We got sick of seeing everyone else get the perks while the ones doing the hard yards got the short end of the stick.</p>
              <p>We built this app to level the playing field.</p>
            </div>
          </div>
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", inset: -16, background: "rgba(91,164,207,0.05)", borderRadius: 40, transform: "rotate(-2deg)" }} />
            <div style={{ position: "relative" }}>
              <img src="https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&w=800&q=80"
                alt="On site" referrerPolicy="no-referrer" style={{ width: "100%", aspectRatio: "1", objectFit: "cover", borderRadius: 40, filter: "grayscale(1)", transition: "filter 0.7s" }}
                onMouseOver={e => e.target.style.filter = "grayscale(0)"} onMouseOut={e => e.target.style.filter = "grayscale(1)"} />
              <div style={{ position: "absolute", bottom: 24, left: 24, right: 24, background: "rgba(255,255,255,0.92)", backdropFilter: "blur(10px)", padding: 20, borderRadius: 20, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}>
                <p style={{ color: "#0d1f4e", fontWeight: 900, fontStyle: "italic", textTransform: "uppercase", fontSize: "1.05rem", marginBottom: 4 }}>"Reclaiming value for Australian tradies."</p>
                <p style={{ color: "#5ba4cf", fontWeight: 700, fontSize: 13 }}>Founded in Melbourne, VIC</p>
              </div>
            </div>
          </div>
        </div>

        {/* Vendors */}
        <div id="vendors" style={{ scrollMarginTop: 80 }}>
          <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 32px 48px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <div>
                <p style={{ color: "#5ba4cf", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.2em", fontSize: 12, marginBottom: 12 }}>Our Network</p>
                <h2 style={{ fontSize: "clamp(2rem, 3vw, 2.8rem)", fontWeight: 900, letterSpacing: "-0.03em", color: "#0d1f4e", lineHeight: 1 }}>Partnered<br />Vendors<span style={{ color: "#5ba4cf" }}>.</span></h2>
              </div>
              <div>
                <p style={{ color: "rgba(13,31,78,0.5)", fontWeight: 700, fontSize: 15, maxWidth: 320, textAlign: "right", lineHeight: 1.6, marginBottom: 12 }}>25+ brands across tools, workwear, supplements, fitness & more. Growing every week.</p>
                <div style={{ display: "flex", alignItems: "center", gap: 8, color: "rgba(13,31,78,0.4)", fontWeight: 900, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.2em", justifyContent: "flex-end" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", animation: "pulse 2s ease-in-out infinite" }} />
                  Live Network Updates
                </div>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 24, position: "relative" }}>
            <Marquee items={VENDORS.slice(0, 7)} speed={70} />
            <Marquee items={VENDORS.slice(7)} reverse speed={90} />
            <div style={{ position: "absolute", inset: "0 auto 0 0", width: 160, background: "linear-gradient(to right, #fff, transparent)", pointerEvents: "none", zIndex: 2 }} />
            <div style={{ position: "absolute", inset: "0 0 0 auto", width: 160, background: "linear-gradient(to left, #fff, transparent)", pointerEvents: "none", zIndex: 2 }} />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ background: "#0d1f4e", padding: "96px 0", scrollMarginTop: 80 }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 32px" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <p style={{ color: "#5ba4cf", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 16 }}>Simple Pricing</p>
            <h2 style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontWeight: 900, letterSpacing: "-0.04em", color: "#fff" }}>Pick your plan.</h2>
            <p style={{ color: "rgba(255,255,255,0.5)", fontWeight: 600, marginTop: 16, fontSize: "1.05rem" }}>Join the waitlist now - Founding 500 members lock in this price forever.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24, maxWidth: 960, margin: "0 auto" }}>
            {[
              { name: "Monthly Pro", price: "$4.99", period: "/ mo", desc: "Cancel Anytime", highlight: false,
                feats: ["Discounts across 25+ tradie-relevant brands", "Instant digital membership card on your phone", "Saves you more than it costs in the first redemption"],
                badge: null },
              { name: "Annual Gold Saver", price: "$49.99", period: "/ yr", desc: "Save $10 Per Year", highlight: true,
                feats: ["Everything in Monthly, plus 2 months completely free", "Priority access to new vendors and drops", "Members-only giveaways and exclusive deals"],
                badge: "BEST VALUE" },
            ].map((plan, i) => (
              <div key={i} style={{ background: plan.highlight ? "#5ba4cf" : "#fff", color: "#0d1f4e", padding: 40, borderRadius: 40, boxShadow: "0 30px 60px rgba(0,0,0,0.2)", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden", transition: "transform 0.3s" }}
                onMouseOver={e => e.currentTarget.style.transform = "translateY(-10px)"}
                onMouseOut={e => e.currentTarget.style.transform = "translateY(0)"}>
                {plan.badge && (
                  <div style={{ position: "absolute", top: 20, right: 20, background: "#0d1f4e", color: "#fff", padding: "6px 14px", borderRadius: 100, fontSize: 10, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.15em" }}>{plan.badge}</div>
                )}
                <div style={{ marginBottom: 32 }}>
                  <p style={{ fontWeight: 700, textTransform: "uppercase", fontSize: 11, opacity: 0.5, marginBottom: 8 }}>{plan.name}</p>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                    <span style={{ fontSize: "3.5rem", fontWeight: 900, textTransform: "uppercase" }}>{plan.price}</span>
                    <span style={{ fontWeight: 700, opacity: 0.5 }}>{plan.period}</span>
                  </div>
                  <p style={{ fontWeight: 900, textTransform: "uppercase", fontSize: 10, letterSpacing: "0.2em", opacity: 0.6, fontStyle: "italic", marginTop: 12 }}>{plan.desc}</p>
                </div>
                <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 16, flex: 1, marginBottom: 24 }}>
                  {plan.feats.map(f => (
                    <li key={f} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 14, fontWeight: 700, opacity: 0.85 }}>
                      <IcoCheck size={18} />{f}
                    </li>
                  ))}
                </ul>
                <div style={{ background: plan.highlight ? "rgba(13,31,78,0.15)" : "rgba(91,164,207,0.08)", borderRadius: 16, padding: "12px 16px", marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#f4c430", flexShrink: 0 }} />
                  <p style={{ fontSize: 12, fontWeight: 700, opacity: 0.8, fontStyle: "italic" }}>Founding 500 members lock in this price forever + get an exclusive in-app badge.</p>
                </div>
                <button onClick={() => setShowModal(true)} style={{ width: "100%", background: plan.highlight ? "#0d1f4e" : "#5ba4cf", color: "#fff", padding: 18, borderRadius: 16, fontWeight: 900, fontSize: "1.1rem", fontStyle: "italic", textTransform: "uppercase", letterSpacing: "-0.02em", border: "none", cursor: "pointer", transition: "opacity 0.2s" }}
                  onMouseOver={e => e.target.style.opacity = "0.85"} onMouseOut={e => e.target.style.opacity = "1"}>
                  Join the Waitlist
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ background: "#fff", padding: "96px 0", width: "100%", boxSizing: "border-box" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 32px" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <p style={{ color: "#5ba4cf", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 16 }}>The word on site</p>
            <h2 style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 900, letterSpacing: "-0.04em", textTransform: "uppercase", fontStyle: "italic", color: "#0d1f4e" }}>
              <span style={{ color: "#5ba4cf" }}>Real Tradies. Real Savings.</span>
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} style={{ background: "#f8fafc", padding: 40, borderRadius: 40,  display: "flex", flexDirection: "column", justifyContent: "space-between", transition: "all 0.3s" }}
                onMouseOver={e => { e.currentTarget.style.transform = "translateY(-8px)"; e.currentTarget.style.boxShadow = "0 24px 48px rgba(0,0,0,0.08)"; }}
                onMouseOut={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
                <p style={{ fontSize: "1.1rem", fontWeight: 900, letterSpacing: "-0.02em", color: "#0d1f4e", lineHeight: 1.4, marginBottom: 32 }}>"{t.text}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", overflow: "hidden", flexShrink: 0 }}>
                    <img src={`https://picsum.photos/seed/${t.seed}/100/100`} alt="" referrerPolicy="no-referrer" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div>
                    <span style={{ display: "block", color: "#5ba4cf", fontWeight: 900, textTransform: "uppercase", fontSize: 11, letterSpacing: "0.2em", marginBottom: 2 }}>{t.author}</span>
                    <span style={{ display: "block", color: "rgba(13,31,78,0.4)", fontWeight: 700, fontSize: 12 }}>{t.trade}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ background: "#fff", padding: "96px 0", scrollMarginTop: 80, width: "100%", boxSizing: "border-box" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 32px" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <h2 style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 900, letterSpacing: "-0.04em", textTransform: "uppercase", fontStyle: "italic", color: "#0d1f4e" }}>
              <span style={{ color: "#5ba4cf" }}>Got questions?</span>
            </h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { q: "How do I use my discount?", a: "Once you're a member, simply open the app and show your digital membership card in-store at any of our partner vendors, or use the provided promo code for online orders." },
              { q: "Is there a lock-in contract?", a: "No way. Our Monthly Pro plan is cancel-anytime. Our Annual plan offers the best value but you're never forced to stay if you don't want to." },
              { q: "Which brands are included?", a: "We have 25+ vendors and growing across tools, workwear, supplements, recovery and more. You can see the full list of our partners directly inside the app." },
              { q: "Can I use it anywhere in Australia?", a: "Currently we are focused on Victoria-based vendors and legends, but we are expanding rapidly to other states very soon. Stay tuned!" },
              { q: "When is the Android version coming?", a: "We launched on iOS first to get the product right. Android is on the roadmap and will be announced to our waitlist first - another reason to sign up now." },
              { q: "How do I know the discounts are legit?", a: "Every vendor on The ToolBox is personally vetted and onboarded by us. We only partner with brands that offer genuine, meaningful savings - not token 5% deals. If it's not worth your time, it doesn't make the cut." },
            ].map((item, i) => (
              <div key={i} style={{ borderRadius: 24, border: "1px solid #e2e8f0", overflow: "hidden" }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width: "100%", textAlign: "left", padding: "28px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", background: openFaq === i ? "#f8fafc" : "#fff", border: "none", cursor: "pointer", transition: "background 0.2s" }}>
                  <span style={{ fontSize: "1.1rem", fontWeight: 900, letterSpacing: "-0.02em", color: "#0d1f4e" }}>{item.q}</span>
                  <span style={{ color: "#5ba4cf", flexShrink: 0 }}><IcoChevDown rotate={openFaq === i} /></span>
                </button>
                {openFaq === i && (
                  <div style={{ padding: "0 32px 28px", color: "rgba(13,31,78,0.6)", fontWeight: 600, fontSize: "1.05rem", lineHeight: 1.7 }}>{item.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>


      <Footer setPage={setPage} />
    </div>
  );
}

// ─── App Router
// ─── App Router ───────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@400,500,700,800,900&display=swap";
    document.head.appendChild(link);
  }, []);

  const handleSetPage = (p) => {
    setPage(p);
    setTimeout(() => window.scrollTo({ top: 0 }), 10);
  };

  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; } html, body { width: 100%; max-width: 100%; overflow-x: hidden; scroll-behavior: smooth; background: #0d1f4e; color: #fff; margin: 0; padding: 0; scrollbar-width: thin; scrollbar-color: rgba(91,164,207,0.4) transparent; } #root { width: 100%; background: #0d1f4e; }
        body { background: #0d1f4e; }
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes marqueeR { from { transform: translateX(-50%); } to { transform: translateX(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        ::selection { background: #5ba4cf; color: #fff; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0d1f4e; }
        ::-webkit-scrollbar-thumb { background: #5ba4cf; border-radius: 3px; }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
        }
        @media (max-width: 600px) {
          .vendor-form-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
      {page === "home" && <LandingPage setPage={handleSetPage} />}
      {page === "vendor" && <VendorPage setPage={handleSetPage} />}
      {page === "privacy" && <PrivacyPage setPage={handleSetPage} />}
      {page === "terms" && <TermsPage setPage={handleSetPage} />}
      {page === "refunds" && <RefundsPage setPage={handleSetPage} />}
      {page === "contact" && <ContactPage setPage={handleSetPage} />}
    </>
  );
}