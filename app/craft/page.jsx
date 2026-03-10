"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";

const ParticleBackground = dynamic(
  () => import("@/components/ParticleBackground"),
  { ssr: false, loading: () => null }
);

// ─── Scroll-reveal hook ───────────────────────────────────────────────────────
function useReveal(delay = 0) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let timer;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          timer = setTimeout(() => setVisible(true), delay);
          obs.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    obs.observe(el);
    return () => { obs.disconnect(); clearTimeout(timer); };
  }, []);
  return { ref, visible };
}

function Rule() {
  return <div style={{ height: "1px", background: "linear-gradient(to right, transparent, rgba(255,255,255,0.07), transparent)" }} />;
}

function SecLabel({ text, color = "rgba(100,160,255,0.65)" }) {
  return <p style={{ fontSize: "9px", letterSpacing: "0.55em", textTransform: "uppercase", color, marginBottom: "14px" }}>{text}</p>;
}

function FeatureItem({ icon, title, desc, delay = 0 }) {
  const { ref, visible } = useReveal(delay);
  return (
    <div ref={ref} style={{ display: "flex", gap: "16px", alignItems: "flex-start", opacity: visible ? 1 : 0, transform: visible ? "translateX(0)" : "translateX(-20px)", transition: "opacity 0.5s ease, transform 0.5s ease" }}>
      <div style={{ width: "40px", height: "40px", flexShrink: 0, background: "rgba(100,140,255,0.10)", border: "1px solid rgba(100,140,255,0.25)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>{icon}</div>
      <div>
        <h4 style={{ fontSize: "14px", fontWeight: 600, color: "#e8e8f0", marginBottom: "4px" }}>{title}</h4>
        <p style={{ fontSize: "12.5px", color: "rgba(255,255,255,0.40)", lineHeight: 1.75, margin: 0 }}>{desc}</p>
      </div>
    </div>
  );
}

function Counter({ target, suffix = "", label }) {
  const { ref, visible } = useReveal(0);
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const step = Math.ceil(target / 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 20);
    return () => clearInterval(timer);
  }, [visible, target]);
  return (
    <div ref={ref} style={{ textAlign: "center", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)", transition: "opacity 0.6s ease, transform 0.6s ease" }}>
      <div style={{ fontSize: "clamp(2rem,5vw,3.2rem)", fontWeight: 700, color: "#c8d8f8", lineHeight: 1, fontFamily: "Freight, serif" }}>{count}{suffix}</div>
      <div style={{ fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginTop: "8px" }}>{label}</div>
    </div>
  );
}

function FounderCounter() {
  const TOTAL = 100;
  const [claimed, setClaimed] = useState(63);
  useEffect(() => {
    const id = setInterval(() => {
      if (Math.random() < 0.15) setClaimed(p => Math.min(TOTAL, p + 1));
    }, 8000);
    return () => clearInterval(id);
  }, []);
  const pct = (claimed / TOTAL) * 100;
  return (
    <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: "16px", padding: "24px 28px", textAlign: "center", maxWidth: "400px", margin: "0 auto" }}>
      <p style={{ fontSize: "10px", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(255,215,0,0.65)", marginBottom: "12px" }}>First 100 Founders</p>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "10px" }}>
        <span style={{ fontSize: "clamp(2rem,5vw,3rem)", fontWeight: 700, color: "#f0c040", lineHeight: 1 }}>{claimed}</span>
        <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.35)" }}>/ {TOTAL} claimed</span>
      </div>
      <div style={{ height: "4px", background: "rgba(255,255,255,0.08)", borderRadius: "99px", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg,#f0c040,#fde68a)", borderRadius: "99px", transition: "width 1.2s ease", boxShadow: "0 0 8px rgba(240,192,64,0.5)" }} />
      </div>
      <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.36)", marginTop: "10px" }}>{TOTAL - claimed} spots remaining</p>
    </div>
  );
}

function TeamCard({ name, role, image, delay = 0 }) {
  const { ref, visible } = useReveal(delay);
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(28px)", transition: "opacity 0.6s ease, transform 0.6s ease" }}>
      <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(192,192,192,0.15)", borderRadius: "16px", padding: "32px 24px", textAlign: "center", transition: "border-color 0.3s, box-shadow 0.3s" }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(192,192,192,0.40)"; e.currentTarget.style.boxShadow = "0 0 28px rgba(192,192,192,0.08)"; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(192,192,192,0.15)"; e.currentTarget.style.boxShadow = "none"; }}>
        <div style={{ position: "relative", width: "90px", height: "90px", borderRadius: "50%", overflow: "hidden", margin: "0 auto 18px", border: "2px solid rgba(192,192,192,0.25)" }}>
          <Image src={image} alt={name} fill className="object-cover" />
        </div>
        <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#f0f0f0", marginBottom: "5px" }}>{name}</h3>
        <p style={{ fontSize: "11px", color: "rgba(192,192,192,0.65)", letterSpacing: "0.06em", lineHeight: 1.6 }}>{role}</p>
      </div>
    </div>
  );
}

