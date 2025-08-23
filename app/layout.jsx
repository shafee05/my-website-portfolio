import './globals.css';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import Script from 'next/script';   // ✅ Google Analytics
import { SpeedInsights } from '@vercel/speed-insights/next';  // ✅ Vercel Speed Insights

export const metadata = {
  title: 'Mohammad Shafee ur Rahaman - Portfolio',
  description:
    'Creative Developer, AI Enthusiast, and Data Science Engineer focusing on emotional intelligence in machines',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* ✅ Google Analytics with Next.js */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-QS7GP95WQB"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-QS7GP95WQB');
          `}
        </Script>
      </head>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />

        {/* ✅ Add Vercel Speed Insights (free) */}
        <SpeedInsights />
      </body>
    </html>
  );
}



// useEffect(() => {
//   const preventCopy = (e) => e.preventDefault();
//   document.addEventListener('contextmenu', preventCopy); // Disable right-click
//   document.addEventListener('dragstart', preventCopy); // Disable drag
//   return () => {
//     document.removeEventListener('contextmenu', preventCopy);
//     document.removeEventListener('dragstart', preventCopy);
//   };
// }, []);