"use client";

import Hero from "@/components/sections/hero";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function TeamPage() {
  const timelineRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    if (timelineRef.current) {
      observer.observe(timelineRef.current);
    }

    return () => {
      if (timelineRef.current) {
        observer.unobserve(timelineRef.current);
      }
    };
  }, []);

  const editedImages = [
    { id: 'sh1', src: '/images/sh1.jpg', alt: 'Edited Image 1' },
    { id: 'sh2', src: '/images/sh2.jpg', alt: 'Edited Image 2' },
    { id: 'sh3', src: '/images/sh3.jpg', alt: 'Edited Image 3' },
    // { id: 'sh4', src: '/images/sh4.jpg', alt: 'Edited Image 4' },
    // { id: 'sh5', src: '/images/sh5.jpg', alt: 'Edited Image 5' },
  ];

  return (
    <>
      {/* Hero Section */}
      <Hero
        title="My Journey of Achievements"
        subtitle="Proven Success That Powers Your Digital Future"
        backgroundImage="/images/people-bg.jpg"
      />

      {/* Milestones Section */}
      <section className="py-24 bg-altermind-off-white text-altermind-dark-green">
        <div className="container mx-auto px-4">
          <h2 className="font-freight text-4xl md:text-5xl text-center mb-16">
            My Journey of Crafting Exceptional AI Solutions
          </h2>
          <div ref={timelineRef} className="max-w-4xl mx-auto">
            {/* Timeline Items */}
            <div className="mb-10 flex items-center">
              <div className="w-1/2 pr-4 text-right relative">
                <div className="opacity-0 animate-fadeIn animation-delay-0">
                  <h3 className="text-lg font-medium">2019–2021</h3>
                  <p className="text-lg text-altermind-dark-green/80">Narayana Junior College</p>
                  <p className="text-lg text-altermind-dark-green/80">Intermediate (MPC) – 92.3%</p>
                </div>
              </div>
              <div className="w-1/2 pl-4 relative">
                <span className="inline-block w-3 h-3 bg-gray-800 rounded-full absolute left-1/2 transform -translate-x-1/2 z-10 opacity-0 animate-fadeIn animation-delay-0"></span>
              </div>
            </div>
            <div className="mb-10 flex items-center flex-row-reverse">
              <div className="w-1/2 pl-4 text-left relative">
                <div className="opacity-0 animate-fadeIn animation-delay-500">
                  <h3 className="text-lg font-medium">2021–2025</h3>
                  <p className="text-lg text-altermind-dark-green/80">B.Tech in Data Science Engineering</p>
                  <p className="text-lg text-altermind-dark-green/80">ACE Engineering College, Hyderabad (CGPA: 7.69)</p>
                </div>
              </div>
              <div className="w-1/2 pr-4 relative">
                <span className="inline-block w-3 h-3 bg-gray-800 rounded-full absolute left-1/2 transform -translate-x-1/2 z-10 opacity-0 animate-fadeIn animation-delay-500"></span>
              </div>
            </div>
            <div className="mb-10 flex items-center">
              <div className="w-1/2 pr-4 text-right relative">
                <div className="opacity-0 animate-fadeIn animation-delay-1000">
                  <h3 className="text-lg font-medium">2021</h3>
                  <p className="text-lg text-altermind-dark-green/80">Business English Certificate</p>
                  <p className="text-lg text-altermind-dark-green/80">Demonstrated proficiency in professional communication.</p>
                </div>
              </div>
              <div className="w-1/2 pl-4 relative">
                <span className="inline-block w-3 h-3 bg-gray-800 rounded-full absolute left-1/2 transform -translate-x-1/2 z-10 opacity-0 animate-fadeIn animation-delay-1000"></span>
              </div>
            </div>
            <div className="mb-10 flex items-center flex-row-reverse">
              <div className="w-1/2 pl-4 text-left relative">
                <div className="opacity-0 animate-fadeIn animation-delay-1500">
                  <h3 className="text-lg font-medium">2021</h3>
                  <p className="text-lg text-altermind-dark-green/80">Python Programming – Rinex</p>
                  <p className="text-lg text-altermind-dark-green/80">Gained foundational programming skills in Python for data science.</p>
                </div>
              </div>
              <div className="w-1/2 pr-4 relative">
                <span className="inline-block w-3 h-3 bg-gray-800 rounded-full absolute left-1/2 transform -translate-x-1/2 z-10 opacity-0 animate-fadeIn animation-delay-1500"></span>
              </div>
            </div>
            <div className="mb-10 flex items-center">
              <div className="w-1/2 pr-4 text-right relative">
                <div className="opacity-0 animate-fadeIn animation-delay-2000">
                  <h3 className="text-lg font-medium">2022</h3>
                  <p className="text-lg text-altermind-dark-green/80">Developed Core Soft Skills</p>
                  <p className="text-lg text-altermind-dark-green/80">Enhanced communication and team collaboration through academic projects.</p>
                </div>
              </div>
              <div className="w-1/2 pl-4 relative">
                <span className="inline-block w-3 h-3 bg-gray-800 rounded-full absolute left-1/2 transform -translate-x-1/2 z-10 opacity-0 animate-fadeIn animation-delay-2000"></span>
              </div>
            </div>
            <div className="mb-10 flex items-center flex-row-reverse">
              <div className="w-1/2 pl-4 text-left relative">
                <div className="opacity-0 animate-fadeIn animation-delay-2500">
                  <h3 className="text-lg font-medium">2022</h3>
                  <p className="text-lg text-altermind-dark-green/80">First AI Project</p>
                  <p className="text-lg text-altermind-dark-green/80">Built a basic sentiment analysis model using Python and NLTK.</p>
                </div>
              </div>
              <div className="w-1/2 pr-4 relative">
                <span className="inline-block w-3 h-3 bg-gray-800 rounded-full absolute left-1/2 transform -translate-x-1/2 z-10 opacity-0 animate-fadeIn animation-delay-2500"></span>
              </div>
            </div>
            <div className="mb-10 flex items-center">
              <div className="w-1/2 pr-4 text-right relative">
                <div className="opacity-0 animate-fadeIn animation-delay-3000">
                  <h3 className="text-lg font-medium">2022</h3>
                  <p className="text-lg text-altermind-dark-green/80">Prompt Engineering Basics</p>
                  <p className="text-lg text-altermind-dark-green/80">Completed an introductory course on prompt engineering for AI models.</p>
                </div>
              </div>
              <div className="w-1/2 pl-4 relative">
                <span className="inline-block w-3 h-3 bg-gray-800 rounded-full absolute left-1/2 transform -translate-x-1/2 z-10 opacity-0 animate-fadeIn animation-delay-3000"></span>
              </div>
            </div>
            <div className="mb-10 flex items-center flex-row-reverse">
              <div className="w-1/2 pl-4 text-left relative">
                <div className="opacity-0 animate-fadeIn animation-delay-3500">
                  <h3 className="text-lg font-medium">2023</h3>
                  <p className="text-lg text-altermind-dark-green/80">Prompt Engineering for Generative AI</p>
                  <p className="text-lg text-altermind-dark-green/80">Mastered techniques for optimizing generative AI models.</p>
                </div>
              </div>
              <div className="w-1/2 pr-4 relative">
                <span className="inline-block w-3 h-3 bg-gray-800 rounded-full absolute left-1/2 transform -translate-x-1/2 z-10 opacity-0 animate-fadeIn animation-delay-3500"></span>
              </div>
            </div>
            <div className="mb-10 flex items-center">
              <div className="w-1/2 pr-4 text-right relative">
                <div className="opacity-0 animate-fadeIn animation-delay-4000">
                  <h3 className="text-lg font-medium">2023</h3>
                  <p className="text-lg text-altermind-dark-green/80">Salesforce VIP Internship</p>
                  <p className="text-lg text-altermind-dark-green/80">Completed an 8-week CRM development program.</p>
                </div>
              </div>
              <div className="w-1/2 pl-4 relative">
                <span className="inline-block w-3 h-3 bg-gray-800 rounded-full absolute left-1/2 transform -translate-x-1/2 z-10 opacity-0 animate-fadeIn animation-delay-4000"></span>
              </div>
            </div>
            <div className="mb-10 flex items-center flex-row-reverse">
              <div className="w-1/2 pl-4 text-left relative">
                <div className="opacity-0 animate-fadeIn animation-delay-4500">
                  <h3 className="text-lg font-medium">2023</h3>
                  <p className="text-lg text-altermind-dark-green/80">Hack-A-Bot Winner</p>
                  <p className="text-lg text-altermind-dark-green/80">Recognized for creativity and technical innovation in a hackathon.</p>
                </div>
              </div>
              <div className="w-1/2 pr-4 relative">
                <span className="inline-block w-3 h-3 bg-gray-800 rounded-full absolute left-1/2 transform -translate-x-1/2 z-10 opacity-0 animate-fadeIn animation-delay-4500"></span>
              </div>
            </div>
            <div className="mb-10 flex items-center">
              <div className="w-1/2 pr-4 text-right relative">
                <div className="opacity-0 animate-fadeIn animation-delay-5000">
                  <h3 className="text-lg font-medium">2024</h3>
                  <p className="text-lg text-altermind-dark-green/80">UiPath RPA – Infosys Foundation</p>
                  <p className="text-lg text-altermind-dark-green/80">Acquired skills in Robotic Process Automation.</p>
                </div>
              </div>
              <div className="w-1/2 pl-4 relative">
                <span className="inline-block w-3 h-3 bg-gray-800 rounded-full absolute left-1/2 transform -translate-x-1/2 z-10 opacity-0 animate-fadeIn animation-delay-5000"></span>
              </div>
            </div>
            <div className="mb-10 flex items-center flex-row-reverse">
              <div className="w-1/2 pl-4 text-left relative">
                <div className="opacity-0 animate-fadeIn animation-delay-5500">
                  <h3 className="text-lg font-medium">2024</h3>
                  <p className="text-lg text-altermind-dark-green/80">Specialized Prompt Engineering for Multimodal AI</p>
                  <p className="text-lg text-altermind-dark-green/80">Focused on text and image-based AI models for applications like GestureTalk.</p>
                </div>
              </div>
              <div className="w-1/2 pr-4 relative">
                <span className="inline-block w-3 h-3 bg-gray-800 rounded-full absolute left-1/2 transform -translate-x-1/2 z-10 opacity-0 animate-fadeIn animation-delay-5500"></span>
              </div>
            </div>
            <div className="mb-10 flex items-center">
              <div className="w-1/2 pr-4 text-right relative">
                <div className="opacity-0 animate-fadeIn animation-delay-6000">
                  <h3 className="text-lg font-medium">2024</h3>
                  <p className="text-lg text-altermind-dark-green/80">Flipkart Grid 5.0 Participant</p>
                  <p className="text-lg text-altermind-dark-green/80">Competed in a national-level tech challenge, showcasing problem-solving skills.</p>
                </div>
              </div>
              <div className="w-1/2 pl-4 relative">
                <span className="inline-block w-3 h-3 bg-gray-800 rounded-full absolute left-1/2 transform -translate-x-1/2 z-10 opacity-0 animate-fadeIn animation-delay-6000"></span>
              </div>
            </div>
            <div className="mb-10 flex items-center flex-row-reverse">
              <div className="w-1/2 pl-4 text-left relative">
                <div className="opacity-0 animate-fadeIn animation-delay-6500">
                  <h3 className="text-lg font-medium">2024</h3>
                  <p className="text-lg text-altermind-dark-green/80">Cricket Player Performance Prediction</p>
                  <p className="text-lg text-altermind-dark-green/80">Developed a predictive ML model, improving accuracy by 15%.</p>
                </div>
              </div>
              <div className="w-1/2 pr-4 relative">
                <span className="inline-block w-3 h-3 bg-gray-800 rounded-full absolute left-1/2 transform -translate-x-1/2 z-10 opacity-0 animate-fadeIn animation-delay-6500"></span>
              </div>
            </div>
            <div className="mb-10 flex items-center">
              <div className="w-1/2 pr-4 text-right relative">
                <div className="opacity-0 animate-fadeIn animation-delay-7000">
                  <h3 className="text-lg font-medium">2025</h3>
                  <p className="text-lg text-altermind-dark-green/80">GestureTalk Project</p>
                  <p className="text-lg text-altermind-dark-green/80">Developed a real-time sign language system with 85% accuracy.</p>
                </div>
              </div>
              <div className="w-1/2 pl-4 relative">
                <span className="inline-block w-3 h-3 bg-gray-800 rounded-full absolute left-1/2 transform -translate-x-1/2 z-10 opacity-0 animate-fadeIn animation-delay-7000"></span>
              </div>
            </div>
            <div className="mb-10 flex items-center flex-row-reverse">
              <div className="w-1/2 pl-4 text-left relative">
                <div className="opacity-0 animate-fadeIn animation-delay-7500">
                  <h3 className="text-lg font-medium">2025</h3>
                  <p className="text-lg text-altermind-dark-green/80">Certified by Micro1</p>
                  <p className="text-lg text-altermind-dark-green/80">Passed AI interview; recognized as a Data Science Engineering Student.</p>
                </div>
              </div>
              <div className="w-1/2 pr-4 relative">
                <span className="inline-block w-3 h-3 bg-gray-800 rounded-full absolute left-1/2 transform -translate-x-1/2 z-10 opacity-0 animate-fadeIn animation-delay-7500"></span>
              </div>
            </div>

            <div className="mb-10 flex items-center">
              <div className="w-1/2 pr-4 text-right relative">
                <div className="opacity-0 animate-fadeIn animation-delay-7000">
                  <h3 className="text-lg font-medium">2025</h3>
                  <p className="text-lg text-altermind-dark-green/80">GEN AI - Python Internship</p>
                  <p className="text-lg text-altermind-dark-green/80">Built and optimized Generative AI solutions to improve accuracy, speed, and automation.</p>
                </div>
              </div>
              <div className="w-1/2 pl-4 relative">
                <span className="inline-block w-3 h-3 bg-gray-800 rounded-full absolute left-1/2 transform -translate-x-1/2 z-10 opacity-0 animate-fadeIn animation-delay-7000"></span>
              </div>
            </div>

            {/* Hobbies & Creative Pursuits */}
            <div className="mt-12 text-center opacity-0 animate-fadeIn animation-delay-8000">
              <h3 className="text-2xl md:text-3xl font-semibold mb-6">Hobbies & Creative Pursuits</h3>
              <p className="text-base md:text-lg mb-6 max-w-2xl mx-auto leading-relaxed">
                Beyond my technical expertise, I am an avid enthusiast of photo and video editing. These creative outlets allow me to blend artistic expression with technical precision, enhancing my ability to craft visually compelling narratives. I utilize industry-standard tools such as Adobe Photoshop, Lightroom, Premiere Pro, and After Effects to refine and elevate my work.
              </p>
            </div>

            {/* Edited Images Showcase */}
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {editedImages.map((image) => (
                <div
                  key={image.id}
                  className="relative w-full h-64 bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105"
                  onClick={() => setSelectedImage(image)}
                  style={{
                    border: '2px solid #000',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-110"
                  />
                </div>
              ))}
            </div>

            {/* Pinterest Link with Logo */}
            <div className="mt-8 text-center">
              <a
                href="https://in.pinterest.com/SHAd0wo5/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-black hover:bg-altermind-light-green text-white py-3 px-8 rounded-full font-medium transition-colors"
              >
                <div className="relative w-5 h-5 mr-2">
                  <Image
                    src="/svg/pinterest.svg"
                    alt="Pinterest"
                    fill
                    className="object-contain"
                  />
                </div>
                View More on Pinterest
              </a>
            </div>

            {/* Popup for All Edited Images */}
            {selectedImage && (
              <div
                className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
                onClick={() => setSelectedImage(null)}
              >
                <div
                  className="relative bg-white p-6 rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="absolute top-4 right-4 text-altermind-dark-green text-3xl w-10 h-10 flex items-center justify-center rounded-full bg-white hover:bg-gray-200"
                    onClick={() => setSelectedImage(null)}
                  >
                    ×
                  </button>
                  <h3 className="text-2xl font-bold mb-4 text-black">My Edited Works</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {editedImages.map((image) => (
                      <div
                        key={image.id}
                        className="relative w-full h-48 bg-white rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-md"
                      >
                        <Image
                          src={image.src}
                          alt={image.alt}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <style jsx>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
          .animate-fadeIn {
            animation: fadeIn 0.5s ease-out forwards;
          }
          .animation-delay-0 {
            animation-delay: 0ms;
          }
          .animation-delay-500 {
            animation-delay: 500ms;
          }
          .animation-delay-1000 {
            animation-delay: 1000ms;
          }
          .animation-delay-1500 {
            animation-delay: 1500ms;
          }
          .animation-delay-2000 {
            animation-delay: 2000ms;
          }
          .animation-delay-2500 {
            animation-delay: 2500ms;
          }
          .animation-delay-3000 {
            animation-delay: 3000ms;
          }
          .animation-delay-3500 {
            animation-delay: 3500ms;
          }
          .animation-delay-4000 {
            animation-delay: 4000ms;
          }
          .animation-delay-4500 {
            animation-delay: 4500ms;
          }
          .animation-delay-5000 {
            animation-delay: 5000ms;
          }
          .animation-delay-5500 {
            animation-delay: 5500ms;
          }
          .animation-delay-6000 {
            animation-delay: 6000ms;
          }
          .animation-delay-6500 {
            animation-delay: 6500ms;
          }
          .animation-delay-7000 {
            animation-delay: 7000ms;
          }
          .animation-delay-7500 {
            animation-delay: 7500ms;
          }
          .animation-delay-8000 {
            animation-delay: 8000ms;
          }
          .max-w-4xl:not(.visible) .animate-fadeIn {
            animation: none;
          }
        `}</style>
      </section>

      {/* Call to Action Section
      <section className="py-20 bg-altermind-dark-green text-center text-secondary">
        <div className="container mx-auto px-4">
          <h2 className="font-freight text-3xl md:text-4xl mb-6">
            Ready to Collaborate on Innovative Projects?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            With a strong foundation in AI, data science, and human-centered design, I’m eager to contribute to transformative solutions. Let’s connect to explore opportunities that drive impact and innovation.
          </p>
          <a
            href="mailto:md.shafee05s@gmail.com"
            className="inline-block bg-secondary hover:bg-altermind-light-green text-black py-3 px-8 rounded-full font-medium transition-colors hover:text-black"
          >
            Let’s Collaborate
          </a>
        </div>
      </section> */}
    </>
  );
}