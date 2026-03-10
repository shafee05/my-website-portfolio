"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";

const ParticleBackground = dynamic(
  () => import("@/components/ParticleBackground"),
  { ssr: false, loading: () => null }
);

// ─── Constants ────────────────────────────────────────────────────────────────
const PRICE_INR     = 99;
const ORIGINAL_PRICE = 199;
const PAYMENT_URL   = "https://rzp.io/rzp/VczG8Qh1";

// ─── FIXED 3-MONTH DEADLINE ───────────────────────────────────────────────────
// Set once. Change this date when you start a new coaching cohort.
// Current deadline: June 10 2026 at 23:59:59 IST
const OFFER_DEADLINE = new Date("2026-06-10T23:59:59+05:30");

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

// ─── Countdown Timer ──────────────────────────────────────────────────────────
// Fixed 3-month deadline. Does NOT reset on page reload.
// Shows 00:00:00:00 when expired and stays there permanently.
function useCountdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0, hours: 0, minutes: 0, seconds: 0, expired: false,
  });

  useEffect(() => {
    const tick = () => {
      const diff = OFFER_DEADLINE - new Date();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: true });
        return; // stops updating — stays at 00:00:00:00 forever
      }
      setTimeLeft({
        days:    Math.floor(diff / 86400000),
        hours:   Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000)  / 60000),
        seconds: Math.floor((diff % 60000)    / 1000),
        expired: false,
      });
    };

    tick(); // run immediately
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return timeLeft;
}

// ─── Gold CTA Button ──────────────────────────────────────────────────────────
function GoldButton({ children, small = false }) {
  return (
    <button
      onClick={() => window.open(PAYMENT_URL, "_blank", "noopener,noreferrer")}
      style={{
        display: "inline-flex", alignItems: "center", gap: "8px",
        background: "linear-gradient(135deg, #c8960c, #f0c040, #c8960c)",
        backgroundSize: "200% 100%",
        color: "#0a0800", border: "none", borderRadius: "99px",
        padding: small ? "12px 28px" : "16px 44px",
        fontSize: small ? "12px" : "14px", fontWeight: 700,
        letterSpacing: "0.06em", textTransform: "uppercase",
        cursor: "pointer",
        boxShadow: "0 0 28px rgba(212,175,55,0.35)",
        transition: "transform 0.2s, box-shadow 0.2s",
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 0 44px rgba(212,175,55,0.6)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)";   e.currentTarget.style.boxShadow = "0 0 28px rgba(212,175,55,0.35)"; }}
    >
      {children}
    </button>
  );
}

// ─── Section Heading ──────────────────────────────────────────────────────────
function SectionHeading({ label, title, subtitle }) {
  const { ref, visible } = useReveal(0);
  return (
    <div ref={ref} style={{ textAlign: "center", marginBottom: "52px", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(16px)", transition: "opacity 0.6s ease, transform 0.6s ease" }}>
      <p style={{ fontSize: "9px", letterSpacing: "0.55em", textTransform: "uppercase", color: "rgba(212,175,55,0.65)", marginBottom: "12px" }}>{label}</p>
      <h2 className="font-freight" style={{ fontSize: "clamp(1.9rem,4vw,3.2rem)", fontWeight: 300, color: "#f0f0f0", lineHeight: 1.1, marginBottom: subtitle ? "14px" : 0 }}>{title}</h2>
      {subtitle && <p style={{ fontSize: "clamp(13px,2vw,15px)", color: "rgba(255,255,255,0.38)", maxWidth: "540px", margin: "0 auto", lineHeight: 1.8 }}>{subtitle}</p>}
    </div>
  );
}

// ─── Offering Card ────────────────────────────────────────────────────────────
function OfferingCard({ icon, title, desc, tag, delay }) {
  const { ref, visible } = useReveal(delay);
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)", transition: "opacity 0.55s ease, transform 0.55s ease" }}>
      <div
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "28px 24px", height: "100%", transition: "border-color 0.3s, background 0.3s, box-shadow 0.3s" }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(212,175,55,0.3)"; e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.boxShadow = "0 0 24px rgba(212,175,55,0.07)"; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.boxShadow = "none"; }}
      >
        <div style={{ fontSize: "26px", marginBottom: "14px" }}>{icon}</div>
        {tag && <span style={{ display: "inline-block", marginBottom: "10px", fontSize: "8px", letterSpacing: "0.2em", textTransform: "uppercase", padding: "3px 10px", borderRadius: "99px", background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.3)", color: "rgba(212,175,55,0.85)" }}>{tag}</span>}
        <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#e8e8f0", marginBottom: "8px" }}>{title}</h3>
        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.42)", lineHeight: 1.8, margin: 0 }}>{desc}</p>
      </div>
    </div>
  );
}

// ─── FAQ Accordion ────────────────────────────────────────────────────────────
function FAQ({ question, answer, delay }) {
  const [open, setOpen] = useState(false);
  const { ref, visible } = useReveal(delay);
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(16px)", transition: "opacity 0.5s ease, transform 0.5s ease", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
      <button onClick={() => setOpen(p => !p)} style={{ width: "100%", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "22px 0", background: "none", border: "none", color: "#e8e8f0", fontSize: "clamp(14px,2vw,16px)", fontWeight: 500, cursor: "pointer", gap: "16px" }}>
        <span>{question}</span>
        <span style={{ fontSize: "20px", flexShrink: 0, color: "rgba(212,175,55,0.7)", transform: open ? "rotate(45deg)" : "rotate(0)", transition: "transform 0.3s ease" }}>+</span>
      </button>
      <div style={{ maxHeight: open ? "300px" : "0", overflow: "hidden", transition: "max-height 0.4s ease" }}>
        <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.48)", lineHeight: 1.9, paddingBottom: "22px", margin: 0 }}>{answer}</p>
      </div>
    </div>
  );
}

