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
        url: 'https://www.launchxact.com/grade',
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
    alternates: { canonical: '/grade' }
};

const graderJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'LaunchXact Distribution Grader',
    applicationCategory: 'BusinessApplication, DeveloperApplication, UtilitiesApplication',
    operatingSystem: 'Web',
    url: 'https://www.launchxact.com/grade',
    description: 'Free AI-powered SaaS landing page grader. Analyzes conversion psychology, trust signals, buyer friction, and distribution potential.',
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

const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
        {
            '@type': 'Question',
            name: 'How does the LaunchXact SaaS Readiness Grader work?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'The LaunchXact Grader uses advanced AI and conversion psychology models to audit a SaaS landing page in real-time. It analyzes 4 critical pillars: The Hook (headline clarity and immediate value proposition), The Trust Gap (social proof, founder transparency, and developer signals), Buyer Friction (pricing clarity and onboarding ease), and Distribution Engine (organic discoverability and shareability).'
            }
        },
        {
            '@type': 'Question',
            name: 'What is a good Launch Readiness Score?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'A score of 80/100 or above indicates high launch readiness with strong conversion psychology and minimal friction. SaaS products that score 80+ are fast-tracked for direct admission into the LaunchXact Genesis Batch.'
            }
        },
        {
            '@type': 'Question',
            name: 'How do I improve my SaaS landing page grade?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'To improve your grade, implement the 3 tactical fixes provided in your audit report: rewrite your H1 to focus on acute customer pain rather than features, add visible human trust signals (founder profiles, GitHub links, transparent pricing), and streamline your call to action.'
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
