export const metadata = {
    title: 'AI SaaS Readiness Grader: Landing Page Audit & Score',
    description: 'Is your SaaS landing page ready for launch? Get a free AI-powered audit with conversion psychology analysis, trust signal checks, and a custom headline rewrite.',
    keywords: [
        'ai saas grader', 'saas readiness grader', 'landing page audit tool',
        'saas conversion grader', 'launchxact grader', 'free saas audit'
    ],
    alternates: {
        canonical: '/tools/ai-saas-grader',
    },
    openGraph: {
        title: 'AI SaaS Launch Readiness Grader | LaunchXact',
        description: 'AI-powered audit for your SaaS landing page. Get scored on conversion psychology, trust signals, and distribution readiness.',
        url: 'https://www.launchxact.com/tools/ai-saas-grader',
        type: 'website',
    },
};

const graderJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'AI SaaS Launch Readiness Grader',
    applicationCategory: 'BusinessApplication, DeveloperApplication, UtilitiesApplication',
    operatingSystem: 'Web',
    url: 'https://www.launchxact.com/tools/ai-saas-grader',
    isPartOf: {
        '@type': 'WebSite',
        '@id': 'https://www.launchxact.com/#website'
    },
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
            name: 'AI SaaS Readiness Grader',
            item: 'https://www.launchxact.com/tools/ai-saas-grader'
        }
    ]
};

export default function AiGraderLayout({ children }) {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(graderJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
            {children}
        </>
    );
}
