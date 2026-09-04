import GeoSchemaGenerator from '@/components/tools/GeoSchemaGenerator';

export const metadata = {
    title: 'GEO & Schema Snippet Generator | JSON-LD Structured Data for AI Search & Google',
    description: 'Free JSON-LD schema markup generator for SaaS and indie founders. Generate verified SoftwareApplication, FAQPage, and Organization schemas optimized for Google AI Overviews, Perplexity, and ChatGPT Search.',
    keywords: [
        'geo schema generator',
        'json ld generator saas',
        'generative engine optimization schema',
        'softwareapplication schema generator',
        'faqpage schema maker',
        'nextjs json ld generator',
        'ai search schema optimization'
    ],
    alternates: {
        canonical: '/tools/geo-schema-snippet-generator',
    },
    openGraph: {
        title: 'GEO & Schema Snippet Generator | LaunchXact',
        description: 'Generate verified JSON-LD structured data tailored for Generative Engine Optimization (GEO). Get cited by ChatGPT Search, Perplexity, and Google AI Overviews.',
        url: 'https://www.launchxact.com/tools/geo-schema-snippet-generator',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'GEO & Schema Snippet Generator | LaunchXact',
        description: 'Free JSON-LD schema builder engineered for AI search citations and Google Rich Snippets.',
    },
};

export default function GeoSchemaSnippetGeneratorPage() {
    const webAppJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'The GEO & Schema Snippet Generator',
        url: 'https://www.launchxact.com/tools/geo-schema-snippet-generator',
        applicationCategory: 'BusinessApplication, DeveloperApplication, UtilitiesApplication',
        operatingSystem: 'Web, All',
        browserRequirements: 'Requires JavaScript',
        description: 'Free interactive JSON-LD structured data generator engineered for Generative Engine Optimization (GEO). Builds verified SoftwareApplication, FAQPage, Organization, and BreadcrumbList schemas with 1-click Next.js and HTML export formats.',
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
            'All-in-One GEO Bundle Multi-Schema Generator (@graph)',
            'SoftwareApplication Schema with pricing, offers, and featureList',
            'Interactive FAQPage Builder for direct AI search citations',
            'Organization & Entity Schema with logo and brand attribution',
            'Format Toggles: Next.js <script> component, Standard HTML, and Raw JSON-LD',
            'Built-in Schema Syntax Linter and Completeness Health Check',
            '1-Click Exportable .jsonld File Download',
            '1-Click Direct Validation via Google Rich Results Test',
            'Quick-Load Presets for AI Agents, DevTools, and Creator Apps'
        ],
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.95',
            ratingCount: '89'
        }
    };

    const faqJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
            {
                '@type': 'Question',
                name: 'What is Generative Engine Optimization (GEO)?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Generative Engine Optimization (GEO) is the practice of structuring website content and metadata specifically so artificial intelligence search engines—such as Perplexity, ChatGPT Search, and Google AI Overviews—can accurately parse, comprehend, and cite your product in natural language answers.'
                }
            },
            {
                '@type': 'Question',
                name: 'Why is SoftwareApplication JSON-LD schema critical for SaaS founders in 2026?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Without structured schema, AI web crawlers often misinterpret software pricing tiers, operating systems, or core capabilities. Providing an explicit SoftwareApplication JSON-LD schema delivers clean, authoritative entities directly to the search engine index, drastically increasing the likelihood of being cited when potential buyers ask for software recommendations.'
                }
            },
            {
                '@type': 'Question',
                name: 'How do you install generated JSON-LD in Next.js App Router?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'In Next.js 13+ App Router, define your schema as a JavaScript object in your layout.js or page.js file, then render it inside a script tag with type="application/ld+json" and dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}.'
                }
            },
            {
                '@type': 'Question',
                name: 'How does LaunchXact help with semantic AI search visibility?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'LaunchXact operates as a curated multi-vendor SaaS marketplace featuring an integrated AI semantic search system (The Tornado). High-value software accepted into the Genesis Batch is indexed immediately into this semantic engine and showcased to over 350,000 tech buyers and adopters.'
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
                name: 'GEO & Schema Snippet Generator',
                item: 'https://www.launchxact.com/tools/geo-schema-snippet-generator'
            }
        ]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
            <main style={{ minHeight: '80vh', paddingTop: '7rem', paddingBottom: '6rem' }}>
                <GeoSchemaGenerator />
            </main>
        </>
    );
}
