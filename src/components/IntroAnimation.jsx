"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";

/* ════════════════════════════════════════════════════════════════════════════
   IntroAnimation  —  cinematic full-screen intro, plays every page-load
   ─────────────────────────────────────────────────────────────────────────
   Usage in app/page.jsx:
     import IntroAnimation from "@/components/IntroAnimation";
     <IntroAnimation logoSrc="/svg/logo.svg" logoWidth={180} logoHeight={52} />

   PageLoader  —  subtle top-bar + spinner shown while any page buffers
   ─────────────────────────────────────────────────────────────────────────
   Usage in app/layout.jsx:
     import { PageLoader } from "@/components/IntroAnimation";
     // inside <body> before {children}:
     <PageLoader />
════════════════════════════════════════════════════════════════════════════ */

/* ── Timeline (total ≈ 9.2 s) ────────────────────────────────────────────
   init  →  grid (250ms)  →  rings (1300ms)  →  logo (2400ms)
   →  name (3500ms)  →  tag (4400ms)  →  hold (5300ms)
   →  fly (7200ms)  →  fade (7900ms)  →  done (9200ms)
──────────────────────────────────────────────────────────────────────── */
export default function IntroAnimation({
  logoSrc     = "/images/altermind-logo.png",
  logoWidth   = 200,
  logoHeight  = 56,
  accentColor = "rgba(100,160,255,0.82)",
}) {
  const canvasRef = useRef(null);
  const ptsRef    = useRef([]);
  const phaseRef  = useRef("init");
  const rafRef    = useRef(null);
  const [phase, _set] = useState("init");
  const set = (p) => { phaseRef.current = p; _set(p); };

  /* ── Sequencer ─────────────────────────────────────────────────────── */
  useEffect(() => {
    const SEQ = [
      [ 250,  "grid"  ],
      [1300,  "rings" ],
      [2400,  "logo"  ],
      [3500,  "name"  ],
      [4400,  "tag"   ],
      [5300,  "hold"  ],
      [7200,  "fly"   ],
      [7900,  "fade"  ],
      [9200,  "done"  ],
    ];
    const ts = SEQ.map(([ms, p]) => setTimeout(() => set(p), ms));
    return () => ts.forEach(clearTimeout);
  }, []);

  /* ── Canvas  (particles + neural lines) ───────────────────────────── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const W  = () => canvas.width;
    const H  = () => canvas.height;
    const CX = () => W() / 2;
    const CY = () => H() / 2;

    /* 200 particles — born at screen edges, converge to a ring, then scatter */
    const N = 200;
    ptsRef.current = Array.from({ length: N }, () => {
      const side = Math.floor(Math.random() * 4);
      let sx, sy;
      if      (side === 0) { sx = Math.random() * W(); sy = -16; }
      else if (side === 1) { sx = W() + 16;             sy = Math.random() * H(); }
      else if (side === 2) { sx = Math.random() * W(); sy = H() + 16; }
      else                 { sx = -16;                   sy = Math.random() * H(); }

      const oa  = Math.random() * Math.PI * 2;
      const or  = 60 + Math.random() * 140;
      const hue = 190 + Math.floor(Math.random() * 55);

      return {
        x: sx, y: sy, oa, or, hue,
        os:  (Math.random() < 0.5 ? 1 : -1) * (0.003 + Math.random() * 0.007),
        spd: 0.018 + Math.random() * 0.026,
        sz:  0.8 + Math.random() * 2.2,
        a:   0,
        vx: 0, vy: 0,
      };
    });

    const draw = () => {
      ctx.clearRect(0, 0, W(), H());
      const ph  = phaseRef.current;
      const pts = ptsRef.current;

      if (ph === "done") return;

      pts.forEach(p => {
        /* ── converge phase ── */
        if (["grid","rings","logo","name","tag"].includes(ph)) {
          const tx = CX() + Math.cos(p.oa) * p.or;
          const ty = CY() + Math.sin(p.oa) * p.or;
          p.x += (tx - p.x) * p.spd;
          p.y += (ty - p.y) * p.spd;
          p.a  = Math.min(p.a + 0.025, 0.85);
        }
        /* ── orbit ── */
        if (ph === "hold") {
          p.oa += p.os;
          p.x   = CX() + Math.cos(p.oa) * p.or;
          p.y   = CY() + Math.sin(p.oa) * p.or;
          p.a   = 0.72;
        }
        /* ── fly — logo moves but particles still orbit ── */
        if (ph === "fly") {
          p.oa += p.os * 1.8;
          p.x   = CX() + Math.cos(p.oa) * p.or;
          p.y   = CY() + Math.sin(p.oa) * p.or;
          p.a   = Math.max(p.a - 0.012, 0);
        }
        /* ── scatter ── */
        if (ph === "fade") {
          if (!p.vx && !p.vy) {
            const ang = Math.atan2(p.y - CY(), p.x - CX());
            const spd = 2 + Math.random() * 5;
            p.vx = Math.cos(ang) * spd;
            p.vy = Math.sin(ang) * spd;
          }
          p.x  += p.vx; p.vx *= 1.07;
          p.y  += p.vy; p.vy *= 1.07;
          p.a   = Math.max(p.a - 0.028, 0);
        }

        if (p.a <= 0.02) return;
        ctx.save();
        ctx.globalAlpha = p.a;
        ctx.shadowColor = `hsla(${p.hue},88%,72%,0.85)`;
        ctx.shadowBlur  = 8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.sz, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${p.hue},78%,75%)`;
        ctx.fill();
        ctx.restore();
      });

      /* ── neural lines ── */
      if (["logo","name","tag","hold","fly"].includes(ph)) {
        ctx.save();
        for (let i = 0; i < N; i++) {
          const p = pts[i];
          if (p.a < 0.12) continue;
          for (let j = i + 1; j < Math.min(i + 9, N); j++) {
            const q = pts[j];
            if (q.a < 0.12) continue;
            const d = Math.hypot(p.x - q.x, p.y - q.y);
            if (d < 72) {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(q.x, q.y);
              ctx.strokeStyle = `rgba(110,180,255,${0.25 * (1 - d / 72)})`;
              ctx.lineWidth   = 0.5;
              ctx.stroke();
            }
          }
        }
        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  /* ── Don't render after done ───────────────────────────────────────── */
  if (phase === "done") return null;

  const after   = (...ps) => ps.includes(phase);
  const isFade  = phase === "fade";
  const isFly   = phase === "fly" || isFade;
  const NAME    = "MOHAMMAD  SHAFEE";

  /* ── Logo position: centre → flies to navbar top-left on "fly" ─────── */
  const logoPos = isFly
    ? {
        position: "fixed",
        top:  "14px",
        left: "clamp(20px,4vw,40px)",
        transform: "scale(0.28)",
        transformOrigin: "top left",
        opacity: isFade ? 0 : 0.88,
        transition: [
          "top 1.1s cubic-bezier(0.22,1,0.36,1)",
          "left 1.1s cubic-bezier(0.22,1,0.36,1)",
          "transform 1.1s cubic-bezier(0.22,1,0.36,1)",
          "opacity 0.8s ease 0.3s",
        ].join(","),
      }
    : {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%,-50%)",
        opacity: 1,
        transition: after("logo","name","tag","hold")
          ? "opacity 0.6s ease, filter 0.6s ease"
          : "none",
        filter: after("hold") ? "drop-shadow(0 0 18px rgba(100,165,255,0.45))" : "none",
      };

  return (
    <>
      {/* ─── Keyframe definitions ──────────────────────────────────────── */}
      <style>{`
        /* 3-D ring rotations */
        @keyframes ia-ringA { from{transform:rotateX(72deg) rotateZ(0deg)}   to{transform:rotateX(72deg) rotateZ(360deg)} }
        @keyframes ia-ringB { from{transform:rotateY(68deg) rotateZ(0deg)}   to{transform:rotateY(68deg) rotateZ(-360deg)} }
        @keyframes ia-ringC { from{transform:rotateX(38deg) rotateY(28deg) rotateZ(0deg)} to{transform:rotateX(38deg) rotateY(28deg) rotateZ(360deg)} }
        /* Ring scatter */
        @keyframes ia-rsA { to{transform:rotateX(72deg) rotateZ(360deg) scale(4); opacity:0} }
        @keyframes ia-rsB { to{transform:rotateY(68deg) rotateZ(-360deg) scale(4); opacity:0} }
        @keyframes ia-rsC { to{transform:rotateX(38deg) rotateY(28deg) rotateZ(360deg) scale(4); opacity:0} }
        /* Central orb pulse */
        @keyframes ia-orb {
          0%,100%{box-shadow:0 0 14px rgba(110,170,255,0.75),0 0 50px rgba(90,140,255,0.35),0 0 100px rgba(70,110,255,0.15)}
          50%    {box-shadow:0 0 28px rgba(150,215,255,1.00),0 0 80px rgba(110,175,255,0.60),0 0 160px rgba(90,150,255,0.28)}
        }
        /* Scanline sweep */
        @keyframes ia-scan { 0%{top:-3px;opacity:1} 88%{opacity:1} 100%{top:100%;opacity:0} }
        /* Perspective grid fly-in */
        @keyframes ia-grid {
          from{opacity:0;transform:perspective(700px) rotateX(58deg) scale(1.6)}
          to  {opacity:1;transform:perspective(700px) rotateX(58deg) scale(1)}
        }
        /* HUD brackets */
        @keyframes ia-brk { from{opacity:0;width:0;height:0} to{opacity:1;width:30px;height:30px} }
        /* Name letter drop */
        @keyframes ia-ltr {
          from{opacity:0;transform:translateY(-18px) skewX(-5deg)}
          to  {opacity:1;transform:translateY(0)    skewX(0deg)}
        }
        /* Red glitch channel */
        @keyframes ia-glitch {
          0%,85%,100%{opacity:0;transform:translate(0,0)}
          87%{opacity:0.55;transform:translate(-4px,1px);clip-path:inset(22% 0 52% 0)}
          90%{opacity:0.40;transform:translate(4px,-1px);clip-path:inset(62% 0 8%  0)}
          93%{opacity:0.55;transform:translate(-2px,0);  clip-path:inset(40% 0 32% 0)}
          95%{opacity:0;transform:translate(0,0)}
        }
        /* Cursor blink */
        @keyframes ia-cur { 0%,49%{opacity:1} 50%,100%{opacity:0} }
        /* Tagline rise */
        @keyframes ia-tag { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        /* Divider line grow */
        @keyframes ia-line { from{width:0} to{width:210px} }
        /* Progress bar fill */
        @keyframes ia-bar  { from{width:0%} to{width:100%} }
        /* Orb appear */
        @keyframes ia-orbIn { from{transform:scale(0);opacity:0} to{transform:scale(1);opacity:1} }
        /* Rings fly in */
        @keyframes ia-ringIn { from{opacity:0;transform:scale(0.15)} to{opacity:1;transform:scale(1)} }
        /* Corner info text */
        @keyframes ia-corner { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* ─── Canvas ─────────────────────────────────────────────────────── */}
      <canvas ref={canvasRef} style={{ position:"fixed", inset:0, zIndex:9992, pointerEvents:"none" }} />

      {/* ─── Dark overlay ───────────────────────────────────────────────── */}
      <div style={{
        position:"fixed", inset:0, zIndex:9993,
        background:"rgba(2,4,14,0.97)",
        backdropFilter: isFade ? "none" : "blur(3px)",
        WebkitBackdropFilter: isFade ? "none" : "blur(3px)",
        opacity: isFade ? 0 : 1,
        transition: isFade ? "opacity 1.35s cubic-bezier(0.4,0,0.2,1)" : "none",
        pointerEvents: isFade ? "none" : "auto",
      }}/>

      {/* ─── Perspective grid floor ─────────────────────────────────────── */}
      {after("grid","rings","logo","name","tag","hold","fly") && !isFade && (
        <div style={{
          position:"fixed", inset:0, zIndex:9994, pointerEvents:"none",
          overflow:"hidden",
          opacity: after("hold","fly") ? 0.10 : 0.16,
          transition:"opacity 0.8s ease",
        }}>
          <div style={{
            position:"absolute",
            top:"-50%", left:"-25%", right:"-25%", bottom:"-5%",
            backgroundImage:`
              linear-gradient(rgba(100,165,255,0.55) 1px,transparent 1px),
              linear-gradient(90deg,rgba(100,165,255,0.55) 1px,transparent 1px)
            `,
            backgroundSize:"72px 72px",
            animation:"ia-grid 1.1s cubic-bezier(0.22,1,0.36,1) forwards",
          }}/>
        </div>
      )}

      {/* ─── Progress bar (bottom edge) ─────────────────────────────────── */}
      {after("grid") && !isFade && (
        <div style={{ position:"fixed", bottom:0, left:0, right:0, height:"2px", zIndex:9995, pointerEvents:"none", background:"rgba(255,255,255,0.04)" }}>
          <div style={{
            height:"100%",
            background:"linear-gradient(to right,rgba(60,100,255,0.65),rgba(150,210,255,0.95),rgba(200,235,255,1))",
            animation:"ia-bar 6.8s cubic-bezier(0.38,0,0.2,1) forwards",
            boxShadow:"0 0 10px rgba(120,185,255,0.75), 0 0 20px rgba(100,165,255,0.40)",
          }}/>
        </div>
      )}

      {/* ─── HUD corner brackets ────────────────────────────────────────── */}
      {after("rings","logo","name","tag","hold") && !isFly && (
        <>
          {[
            { pos:{ top:"24px",  left:"24px"  }, b:["borderTop","borderLeft"]   },
            { pos:{ top:"24px",  right:"24px" }, b:["borderTop","borderRight"]  },
            { pos:{ bottom:"24px", left:"24px"  }, b:["borderBottom","borderLeft"]  },
            { pos:{ bottom:"24px", right:"24px" }, b:["borderBottom","borderRight"] },
          ].map(({ pos, b }, i) => (
            <div key={i} style={{
              position:"fixed", zIndex:9995, pointerEvents:"none",
              width:"30px", height:"30px",
              [b[0]]: "1.5px solid rgba(100,165,255,0.55)",
              [b[1]]: "1.5px solid rgba(100,165,255,0.55)",
              animation:`ia-brk 0.55s ease ${i * 110}ms both`,
              ...pos,
            }}/>
          ))}
        </>
      )}

      {/* ─── Status text (bottom-left HUD) ──────────────────────────────── */}
      {after("rings") && !isFly && (
        <div style={{
          position:"fixed", bottom:"28px", left:"28px", zIndex:9995, pointerEvents:"none",
          fontFamily:"monospace", fontSize:"9px", letterSpacing:"0.3em",
          textTransform:"uppercase", color:"rgba(100,165,255,0.38)",
          animation:"ia-corner 0.5s ease both",
        }}>
          {phase === "rings" && "LOADING ASSETS..."}
          {phase === "logo"  && "RENDERING UNIVERSE..."}
          {phase === "name"  && "IDENTIFYING SUBJECT..."}
          {phase === "tag"   && "CLASSIFICATION COMPLETE."}
          {phase === "hold"  && "PORTFOLIO READY ✓"}
        </div>
      )}

      {/* ─── 3-D Gyroscope rings (centred, absolute stacking context) ───── */}
      {after("rings") && (
        <div style={{
          position:"fixed", top:"50%", left:"50%",
          width:"320px", height:"320px",
          marginTop:"-160px", marginLeft:"-160px",
          perspective:"900px",
          zIndex:9996, pointerEvents:"none",
          opacity: isFly ? 0 : 1,
          transition: isFly ? "opacity 0.5s ease" : "none",
        }}>
          {/* Ambient glow */}
          <div style={{
            position:"absolute", top:"50%", left:"50%",
            width:"160px", height:"160px",
            marginTop:"-80px", marginLeft:"-80px",
            borderRadius:"50%",
            background:"radial-gradient(circle,rgba(80,130,255,0.16) 0%,transparent 70%)",
          }}/>

          {/* Ring A */}
          <div style={{
            position:"absolute", inset:0, borderRadius:"50%",
            border:"1.5px solid rgba(100,175,255,0.72)",
            boxShadow:"0 0 14px rgba(100,165,255,0.30),inset 0 0 14px rgba(100,165,255,0.10)",
            animation: isFly
              ? "ia-rsA 0.85s ease forwards"
              : "ia-ringA 5.5s linear infinite, ia-ringIn 0.7s ease both",
          }}/>
          {/* Ring B */}
          <div style={{
            position:"absolute", inset:"24px", borderRadius:"50%",
            border:"1px solid rgba(165,225,255,0.52)",
            boxShadow:"0 0 8px rgba(140,205,255,0.18)",
            animation: isFly
              ? "ia-rsB 0.85s ease 0.09s forwards"
              : "ia-ringB 7.5s linear infinite, ia-ringIn 0.7s ease 0.15s both",
          }}/>
          {/* Ring C */}
          <div style={{
            position:"absolute", inset:"48px", borderRadius:"50%",
            border:"1px solid rgba(210,235,255,0.34)",
            animation: isFly
              ? "ia-rsC 0.85s ease 0.18s forwards"
              : "ia-ringC 10s linear infinite, ia-ringIn 0.7s ease 0.3s both",
          }}/>

          {/* Central orb */}
          <div style={{
            position:"absolute", top:"50%", left:"50%",
            width:"16px", height:"16px",
            marginTop:"-8px", marginLeft:"-8px",
            borderRadius:"50%",
            background:"rgba(190,225,255,0.96)",
            animation:"ia-orb 2.4s ease-in-out infinite, ia-orbIn 0.6s cubic-bezier(0.34,1.5,0.64,1) both",
            opacity: isFly ? 0 : undefined,
            transition: isFly ? "opacity 0.3s ease" : "none",
          }}/>
        </div>
      )}

      {/* ─── Logo (centre → flies to navbar) ────────────────────────────── */}
      {after("logo","name","tag","hold","fly","fade") && (
        <div style={{ ...logoPos, zIndex:9999 }}>
          <div style={{ position:"relative", width:`${logoWidth}px`, height:`${logoHeight}px` }}>
            <Image src={logoSrc} alt="Logo" fill className="object-contain" priority/>
          </div>
        </div>
      )}

      {/* ─── Scanline sweep (reveals logo) ──────────────────────────────── */}
      {phase === "logo" && (
        <div style={{
          position:"fixed", left:"50%", zIndex:10000, pointerEvents:"none",
          marginLeft:`-${logoWidth / 2}px`,
          top:"50%",
          marginTop:`-${logoHeight / 2}px`,
          width:`${logoWidth}px`, height:`${logoHeight}px`,
          overflow:"hidden",
        }}>
          <div style={{
            position:"absolute", left:"-12px", right:"-12px", height:"4px",
            background:"linear-gradient(to right,transparent,rgba(210,240,255,0.98),transparent)",
            boxShadow:"0 0 22px rgba(155,210,255,0.95),0 0 50px rgba(110,175,255,0.55)",
            animation:"ia-scan 0.85s ease forwards",
          }}/>
        </div>
      )}

      {/* ─── Name letters ───────────────────────────────────────────────── */}
      {after("name","tag","hold") && !isFly && (
        <div style={{
          position:"fixed", top:"calc(50% + 56px)", left:"50%",
          transform:"translateX(-50%)",
          zIndex:9998, pointerEvents:"none",
          textAlign:"center",
        }}>
          {/* Red glitch duplicate */}
          <div style={{
            position:"absolute", inset:0,
            fontFamily:"monospace", fontSize:"clamp(11px,1.55vw,15px)",
            letterSpacing:"0.44em", fontWeight:700,
            color:"rgba(255,80,80,0.65)",
            animation: after("hold") ? "ia-glitch 3.8s ease-in-out infinite" : "none",
            userSelect:"none",
          }}>
            {NAME}
          </div>
          {/* Primary */}
          <div style={{
            fontFamily:"monospace", fontSize:"clamp(11px,1.55vw,15px)",
            letterSpacing:"0.44em", fontWeight:700,
            color:"rgba(228,238,255,0.93)",
          }}>
            {NAME.split("").map((ch, i) => (
              <span key={i} style={{
                display:"inline-block",
                animation:`ia-ltr 0.32s cubic-bezier(0.34,1.5,0.64,1) ${i * 65}ms both`,
                color: ch === " " ? "transparent" : undefined,
              }}>
                {ch === " " ? "\u00A0\u00A0" : ch}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ─── Tagline + cursor ───────────────────────────────────────────── */}
      {after("tag","hold") && !isFly && (
        <div style={{
          position:"fixed",
          top:"calc(50% + 90px)",
          left:"50%", transform:"translateX(-50%)",
          zIndex:9998, pointerEvents:"none",
          display:"flex", flexDirection:"column", alignItems:"center",
          animation:"ia-tag 0.5s ease both",
        }}>
          <div style={{
            height:"1px",
            background:"linear-gradient(to right,transparent,rgba(100,165,255,0.72),transparent)",
            marginBottom:"12px",
            animation:"ia-line 0.75s ease forwards",
          }}/>
          <p style={{
            fontFamily:"monospace", fontSize:"10px",
            letterSpacing:"0.52em", textTransform:"uppercase",
            color:"rgba(255,255,255,0.28)",
            display:"flex", alignItems:"center", gap:"3px",
          }}>
            Portfolio&nbsp;·&nbsp;2025
            <span style={{ animation:"ia-cur 0.95s step-end infinite" }}>_</span>
          </p>
        </div>
      )}

      {/* ─── Orbit particle ring SVG (decorative outer ring) ────────────── */}
      {after("rings","logo","name","tag","hold") && !isFly && (
        <div style={{
          position:"fixed", top:"50%", left:"50%",
          transform:"translate(-50%,-50%)",
          zIndex:9995, pointerEvents:"none",
        }}>
          <svg width="380" height="380" viewBox="-190 -190 380 380" style={{
            opacity: after("hold") ? 0.65 : after("tag") ? 0.50 : 0.35,
            transition:"opacity 0.6s ease",
            animation:"ia-ringA 18s linear infinite",
          }}>
            <circle cx="0" cy="0" r="178" fill="none"
              stroke="rgba(100,165,255,0.22)" strokeWidth="0.8"
              strokeDasharray="5 16" />
            <circle cx="0" cy="0" r="155" fill="none"
              stroke="rgba(255,255,255,0.05)" strokeWidth="0.6" />
          </svg>

          {/* 8 orbiting dots on the large ring */}
          {[...Array(8)].map((_, i) => {
            const a = (i / 8) * Math.PI * 2;
            const r = 178;
            return (
              <div key={i} style={{
                position:"absolute",
                width:"5px", height:"5px", borderRadius:"50%",
                background:accentColor,
                boxShadow:`0 0 10px ${accentColor}`,
                top:"50%", left:"50%",
                marginTop:"-2.5px", marginLeft:"-2.5px",
                transform:`translate(${Math.cos(a)*r}px,${Math.sin(a)*r}px)`,
                opacity: after("hold") ? 0.9 : after("tag") ? 0.65 : 0,
                transition:`opacity 0.4s ease ${i * 70}ms`,
              }}/>
            );
          })}
        </div>
      )}
    </>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   PageLoader  —  named export
   A subtle loading indicator that shows while any page is buffering.
   It appears automatically on mount and hides once the page is interactive.
   ─────────────────────────────────────────────────────────────────────────
   Add to app/layout.jsx:
     import { PageLoader } from "@/components/IntroAnimation";
     <PageLoader />
════════════════════════════════════════════════════════════════════════════ */
export function PageLoader() {
  const [visible, setVisible]     = useState(true);
  const [barPhase, setBarPhase]   = useState("loading"); // loading | complete | hidden

  useEffect(() => {
    /* Move bar to 100% once page interactive, then fade out */
    const ready = () => {
      setBarPhase("complete");
      setTimeout(() => setVisible(false), 700);
    };

    if (document.readyState === "complete") {
      /* Page already loaded (instant navigation cache) */
      ready();
    } else {
      window.addEventListener("load", ready, { once: true });
      /* Safety fallback: max 4 s */
      const safe = setTimeout(ready, 4000);
      return () => {
        window.removeEventListener("load", ready);
        clearTimeout(safe);
      };
    }
  }, []);

  if (!visible) return null;

  return (
    <>
      <style>{`
        @keyframes pl-shimmer {
          0%   { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }
        @keyframes pl-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pl-fadeIn {
          from { opacity: 0; } to { opacity: 1; }
        }
      `}</style>

      {/* ── Top progress bar ──────────────────────────────────────────── */}
      <div style={{
        position:"fixed", top:0, left:0, right:0,
        height:"2.5px", zIndex:99999, pointerEvents:"none",
        background:"rgba(255,255,255,0.04)",
      }}>
        <div style={{
          height:"100%",
          background: barPhase === "complete"
            ? "linear-gradient(to right,rgba(100,165,255,0.9),rgba(200,235,255,1))"
            : `linear-gradient(
                90deg,
                rgba(60,100,255,0.7) 0%,
                rgba(130,190,255,0.95) 40%,
                rgba(200,235,255,1) 55%,
                rgba(130,190,255,0.95) 70%,
                rgba(60,100,255,0.7) 100%
              )`,
          backgroundSize: barPhase === "complete" ? "auto" : "800px 100%",
          width: barPhase === "complete" ? "100%" : "65%",
          transition: barPhase === "complete"
            ? "width 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.55s ease 0.3s"
            : "width 2.8s cubic-bezier(0.1,0.6,0.4,1)",
          opacity: barPhase === "complete" ? 0 : 1,
          boxShadow:"0 0 10px rgba(110,175,255,0.65), 0 0 22px rgba(90,150,255,0.30)",
          animation: barPhase !== "complete"
            ? "pl-shimmer 1.8s ease-in-out infinite"
            : "none",
        }}/>
      </div>

      {/* ── Minimal corner spinner ────────────────────────────────────── */}
      {barPhase !== "complete" && (
        <div style={{
          position:"fixed",
          bottom:"clamp(20px,4vw,32px)",
          right:"clamp(20px,4vw,32px)",
          zIndex:99998, pointerEvents:"none",
          animation:"pl-fadeIn 0.4s ease",
          display:"flex", alignItems:"center", gap:"8px",
        }}>
          {/* Spinner ring */}
          <div style={{
            width:"18px", height:"18px", borderRadius:"50%",
            border:"1.5px solid rgba(100,165,255,0.18)",
            borderTopColor:"rgba(100,165,255,0.85)",
            animation:"pl-spin 0.75s linear infinite",
          }}/>
          {/* Label */}
          <span style={{
            fontFamily:"monospace", fontSize:"8px",
            letterSpacing:"0.3em", textTransform:"uppercase",
            color:"rgba(100,165,255,0.38)",
          }}>
            Loading
          </span>
        </div>
      )}
    </>
  );
}