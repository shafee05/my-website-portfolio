"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";

const GalaxyOrb          = dynamic(() => import("@/components/GalaxyOrb"),          { ssr: false, loading: () => null });
const ParticleBackground = dynamic(() => import("@/components/ParticleBackground"),  { ssr: false, loading: () => null });
const SkillsMarquee      = dynamic(() => import("@/components/sections/SkillsMarquee"),       { ssr: false, loading: () => null });

/* ══════════════════════════════════════════════════════════════════
   INTRO ANIMATION — always plays on every page load, no sessionStorage
══════════════════════════════════════════════════════════════════ */
function IntroScreen() {
  // phase: "cover" → "show" → "hold" → "fade" → "gone"
  const [phase, setPhase] = useState("cover");

  useEffect(() => {
    // Small initial delay so SSR flash doesn't appear
    const t0 = setTimeout(() => setPhase("show"),  80);
    const t1 = setTimeout(() => setPhase("hold"),  900);
    const t2 = setTimeout(() => setPhase("fade"),  2200);
    const t3 = setTimeout(() => setPhase("gone"),  3400);
    return () => { clearTimeout(t0); clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  if (phase === "gone") return null;

  const overlayVisible = phase !== "fade";

  return (
    <>
      <style>{`
        @keyframes introSpin {
          from { transform: translate(-50%,-50%) rotate(0deg); }
          to   { transform: translate(-50%,-50%) rotate(360deg); }
        }
        @keyframes introPulse {
          0%,100% { opacity: 0.45; transform: scale(1); }
          50%      { opacity: 0.90; transform: scale(1.04); }
        }
        @keyframes introLogoIn {
          from { opacity: 0; transform: translate(-50%,-50%) scale(0.88); }
          to   { opacity: 1; transform: translate(-50%,-50%) scale(1); }
        }
        @keyframes introLineGrow {
          from { width: 0; }
          to   { width: 180px; }
        }
        @keyframes introTagIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Full-screen overlay */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 9998,
        background: "rgba(2,4,14,0.98)",
        opacity: phase === "fade" ? 0 : 1,
        transition: phase === "fade" ? "opacity 1.1s cubic-bezier(0.4,0,0.2,1)" : "none",
        pointerEvents: phase === "fade" ? "none" : "auto",
      }} />

      {/* Spinning dashed ring */}
      {(phase === "hold" || phase === "fade") && (
        <div style={{
          position: "fixed", top: "50%", left: "50%",
          zIndex: 9999, pointerEvents: "none",
          animation: "introSpin 12s linear infinite",
        }}>
          <svg width="300" height="300" viewBox="-150 -150 300 300">
            <circle cx="0" cy="0" r="130" fill="none"
              stroke="rgba(100,160,255,0.22)" strokeWidth="0.8"
              strokeDasharray="5 14" />
            <circle cx="0" cy="0" r="108" fill="none"
              stroke="rgba(255,255,255,0.06)" strokeWidth="0.6" />
          </svg>
        </div>
      )}

      {/* 8 orbiting dots */}
      {(phase === "hold" || phase === "fade") && (
        <div style={{ position: "fixed", top: "50%", left: "50%", zIndex: 9999, pointerEvents: "none" }}>
          {[...Array(8)].map((_, i) => {
            const angle = (i / 8) * 360;
            const rad = (angle * Math.PI) / 180;
            const r = 118 + (i % 3) * 14;
            const x = Math.cos(rad) * r;
            const y = Math.sin(rad) * r;
            return (
              <div key={i} style={{
                position: "absolute",
                width: "4px", height: "4px", borderRadius: "50%",
                background: "rgba(100,165,255,0.75)",
                boxShadow: "0 0 8px rgba(100,165,255,0.8)",
                top: "50%", left: "50%",
                marginTop: "-2px", marginLeft: "-2px",
                transform: `translate(${x}px, ${y}px)`,
                opacity: phase === "hold" ? 0.75 : 0,
                transition: `opacity 0.4s ease ${i * 60}ms`,
              }} />
            );
          })}
        </div>
      )}

      {/* Logo centrepiece */}
      {(phase !== "cover") && (
        <div style={{
          position: "fixed", top: "50%", left: "50%",
          zIndex: 10000, pointerEvents: "none",
          animation: "introLogoIn 0.65s cubic-bezier(0.34,1.4,0.64,1) forwards",
          display: "flex", flexDirection: "column", alignItems: "center",
          transform: "translate(-50%,-50%)",
          opacity: phase === "fade" ? 0 : 1,
          transition: phase === "fade" ? "opacity 0.9s ease 0.1s" : "none",
        }}>
          {/* Logo image */}
          <div style={{ position: "relative", width: "200px", height: "56px", marginBottom: "20px" }}>
            <Image src="/svg/logo.svg" alt="Shafee" fill className="object-contain" priority />
          </div>

          {/* Animated line */}
          <div style={{
            height: "1px",
            background: "linear-gradient(to right, transparent, rgba(100,165,255,0.75), transparent)",
            marginBottom: "12px",
            animation: phase === "hold" ? "introLineGrow 0.7s ease forwards" : "none",
            width: phase === "hold" || phase === "fade" ? "180px" : "0",
            transition: "width 0.7s ease",
          }} />

          {/* Tagline */}
          <p style={{
            fontSize: "10px", letterSpacing: "0.5em", textTransform: "uppercase",
            color: "rgba(255,255,255,0.35)",
            opacity: phase === "hold" || phase === "fade" ? 1 : 0,
            transform: phase === "hold" || phase === "fade" ? "translateY(0)" : "translateY(8px)",
            transition: "opacity 0.5s ease 0.25s, transform 0.5s ease 0.25s",
          }}>
            Portfolio · 2025
          </p>
        </div>
      )}
    </>
  );
}

/* ── Scroll reveal ────────────────────────────────────────────────── */
function useReveal(delay = 0) {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    let tm;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { tm = setTimeout(() => setV(true), delay); obs.disconnect(); }
    }, { threshold: 0.07, rootMargin: "0px 0px -30px 0px" });
    obs.observe(el);
    return () => { obs.disconnect(); clearTimeout(tm); };
  }, [delay]);
  return { ref, visible: v };
}

/* ── Button styles ────────────────────────────────────────────────── */
const btnSolid = {
  display: "inline-block", background: "rgba(255,255,255,0.92)", color: "#08080f",
  borderRadius: "99px", padding: "13px 32px", fontSize: "11px", fontWeight: 700,
  letterSpacing: "0.09em", textTransform: "uppercase", textDecoration: "none",
  transition: "transform 0.2s,background 0.2s,box-shadow 0.2s", boxSizing: "border-box",
};
const btnOutline = {
  display: "inline-block", background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.18)", color: "#dde0f5",
  borderRadius: "99px", padding: "13px 28px", fontSize: "11px", letterSpacing: "0.06em",
  textDecoration: "none", transition: "transform 0.2s,background 0.2s,border-color 0.2s",
  boxSizing: "border-box",
};

/* ── Section wrapper ──────────────────────────────────────────────── */
function Sec({ id, tinted, children, style: extraStyle }) {
  return (
    <section id={id} style={{
      padding: "88px clamp(20px,5vw,64px)",
      borderTop: "1px solid rgba(255,255,255,0.055)",
      background: tinted ? "rgba(255,255,255,0.018)" : "transparent",
      width: "100%", boxSizing: "border-box",
      ...extraStyle,
    }}>
      {children}
    </section>
  );
}

/* ── Section heading ──────────────────────────────────────────────── */
function SH({ label, title, subtitle }) {
  const { ref, visible } = useReveal(0);
  return (
    <div ref={ref} style={{ textAlign: "center", marginBottom: "52px",
      opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(18px)",
      transition: "opacity 0.65s ease,transform 0.65s ease" }}>
      {label && <p style={{ fontSize: "9px", letterSpacing: "0.55em", textTransform: "uppercase", color: "rgba(110,170,255,0.65)", marginBottom: "12px" }}>{label}</p>}
      <h2 className="font-freight" style={{ fontSize: "clamp(2rem,4.5vw,3.4rem)", fontWeight: 300, color: "#f0f0f0", lineHeight: 1.1, marginBottom: subtitle ? "14px" : 0 }}>{title}</h2>
      {subtitle && <p style={{ fontSize: "clamp(13px,2vw,15px)", color: "rgba(255,255,255,0.36)", maxWidth: "580px", margin: "0 auto", lineHeight: 1.85 }}>{subtitle}</p>}
    </div>
  );
}

/* ── Project card ─────────────────────────────────────────────────── */
function ProjectCard({ image, bgGrad, title, desc, tags, href, external, badge, delay, isGame }) {
  const { ref, visible } = useReveal(delay);
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)", transition: "opacity 0.55s ease,transform 0.55s ease" }}>
      <div style={{
        position: "relative", borderRadius: "14px", overflow: "hidden", height: "260px",
        border: "1px solid rgba(255,255,255,0.07)",
        transition: "border-color 0.3s,box-shadow 0.3s",
        cursor: isGame ? "pointer" : "default",
      }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(0,200,255,0.38)"; e.currentTarget.style.boxShadow = "0 0 28px rgba(0,180,255,0.10)"; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.boxShadow = "none"; }}
        onClick={isGame ? () => window.open("https://nrnr-game.vercel.app/", "_blank") : undefined}
      >
        {image && <div style={{ position: "absolute", inset: 0 }}><Image src={image} alt={title} fill style={{ objectFit: "cover", opacity: 0.40 }}/></div>}
        {bgGrad && <div style={{ position: "absolute", inset: 0, background: bgGrad }}/>}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(3,5,18,0.97) 28%,rgba(3,5,18,0.42) 68%,transparent)" }}/>
        {badge && (
          <div style={{ position: "absolute", top: "14px", left: "14px", zIndex: 2,
            background: isGame ? "linear-gradient(135deg,#001a33,#003355)" : "rgba(255,255,255,0.08)",
            color: isGame ? "#66ddff" : "rgba(200,220,255,0.7)", fontSize: "10px", fontWeight: 700,
            padding: "4px 10px", borderRadius: "99px",
            border: isGame ? "1px solid rgba(0,180,255,0.35)" : "1px solid rgba(255,255,255,0.14)",
            letterSpacing: "0.07em" }}>
            {badge}
          </div>
        )}
        {isGame && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 3 }}>
            <div style={{ width: "54px", height: "54px", borderRadius: "50%",
              background: "rgba(0,180,255,0.12)", border: "1.5px solid rgba(0,200,255,0.45)",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "transform 0.2s,background 0.2s", backdropFilter: "blur(4px)" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,200,255,0.22)"; e.currentTarget.style.transform = "scale(1.08)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(0,180,255,0.12)"; e.currentTarget.style.transform = "scale(1)"; }}>
              <span style={{ fontSize: "20px", marginLeft: "3px" }}>▶</span>
            </div>
          </div>
        )}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "18px 20px", zIndex: 2 }}>
          {tags && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", marginBottom: "8px" }}>
              {tags.map(t => <span key={t} style={{ fontSize: "9px", letterSpacing: "0.1em", padding: "3px 8px", borderRadius: "99px", background: "rgba(255,255,255,0.07)", color: "rgba(180,210,255,0.7)" }}>{t}</span>)}
            </div>
          )}
          <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#f0f0f0", marginBottom: "5px" }}>{title}</h3>
          <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.40)", lineHeight: 1.7, marginBottom: "12px" }}>{desc}</p>
          {isGame && <span style={{ fontSize: "11px", fontWeight: 600, color: "rgba(0,200,255,0.80)" }}>Open Game →</span>}
          {!isGame && href && (
            external
              ? <a href={href} target="_blank" rel="noopener noreferrer" style={{ fontSize: "11px", fontWeight: 600, color: "rgba(140,200,255,0.80)", textDecoration: "none" }}>View →</a>
              : <Link href={href} style={{ fontSize: "11px", fontWeight: 600, color: "rgba(140,200,255,0.80)", textDecoration: "none" }}>View →</Link>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Achievement card ─────────────────────────────────────────────── */
function AchCard({ icon, title, desc, side, delay }) {
  const { ref, visible } = useReveal(delay);
  return (
    <div ref={ref} style={{ display: "flex", justifyContent: side === "right" ? "flex-end" : "flex-start",
      opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)",
      transition: "opacity 0.55s ease,transform 0.55s ease", paddingBottom: "28px" }}>
      <div style={{ maxWidth: "340px", width: "100%", background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "20px 22px",
        textAlign: side === "right" ? "right" : "left", transition: "border-color 0.3s" }}
        onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(100,165,255,0.35)"}
        onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}>
        <div style={{ fontSize: "22px", marginBottom: "8px" }}>{icon}</div>
        <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#e0e0f0", marginBottom: "5px" }}>{title}</h3>
        <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.38)", lineHeight: 1.75, margin: 0 }}>{desc}</p>
      </div>
    </div>
  );
}

/* ── Job card ─────────────────────────────────────────────────────── */
function JobCard({ icon, label, desc, delay }) {
  const { ref, visible } = useReveal(delay);
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)", transition: "opacity 0.5s ease,transform 0.5s ease" }}>
      <div style={{
        background: "rgba(255,255,255,0.03)", border: "1px solid rgba(100,200,130,0.12)",
        borderRadius: "14px", padding: "22px 20px", height: "100%", boxSizing: "border-box",
        transition: "border-color 0.3s,background 0.3s,box-shadow 0.3s",
      }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(100,200,130,0.35)"; e.currentTarget.style.background = "rgba(100,200,130,0.04)"; e.currentTarget.style.boxShadow = "0 0 20px rgba(100,200,130,0.06)"; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(100,200,130,0.12)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.boxShadow = "none"; }}>
        <div style={{ fontSize: "24px", marginBottom: "12px" }}>{icon}</div>
        <h3 style={{ fontSize: "14px", fontWeight: 600, color: "#dde8ee", marginBottom: "7px" }}>{label}</h3>
        <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.36)", lineHeight: 1.8, margin: 0 }}>{desc}</p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════════════════ */
export default function Home() {
  const [heroIn, setHeroIn]     = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    const el = heroRef.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setHeroIn(true); obs.disconnect(); } }, { threshold: 0.05 });
    obs.observe(el); return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <>
      {/* ════ INTRO — always shows on every page load ════ */}
      <IntroScreen />

      <ParticleBackground/>
      <div style={{ position: "fixed", inset: 0, background: "rgba(2,4,14,0.82)", zIndex: 0, pointerEvents: "none" }}/>

      <div style={{ position: "relative", zIndex: 1, color: "#f0f0f0", overflowX: "hidden", width: "100%", maxWidth: "100vw", boxSizing: "border-box" }}>

        {/* ═════ HERO ════════════════════════════════════════════════ */}
        <section style={{ position: "relative", minHeight: "100dvh", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <GalaxyOrb/>

          {/* Vignettes */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "240px", background: "linear-gradient(to top,rgba(2,4,14,1) 0%,transparent)", pointerEvents: "none", zIndex: 2 }}/>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "120px", background: "linear-gradient(to bottom,rgba(2,4,14,0.65) 0%,transparent)", pointerEvents: "none", zIndex: 2 }}/>

          {/* Hero text */}
          <div ref={heroRef} style={{
            position: "relative", zIndex: 3, pointerEvents: "none",
            textAlign: "center", width: "100%",
            padding: "clamp(110px,14dvh,160px) clamp(20px,6vw,80px) 140px",
            boxSizing: "border-box",
            opacity: heroIn ? 1 : 0, transform: heroIn ? "translateY(0)" : "translateY(30px)",
            transition: "opacity 1.2s ease,transform 1.2s ease",
          }}>
            <p style={{
              fontSize: "clamp(8px,1.1vw,10px)", letterSpacing: "0.65em", textTransform: "uppercase",
              color: "rgba(180,210,255,0.88)", marginBottom: "18px",
              textShadow: "0 0 24px rgba(2,4,14,0.95), 0 0 48px rgba(2,4,14,0.90), 0 2px 8px rgba(0,0,0,1)",
            }}>
              Data Science · Gen AI · Life Coaching
            </p>

            <h1 className="font-freight" style={{
              fontSize: "clamp(3.5rem,11vw,9.5rem)", fontWeight: 200, lineHeight: 0.90,
              color: "#eef0ff", letterSpacing: "-0.025em", marginBottom: "22px",
              textShadow: "0 0 80px rgba(2,4,14,0.90), 0 4px 40px rgba(0,0,0,0.98), 0 0 120px rgba(2,4,14,0.80)",
            }}>
              Mohammad<br/>
              <span style={{ color: "rgba(255,255,255,0.88)", fontWeight: 300 }}>Shafee</span>
            </h1>

            <p style={{
              fontSize: "clamp(11px,1.8vw,16px)", letterSpacing: "0.28em", textTransform: "uppercase",
              fontWeight: 800, color: "#ffffff", marginBottom: "10px",
              WebkitTextStroke: "0.5px rgba(255,255,255,0.6)",
              textShadow: [
                "0 0 8px rgba(2,4,14,1)","0 0 20px rgba(2,4,14,1)","0 0 40px rgba(2,4,14,1)",
                "0 0 70px rgba(2,4,14,1)","0 2px 6px rgba(0,0,0,1)","0 4px 16px rgba(0,0,0,1)",
                "-2px -2px 0 rgba(2,4,14,0.95)","2px -2px 0 rgba(2,4,14,0.95)",
                "-2px 2px 0 rgba(2,4,14,0.95)","2px 2px 0 rgba(2,4,14,0.95)",
              ].join(","),
            }}>
              Unleashing Creativity · Pioneering AI
            </p>

            <div style={{ width: "56px", height: "1px", background: "linear-gradient(to right,transparent,rgba(140,185,255,0.6),transparent)", margin: "0 auto 28px" }}/>

            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "8px", marginBottom: "38px" }}>
              {["Gen AI Engineer", "Data Scientist", "Published Author", "Life Coach"].map(tag => (
                <span key={tag} style={{
                  fontSize: "9px", letterSpacing: "0.12em", padding: "5px 14px", borderRadius: "99px",
                  background: "rgba(2,4,18,0.80)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.20)", color: "rgba(220,235,255,0.88)",
                  boxShadow: "0 2px 14px rgba(0,0,0,0.70)",
                }}>{tag}</span>
              ))}
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "12px", pointerEvents: "auto" }}>
              <a href="#odyssey" style={btnSolid}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(255,255,255,0.2)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
                Explore My Work
              </a>
              <a href="mailto:md.shafee05s@gmail.com" style={btnOutline}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.10)"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.35)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)"; }}>
                Get in Touch
              </a>
            </div>

            {/* ── Download Resume button ── */}
            <div style={{ marginTop: "14px", pointerEvents: "auto" }}>
              <a
                href="/files/shafee_CV.pdf"
                download="Mohammad-Shafee-Resume.pdf"
                style={{
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  fontSize: "12px", letterSpacing: "0.08em",
                  color: "rgba(160,210,255,0.70)",
                  textDecoration: "none",
                  padding: "8px 18px",
                  border: "1px solid rgba(100,165,255,0.22)",
                  borderRadius: "99px",
                  background: "rgba(100,165,255,0.05)",
                  transition: "color 0.2s, border-color 0.2s, background 0.2s, transform 0.2s",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = "rgba(200,230,255,0.95)";
                  e.currentTarget.style.borderColor = "rgba(100,165,255,0.55)";
                  e.currentTarget.style.background = "rgba(100,165,255,0.12)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = "rgba(160,210,255,0.70)";
                  e.currentTarget.style.borderColor = "rgba(100,165,255,0.22)";
                  e.currentTarget.style.background = "rgba(100,165,255,0.05)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {/* Download arrow icon */}
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.5 1v7.5M6.5 8.5l-3-3m3 3 3-3M1.5 11h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Download Résumé
              </a>
            </div>


          </div>

          {/* Scroll indicator */}
          <div style={{ position: "absolute", bottom: "28px", left: "50%", transform: "translateX(-50%)", zIndex: 3, display: "flex", flexDirection: "column", alignItems: "center", gap: "5px", opacity: 0.22, animation: "bob 2.4s ease-in-out infinite", pointerEvents: "none" }}>
            <span style={{ fontSize: "8px", letterSpacing: "0.35em", textTransform: "uppercase" }}>scroll</span>
            <div style={{ width: "1px", height: "24px", background: "rgba(255,255,255,0.5)" }}/>
          </div>
          <style>{`
            @keyframes bob{0%,100%{transform:translateX(-50%) translateY(0)}50%{transform:translateX(-50%) translateY(7px)}}
            html { scroll-behavior: smooth; }
            * { -webkit-tap-highlight-color: transparent; }
          `}</style>
        </section>

        {/* ═════ SKILLS MARQUEE ════════════════════════════════════════ */}
        <SkillsMarquee/>

        {/* ═════ STICKY SECTION NAV ════════════════════════════════════ */}
        <nav style={{
          position: "sticky", top: 0, zIndex: 40,
          background: scrolled ? "rgba(2,4,18,0.90)" : "rgba(2,4,18,0.60)",
          backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
          borderBottom: `1px solid ${scrolled ? "rgba(255,255,255,0.09)" : "rgba(255,255,255,0.04)"}`,
          transition: "background 0.4s ease,border-color 0.4s ease",
          width: "100%", boxSizing: "border-box",
        }}>
          <div style={{ overflowX: "auto", overflowY: "hidden", WebkitOverflowScrolling: "touch", scrollbarWidth: "none", msOverflowStyle: "none" }}>
            <style>{`.nav-inner::-webkit-scrollbar{display:none}`}</style>
            <ul className="nav-inner" style={{
              display: "flex", flexWrap: "nowrap", gap: "2px",
              padding: "10px clamp(12px,4vw,40px)", margin: 0, listStyle: "none",
              width: "max-content", minWidth: "100%",
            }}>
              {[
                ["odyssey","Odyssey"],["book","Book"],["passion","AI & DS"],
                ["skills","Skills"],["experience","Experience"],["coaching","Coaching"],
                ["projects","Projects"],["jobs","Remote Jobs"],
                ["achievements","Wins"],["education","Education"],["contact","Contact"],
              ].map(([id, label]) => (
                <li key={id} style={{ flexShrink: 0 }}>
                  <a href={`#${id}`} style={{
                    display: "inline-block", padding: "7px 14px", whiteSpace: "nowrap",
                    fontSize: "clamp(10px,1.4vw,12px)", letterSpacing: "0.04em",
                    color: id === "jobs" ? "rgba(100,200,130,0.75)" : "rgba(255,255,255,0.50)",
                    textDecoration: "none", borderRadius: "8px",
                    transition: "color 0.25s,background 0.25s",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.color = id === "jobs" ? "rgba(140,230,160,1)" : "#f0f2ff"; e.currentTarget.style.background = id === "jobs" ? "rgba(100,200,130,0.10)" : "rgba(100,165,255,0.12)"; }}
                    onMouseLeave={e => { e.currentTarget.style.color = id === "jobs" ? "rgba(100,200,130,0.75)" : "rgba(255,255,255,0.50)"; e.currentTarget.style.background = "transparent"; }}
                  >{label}</a>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* ═════ ODYSSEY ═══════════════════════════════════════════════ */}
        <Sec id="odyssey">
          <div style={{ maxWidth: "860px", margin: "0 auto" }}>
            <SH label="The Journey" title="My AI & Data Science Odyssey" subtitle="Where Innovation Meets Passion"/>
            {(() => { const { ref, visible } = useReveal(80); return (
              <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)", transition: "opacity 0.6s ease,transform 0.6s ease", textAlign: "center" }}>
                <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.44)", lineHeight: 1.95, marginBottom: "18px" }}>
                  Step into the world of Mohammad Shafee ur Rahaman — a visionary Data Science Engineering student igniting a revolution in emotional intelligence through AI. With expertise in Generative AI, NLP, and emotionally resonant systems, I'm crafting a future where technology feels human.
                </p>
                <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.44)", lineHeight: 1.95 }}>
                  This portfolio is more than a showcase — it's an invitation to explore the mind of a creator who blends data with dreams. Each project, skill, and achievement is a stepping stone to something extraordinary.
                </p>
              </div>
            ); })()}
          </div>
        </Sec>

        {/* ═════ BOOK ══════════════════════════════════════════════════ */}
        <Sec id="book" tinted>
          <div style={{ maxWidth: "960px", margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(300px,100%),1fr))", gap: "60px", alignItems: "center" }}>
              {(() => { const { ref, visible } = useReveal(0); return (
                <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateX(0)" : "translateX(-28px)", transition: "opacity 0.7s ease,transform 0.7s ease" }}>
                  <div style={{ position: "relative", height: "380px", borderRadius: "14px", overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.65)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <Image src="/images/arcana-cover.jpg" alt="The Arcana of Ascent" fill style={{ objectFit: "cover" }}/>
                  </div>
                </div>
              ); })()}
              {(() => { const { ref, visible } = useReveal(120); return (
                <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateX(0)" : "translateX(28px)", transition: "opacity 0.7s ease,transform 0.7s ease" }}>
                  <p style={{ fontSize: "9px", letterSpacing: "0.5em", textTransform: "uppercase", color: "rgba(110,170,255,0.65)", marginBottom: "12px" }}>Published Work</p>
                  <h2 className="font-freight" style={{ fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 300, color: "#f0f0f0", marginBottom: "20px" }}>The Arcana of Ascent</h2>
                  <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.44)", lineHeight: 1.9, marginBottom: "14px" }}>
                    <strong style={{ color: "rgba(255,255,255,0.72)" }}>The Arcana of Ascent</strong> is a study in quiet power. It confronts the inner territories most people bypass — where silence sharpens resolve, and endurance is forged without witnesses.
                  </p>
                  <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.44)", lineHeight: 1.9, marginBottom: "32px" }}>
                    Built around the principle that transformation begins long before it is visible, the work moves through themes of restraint, inner tension, and disciplined self-awareness.
                  </p>
                  <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                    <a href="https://amzn.to/4pccTFI" target="_blank" rel="noopener noreferrer" style={btnSolid}>Buy eBook</a>
                    <a href="https://www.amazon.com/dp/B0G53KB8SH" target="_blank" rel="noopener noreferrer" style={btnOutline}>Buy Physical</a>
                  </div>
                </div>
              ); })()}
            </div>
          </div>
        </Sec>

        {/* ═════ AI & DS ═══════════════════════════════════════════════ */}
        <Sec id="passion">
          <div style={{ maxWidth: "960px", margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(300px,100%),1fr))", gap: "60px", alignItems: "center" }}>
              {(() => { const { ref, visible } = useReveal(0); return (
                <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateX(0)" : "translateX(-28px)", transition: "opacity 0.7s ease,transform 0.7s ease" }}>
                  <p style={{ fontSize: "9px", letterSpacing: "0.5em", textTransform: "uppercase", color: "rgba(110,170,255,0.65)", marginBottom: "12px" }}>Passion</p>
                  <h2 className="font-freight" style={{ fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 300, color: "#f0f0f0", marginBottom: "22px" }}>My Passion for<br/>AI & Data Science</h2>
                  <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.44)", lineHeight: 1.9, marginBottom: "16px" }}>
                    Driven by a profound interest in artificial intelligence and data science, I specialize in creating innovative solutions that bridge human emotions with cutting-edge technology.
                  </p>
                </div>
              ); })()}
              {(() => { const { ref, visible } = useReveal(120); return (
                <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateX(0)" : "translateX(28px)", transition: "opacity 0.7s ease,transform 0.7s ease" }}>
                  <div style={{ position: "relative", height: "320px", borderRadius: "14px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 0 40px rgba(60,100,255,0.09)" }}>
                    <Image src="/images/AI+DS.png" alt="AI and Data Science" fill style={{ objectFit: "cover" }}/>
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(2,4,14,0.5) 0%,transparent 60%)" }}/>
                  </div>
                </div>
              ); })()}
            </div>
          </div>
        </Sec>

        {/* ═════ SKILLS ════════════════════════════════════════════════ */}
        <Sec id="skills" tinted>
          <div style={{ maxWidth: "960px", margin: "0 auto" }}>
            <SH label="Capabilities" title="My Arsenal of Expertise"/>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(360px,100%),1fr))", gap: "48px" }}>
              {[
                { cat: "Technical Mastery", items: [
                  { t: "Generative AI & NLP", d: "Expert in creating AI systems that understand and generate human-like language and emotions." },
                  { t: "Machine Learning Models", d: "Proficient in Decision Trees, LightGBM, YOLO, and real-time inference." },
                  { t: "Data Analysis & Visualization", d: "Skilled in Pandas, NumPy, SQL, Tableau, and Power BI." },
                ]},
                { cat: "Soft Skills & Coaching", items: [
                  { t: "Life Coaching & Counseling", d: "Certified in life coaching — personal growth, career development, emotional support." },
                  { t: "Communication & Collaboration", d: "Strong in critical thinking, problem-solving, and team collaboration." },
                ]},
              ].map(({ cat, items }, ci) => {
                const { ref, visible } = useReveal(ci * 100);
                return (
                  <div key={ci} ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)", transition: "opacity 0.6s ease,transform 0.6s ease" }}>
                    <p style={{ fontSize: "9px", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(110,170,255,0.65)", marginBottom: "20px" }}>{cat}</p>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "20px" }}>
                      {items.map(({ t, d }, i) => {
                        const { ref: r, visible: v } = useReveal(i * 60);
                        return (
                          <li key={i} ref={r} style={{ display: "flex", gap: "14px", opacity: v ? 1 : 0, transform: v ? "translateX(0)" : "translateX(-16px)", transition: "opacity 0.5s ease,transform 0.5s ease" }}>
                            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "rgba(140,185,255,0.55)", flexShrink: 0, marginTop: "7px" }}/>
                            <div>
                              <h4 style={{ fontSize: "14px", fontWeight: 600, color: "#e8eaf0", marginBottom: "4px" }}>{t}</h4>
                              <p style={{ fontSize: "12.5px", color: "rgba(255,255,255,0.36)", lineHeight: 1.75, margin: 0 }}>{d}</p>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </Sec>

        {/* ═════ EXPERIENCE ════════════════════════════════════════════ */}
        <Sec id="experience">
          <div style={{ maxWidth: "860px", margin: "0 auto" }}>
            <SH label="Work History" title="Professional Experience"/>
            {(() => { const { ref, visible } = useReveal(0); return (
              <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)", transition: "opacity 0.6s ease,transform 0.6s ease" }}>
                <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: "14px", padding: "28px", transition: "border-color 0.3s,box-shadow 0.3s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(212,175,55,0.38)"; e.currentTarget.style.boxShadow = "0 0 24px rgba(212,175,55,0.07)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)"; e.currentTarget.style.boxShadow = "none"; }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px" }}>
                    <div>
                      <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#e8e0c0", marginBottom: "6px" }}>Python Engineer – Gen AI Intern</h3>
                      <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.40)" }}>ADVI Group of Companies · Hyderabad</p>
                    </div>
                    <span style={{ fontSize: "11px", padding: "4px 12px", borderRadius: "99px", background: "rgba(212,175,55,0.09)", border: "1px solid rgba(212,175,55,0.24)", color: "rgba(212,175,55,0.80)", whiteSpace: "nowrap" }}>Feb 2025 – Aug 2025</span>
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "center", marginTop: "32px" }}>
                  <Link href="/portfolio" style={btnOutline}>View Full Portfolio →</Link>
                </div>
              </div>
            ); })()}
          </div>
        </Sec>

        {/* ═════ LIFE COACHING ═════════════════════════════════════════ */}
        <Sec id="coaching" tinted>
          <div style={{ maxWidth: "960px", margin: "0 auto" }}>
            <SH label="Guidance" title="Life Coaching & Personal Growth"
              subtitle="Every person carries a Definite Major Purpose — a legacy waiting to unfold. Through compassionate inquiry and structured guidance, I help you uncover clarity, face limiting fears, and align your actions with your deepest values."/>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(210px,100%),1fr))", gap: "14px", marginBottom: "40px" }}>
              {[
                { icon: "🎯", t: "Life Skills & Clarity", d: "Build resilience, emotional intelligence, and daily habits rooted in your values." },
                { icon: "💼", t: "Career & Purpose Alignment", d: "Discover work that reflects your passions, strengths, and Definite Major Purpose." },
                { icon: "💙", t: "Emotional Balance", d: "Navigate stress, self-doubt, and inner conflict with tools to reclaim your calm." },
                { icon: "📈", t: "Growth Mindset Coaching", d: "Transform fear into fuel. Develop a mindset that embraces setbacks as feedback." },
              ].map(({ icon, t, d }, i) => {
                const { ref, visible } = useReveal(i * 70);
                return (
                  <div key={i} ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)", transition: "opacity 0.5s ease,transform 0.5s ease" }}>
                    <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "24px 20px", height: "100%", boxSizing: "border-box", transition: "border-color 0.3s,background 0.3s" }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(100,165,255,0.38)"; e.currentTarget.style.background = "rgba(100,165,255,0.04)"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}>
                      <div style={{ fontSize: "24px", marginBottom: "12px" }}>{icon}</div>
                      <h3 style={{ fontSize: "14px", fontWeight: 600, color: "#e0e0f0", marginBottom: "8px" }}>{t}</h3>
                      <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.36)", lineHeight: 1.8, margin: 0 }}>{d}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ textAlign: "center" }}>
              <Link href="/coaching" style={btnSolid}>Begin Your Coaching Journey →</Link>
            </div>
          </div>
        </Sec>

        {/* ═════ PROJECTS ══════════════════════════════════════════════ */}
        <Sec id="projects">
          <div style={{ maxWidth: "1060px", margin: "0 auto" }}>
            <SH label="Featured Work" title="Projects"/>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(260px,100%),1fr))", gap: "16px" }}>
              <ProjectCard
                delay={0} isGame
                bgGrad="linear-gradient(135deg,rgba(0,10,30,0.97) 0%,rgba(0,20,50,0.92) 50%,rgba(0,8,24,1) 100%)"
                title="N.RNR — Neon Runner"
                desc="An unlimited browser game built for pure enjoyment. Double jump, dodge platforms, survive the infinite neon void."
                tags={["HTML5 Canvas", "Vanilla JS", "Game Dev"]}
                badge="🎮 Play Now"
              />
              <ProjectCard delay={80} image="/images/cricket.jpg"
                title="Cricket Performance Prediction"
                desc="ML model predicting player performance using Decision Trees and LightGBM."
                href="https://github.com/shafee05/Cricket-Player-Performance-prediction" external/>
              <ProjectCard delay={160} image="/images/gesturetalk.jpg"
                title="GestureTalk"
                desc="Real-time sign language recognition using YOLO, DWpose, and 3D animation."
                href="https://github.com/shafee05/GestureTalk-Sign-Language-Recognition" external/>
            </div>
          </div>
        </Sec>

        {/* ═════ IMANVERSE DEDICATION ══════════════════════════════════ */}
        {(() => { const { ref, visible } = useReveal(0); return (
          <section ref={ref} style={{
            padding: "70px clamp(20px,5vw,64px)",
            borderTop: "1px solid rgba(255,255,255,0.04)",
            width: "100%", boxSizing: "border-box",
            opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}>
            <div style={{ maxWidth: "860px", margin: "0 auto", display: "flex", flexWrap: "wrap", gap: "clamp(24px,4vw,48px)", alignItems: "center" }}>
              <div style={{ position: "relative", width: "clamp(80px,16vw,120px)", height: "clamp(80px,16vw,120px)", flexShrink: 0, borderRadius: "18px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 0 32px rgba(60,200,120,0.08)" }}>
                <Image src="/images/quran-bg.jpg" alt="ImanVerse" fill style={{ objectFit: "cover", opacity: 0.7 }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(0,40,20,0.6), rgba(0,20,10,0.8))" }} />
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px" }}>🌙</div>
              </div>
              <div style={{ flex: "1 1 280px", minWidth: 0 }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center", marginBottom: "10px" }}>
                  <p style={{ fontSize: "9px", letterSpacing: "0.5em", textTransform: "uppercase", color: "rgba(100,200,130,0.6)", margin: 0 }}>A Dedication</p>
                  <span style={{ fontSize: "9px", letterSpacing: "0.1em", padding: "3px 10px", borderRadius: "99px", background: "rgba(100,200,130,0.08)", border: "1px solid rgba(100,200,130,0.2)", color: "rgba(100,200,130,0.75)" }}>Not a project — a purpose</span>
                </div>
                <h3 className="font-freight" style={{ fontSize: "clamp(1.4rem,3vw,2rem)", fontWeight: 300, color: "#e8f0e8", marginBottom: "10px" }}>ImanVerse</h3>
                <p style={{ fontSize: "13.5px", color: "rgba(255,255,255,0.40)", lineHeight: 1.9, marginBottom: "16px", maxWidth: "520px" }}>
                  An Islamic platform built out of love for the faith — Quran access, prayer times, and spiritual resources for the Muslim community. This wasn't built for a portfolio. It was built for a purpose.
                </p>
                <a href="https://imanverse.vercel.app/" target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: "11px", fontWeight: 600, color: "rgba(100,200,130,0.75)", textDecoration: "none", letterSpacing: "0.06em", display: "inline-flex", alignItems: "center", gap: "5px", transition: "color 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.color = "rgba(140,230,160,1)"}
                  onMouseLeave={e => e.currentTarget.style.color = "rgba(100,200,130,0.75)"}>
                  Visit ImanVerse ↗
                </a>
              </div>
            </div>
          </section>
        ); })()}

        {/* ═════ REMOTE JOBS ═══════════════════════════════════════════ */}
        <Sec id="jobs" tinted>
          <div style={{ maxWidth: "960px", margin: "0 auto" }}>
            <SH
              label="Curated Opportunities"
              title="Vetted Remote Jobs"
              subtitle="I handpick and verify the best remote roles in AI, Data Science, and Tech. Real opportunities, fair pay — updated regularly. No noise, just results."
            />

            {/* 4 category cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(200px,100%),1fr))", gap: "14px", marginBottom: "40px" }}>
              <JobCard delay={0}   icon="🤖" label="AI & Machine Learning" desc="LLM, NLP, Computer Vision — remote roles worldwide." />
              <JobCard delay={80}  icon="📊" label="Data Science & Analytics" desc="Python, SQL, Power BI — entry to senior level." />
              <JobCard delay={160} icon="💻" label="Full-Stack & Web Dev" desc="React, Next.js, Node — freelance to full-time." />
              <JobCard delay={240} icon="🌍" label="Fully Remote · Global" desc="Location-independent roles, many paying in USD." />
            </div>

            {/* Preview strip */}
            {(() => { const { ref, visible } = useReveal(0); return (
              <div ref={ref} style={{ background: "rgba(100,200,130,0.05)", border: "1px solid rgba(100,200,130,0.18)", borderRadius: "16px", padding: "clamp(20px,4vw,36px)", marginBottom: "36px", opacity: visible?1:0, transform: visible?"translateY(0)":"translateY(20px)", transition: "opacity 0.6s ease, transform 0.6s ease" }}>
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
                  <div>
                    <p style={{ fontSize: "9px", letterSpacing: "0.5em", textTransform: "uppercase", color: "rgba(100,200,130,0.65)", marginBottom: "6px" }}>Live Board</p>
                    <h3 className="font-freight" style={{ fontSize: "clamp(1.3rem,3vw,1.9rem)", fontWeight: 300, color: "#f0f0f0" }}>Jobs for You</h3>
                  </div>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "rgba(100,200,130,0.85)", boxShadow: "0 0 8px rgba(100,200,130,0.7)", animation: "livePulse 2s ease-in-out infinite" }} />
                    <span style={{ fontSize: "11px", color: "rgba(100,200,130,0.70)", letterSpacing: "0.06em" }}>Updated regularly</span>
                  </div>
                </div>

                {/* Sample job rows */}
                {[
                  { role: "ML Engineer (Remote)", company: "AI Startup · Global", type: "Full-time", pay: "$60k–$90k" },
                  { role: "Data Analyst (WFH)", company: "Tech MNC · India", type: "Freelance", pay: "₹40k–₹70k/mo" },
                  { role: "Python Developer (Remote)", company: "SaaS Company · US", type: "Contract", pay: "$40–$60/hr" },
                ].map(({ role, company, type, pay }, i) => {
                  const { ref: r, visible: v } = useReveal(i * 60);
                  return (
                    <div key={i} ref={r} style={{
                      display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center",
                      gap: "12px", padding: "14px 0",
                      borderTop: "1px solid rgba(255,255,255,0.06)",
                      opacity: v?1:0, transform: v?"translateX(0)":"translateX(-12px)",
                      transition: `opacity 0.45s ease ${i*60}ms, transform 0.45s ease ${i*60}ms`,
                    }}>
                      <div>
                        <p style={{ fontSize: "14px", fontWeight: 600, color: "#e0e0f0", marginBottom: "3px" }}>{role}</p>
                        <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.36)" }}>{company}</p>
                      </div>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                        <span style={{ fontSize: "10px", padding: "3px 10px", borderRadius: "99px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)", color: "rgba(200,220,255,0.65)" }}>{type}</span>
                        <span style={{ fontSize: "12px", fontWeight: 600, color: "rgba(100,200,130,0.85)" }}>{pay}</span>
                      </div>
                    </div>
                  );
                })}

                <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.22)", textAlign: "center", marginTop: "12px", fontStyle: "italic" }}>
                  Sample listings — visit the full board for live opportunities
                </p>
              </div>
            ); })()}

            {/* CTA row */}
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "14px" }}>
              {/* External jobs board */}
              <a href="https://shafee05.github.io/Jobs-for-you/" target="_blank" rel="noopener noreferrer"
                style={{
                  display: "inline-flex", alignItems: "center", gap: "9px",
                  background: "rgba(100,200,130,0.12)", border: "1.5px solid rgba(100,200,130,0.35)",
                  color: "rgba(140,230,160,0.95)", borderRadius: "99px",
                  padding: "14px 30px", fontSize: "12px", fontWeight: 700,
                  letterSpacing: "0.08em", textTransform: "uppercase", textDecoration: "none",
                  transition: "background 0.2s, transform 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(100,200,130,0.22)"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(100,200,130,0.15)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(100,200,130,0.12)"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
                Browse All Opportunities →
              </a>
              {/* Internal Craft page anchor */}
              <Link href="/craft#jobs"
                style={{
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)",
                  color: "rgba(200,215,255,0.75)", borderRadius: "99px",
                  padding: "14px 26px", fontSize: "12px", letterSpacing: "0.06em",
                  textDecoration: "none", transition: "background 0.2s, transform 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.10)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.transform = "translateY(0)"; }}>
                View on Craft Page ↗
              </Link>
            </div>
          </div>
          <style>{`@keyframes livePulse{0%,100%{opacity:0.85;transform:scale(1)}50%{opacity:1;transform:scale(1.25)}}`}</style>
        </Sec>

        {/* ═════ ACHIEVEMENTS ══════════════════════════════════════════ */}
        <Sec id="achievements">
          <div style={{ maxWidth: "860px", margin: "0 auto" }}>
            <SH label="Milestones" title="Key Achievements & Activities"/>
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: "1px", background: "rgba(255,255,255,0.07)", transform: "translateX(-50%)" }}/>
              {[
                { icon: "🏆", title: "Hack-A-Bot Winner", desc: "Campus-level AI competition showcasing innovative solutions.", side: "right" },
                { icon: "🎮", title: "N.RNR — Browser Game", desc: "Built a complete browser game in a single HTML file. Players from around the world challenged to beat the 50,000 score.", side: "left" },
                { icon: "🔬", title: "Flipkart Grid 5.0 Participant", desc: "National tech innovation challenge, 2024.", side: "right" },
                { icon: "🌐", title: "T-Hub Visit", desc: "Practical skill-building session through community & tech exercises.", side: "left" },
              ].map((a, i) => <AchCard key={i} {...a} delay={i * 100}/>)}
            </div>
          </div>
        </Sec>

        {/* ═════ EDUCATION ═════════════════════════════════════════════ */}
        <Sec id="education" tinted>
          <div style={{ maxWidth: "860px", margin: "0 auto" }}>
            <SH label="Academic Background" title="Academic & Professional Milestones"/>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {[
                { heading: "Highest Qualification", rows: [{ l: "ACE Engineering College, Hyderabad", s: "B.Tech in Data Science Engineering (2021–2025) · CGPA: 7.71" }] },
                { heading: "Key Certifications", rows: [
                  { l: "Prompt Engineering — 1 Million Prompters (Dubai Prince)" },
                  { l: "Salesforce VIP Internship" },
                  { l: "Certified Data Science Engineering Student" },
                  { l: "UiPath RPA – Infosys Foundation" },
                ]},
              ].map(({ heading, rows }, i) => {
                const { ref, visible } = useReveal(i * 80);
                return (
                  <div key={i} ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)", transition: "opacity 0.6s ease,transform 0.6s ease" }}>
                    <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "26px 28px", transition: "border-color 0.3s,box-shadow 0.3s" }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(100,165,255,0.32)"; e.currentTarget.style.boxShadow = "0 0 20px rgba(100,165,255,0.07)"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.boxShadow = "none"; }}>
                      <p style={{ fontSize: "9px", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(110,170,255,0.65)", marginBottom: "16px" }}>{heading}</p>
                      {rows.map(({ l, s }, j) => (
                        <div key={j} style={{ marginBottom: j < rows.length - 1 ? "12px" : 0 }}>
                          <p style={{ fontSize: "14px", color: "#e0e0f0", fontWeight: 500, marginBottom: s ? "3px" : 0 }}>{l}</p>
                          {s && <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.36)" }}>{s}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Sec>

        {/* ═════ CONTACT ═══════════════════════════════════════════════ */}
        <Sec id="contact">
          <div style={{ maxWidth: "560px", margin: "0 auto", textAlign: "center" }}>
            {(() => { const { ref, visible } = useReveal(0); return (
              <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)", transition: "opacity 0.6s ease,transform 0.6s ease" }}>
                <p style={{ fontSize: "9px", letterSpacing: "0.55em", textTransform: "uppercase", color: "rgba(110,170,255,0.65)", marginBottom: "14px" }}>Let's Connect</p>
                <h2 className="font-freight" style={{ fontSize: "clamp(2rem,5vw,3.6rem)", fontWeight: 300, color: "#f0f0f0", marginBottom: "18px" }}>
                  Let's Create Something<br/>Extraordinary
                </h2>
                <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.36)", lineHeight: 1.85, marginBottom: "40px" }}>
                  I'm eager to collaborate on groundbreaking projects, share bold ideas, or join your vision to shape the future. Take the first step — connect with me today.
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "12px" }}>
                  <a href="mailto:md.shafee05s@gmail.com" style={btnSolid}
                    onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                    onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>Email Me</a>
                  <a href="https://www.linkedin.com/in/mohammad-shafee05" target="_blank" rel="noopener noreferrer" style={btnOutline}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.09)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.transform = "translateY(0)"; }}>
                    Connect on LinkedIn
                  </a>
                </div>
              </div>
            ); })()}
          </div>
        </Sec>

      </div>

      {/* ════ FLOATING PLANS WIDGET ════ */}
      <PlansWidget />
    </>
  );
}