function ReferralSection() {
  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  const [copied, setCopied] = useState(false);
  const generate = () => {
    if (!name.trim()) return;
    const slug = encodeURIComponent(name.trim().toLowerCase().replace(/\s+/g, "-"));
    setLink(`https://shafee05.vercel.app/craft?ref=${slug}`);
    setCopied(false);
  };
  const copy = () => navigator.clipboard.writeText(link).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2500); });
  return (
    <div style={{ background: "rgba(100,140,255,0.05)", border: "1px solid rgba(100,140,255,0.16)", borderRadius: "20px", padding: "clamp(24px,5vw,36px)", maxWidth: "560px", margin: "0 auto" }}>
      <SecLabel text="Refer & Share" />
      <h3 className="font-freight" style={{ fontSize: "clamp(1.4rem,3vw,1.9rem)", fontWeight: 300, color: "#f0f0f0", marginBottom: "8px" }}>Know Someone Who Should Join?</h3>
      <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.40)", lineHeight: 1.8, marginBottom: "22px" }}>Generate your referral link and share the XAFAM vision with your network.</p>
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" onKeyDown={e => e.key === "Enter" && generate()}
          style={{ flex: "1 1 180px", boxSizing: "border-box", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "10px", padding: "11px 15px", color: "#f0f0f0", fontSize: "13px", outline: "none", minWidth: 0 }}
          onFocus={e => e.target.style.borderColor = "rgba(100,160,255,0.5)"}
          onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.12)"} />
        <button onClick={generate} style={{ background: "rgba(100,160,255,0.14)", border: "1px solid rgba(100,160,255,0.28)", color: "#a8c8ff", borderRadius: "10px", padding: "11px 18px", fontSize: "12px", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", transition: "background 0.2s" }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(100,160,255,0.24)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(100,160,255,0.14)"}>Generate</button>
      </div>
      {link && (
        <div style={{ marginTop: "14px", display: "flex", alignItems: "center", gap: "10px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: "10px", padding: "11px 14px" }}>
          <span style={{ flex: 1, fontSize: "11px", color: "rgba(255,255,255,0.45)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{link}</span>
          <button onClick={copy} style={{ background: copied ? "rgba(100,255,160,0.12)" : "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.10)", color: copied ? "#80ffaa" : "#e0e0e0", borderRadius: "8px", padding: "5px 12px", fontSize: "11px", fontWeight: 600, cursor: "pointer", flexShrink: 0, transition: "background 0.2s" }}>
            {copied ? "✓ Copied" : "Copy"}
          </button>
        </div>
      )}
    </div>
  );
}

function PinCard({ image, caption, href, delay = 0 }) {
  const { ref, visible } = useReveal(delay);
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)", transition: "opacity 0.55s ease, transform 0.55s ease" }}>
      <a href={href} target="_blank" rel="noopener noreferrer" style={{ display: "block", textDecoration: "none" }}>
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(230,0,35,0.14)", borderRadius: "16px", overflow: "hidden", transition: "transform 0.3s ease, border-color 0.3s, box-shadow 0.3s" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(230,0,35,0.38)"; e.currentTarget.style.boxShadow = "0 0 24px rgba(230,0,35,0.10)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(230,0,35,0.14)"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}>
          <div style={{ position: "relative", height: "200px", overflow: "hidden" }}>
            <Image src={image} alt={caption} fill style={{ objectFit: "cover", opacity: 0.75 }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(2,4,14,0.85) 0%, transparent 55%)" }} />
            <div style={{ position: "absolute", top: "12px", right: "12px", width: "24px", height: "24px", background: "rgba(230,0,35,0.75)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
              </svg>
            </div>
          </div>
          <div style={{ padding: "14px 16px" }}>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.50)", lineHeight: 1.65, margin: 0 }}>{caption}</p>
          </div>
        </div>
      </a>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function CraftPage() {
  const [locked, setLocked] = useState(true);
  const heroRef = useRef(null);
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setHeroVisible(true); obs.disconnect(); } }, { threshold: 0.08 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const pins = [
    { image: "/images/pin1.jpg", caption: "Dark minimalism & productivity aesthetics", href: "https://in.pinterest.com/SHAd0wo5/" },
    { image: "/images/pin2.jpg", caption: "AI-generated art experiments & visual ideas", href: "https://in.pinterest.com/SHAd0wo5/" },
    { image: "/images/pin3.jpg", caption: "Design references & curated inspiration boards", href: "https://in.pinterest.com/SHAd0wo5/" },
  ];

  return (
    <>
      <ParticleBackground />
      <div style={{ position: "fixed", inset: 0, background: "rgba(8,8,16,0.86)", zIndex: 0, pointerEvents: "none" }} />

      <main style={{ position: "relative", zIndex: 1, color: "#f0f0f0", overflowX: "hidden", width: "100%", boxSizing: "border-box" }}>

        {/* ── HERO ──────────────────────────────────────────────────────── */}
        <section style={{ minHeight: "100vh", minHeight: "100dvh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "clamp(120px,20vw,160px) clamp(20px,6vw,80px) 80px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "40%", left: "50%", transform: "translate(-50%,-50%)", width: "min(800px,90vw)", height: "400px", background: "radial-gradient(ellipse, rgba(40,60,180,0.14) 0%, transparent 65%)", pointerEvents: "none" }} />
          {[500, 700, 900].map((size, i) => (
            <div key={i} style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: `min(${size}px,${68+i*6}vw)`, height: `min(${size}px,${68+i*6}vw)`, border: `1px solid rgba(255,255,255,${0.04 - i*0.01})`, borderRadius: "50%", pointerEvents: "none" }} />
          ))}

          <div ref={heroRef} style={{ position: "relative", zIndex: 2, maxWidth: "720px", opacity: heroVisible ? 1 : 0, transform: heroVisible ? "translateY(0)" : "translateY(32px)", transition: "opacity 1s ease, transform 1s ease" }}>
            <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: "28px" }}>
              <div style={{ width: "72px", height: "72px", position: "relative", filter: "drop-shadow(0 0 20px rgba(100,140,255,0.4))" }}>
                <Image src="/svg/xafamlogo.svg" alt="XAFAM" fill className="object-contain" />
              </div>
            </div>

            <SecLabel text="The Vision · The Craft · The Motion" color="rgba(100,160,255,0.72)" />

            <h1 className="font-freight" style={{ fontSize: "clamp(3.5rem,9vw,7.5rem)", fontWeight: 300, lineHeight: 0.92, color: "#f0f0f0", marginBottom: "18px", letterSpacing: "-0.02em" }}>
              Craft
            </h1>

            <p style={{ fontSize: "clamp(12px,2vw,15px)", letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(192,192,192,0.55)", marginBottom: "28px" }}>
              Where Exclusivity Meets Innovation
            </p>

            <p style={{ fontSize: "clamp(14px,2vw,17px)", color: "rgba(255,255,255,0.42)", lineHeight: 1.85, marginBottom: "40px" }}>
              Everything I'm building beyond the résumé — a global brand, a visual identity, real job opportunities, and creations that live at the intersection of technology and style.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "10px" }}>
              {[{ label: "↓ XAFAM Vision", href: "#xafam" }, { label: "↓ Pinterest", href: "#pinterest" }, { label: "↓ Remote Jobs", href: "#jobs" }].map(({ label, href }) => (
                <a key={href} href={href} style={{ display: "inline-block", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.50)", borderRadius: "99px", padding: "9px 20px", fontSize: "10px", letterSpacing: "0.1em", textDecoration: "none", transition: "background 0.2s, color 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.10)"; e.currentTarget.style.color = "rgba(255,255,255,0.90)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "rgba(255,255,255,0.50)"; }}>
                  {label}
                </a>
              ))}
            </div>
          </div>

          <div style={{ position: "absolute", bottom: "28px", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", opacity: 0.3, animation: "bob 2.2s ease-in-out infinite" }}>
            <span style={{ fontSize: "9px", letterSpacing: "0.3em", textTransform: "uppercase" }}>scroll</span>
            <div style={{ width: "1px", height: "28px", background: "rgba(255,255,255,0.5)" }} />
          </div>
          <style>{`
            @keyframes bob { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(6px)} }
            @keyframes pulse { 0%,100%{opacity:0.6} 50%{opacity:1} }
          `}</style>
        </section>

        <Rule />

        {/* ── XAFAM MISSION ──────────────────────────────────────────────── */}
        <section id="xafam" style={{ padding: "90px clamp(20px,5vw,60px)", width: "100%", boxSizing: "border-box" }}>
          <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(340px,100%), 1fr))", gap: "60px", alignItems: "center" }}>
              {(() => { const { ref, visible } = useReveal(0); return (
                <div ref={ref} style={{ opacity: visible?1:0, transform: visible?"translateX(0)":"translateX(-28px)", transition: "opacity 0.7s ease, transform 0.7s ease" }}>
                  <SecLabel text="The Vision" color="rgba(255,215,0,0.55)" />
                  <h2 className="font-freight" style={{ fontSize: "clamp(2.2rem,5vw,4rem)", fontWeight: 300, lineHeight: 0.95, color: "#f0f0f0", marginBottom: "20px", letterSpacing: "-0.01em" }}>XAFAM</h2>
                  <p style={{ fontSize: "clamp(12px,2vw,15px)", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(192,192,192,0.50)", marginBottom: "24px" }}>Where Exclusivity Meets Innovation</p>
                  <p style={{ fontSize: "14.5px", color: "rgba(255,255,255,0.44)", lineHeight: 1.9, marginBottom: "18px" }}>
                    XAFAM is more than a brand — it's a movement to redefine personal expression through innovation, quality, and authenticity. Starting with exclusive apparel, expanding into a global statement.
                  </p>
                  <p style={{ fontSize: "14.5px", color: "rgba(255,255,255,0.44)", lineHeight: 1.9, marginBottom: "32px" }}>
                    Driven by passion for AI and data science, XAFAM blends fashion with cutting-edge technology. Built by Shafee, Md Mehboob, and Arman Rai — crafted for the generation that refuses to settle.
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                    <a href="https://forms.gle/7bDtHXy1fCqBNYC19" target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", background: "rgba(255,215,0,0.12)", border: "1px solid rgba(255,215,0,0.32)", color: "#fde68a", borderRadius: "99px", padding: "12px 26px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none", transition: "background 0.2s, transform 0.2s" }}
                      onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,215,0,0.22)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,215,0,0.12)"; e.currentTarget.style.transform = "translateY(0)"; }}>✦ Be Among the First 100</a>
                    <a href="https://www.instagram.com/xafamofficial" target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.55)", borderRadius: "99px", padding: "12px 22px", fontSize: "11px", letterSpacing: "0.06em", textDecoration: "none", transition: "background 0.2s" }}
                      onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.10)"}
                      onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}>Instagram ↗</a>
                  </div>
                </div>
              ); })()}
              {(() => { const { ref, visible } = useReveal(120); return (
                <div ref={ref} style={{ opacity: visible?1:0, transform: visible?"translateX(0)":"translateX(28px)", transition: "opacity 0.7s ease, transform 0.7s ease", display: "flex", flexDirection: "column", gap: "24px" }}>
                  <FounderCounter />
                  <FeatureItem delay={0}   icon="👑" title="Premium Quality"     desc="Every piece crafted to exceed expectations — from stitching to finish." />
                  <FeatureItem delay={80}  icon="⚡" title="Tech-Infused Design" desc="Where data science meets fashion — intelligent products for Gen Z." />
                  <FeatureItem delay={160} icon="🌍" title="Global Reach"        desc="Starting in Hyderabad, building a brand that resonates worldwide." />
                  <FeatureItem delay={240} icon="🎯" title="Exclusive Access"    desc="Limited drops, first-100 founders programme, community-driven launches." />
                </div>
              ); })()}
            </div>
          </div>
        </section>

        {/* ── NUMBERS ──────────────────────────────────────────────────── */}
        {(() => { const { ref, visible } = useReveal(0); return (
          <section ref={ref} style={{ padding: "80px clamp(20px,5vw,60px)", background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)", width: "100%", boxSizing: "border-box", opacity: visible?1:0, transform: visible?"translateY(0)":"translateY(20px)", transition: "opacity 0.6s ease, transform 0.6s ease" }}>
            <div style={{ maxWidth: "800px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px,1fr))", gap: "40px" }}>
              <Counter target={100} suffix="+" label="Founder Spots" />
              <Counter target={3} suffix="" label="Co-Founders" />
              <Counter target={2025} suffix="" label="Launch Year" />
              <Counter target={1} suffix=" 🌙" label="Mission" />
            </div>
          </section>
        ); })()}

        <Rule />

        {/* ── LOCKED: BRAND DETAIL + TEAM ────────────────────────────────── */}
        <div style={{ position: "relative" }}>
          {locked && (
            <div style={{ position: "absolute", inset: 0, zIndex: 20, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(8,8,16,0.76)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", textAlign: "center", padding: "20px", boxSizing: "border-box", minHeight: "360px" }}>
              <div style={{ fontSize: "46px", marginBottom: "22px", filter: "drop-shadow(0 0 16px rgba(255,215,0,0.3))" }}>🔒</div>
              <h2 className="font-freight" style={{ fontSize: "clamp(1.9rem,5vw,3.8rem)", fontWeight: 300, color: "#f0f0f0", marginBottom: "14px", maxWidth: "560px" }}>The Future Belongs to the Few</h2>
              <p style={{ fontSize: "clamp(12px,2vw,15px)", color: "rgba(255,255,255,0.42)", maxWidth: "480px", lineHeight: 1.8, marginBottom: "32px" }}>What you're looking for is not yet ready for the world.<br />But for the first 100 who step forward, the doors open sooner.</p>
              <a href="https://forms.gle/7bDtHXy1fCqBNYC19" target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", background: "rgba(255,255,255,0.92)", color: "#0a0a14", borderRadius: "99px", padding: "14px 36px", fontSize: "12px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none" }}>
                Be Among the First 100
              </a>
              <button onClick={() => setLocked(false)} style={{ position: "absolute", bottom: 16, right: 16, width: 60, height: 60, opacity: 0, background: "none", border: "none", cursor: "pointer" }} aria-label="Unlock" />
            </div>
          )}
          {!locked && <button onClick={() => setLocked(true)} style={{ position: "absolute", bottom: 16, right: 16, zIndex: 30, width: 60, height: 60, opacity: 0, background: "none", border: "none", cursor: "pointer" }} aria-label="Lock" />}

          <section style={{ padding: "100px clamp(20px,5vw,60px)", position: "relative", overflow: "hidden", opacity: locked?0.2:1, pointerEvents: locked?"none":"auto", transition: "opacity 0.5s ease", width: "100%", boxSizing: "border-box", background: "rgba(10,20,60,0.35)", borderTop: "1px solid rgba(100,120,255,0.10)" }}>
            <div style={{ position: "absolute", inset: 0, zIndex: 0, opacity: 0.06 }}>
              <Image src="/images/xafam2.jpg" alt="XAFAM background" fill className="object-cover" />
            </div>
            <div style={{ maxWidth: "1000px", margin: "0 auto", position: "relative", zIndex: 1 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(380px,100%), 1fr))", gap: "60px", alignItems: "center" }}>
                <div>
                  <SecLabel text="The Brand" />
                  <h2 className="font-freight" style={{ fontSize: "clamp(2rem,4vw,3.2rem)", fontWeight: 300, lineHeight: 1.1, color: "#f0f0f0", marginBottom: "24px" }}>Vision — XAFAM</h2>
                  <p style={{ fontSize: "14.5px", color: "rgba(255,255,255,0.48)", lineHeight: 1.9, marginBottom: "18px" }}>XAFAM is a premium lifestyle brand crafted by Shafee, Md Mehboob, and Arman Rai — designed for Gen Z and those who dare to stand out.</p>
                  <p style={{ fontSize: "14.5px", color: "rgba(255,255,255,0.48)", lineHeight: 1.9, marginBottom: "28px" }}>Our journey begins with high-quality hoodies across normal and premium collections — setting the stage for a global fashion revolution.</p>
                  <div style={{ display: "inline-block", background: "rgba(100,160,255,0.08)", border: "1px solid rgba(100,160,255,0.25)", borderRadius: "8px", padding: "14px 20px", fontSize: "13px", color: "rgba(100,180,255,0.8)", fontStyle: "italic" }}>
                    "Pre-order now, share your vision, or invest in our future — together, we'll redefine what's possible."
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                  <div style={{ position: "relative", width: "min(320px,80vw)", height: "min(320px,80vw)", filter: "drop-shadow(0 0 40px rgba(100,140,255,0.3))" }}>
                    <Image src="/svg/xafamlogo.svg" alt="XAFAM Logo" fill className="object-contain" />
                  </div>
                  <div style={{ position: "absolute", bottom: "8px", left: "50%", transform: "translateX(-50%)", background: "rgba(255,215,0,0.12)", border: "1px solid rgba(255,215,0,0.35)", borderRadius: "99px", padding: "6px 18px", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#fde68a", animation: "pulse 2.2s ease-in-out infinite" }}>
                    Coming Soon
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section style={{ padding: "90px clamp(20px,5vw,60px)", opacity: locked?0.2:1, pointerEvents: locked?"none":"auto", transition: "opacity 0.5s ease", width: "100%", boxSizing: "border-box", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
              <div style={{ textAlign: "center", marginBottom: "60px" }}>
                <SecLabel text="The People" />
                <h2 className="font-freight" style={{ fontSize: "clamp(2rem,4vw,3.2rem)", fontWeight: 300, color: "#f0f0f0" }}>Meet the Visionaries Behind XAFAM</h2>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(260px,100%), 1fr))", gap: "20px" }}>
                <TeamCard delay={0}   name="Shafee"     role="CEO & Brand / Marketing Head"            image="/images/shafee.jpg" />
                <TeamCard delay={100} name="Md Mehboob" role="Co-Founder & Operations / Logistics Head" image="/images/mehboob.jpg" />
                <TeamCard delay={200} name="Arman Rai"  role="Co-Founder & Creative Head"              image="/images/arman.jpg" />
              </div>
            </div>
          </section>
        </div>

        <Rule />

        {/* ── REFERRAL ─────────────────────────────────────────────────── */}
        {(() => { const { ref, visible } = useReveal(0); return (
          <section ref={ref} style={{ padding: "90px clamp(20px,5vw,60px)", width: "100%", boxSizing: "border-box", opacity: visible?1:0, transform: visible?"translateY(0)":"translateY(20px)", transition: "opacity 0.7s ease, transform 0.7s ease" }}>
            <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
              <div style={{ textAlign: "center", marginBottom: "48px" }}>
                <SecLabel text="Spread the Vision" />
                <h2 className="font-freight" style={{ fontSize: "clamp(1.9rem,4vw,3rem)", fontWeight: 300, color: "#f0f0f0", marginBottom: "12px" }}>Bring a Founder In</h2>
                <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.38)", maxWidth: "480px", margin: "0 auto", lineHeight: 1.8 }}>Generate your personal referral link and share the XAFAM story with people who deserve to be part of it.</p>
              </div>
              <ReferralSection />
            </div>
          </section>
        ); })()}

        <Rule />

        {/* ── PINTEREST ──────────────────────────────────────────────────── */}
        {(() => { const { ref, visible } = useReveal(0); return (
          <section id="pinterest" ref={ref} style={{ padding: "90px clamp(20px,5vw,60px)", width: "100%", boxSizing: "border-box", opacity: visible?1:0, transform: visible?"translateY(0)":"translateY(20px)", transition: "opacity 0.7s ease, transform 0.7s ease" }}>
            <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: "20px", marginBottom: "36px" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "9px", marginBottom: "10px" }}>
                    <div style={{ width: "22px", height: "22px", background: "rgba(230,0,35,0.78)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="white"><path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>
                    </div>
                    <p style={{ fontSize: "9px", letterSpacing: "0.55em", textTransform: "uppercase", color: "rgba(230,80,80,0.75)", margin: 0 }}>Pinterest</p>
                  </div>
                  <h2 className="font-freight" style={{ fontSize: "clamp(2rem,4vw,3.2rem)", fontWeight: 300, color: "#f0f0f0", marginBottom: "10px" }}>Visual Journal</h2>
                  <p style={{ fontSize: "13.5px", color: "rgba(255,255,255,0.38)", lineHeight: 1.8, maxWidth: "440px" }}>Aesthetics, ideas, and references I collect — from dark minimalism to AI art experiments. Updated regularly.</p>
                </div>
                <a href="https://in.pinterest.com/SHAd0wo5/" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(230,0,35,0.10)", border: "1px solid rgba(230,0,35,0.28)", color: "rgba(255,140,140,0.85)", borderRadius: "99px", padding: "11px 22px", fontSize: "11px", fontWeight: 600, letterSpacing: "0.06em", textDecoration: "none", whiteSpace: "nowrap", transition: "background 0.2s, transform 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(230,0,35,0.20)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(230,0,35,0.10)"; e.currentTarget.style.transform = "translateY(0)"; }}>
                  Follow on Pinterest ↗
                </a>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(260px,100%), 1fr))", gap: "14px", marginBottom: "20px" }}>
                {pins.map((pin, i) => <PinCard key={i} {...pin} delay={i * 80} />)}
              </div>
            </div>
          </section>
        ); })()}

        <Rule />

        {/* ── REMOTE JOBS ────────────────────────────────────────────────── */}
        {(() => { const { ref, visible } = useReveal(0); return (
          <section id="jobs" ref={ref} style={{ padding: "90px clamp(20px,5vw,60px)", background: "rgba(255,255,255,0.015)", width: "100%", boxSizing: "border-box", opacity: visible?1:0, transform: visible?"translateY(0)":"translateY(20px)", transition: "opacity 0.7s ease, transform 0.7s ease" }}>
            <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(320px,100%), 1fr))", gap: "60px", alignItems: "center" }}>
                <div>
                  <SecLabel text="Curated Opportunities" color="rgba(100,200,130,0.65)" />
                  <h2 className="font-freight" style={{ fontSize: "clamp(2rem,4vw,3.2rem)", fontWeight: 300, color: "#f0f0f0", lineHeight: 1.1, marginBottom: "18px" }}>
                    Vetted Remote<br /><span style={{ color: "rgba(100,200,130,0.85)" }}>Job Opportunities</span>
                  </h2>
                  <p style={{ fontSize: "14.5px", color: "rgba(255,255,255,0.44)", lineHeight: 1.9, marginBottom: "20px" }}>I handpick and curate the best remote roles in AI, Data Science, and Tech. Real opportunities with fair pay — verified and updated regularly.</p>
                  <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.36)", lineHeight: 1.85, marginBottom: "32px" }}>If you're a student, a fresher, or a professional looking to break into remote work — this board is built for you. No noise. Just real opportunities.</p>
                  <a href="https://shafee05.github.io/Jobs-for-you/" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "9px", background: "rgba(100,200,130,0.12)", border: "1px solid rgba(100,200,130,0.32)", color: "rgba(140,230,160,0.90)", borderRadius: "99px", padding: "14px 30px", fontSize: "12px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", textDecoration: "none", transition: "background 0.2s, transform 0.2s" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(100,200,130,0.22)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(100,200,130,0.12)"; e.currentTarget.style.transform = "translateY(0)"; }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
                    Browse Opportunities →
                  </a>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {[
                    { icon: "🤖", label: "AI & Machine Learning", desc: "LLM, NLP, Computer Vision — remote roles worldwide" },
                    { icon: "📊", label: "Data Science & Analytics", desc: "Python, SQL, Power BI — entry to senior level" },
                    { icon: "💻", label: "Full-Stack & Web Dev", desc: "React, Next.js, Node — freelance to full-time" },
                    { icon: "🌍", label: "Fully Remote · Global", desc: "All roles are location-independent, many pay in USD" },
                  ].map(({ icon, label, desc }, i) => {
                    const { ref: r, visible: v } = useReveal(i * 60);
                    return (
                      <div key={label} ref={r} style={{ display: "flex", gap: "14px", alignItems: "flex-start", opacity: v?1:0, transform: v?"translateX(0)":"translateX(20px)", transition: "opacity 0.5s ease, transform 0.5s ease" }}>
                        <div style={{ width: "38px", height: "38px", flexShrink: 0, background: "rgba(100,200,130,0.08)", border: "1px solid rgba(100,200,130,0.18)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "17px" }}>{icon}</div>
                        <div>
                          <p style={{ fontSize: "13px", fontWeight: 600, color: "#dde8ee", marginBottom: "2px" }}>{label}</p>
                          <p style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.35)", lineHeight: 1.65, margin: 0 }}>{desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        ); })()}

        <Rule />

        {/* ── FINAL CTA ──────────────────────────────────────────────────── */}
        {(() => { const { ref, visible } = useReveal(0); return (
          <section ref={ref} style={{ padding: "90px clamp(20px,5vw,60px)", textAlign: "center", background: "rgba(0,50,150,0.06)", borderTop: "1px solid rgba(0,80,200,0.12)", width: "100%", boxSizing: "border-box", opacity: visible?1:0, transform: visible?"translateY(0)":"translateY(20px)", transition: "opacity 0.7s ease, transform 0.7s ease" }}>
            <div style={{ maxWidth: "580px", margin: "0 auto" }}>
              <div style={{ fontSize: "40px", marginBottom: "20px", filter: "drop-shadow(0 0 12px rgba(255,215,0,0.3))" }}>✦</div>
              <h2 className="font-freight" style={{ fontSize: "clamp(1.8rem,4vw,3rem)", fontWeight: 300, color: "#f0f0f0", marginBottom: "16px" }}>Join the First 100</h2>
              <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.40)", lineHeight: 1.85, marginBottom: "40px" }}>Be part of something bigger. Exclusive access, founder pricing, and first-hand impact on the brand's direction — for the 100 who believe first.</p>
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "12px" }}>
                <a href="https://forms.gle/7bDtHXy1fCqBNYC19" target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", background: "rgba(255,255,255,0.92)", color: "#0a0a14", borderRadius: "99px", padding: "14px 36px", fontSize: "12px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", textDecoration: "none", transition: "background 0.25s, transform 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.92)"; e.currentTarget.style.transform = "translateY(0)"; }}>Apply Now →</a>
                <a href="mailto:xafamofficial2025@gmail.com" style={{ display: "inline-block", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.14)", borderRadius: "99px", padding: "14px 28px", fontSize: "12px", color: "#e0e0e0", letterSpacing: "0.04em", textDecoration: "none", transition: "background 0.25s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.10)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}>Get in Touch</a>
              </div>
            </div>
          </section>
        ); })()}

      </main>
    </>
  );
}
