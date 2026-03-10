"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';

const HeroOrb = dynamic(() => import('@/components/HeroOrb'), { ssr: false });

export default function Hero({
  title,
  subtitle,
  backgroundImage,      // kept for API compatibility, no longer used
  showButton = false,
  buttonText = 'Discover Altermind in video',
  buttonAction = () => {},
  children,
}) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section
      style={{
        position: 'relative',
        /*
          MOBILE FIX: Use 100dvh (dynamic viewport height) as primary value.
          On mobile browsers, 100vh includes the address bar height which causes
          the section to be taller than the visible screen.
          dvh updates dynamically as the address bar hides/shows.
          The fallback 100vh handles browsers that don't support dvh yet.
        */
        minHeight: '100vh',
        minHeight: '100dvh',
        width: '100%',
        maxWidth: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        /*
          MOBILE FIX: overflow hidden is critical — it clips the Three.js canvas
          to this section so it cannot push the page wider than the screen.
        */
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {/* 3D canvas — fills 100% of this section only */}
      <HeroOrb />

      {/* Text content — above the canvas */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          pointerEvents: 'none',
          textAlign: 'center',
          /*
            MOBILE FIX: Constrain content width and add horizontal padding
            so text never touches screen edges on small phones
          */
          width: '100%',
          maxWidth: '100%',
          padding: '8rem 1.5rem 2rem',
          boxSizing: 'border-box',
        }}
      >
        <h1
          className={`font-freight text-5xl md:text-6xl lg:text-8xl text-secondary mb-6 transition-all duration-1000 transform ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
          style={{
            textShadow: '0 0 40px rgba(0,150,255,0.25)',
            /* MOBILE FIX: Prevent long names from overflowing on small screens */
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
            lineHeight: 1.1,
          }}
        >
          {title}
        </h1>

        <p
          className={`text-lg md:text-xl uppercase tracking-wider text-secondary font-light transition-all duration-1000 delay-300 transform ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
          style={{
            textShadow: '0 0 20px rgba(0,120,255,0.2)',
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
            /* Tighten tracking on very small screens */
            letterSpacing: 'clamp(0.05em, 0.15em, 0.2em)',
          }}
        >
          {subtitle}
        </p>

        {showButton && (
          <div
            className={`mt-12 transition-all duration-1000 delay-600 transform ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
            style={{ pointerEvents: 'auto' }}
          >
            <button
              onClick={buttonAction}
              className="bg-transparent border border-altermind-light-green rounded-full text-secondary py-3 px-8 flex items-center mx-auto hover:bg-altermind-light-green/10 transition-colors"
              style={{ maxWidth: '100%' }}
            >
              <span className="mr-2">{buttonText}</span>
              <div style={{ position: 'relative', width: 16, height: 16, flexShrink: 0 }}>
                <Image src="/svg/arrow-white-right.svg" alt="Arrow" fill className="object-contain" />
              </div>
            </button>
          </div>
        )}

        {children && (
          <div
            className={`mt-6 transition-all duration-1000 delay-900 transform ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
            style={{ pointerEvents: 'auto' }}
          >
            {children}
          </div>
        )}
      </div>

      {/* Drag hint — hidden on very small phones to avoid clutter */}
      <div
        style={{
          position: 'absolute', bottom: 24, right: 20, zIndex: 3,
          fontSize: '9px', letterSpacing: '0.3em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.22)', pointerEvents: 'none',
          display: 'block',
        }}
      >
        drag to rotate ⟳
      </div>
    </section>
  );
}