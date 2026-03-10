"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";

const ParticleBackground = dynamic(() => import("@/components/ParticleBackground"), { ssr: false, loading: () => null });

// ─── Hook — called only at top level of components below ─────────────────────
function useReveal(delay = 0) {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    let tm;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { tm = setTimeout(() => setV(true), delay); obs.disconnect(); }
    }, { threshold: 0.05, rootMargin: "0px 0px -40px 0px" });
    obs.observe(el);
    return () => { obs.disconnect(); clearTimeout(tm); };
  }, []); // empty deps — intentional, delay is captured at mount
  return { ref, visible: v };
}

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const IconGithub = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.341-3.369-1.341-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
  </svg>
);
const IconLinkedIn = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);
const IconMail = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);
const IconCopy = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
  </svg>
);
const IconPin = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);

// ─── CV Data ──────────────────────────────────────────────────────────────────
const SKILLS = [
  { group: "Programming",            items: ["Python", "C++", "SQL"] },
  { group: "AI & Machine Learning",  items: ["Generative AI", "NLP", "Prompt Engineering", "LightGBM", "ML Prediction Models"] },
  { group: "Frameworks & Libraries", items: ["PyTorch", "Hugging Face", "LangChain"] },
  { group: "Web Technologies",       items: ["HTML", "CSS", "React"] },
  { group: "Tools & Systems",        items: ["Git", "Linux", "Power BI", "MS Office"] },
  { group: "Core Concepts",          items: ["DSA", "OOP", "Model Evaluation", "Workflow Automation"] },
];

const EXPERIENCE = [
  {
    role: "Python Engineer Intern — Generative AI",
    company: "ADVI Group of Companies",
    location: "Hyderabad, India",
    period: "Feb 2025 – Jul 2025",
    bullets: [
      "Designed and deployed LLM-based automation pipelines using Hugging Face and LangChain for structured and unstructured data.",
      "Automated internal workflows, reducing team processing effort by 30%.",
      "Optimised prompt design and backend inference, improving overall system efficiency by 25%.",
      "Led testing and documentation to ensure reliability and smooth handoff of AI modules.",
    ],
  },
];

const PROJECTS = [
  {
    title: "GestureTalk",
    subtitle: "Real-Time Sign Language Recognition",
    year: "2025",
    desc: "Computer vision + NLP system using YOLO, DWpose, and PyTorch for real-time sign language translation. Achieved 25 FPS inference with translation accuracy above 92%.",
    tags: ["Python", "YOLO", "PyTorch", "Computer Vision", "NLP"],
    category: "AI",
    href: "https://github.com/shafee05/GestureTalk-Sign-Language-Recognition",
    image: "/images/gesturetalk.jpg",
    metric: "92% accuracy",
    metricB: "25 FPS",
  },
  {
    title: "Cricket Performance Prediction",
    subtitle: "ML Pipeline · LightGBM",
    year: "2024",
    desc: "ML pipeline in Python using LightGBM trained on historical player and match data. Improved prediction accuracy by 15% RMSE reduction over baseline models.",
    tags: ["Python", "LightGBM", "Data Science", "ML"],
    category: "AI",
    href: "https://github.com/shafee05/Cricket-Player-Performance-prediction",
    image: "/images/cricket.jpg",
    metric: "−15% RMSE",
    metricB: "vs. baseline",
  },
  {
    title: "Personal Habit Tracker",
    subtitle: "React + TypeScript · AI-Assisted",
    year: "2025",
    desc: "Modular React + TypeScript web application. Structured use of Generative AI prompts to accelerate development while owning all logic and design decisions.",
    tags: ["React", "TypeScript", "Gen AI"],
    category: "Web",
    href: "#",
    metric: "AI-assisted",
    metricB: "Full-stack",
  },
];

const EDUCATION = [
  { degree: "B.Tech — Computer Science (Data Science)", institution: "ACE Engineering College, Hyderabad", period: "2021 – 2025", detail: "CGPA 7.71" },
  { degree: "MPC — Maths, Physics, Chemistry",          institution: "Narayana Junior College, Hyderabad",  period: "2019 – 2021", detail: "92.3%" },
];

const CERTS = [
  { name: "Prompt Engineering for Generative AI", issuer: "Industry Certified" },
  { name: "Python Programming",                   issuer: "Rinex" },
  { name: "UiPath RPA Fundamentals",              issuer: "Infosys Foundation" },
  { name: "Data Science AI Interview Certified",  issuer: "Micro1" },
  { name: "Business English Certificate",         issuer: "Cambridge University" },
];

