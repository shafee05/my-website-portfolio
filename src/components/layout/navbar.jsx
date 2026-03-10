"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import React from 'react';

const NavItem = React.memo(function NavItem({ href, children, isActive }) {
  return (
    <li>
      <Link
        href={href}
        className={`block py-2 px-4 text-secondary transition-opacity text-sm tracking-wide ${
          isActive ? 'opacity-100 font-medium' : 'opacity-60 hover:opacity-100'
        }`}
      >
        {children}
      </Link>
    </li>
  );
});

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hovered, setHovered]       = useState(null);
  const pathname = usePathname();
  const dropRef  = useRef(null);
  const btnRef   = useRef(null);

  const navLinks = [
    { href: '/',          label: 'Home',          icon: '⌂', desc: 'Start here'             },
    { href: '/portfolio', label: 'Portfolio',     icon: '◈', desc: 'Projects & work'        },
    { href: '/coaching',  label: 'Life Coaching', icon: '◎', desc: 'Book a session'         },
    { href: '/craft',     label: 'Craft',         icon: '✦', desc: 'XAFAM & remote jobs'    },
    { href: '/the-team',  label: 'Milestones',    icon: '◉', desc: '2021–2025 journey'      },
  ];

  const socialLinks = [
    { href: 'https://www.linkedin.com/in/mohammad-shafee05', src: '/svg/linkedin.svg',  alt: 'LinkedIn'  },
    { href: 'https://github.com/shafee05',                   src: '/svg/github.svg',    alt: 'GitHub'    },
    { href: 'https://in.pinterest.com/SHAd0wo5/',           src: '/svg/pinterest.svg', alt: 'Pinterest' },
    { href: 'https://x.com/shafee_05',                      src: '/svg/x.svg',         alt: 'X'         },
    { href: 'https://www.youtube.com/@_shafee_05_',         src: '/svg/youtube.svg',   alt: 'YouTube'   },
  ];

  useEffect(() => {
    const fn = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // Close when clicking outside
  useEffect(() => {
    if (!isMenuOpen) return;
    const fn = (e) => {
      if (
        dropRef.current && !dropRef.current.contains(e.target) &&
        btnRef.current  && !btnRef.current.contains(e.target)
      ) setIsMenuOpen(false);
    };
    document.addEventListener('mousedown', fn);
    document.addEventListener('touchstart', fn, { passive: true });
    return () => {
      document.removeEventListener('mousedown', fn);
      document.removeEventListener('touchstart', fn);
    };
  }, [isMenuOpen]);

  // Close on route change
  useEffect(() => { setIsMenuOpen(false); }, [pathname]);

  return (
    <>
      <style>{`
        @keyframes dropIn {
          from { opacity:0; transform:translateY(-8px) scale(0.96); }
          to   { opacity:1; transform:translateY(0)    scale(1);    }
        }
        @keyframes rowIn {
          from { opacity:0; transform:translateX(8px); }
          to   { opacity:1; transform:translateX(0);   }
        }
      `}</style>

      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[rgba(2,4,14,0.94)] backdrop-blur-md border-b border-white/5'
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4 flex justify-between items-center h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0" onClick={() => setIsMenuOpen(false)}>
            <div className="relative w-32 h-10">
              <Image src="/svg/logo.svg" alt="Logo" fill priority className="object-contain object-left" />
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            <ul className="flex items-center gap-1">
              {navLinks.map(link => (
                <NavItem key={link.href} href={link.href} isActive={pathname === link.href}>
                  {link.label}
                </NavItem>
              ))}
            </ul>
            <div className="flex items-center gap-3 ml-6 pl-6 border-l border-white/10">
              {socialLinks.map(s => (
                <a key={s.alt} href={s.href} target="_blank" rel="noopener noreferrer"
                  className="opacity-40 hover:opacity-90 transition-opacity">
                  <div className="relative w-5 h-5">
                    <Image src={s.src} alt={s.alt} fill className="object-contain" />
                  </div>
                </a>
              ))}
            </div>
          </nav>

          {/* Mobile trigger — hamburger ↔ X */}
          <button
            ref={btnRef}
            onClick={() => setIsMenuOpen(p => !p)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
            className="lg:hidden relative"
            style={{
              width: '44px', height: '44px', borderRadius: '12px', flexShrink: 0,
              background: isMenuOpen ? 'rgba(100,165,255,0.14)' : 'rgba(255,255,255,0.06)',
              border: `1.5px solid ${isMenuOpen ? 'rgba(100,165,255,0.50)' : 'rgba(255,255,255,0.13)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'background 0.2s, border-color 0.2s',
            }}
          >
            {/* Bars */}
            <span style={{
              position:'absolute', inset:0, display:'flex', flexDirection:'column',
              alignItems:'center', justifyContent:'center', gap:'5px',
              opacity: isMenuOpen ? 0 : 1,
              transform: isMenuOpen ? 'scale(0.5)' : 'scale(1)',
              transition: 'opacity 0.2s, transform 0.2s',
            }}>
              {[0,1,2].map(i => (
                <span key={i} style={{ width:'18px', height:'1.5px', background:'rgba(255,255,255,0.8)', borderRadius:'2px', display:'block' }} />
              ))}
            </span>
            {/* X */}
            <span style={{
              position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center',
              opacity: isMenuOpen ? 1 : 0,
              transform: isMenuOpen ? 'scale(1) rotate(0deg)' : 'scale(0.5) rotate(-90deg)',
              transition: 'opacity 0.2s, transform 0.2s',
            }}>
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <line x1="2" y1="2" x2="13" y2="13" stroke="rgba(100,165,255,0.9)" strokeWidth="2" strokeLinecap="round"/>
                <line x1="13" y1="2" x2="2"  y2="13" stroke="rgba(100,165,255,0.9)" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </span>
          </button>

        </div>

        {/* ── Dropdown panel — pops from top-right ── */}
        {isMenuOpen && (
          <div
            ref={dropRef}
            style={{
              position: 'absolute',
              top: 'calc(100% + 10px)',
              right: '16px',
              width: 'min(290px, calc(100vw - 32px))',
              background: 'rgba(3, 6, 20, 0.99)',
              border: '1px solid rgba(100,165,255,0.20)',
              borderRadius: '18px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(100,165,255,0.05), inset 0 1px 0 rgba(255,255,255,0.04)',
              zIndex: 60,
              overflow: 'hidden',
              animation: 'dropIn 0.22s cubic-bezier(0.22,1,0.36,1) both',
            }}
          >

            {/* Header row */}
            <div style={{
              display:'flex', alignItems:'center', justifyContent:'space-between',
              padding:'13px 16px 11px',
              borderBottom:'1px solid rgba(255,255,255,0.05)',
            }}>
              <span style={{ fontSize:'9px', letterSpacing:'0.4em', color:'rgba(100,165,255,0.5)', textTransform:'uppercase', fontFamily:'monospace' }}>
                Pages
              </span>
              <button
                onClick={() => setIsMenuOpen(false)}
                style={{
                  width:'26px', height:'26px', borderRadius:'7px', cursor:'pointer',
                  background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.09)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  transition:'background 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.12)'}
                onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.05)'}
                aria-label="Close menu"
              >
                <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                  <line x1="1" y1="1" x2="8" y2="8" stroke="rgba(255,255,255,0.45)" strokeWidth="1.4" strokeLinecap="round"/>
                  <line x1="8" y1="1" x2="1" y2="8" stroke="rgba(255,255,255,0.45)" strokeWidth="1.4" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {/* Nav rows */}
            <nav aria-label="Site pages">
              <ul style={{ margin:0, padding:'6px 0', listStyle:'none' }}>
                {navLinks.map((link, i) => {
                  const active = pathname === link.href;
                  const hot    = hovered === link.href;
                  return (
                    <li key={link.href} style={{ animation:`rowIn 0.18s ease ${i*40+30}ms both` }}>
                      <Link
                        href={link.href}
                        onClick={() => setIsMenuOpen(false)}
                        onMouseEnter={() => setHovered(link.href)}
                        onMouseLeave={() => setHovered(null)}
                        style={{
                          display:'flex', alignItems:'center', gap:'11px',
                          padding:'10px 16px',
                          textDecoration:'none',
                          background: hot ? 'rgba(100,165,255,0.09)' : active ? 'rgba(100,165,255,0.05)' : 'transparent',
                          borderLeft:`2.5px solid ${active ? 'rgba(100,165,255,0.75)' : 'transparent'}`,
                          transition:'background 0.14s, border-color 0.14s',
                        }}
                      >
                        {/* Icon box */}
                        <span style={{
                          width:'32px', height:'32px', borderRadius:'9px', flexShrink:0,
                          background: active ? 'rgba(100,165,255,0.13)' : 'rgba(255,255,255,0.04)',
                          border:`1px solid ${active ? 'rgba(100,165,255,0.35)' : 'rgba(255,255,255,0.07)'}`,
                          display:'flex', alignItems:'center', justifyContent:'center',
                          fontSize:'13px',
                          color: active ? 'rgba(140,200,255,0.95)' : 'rgba(255,255,255,0.35)',
                          transition:'background 0.14s, border-color 0.14s, color 0.14s',
                        }}>
                          {link.icon}
                        </span>

                        {/* Text */}
                        <span style={{ flex:1, minWidth:0 }}>
                          <span style={{
                            display:'block',
                            fontSize:'13.5px',
                            fontWeight: active ? 500 : 400,
                            color: active ? 'rgba(220,235,255,0.95)' : hot ? 'rgba(200,220,255,0.80)' : 'rgba(255,255,255,0.55)',
                            letterSpacing:'0.01em',
                            lineHeight:1.2,
                            transition:'color 0.14s',
                          }}>
                            {link.label}
                          </span>
                          <span style={{
                            display:'block',
                            fontSize:'10.5px',
                            color: active ? 'rgba(100,165,255,0.55)' : 'rgba(255,255,255,0.22)',
                            marginTop:'2px',
                            transition:'color 0.14s',
                          }}>
                            {link.desc}
                          </span>
                        </span>

                        {/* Arrow */}
                        <svg
                          width="14" height="14" viewBox="0 0 14 14" fill="none"
                          style={{
                            flexShrink:0,
                            opacity: hot || active ? 1 : 0.25,
                            transform: hot ? 'translateX(2px)' : 'translateX(0)',
                            transition:'opacity 0.14s, transform 0.14s',
                          }}
                        >
                          <path d="M3 7h8M8 4l3 3-3 3" stroke={active ? 'rgba(100,165,255,0.85)' : 'rgba(255,255,255,0.55)'} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Social footer */}
            <div style={{
              borderTop:'1px solid rgba(255,255,255,0.05)',
              padding:'10px 16px',
              display:'flex', alignItems:'center', justifyContent:'space-between',
            }}>
              <span style={{ fontSize:'9px', letterSpacing:'0.3em', color:'rgba(255,255,255,0.18)', textTransform:'uppercase' }}>
                Connect
              </span>
              <div style={{ display:'flex', gap:'8px', alignItems:'center' }}>
                {socialLinks.map(s => (
                  <a
                    key={s.alt} href={s.href} target="_blank" rel="noopener noreferrer"
                    title={s.alt}
                    style={{ opacity:0.35, transition:'opacity 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.opacity='0.9'}
                    onMouseLeave={e => e.currentTarget.style.opacity='0.35'}
                  >
                    <div style={{ position:'relative', width:'15px', height:'15px' }}>
                      <Image src={s.src} alt={s.alt} fill className="object-contain" />
                    </div>
                  </a>
                ))}
              </div>
            </div>

          </div>
        )}
      </header>

      {/* Dim backdrop — tap anywhere outside to close */}
      {isMenuOpen && (
        <div
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
          style={{
            position:'fixed', inset:0, zIndex:49,
            background:'rgba(0,0,0,0.30)',
            backdropFilter:'blur(1px)',
            WebkitBackdropFilter:'blur(1px)',
          }}
        />
      )}
    </>
  );
}