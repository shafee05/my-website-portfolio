"use client";

import { useState } from 'react';
import Hero from '@/components/sections/hero';
import SkillsMarquee from "@/components/sections/SkillsMarquee";
import ContentSection from '@/components/sections/content-section';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  const [showVideo, setShowVideo] = useState(false);

  const handleVideoButtonClick = () => {
    setShowVideo(true);
  };

  return (
    <>
      {/* Hero Section with Parallax Effect */}
      <Hero
        title="Mohammad Shafee"
        subtitle="Unleashing Creativity • Pioneering AI • Data Science Engineer • Life Coach"
        showButton={false}
      >
        <div className="mt-16 flex flex-col items-center space-y-8 animate-fadeIn">
          <Link
            href="/portfolio"
            className="inline-block bg-white text-black py-2 px-4 rounded-lg font-semibold shadow-md hover:bg-gray-100 transition-all duration-300"
          >
            Explore My Journey →
          </Link>
          <a
            href="/files/shafee_CV.pdf"
            download="Mohammad_Shafee_CV.pdf"
            className="inline-block bg-red-600 text-white py-2 px-6 rounded-lg font-medium shadow-lg hover:bg-red-700 transition-all duration-300 flex items-center space-x-2"
          >
            <span>Download My CV</span>
            <span>↓</span>
          </a>
        </div>
      </Hero>

      <div className="my-16 w-full">
        <SkillsMarquee />
      </div>

      {/* === Section Navigation Bar === */}
<nav
  aria-label="Section navigation"
  className="sticky top-0 z-40 bg-gray-900/80 backdrop-blur-md border-b border-white/10"
>
  <div className="mx-auto max-w-7xl px-4">
    <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 py-3 font-medium text-sm md:text-base">
      {[
        { id: "odyssey", label: "Odyssey", info: "Overview of my AI & Data Science journey" },
        { id: "passion", label: "AI & Data Science", info: "My interests, goals, and passion for AI" },
        { id: "skills", label: "Skills", info: "Technical and soft skills I bring to the table" },
        { id: "experience", label: "Experience", info: "Internships and professional journey so far" },
        { id: "coaching", label: "Life Coaching", info: "My guidance and personal growth support" },
        { id: "projects", label: "Projects", info: "Featured projects and case studies" },
        { id: "achievements", label: "Achievements", info: "Key milestones and competitions" },
        { id: "education", label: "Education", info: "Academic background and certifications" },
        { id: "contact", label: "Contact", info: "Ways to connect and collaborate with me" },
      ].map((link) => (
        <li key={link.id} className="relative group">
          <a
            href={`#${link.id}`}
            className="
              relative inline-flex items-center px-2 py-1 rounded-md
              text-gray-300 transition-all duration-300 ease-out
              hover:text-white hover:-translate-y-0.5 focus-visible:outline-none
              focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900
              before:absolute before:inset-0 before:rounded-md before:bg-white/5 before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100
              after:absolute after:left-2 after:-bottom-0.5 after:h-0.5 after:w-0 after:bg-blue-500 after:rounded-full after:transition-all after:duration-300 hover:after:w-[calc(100%-1rem)]
            "
          >
            {link.label}
          </a>
          {/* Tooltip */}
          <div
            className="
              absolute top-full left-1/2 -translate-x-1/2 mt-2 w-max max-w-xs
              opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100
              transition duration-300 ease-out
              bg-gray-800 text-gray-200 text-xs md:text-sm px-3 py-2 rounded-lg shadow-lg
              pointer-events-none
            "
          >
            {link.info}
          </div>
        </li>
      ))}
    </ul>
  </div>
</nav>



      {/* Video Modal */}
      {showVideo && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setShowVideo(false)}
        >
          <div className="relative w-full max-w-4xl aspect-video">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&modestbranding=1&rel=0"
              title="Portfolio Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="bg-black"
            ></iframe>
            <button
              className="absolute top-4 right-4 text-white text-2xl w-10 h-10 flex items-center justify-center bg-black/50 rounded-full"
              onClick={() => setShowVideo(false)}
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Portfolio Section with Fade-In Transition */}
      <div id="odyssey">
      <ContentSection
        title="My AI & Data Science Odyssey<br/>Where Innovation Meets Passion"
        paragraphs={[
          "Step into the world of Mohammad Shafee ur Rahaman—a visionary Data Science Engineering student igniting a revolution in emotional intelligence through AI. With expertise in Generative AI, NLP, and emotionally resonant systems, I’m crafting a future where technology feels human. Curious? Dive deeper into the projects that define my journey.",
          "This portfolio is more than a showcase—it’s an invitation to explore the mind of a creator who blends data with dreams. Each project, skill, and achievement is a stepping stone to something extraordinary. Are you ready to be inspired?"
        ]}
        bgColor="bg-gradient-to-b from-gray-900 to-blue-950"
        textColor="text-white"
      />
      </div>

      {/* AI & Data Science Passion Section with Image */}
      <section id="passion" className="py-24 bg-gradient-to-r from-blue-950 to-gray-900 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-freight text-4xl md:text-5xl mb-6 font-bold text-white">
                My Passion for AI & Data Science
              </h2>
              <p className="text-lg text-silver-500 mb-8 leading-relaxed">
                Driven by a profound interest in artificial intelligence and data science, I specialize in creating innovative solutions that bridge human emotions with cutting-edge technology. From generative AI models to advanced NLP systems, my work focuses on making machines more intuitive and empathetic.
              </p>
              <p className="text-lg text-silver-500 leading-relaxed">
                Explore how I transform complex data into actionable insights and build AI systems that resonate on a human level.
              </p>
            </div>
            <div className="relative h-96">
              <Image
                src="/images/AI+DS.png"
                alt="AI and Data Science Innovation"
                fill
                className="object-cover rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
              />
            </div>
          </div>
        </div>
        <style jsx>{`
          .text-silver-500 {
            color: #A0A0A0;
          }
        `}</style>
      </section>

      {/* Skills Section with Hover Transitions */}
      <section id="skills" className="py-24 bg-gradient-to-r from-gray-900 to-blue-950 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-freight text-4xl md:text-5xl lg:text-6xl mb-12 text-center font-bold animate-fadeInUp text-white">
              My Arsenal of Expertise
            </h2>
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-6 transition-all duration-300 hover:shadow-royal-blue">
                <h3 className="text-2xl font-semibold text-royal-blue">Technical Mastery</h3>
                <ul className="space-y-4">
                  <li className="flex items-start transition-transform duration-300 hover:translate-x-2">
                    <div className="w-2 h-2 bg-silver-300 rounded-full mt-2 mr-3"></div>
                    <div>
                      <h4 className="font-medium text-white">Generative AI & NLP</h4>
                      <p className="text-silver-500">Expert in creating AI systems that understand and generate human-like language and emotions.</p>
                    </div>
                  </li>
                  <li className="flex items-start transition-transform duration-300 hover:translate-x-2">
                    <div className="w-2 h-2 bg-silver-300 rounded-full mt-2 mr-3"></div>
                    <div>
                      <h4 className="font-medium text-white">Machine Learning Models</h4>
                      <p className="text-silver-500">Proficient in Decision Trees, LightGBM, YOLO, and real-time inference for predictive and recognition tasks.</p>
                    </div>
                  </li>
                  <li className="flex items-start transition-transform duration-300 hover:translate-x-2">
                    <div className="w-2 h-2 bg-silver-300 rounded-full mt-2 mr-3"></div>
                    <div>
                      <h4 className="font-medium text-white">Data Analysis & Visualization</h4>
                      <p className="text-silver-500">Skilled in Pandas, NumPy, SQL, Tableau, and Power BI for insightful data-driven decisions.</p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Soft Skills & Life Coaching */}
              <div className="space-y-6 transition-all duration-300 hover:shadow-royal-blue">
                <h3 className="text-2xl font-semibold text-royal-blue">Soft Skills & Coaching</h3>
                <ul className="space-y-4">
                  <li className="flex items-start transition-transform duration-300 hover:translate-x-2">
                    <div className="w-2 h-2 bg-silver-300 rounded-full mt-2 mr-3"></div>
                    <div>
                      <h4 className="font-medium text-white">Life Coaching & Counseling</h4>
                      <p className="text-silver-500">Certified in life coaching, providing guidance in personal growth, life skills, career development, and emotional support (non-clinical).</p>
                    </div>
                  </li>
                  <li className="flex items-start transition-transform duration-300 hover:translate-x-2">
                    <div className="w-2 h-2 bg-silver-300 rounded-full mt-2 mr-3"></div>
                    <div>
                      <h4 className="font-medium text-white">Communication & Collaboration</h4>
                      <p className="text-silver-500">Strong in critical thinking, problem-solving, and team collaboration for effective project outcomes.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <style jsx>{`
          .shadow-royal-blue {
            box-shadow: 0 0 20px rgba(65, 105, 225, 0.3);
          }
          .text-royal-blue {
            color: #4169E1;
          }
          .text-silver-300 {
            color: #C0C0C0;
          }
          .text-silver-500 {
            color: #A0A0A0;
          }
          .bg-silver-300 {
            background-color: #C0C0C0;
          }
        `}</style>
      </section>

            {/* Work Experience / Internship Section */}
      <section id="experience" className="py-24 bg-gradient-to-r from-gray-900 to-blue-950 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-freight text-4xl md:text-5xl lg:text-6xl mb-12 text-center font-bold animate-fadeInUp text-silver-300">
              Professional Experience
            </h2>
            <div className="grid md:grid-cols-1 gap-12">
              <div className="bg-blue-950 p-8 rounded-lg shadow-silver transition-all duration-300 hover:shadow-gold">
                <h3 className="text-2xl font-semibold text-gold-300 mb-2">Python Engineer – Gen AI Intern</h3>
                <p className="text-lg text-silver-500 mb-4">ADVI Group of Companies · Feb 2025 – Aug 2025 · Hyderabad</p>
                {/* <ul className="space-y-3 text-silver-500 list-disc pl-5">
                  <li>Developed and deployed Python-based Generative AI solutions, improving LLM output accuracy by 20%.</li>
                  <li>Built AI pipelines with Hugging Face Transformers, LangChain, and REST APIs, reducing inference time by 25%.</li>
                  <li>Automated text and image-based workflows, boosting productivity by 30%.</li>
                  <li>Collaborated with teams to deliver AI-driven features, cutting project timelines by 15%.</li>
                </ul> */}
              </div>
            </div>
            <div className="flex justify-center mt-12">
              <Link
                href="/portfolio"
                className="flex items-center text-white hover:text-gold-300 transition-colors duration-300"
              >
                <span className="mr-2 text-lg font-medium">View Full Portfolio</span>
                <div className="relative w-5 h-5">
                  <Image
                    src="/svg/arrow-white-right.svg"
                    alt="Arrow"
                    fill
                    className="object-contain"
                  />
                </div>
              </Link>
            </div>
          </div>
        </div>
        <style jsx>{`
          .shadow-silver {
            box-shadow: 0 0 20px rgba(192, 192, 192, 0.3);
          }
          .shadow-gold {
            box-shadow: 0 0 20px rgba(212, 175, 55, 0.3);
          }
          .text-gold-300 {
            color: #4169E1;
          }
          .text-silver-300 {
            color: #C0C0C0;
          }
          .text-silver-500 {
            color: #A0A0A0;
          }
        `}</style>
      </section>

      {/* Life Coaching Section with Premium Card Design */}
      <section id="coaching" className="py-24 bg-gradient-to-r from-blue-950 to-gray-900 text-white">
  <div className="container mx-auto px-6">
    <div className="max-w-6xl mx-auto">
      <h2 className="font-freight text-4xl md:text-5xl lg:text-6xl mb-12 text-center font-bold animate-fadeInUp text-white">
        Life Coaching & Personal Growth Guidance
      </h2>

      <p className="text-lg text-center mb-16 max-w-3xl mx-auto text-silver-500 leading-relaxed">
        Every person holds within them a story that longs to be lived fully.  
        As a certified coach, I help individuals uncover that story — guiding them to find clarity in their choices, courage in their challenges, and calm in their storms.  
        My role is not to provide answers, but to awaken the answers already within you.  
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Card 1: Life Skills */}
        <div className="bg-blue-950 p-6 rounded-lg shadow-silver transition-all duration-300 hover:shadow-royal-blue hover:scale-105">
          <h3 className="text-xl font-semibold text-royal-blue mb-4">Life Skills Coaching</h3>
          <p className="text-silver-500 mb-6">
            I equip individuals with the confidence and skills to navigate challenges with resilience — 
            helping them craft habits and mindsets that lead to a balanced and fulfilling life.
          </p>
        </div>

        {/* Card 2: Career Development */}
        <div className="bg-blue-950 p-6 rounded-lg shadow-silver transition-all duration-300 hover:shadow-royal-blue hover:scale-105">
          <h3 className="text-xl font-semibold text-royal-blue mb-4">Career Development Guidance</h3>
          <p className="text-silver-500 mb-6">
            Beyond resumes and job titles, I guide individuals toward purposeful careers — 
            aligning their strengths, values, and vision with opportunities that move them closer to the life they aspire to live.
          </p>
        </div>

        {/* Card 3: Emotional Support */}
        <div className="bg-blue-950 p-6 rounded-lg shadow-silver transition-all duration-300 hover:shadow-royal-blue hover:scale-105">
          <h3 className="text-xl font-semibold text-royal-blue mb-4">Emotional Support Coaching</h3>
          <p className="text-silver-500 mb-6">
            In moments of doubt, stress, or silence, I provide a safe space for reflection and renewal — 
            fostering strength, self-awareness, and a compassionate mindset that helps you move forward with calm clarity.
          </p>
        </div>

        {/* Card 4: Personal Growth */}
        <div className="bg-blue-950 p-6 rounded-lg shadow-silver transition-all duration-300 hover:shadow-royal-blue hover:scale-105">
          <h3 className="text-xl font-semibold text-royal-blue mb-4">Personal Growth Coaching</h3>
          <p className="text-silver-500 mb-6">
            True growth begins when we step beyond comfort.  
            I guide individuals on journeys of self-discovery, helping them design sustainable changes that nurture confidence, purpose, and authentic transformation.
          </p>
        </div>
      </div>

      <div className="flex justify-center mt-12">
        <a
          href="mailto:md.shafee05s@gmail.com?subject=Life%20Coaching%20Session%20Inquiry"
          className="inline-block bg-royal-blue text-white py-3 px-8 rounded-md font-medium transition-colors hover:bg-silver-300 hover:text-black"
        >
          Begin Your Journey Today
        </a>
      </div>
    </div>
  </div>

  <style jsx>{`
    .shadow-silver {
      box-shadow: 0 0 20px rgba(192, 192, 192, 0.3);
    }
    .shadow-royal-blue {
      box-shadow: 0 0 20px rgba(65, 105, 225, 0.3);
    }
    .text-royal-blue {
      color: #4169E1;
    }
    .text-silver-500 {
      color: #A0A0A0;
    }
    .bg-royal-blue {
      background-color: #4169E1;
    }
    .bg-silver-300 {
      background-color: #C0C0C0;
    }
  `}</style>