// ─── Atom components (each calls useReveal internally — hooks-safe) ───────────
function Pill({ label, accent }) {
  return (
    <span style={{
      fontSize: "9px", letterSpacing: "0.12em", padding: "3px 9px", borderRadius: "99px",
      background: accent ? "rgba(100,165,255,0.10)" : "rgba(255,255,255,0.06)",
      border: accent ? "1px solid rgba(100,165,255,0.28)" : "1px solid rgba(255,255,255,0.10)",
      color: accent ? "rgba(160,210,255,0.85)" : "rgba(200,215,255,0.55)",
      whiteSpace: "nowrap",
    }}>{label}</span>
  );
}

function Rule() {
  return <div style={{ height: "1px", background: "rgba(255,255,255,0.05)", margin: "56px 0" }} />;
}

function SecLabel({ text }) {
  return <p style={{ fontSize: "9px", letterSpacing: "0.6em", textTransform: "uppercase", color: "rgba(100,165,255,0.55)", marginBottom: "32px" }}>{text}</p>;
}

// Proper component — useReveal called at top level
function ProjectCard({ proj }) {
  const { ref, visible } = useReveal(0);
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(16px)", transition: "opacity 0.5s ease, transform 0.5s ease", willChange: "opacity, transform" }}>
      <div
        style={{ display: "flex", background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", overflow: "hidden", transition: "border-color 0.3s, box-shadow 0.3s", cursor: proj.href !== "#" ? "pointer" : "default" }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(100,165,255,0.28)"; e.currentTarget.style.boxShadow = "0 0 24px rgba(60,120,255,0.08)"; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.boxShadow = "none"; }}
        onClick={() => { if (proj.href !== "#") window.open(proj.href, "_blank"); }}
      >
        {proj.image && (
          <div style={{ position: "relative", width: "clamp(72px,14vw,110px)", flexShrink: 0 }}>
            <Image src={proj.image} alt={proj.title} fill style={{ objectFit: "cover", opacity: 0.50 }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, transparent 40%, rgba(3,5,18,1))" }} />
          </div>
        )}
        <div style={{ flex: 1, padding: "20px clamp(16px,3vw,26px)", minWidth: 0 }}>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-start", gap: "6px", marginBottom: "6px" }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                <h3 style={{ fontSize: "clamp(14px,2vw,16px)", fontWeight: 600, color: "#e4e8f8", margin: 0 }}>{proj.title}</h3>
                {proj.href !== "#" && (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "10px", color: "rgba(140,200,255,0.55)" }}>
                    <IconGithub /> View
                  </span>
                )}
              </div>
              <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.30)", marginTop: "2px", marginBottom: 0 }}>{proj.subtitle}</p>
            </div>
            <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.25)", flexShrink: 0 }}>{proj.year}</span>
          </div>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.42)", lineHeight: 1.82, margin: "10px 0 12px" }}>{proj.desc}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", alignItems: "center" }}>
            {proj.tags.map(t => <Pill key={t} label={t} accent />)}
            <div style={{ marginLeft: "auto", display: "flex", gap: "5px", flexWrap: "wrap", justifyContent: "flex-end" }}>
              <span style={{ fontSize: "9px", color: "rgba(100,200,140,0.85)", background: "rgba(100,200,140,0.08)", border: "1px solid rgba(100,200,140,0.18)", padding: "2px 8px", borderRadius: "99px", whiteSpace: "nowrap" }}>✓ {proj.metric}</span>
              <span style={{ fontSize: "9px", color: "rgba(200,215,255,0.55)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", padding: "2px 8px", borderRadius: "99px", whiteSpace: "nowrap" }}>{proj.metricB}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SkillGroup({ group, items }) {
  const { ref, visible } = useReveal(0);
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(14px)", transition: "opacity 0.45s ease, transform 0.45s ease", willChange: "opacity, transform", background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", padding: "18px" }}
      onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(100,165,255,0.22)"}
      onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"}>
      <p style={{ fontSize: "8px", letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(100,165,255,0.50)", marginBottom: "12px" }}>{group}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
        {items.map(item => <Pill key={item} label={item} accent />)}
      </div>
    </div>
  );
}

