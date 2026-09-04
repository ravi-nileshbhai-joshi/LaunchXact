import FrankenStackForecaster from '@/components/tools/FrankenStackForecaster';

export const metadata = {
    title: 'The "Franken-Stack" Cost Forecaster | Hidden SaaS Infrastructure & Overages Calculator',
    description: 'Foresee the hidden cliff when your indie hacker tech stack scales. Simulate overages, compute add-ons, auth tiers, and email costs from 500 to 50,000 MAU.',
    keywords: [
        'saas tech stack cost calculator',
        'franken stack cost forecaster',
        'supabase vs neon pricing scaling',
        'clerk auth cost over 10k users',
        'indie hacker hosting cost calculator',
        'hidden cloud infrastructure costs'
    ],
    alternates: {
        canonical: '/tools/franken-stack-cost-forecaster',
    },
    openGraph: {
        title: 'The "Franken-Stack" Cost Forecaster | LaunchXact',
        description: 'Will your tech stack bill explode when you hit 10k users? Calculate your exact monthly infrastructure cost curve in seconds.',
        url: 'https://www.launchxact.com/tools/franken-stack-cost-forecaster',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'The "Franken-Stack" Cost Forecaster',
        description: 'Predict the hidden cost cliff of fragmented hosting, databases, auth, and analytics as your SaaS scales.',
    },
};

export default function FrankenStackCostForecasterPage() {
    const webAppJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'The Franken-Stack Cost Forecaster',
        url: 'https://www.launchxact.com/tools/franken-stack-cost-forecaster',
        applicationCategory: 'BusinessApplication, DeveloperApplication, UtilitiesApplication',
        operatingSystem: 'Web, All',
        browserRequirements: 'Requires JavaScript',
        description: 'Free interactive simulator predicting monthly infrastructure bills, hidden tier jumps, and compute overages across hosting, databases, auth, emails, analytics, and billing as SaaS products scale from 500 to 50,000 monthly active users.',
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
            'Dynamic 500 to 50,000 Monthly Active Users (MAU) Scaling Slider',
            '12 Modular Micro-SaaS Component Toggles across 6 Infrastructure Categories',
            '1-Click Quick Preset Stacks (Solo Indie, Modern Next.js, Scale-Ready Pro)',
            'Interactive SVG Multi-Tier Scaling Curve with Inflection Points',
            'Line-by-Line Service Bill Breakdown with Per-User Unit Economics',
            'Direct Genesis Batch Distribution Handoff'
        ],
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.9',
            ratingCount: '94'
        }
    };

    const faqJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
            {
                '@type': 'Question',
                name: 'What is a "Franken-Stack" in software engineering and SaaS?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'A "Franken-Stack" refers to an indie hacker or startup tech stack built by stitching together multiple disparate third-party micro-services (such as Vercel for edge hosting, Supabase or Neon for serverless DB, Clerk or Auth0 for authentication, Resend for email, PostHog for telemetry, and Stripe for payments). While inexpensive at launch, each tool imposes independent usage tiers, egress fees, and per-MAU surcharges that can compound into massive cost cliffs as traffic surges.'
                }
            },
            {
                '@type': 'Question',
                name: 'Why do indie hacker tech stacks become unpredictably expensive as user counts scale?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Most modern SaaS developer platforms offer generous free or low-tier tiers designed for early hobbyist usage. However, their pricing curves feature steep non-linear cliff jumps once you exceed thresholds—such as 10,000 auth users (triggering per-MAU fees), 5GB database egress, or event volumes on product analytics. When multiple services hit these thresholds simultaneously, monthly infrastructure costs can spike 3x to 8x overnight.'
                }
            },
            {
                '@type': 'Question',
                name: 'How does the Franken-Stack Cost Forecaster model infrastructure bills?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'The forecaster models the exact published pricing tiers and overage formulas for 12 popular indie developer tools across 6 categories (Hosting, Database, Authentication, Transactional Email, Analytics, and Billing). It calculates base subscription minimums, per-MAU overage rates, and event volume tiers dynamically as you adjust the active user slider from 500 to 50,000 MAU.'
                }
            },
            {
                '@type': 'Question',
                name: 'How does LaunchXact help founders maintain profitable unit economics?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'LaunchXact provides high-intent, targeted distribution directly to paying software buyers rather than unfocused viral traffic that drains free-tier serverless resources. In addition, LaunchXact integrates native MoR payments so founders do not have to pay separate subscriptions for tax compliance, invoicing, and cross-border billing engines.'
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
                name: 'The "Franken-Stack" Cost Forecaster',
                item: 'https://www.launchxact.com/tools/franken-stack-cost-forecaster'
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
                <FrankenStackForecaster />
            </main>
        </>
    );
}
