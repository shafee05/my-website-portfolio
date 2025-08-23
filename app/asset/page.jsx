"use client";

import { useState } from "react";
import Hero from "@/components/sections/hero";
import Image from "next/image";
import Link from "next/link";

export default function AssetPage() {
  const [locked, setLocked] = useState(true);

  return (
    <div className="relative min-h-screen">
      {/* Hero Section */}
      <Hero
        title="VISION"
        subtitle="Shaping the Future of Style and Innovation"
        backgroundImage="/images/people-bg.jpg"
      />

      {/* Introductory Section */}
      <section className="py-24 bg-altermind-dark-green text-secondary">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="font-freight text-4xl md:text-5xl lg:text-6xl mb-10 font-bold tracking-tight">
              Pioneering a Global Lifestyle Brand
            </h2>
            <p className="text-lg md:text-xl mb-8 leading-relaxed max-w-3xl mx-auto">
              XAFAM is more than a brand—it’s a movement to redefine personal
              expression through innovation, quality, and authenticity. Our
              vision is to craft a global lifestyle empire that resonates with
              those who value individuality and bold creativity. Starting with
              exclusive apparel, we aim to set new standards in design,
              sustainability, and cultural impact.
            </p>
            <p className="text-lg md:text-xl mb-12 leading-relaxed max-w-3xl mx-auto">
              Driven by my passion for AI and data science, I aspire to gain
              experience in reputed companies, working on cloud-based solutions
              and collaborating with top professionals in the technical sector.
              This fuels XAFAM's tech-infused future, blending fashion with
              cutting-edge innovation. From our inception, we’re building a
              legacy that empowers communities worldwide. Join us as we shape a
              future where style meets substance on a global stage.
            </p>

            {/* Exclusive 100 Note */}
            <p className="text-xl font-semibold italic text-accent mb-12">
              Only 100 will get in first. Will you be one of them?
            </p>

            {/* Discover My Creative Journey */}
            <div className="flex justify-center mb-6">
              <Link
                href="/the-team"
                className="inline-block bg-accent hover:bg-shafee-medium text-secondary py-2 px-4 rounded-md transition-colors font-semibold"
              >
                Discover My Creative Journey
              </Link>
            </div>

            {/* Buttons */}
            <div className="flex flex-col md:flex-row justify-center gap-4">
              <a
                href="https://www.instagram.com/xafamofficial"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-black hover:bg-altermind-light-green text-white py-3 px-8 rounded-full font-medium transition-colors"
              >
                <div className="relative w-5 h-5 mr-2">
                  <Image
                    src="/svg/instagram.svg"
                    alt="Instagram"
                    fill
                    className="object-contain"
                  />
                </div>
                DM us on Instagram
              </a>
              <a
                href="mailto:xafamofficial2025@gmail.com"
                className="inline-flex items-center bg-black hover:bg-altermind-light-green text-white py-3 px-8 rounded-full font-medium transition-colors"
              >
                <div className="relative w-5 h-5 mr-2">
                  <Image
                    src="/svg/email.svg"
                    alt="Email"
                    fill
                    className="object-contain"
                  />
                </div>
                Email us
              </a>
              <a
                href="https://forms.gle/7bDtHXy1fCqBNYC19"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-secondary hover:bg-altermind-light-green text-black py-3 px-8 rounded-full font-bold transition-colors hover:text-black"
              >
                Be Among the First 100
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Translucent Overlay Section (toggle lock/unlock) */}
      <div className="relative">
        {locked && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/70 backdrop-blur-lg text-center px-4">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              The Future Belongs to the Few
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-2xl mb-8">
              What you are looking for is not yet ready for the world.
              <br />
              But for the first 100 who step forward, the doors will open sooner.
            </p>
            <a
              href="https://forms.gle/7bDtHXy1fCqBNYC19"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-secondary hover:bg-altermind-light-green text-black py-3 px-8 rounded-full font-bold transition-colors hover:text-black mb-4"
            >
              Be Among the First 100
            </a>

            {/* Secret toggle button (hidden trigger) */}
            <button
              onClick={() => setLocked(false)}
              className="opacity-0 absolute bottom-10 right-10 w-16 h-16"
              aria-label="Hidden Unlock"
            ></button>
          </div>
        )}

        {!locked && (
          <button
            onClick={() => setLocked(true)}
            className="opacity-0 absolute bottom-10 right-10 w-16 h-16 z-30"
            aria-label="Hidden Lock"
          ></button>
        )}

        {/* Vision – XAFAM Section */}
        <section
          className={`py-24 bg-gradient-to-r from-blue-900 to-blue-950 text-secondary border-4 border-silver-500 rounded-lg shadow-silver relative ${
            locked ? "opacity-30 pointer-events-none" : "opacity-100"
          }`}
        >
          <div className="container mx-auto px-4">
            <h2 className="font-freight text-4xl md:text-5xl lg:text-6xl mb-8 text-center font-bold tracking-wider">
              Vision – XAFAM
            </h2>
            <p className="text-xl italic mb-6 text-center">
              Where Exclusivity Meets Innovation
            </p>
            <p className="text-lg leading-relaxed mb-6">
              XAFAM is a premium lifestyle brand crafted by Shafee, Md Mehboob,
              and Arman Rai, designed for Gen Z and those who dare to stand out.
              Our journey begins with high-quality hoodies—normal and premium
              collections with distinctive logos—setting the stage for a global
              fashion revolution.
            </p>
          </div>
        </section>

        {/* Meet the Visionaries Section */}
        <section
          className={`py-24 bg-altermind-dark-green text-secondary ${
            locked ? "opacity-30 pointer-events-none" : "opacity-100"
          }`}
        >
          <div className="container mx-auto px-4">
            <h2 className="font-freight text-4xl md:text-5xl lg:text-6xl mb-12 text-center font-bold tracking-wider">
              Meet the Visionaries Behind XAFAM
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Shafee Card */}
              <div className="bg-blue-900/50 border border-silver-500 rounded-lg p-6 text-center shadow-silver">
                <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                  <Image
                    src="/images/shafee.jpg"
                    alt="Shafee"
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold mb-2">Shafee</h3>
                <p className="text-lg font-medium text-silver-500 mb-4">
                  CEO & Brand/Marketing Head
                </p>
              </div>

              {/* Md Mehboob Card */}
              <div className="bg-blue-900/50 border border-silver-500 rounded-lg p-6 text-center shadow-silver">
                <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                  <Image
                    src="/images/mehboob.jpg"
                    alt="Md Mehboob"
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold mb-2">Md Mehboob</h3>
                <p className="text-lg font-medium text-silver-500 mb-4">
                  Operations & Logistics Head
                </p>
              </div>

              {/* Arman Rai Card */}
              <div className="bg-blue-900/50 border border-silver-500 rounded-lg p-6 text-center shadow-silver">
                <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                  <Image
                    src="/images/arman.jpg"
                    alt="Arman Rai"
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold mb-2">Arman Rai</h3>
                <p className="text-lg font-medium text-silver-500 mb-4">
                  Creative Head
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
