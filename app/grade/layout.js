import { Inter, Playfair_Display } from 'next/font/google';

export const metadata = {
    title: 'Free SaaS Discovery Audit | LaunchXact',
    description: 'Is your SaaS ready to be discovered? Enter your website and get a free analysis of your landing page, messaging, trust signals, SEO and AI-search readiness.',
    keywords: [
        'SaaS discovery audit', 'landing page audit', 'SaaS grader', 'free SaaS audit',
        'LaunchXact discovery audit', 'landing page score', 'AI search readiness',
        'conversion rate audit', 'GEO audit', 'SEO audit tool'
    ],
    openGraph: {
        title: 'Free SaaS Discovery Audit | LaunchXact',
        description: 'Is your SaaS ready to be discovered? Enter your website and get a free analysis of your landing page, messaging, trust signals, SEO and AI-search readiness.',
        url: 'https://www.launchxact.com/grade',
        siteName: 'LaunchXact',
        images: [
            {
                url: '/opengraph-image.png',
                width: 1200,
                height: 630,
                alt: 'LaunchXact Free SaaS Discovery Audit',
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Free SaaS Discovery Audit | LaunchXact',
        description: 'Is your SaaS ready to be discovered? Get your free discovery analysis now.',
        creator: '@launchxact',
        images: ['/twitter-image.png'],
    },
    alternates: { canonical: '/grade' }
};

const graderJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'LaunchXact Free SaaS Discovery Audit',
    applicationCategory: 'BusinessApplication, DeveloperApplication, UtilitiesApplication',
    operatingSystem: 'Web',
    url: 'https://www.launchxact.com/grade',
    isPartOf: {
        '@type': 'WebSite',
        '@id': 'https://www.launchxact.com/#website'
    },
    description: 'Free SaaS Discovery Audit analyzing landing page messaging, conversion friction, trust signals, SEO indexability, and AI search readiness.',
    offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
    },
    creator: {
        '@type': 'Organization',
        name: 'LaunchXact',
        url: 'https://www.launchxact.com',
    },
    featureList: [
        'Messaging Audit',
        'Conversion Analysis',
        'Trust Signal Review',
        'SEO & Search Engine Indexing',
        'AI Search Readiness (AEO/GEO)'
    ],
    aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        ratingCount: '150'
    }
};

const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
        {
            '@type': 'Question',
            name: 'How does the LaunchXact Free SaaS Discovery Audit work?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'The LaunchXact Discovery Audit analyzes your SaaS landing page across 5 core pillars: Messaging, Conversion, Trust, Search, and AI Discovery. It returns a 0-100 breakdown score along with 3 prioritized fixes to optimize your page for human buyers and AI search engines.'
            }
        },
        {
            '@type': 'Question',
            name: 'Does my discovery score determine if my SaaS gets accepted into LaunchXact?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'No. The grader is a free diagnostic tool for founders. Human curation determines whether a SaaS gets listed on LaunchXact. Products scoring 62/100 or below can still be accepted into the Founding 50 if the underlying software utility is strong.'
            }
        },
        {
            '@type': 'Question',
            name: 'How do I improve my SaaS discovery score?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Implement the 3 prioritized fixes in your audit report: rewrite your H1 to communicate concrete outcomes, add visible trust signals above the fold, and add structured JSON-LD schemas for search engines and AI assistants.'
            }
        }
    ]
};

const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
        {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://www.launchxact.com'
        },
        {
            '@type': 'ListItem',
            position: 2,
            name: 'Founder Tools',
            item: 'https://www.launchxact.com/tools'
        },
        {
            '@type': 'ListItem',
            position: 3,
            name: 'Grade Your SaaS',
            item: 'https://www.launchxact.com/grade'
        }
    ]
};

export default function GradeLayout({ children }) {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(graderJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
            {children}
        </>
    );
}
