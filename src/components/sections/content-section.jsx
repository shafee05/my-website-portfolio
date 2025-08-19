"use client";

import { useEffect, useState, useRef } from 'react';

export default function ContentSection({
  title,
  paragraphs = [],
  className = '',
  bgColor = 'bg-altermind-dark-green',
  textColor = 'text-secondary',
}) {
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(entry.target);
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const titleLines = title.split('<br/>');

  return (
    <section ref={sectionRef} className={`py-20 ${bgColor} ${textColor} ${className}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-freight text-3xl md:text-4xl lg:text-5xl mb-16 lg:leading-tight">
            {titleLines.map((line, index) => (
              <div
                key={index}
                className={`transform transition-all duration-1000 delay-${index * 100} ${
                  isInView
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-10 opacity-0'
                }`}
              >
                {line}
              </div>
            ))}
          </h2>

          <div className={`grid md:grid-cols-${paragraphs.length > 1 ? '2' : '1'} gap-10`}>
            {paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className={`text-lg leading-relaxed transform transition-all duration-1000 delay-${500 + index * 200} ${
                  isInView
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-10 opacity-0'
                }`}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
