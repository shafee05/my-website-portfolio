"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

// Lazy-load the particle background after paint to avoid freeze
const ParticleBackground = dynamic(
  () => import("@/components/ParticleBackground"),
  { ssr: false, loading: () => null }
);

// ─── Data ────────────────────────────────────────────────────────────────────
const milestones = [
  { year: "2019–2021", title: "Narayana Junior College",                    desc: "Intermediate (MPC) — 92.3%. Built the academic rigour that would fuel an engineering career.",                                       tag: "Education",     icon: "🎓" },
  { year: "2021",      title: "Business English Certificate",                desc: "Cambridge-recognised proficiency in professional communication — a foundation for global collaboration.",                            tag: "Certification", icon: "📜" },
  { year: "2021",      title: "Python Programming — Rinex",                  desc: "Gained foundational programming skills in Python; the starting point for every AI project that followed.",                         tag: "Skill",         icon: "🐍" },
  { year: "2021–2025", title: "B.Tech — Data Science Engineering",           desc: "ACE Engineering College, Hyderabad · CGPA 7.71. Four years immersed in AI, ML, and data systems.",                                 tag: "Education",     icon: "🏛️" },
  { year: "2022",      title: "First AI Project",                            desc: "Built a sentiment analysis model using Python and NLTK — the moment AI stopped being theory and became practice.",                  tag: "Project",       icon: "🤖" },
  { year: "2022",      title: "Prompt Engineering Foundations",              desc: "Completed an introductory course on crafting effective prompts for large language models.",                                          tag: "Skill",         icon: "💡" },
  { year: "2023",      title: "Prompt Engineering for Generative AI",        desc: "Mastered advanced techniques for optimising and steering generative AI model outputs at scale.",                                     tag: "Skill",         icon: "⚡" },
  { year: "2023",      title: "Salesforce VIP Internship",                   desc: "Completed an 8-week CRM development programme. Deepened product, platform, and client-facing thinking.",                           tag: "Experience",    icon: "☁️" },
  { year: "2023",      title: "Hack-A-Bot Winner",                           desc: "Took first place at a campus-level AI hackathon — recognised for creativity and technical execution under pressure.",                tag: "Achievement",   icon: "🏆" },
  { year: "2024",      title: "UiPath RPA — Infosys Foundation",             desc: "Acquired hands-on skills in Robotic Process Automation and was certified through Infosys Foundation.",                             tag: "Certification", icon: "⚙️" },
  { year: "2024",      title: "Multimodal AI Specialisation",                desc: "Focused prompt engineering on combined text-and-image AI pipelines; directly applied in the GestureTalk project.",                  tag: "Skill",         icon: "👁️" },
  { year: "2024",      title: "Flipkart Grid 5.0",                           desc: "Competed in a national-level tech innovation challenge, refining problem-solving and execution under real competition.",             tag: "Achievement",   icon: "🛒" },
  { year: "2024",      title: "Cricket Performance Prediction",              desc: "Built a predictive ML model using Decision Trees & LightGBM, improving match outcome prediction accuracy by 15%.",                  tag: "Project",       icon: "🏏" },
  { year: "2025",      title: "GestureTalk",                                 desc: "Real-time sign language recognition using YOLO and DWpose with 3D avatar animation — achieving 85% recognition accuracy.",           tag: "Project",       icon: "🤟" },
  { year: "2025",      title: "Certified by Micro1",                         desc: "Passed an AI-screened technical interview and was recognised as a Certified Data Science Engineering Student.",                     tag: "Certification", icon: "✅" },
  { year: "2025",      title: "Gen AI Python Internship — ADVI Group",       desc: "Built and optimised Generative AI solutions with LangChain & Hugging Face, cutting inference time by 25%.",                         tag: "Experience",    icon: "🔬" },
  { year: "2025",      title: "Author — The Arcana of Ascent",               desc: "Authored and published a reflective work exploring silence, inner discipline, and personal transformation.",                         tag: "Achievement",   icon: "📖" },
  { year: "2025",      title: "SaaS Fundamentals & Platform Learning",       desc: "Studied SaaS architecture, product workflows, and platform design through guided hands-on exploration.",                            tag: "Skill",         icon: "🚀" },
  { year: "2025",      title: "ImanVerse — Islamic Spiritual Platform",      desc: "Launched a full-stack Islamic platform (Next.js + TypeScript) with Quran access, prayer times, and a knowledge library.",           tag: "Project",       icon: "🌙" },
];

