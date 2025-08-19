import './globals.css';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';


export const metadata = {
  title: 'Mohammad Shafee ur Rahaman - Portfolio',
  description: "Creative Developer, AI Enthusiast, and Data Science Engineer focusing on emotional intelligence in machines",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <!-- Google tag (gtag.js) -->
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-QS7GP95WQB"></script>
        <script>
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-QS7GP95WQB');
        </script>
      </head>
      <body>
        <Navbar />
        <main>
          {children}
        </main>
        <Footer />
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