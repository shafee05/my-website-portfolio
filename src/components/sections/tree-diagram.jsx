// tree-diagram.jsx
"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

export default function TreeDiagram({ title }) {
  const [isInView, setIsInView] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const sectionRef = useRef(null);

  const clientItems = [
    'Cross-sectoral experience and expertise',
    'Up-to-date academic knowledge',
    'Actionable advice',
    'Mobilisation of high profile decision makers',
  ];

  const expertItems = [
    'Real world challenges',
    'Access to data',
    'Insights from other disciplines',
    'Broadening their network',
    'Helping make change happen',
  ];

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

  const titleLines = title ? title.split('<br/>') : ['Unleashing the power of', 'academia to drive business', 'excellence'];

  return (
    <section ref={sectionRef} className="py-20 bg-altermind-off-white text-altermind-dark-green" aria-labelledby="tree-title">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="md:flex md:gap-12">
            {/* Title */}
            <div className="md:w-1/3 mb-12 md:mb-0">
              <h2 id="tree-title" className="font-freight text-3xl md:text-4xl lg:text-5xl lg:leading-tight">
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
            </div>

            {/* Tree Diagram */}
            <div className="md:w-2/3">
              <div className="relative">
                {/* Tree Image */}
                <div className="flex justify-center mb-12">
                  <div className="relative w-48 h-48">
                    <Image
                      src="/svg/tree.svg"
                      alt="Tree Diagram Illustration"
                      fill
                      className="object-contain"
                      loading="lazy"
                    />
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex justify-center space-x-12 mb-6" role="tablist"> {/* Accessibility: tablist */}
                  <button
                    className={`pb-2 relative ${activeTab === 0 ? 'font-medium' : 'opacity-70'}`}
                    onClick={() => setActiveTab(0)}
                    role="tab"
                    aria-selected={activeTab === 0}
                    aria-controls="client-panel"
                  >
                    What our clients get
                    {activeTab === 0 && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-altermind-dark-green"></span>
                    )}
                  </button>
                  <button
                    className={`pb-2 relative ${activeTab === 1 ? 'font-medium' : 'opacity-70'}`}
                    onClick={() => setActiveTab(1)}
                    role="tab"
                    aria-selected={activeTab === 1}
                    aria-controls="expert-panel"
                  >
                    What our experts get
                    {activeTab === 1 && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-altermind-dark-green"></span>
                    )}
                  </button>
                </div>

                {/* Content */}
                <div className="relative overflow-hidden">
                  {/* Client Content */}
                  <div
                    id="client-panel"
                    role="tabpanel"
                    className={`transition-all duration-500 transform ${
                      activeTab === 0 ? 'translate-x-0 opacity-100' : 'absolute translate-x-full opacity-0'
                    }`}
                  >
                    <ul className="grid grid-cols-2 gap-x-6 gap-y-4">
                      {clientItems.map((item, index) => (
                        <li
                          key={index}
                          className={`py-2 transform transition-all duration-1000 delay-${500 + index * 100} ${
                            isInView && activeTab === 0
                              ? 'translate-y-0 opacity-100'
                              : 'translate-y-10 opacity-0'
                          }`}
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Expert Content */}
                  <div
                    id="expert-panel"
                    role="tabpanel"
                    className={`transition-all duration-500 transform ${
                      activeTab === 1 ? 'translate-x-0 opacity-100' : 'absolute translate-x-full opacity-0'
                    }`}
                  >
                    <ul className="grid grid-cols-2 gap-x-6 gap-y-4">
                      {expertItems.map((item, index) => (
                        <li
                          key={index}
                          className={`py-2 transform transition-all duration-1000 delay-${500 + index * 100} ${
                            isInView && activeTab === 1
                              ? 'translate-y-0 opacity-100'
                              : 'translate-y-10 opacity-0'
                          }`}
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}