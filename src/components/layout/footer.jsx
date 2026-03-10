"use client";

import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  const navLinks = [
    { href: '/',          label: 'Home' },
    { href: '/portfolio', label: 'Portfolio' },
    { href: '/coaching',  label: 'Life Coaching' },
    { href: '/craft',     label: 'Craft' },
    { href: '/the-team',  label: 'Milestones' },
  ];

  const socialLinks = [
    { href: 'https://www.linkedin.com/in/mohammad-shafee05', src: '/svg/linkedin.svg',  alt: 'LinkedIn' },
    { href: 'https://github.com/shafee05',                   src: '/svg/github.svg',    alt: 'GitHub' },
    { href: 'https://in.pinterest.com/SHAd0wo5/',           src: '/svg/pinterest.svg', alt: 'Pinterest' },
    { href: 'https://x.com/shafee_05',                      src: '/svg/x.svg',         alt: 'X' },
    { href: 'https://www.youtube.com/@_shafee_05_',         src: '/svg/youtube.svg',   alt: 'YouTube' },
  ];

  return (
    <footer style={{ background: 'rgba(2,4,14,1)', borderTop: '1px solid rgba(255,255,255,0.05)' }}
      className="text-white pt-14 pb-8">
      <div className="container mx-auto px-4">

        {/* Logo mark */}
        <div className="flex justify-center mb-10">
          <div className="relative w-10 h-10 opacity-40 hover:opacity-70 transition-opacity">
            <Image src="/svg/logo.svg" alt="Logo" fill className="object-contain" />
          </div>
        </div>

        {/* Nav links */}
        <nav className="mb-10">
          <ul className="flex flex-wrap justify-center gap-x-8 gap-y-3">
            {navLinks.map(link => (
              <li key={link.href}>
                <Link href={link.href}
                  className="text-white/35 hover:text-white/75 transition-colors text-xs uppercase tracking-widest">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Divider */}
        <div className="border-t border-white/5 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">

            {/* Social icons */}
            <div className="flex items-center gap-4 order-2 md:order-1">
              {socialLinks.map(s => (
                <a key={s.alt} href={s.href} target="_blank" rel="noreferrer"
                  className="opacity-30 hover:opacity-70 transition-opacity">
                  <div className="relative w-4 h-4">
                    <Image src={s.src} alt={s.alt} fill className="object-contain" />
                  </div>
                </a>
              ))}
            </div>

            {/* Copyright + email */}
            <div className="order-1 md:order-2 flex flex-col md:flex-row items-center gap-4 text-white/25 text-xs tracking-wide">
              <span>© 2025 Mohammad Shafee ur Rahaman</span>
              <span className="hidden md:block opacity-40">·</span>
              <a href="mailto:md.shafee05s@gmail.com" className="hover:text-white/55 transition-colors">
                md.shafee05s@gmail.com
              </a>
            </div>

          </div>
        </div>
      </div>
    </footer>
  );
}