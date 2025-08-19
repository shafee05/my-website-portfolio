"use client";

import Hero from '@/components/sections/hero';
import Image from 'next/image';
import Link from 'next/link';

export default function AssetPage() {
  return (
    <>
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
              XAFAM is more than a brand—it’s a movement to redefine personal expression through innovation, quality, and authenticity. Our vision is to craft a global lifestyle empire that resonates with those who value individuality and bold creativity. Starting with exclusive apparel, we aim to set new standards in design, sustainability, and cultural impact.
            </p>
            <p className="text-lg md:text-xl mb-12 leading-relaxed max-w-3xl mx-auto">
              Driven by my passion for AI and data science, I aspire to gain experience in reputed companies, working on cloud-based solutions and collaborating with top professionals in the technical sector. This fuels XAFAM's tech-infused future, blending fashion with cutting-edge innovation. From our inception, we’re building a legacy that empowers communities worldwide. Join us as we shape a future where style meets substance on a global stage.
            </p>
            <div className="flex justify-center">
              <Link
                href="/the-team"
                className="inline-block bg-accent hover:bg-shafee-medium text-secondary py-2 px-4 rounded-md transition-colors font-semibold"
              >
                Discover My Creative Journey
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* XAFAM Vision Section */}
      <section className="py-24 bg-gradient-to-r from-blue-900 to-blue-950 text-secondary border-4 border-silver-500 rounded-lg shadow-silver relative">
        <div className="container mx-auto px-4">
          {/* Royal Pattern Background */}
          <div className="absolute inset-0 opacity-10">
            <Image
              src="/images/xafam2.jpg"
              alt="Royal Pattern"
              fill
              className="object-cover"
            />
          </div>
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
            {/* Left: Text Content */}
            <div>
              <h2 className="font-freight text-4xl md:text-5xl lg:text-6xl mb-8 text-center font-bold tracking-wider">
                Vision – XAFAM
              </h2>
              <p className="text-xl italic mb-6 text-center">
                Where Exclusivity Meets Innovation
              </p>
              <p className="text-lg leading-relaxed mb-6">
                XAFAM is a premium lifestyle brand crafted by Shafee, Md Mehboob, and Arman Rai, designed for Gen Z and those who dare to stand out. Our journey begins with high-quality hoodies—normal and premium collections with distinctive logos—setting the stage for a global fashion revolution.
              </p>
              <p className="text-lg leading-relaxed mb-8">
                Our vision is to inspire and unite a community of creators, influencers, and visionaries. From sustainable fashion to future tech-driven sub-brands, XAFAM is your invitation to join a legacy of style and impact. Pre-order now, share your vision, or invest in our future—together, we’ll redefine what’s possible.
              </p>
              <div className="flex justify-center gap-4 mb-8">
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
              </div>
              <div className="flex justify-center">
                <a
                  href="https://forms.gle/7bDtHXy1fCqBNYC19" // Replace with your actual Google Form link
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-secondary hover:bg-altermind-light-green text-black py-3 px-8 rounded-full font-medium transition-colors hover:text-black"
                >
                  Get Early Access to our product
                </a>
              </div>
            </div>

            {/* Right: XAFAM Logo */}
            <div className="relative flex items-center justify-center bg-silver-500/10 rounded-lg shadow-lg">
              <div className="relative w-96 h-96">
                <Image
                  src="/svg/xafamlogo.svg"
                  alt="XAFAM Logo"
                  fill
                  className="object-contain opacity-90 filter drop-shadow-md"
                />
              </div>
              {/* <div className="absolute top-4 right-4">
                <Image
                  src="/svg/crown.svg" // Optional: Add this file
                  alt="Crown Icon"
                  width={40}
                  height={40}
                  className="opacity-80"
                />
              </div> */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-lg animate-pulse">
                Coming Soon
              </div>
            </div>
          </div>
        </div>
        <style jsx>{`
          @keyframes pulse {
            0% { opacity: 0.6; }
            50% { opacity: 1; }
            100% { opacity: 0.6; }
          }
          .animate-pulse {
            animation: pulse 2s ease-in-out infinite;
          }
          .border-silver-500 {
            border-color: #C0C0C0;
          }
          .bg-silver-500\/10 {
            background-color: rgba(192, 192, 192, 0.1);
          }
          .shadow-silver {
            box-shadow: 0 0 20px rgba(192, 192, 192, 0.3);
          }
        `}</style>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-altermind-dark-green text-secondary">
        <div className="container mx-auto px-4">
          <h2 className="font-freight text-4xl md:text-5xl lg:text-6xl mb-12 text-center font-bold tracking-wider">
            Meet the Visionaries Behind XAFAM
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Shafee Card */}
            <div className="bg-blue-900/50 border border-silver-500 rounded-lg p-6 text-center shadow-silver">
              <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                <Image
                  src="/images/shafee.jpg" // Optional: Add this file
                  alt="Shafee"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-bold mb-2">Shafee</h3>
              <p className="text-lg font-medium text-silver-500 mb-4">CEO & Brand/Marketing Head</p>
              <p className="text-sm mb-4">B.Tech in Computer Science - Data Science</p>
              <p className="text-sm leading-relaxed">
                Drives XAFAM’s vision, sourcing top manufacturers, designing innovative product concepts, and leading marketing and collaborations to connect with a global audience.
              </p>
            </div>

            {/* Md Mehboob Card */}
            <div className="bg-blue-900/50 border border-silver-500 rounded-lg p-6 text-center shadow-silver">
              <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                <Image
                  src="/images/mehboob.jpg" // Optional: Add this file
                  alt="Md Mehboob"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-bold mb-2">Md Mehboob</h3>
              <p className="text-lg font-medium text-silver-500 mb-4"> Co-Founder & Operations and Logistics Head</p>
              <p className="text-sm mb-4">Intermediate & Degree</p>
              <p className="text-sm leading-relaxed">
                Ensures seamless operations, managing inventory, orders, packaging, and courier tracking to keep XAFAM’s production on schedule for every drop.
              </p>
            </div>

            {/* Arman Rai Card */}
            <div className="bg-blue-900/50 border border-silver-500 rounded-lg p-6 text-center shadow-silver">
              <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                <Image
                  src="/images/arman.jpg" // Optional: Add this file
                  alt="Arman Rai"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-bold mb-2">Arman Rai</h3>
              <p className="text-lg font-medium text-silver-500 mb-4">Co-Founder & Creative Head</p>
              <p className="text-sm mb-4">Bachelor’s in Computer Applications</p>
              <p className="text-sm leading-relaxed">
                Crafts XAFAM’s stunning visuals, producing product photos/videos and managing the brand’s Instagram aesthetic to captivate our audience.
              </p>
            </div>
          </div>
        </div>
        <style jsx>{`
          .border-silver-500 {
            border-color: #C0C0C0;
          }
          .text-silver-500 {
            color: #C0C0C0;
          }
          .shadow-silver {
            box-shadow: 0 0 10px rgba(192, 192, 192, 0.3);
          }
        `}</style>
      </section>
    </>
  );
}