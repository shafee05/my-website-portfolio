import './globals.css';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { PageLoader } from "@/components/IntroAnimation";
import Script from 'next/script';
import { SpeedInsights } from "@vercel/speed-insights/next";

/* ════════════════════════════════════════════════════════════════
   METADATA — controls how the link looks when shared on
   WhatsApp, LinkedIn, Twitter/X, Discord, iMessage, Telegram
════════════════════════════════════════════════════════════════ */
export const metadata = {
  /* ── Basic ─────────────────────────────────────────────────── */
  title: {
    default: 'Mohammad Shafee — Gen AI · Data Science · Life Coaching',
    template: '%s | Mohammad Shafee',
  },
  description:
    'Portfolio of Mohammad Shafee ur Rahaman — Gen AI Engineer, Data Scientist, Published Author & Certified Life Coach. Building AI that feels human.',

  /* ── Canonical URL ──────────────────────────────────────────── */
  metadataBase: new URL('https://shafee05.vercel.app'),
  alternates: { canonical: '/' },

  /* ── Open Graph (WhatsApp, LinkedIn, Facebook, Discord) ─────── */
  openGraph: {
    type:        'website',
    url:         'https://shafee05.vercel.app',
    siteName:    'Mohammad Shafee Portfolio',
    title:       'Mohammad Shafee — Gen AI · Data Science · Life Coaching',
    description: 'Gen AI Engineer, Data Scientist, Published Author & Certified Life Coach. Explore projects, the published book, remote job board, and life coaching.',
    images: [
      {
        url:    '/og-image.png',   // place file at /public/og-image.png
        width:  1200,
        height: 630,
        alt:    'Mohammad Shafee Portfolio — Data Science · Gen AI · Life Coaching',
      },
    ],
    locale: 'en_IN',
  },

  /* ── Twitter / X Card ───────────────────────────────────────── */
  twitter: {
    card:        'summary_large_image',
    site:        '@shafee_05',
    creator:     '@shafee_05',
    title:       'Mohammad Shafee — Gen AI · Data Science · Life Coaching',
    description: 'Gen AI Engineer, Data Scientist, Published Author & Certified Life Coach.',
    images:      ['/og-image.png'],
  },

  /* ── Search engine hints ────────────────────────────────────── */
  robots: {
    index:  true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },

  /* ── PWA / mobile chrome ────────────────────────────────────── */
  themeColor:       '#02040e',
  colorScheme:      'dark',
  viewport: {
    width:        'device-width',
    initialScale: 1,
    maximumScale: 5,        // allow user zoom (accessibility)
  },

  /* ── Icons ──────────────────────────────────────────────────── */
  icons: {
    icon:             '/favicon.ico',
    apple:            '/apple-touch-icon.png',   // 180×180 recommended
    shortcut:         '/favicon-32x32.png',
  },

  /* ── Verification (add if you have Search Console / Bing) ───── */
  // verification: { google: 'YOUR_GOOGLE_SITE_VERIFICATION_TOKEN' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
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
        {/* Page-load progress bar + spinner — shown on every navigation */}
        <PageLoader />

        <Navbar />
        <main>{children}</main>
        <Footer />

        <SpeedInsights />
      </body>
    </html>
  );
}