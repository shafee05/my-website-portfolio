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
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => { obs.disconnect(); clearTimeout(timer); };
  }, [delay]);
  return { ref, visible };
}

// ─── Animated counter ────────────────────────────────────────────────────────
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
      <div style={{ fontSize: "clamp(2.2rem, 5vw, 3.5rem)", fontWeight: 700, color: "#c8d8f8", lineHeight: 1, fontFamily: "Freight, serif" }}>
        {count}{suffix}
      </div>
      <div style={{ fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.38)", marginTop: "8px" }}>
        {label}
      </div>
    </div>
  );
}

// ─── Live Founder Spots Counter ───────────────────────────────────────────────
function FounderCounter() {
  const TOTAL = 100;
  // Simulate: start at 63 and randomly tick up occasionally
  const [claimed, setClaimed] = useState(63);

  useEffect(() => {
    const tick = () => {
      const shouldTick = Math.random() < 0.15; // 15% chance per 8s
      if (shouldTick) setClaimed(p => Math.min(TOTAL, p + 1));
    };
    const id = setInterval(tick, 8000);
    return () => clearInterval(id);
  }, []);

  const pct = (claimed / TOTAL) * 100;

  return (
    <div style={{
      background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "16px", padding: "24px 28px", textAlign: "center", maxWidth: "400px", margin: "0 auto",
    }}>
      <p style={{ fontSize: "10px", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(255,215,0,0.65)", marginBottom: "12px" }}>
        First 100 Founders
      </p>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "10px" }}>
        <span style={{ fontSize: "clamp(2rem,5vw,3rem)", fontWeight: 700, color: "#f0c040", lineHeight: 1 }}>{claimed}</span>
        <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.35)" }}>/ {TOTAL} claimed</span>
      </div>
      {/* Progress bar */}
      <div style={{ height: "4px", background: "rgba(255,255,255,0.08)", borderRadius: "99px", overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${pct}%`,
          background: "linear-gradient(90deg, #f0c040, #fde68a)",
          borderRadius: "99px",
          transition: "width 1.2s ease",
          boxShadow: "0 0 8px rgba(240,192,64,0.5)",
        }} />
      </div>
      <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.38)", marginTop: "10px" }}>
        {TOTAL - claimed} spots remaining
      </p>
    </div>
  );
}

// ─── Referral Link Generator ──────────────────────────────────────────────────
function ReferralSection() {
  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = () => {
    if (!name.trim()) return;
    const slug = encodeURIComponent(name.trim().toLowerCase().replace(/\s+/g, "-"));
    setLink(`https://shafee05.vercel.app/asset?ref=${slug}`);
    setCopied(false);
  };

  const copy = () => {
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div style={{
      background: "rgba(100,140,255,0.06)", border: "1px solid rgba(100,140,255,0.18)",
      borderRadius: "20px", padding: "clamp(24px,5vw,40px)", maxWidth: "560px", margin: "0 auto",
    }}>
      <p style={{ fontSize: "9px", letterSpacing: "0.5em", textTransform: "uppercase", color: "rgba(100,160,255,0.65)", marginBottom: "10px" }}>Refer & Share</p>
      <h3 className="font-freight" style={{ fontSize: "clamp(1.4rem,3vw,2rem)", fontWeight: 300, color: "#f0f0f0", marginBottom: "8px" }}>
        Know Someone Who Should Join?
      </h3>
      <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.42)", lineHeight: 1.8, marginBottom: "24px" }}>
        Generate your personal referral link and share the XAFAM vision with your network.
      </p>

      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Your name"
          onKeyDown={e => e.key === "Enter" && generate()}
          style={{
            flex: "1 1 180px", boxSizing: "border-box",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "10px", padding: "12px 16px",
            color: "#f0f0f0", fontSize: "13px", outline: "none",
            minWidth: 0,
          }}
          onFocus={e => e.target.style.borderColor = "rgba(100,160,255,0.5)"}
          onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.12)"}
        />
        <button
          onClick={generate}
          style={{
            background: "rgba(100,160,255,0.15)", border: "1px solid rgba(100,160,255,0.3)",
            color: "#a8c8ff", borderRadius: "10px", padding: "12px 20px",
            fontSize: "13px", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
            transition: "background 0.2s",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(100,160,255,0.25)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(100,160,255,0.15)"}
        >
          Generate Link
        </button>
      </div>

      {link && (
        <div style={{ marginTop: "16px" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: "10px",
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "10px", padding: "12px 16px",
          }}>
            <span style={{ flex: 1, fontSize: "12px", color: "rgba(255,255,255,0.5)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{link}</span>
            <button
              onClick={copy}
              style={{
                background: copied ? "rgba(100,255,160,0.15)" : "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: copied ? "#80ffaa" : "#e0e0e0",
                borderRadius: "8px", padding: "6px 14px",
                fontSize: "11px", fontWeight: 600, cursor: "pointer", flexShrink: 0,
                transition: "background 0.2s, color 0.2s",
              }}
            >
              {copied ? "✓ Copied!" : "Copy"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Team member card ─────────────────────────────────────────────────────────
function TeamCard({ name, role, image, delay }) {
  const { ref, visible } = useReveal(delay);
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(28px)", transition: "opacity 0.6s ease, transform 0.6s ease" }}>
      <div
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(192,192,192,0.18)", borderRadius: "16px", padding: "32px 24px", textAlign: "center", transition: "border-color 0.3s, background 0.3s, box-shadow 0.3s" }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(192,192,192,0.45)"; e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.boxShadow = "0 0 30px rgba(192,192,192,0.1)"; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(192,192,192,0.18)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.boxShadow = "none"; }}
      >
        <div style={{ position: "relative", width: "100px", height: "100px", borderRadius: "50%", overflow: "hidden", margin: "0 auto 20px", border: "2px solid rgba(192,192,192,0.3)", boxShadow: "0 0 20px rgba(192,192,192,0.12)" }}>
          <Image src={image} alt={name} fill className="object-cover" />
        </div>
        <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#f0f0f0", marginBottom: "6px" }}>{name}</h3>
        <p style={{ fontSize: "12px", color: "rgba(192,192,192,0.75)", letterSpacing: "0.08em", lineHeight: 1.6 }}>{role}</p>
      </div>
    </div>
  );
}

// ─── Feature item ─────────────────────────────────────────────────────────────
function FeatureItem({ icon, title, desc, delay }) {
  const { ref, visible } = useReveal(delay);
  return (
    <div ref={ref} style={{ display: "flex", gap: "16px", alignItems: "flex-start", opacity: visible ? 1 : 0, transform: visible ? "translateX(0)" : "translateX(-20px)", transition: "opacity 0.5s ease, transform 0.5s ease" }}>
      <div style={{ width: "40px", height: "40px", flexShrink: 0, background: "rgba(100,140,255,0.12)", border: "1px solid rgba(100,140,255,0.3)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>{icon}</div>
      <div>
        <h4 style={{ fontSize: "14px", fontWeight: 600, color: "#e8e8f0", marginBottom: "4px" }}>{title}</h4>
        <p style={{ fontSize: "12.5px", color: "rgba(255,255,255,0.42)", lineHeight: 1.7, margin: 0 }}>{desc}</p>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AssetPage() {
  const [locked, setLocked] = useState(true);
  const heroRef = useRef(null);
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setHeroVisible(true); obs.disconnect(); } }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <ParticleBackground />

      {/* Dark tint */}
      <div style={{ position: "fixed", inset: 0, background: "rgba(8,8,16,0.86)", zIndex: 0, pointerEvents: "none" }} />

      <main style={{ position: "relative", zIndex: 1, color: "#f0f0f0", overflowX: "hidden", width: "100%", boxSizing: "border-box" }}>

        {/* ── HERO ──────────────────────────────────────────────────────────── */}
        <section style={{
          minHeight: "100vh", minHeight: "100dvh",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          textAlign: "center",
          padding: "clamp(120px, 20vw, 160px) clamp(20px, 6vw, 80px) 80px",
          position: "relative", overflow: "hidden",
        }}>
          {/* Ambient glow */}
          <div style={{ position: "absolute", top: "40%", left: "50%", transform: "translate(-50%,-50%)", width: "min(800px, 90vw)", height: "400px", background: "radial-gradient(ellipse, rgba(40,60,180,0.14) 0%, transparent 65%)", pointerEvents: "none" }} />

          {/* Decorative rings */}
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "min(500px,70vw)", height: "min(500px,70vw)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: "50%", pointerEvents: "none" }} />
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "min(700px,80vw)", height: "min(700px,80vw)", border: "1px solid rgba(255,255,255,0.025)", borderRadius: "50%", pointerEvents: "none" }} />

          <div ref={heroRef} style={{ position: "relative", zIndex: 2, maxWidth: "720px", opacity: heroVisible ? 1 : 0, transform: heroVisible ? "translateY(0)" : "translateY(32px)", transition: "opacity 1s ease, transform 1s ease" }}>
            {/* Logo */}
            <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: "28px" }}>
              <div style={{ width: "80px", height: "80px", position: "relative", filter: "drop-shadow(0 0 18px rgba(100,140,255,0.4))" }}>
                <Image src="/svg/xafamlogo.svg" alt="XAFAM" fill className="object-contain" />
              </div>
            </div>

            <p style={{ fontSize: "9px", letterSpacing: "0.6em", textTransform: "uppercase", color: "rgba(100,160,255,0.7)", marginBottom: "16px" }}>
              The Vision
            </p>
            <h1 className="font-freight" style={{ fontSize: "clamp(3rem, 8vw, 7rem)", fontWeight: 300, lineHeight: 0.95, color: "#f0f0f0", marginBottom: "12px", letterSpacing: "-0.02em" }}>
              XAFAM
            </h1>
            <p style={{ fontSize: "clamp(12px, 2vw, 15px)", letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(192,192,192,0.6)", marginBottom: "28px" }}>
              Where Exclusivity Meets Innovation
            </p>
            <p style={{ fontSize: "clamp(14px, 2vw, 17px)", color: "rgba(255,255,255,0.42)", lineHeight: 1.85, marginBottom: "36px" }}>
              Shaping the Future of Style — a premium lifestyle brand built for those who dare to stand out. Starting with exclusive apparel, expanding into a global movement.
            </p>

            {/* Live counter */}
            <div style={{ marginBottom: "36px" }}>
              <FounderCounter />
            </div>

            {/* Exclusive badge */}
            <div style={{ display: "inline-block", background: "rgba(255,215,0,0.08)", border: "1px solid rgba(255,215,0,0.28)", borderRadius: "99px", padding: "10px 24px", marginBottom: "40px", fontSize: "13px", color: "#fde68a", letterSpacing: "0.06em" }}>
              ✦ Only 100 will get in first. Will you be one of them?
            </div>

            {/* CTAs */}
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "12px" }}>
              <a
                href="https://forms.gle/7bDtHXy1fCqBNYC19"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-block",
                  background: "rgba(255,255,255,0.92)", color: "#0a0a14",
                  borderRadius: "99px", padding: "14px 32px",
                  fontSize: "13px", fontWeight: 700,
                  letterSpacing: "0.08em", textTransform: "uppercase",
                  textDecoration: "none", boxSizing: "border-box",
                  transition: "background 0.25s, transform 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.92)"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                Be Among the First 100
              </a>
              <a
                href="https://www.instagram.com/xafamofficial"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.14)",
                  color: "#e0e0e0", borderRadius: "99px", padding: "14px 28px",
                  fontSize: "13px", letterSpacing: "0.04em", textDecoration: "none",
                  boxSizing: "border-box", transition: "background 0.25s, transform 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.11)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <div style={{ position: "relative", width: 16, height: 16, flexShrink: 0 }}>
                  <Image src="/svg/instagram.svg" alt="Instagram" fill className="object-contain" />
                </div>
                DM on Instagram
              </a>
              <a
                href="mailto:xafamofficial2025@gmail.com"
                style={{
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.14)",
                  color: "#e0e0e0", borderRadius: "99px", padding: "14px 28px",
                  fontSize: "13px", letterSpacing: "0.04em", textDecoration: "none",
                  boxSizing: "border-box", transition: "background 0.25s, transform 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.11)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <div style={{ position: "relative", width: 16, height: 16, flexShrink: 0 }}>
                  <Image src="/svg/email.svg" alt="Email" fill className="object-contain" />
                </div>
                Email Us
              </a>
            </div>
          </div>

          {/* Scroll hint */}
          <div style={{ position: "absolute", bottom: "28px", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", opacity: 0.3, animation: "bob 2.2s ease-in-out infinite" }}>
            <span style={{ fontSize: "9px", letterSpacing: "0.3em", textTransform: "uppercase" }}>scroll</span>
            <div style={{ width: "1px", height: "28px", background: "rgba(255,255,255,0.5)" }} />
          </div>
          <style>{`@keyframes bob { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(6px)} }`}</style>
        </section>

        {/* ── ABOUT / MISSION ───────────────────────────────────────────────── */}
        <section style={{ padding: "90px clamp(20px, 5vw, 60px)", borderTop: "1px solid rgba(255,255,255,0.05)", width: "100%", boxSizing: "border-box" }}>
          <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(340px,100%), 1fr))", gap: "60px", alignItems: "center" }}>
              {(() => { const { ref, visible } = useReveal(0); return (
                <div ref={ref} style={{ opacity: visible?1:0, transform: visible?"translateX(0)":"translateX(-28px)", transition: "opacity 0.7s ease, transform 0.7s ease" }}>
                  <p style={{ fontSize: "9px", letterSpacing: "0.5em", textTransform: "uppercase", color: "rgba(100,160,255,0.65)", marginBottom: "14px" }}>Our Mission</p>
                  <h2 className="font-freight" style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 300, lineHeight: 1.1, color: "#f0f0f0", marginBottom: "24px" }}>
                    Pioneering a Global<br />
                    <span style={{ color: "rgba(100,160,255,0.9)" }}>Lifestyle Brand</span>
                  </h2>
                  <p style={{ fontSize: "14.5px", color: "rgba(255,255,255,0.48)", lineHeight: 1.9, marginBottom: "20px" }}>
                    XAFAM is more than a brand — it's a movement to redefine personal expression through innovation, quality, and authenticity. Starting with exclusive apparel, we aim to set new standards in design, sustainability, and cultural impact.
                  </p>
                  <p style={{ fontSize: "14.5px", color: "rgba(255,255,255,0.48)", lineHeight: 1.9 }}>
                    Driven by passion for AI and data science, XAFAM blends fashion with cutting-edge innovation. We're building a legacy that empowers communities worldwide — where style meets substance on a global stage.
                  </p>
                </div>
              ); })()}

              {(() => { const { ref, visible } = useReveal(120); return (
                <div ref={ref} style={{ opacity: visible?1:0, transform: visible?"translateX(0)":"translateX(28px)", transition: "opacity 0.7s ease, transform 0.7s ease", display: "flex", flexDirection: "column", gap: "24px" }}>
                  <FeatureItem delay={0}   icon="👑" title="Premium Quality"       desc="Every piece crafted to exceed expectations — from stitching to finish." />
                  <FeatureItem delay={80}  icon="⚡" title="Tech-Infused Design"   desc="Where data science meets fashion — intelligent products for the next generation." />
                  <FeatureItem delay={160} icon="🌍" title="Global Reach"          desc="Starting in Hyderabad, building a brand that resonates worldwide." />
                  <FeatureItem delay={240} icon="🎯" title="Exclusive Access"      desc="Limited drops, first-100 founders programme, and community-driven launches." />
                </div>
              ); })()}
            </div>
          </div>
        </section>

        {/* ── NUMBERS ───────────────────────────────────────────────────────── */}
        <section style={{ padding: "80px clamp(20px, 5vw, 60px)", background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)", width: "100%", boxSizing: "border-box" }}>
          <div style={{ maxWidth: "800px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px,1fr))", gap: "40px" }}>
            <Counter target={100}  suffix="+"  label="Founders Spots" />
            <Counter target={3}    suffix=""   label="Co-Founders"    />
            <Counter target={2025} suffix=""   label="Launch Year"    />
            <Counter target={1}    suffix=" 🌙" label="Mission"        />
          </div>
        </section>

        {/* ── REFERRAL SECTION ──────────────────────────────────────────────── */}
        <section style={{ padding: "90px clamp(20px,5vw,60px)", borderTop: "1px solid rgba(255,255,255,0.05)", width: "100%", boxSizing: "border-box" }}>
          <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "48px" }}>
              <p style={{ fontSize: "9px", letterSpacing: "0.5em", textTransform: "uppercase", color: "rgba(100,160,255,0.65)", marginBottom: "12px" }}>Spread the Vision</p>
              <h2 className="font-freight" style={{ fontSize: "clamp(1.9rem,4vw,3rem)", fontWeight: 300, color: "#f0f0f0", marginBottom: "12px" }}>
                Bring a Founder In
              </h2>
              <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.38)", maxWidth: "500px", margin: "0 auto", lineHeight: 1.8 }}>
                Generate your personal referral link and share the XAFAM story with people who deserve to be part of it.
              </p>
            </div>
            <ReferralSection />
          </div>
        </section>

        {/* ── LOCKED VISION SECTION ─────────────────────────────────────────── */}
        <div style={{ position: "relative" }}>
          {/* Locked overlay */}
          {locked && (
            <div style={{
              position: "absolute", inset: 0, zIndex: 20,
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              background: "rgba(8,8,16,0.75)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)",
              textAlign: "center", padding: "20px", boxSizing: "border-box",
            }}>
              <div style={{ fontSize: "48px", marginBottom: "24px", filter: "drop-shadow(0 0 16px rgba(255,215,0,0.3))" }}>🔒</div>
              <h2 className="font-freight" style={{ fontSize: "clamp(2rem, 5vw, 4rem)", fontWeight: 300, color: "#f0f0f0", marginBottom: "16px", maxWidth: "600px" }}>
                The Future Belongs to the Few
              </h2>
              <p style={{ fontSize: "clamp(13px, 2vw, 16px)", color: "rgba(255,255,255,0.44)", maxWidth: "500px", lineHeight: 1.8, marginBottom: "36px" }}>
                What you are looking for is not yet ready for the world.<br />
                But for the first 100 who step forward, the doors will open sooner.
              </p>
              <a
                href="https://forms.gle/7bDtHXy1fCqBNYC19"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-block", background: "rgba(255,255,255,0.92)",
                  color: "#0a0a14", borderRadius: "99px", padding: "14px 36px",
                  fontSize: "13px", fontWeight: 700, letterSpacing: "0.1em",
                  textTransform: "uppercase", textDecoration: "none",
                  transition: "background 0.25s",
                }}
              >
                Be Among the First 100
              </a>
              {/* Hidden unlock */}
              <button onClick={() => setLocked(false)} style={{ position: "absolute", bottom: 20, right: 20, width: 60, height: 60, opacity: 0, background: "none", border: "none", cursor: "pointer" }} aria-label="Unlock" />
            </div>
          )}
          {!locked && (
            <button onClick={() => setLocked(true)} style={{ position: "absolute", bottom: 20, right: 20, zIndex: 30, width: 60, height: 60, opacity: 0, background: "none", border: "none", cursor: "pointer" }} aria-label="Lock" />
          )}

          {/* XAFAM Detail */}
          <section style={{
            padding: "100px clamp(20px,5vw,60px)", position: "relative", overflow: "hidden",
            opacity: locked ? 0.25 : 1, pointerEvents: locked ? "none" : "auto", transition: "opacity 0.5s ease",
            width: "100%", boxSizing: "border-box",
            background: "rgba(10,20,60,0.35)", borderTop: "1px solid rgba(100,120,255,0.1)",
          }}>
            <div style={{ position: "absolute", inset: 0, zIndex: 0, opacity: 0.06 }}>
              <Image src="/images/xafam2.jpg" alt="XAFAM background" fill className="object-cover" />
            </div>
            <div style={{ maxWidth: "1000px", margin: "0 auto", position: "relative", zIndex: 1 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(380px,100%), 1fr))", gap: "60px", alignItems: "center" }}>
                <div>
                  <p style={{ fontSize: "9px", letterSpacing: "0.5em", textTransform: "uppercase", color: "rgba(100,160,255,0.65)", marginBottom: "14px" }}>The Brand</p>
                  <h2 className="font-freight" style={{ fontSize: "clamp(2rem,4vw,3.2rem)", fontWeight: 300, lineHeight: 1.1, color: "#f0f0f0", marginBottom: "24px" }}>
                    Vision — XAFAM
                  </h2>
                  <p style={{ fontSize: "14.5px", color: "rgba(255,255,255,0.48)", lineHeight: 1.9, marginBottom: "18px" }}>
                    XAFAM is a premium lifestyle brand crafted by Shafee, Md Mehboob, and Arman Rai — designed for Gen Z and those who dare to stand out.
                  </p>
                  <p style={{ fontSize: "14.5px", color: "rgba(255,255,255,0.48)", lineHeight: 1.9, marginBottom: "28px" }}>
                    Our journey begins with high-quality hoodies across normal and premium collections with distinctive logos — setting the stage for a global fashion revolution. From sustainable fashion to future tech-driven sub-brands, XAFAM is your invitation to join a legacy of style and impact.
                  </p>
                  <div style={{ display: "inline-block", background: "rgba(100,160,255,0.08)", border: "1px solid rgba(100,160,255,0.25)", borderRadius: "8px", padding: "14px 20px", fontSize: "13px", color: "rgba(100,180,255,0.8)", fontStyle: "italic" }}>
                    "Pre-order now, share your vision, or invest in our future — together, we'll redefine what's possible."
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                  <div style={{ position: "relative", width: "min(320px, 80vw)", height: "min(320px, 80vw)", filter: "drop-shadow(0 0 40px rgba(100,140,255,0.3))" }}>
                    <Image src="/svg/xafamlogo.svg" alt="XAFAM Logo" fill className="object-contain" />
                  </div>
                  <div style={{ position: "absolute", bottom: "8px", left: "50%", transform: "translateX(-50%)", background: "rgba(255,215,0,0.12)", border: "1px solid rgba(255,215,0,0.35)", borderRadius: "99px", padding: "6px 18px", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#fde68a", animation: "pulse 2.2s ease-in-out infinite" }}>
                    Coming Soon
                  </div>
                  <style>{`@keyframes pulse { 0%,100%{opacity:0.6} 50%{opacity:1} }`}</style>
                </div>
              </div>
            </div>
          </section>

          {/* Team */}
          <section style={{ padding: "90px clamp(20px,5vw,60px)", opacity: locked ? 0.25 : 1, pointerEvents: locked ? "none" : "auto", transition: "opacity 0.5s ease", width: "100%", boxSizing: "border-box", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
              <div style={{ textAlign: "center", marginBottom: "60px" }}>
                <p style={{ fontSize: "9px", letterSpacing: "0.5em", textTransform: "uppercase", color: "rgba(100,160,255,0.65)", marginBottom: "12px" }}>The People</p>
                <h2 className="font-freight" style={{ fontSize: "clamp(2rem,4vw,3.2rem)", fontWeight: 300, color: "#f0f0f0" }}>
                  Meet the Visionaries Behind XAFAM
                </h2>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(260px,100%), 1fr))", gap: "20px" }}>
                <TeamCard delay={0}   name="Shafee"      role="CEO & Brand / Marketing Head"              image="/images/shafee.jpg" />
                <TeamCard delay={100} name="Md Mehboob"  role="Co-Founder & Operations / Logistics Head"  image="/images/mehboob.jpg" />
                <TeamCard delay={200} name="Arman Rai"   role="Co-Founder & Creative Head"                image="/images/arman.jpg" />
              </div>
            </div>
          </section>
        </div>

        {/* ── CTA ───────────────────────────────────────────────────────────── */}
        <section style={{ padding: "90px clamp(20px,5vw,60px)", textAlign: "center", background: "rgba(0,50,150,0.06)", borderTop: "1px solid rgba(0,80,200,0.12)", width: "100%", boxSizing: "border-box" }}>
          <div style={{ maxWidth: "580px", margin: "0 auto" }}>
            <div style={{ fontSize: "40px", marginBottom: "20px", filter: "drop-shadow(0 0 12px rgba(255,215,0,0.3))" }}>✦</div>
            <h2 className="font-freight" style={{ fontSize: "clamp(1.8rem,4vw,3rem)", fontWeight: 300, color: "#f0f0f0", marginBottom: "16px" }}>
              Join the First 100
            </h2>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", lineHeight: 1.85, marginBottom: "40px" }}>
              Be part of something bigger. Exclusive access, founder pricing, and first-hand impact on the brand's direction — for the 100 who believe first.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "12px" }}>
              <a
                href="https://forms.gle/7bDtHXy1fCqBNYC19"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-block", background: "rgba(255,255,255,0.92)", color: "#0a0a14",
                  borderRadius: "99px", padding: "14px 36px", fontSize: "13px", fontWeight: 700,
                  letterSpacing: "0.08em", textTransform: "uppercase", textDecoration: "none",
                  transition: "background 0.25s, transform 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.92)"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                Apply Now →
              </a>
              <a
                href="mailto:xafamofficial2025@gmail.com"
                style={{
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.14)",
                  borderRadius: "99px", padding: "14px 28px", fontSize: "13px",
                  color: "#e0e0e0", letterSpacing: "0.04em", textDecoration: "none",
                  transition: "background 0.25s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.10)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
              >
                Get in Touch
              </a>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}