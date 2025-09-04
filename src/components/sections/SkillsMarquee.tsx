// SkillsMarquee.tsx
"use client";

import Image from 'next/image'; // Switched to next/image for optimization

export default function SkillsMarquee() {
  const skills = [
    { src: "/svg/python.svg", alt: "Python" },
    { src: "/svg/Cprogramming.svg", alt: "C Programming" },
    { src: "/svg/c++.svg", alt: "C++" },
    { src: "/svg/nlp.svg", alt: "NLP" },
    { src: "/svg/javascript.svg", alt: "JavaScript" },
    { src: "/svg/react.svg", alt: "React" },
    { src: "/svg/nodejs.svg", alt: "Node.js" },
    { src: "/svg/tailwindcss.svg", alt: "Tailwind CSS" },
    { src: "/svg/mysql.svg", alt: "MySQL" },
    { src: "/svg/rpa.svg", alt: "RPA" },
    { src: "/svg/power-bi.svg", alt: "Power BI" },
    { src: "/svg/tableau.svg", alt: "Tableau" },
    { src: "/svg/OpenAI.svg", alt: "OpenAI" },
    { src: "/svg/Midjourney.svg", alt: "Midjourney" },
    { src: "/svg/Hugging-Face.svg", alt: "Hugging Face" },
  ];

  // Repeat skills 4 times for smooth looping without gaps
  const repeatedSkills = [...skills, ...skills, ...skills, ...skills];

  return (
    <div className="w-full overflow-hidden bg-black py-4 border-t border-white/10">
      <div className="whitespace-nowrap animate-marquee flex items-center text-white text-base font-medium gap-10 px-4 hover:animation-paused"> {/* Added pause on hover */}
        <div className="flex items-center space-x-10">
          {repeatedSkills.map((skill, i) => (
            <div key={i} className="relative h-12 w-12">
              <Image
                src={skill.src}
                alt={skill.alt}
                fill
                className="object-contain"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`
        .animate-marquee {
          animation: marquee 60s linear infinite; /* Slower for better UX */
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        .hover\\:animation-paused:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}