// ─── Countdown Display Unit ───────────────────────────────────────────────────
function CountdownUnit({ value, label }) {
  return (
    <div style={{ textAlign: "center", minWidth: "52px" }}>
      <div style={{ fontSize: "clamp(1.6rem,4vw,2.4rem)", fontWeight: 700, color: "#f0c040", lineHeight: 1, textShadow: "0 0 20px rgba(240,192,64,0.45)", fontVariantNumeric: "tabular-nums" }}>
        {String(value).padStart(2, "0")}
      </div>
      <div style={{ fontSize: "8px", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginTop: "6px" }}>{label}</div>
    </div>
  );
}

// ─── Countdown Block (full widget) ───────────────────────────────────────────
function CountdownBlock({ compact = false }) {
  const t = useCountdown();

  if (t.expired) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(212,175,55,0.15)", borderRadius: "14px", padding: compact ? "14px 18px" : "18px 24px" }}>
        <span style={{ fontSize: "12px", color: "rgba(212,175,55,0.5)", letterSpacing: "0.15em", textTransform: "uppercase" }}>
          ✦ This offer has ended — new cohort opening soon
        </span>
      </div>
    );
  }

  const sep = <div style={{ fontSize: "20px", color: "rgba(212,175,55,0.3)", marginBottom: compact ? "0" : "12px" }}>:</div>;

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: compact ? "8px" : "clamp(10px,3vw,24px)", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: "14px", padding: compact ? "12px 16px" : "18px 24px" }}>
      {!compact && <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em", textTransform: "uppercase", whiteSpace: "nowrap", marginRight: "4px" }}>Offer ends in</div>}
      <CountdownUnit label="Days" value={t.days} />
      {sep}
      <CountdownUnit label="Hrs"  value={t.hours} />
      {sep}
      <CountdownUnit label="Min"  value={t.minutes} />
      {sep}
      <CountdownUnit label="Sec"  value={t.seconds} />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function CoachingPage() {
  const heroRef = useRef(null);
  const [heroVisible, setHeroVisible] = useState(false);
  const [showStickyCTA, setShowStickyCTA] = useState(false);
  const t = useCountdown();
  const spotsLeft = 7;

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setHeroVisible(true); obs.disconnect(); } }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const fn = () => setShowStickyCTA(window.scrollY > 600);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const offerings = [
    { icon: "🧠", title: "Clarity Coaching",        tag: "1-on-1",   desc: "Cut through the noise and identify exactly what you want — career, purpose, or personal direction. Deep-focus sessions built around your unique situation." },
    { icon: "🎯", title: "Goal Architecture",        tag: "Strategy", desc: "Turn vague ambitions into concrete, measurable milestones. Build a roadmap that actually gets executed, not just written down." },
    { icon: "⚡", title: "AI Career Mentorship",    tag: "Tech + AI", desc: "Leverage your data science and AI skills to land roles, build projects, or launch ideas. From resume to portfolio to interview — complete guidance." },
    { icon: "🌙", title: "Inner Discipline & Focus", tag: "Mindset",  desc: "Inspired by The Arcana of Ascent — techniques for silence, inner clarity, and building the discipline that outlasts motivation." },
    { icon: "🚀", title: "Startup & Brand Building", tag: "Founder",  desc: "From idea to launch — strategy, positioning, audience building, and the mindset shifts that turn vision into traction." },
    { icon: "📖", title: "Reading & Reflection",     tag: "Growth",   desc: "Curated reading plans and reflection frameworks to compound your thinking over time. Learn faster, retain deeper." },
  ];

  const faqs = [
    { q: "Who is this coaching for?", a: "Students, fresh graduates, and aspiring founders who feel stuck between potential and action. If you know you're capable of more but can't figure out the next step — this session is built for you." },
    { q: "What happens after I pay?", a: "Within 6 hours of payment, you'll receive an email with your confirmed session date, time, and the Google Meet link. If you've mentioned a preferred slot in the Razorpay notes, I'll honour it wherever possible. Check your spam folder if you don't see it." },
    { q: "Is this session online or in-person?", a: "All sessions are conducted virtually via Google Meet — so you can join from anywhere." },
    { q: "What if I need to reschedule?", a: "Reach out at least 6 hours in advance and I'll reschedule. No-shows are not rescheduled, but genuine emergencies are always handled." },
    { q: "Why only ₹99?", a: "This is introductory pricing to make coaching accessible to students and early-career professionals. The price will increase after the first cohort fills up." },
    { q: "What makes this different from YouTube or books?", a: "Books give information. Coaching gives direction. In one session you get someone who listens to your specific situation and helps you cut through the noise — that's impossible to replicate with passive content." },
  ];

  return (
    <>
      <ParticleBackground />
      <div style={{ position: "fixed", inset: 0, background: "rgba(6,8,18,0.88)", zIndex: 0, pointerEvents: "none" }} />

      <main style={{ position: "relative", zIndex: 1, color: "#f0f0f0", overflowX: "hidden", width: "100%", boxSizing: "border-box" }}>

        {/* ── HERO ────────────────────────────────────────────────────────── */}
        <section style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "clamp(120px,20vw,160px) clamp(20px,6vw,80px) 80px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "45%", left: "50%", transform: "translate(-50%,-50%)", width: "min(800px,90vw)", height: "400px", background: "radial-gradient(ellipse, rgba(80,60,10,0.18) 0%, transparent 65%)", pointerEvents: "none" }} />

          <div ref={heroRef} style={{ position: "relative", zIndex: 2, maxWidth: "720px", opacity: heroVisible ? 1 : 0, transform: heroVisible ? "translateY(0)" : "translateY(32px)", transition: "opacity 1s ease, transform 1s ease" }}>
            <p style={{ fontSize: "9px", letterSpacing: "0.6em", textTransform: "uppercase", color: "rgba(212,175,55,0.7)", marginBottom: "18px" }}>
              Life Coaching · By Mohammad Shafee
            </p>
            <h1 className="font-freight" style={{ fontSize: "clamp(2.8rem,7vw,6.5rem)", fontWeight: 300, lineHeight: 0.98, color: "#f0f0f0", marginBottom: "28px", letterSpacing: "-0.02em" }}>
              Find Your Direction.<br />
              <span style={{ color: "rgba(212,175,55,0.9)" }}>Build Your Future.</span>
            </h1>
            <p style={{ fontSize: "clamp(14px,2vw,17px)", color: "rgba(255,255,255,0.42)", lineHeight: 1.9, maxWidth: "580px", margin: "0 auto 40px" }}>
              One-on-one coaching for students, graduates, and aspiring founders who know they're capable of more — and need a clear path to get there.
            </p>

            {/* Hero inline countdown */}
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: "12px", marginBottom: "40px" }}>
              <div style={{ background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.3)", borderRadius: "99px", padding: "8px 20px", fontSize: "12px", color: "rgba(240,192,64,0.9)", letterSpacing: "0.04em" }}>
                ⚡ {spotsLeft} spots left at ₹{PRICE_INR}
              </div>
              {!t.expired && (
                <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "99px", padding: "8px 18px", fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>
                  🕐 Offer ends in&nbsp;
                  <span style={{ color: "#f0c040", fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
                    {String(t.days).padStart(2,"0")}d {String(t.hours).padStart(2,"0")}h {String(t.minutes).padStart(2,"0")}m {String(t.seconds).padStart(2,"0")}s
                  </span>
                </div>
              )}
              {t.expired && (
                <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "99px", padding: "8px 18px", fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>
                  ✦ New cohort opening soon
                </div>
              )}
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "12px" }}>
              <GoldButton>Book a Session → ₹{PRICE_INR}</GoldButton>
              <Link href="/the-team"
                style={{ display: "inline-block", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.14)", color: "#e0e0e0", borderRadius: "99px", padding: "16px 30px", fontSize: "13px", letterSpacing: "0.04em", textDecoration: "none", transition: "background 0.25s, transform 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.10)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.transform = "translateY(0)"; }}>
                My Journey
              </Link>
            </div>
          </div>

          <div style={{ position: "absolute", bottom: "28px", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", opacity: 0.28, animation: "bob 2.2s ease-in-out infinite" }}>
            <span style={{ fontSize: "9px", letterSpacing: "0.3em", textTransform: "uppercase" }}>scroll</span>
            <div style={{ width: "1px", height: "28px", background: "rgba(255,255,255,0.5)" }} />
          </div>
          <style>{`@keyframes bob{0%,100%{transform:translateX(-50%) translateY(0)}50%{transform:translateX(-50%) translateY(6px)}} @keyframes shimmer{0%{background-position:-100% 0}100%{background-position:200% 0}}`}</style>
        </section>

        {/* ── IMPACT STATS ──────────────────────────────────────────────────── */}
        <section style={{ padding: "70px clamp(20px,5vw,60px)", background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.05)", width: "100%", boxSizing: "border-box" }}>
          <div style={{ maxWidth: "900px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px,1fr))", gap: "32px" }}>
            {[{ num: "92%", label: "Gained clarity on their DMP" }, { num: "88%", label: "Took bold action within 2 weeks" }, { num: "81%", label: "Reduced self-doubt significantly" }, { num: "100%", label: "Felt deeply seen & heard" }].map(({ num, label }, i) => {
              const { ref, visible } = useReveal(i * 80);
              return (
                <div key={i} ref={ref} style={{ textAlign: "center", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)", transition: "opacity 0.6s ease, transform 0.6s ease" }}>
                  <div style={{ fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 700, color: "#f0c040", lineHeight: 1, textShadow: "0 0 20px rgba(240,192,64,0.3)" }}>{num}</div>
                  <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.38)", letterSpacing: "0.05em", marginTop: "8px", lineHeight: 1.5 }}>{label}</div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── WHO IS THIS FOR ───────────────────────────────────────────────── */}
        <section style={{ padding: "90px clamp(20px,5vw,60px)", borderTop: "1px solid rgba(255,255,255,0.05)", width: "100%", boxSizing: "border-box" }}>
          <div style={{ maxWidth: "960px", margin: "0 auto" }}>
            <SectionHeading label="Who It's For" title="Built for the Ambitious & Uncertain" subtitle="You know you're capable of more — you just need the right framework, someone who's been through it, and the space to think clearly." />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(280px,100%), 1fr))", gap: "14px" }}>
              {[{ icon: "🎓", label: "Final-year students figuring out their next step" }, { icon: "💼", label: "Graduates struggling to break into AI or tech roles" }, { icon: "🤖", label: "Aspiring AI practitioners who want a real roadmap" }, { icon: "🌱", label: "Founders with an idea but no clear path forward" }, { icon: "🧭", label: "Anyone feeling lost between potential and action" }, { icon: "📚", label: "People who want to think more clearly and intentionally" }].map(({ icon, label }, i) => {
                const { ref, visible } = useReveal(i * 60);
                return (
                  <div key={i} ref={ref} style={{ display: "flex", alignItems: "center", gap: "14px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", padding: "16px 18px", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(16px)", transition: "opacity 0.5s ease, transform 0.5s ease" }}>
                    <span style={{ fontSize: "20px", flexShrink: 0 }}>{icon}</span>
                    <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>{label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── OFFERINGS ─────────────────────────────────────────────────────── */}
        <section style={{ padding: "90px clamp(20px,5vw,60px)", background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.05)", width: "100%", boxSizing: "border-box" }}>
          <div style={{ maxWidth: "960px", margin: "0 auto" }}>
            <SectionHeading label="What We Cover" title="Areas of Coaching" subtitle="Each session is tailored. These are the domains I work in most." />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(280px,100%), 1fr))", gap: "14px" }}>
              {offerings.map((o, i) => <OfferingCard key={i} {...o} delay={i * 60} />)}
            </div>
          </div>
        </section>

        {/* ── HOW TO BOOK ───────────────────────────────────────────────────── */}
        <section style={{ padding: "90px clamp(20px,5vw,60px)", borderTop: "1px solid rgba(255,255,255,0.05)", width: "100%", boxSizing: "border-box" }}>
          <div style={{ maxWidth: "820px", margin: "0 auto" }}>
            <SectionHeading label="Booking Process" title="How to Book Your Session" subtitle="Four simple steps — takes less than 2 minutes." />

            <div style={{ display: "flex", flexDirection: "column" }}>
              {[
                { step: "01", icon: "👆", title: "Click the Book Now button", desc: "Hit the gold button below. It opens the secure Razorpay payment page — no account needed, works on any device." },
                { step: "02", icon: "📝", title: "Fill in your details on Razorpay", desc: "Enter your name, email, and phone number on the Razorpay page. In the Notes field, mention your preferred time slot — Slot 1 (6–7 PM), Slot 2 (7:20–8:20 PM), or Slot 3 (8:40–9:40 PM) — and I'll accommodate it wherever possible." },
                { step: "03", icon: "💳", title: "Complete the ₹99 payment", desc: "Pay securely via UPI, card, net banking, or any wallet. The entire transaction is handled by Razorpay — your details are fully encrypted and secure." },
                { step: "04", icon: "📧", title: "Receive your session confirmation", desc: "Within 6 hours of payment, you'll get an email with your confirmed session date, time, and the Google Meet link. Check your spam folder if it doesn't arrive." },
              ].map(({ step, icon, title, desc }, i) => {
                const { ref, visible } = useReveal(i * 80);
                return (
                  <div key={i} ref={ref} style={{ display: "flex", gap: "clamp(16px,4vw,32px)", alignItems: "flex-start", padding: "32px 0", borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.05)" : "none", opacity: visible ? 1 : 0, transform: visible ? "translateX(0)" : "translateX(-20px)", transition: "opacity 0.55s ease, transform 0.55s ease" }}>
                    <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                      <div style={{ width: "56px", height: "56px", background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", flexShrink: 0 }}>
                        {icon}
                      </div>
                      <span style={{ fontSize: "10px", color: "rgba(212,175,55,0.4)", fontWeight: 700, letterSpacing: "0.05em" }}>{step}</span>
                    </div>
                    <div style={{ paddingTop: "4px" }}>
                      <h3 style={{ fontSize: "clamp(15px,2vw,17px)", fontWeight: 600, color: "#e8e8f0", marginBottom: "10px" }}>{title}</h3>
                      <p style={{ fontSize: "13.5px", color: "rgba(255,255,255,0.44)", lineHeight: 1.85, margin: 0 }}>{desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ textAlign: "center", marginTop: "48px" }}>
              <GoldButton>Book Now → ₹{PRICE_INR}</GoldButton>
              <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.28)", marginTop: "14px" }}>
                Opens Razorpay securely in a new tab · {spotsLeft} spots remaining at this price
              </p>
            </div>
          </div>
        </section>

        {/* ── FULL COUNTDOWN + GOLD CARD ────────────────────────────────────── */}
        <section style={{ padding: "90px clamp(20px,5vw,60px)", background: "rgba(30,20,0,0.35)", borderTop: "1px solid rgba(212,175,55,0.1)", width: "100%", boxSizing: "border-box", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "min(700px,100vw)", height: "380px", background: "radial-gradient(ellipse, rgba(212,175,55,0.06), transparent 70%)", pointerEvents: "none" }} />

          <div style={{ maxWidth: "540px", margin: "0 auto", position: "relative", zIndex: 1 }}>
            <div style={{ textAlign: "center", marginBottom: "32px" }}>
              <p style={{ fontSize: "9px", letterSpacing: "0.55em", textTransform: "uppercase", color: "rgba(212,175,55,0.65)", marginBottom: "12px" }}>Investment</p>
              <h2 className="font-freight" style={{ fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 300, color: "#f0f0f0", marginBottom: "10px" }}>Invest in Your Purpose</h2>
              <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", lineHeight: 1.8 }}>One session can shift your trajectory.</p>
            </div>

            {/* Big countdown widget */}
            <CountdownBlock />

            {/* Deadline label */}
            <p style={{ textAlign: "center", fontSize: "10px", color: "rgba(255,255,255,0.22)", letterSpacing: "0.1em", margin: "10px 0 24px", textTransform: "uppercase" }}>
              Introductory price expires · June 10, 2026
            </p>

            {/* Gold card */}
            <div style={{ position: "relative", background: "linear-gradient(135deg, rgba(120,90,10,0.92) 0%, rgba(55,42,5,0.96) 45%, rgba(100,75,8,0.92) 100%)", border: "1.5px solid rgba(212,175,55,0.6)", borderRadius: "24px", padding: "clamp(28px,5vw,40px)", overflow: "hidden", boxShadow: "0 0 60px rgba(212,175,55,0.15), inset 0 1px 0 rgba(255,255,255,0.1)" }}>
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.06) 50%, transparent 70%)", backgroundSize: "200% 100%", animation: "shimmer 3s infinite linear", pointerEvents: "none" }} />

              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "22px" }}>
                  <div>
                    <h3 className="font-freight" style={{ fontSize: "clamp(1.2rem,3vw,1.7rem)", fontWeight: 700, color: "#fff8e7", marginBottom: "4px" }}>One-on-One Coaching</h3>
                    <p style={{ fontSize: "11px", color: "rgba(255,240,180,0.6)", letterSpacing: "0.08em" }}>60 MIN · VIRTUAL · CONFIDENTIAL</p>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontSize: "clamp(2rem,5vw,2.8rem)", fontWeight: 900, color: "#fff8e7", lineHeight: 1 }}>₹{PRICE_INR}</div>
                    <div style={{ fontSize: "12px", color: "rgba(255,240,180,0.45)", textDecoration: "line-through" }}>₹{ORIGINAL_PRICE}</div>
                  </div>
                </div>

                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 22px 0", display: "flex", flexDirection: "column", gap: "10px" }}>
                  {["Active listening & powerful questioning", "DMP (Definite Major Purpose) alignment", "Fear-facing & mindset reframing tools", "Concrete action steps to take immediately", "Session recap summary via email"].map((item, i) => (
                    <li key={i} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", color: "rgba(255,240,180,0.82)" }}>
                      <span style={{ color: "#a8e6a3", fontSize: "15px", flexShrink: 0 }}>✓</span>
                      {item}
                    </li>
                  ))}
                </ul>

                <div style={{ height: "1px", background: "rgba(255,255,255,0.1)", marginBottom: "20px" }} />

                <p style={{ fontSize: "11.5px", color: "rgba(255,240,180,0.55)", lineHeight: 1.8, marginBottom: "20px", textAlign: "center" }}>
                  Mention your preferred time slot in the Razorpay notes.<br />
                  Confirmation email arrives within <strong style={{ color: "rgba(255,240,180,0.85)" }}>6 hours</strong> of payment.
                </p>

                <button
                  onClick={() => window.open(PAYMENT_URL, "_blank", "noopener,noreferrer")}
                  style={{ width: "100%", background: "rgba(0,0,0,0.45)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff8e7", borderRadius: "14px", padding: "18px", fontSize: "15px", fontWeight: 700, cursor: "pointer", letterSpacing: "0.05em", transition: "background 0.25s, transform 0.2s", marginBottom: "12px" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,0,0,0.62)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(0,0,0,0.45)"; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  🗓 Reserve My Session — ₹{PRICE_INR}
                </button>

                <p style={{ textAlign: "center", fontSize: "10px", color: "rgba(255,240,180,0.4)", margin: 0 }}>
                  ⏳ {spotsLeft} spots remaining · Secure payment via Razorpay
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── ABOUT THE COACH ───────────────────────────────────────────────── */}
        <section style={{ padding: "90px clamp(20px,5vw,60px)", borderTop: "1px solid rgba(255,255,255,0.05)", width: "100%", boxSizing: "border-box" }}>
          <div style={{ maxWidth: "900px", margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(300px,100%), 1fr))", gap: "60px", alignItems: "center" }}>
              {(() => { const { ref, visible } = useReveal(0); return (
                <div ref={ref} style={{ opacity: visible?1:0, transform: visible?"translateX(0)":"translateX(-28px)", transition: "opacity 0.7s ease, transform 0.7s ease", display: "flex", justifyContent: "center" }}>
                  <div style={{ position: "relative", width: "min(260px,80vw)", height: "min(260px,80vw)", borderRadius: "50%", overflow: "hidden", border: "2px solid rgba(212,175,55,0.35)", boxShadow: "0 0 40px rgba(212,175,55,0.12)" }}>
                    <Image src="/images/portfolio-headshot.png" alt="Mohammad Shafee" fill className="object-cover" />
                  </div>
                </div>
              ); })()}
              {(() => { const { ref, visible } = useReveal(120); return (
                <div ref={ref} style={{ opacity: visible?1:0, transform: visible?"translateX(0)":"translateX(28px)", transition: "opacity 0.7s ease, transform 0.7s ease" }}>
                  <p style={{ fontSize: "9px", letterSpacing: "0.5em", textTransform: "uppercase", color: "rgba(212,175,55,0.65)", marginBottom: "12px" }}>Your Coach</p>
                  <h2 className="font-freight" style={{ fontSize: "clamp(1.8rem,3.5vw,2.8rem)", fontWeight: 300, color: "#f0f0f0", marginBottom: "20px" }}>Mohammad Shafee</h2>
                  <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.48)", lineHeight: 1.9, marginBottom: "14px" }}>
                    Data Science Engineer, Gen AI Developer, and founder of XAFAM — four years navigating the space between ambitious ideas and real outcomes.
                  </p>
                  <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.48)", lineHeight: 1.9, marginBottom: "14px" }}>
                    I've built real-time AI systems, published a book, won hackathons, and started a brand from zero. I coach from lived experience — not theory.
                  </p>
                  <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.48)", lineHeight: 1.9, marginBottom: "24px" }}>
                    My philosophy: clarity is earned, not given. Discipline, not motivation, is what moves things forward.
                  </p>
                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    {["AI & Data Science", "Author", "Brand Founder", "Life Coach"].map((tag, i) => (
                      <span key={i} style={{ fontSize: "10px", letterSpacing: "0.1em", padding: "4px 12px", borderRadius: "99px", background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.3)", color: "rgba(212,175,55,0.85)" }}>{tag}</span>
                    ))}
                  </div>
                </div>
              ); })()}
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ──────────────────────────────────────────────────── */}
        <section style={{ padding: "90px clamp(20px,5vw,60px)", background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.05)", width: "100%", boxSizing: "border-box" }}>
          <div style={{ maxWidth: "960px", margin: "0 auto" }}>
            <SectionHeading label="Voices" title="What People Say" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(280px,100%), 1fr))", gap: "14px" }}>
              {[{ quote: "I finally understood what I'm here to do. Fear no longer runs my decisions.", name: "Rohan M.", context: "Data Science Graduate, Hyderabad" }, { quote: "The clarity I got in one session was worth more than months of overthinking. He doesn't tell you what to do — he helps you see what you already know.", name: "Priya K.", context: "Engineering Student" }, { quote: "I came with a vague idea for a brand. I left with a 6-month plan and the confidence to actually start.", name: "Faisal A.", context: "Aspiring Founder" }].map(({ quote, name, context }, i) => {
                const { ref, visible } = useReveal(i * 80);
                return (
                  <div key={i} ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)", transition: "opacity 0.55s ease, transform 0.55s ease", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "26px 22px" }}>
                    <div style={{ fontSize: "22px", color: "rgba(212,175,55,0.5)", marginBottom: "12px" }}>"</div>
                    <p style={{ fontSize: "13.5px", color: "rgba(255,255,255,0.55)", lineHeight: 1.85, marginBottom: "18px", fontStyle: "italic" }}>{quote}</p>
                    <div style={{ fontSize: "13px", fontWeight: 600, color: "#e0e0f0" }}>{name}</div>
                    <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", letterSpacing: "0.06em", marginTop: "3px" }}>{context}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── FAQ ───────────────────────────────────────────────────────────── */}
        <section style={{ padding: "90px clamp(20px,5vw,60px)", borderTop: "1px solid rgba(255,255,255,0.05)", width: "100%", boxSizing: "border-box" }}>
          <div style={{ maxWidth: "760px", margin: "0 auto" }}>
            <SectionHeading label="Questions" title="Frequently Asked" />
            {faqs.map(({ q, a }, i) => <FAQ key={i} question={q} answer={a} delay={i * 50} />)}
          </div>
        </section>

        {/* ── FINAL CTA ─────────────────────────────────────────────────────── */}
        <section style={{ padding: "90px clamp(20px,5vw,60px)", textAlign: "center", background: "rgba(30,20,0,0.3)", borderTop: "1px solid rgba(212,175,55,0.1)", width: "100%", boxSizing: "border-box" }}>
          <div style={{ maxWidth: "560px", margin: "0 auto" }}>
            <div style={{ fontSize: "36px", marginBottom: "20px", filter: "drop-shadow(0 0 12px rgba(212,175,55,0.4))" }}>✦</div>
            <h2 className="font-freight" style={{ fontSize: "clamp(2rem,4.5vw,3.2rem)", fontWeight: 300, color: "#f0f0f0", marginBottom: "16px" }}>Ready to Get Clarity?</h2>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", lineHeight: 1.85, marginBottom: "40px" }}>
              One honest conversation can shift everything. Reach out — no commitment, no pressure, just clarity.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "12px" }}>
              <GoldButton>Book Now → ₹{PRICE_INR}</GoldButton>
              <a href="mailto:md.shafee05s@gmail.com"
                style={{ display: "inline-block", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.14)", color: "#e0e0e0", borderRadius: "99px", padding: "16px 28px", fontSize: "13px", letterSpacing: "0.04em", textDecoration: "none", transition: "background 0.25s, transform 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.10)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.transform = "translateY(0)"; }}>
                Email Me
              </a>
            </div>
          </div>
        </section>

      </main>

      {/* ── Sticky CTA ────────────────────────────────────────────────────── */}
      <div style={{ position: "fixed", bottom: "20px", right: "20px", zIndex: 50, opacity: showStickyCTA ? 1 : 0, transform: showStickyCTA ? "translateY(0)" : "translateY(20px)", transition: "opacity 0.4s ease, transform 0.4s ease", pointerEvents: showStickyCTA ? "auto" : "none" }}>
        <button
          onClick={() => window.open(PAYMENT_URL, "_blank", "noopener,noreferrer")}
          style={{ background: "linear-gradient(135deg, #c8960c, #f0c040)", color: "#0a0800", border: "none", borderRadius: "99px", padding: "14px 28px", fontSize: "13px", fontWeight: 700, cursor: "pointer", letterSpacing: "0.06em", boxShadow: "0 0 30px rgba(212,175,55,0.6)", transition: "transform 0.2s" }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
        >
          ⭐ Book Now
        </button>
      </div>
    </>
  );
}