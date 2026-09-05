import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SmoothScroll from '../components/SmoothScroll';
import './globals.css';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import Script from 'next/script';
import { GoogleTagManager } from '@next/third-parties/google';
import geoQueries from '../public/geo-queries.json';
import CookieBanner from '../components/CookieBanner';

const inter = Inter({ subsets: ['latin'], variable: '--font-body', display: 'swap' });
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-sans', weight: ['400','500','600','700','800'], display: 'swap' });

export const metadata = {
  title: {
    default: 'LaunchXact - Startup Visibility OS & SaaS Discovery Platform',
    template: '%s | LaunchXact',
  },
  description: 'LaunchXact helps founders build discoverability, authority, and distribution systems using modern SEO, AI search optimization, Reddit, and founder-led content. Get the Startup Visibility OS for $49.',
  keywords: [
    'LaunchXact', 'SaaS', 'SaaS Marketplace', 'B2B Software', 'Startup', 'Software Discovery', 'Enterprise Tools', 'Tech Tools',
    'where to launch my SaaS', 'curated software directory', 'premium saas marketplace', 'buy saas products',
    'submit saas platform', 'founder friendly saas market', 'new SaaS', 'newly launched SaaS', 'founder tools', 'saas grader'
  ],
  authors: [{ name: 'Ravi Joshi', url: 'https://www.launchxact.com' }],
  creator: 'Ravi Joshi',
  publisher: 'LaunchXact',
  metadataBase: new URL('https://www.launchxact.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'LaunchXact - Premium Curated SaaS Marketplace & Founder Toolkit',
    description: 'A manually curated multi-vendor SaaS marketplace and founder toolkit. Discover high-value software that solves real problems, and launch your product in a premium ecosystem.',
    url: 'https://www.launchxact.com',
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
    description: 'Launch your product today. The best directory and toolkit for new and emerging SaaS tools.',
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

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

const entityGraph = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://www.launchxact.com/#organization',
      name: 'LaunchXact',
      url: 'https://www.launchxact.com',
      logo: 'https://www.launchxact.com/icon.png',
      image: 'https://www.launchxact.com/opengraph-image.png',
      sameAs: [
        'https://twitter.com/launchxact',
        'https://github.com/ravi-nileshbhai-joshi/LaunchXact',
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        email: 'contact@launchxact.com',
        contactType: 'customer support',
      },
    },
    {
      '@type': 'WebSite',
      '@id': 'https://www.launchxact.com/#website',
      url: 'https://www.launchxact.com',
      name: 'LaunchXact',
      alternateName: ['Launch Xact', 'LaunchXact.com'],
      description: 'Startup Visibility OS & SaaS Discovery Platform for indie founders.',
      publisher: {
        '@id': 'https://www.launchxact.com/#organization',
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://www.launchxact.com/?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'ItemList',
      '@id': 'https://www.launchxact.com/#sitelinks',
      name: 'LaunchXact Primary Navigation & Toolkit Sitelinks',
      description: 'Primary tools, guides, and navigation endpoints for LaunchXact',
      itemListElement: [
        {
          '@type': 'SiteNavigationElement',
          position: 1,
          name: 'SaaS Readiness Grader',
          description: 'AI-powered landing page audit scoring conversion psychology, trust signals, and launch readiness.',
          url: 'https://www.launchxact.com/grade',
        },
        {
          '@type': 'SiteNavigationElement',
          position: 2,
          name: 'Founder Tools',
          description: 'Interactive calculators, simulators, and distribution playbooks for SaaS founders.',
          url: 'https://www.launchxact.com/tools',
        },
        {
          '@type': 'SiteNavigationElement',
          position: 3,
          name: 'Payment Cost Simulator',
          description: 'Compare raw gateway tax compliance overhead against flat Merchant of Record fees.',
          url: 'https://www.launchxact.com/tools/true-cost-of-payments',
        },
        {
          '@type': 'SiteNavigationElement',
          position: 4,
          name: 'Franken-Stack Forecaster',
          description: 'Predict the hidden cloud infrastructure cost cliff as your SaaS scales.',
          url: 'https://www.launchxact.com/tools/franken-stack-cost-forecaster',
        },
        {
          '@type': 'SiteNavigationElement',
          position: 5,
          name: 'Pre-Launch Distribution Architect',
          description: 'Day-by-day SaaS launch roadmap, curated channels, and viral copy hooks.',
          url: 'https://www.launchxact.com/tools/pre-launch-distribution-architect',
        },
        {
          '@type': 'SiteNavigationElement',
          position: 6,
          name: 'GEO Schema Snippet Generator',
          description: 'JSON-LD structured data generator engineered for Google AI Overviews, Perplexity, and ChatGPT Search.',
          url: 'https://www.launchxact.com/tools/geo-schema-snippet-generator',
        },
        {
          '@type': 'SiteNavigationElement',
          position: 7,
          name: 'Where to Launch SaaS',
          description: 'Comprehensive 2026 directory and evaluation of SaaS marketplaces and launch platforms.',
          url: 'https://www.launchxact.com/where-to-launch-saas',
        },
        {
          '@type': 'SiteNavigationElement',
          position: 8,
          name: 'Articles & Guides',
          description: 'Tactical playbooks on organic SaaS distribution, SEO, and traction.',
          url: 'https://www.launchxact.com/articles',
        },
        {
          '@type': 'SiteNavigationElement',
          position: 9,
          name: 'About LaunchXact',
          description: 'Our mission to give indie founders sustained visibility and distribution.',
          url: 'https://www.launchxact.com/about',
        },
        {
          '@type': 'SiteNavigationElement',
          position: 10,
          name: 'Contact Support',
          description: 'Get in touch with the LaunchXact team.',
          url: 'https://www.launchxact.com/contact',
        },
      ],
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Unified Entity Graph: Organization, WebSite & SiteNavigationElement */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(entityGraph) }}
        />

        {/* AEO/GEO Schema FAQ for Search Engines & AI Crawlers */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(geoQueries.schema_faq) }}
        />

        {/* Custom Knowledge Base Data for Generative Engines (GPTbot, Perplexity, etc.) */}
        <script
          type="application/json"
          id="geo-knowledge-base"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              knowledge_base: geoQueries.knowledge_base,
              geo_queries: geoQueries.geo_queries
            })
          }}
        />
      </head>
      <body className={`${inter.variable} ${jakarta.variable}`}>
        {/* Google Tag Manager (Implemented via @next/third-parties) */}
        <GoogleTagManager gtmId="GTM-PJRNX6SW" />

        <SmoothScroll />
        <Navbar />
        <main>{children}</main>
        <CookieBanner />
        <Footer />
      </body>
    </html>
  );
}