function CertCard({ name, issuer }) {
  const { ref, visible } = useReveal(0);
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(12px)", transition: "opacity 0.45s ease, transform 0.45s ease", willChange: "opacity, transform", display: "flex", gap: "12px", alignItems: "flex-start", background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", padding: "16px 18px" }}
      onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(100,165,255,0.22)"}
      onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"}>
      <span style={{ color: "rgba(100,200,130,0.70)", fontSize: "13px", flexShrink: 0, marginTop: "1px" }}>✓</span>
      <div style={{ minWidth: 0 }}>
        <p style={{ fontSize: "12.5px", fontWeight: 500, color: "#dde0f0", marginBottom: "3px", lineHeight: 1.4 }}>{name}</p>
        <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.28)", letterSpacing: "0.04em" }}>{issuer}</p>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Portfolio() {
  const [filter, setFilter]     = useState("All");
  const [copied, setCopied]     = useState(false);
  const [progress, setProgress] = useState(0);

  // Each section reveal — hooks at top level ✓
  const { ref: heroRef,   visible: heroIn }   = useReveal(0);
  const { ref: expRef,    visible: expIn }    = useReveal(0);
  const { ref: projRef,   visible: projIn }   = useReveal(0);
  const { ref: skillsRef, visible: skillsIn } = useReveal(0);
  const { ref: eduRef,    visible: eduIn }    = useReveal(0);
  const { ref: certRef,   visible: certIn }   = useReveal(0);
  const { ref: ctaRef,    visible: ctaIn }    = useReveal(0);

  useEffect(() => {
    const h = () => {
      const d = document.documentElement;
      const pct = d.scrollTop / (d.scrollHeight - d.clientHeight);
      setProgress(isNaN(pct) ? 0 : pct);
    };
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const copyEmail = () => {
    navigator.clipboard.writeText("md.shafee05s@gmail.com").then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 2200);
    });
  };

  const filtered = filter === "All" ? PROJECTS : PROJECTS.filter(p => p.category === filter);

  return (
    <>
      <ParticleBackground />
      <div style={{ position: "fixed", inset: 0, background: "rgba(2,4,14,0.90)", zIndex: 0, pointerEvents: "none" }} />
      <div style={{ position: "fixed", top: 0, left: 0, zIndex: 100, height: "2px", background: "linear-gradient(to right,#4a9eff,#7b4fff)", width: `${progress * 100}%`, transition: "width 0.1s linear" }} />

      <div style={{ position: "relative", zIndex: 1, color: "#f0f0f0", minHeight: "100dvh", overflowX: "hidden", maxWidth: "100vw", boxSizing: "border-box" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto", padding: "0 clamp(20px,5vw,60px)" }}>

          {/* ── HERO ──────────────────────────────────────────────────── */}
          <div ref={heroRef} style={{ paddingTop: "clamp(56px,10dvh,96px)", opacity: heroIn ? 1 : 0, transform: heroIn ? "translateY(0)" : "translateY(28px)", transition: "opacity 0.9s ease, transform 0.9s ease" }}>
            <p style={{ fontSize: "9px", letterSpacing: "0.6em", textTransform: "uppercase", color: "rgba(100,165,255,0.55)", marginBottom: "28px" }}>Portfolio · 2025</p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "clamp(20px,4vw,40px)", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "24px" }}>
              <div style={{ flex: "1 1 300px", minWidth: 0 }}>
                <h1 className="font-freight" style={{ fontSize: "clamp(2.4rem,6vw,4.6rem)", fontWeight: 200, color: "#f0f0f0", lineHeight: 0.95, letterSpacing: "-0.025em", marginBottom: "16px" }}>
                  Mohammad Shafee ur rahaman
                </h1>
                <p style={{ fontSize: "clamp(12px,1.8vw,14px)", color: "rgba(100,165,255,0.75)", fontWeight: 500, letterSpacing: "0.04em", marginBottom: "18px" }}>
                  AI Engineer · Data Scientist · Gen AI Specialist
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "14px", fontSize: "12px", color: "rgba(255,255,255,0.35)", alignItems: "center" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "5px" }}><IconPin /> Hyderabad, India</span>
                  <a href="mailto:md.shafee05s@gmail.com" style={{ display: "flex", alignItems: "center", gap: "5px", color: "rgba(130,190,255,0.7)", textDecoration: "none" }}><IconMail /> md.shafee05s@gmail.com</a>
                  <span>+91-6305492767</span>
                </div>
              </div>
              <div style={{ flex: "0 0 auto", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "16px 20px", minWidth: "170px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                  <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 8px #4ade80", display: "inline-block", flexShrink: 0 }} />
                  <span style={{ fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.65)" }}>Available for work</span>
                </div>
                <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.28)", lineHeight: 1.6, margin: 0 }}>Open to AI · ML · Data Science roles globally.</p>
              </div>
            </div>

            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.42)", lineHeight: 1.95, maxWidth: "680px", marginBottom: "28px" }}>
              Computer Science graduate specialising in Data Science with hands-on experience in Generative AI, LLM automation pipelines, and backend integration. Skilled in Python, PyTorch, Hugging Face, and LangChain — passionate about building scalable AI systems that drive measurable outcomes.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {[
                { href: "https://github.com/shafee05", icon: <IconGithub />, label: "GitHub" },
                { href: "https://www.linkedin.com/in/mohammad-shafee05", icon: <IconLinkedIn />, label: "LinkedIn" },
              ].map(({ href, icon, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "7px", fontSize: "11px", letterSpacing: "0.05em", padding: "10px 18px", borderRadius: "99px", border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.55)", textDecoration: "none", transition: "all 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.28)"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.background = "rgba(255,255,255,0.09)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "rgba(255,255,255,0.55)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}>
                  {icon} {label}
                </a>
              ))}
              <button onClick={copyEmail} style={{ display: "inline-flex", alignItems: "center", gap: "7px", fontSize: "11px", letterSpacing: "0.05em", padding: "10px 18px", borderRadius: "99px", border: `1px solid ${copied ? "rgba(100,200,100,0.35)" : "rgba(255,255,255,0.12)"}`, background: copied ? "rgba(100,200,100,0.08)" : "rgba(255,255,255,0.04)", color: copied ? "#80e080" : "rgba(255,255,255,0.55)", cursor: "pointer", transition: "all 0.25s" }}>
                {copied ? <span style={{ color: "#4ade80" }}>✓</span> : <IconCopy />} {copied ? "Copied!" : "Copy Email"}
              </button>
            </div>
          </div>

          <Rule />

          {/* ── EXPERIENCE ────────────────────────────────────────────── */}
          <div ref={expRef} style={{ opacity: expIn ? 1 : 0, transform: expIn ? "translateY(0)" : "translateY(20px)", transition: "opacity 0.6s ease, transform 0.6s ease" }}>
            <SecLabel text="Experience" />
            {EXPERIENCE.map((exp, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "clamp(20px,4vw,30px)", marginBottom: "12px", transition: "border-color 0.3s, box-shadow 0.3s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(100,165,255,0.25)"; e.currentTarget.style.boxShadow = "0 0 28px rgba(100,165,255,0.06)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.boxShadow = "none"; }}>
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-start", gap: "10px", marginBottom: "18px" }}>
                  <div>
                    <h3 style={{ fontSize: "clamp(14px,2vw,17px)", fontWeight: 600, color: "#e8eaf8", marginBottom: "5px" }}>{exp.role}</h3>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                      <span style={{ fontSize: "13px", color: "rgba(100,165,255,0.75)", fontWeight: 500 }}>{exp.company}</span>
                      <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.28)" }}>{exp.location}</span>
                    </div>
                  </div>
                  <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.35)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", padding: "4px 12px", borderRadius: "99px", whiteSpace: "nowrap", flexShrink: 0 }}>{exp.period}</span>
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                  {exp.bullets.map((b, j) => (
                    <li key={j} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                      <span style={{ color: "rgba(100,165,255,0.45)", marginTop: "5px", fontSize: "8px", flexShrink: 0 }}>▸</span>
                      <span style={{ fontSize: "13.5px", color: "rgba(255,255,255,0.50)", lineHeight: 1.85 }}>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <Rule />

          {/* ── PROJECTS ──────────────────────────────────────────────── */}
          <div ref={projRef} style={{ opacity: projIn ? 1 : 0, transform: projIn ? "translateY(0)" : "translateY(20px)", transition: "opacity 0.6s ease, transform 0.6s ease" }}>
            <SecLabel text="Projects" />
            {/* Filter tabs */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "24px" }}>
              {["All", "ML", "Web"].map(cat => (
                <button key={cat} onClick={() => setFilter(cat)} style={{
                  padding: "6px 16px", borderRadius: "99px", fontSize: "10px", fontWeight: 600,
                  letterSpacing: "0.07em", cursor: "pointer", border: "1px solid",
                  background: filter === cat ? "rgba(100,165,255,0.15)" : "rgba(255,255,255,0.03)",
                  borderColor: filter === cat ? "rgba(100,165,255,0.50)" : "rgba(255,255,255,0.10)",
                  color: filter === cat ? "#a8ccff" : "rgba(255,255,255,0.40)",
                  transition: "all 0.2s",
                }}>{cat}</button>
              ))}
            </div>
            {/* Cards — ProjectCard owns its own useReveal, no hooks in map ✓ */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {filtered.map(proj => <ProjectCard key={proj.title} proj={proj} />)}
            </div>
          </div>

          <Rule />

          {/* ── SKILLS ────────────────────────────────────────────────── */}
          <div ref={skillsRef} style={{ opacity: skillsIn ? 1 : 0, transform: skillsIn ? "translateY(0)" : "translateY(20px)", transition: "opacity 0.6s ease, transform 0.6s ease" }}>
            <SecLabel text="Core Skills" />
            {/* SkillGroup owns its own useReveal ✓ */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(240px,100%), 1fr))", gap: "10px" }}>
              {SKILLS.map(s => <SkillGroup key={s.group} group={s.group} items={s.items} />)}
            </div>
          </div>

          <Rule />

          {/* ── EDUCATION ─────────────────────────────────────────────── */}
          <div ref={eduRef} style={{ opacity: eduIn ? 1 : 0, transform: eduIn ? "translateY(0)" : "translateY(20px)", transition: "opacity 0.6s ease, transform 0.6s ease" }}>
            <SecLabel text="Education" />
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {EDUCATION.map(({ degree, institution, period, detail }, i) => (
                <div key={i} style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "10px", background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "20px 24px", transition: "border-color 0.3s" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(100,165,255,0.22)"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"}>
                  <div style={{ minWidth: 0 }}>
                    <h3 style={{ fontSize: "clamp(13px,2vw,15px)", fontWeight: 600, color: "#e4e8f8", marginBottom: "4px" }}>{degree}</h3>
                    <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.36)" }}>{institution}</p>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.28)", marginBottom: "4px" }}>{period}</p>
                    <span style={{ fontSize: "13px", fontWeight: 700, color: "rgba(100,165,255,0.75)" }}>{detail}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Rule />

          {/* ── CERTIFICATIONS ────────────────────────────────────────── */}
          <div ref={certRef} style={{ opacity: certIn ? 1 : 0, transform: certIn ? "translateY(0)" : "translateY(20px)", transition: "opacity 0.6s ease, transform 0.6s ease" }}>
            <SecLabel text="Certifications" />
            {/* CertCard owns its own useReveal ✓ */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(230px,100%), 1fr))", gap: "10px" }}>
              {CERTS.map(c => <CertCard key={c.name} name={c.name} issuer={c.issuer} />)}
            </div>
          </div>

          <Rule />

          {/* ── CONTACT ───────────────────────────────────────────────── */}
          <div ref={ctaRef} style={{ textAlign: "center", paddingBottom: "80px", opacity: ctaIn ? 1 : 0, transform: ctaIn ? "translateY(0)" : "translateY(20px)", transition: "opacity 0.6s ease, transform 0.6s ease" }}>
            <p style={{ fontSize: "9px", letterSpacing: "0.6em", textTransform: "uppercase", color: "rgba(100,165,255,0.55)", marginBottom: "16px" }}>Open to Opportunities</p>
            <h2 className="font-freight" style={{ fontSize: "clamp(1.8rem,4vw,3rem)", fontWeight: 300, color: "#f0f0f0", marginBottom: "10px" }}>Let's build something together</h2>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.35)", lineHeight: 1.85, maxWidth: "440px", margin: "0 auto 36px" }}>
              Available for full-time roles, contract projects, and collaborations in AI, Data Science, and Generative AI.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "10px" }}>
              <a href="mailto:md.shafee05s@gmail.com" style={{ display: "inline-flex", alignItems: "center", gap: "7px", background: "rgba(255,255,255,0.92)", color: "#08080f", borderRadius: "99px", padding: "13px 28px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase", textDecoration: "none", transition: "transform 0.2s, box-shadow 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(255,255,255,0.18)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
                <IconMail /> Email Me
              </a>
              <button onClick={copyEmail} style={{ display: "inline-flex", alignItems: "center", gap: "7px", background: copied ? "rgba(100,200,100,0.08)" : "rgba(255,255,255,0.04)", border: `1px solid ${copied ? "rgba(100,200,100,0.35)" : "rgba(255,255,255,0.15)"}`, borderRadius: "99px", padding: "13px 26px", fontSize: "11px", letterSpacing: "0.06em", color: copied ? "#80e080" : "#dde0f5", cursor: "pointer", transition: "all 0.3s" }}>
                {copied ? <span style={{ color: "#4ade80" }}>✓</span> : <IconCopy />} {copied ? "Copied!" : "Copy Email"}
              </button>
              {[
                { href: "https://www.linkedin.com/in/mohammad-shafee05", icon: <IconLinkedIn />, label: "LinkedIn" },
                { href: "https://github.com/shafee05", icon: <IconGithub />, label: "GitHub" },
              ].map(({ href, icon, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "7px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.15)", color: "#dde0f5", borderRadius: "99px", padding: "13px 26px", fontSize: "11px", letterSpacing: "0.06em", textDecoration: "none", transition: "background 0.2s, transform 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.09)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.transform = "translateY(0)"; }}>
                  {icon} {label}
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}