</section>

      {/* Projects Section with Background Image Cards */}
<section id="projects" className="py-24 bg-gradient-to-r from-gray-900 to-blue-950 text-white">
  <div className="container mx-auto px-6">
    <div className="max-w-6xl mx-auto">
      <h2 className="font-freight text-4xl md:text-5xl lg:text-6xl mb-12 text-center font-bold animate-fadeInUp text-white">
        Featured Projects
      </h2>

      {/* Cards Grid */}
      <div className="grid md:grid-cols-3 gap-12">

        {/* Project 1 */}
        <div
          className="relative h-72 rounded-lg shadow-silver overflow-hidden group"
          style={{ backgroundImage: "url('/images/cricket.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}
        >
          <div className="absolute inset-0 bg-black/60 group-hover:bg-black/70 transition-all duration-300"></div>
          <div className="relative z-10 p-6 flex flex-col justify-end h-full">
            <h3 className="text-2xl font-semibold text-white mb-2">
              Cricket Player Performance Prediction
            </h3>
            <p className="text-silver-300 text-sm mb-4">
              ML model predicting player performance using Decision Trees and LightGBM.
            </p>
            <a
              href="https://github.com/shafee05/Cricket-Player-Performance-prediction"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-royal-blue text-white py-2 px-4 rounded-md font-medium transition-colors hover:bg-silver-300 hover:text-black"
            >
              View
              <span className="ml-2">➜</span>
            </a>
          </div>
        </div>

        {/* Project 2 */}
        <div
          className="relative h-72 rounded-lg shadow-silver overflow-hidden group"
          style={{ backgroundImage: "url('/images/gesturetalk.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}
        >
          <div className="absolute inset-0 bg-black/60 group-hover:bg-black/70 transition-all duration-300"></div>
          <div className="relative z-10 p-6 flex flex-col justify-end h-full">
            <h3 className="text-2xl font-semibold text-white mb-2">
              GestureTalk Sign Language System
            </h3>
            <p className="text-silver-300 text-sm mb-4">
              Real-time sign language recognition using YOLO, DWpose, and 3D animation.
            </p>
            <a
              href="https://github.com/shafee05/GestureTalk-Sign-Language-Recognition"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-royal-blue text-white py-2 px-4 rounded-md font-medium transition-colors hover:bg-silver-300 hover:text-black"
            >
              View
              <span className="ml-2">➜</span>
            </a>
          </div>
        </div>

        {/* Project 3 - XAFAM */}
        <div
          className="relative h-72 rounded-lg shadow-silver overflow-hidden group"
          style={{ backgroundImage: "url('/images/xafamemblem.png')", backgroundSize: "cover", backgroundPosition: "center" }}
        >
          <div className="absolute inset-0 bg-black/60 group-hover:bg-black/70 transition-all duration-300"></div>
          <div className="relative z-10 p-6 flex flex-col justify-end h-full">
            <h3 className="text-2xl font-semibold text-white mb-2">
              XAFAM
            </h3>
            <p className="text-silver-300 text-sm mb-4">
              XAFAM – a premium Gen Z lifestyle brand redefining style, community, and impact.
            </p>
            <Link
              href="/asset"
              className="inline-flex items-center bg-royal-blue text-white py-2 px-4 rounded-md font-medium transition-colors hover:bg-silver-300 hover:text-black"
            >
              View
              <span className="ml-2">➜</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* Custom Styles */}
  <style jsx>{`
    .shadow-silver {
      box-shadow: 0 0 20px rgba(192, 192, 192, 0.3);
    }
    .text-silver-300 {
      color: #C0C0C0;
    }
    .bg-royal-blue {
      background-color: #4169E1;
    }
    .bg-silver-300 {
      background-color: #C0C0C0;
    }
  `}</style>
</section>


      {/* Achievements Section with Timeline */}
      <section id="achievements" className="py-24 bg-gradient-to-r from-blue-950 to-gray-900 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto relative">
            <h2 className="font-freight text-4xl md:text-5xl lg:text-6xl mb-12 text-center font-bold animate-fadeInUp text-white">
              Key Achievements & Activities
            </h2>
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-silver-300"></div>
              {/* Achievement Items */}
              <div className="mb-16 flex items-center justify-between flex-row-reverse">
                <div className="w-5/12 text-left pl-8">
                  <h3 className="text-xl font-medium text-royal-blue mb-2">Hack-A-Bot Winner</h3>
                  <p className="text-silver-500">Campus-level AI competition showcasing innovative solutions.</p>
                </div>
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-royal-blue rounded-full"></div>
              </div>
              <div className="mb-16 flex items-center justify-between">
                <div className="w-5/12 text-right pr-8">
                  <h3 className="text-xl font-medium text-royal-blue mb-2">Flipkart Grid 5.0 Participant</h3>
                  <p className="text-silver-500">National tech innovation challenge, 2024.</p>
                </div>
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-royal-blue rounded-full"></div>
              </div>
              <div className="flex items-center justify-between flex-row-reverse">
                <div className="w-5/12 text-left pl-8">
                  <h3 className="text-xl font-medium text-royal-blue mb-2">T-Hub Visit</h3>
                  <p className="text-silver-500">Practical skill-building session through community & tech exercises.</p>
                </div>
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-royal-blue rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
        <style jsx>{`
          .text-royal-blue {
            color: #4169E1;
          }
          .text-silver-300 {
            color: #C0C0C0;
          }
          .text-silver-500 {
            color: #A0A0A0;
          }
          .bg-royal-blue {
            background-color: #4169E1;
          }
        `}</style>
      </section>

      {/* Education and Certifications Section with Accordion Style */}
      <section id="education" className="py-24 bg-gradient-to-r from-gray-900 to-blue-950 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-freight text-4xl md:text-5xl lg:text-6xl mb-12 text-center font-bold animate-fadeInUp text-white">
              My Academic & Professional Milestones
            </h2>
            <div className="space-y-6">
              <div className="bg-blue-950 p-6 rounded-lg shadow-silver transition-all duration-300 hover:shadow-royal-blue">
                <h3 className="text-2xl font-semibold text-royal-blue mb-4"> Highest qualification </h3>
                <div className="mb-6">
                  <h4 className="text-xl font-medium text-white">ACE Engineering College, Hyderabad</h4>
                  <p className="text-silver-500">B.Tech in Data Science Engineering (2021–2025)</p>
                  <p className="text-silver-500">CGPA: 7.71</p>
                </div>
                {/* <div>
                  <h4 className="text-xl font-medium text-white">Narayana Junior College</h4>
                  <p className="text-silver-500">Intermediate (MPC) – 92.3%</p>
                </div> */}
              </div>
              <div className="bg-blue-950 p-6 rounded-lg shadow-silver transition-all duration-300 hover:shadow-royal-blue">
                <h3 className="text-2xl font-semibold text-royal-blue mb-4">Key Certifications</h3>
                <ul className="space-y-3 text-silver-500">
                  <li>• Prompt Engineering Certificate from 1 Million Prompters (Dubai Prince) </li>
                  <li>• Salesforce VIP Internship </li>
                  <li>• Certified Data Science Engineering Student</li>
                  <li>• UiPath RPA – Infosys Foundation</li>
                </ul>
              </div>
            </div>
            <div className="flex justify-center mt-12">
              <Link
                href="/portfolio"
                className="flex items-center text-white hover:text-royal-blue transition-colors duration-300"
              >
                <span className="mr-2 text-lg font-medium">Discover My Full Story</span>
                <div className="relative w-5 h-5">
                  <Image
                    src="/svg/arrow-white-right.svg"
                    alt="Arrow"
                    fill
                    className="object-contain"
                  />
                </div>
              </Link>
            </div>
          </div>
        </div>
        <style jsx>{`
          .shadow-silver {
            box-shadow: 0 0 20px rgba(192, 192, 192, 0.3);
          }
          .shadow-royal-blue {
            box-shadow: 0 0 20px rgba(65, 105, 225, 0.3);
          }
          .text-royal-blue {
            color: #4169E1;
          }
          .text-silver-500 {
            color: #A0A0A0;
          }
        `}</style>
      </section>

      {/* Contact Section with Premium Form Look */}
      <section id="contact" className="py-24 bg-gradient-to-r from-blue-950 to-gray-900 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-freight text-4xl md:text-5xl lg:text-6xl mb-6 font-bold animate-fadeInUp text-white">
              Let’s Create Something Extraordinary
            </h2>
            <p className="text-lg text-center mb-12 max-w-2xl mx-auto text-silver-500">
              I’m eager to collaborate on groundbreaking projects, share bold ideas, or join your vision to shape the future. Take the first step—connect with me today!
            </p>
            <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-8">
              <a
                href="mailto:md.shafee05s@gmail.com"
                className="flex items-center justify-center bg-royal-blue hover:bg-royal-blue-dark text-white py-3 px-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-royal-blue"
              >
                Email Me
              </a>
              <a
                href="https://www.linkedin.com/in/mohammad-shafee05"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center bg-royal-blue hover:bg-royal-blue-dark text-white py-3 px-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-royal-blue"
              >
                Connect on LinkedIn
              </a>
            </div>
          </div>
        </div>
        <style jsx>{`
          .shadow-royal-blue {
            box-shadow: 0 0 20px rgba(65, 105, 225, 0.3);
          }
          .bg-royal-blue {
            background-color: #4169E1;
          }
          .bg-royal-blue-dark {
            background-color: #1E40AF;
          }
          .text-silver-500 {
            color: #A0A0A0;
          }
        `}</style>
      </section>
    </>
  );
}