/* ── Plans Widget ─────────────────────────────────────────────────────────── */
const PLANS = [
  { tier: "Starter",      price: "₹1,999", label: "Static Portfolio",  tagline: "Perfect for students & freshers", highlight: false, features: ["Single-page design","Mobile responsive","GitHub & LinkedIn links","Contact section","Delivered in 3 days"],      emailLabel: "Static Portfolio" },
  { tier: "Professional", price: "₹4,999", label: "Multi-Page Website", tagline: "Most popular · Best value",        highlight: true,  features: ["5–8 pages","Fully responsive","Custom animations","Contact form","Social embeds","SEO basics","Delivered in 7 days"], emailLabel: "Multi-Page Website" },
  { tier: "Business",     price: "₹9,999", label: "Business Platform",  tagline: "For startups & companies",        highlight: false, features: ["Everything in Professional","Custom domain + hosting","Business email","Payment integration","30-day support","Delivered in 14 days"], emailLabel: "Business Platform" },
];

function PlansWidget() {
  const [open, setOpen] = useState(false);
  const [pulse, setPulse] = useState(true);
  useEffect(() => { const t = setTimeout(() => setPulse(false), 4200); return () => clearTimeout(t); }, []);

  return (
    <>
      <style>{`
        @keyframes pulseRing { 0%{transform:scale(1);opacity:0.7} 100%{transform:scale(1.7);opacity:0} }
        @keyframes slideUp   { from{transform:translateY(20px);opacity:0} to{transform:translateY(0);opacity:1} }
        .plans-panel::-webkit-scrollbar{width:4px}
        .plans-panel::-webkit-scrollbar-thumb{background:rgba(100,165,255,0.2);border-radius:99px}
      `}</style>

      {open && (
        <div className="plans-panel" style={{
          position: "fixed",
          bottom: "calc(clamp(16px,4vw,28px) + 60px + env(safe-area-inset-bottom, 0px))",
          right: "clamp(16px,4vw,32px)",
          zIndex: 200, width: "min(820px, calc(100vw - 32px))",
          maxHeight: "80dvh", overflowY: "auto",
          background: "rgba(4,6,22,0.97)",
          border: "1px solid rgba(100,165,255,0.18)",
          borderRadius: "20px",
          backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
          boxShadow: "0 0 60px rgba(60,100,255,0.15), 0 24px 80px rgba(0,0,0,0.7)",
          animation: "slideUp 0.3s ease",
          padding: "28px clamp(16px,3vw,28px)",
          paddingBottom: "max(28px, env(safe-area-inset-bottom, 28px))",
        }} onClick={e => e.stopPropagation()}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "22px" }}>
            <div>
              <p style={{ fontSize: "9px", letterSpacing: "0.55em", textTransform: "uppercase", color: "rgba(100,165,255,0.6)", marginBottom: "6px" }}>Web Development</p>
              <h3 className="font-freight" style={{ fontSize: "clamp(1.4rem,3vw,2rem)", fontWeight: 300, color: "#f0f0f0", lineHeight: 1 }}>I Build Websites</h3>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.32)", marginTop: "6px" }}>Choose a plan → I'll reach out within 24 hours.</p>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: "99px", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "rgba(255,255,255,0.5)", fontSize: "16px", flexShrink: 0, transition: "background 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}>×</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(220px, 100%), 1fr))", gap: "12px" }}>
            {PLANS.map(({ tier, price, label, tagline, highlight, features, emailLabel }) => (
              <div key={tier} style={{
                position: "relative", borderRadius: "16px", padding: "22px 18px",
                border: highlight ? "1.5px solid rgba(100,165,255,0.50)" : "1px solid rgba(255,255,255,0.08)",
                background: highlight ? "rgba(30,50,110,0.35)" : "rgba(255,255,255,0.025)",
                boxShadow: highlight ? "0 0 32px rgba(100,165,255,0.10)" : "none",
                display: "flex", flexDirection: "column",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = highlight ? "0 0 48px rgba(100,165,255,0.18)" : "0 0 18px rgba(100,165,255,0.07)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = highlight ? "0 0 32px rgba(100,165,255,0.10)" : "none"; }}>
                {highlight && <span style={{ position: "absolute", top: "-10px", left: "50%", transform: "translateX(-50%)", background: "rgba(100,165,255,0.88)", color: "#fff", fontSize: "8px", fontWeight: 700, letterSpacing: "0.14em", padding: "3px 12px", borderRadius: "99px", whiteSpace: "nowrap" }}>MOST POPULAR</span>}
                <p style={{ fontSize: "8px", letterSpacing: "0.4em", textTransform: "uppercase", color: highlight ? "rgba(140,200,255,0.65)" : "rgba(110,170,255,0.45)", marginBottom: "6px" }}>{tier}</p>
                <div style={{ fontSize: "clamp(1.6rem,3vw,2rem)", fontWeight: 800, color: highlight ? "#c8e0ff" : "#e8eaf8", lineHeight: 1, marginBottom: "2px" }}>{price}</div>
                <p style={{ fontSize: "12px", fontWeight: 600, color: "#d8ddf8", marginBottom: "2px" }}>{label}</p>
                <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.30)", marginBottom: "14px", fontStyle: "italic" }}>{tagline}</p>
                <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", marginBottom: "12px" }} />
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 16px 0", flex: 1, display: "flex", flexDirection: "column", gap: "7px" }}>
                  {features.map((f, fi) => (
                    <li key={fi} style={{ display: "flex", gap: "8px", fontSize: "11.5px", color: "rgba(255,255,255,0.48)" }}>
                      <span style={{ color: highlight ? "rgba(140,210,255,0.75)" : "rgba(100,200,130,0.65)", flexShrink: 0, fontSize: "11px" }}>✓</span>{f}
                    </li>
                  ))}
                </ul>
                <a href={`mailto:md.shafee05s@gmail.com?subject=Website%20Enquiry%20—%20${encodeURIComponent(emailLabel)}`}
                  style={{ display: "block", textAlign: "center", padding: "10px 16px", borderRadius: "10px", fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", textDecoration: "none", textTransform: "uppercase", background: highlight ? "rgba(100,165,255,0.85)" : "rgba(255,255,255,0.07)", color: highlight ? "#fff" : "rgba(200,220,255,0.80)", border: highlight ? "none" : "1px solid rgba(255,255,255,0.12)", transition: "background 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.background = highlight ? "rgba(100,165,255,1)" : "rgba(255,255,255,0.13)"}
                  onMouseLeave={e => e.currentTarget.style.background = highlight ? "rgba(100,165,255,0.85)" : "rgba(255,255,255,0.07)"}>
                  Get Started →
                </a>
              </div>
            ))}
          </div>
          <p style={{ textAlign: "center", fontSize: "10px", color: "rgba(255,255,255,0.20)", marginTop: "18px" }}>
            All packages include an initial consultation · I'll respond within 24 hours
          </p>
        </div>
      )}

      {open && <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 199, background: "rgba(0,0,0,0.25)", backdropFilter: "blur(2px)", WebkitBackdropFilter: "blur(2px)" }} />}

      <div style={{ position: "fixed", bottom: "calc(clamp(16px,4vw,28px) + env(safe-area-inset-bottom, 0px))", right: "clamp(16px,4vw,32px)", zIndex: 201, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }}>
        {!open && (
          <div style={{ background: "rgba(4,6,22,0.94)", border: "1px solid rgba(100,165,255,0.22)", borderRadius: "99px", padding: "5px 14px", fontSize: "10px", color: "rgba(180,210,255,0.75)", letterSpacing: "0.06em", whiteSpace: "nowrap", backdropFilter: "blur(12px)", boxShadow: "0 4px 20px rgba(0,0,0,0.4)", opacity: pulse ? 1 : 0.85 }}>
            ✦ I build websites
          </div>
        )}
        <div style={{ position: "relative" }}>
          {pulse && !open && <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "1.5px solid rgba(100,165,255,0.5)", animation: "pulseRing 1.8s ease-out infinite", pointerEvents: "none" }} />}
          <button onClick={() => { setOpen(p => !p); setPulse(false); }}
            style={{ width: "52px", height: "52px", borderRadius: "50%", background: open ? "rgba(100,165,255,0.22)" : "rgba(4,8,28,0.95)", border: `1.5px solid ${open ? "rgba(100,165,255,0.55)" : "rgba(100,165,255,0.30)"}`, backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", cursor: "pointer", boxShadow: "0 0 24px rgba(60,100,255,0.25), 0 6px 24px rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.3s,border-color 0.3s,transform 0.2s,box-shadow 0.3s", color: "#a8ccff" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.08)"; e.currentTarget.style.boxShadow = "0 0 40px rgba(80,140,255,0.40), 0 8px 32px rgba(0,0,0,0.5)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 0 24px rgba(60,100,255,0.25), 0 6px 24px rgba(0,0,0,0.5)"; }}
            aria-label="Website plans">
            {open ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 19 9 12 22 5 9"/></svg>
            )}
          </button>
        </div>
      </div>
    </>
  );
}