const TAG_COLORS = {
  Education:    { bg: "rgba(99,102,241,0.14)",  border: "rgba(99,102,241,0.45)",  text: "#a5b4fc", glow: "rgba(99,102,241,0.3)"  },
  Certification:{ bg: "rgba(16,185,129,0.14)",  border: "rgba(16,185,129,0.45)",  text: "#6ee7b7", glow: "rgba(16,185,129,0.3)"  },
  Skill:        { bg: "rgba(245,158,11,0.14)",  border: "rgba(245,158,11,0.45)",  text: "#fcd34d", glow: "rgba(245,158,11,0.3)"  },
  Project:      { bg: "rgba(59,130,246,0.14)",  border: "rgba(59,130,246,0.45)",  text: "#93c5fd", glow: "rgba(59,130,246,0.3)"  },
  Experience:   { bg: "rgba(236,72,153,0.14)",  border: "rgba(236,72,153,0.45)",  text: "#f9a8d4", glow: "rgba(236,72,153,0.3)"  },
  Achievement:  { bg: "rgba(239,68,68,0.14)",   border: "rgba(239,68,68,0.45)",   text: "#fca5a5", glow: "rgba(239,68,68,0.3)"   },
};




// ─── Scroll-reveal hook — each element observes itself individually ──────────
function useReveal(delay = 0) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const timer = { id: null };
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          timer.id = setTimeout(() => setVisible(true), delay);
          obs.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => { obs.disconnect(); clearTimeout(timer.id); };
  }, [delay]);
  return { ref, visible };
}

// ─── Timeline Card ────────────────────────────────────────────────────────────
function TimelineCard({ item, side }) {
  // Each card triggers its own observer — no stacked delays
  const { ref, visible } = useReveal(0);
  const tc = TAG_COLORS[item.tag] || TAG_COLORS.Skill;
  const fromLeft = side === "left";

  return (
    <div
      ref={ref}
      style={{
        // On desktop: fills the half-column. On mobile: full width via parent grid override
        width: "100%",
        opacity: visible ? 1 : 0,
        transform: visible
          ? "translateX(0) translateY(0)"
          : `translateX(${fromLeft ? "-32px" : "32px"}) translateY(8px)`,
        transition: "opacity 0.55s ease, transform 0.55s ease",
      }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.04)",
          border: `1px solid rgba(255,255,255,0.08)`,
          borderRadius: "14px",
          padding: "20px 22px",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          cursor: "default",
          transition: "border-color 0.25s, background 0.25s, box-shadow 0.25s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = tc.border;
          e.currentTarget.style.background = "rgba(255,255,255,0.07)";
          e.currentTarget.style.boxShadow = `0 0 20px ${tc.glow}`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
          e.currentTarget.style.background = "rgba(255,255,255,0.04)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "10px", letterSpacing: "0.14em", color: "rgba(255,255,255,0.32)", textTransform: "uppercase" }}>
            {item.year}
          </span>
          <span
            style={{
              fontSize: "9px", letterSpacing: "0.16em", textTransform: "uppercase",
              padding: "2px 9px", borderRadius: "99px",
              background: tc.bg, border: `1px solid ${tc.border}`, color: tc.text,
            }}
          >
            {item.tag}
          </span>
        </div>
        <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#f0f0f0", marginBottom: "7px", lineHeight: 1.35 }}>
          {item.title}
        </h3>
        <p style={{ fontSize: "12.5px", color: "rgba(255,255,255,0.45)", lineHeight: 1.75, margin: 0 }}>
          {item.desc}
        </p>
      </div>
    </div>
  );
}

// ─── Timeline Row ─────────────────────────────────────────────────────────────
function TimelineRow({ item, index, isMobileView }) {
  const tc = TAG_COLORS[item.tag] || TAG_COLORS.Skill;
  const isLeft = index % 2 === 0;

  if (isMobileView) {
    // Mobile: single column, dot on the left, card to the right
    return (
      <div style={{ display: "flex", gap: "16px", marginBottom: "28px", alignItems: "flex-start" }}>
        {/* Dot */}
        <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "4px" }}>
          <div
            style={{
              width: "34px", height: "34px", borderRadius: "50%",
              background: tc.bg, border: `2px solid ${tc.border}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "15px", boxShadow: `0 0 12px ${tc.glow}`,
              flexShrink: 0, zIndex: 2,
            }}
          >
            {item.icon}
          </div>
        </div>
        {/* Card */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <TimelineCard item={item} side="right" />
        </div>
      </div>
    );
  }

  // Desktop: alternating left/right
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 56px 1fr",
        gap: 0,
        marginBottom: "32px",
        alignItems: "flex-start",
      }}
    >
      {/* Left cell */}
      <div style={{ paddingRight: "24px", paddingTop: "6px", textAlign: "right" }}>
        {isLeft && <TimelineCard item={item} side="left" />}
      </div>

      {/* Centre: dot on the spine */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div
          style={{
            width: "38px", height: "38px", borderRadius: "50%",
            background: tc.bg, border: `2px solid ${tc.border}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "17px", boxShadow: `0 0 16px ${tc.glow}`,
            zIndex: 2, flexShrink: 0,
            transition: "box-shadow 0.3s",
          }}
        >
          {item.icon}
        </div>
      </div>

      {/* Right cell */}
      <div style={{ paddingLeft: "24px", paddingTop: "6px" }}>
        {!isLeft && <TimelineCard item={item} side="right" />}
      </div>
    </div>
  );
}

