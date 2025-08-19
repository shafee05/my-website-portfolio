"use client";

import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/portfolio', label: 'Portfolio' },
    { href: '/asset', label: 'Vision' },
    { href: '/the-team', label: 'Milestones' },
  ];

  return (
    <footer className="bg-shafee-dark text-secondary pt-16 pb-6">
      <div className="container mx-auto px-4">
        <div className="flex justify-center mb-12">
          <div className="relative w-12 h-12">
            <Image
              src="/svg/tree.svg"
              alt="Logo"
              fill
              className="object-contain"
            />
          </div>
        </div>

        <div className="border-t border-shafee-medium/30 pt-8">
          <nav className="mb-10">
            <ul className="flex flex-wrap justify-center gap-x-8 gap-y-4">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:opacity-80 transition-opacity text-sm uppercase tracking-wider"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="order-2 md:order-1 flex items-center">
              <div className="flex items-center space-x-4">
                <a href="https://www.linkedin.com/in/mohammad-shafee05" target="_blank" rel="noreferrer" className="text-secondary">
                  <div className="relative w-5 h-5">
                    <Image
                      src="/svg/linkedin.svg"
                      alt="LinkedIn"
                      fill
                      className="object-contain"
                    />
                  </div>
                </a>
                <a href="https://github.com/shafee05" target="_blank" rel="noreferrer" className="text-secondary">
                  <div className="relative w-5 h-5">
                    <Image
                      src="/svg/github.svg"
                      alt="GitHub"
                      fill
                      className="object-contain"
                    />
                  </div>
                </a>
              </div>
            </div>

            <div className="order-1 md:order-2 text-xs text-shafee-lighter flex flex-col md:flex-row items-center gap-4">
              <span>© 2025 Mohammad Shafee ur Rahaman</span>
              <a
                href="mailto:md.shafee05s@gmail.com"
                className="hover:text-secondary transition-colors"
              >
                md.shafee05s@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
