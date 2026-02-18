import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './globals.css';
import { Inter, Playfair_Display } from 'next/font/google';
import Script from 'next/script';
import { GoogleTagManager } from '@next/third-parties/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' });

export const metadata = {
  title: 'LaunchXact - Premier Product Launch Platform & Micro SaaS Directory',
  description: 'LaunchXact is the best place to launch your SaaS. A curated directory for micro SaaS, indie hackers, and new product launches. Discover the next big thing.',
  keywords: [
    'LaunchXact', 'SaaS', 'Product Launch', 'Startup', 'Software Discovery', 'Indie Hackers', 'Early Adopters', 'Tech Tools',
    'where to launch my SaaS', 'sites to list my product', 'micro SaaS directory', 'product launch platforms',
    'alternatives to Product Hunt', 'alternative to appsumo', 'new SaaS', 'newly launched SaaS'
  ],
  authors: [{ name: 'Ravi', url: 'https://launchxact.com' }],
  creator: 'Ravi',
  publisher: 'LaunchXact',
  metadataBase: new URL('https://launchxact.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'LaunchXact - Discover Next Gen SaaS | Launch Your Product',
    description: 'The alternative to Product Hunt for indie founders. List your micro SaaS, get discovered by early adopters, and launch without the noise.',
    url: 'https://launchxact.com',
    siteName: 'LaunchXact',
    images: [
      {
        url: '/opengraph-image.png',
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
    title: 'LaunchXact - The Micro SaaS Launch Platform',
    description: 'Launch your product today. The best directory for new and emerging SaaS tools.',
    creator: '@launchxact',
    images: ['/twitter-image.png'],
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

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'LaunchXact',
  url: 'https://launchxact.com',
  logo: 'https://launchxact.com/icon',
  sameAs: [
    'https://twitter.com/launchxact',
    // Add other social profiles here
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'contact@launchxact.com',
    contactType: 'customer support',
  },
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'LaunchXact',
  url: 'https://launchxact.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://launchxact.com/?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable}`}>
        {/* Google Tag Manager (Implemented via @next/third-parties) */}
        <GoogleTagManager gtmId="GTM-PJRNX6SW" />

        {/* JSON-LD Schema for Brand Entity & Logo */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />


        {/* Google Analytics (Legacy/Direct) removed in favor of GTM */}

        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
