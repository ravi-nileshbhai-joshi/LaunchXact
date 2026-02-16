import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './globals.css';
import { Inter, Playfair_Display } from 'next/font/google';
import Script from 'next/script';
import { GoogleTagManager } from '@next/third-parties/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' });

export const metadata = {
  title: 'LaunchXact - Discover Next Gen SaaS | Product Launch Platform',
  description: 'LaunchXact is a curated platform where founders showcase their products and early adopters discover new software. Join the waitlist for exclusive access.',
  keywords: ['SaaS', 'Product Launch', 'Startup', 'Software Discovery', 'Indie Hackers', 'Early Adopters', 'Tech Tools'],
  authors: [{ name: 'Ravi', url: 'https://launchxact.com' }],
  creator: 'Ravi',
  publisher: 'LaunchXact',
  metadataBase: new URL('https://launchxact.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'LaunchXact - Discover Next Gen SaaS',
    description: 'LaunchXact is a curated platform where founders showcase their products and early adopters discover new software.',
    url: 'https://launchxact.com',
    siteName: 'LaunchXact',
    images: [
      {
        url: '/opengraph-image.png', // We need to ensure this exists or use a default
        width: 1200,
        height: 630,
        alt: 'LaunchXact - SaaS Discovery Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LaunchXact - Discover Next Gen SaaS',
    description: 'A curated platform for discovering the next generation of SaaS tools built by indie founders.',
    creator: '@launchxact', // Assuming handle
    images: ['/twitter-image.png'], // We need to ensure this exists or use a default
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable}`}>
        {/* Google Tag Manager (Implemented via @next/third-parties) */}
        <GoogleTagManager gtmId="GTM-PJRNX6SW" />


        {/* Google Analytics (Legacy/Direct) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-ZPYHYV8KXT"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-ZPYHYV8KXT');
          `}
        </Script>

        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
