import { Inter, Playfair_Display } from 'next/font/google';

export const metadata = {
    title: 'Free SaaS Launch Readiness Grader | LaunchXact Distribution Grader',
    description: 'Is your SaaS landing page ready for launch? Get a free AI-powered audit with conversion psychology analysis, trust signal checks, and a custom headline rewrite. Score 80+ to fast-track your Genesis Batch application.',
    keywords: [
        'SaaS grader', 'landing page grader', 'launch readiness', 'SaaS audit tool',
        'LaunchXact grader', 'free SaaS audit', 'landing page score',
        'conversion rate audit', 'startup launch checklist',
        'LaunchXact SaaS grader', 'SaaS landing page checker'
    ],
    openGraph: {
        title: 'Free SaaS Launch Readiness Grader | LaunchXact',
        description: 'AI-powered audit for your SaaS landing page. Get scored on conversion, trust, and distribution readiness. Score 80+ to fast-track your Genesis Batch application.',
        url: 'https://launchxact.com/grade',
        siteName: 'LaunchXact',
        images: [
            {
                url: '/opengraph-image.png',
                width: 1200,
                height: 630,
                alt: 'LaunchXact Distribution Grader',
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Free SaaS Launch Readiness Grader | LaunchXact',
        description: 'Is your landing page ready for launch? Get your free AI audit now.',
        creator: '@launchxact',
        images: ['/twitter-image.png'],
    },
};

const graderJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'LaunchXact Distribution Grader',
    applicationCategory: 'BusinessApplication, DeveloperApplication, UtilitiesApplication',
    operatingSystem: 'Web',
    url: 'https://launchxact.com/grade',
    description: 'Free AI-powered SaaS landing page grader. Analyzes conversion psychology, trust signals, buyer friction, and distribution potential.',
    offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
    },
    creator: {
        '@type': 'Organization',
        name: 'LaunchXact',
        url: 'https://launchxact.com',
    },
    featureList: [
        'AI Landing Page Audit',
        'Conversion Psychology Analysis',
        'Trust Signal Detection',
        'Headline Optimization',
        'SEO & Meta Tag Review'
    ],
    aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        ratingCount: '150'
    }
};

export default function GradeLayout({ children }) {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(graderJsonLd) }}
            />
            {children}
        </>
    );
}