// ─── Hobby Card ───────────────────────────────────────────────────────────────
function HobbyCard({ icon, title, desc, delay }) {
  const { ref, visible } = useReveal(delay);
  return (
    <div
      ref={ref}
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "14px",
        padding: "28px 22px",
        textAlign: "center",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.5s ease, transform 0.5s ease, border-color 0.25s, background 0.25s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(100,160,255,0.4)";
        e.currentTarget.style.background = "rgba(255,255,255,0.07)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
        e.currentTarget.style.background = "rgba(255,255,255,0.04)";
      }}
    >
      <div style={{ fontSize: "30px", marginBottom: "14px" }}>{icon}</div>
      <h4 style={{ fontSize: "13px", fontWeight: 600, color: "#f0f0f0", marginBottom: "8px", letterSpacing: "0.04em" }}>{title}</h4>
      <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.42)", lineHeight: 1.75, margin: 0 }}>{desc}</p>
    </div>
  );
}

// ─── Section label + heading ──────────────────────────────────────────────────
function SectionHeading({ label, title }) {
  const { ref, visible } = useReveal(0);
  return (
    <div
      ref={ref}
      style={{
        textAlign: "center",
        marginBottom: "52px",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: "opacity 0.6s ease, transform 0.6s ease",
      }}
    >
      <p style={{
        fontSize: "9px", letterSpacing: "0.5em", textTransform: "uppercase",
        color: "rgba(100,180,255,0.65)", marginBottom: "12px",
      }}>
        {label}
      </p>
      <h2
        className="font-freight"
        style={{
          fontSize: "clamp(1.9rem, 4vw, 3.2rem)",
          fontWeight: 300, color: "#f0f0f0",
          lineHeight: 1.1, margin: 0,
        }}
      >
        {title}
      </h2>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function JourneyPage() {
  const [isMobile, setIsMobile] = useState(false);
  const heroRef = useRef(null);
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    // Detect mobile
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (!heroRef.current) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setHeroVisible(true); obs.disconnect(); } }, { threshold: 0.1 });
    obs.observe(heroRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <ParticleBackground />

      {/* Dark overlay so particles don't wash out text */}
      <div
        style={{
          position: "fixed", inset: 0,
          background: "rgba(12,12,18,0.84)",
          zIndex: 0, pointerEvents: "none",
        }}
      />

      <main
        style={{
          position: "relative", zIndex: 1,
          color: "#f0f0f0",
          overflowX: "hidden",
          width: "100%",
          boxSizing: "border-box",
        }}
      >

        {/* ── HERO ──────────────────────────────────────────────────────── */}
        <section
          style={{
            minHeight: "52vh",
            minHeight: "52dvh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "clamp(100px, 18vw, 140px) clamp(20px, 6vw, 60px) 60px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Radial glow behind text */}
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%,-50%)",
            width: "min(700px, 90vw)", height: "300px",
            background: "radial-gradient(ellipse, rgba(0,90,200,0.13) 0%, transparent 68%)",
            pointerEvents: "none",
          }} />

          <div
            ref={heroRef}
            style={{
              position: "relative", zIndex: 2,
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? "translateY(0)" : "translateY(28px)",
              transition: "opacity 0.9s ease, transform 0.9s ease",
              maxWidth: "600px",
            }}
          >
            <p style={{
              fontSize: "9px", letterSpacing: "0.55em", textTransform: "uppercase",
              color: "rgba(100,180,255,0.7)", marginBottom: "18px",
            }}>
              My Journey
            </p>
            <h1
              className="font-freight"
              style={{
                fontSize: "clamp(2.4rem, 7vw, 5.2rem)",
                fontWeight: 300, lineHeight: 1.06,
                color: "#f0f0f0", marginBottom: "22px",
                letterSpacing: "-0.02em",
              }}
            >
              Milestones &{" "}
              <span style={{ color: "rgba(100,180,255,0.9)" }}>Achievements</span>
            </h1>
            <p style={{
              fontSize: "clamp(13px, 2vw, 15px)",
              color: "rgba(255,255,255,0.4)",
              lineHeight: 1.85, margin: "0 auto",
            }}>
              Every entry below is a step that shaped who I am — a Data Science Engineer, aspiring builder, and lifelong learner.
            </p>
          </div>

          {/* Divider */}
          <div style={{
            position: "absolute", bottom: 0,
            left: "8%", right: "8%", height: "1px",
            background: "linear-gradient(to right, transparent, rgba(255,255,255,0.07), transparent)",
          }} />
        </section>

        {/* ── TIMELINE ──────────────────────────────────────────────────── */}
        <section style={{ padding: "80px 0 60px", position: "relative" }}>
          <div
            style={{
              maxWidth: "960px",
              margin: "0 auto",
              padding: "0 clamp(16px, 4vw, 32px)",
              position: "relative",
              boxSizing: "border-box",
            }}
          >
            <SectionHeading label="Experience & Growth" title="My Journey of Crafting Exceptional AI Solutions" />

            {/* Vertical spine — only on desktop */}
            {!isMobile && (
              <div
                style={{
                  position: "absolute",
                  top: "100px",
                  bottom: "20px",
                  // Exactly at the centre column: maxWidth 960px, padding 32px each side → inner = 896px
                  // Centre of 3-col grid (1fr 56px 1fr) = left offset + 1fr + 28px
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "2px",
                  background: "linear-gradient(to bottom, transparent, rgba(60,140,255,0.3) 6%, rgba(60,140,255,0.18) 90%, transparent)",
                  pointerEvents: "none",
                  zIndex: 0,
                }}
              />
            )}

            {milestones.map((item, i) => (
              <TimelineRow key={i} item={item} index={i} isMobileView={isMobile} />
            ))}
          </div>
        </section>

        {/* ── HOBBIES ───────────────────────────────────────────────────── */}
        <section
          style={{
            padding: "70px clamp(16px, 4vw, 32px) 80px",
            background: "rgba(255,255,255,0.015)",
            borderTop: "1px solid rgba(255,255,255,0.05)",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <div style={{ maxWidth: "960px", margin: "0 auto" }}>
            <SectionHeading label="Beyond the Code" title="Hobbies & Creative Pursuits" />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(min(220px, 100%), 1fr))",
                gap: "16px",
              }}
            >
              <HobbyCard delay={0}   icon="🎨" title="Photo Editing"    desc="Adobe Photoshop & Lightroom — blending precision with artistic expression to craft compelling visuals." />
              <HobbyCard delay={80}  icon="🎬" title="Video Editing"    desc="Premiere Pro & After Effects — turning raw footage into polished, story-driven narratives." />
              <HobbyCard delay={160} icon="📝" title="Writing"          desc="Author of The Arcana of Ascent — exploring silence, inner discipline, and transformation through words." />
            </div>
          </div>
        </section>

        {/* ── CTA ───────────────────────────────────────────────────────── */}
        <section
          style={{
            padding: "80px clamp(20px, 5vw, 40px)",
            textAlign: "center",
            background: "rgba(0,70,180,0.055)",
            borderTop: "1px solid rgba(0,100,220,0.13)",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <div style={{ maxWidth: "560px", margin: "0 auto" }}>
            <h2
              className="font-freight"
              style={{
                fontSize: "clamp(1.7rem, 4vw, 2.8rem)",
                fontWeight: 300, color: "#f0f0f0",
                marginBottom: "16px",
              }}
            >
              Ready to Collaborate?
            </h2>
            <p style={{
              fontSize: "14px", color: "rgba(255,255,255,0.4)",
              lineHeight: 1.85, marginBottom: "40px",
            }}>
              With a strong foundation in AI, data science, and human-centred design, I'm eager to contribute to transformative solutions. Let's connect.
            </p>
            <a
              href="mailto:md.shafee05s@gmail.com"
              style={{
                display: "inline-block",
                background: "rgba(0,110,255,0.16)",
                border: "1px solid rgba(0,140,255,0.38)",
                borderRadius: "99px",
                padding: "14px 44px",
                color: "#93c5fd",
                fontSize: "12px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                textDecoration: "none",
                transition: "background 0.25s, color 0.25s, border-color 0.25s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(0,110,255,0.30)";
                e.currentTarget.style.color = "#bfdbfe";
                e.currentTarget.style.borderColor = "rgba(0,140,255,0.65)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(0,110,255,0.16)";
                e.currentTarget.style.color = "#93c5fd";
                e.currentTarget.style.borderColor = "rgba(0,140,255,0.38)";
              }}
            >
              Let's Collaborate
            </a>
          </div>
        </section>

      </main>
    </>
  );
}