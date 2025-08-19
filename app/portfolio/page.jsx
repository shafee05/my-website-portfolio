"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function PortfolioPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    setIsLoaded(true);

    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Programming Languages
  const programmingSkills = ["Python", "C++"];

  // AI & ML Skills
  const aiSkills = [
    "Prompt Engineering",
    "Few-shot & Zero-shot Learning",
  ];

  // Data Analytics Skills
  const dataSkills = [
    "SQL",
    "Pandas",
    "NumPy",
    "Tableau",
    "Power BI",
    "Data Visualization",
    "Statistical Analysis",
  ];

  // Soft Skills
  const softSkills = [
    "Critical Thinking",
    "Communication",
    "Problem Solving",
    "Team Collaboration",
  ];

  // Certifications
  const certifications = [
    "UiPath RPA – Infosys Foundation",
    "Cambridge Business English Certificate – Proficiency in professional communication",
    "Python Programming – Rinex",
    "Certified Data Science Engineering Student – Micro1",
    "Prompt Engineering Certificate from 1 Million Prompters by Dubai Prince",
    "Salesforce VIP Internship",
   ];

  // Image path (replace with your actual image path)
  const profileImage = "/images/portfolio-headshot.png"; // Verify this path

  // Popup content for Cricket Player Performance Prediction
  const cricketProjectPopupContent = {
    objective: "Predict cricket player performance (batsmen and bowlers) using ML models like Decision Tree and LightGBM.",
    workflow: "Includes data preprocessing, feature engineering, model training, and prediction using match-related stats.",
    accuracy: "Decision Tree achieves ~91% and LightGBM ~95% accuracy on training data.",
    usage: "Users can run the notebook to train models and predict performance using structured inputs (e.g., X_predict.csv).",
    disclaimer: "Datasets are for academic/demo use only.",
    githubUrl: "https://github.com/shafee05/Cricket-Player-Performance-prediction",
  };

  // Popup content for GestureTalk Project
  const gestureTalkPopupContent = {
    objective: "Develop a real-time sign language communication system for deaf and hearing users.",
    workflow: "Utilizes YOLO and DWpose for gesture recognition, 3D avatar animation for realistic sign representation, and integrates Google Speech API and NLP (NLTK/transformers) for two-way communication.",
    optimization: "Optimized with OpenCV, PyTorch, and real-time inference pipelines.",
    githubUrl: "https://github.com/shafee05/GestureTalk-Sign-Language-Recognition",
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-muted">
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="container mx-auto px-4 relative z-10 text-center py-20">
          <h1
            className={`font-freight text-4xl md:text-6xl lg:text-7xl text-secondary mb-6 transition-all duration-1000 transform ${
              isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            Mohammad Shafee ur Rahaman
          </h1>

          <p
            className={`text-lg md:text-xl text-secondary font-light max-w-2xl mx-auto transition-all duration-1000 delay-300 transform ${
              isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            Creative Developer • AI Enthusiast • Data Science Engineer
          </p>

          <div
            className={`mt-8 flex justify-center space-x-6 transition-all duration-1000 delay-500 transform ${
              isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            <div className="flex items-center text-secondary">
              <span className="mr-2"></span>
              <span>📍Hyderabad, India</span>
            </div>
            <div className="flex items-center text-secondary">
              <span className="mr-2"></span>
              <a
                href="mailto:md.shafee05s@gmail.com"
                className="hover:underline"
              >
                📧 md.shafee05s@gmail.com
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* About Me Section with Circular Profile Picture */}
      <section className="portfolio-section bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center py-10">
            {/* Image Column (Circular Profile Pic) */}
            <div className="order-1 md:order-1 flex justify-center">
              <div className="relative w-80 h-80 overflow-hidden rounded-full shadow-lg transition-all duration-300 border-4 border-shafee-dark">
                <Image
                  src={profileImage}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  onError={(e) => console.error("Image failed to load:", e)}
                />
              </div>
            </div>

            {/* Text Column */}
            <div className="order-2 md:order-2">
              <h2 className="portfolio-heading text-foreground">About Me</h2>
              <div className="order-2 md:order-2">
                {/* Hook */}
                <p className="mb-6 text-lg font-medium">
                  Some stories are written in code, others in ambition.  
                  Mine is written in both.
                </p>

                {/* First paragraph */}
                <p className="mb-4">
                  I am <span className="font-semibold">Mohammad Shafee ur Rahaman</span>, a 
                  Data Science Engineering graduate from ACE Engineering College, and my 
                  pursuit has never been ordinary. Where others see artificial intelligence 
                  as a tool of efficiency, I see it as a canvas of 
                  <span className="italic"> expression, empathy, and transformation</span>.
                </p>

                {/* Second paragraph */}
                <p className="mb-4">
                  At ADVI Group of Companies, I engineered Generative AI pipelines that 
                  elevated accuracy, reduced latency, and reshaped how teams approached 
                  innovation. In my projects—whether building <span className="font-semibold">GestureTalk</span>, 
                  a real-time sign language recognition and animation system, or predicting 
                  performance in cricket through intelligent models—I’ve proven that AI can 
                  be more than just functional. It can be <span className="italic">human at its core</span>.
                </p>

                {/* Third paragraph */}
                <p className="mb-4">
                  Armed with Python, Machine Learning, NLP, and a deep command over prompt 
                  engineering, I design systems not merely to process data, but to 
                  <span className="font-semibold"> influence behavior, inspire trust, and create 
                  experiences that linger</span>.
                </p>

                {/* Final punchline */}
                <p className="mt-6 text-xl font-semibold italic">
                  Because the next era of intelligence will not belong to machines that 
                  think faster—<br />
                  It will belong to machines that understand deeper.
                </p>
    
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section className="portfolio-section bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="portfolio-heading text-foreground">Education</h2>

          <div className="mb-6">
            <h3 className="text-xl font-medium text-foreground">
              ACE Engineering College, Hyderabad
            </h3>
            <p className="text-shafee-lighter">
              B.Tech in CSE - Data Science (2021–2025) – GPA: 7.71
            </p>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-medium text-foreground">
              Narayana Junior College
            </h3>
            <p className="text-shafee-lighter">Intermediate -MPC (2019-2021) – 92.3%</p>
          </div>

          <div>
            <h3 className="text-xl font-medium text-foreground">
              NS Grammar High School
            </h3>
            <p className="text-shafee-lighter">SSC – GPA: 9.3</p>
          </div>
        </div>
      </section>

      {/* Internship Section */}
      <section className="portfolio-section bg-background">
        <div className="container mx-auto px-4">
          <h2 className="portfolio-heading text-foreground">Internship Experience</h2>

          <div className="mb-6">
            <h3 className="text-xl font-medium text-foreground">
              Python Engineer – Gen AI Intern
            </h3>
            <p className="text-shafee-lighter">
              ADVI Group of Companies · Feb 2025 – Jul 2025 · Hyderabad
            </p>
            <ul className="list-disc pl-5 text-foreground mt-4">
              <li className="mb-3">Developed and deployed Python-based Generative AI solutions, improving LLM output accuracy by 20%.</li>
              <li className="mb-3">Built AI pipelines with Hugging Face Transformers, LangChain, and REST APIs, reducing inference time by 25%.</li>
              <li className="mb-3">Automated text and image-based workflows, boosting productivity by 30%.</li>
              <li className="mb-3">Collaborated with teams to deliver AI-driven features, cutting project timelines by 15%.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="portfolio-section bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="portfolio-heading text-foreground">Skills</h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Programming Skills */}
            <div>
              <h3 className="portfolio-subheading text-foreground mb-4">
                Programming Languages
              </h3>
              <div className="flex flex-wrap gap-2">
                {programmingSkills.map((skill, index) => (
                  <span key={index} className="skill-tag">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* AI & ML Skills */}
            <div>
              <h3 className="portfolio-subheading text-foreground mb-4">
                AI & Machine Learning
              </h3>
              <div className="flex flex-wrap gap-2">
                {aiSkills.map((skill, index) => (
                  <span key={index} className="skill-tag">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Data Analytics Skills */}
            <div>
              <h3 className="portfolio-subheading text-foreground mb-4">
                Data Analytics
              </h3>
              <div className="flex flex-wrap gap-2">
                {dataSkills.map((skill, index) => (
                  <span key={index} className="skill-tag">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Soft Skills */}
            <div>
              <h3 className="portfolio-subheading text-foreground mb-4">
                Soft Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {softSkills.map((skill, index) => (
                  <span key={index} className="skill-tag">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="portfolio-section bg-background">
        <div className="container mx-auto px-4">
          <h2 className="portfolio-heading text-foreground">Projects</h2>

          <div
            className="project-card"
            onClick={() => { setIsPopupOpen(true); setCurrentProject("gestureTalk"); }}
            style={{ cursor: "pointer" }}
          >
            <div className="flex items-center space-x-2 mb-2">
              <a
                href="https://github.com/shafee05/GestureTalk-Sign-Language-Recognition"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
              >
                <div className="relative w-6 h-6">
                  <Image
                    src="/svg/github.svg"
                    alt="GitHub Repository"
                    fill
                    className="object-contain"
                  />
                </div>
              </a>
              <span className="text-xl font-medium text-foreground hover:opacity-80 hover:underline transition-opacity">
                GestureTalk Real-Time Sign Language Recognition and Animation System (2025)
              </span>
            </div>
            <p className="text-shafee-lighter mb-4">
              Developed a real-time sign language communication system using YOLO and DWpose for gesture recognition, 
              3D avatar animation for realistic sign representation, and integrated Google Speech API and NLP 
              (NLTK/transformers) for two-way communication between deaf and hearing users, optimized with OpenCV, 
              PyTorch, and real-time inference pipelines.
            </p>
          </div>

          <div
            className="project-card"
            onClick={() => { setIsPopupOpen(true); setCurrentProject("cricket"); }}
            style={{ cursor: "pointer" }}
          >
            <div className="flex items-center space-x-2 mb-2">
              <a
                href="https://github.com/shafee05/Cricket-Player-Performance-prediction"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
              >
                <div className="relative w-6 h-6">
                  <Image
                    src="/svg/github.svg"
                    alt="GitHub Repository"
                    fill
                    className="object-contain"
                  />
                </div>
              </a>
              <span className="text-xl font-medium text-foreground hover:opacity-80 hover:underline transition-opacity">
                🏏 Cricket Player Performance Prediction (2024)
              </span>
            </div>
            <p className="text-shafee-lighter mb-4">
              Built a predictive ML model using Python and Pandas. Improved
              match outcome predictions by 15% through algorithm optimization.
            </p>
          </div>
              
          {/* <div className="project-card">
            <div className="flex items-center mb-2">
              <Link
                href="/asset#steps"
                className="text-xl font-medium text-foreground hover:opacity-80 hover:underline transition-opacity"
              >
                AI Assistant 2.0 – More Than Just a Chatbot
              </Link>
              <span className="ml-3 px-2 py-1 text-xs bg-accent text-secondary rounded-md">
                In Progress
              </span>
            </div>
            <p className="text-shafee-lighter mb-4">
              A next-gen personal AI assistant under development, designed to
              retain prior conversations, analyze user sentiment, and craft
              contextually rich responses. "Not just answers—connections."
            </p>
          </div> */}
        </div>

        {/* Popup Modal for Projects */}
        {isPopupOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsPopupOpen(false);
            }}
          >
            <div
              className="bg-background p-6 rounded-lg shadow-lg relative text-foreground"
              style={{ maxWidth: "768px", aspectRatio: "8 / 4" }}
            >
              <button
                className="absolute top-4 right-4 text-foreground text-2xl w-8 h-8 flex items-center justify-center bg-accent rounded-full"
                onClick={() => setIsPopupOpen(false)}
              >
                ×
              </button>

              {currentProject === "gestureTalk" ? (
                <>
                  <h3 className="text-2xl font-semibold mb-4">
                    GestureTalk Real-Time Sign Language Recognition (2025)
                  </h3>
                  <div className="space-y-4 overflow-y-auto h-full pr-2">
                    <p><strong>Objective:</strong> {gestureTalkPopupContent.objective}</p>
                    <p><strong>Workflow:</strong> {gestureTalkPopupContent.workflow}</p>
                    <p><strong>Optimization:</strong> {gestureTalkPopupContent.optimization}</p>
                    <a
                      href={gestureTalkPopupContent.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-6 bg-accent hover:bg-shafee-medium text-secondary py-2 px-4 rounded-md transition-colors"
                    >
                      View on GitHub
                      <div className="relative w-4 h-4">
                        <Image
                          src="/svg/github.svg"
                          alt="GitHub Repository"
                          fill
                          className="object-contain"
                        />
                      </div>
                    </a>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-2xl font-semibold mb-4">
                    Cricket Player Performance Prediction (2024)
                  </h3>
                  <div className="space-y-4 overflow-y-auto h-full pr-2">
                    <p><strong>Objective:</strong> {cricketProjectPopupContent.objective}</p>
                    <p><strong>Workflow:</strong> {cricketProjectPopupContent.workflow}</p>
                    <p><strong>Accuracy:</strong> {cricketProjectPopupContent.accuracy}</p>
                    <p><strong>Usage:</strong> {cricketProjectPopupContent.usage}</p>
                    <p><strong>Disclaimer:</strong> {cricketProjectPopupContent.disclaimer}</p>
                    <a
                      href={cricketProjectPopupContent.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-6 bg-accent hover:bg-shafee-medium text-secondary py-2 px-4 rounded-md transition-colors"
                    >
                      View on GitHub
                      <div className="relative w-4 h-4">
                        <Image
                          src="/svg/github.svg"
                          alt="GitHub Repository"
                          fill
                          className="object-contain"
                        />
                      </div>
                    </a>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Certifications Section */}
      <section className="portfolio-section bg-muted">
        <div className="container mx-auto px-4">
          <a
            href="https://www.linkedin.com/in/mohammad-shafee05"
            target="_blank"
            rel="noopener noreferrer"
            className="portfolio-heading text-foreground flex items-center hover:opacity-80 transition-opacity"
          >
            <h2 className="flex items-center">
              Certifications{" "}
              <div className="relative w-6 h-6 ml-3">
                <Image
                  src="/svg/linkedin.svg"
                  alt="LinkedIn Profile"
                  fill
                  className="object-contain"
                />
              </div>
            </h2>
          </a>

          <ul className="list-disc pl-5 text-foreground">
            {certifications.map((cert, index) => (
              <li key={index} className="mb-3">
                {cert}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Activities & Achievements */}
      <section className="portfolio-section bg-background">
        <div className="container mx-auto px-4">
          <h2 className="portfolio-heading text-foreground">Activities & Achievements</h2>

          <ul className="list-disc pl-5 text-foreground">
            <li className="mb-3">Hack-A-Bot Winner – Campus-level AI competition</li>
            <li className="mb-3">
              Flipkart Grid 5.0 – (participated) National tech innovation
              challenge, 2024
            </li>
            <li className="mb-3">
              T-Hub Visit – Practical skill-building session through community &
              tech exercises
            </li>
          </ul>
        </div>
      </section>

      {/* Contact Section */}
      <section className="portfolio-section bg-background">
        <div className="container mx-auto px-4">
          <h2 className="portfolio-heading text-foreground">Contact</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="mb-3">
                <a
                  href="https://www.youtube.com/@_shafee_05_"
                  className="ml-2 text-xl text-shafee-lighter hover:text-foreground"
                >
                  Youtube
                </a>
              </p>
              <p className="mb-3">
                <a
                  href="https://www.instagram.com/_shafee_05_"
                  className="ml-2 text-xl text-shafee-lighter hover:text-foreground"
                >
                  Instagram
                </a>
              </p>
            </div>
            <div>
              <p className="mb-3">
                <a
                  href="mailto:md.shafee05s@gmail.com"
                  className="ml-2 text-xl text-shafee-lighter hover:text-foreground"
                >
                  Gmail
                </a>
              </p>
              <p className="mb-3">
                <a
                  href="https://www.linkedin.com/in/mohammad-shafee05"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-xl text-shafee-lighter hover:text-foreground"
                >
                  LinkedIn
                </a>
              </p>
              <p className="mb-3">
                <a
                  href="https://github.com/shafee05"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-xl text-shafee-lighter hover:text-foreground"
                >
                  Github
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="py-16 bg-muted text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl mb-6 font-freight text-foreground">
            Interested in working with me?
          </h2>
          <a
            href="mailto:md.shafee05s@gmail.com"
            className="inline-block bg-accent hover:bg-shafee-medium text-secondary px-8 py-3 rounded-md transition-colors"
          >
            Get in touch
          </a>
        </div>
      </section>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-white text-black p-3 rounded-full 
                     shadow-lg hover:bg-gray-200 transition-colors z-50"
          aria-label="Scroll to top"
        >
          ^
        </button>
      )}
    </main>
  );
}