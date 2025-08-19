"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
// import GoogleTranslate from '@/components/layout/GoogleTranslate'; 
const NavItem = ({ href, children, isActive }) => (
  <li className="navbar-item">
    <Link
      href={href}
      className={`block py-2 px-4 text-secondary hover:opacity-80 transition-opacity ${isActive ? 'font-medium' : ''}`}
    >
      {children}
    </Link>
  </li>
);

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/portfolio', label: 'Portfolio' },
    { href: '/asset', label: 'Vision' },
    { href: '/the-team', label: 'Milestones' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (!isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isMenuOpen ? 'bg-shafee-dark' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <div className="relative w-32 h-12">
            <Image
              src="/svg/logo.svg"
              alt="Altermind"
              fill
              priority
              className="object-contain"
            />
          </div>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden lg:flex items-center space-x-6">
          <ul className="flex space-x-6">
            {navLinks.map((link) => (
              <NavItem
                key={link.href}
                href={link.href}
                isActive={pathname === link.href}
              >
                {link.label}
              </NavItem>
            ))}
          </ul>

          <div className="flex items-center space-x-4 ml-6 relative">
            <a href="https://www.linkedin.com/in/mohammad-shafee05" target="_blank" rel="noopener noreferrer" className="text-secondary">
              <div className="relative w-6 h-6">
                <Image
                  src="/svg/linkedin.svg"
                  alt="LinkedIn"
                  fill
                  className="object-contain"
                />
              </div>
            </a>
            <a href="https://github.com/shafee05" target="_blank" rel="noopener noreferrer" className="text-secondary">
              <div className="relative w-6 h-6">
                <Image
                  src="/svg/github.svg"
                  alt="GitHub"
                  fill
                  className="object-contain"
                />
              </div>
            </a>

            <a href="https://in.pinterest.com/SHAd0wo5/" target="_blank" rel="noopener noreferrer" className="text-secondary">
              <div className="relative w-6 h-6">
                <Image
                  src="/svg/pinterest.svg"
                  alt="Pinterest"
                  fill
                  className="object-contain"
                />
              </div>
            </a>

            <a href="https://x.com/shafee_05" target="_blank" rel="noopener noreferrer" className="text-secondary">
              <div className="relative w-6 h-6">
                <Image
                  src="/svg/x.svg"
                  alt="X (Twitter)"
                  fill
                  className="object-contain"
                />
              </div>
            </a>

            {/* <div className="ml-4"> 
              <GoogleTranslate />
            </div> */}
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden flex flex-col justify-center items-center w-10 h-10 rounded-md"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <div className="relative">
            <span className={`block w-6 h-0.5 bg-secondary transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1' : 'mb-1'}`}></span>
            <span className={`block w-6 h-0.5 bg-secondary transition-all duration-300 ${isMenuOpen ? '-rotate-45' : 'mt-1'}`}></span>
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden fixed inset-0 bg-shafee-dark z-40 transition-transform duration-300 ${isMenuOpen ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="container mx-auto px-4 pt-24 pb-8 h-full flex flex-col">
          <nav className="flex-1">
            <ul className="space-y-6 text-xl">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`block py-2 text-secondary hover:opacity-80 transition-opacity ${pathname === link.href ? 'font-medium' : ''}`}
                    onClick={toggleMenu}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-auto">
            <div className="flex justify-start space-x-6 mb-6">
              <a href="https://www.linkedin.com/in/mohammad-shafee05" target="_blank" rel="noopener noreferrer" className="text-secondary">
                <div className="relative w-6 h-6">
                  <Image
                    src="/svg/linkedin.svg"
                    alt="LinkedIn"
                    fill
                    className="object-contain"
                  />
                </div>
              </a>

              <a href="https://github.com/shafee05" target="_blank" rel="noopener noreferrer" className="text-secondary">
                <div className="relative w-6 h-6">
                  <Image
                    src="/svg/github.svg"
                    alt="GitHub"
                    fill
                    className="object-contain"
                  />
                </div>
              </a>

              <a href="https://in.pinterest.com/SHAd0wo5/" target="_blank" rel="noopener noreferrer" className="text-secondary">
                <div className="relative w-6 h-6">
                  <Image
                    src="/svg/pinterest.svg"
                    alt="Pinterest"
                    fill
                    className="object-contain"
                  />
                </div>
              </a>

              <a href="https://x.com/shafee_05" target="_blank" rel="noopener noreferrer" className="text-secondary">
              <div className="relative w-6 h-6">
                <Image
                  src="/svg/x.svg"
                  alt="X (Twitter)"
                  fill
                  className="object-contain"
                />
              </div>
            </a>

            </div>
          </div>
        </div>
      </div>
    </header>
  );
}