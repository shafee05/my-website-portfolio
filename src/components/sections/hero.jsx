"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function Hero({
  title,
  subtitle,
  backgroundImage = '/images/home-bg.jpg',
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
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="container mx-auto px-4 relative z-10 text-center py-32 mt-16">
        <h1
          className={`font-freight text-5xl md:text-6xl lg:text-8xl text-secondary mb-6 transition-all duration-1000 transform ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          {title}
        </h1>

        <p
          className={`text-lg md:text-xl uppercase tracking-wider text-secondary font-light transition-all duration-1000 delay-300 transform ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          {subtitle}
        </p>

        {showButton && (
          <div
            className={`mt-12 transition-all duration-1000 delay-600 transform ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            <button
              onClick={buttonAction}
              className="bg-transparent border border-altermind-light-green rounded-full text-secondary py-3 px-8 flex items-center mx-auto hover:bg-altermind-light-green/10 transition-colors"
            >
              <span className="mr-2">{buttonText}</span>
              <div className="relative w-4 h-4">
                <Image
                  src="/svg/arrow-white-right.svg"
                  alt="Arrow"
                  fill
                  className="object-contain"
                />
              </div>
            </button>
          </div>
        )}

        {children && (
          <div
            className={`mt-6 transition-all duration-1000 delay-900 transform ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            {children}
          </div>
        )}
      </div>
    </section>
  );
}