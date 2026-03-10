"use client";

import { useState, useEffect } from 'react';
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
  const pathname = usePathname();

  // ── Update these links to match your actual pages ──────────────────
  const navLinks = [
    { href: '/',           label: 'Home' },
    { href: '/portfolio',  label: 'Portfolio' },
    { href: '/coaching',   label: 'Life Coaching' },
    { href: '/craft',      label: 'Craft' },        // replaces Vision/asset
    { href: '/the-team',   label: 'Milestones' },
  ];

  const socialLinks = [
    { href: 'https://www.linkedin.com/in/mohammad-shafee05', src: '/svg/linkedin.svg',  alt: 'LinkedIn' },
    { href: 'https://github.com/shafee05',                   src: '/svg/github.svg',    alt: 'GitHub' },
    { href: 'https://in.pinterest.com/SHAd0wo5/',           src: '/svg/pinterest.svg', alt: 'Pinterest' },
    { href: 'https://x.com/shafee_05',                      src: '/svg/x.svg',         alt: 'X' },
    { href: 'https://www.youtube.com/@_shafee_05_',         src: '/svg/youtube.svg',   alt: 'YouTube' },
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    const next = !isMenuOpen;
    setIsMenuOpen(next);
    document.body.style.overflow = next ? 'hidden' : 'auto';
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    document.body.style.overflow = 'auto';
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isMenuOpen
          ? 'bg-[rgba(2,4,14,0.92)] backdrop-blur-md border-b border-white/5'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center h-20">

        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0">
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

          {/* Social icons */}
          <div className="flex items-center gap-3 ml-6 pl-6 border-l border-white/10">
            {socialLinks.map(s => (
              <a key={s.alt} href={s.href} target="_blank" rel="noopener noreferrer"
                className="opacity-50 hover:opacity-100 transition-opacity">
                <div className="relative w-5 h-5">
                  <Image src={s.src} alt={s.alt} fill className="object-contain" />
                </div>
              </a>
            ))}
          </div>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden w-10 h-10 flex flex-col justify-center items-center gap-1.5 rounded"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span className={`block w-5 h-px bg-white/80 transition-all duration-300 origin-center ${isMenuOpen ? 'rotate-45 translate-y-[5px]' : ''}`} />
          <span className={`block w-5 h-px bg-white/80 transition-all duration-300 ${isMenuOpen ? 'opacity-0 scale-x-0' : ''}`} />
          <span className={`block w-5 h-px bg-white/80 transition-all duration-300 origin-center ${isMenuOpen ? '-rotate-45 -translate-y-[5px]' : ''}`} />
        </button>
      </div>

      {/* Mobile full-screen menu */}
      <div className={`lg:hidden fixed inset-0 z-40 transition-all duration-350 ${
        isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
        style={{ background: 'rgba(2,4,14,0.98)', backdropFilter: 'blur(20px)' }}
      >
        <div className="container mx-auto px-6 pt-28 pb-12 h-full flex flex-col">

          {/* Nav links */}
          <nav className="flex-1">
            <ul className="flex flex-col gap-2">
              {navLinks.map((link, i) => (
                <li key={link.href} style={{ opacity: isMenuOpen ? 1 : 0, transform: isMenuOpen ? 'translateY(0)' : 'translateY(16px)', transition: `opacity 0.4s ease ${i * 60}ms, transform 0.4s ease ${i * 60}ms` }}>
                  <Link
                    href={link.href}
                    onClick={closeMenu}
                    className={`block py-3 text-2xl font-light tracking-wide transition-opacity ${
                      pathname === link.href ? 'text-white opacity-100' : 'text-white/50 hover:text-white/90'
                    }`}
                  >
                    {link.label}
                  </Link>
                  <div className="h-px bg-white/5 mt-1" />
                </li>
              ))}
            </ul>
          </nav>

          {/* Social + email at bottom */}
          <div className="mt-auto pt-8 border-t border-white/8">
            <div className="flex gap-5 mb-4">
              {socialLinks.map(s => (
                <a key={s.alt} href={s.href} target="_blank" rel="noopener noreferrer"
                  className="opacity-50 hover:opacity-100 transition-opacity">
                  <div className="relative w-5 h-5">
                    <Image src={s.src} alt={s.alt} fill className="object-contain" />
                  </div>
                </a>
              ))}
            </div>
            <p className="text-white/25 text-xs tracking-wider">md.shafee05s@gmail.com</p>
          </div>

        </div>
      </div>
    </header>
  );
}