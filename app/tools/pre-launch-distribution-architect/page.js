import DistributionArchitect from '@/components/tools/DistributionArchitect';
import Breadcrumb from '@/components/Breadcrumb';

export const metadata = {
    title: 'Pre-Launch Distribution Architect: SaaS Launch Playbook',
    description: 'Reverse-engineer a tactical, day-by-day SaaS launch strategy (D-30, D-14, D-7, Launch Day). Curated distribution channels, viral copy hooks, and interactive checklists for indie founders.',
    keywords: [
        'saas launch checklist',
        'pre launch distribution architect',
        'how to launch a saas product',
        'indie hacker launch strategy',
        'show hn launch playbook',
        'saas waitlist marketing strategy'
    ],
    alternates: {
        canonical: '/tools/pre-launch-distribution-architect',
    },
    openGraph: {
        title: 'The Pre-Launch Distribution Architect | LaunchXact',
        description: 'Never launch to crickets. Generate your custom day-by-day distribution timeline, viral social hooks, and curated channel roadmap.',
        url: 'https://www.launchxact.com/tools/pre-launch-distribution-architect',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'The Pre-Launch Distribution Architect | LaunchXact',
        description: 'Actionable day-by-day pre-launch distribution timeline for devtools, B2B SaaS, and AI apps.',
    },
};

export default function PreLaunchDistributionArchitectPage() {
    const webAppJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'The Pre-Launch Distribution Architect',
        url: 'https://www.launchxact.com/tools/pre-launch-distribution-architect',
        isPartOf: {
            '@type': 'WebSite',
            '@id': 'https://www.launchxact.com/#website'
        },
        applicationCategory: 'BusinessApplication, MarketingApplication, UtilitiesApplication',
        operatingSystem: 'Web, All',
        browserRequirements: 'Requires JavaScript',
        description: 'Free interactive launch planning engine that reverse-engineers a day-by-day distribution timeline (D-30, D-14, D-7, Launch Day, D+7) with curated channels, viral copy hooks, and interactive milestone trackers for SaaS founders.',
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
            'Dynamic Category Adaptation (DevTools, B2B SaaS, AI Apps, Creator Tools)',
            'Stage-Specific Timeline Tailoring (Ideation, Alpha Development, Launch-Ready Beta)',
            'Day-by-Day Tactical Countdown Roadmap (D-30, D-14, D-7, Launch Day, D+7)',
            'Curated Distribution Nodes (Subreddits, Discords, GitHub Discussions, Hacker News)',
            'Viral "Steal This Hook" Copy Templates with 1-Click Clipboard Copy',
            'Interactive Milestone Checklist with Real-Time Launch Momentum Meter',
            '1-Click Exportable Markdown Launch Roadmap for Notion and Linear',
            'Direct Genesis Batch Distribution Handoff'
        ],
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.9',
            ratingCount: '112'
        }
    };

    const faqJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
            {
                '@type': 'Question',
                name: 'Why do most indie SaaS launches fail on launch day?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Most SaaS launches fail because founders build in complete isolation without building an audience, validating pain points, or priming niche communities beforehand. Dropping a link on launch day to zero expectant users yields minimal traffic that fades within 24 hours. A structured 30-day pre-launch timeline ensures hundreds of warm prospective users are waiting on day one.'
                }
            },
            {
                '@type': 'Question',
                name: 'What is the D-30 to D-7 SaaS pre-launch distribution framework?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'The framework maps out pre-launch actions by phase: D-30 focuses on shadow community listening and discovering unresolved complaints in competitor forums; D-14 centers on build-in-public benchmark drops and waitlist capture; D-7 activates VIP beta testers with direct Loom walk-throughs; and Launch Day orchestrates coordinated surges across communities, Hacker News, Product Hunt, and LaunchXact.'
                }
            },
            {
                '@type': 'Question',
                name: 'How do you export the generated distribution roadmap?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Founders can click the "Export Roadmap" button in the momentum score HUD to copy a clean, markdown-formatted roadmap containing all phases, channels, checked action items, and social hooks. This can be pasted directly into project management tools like Notion, Linear, Obsidian, or GitHub Projects.'
                }
            },
            {
                '@type': 'Question',
                name: 'How does LaunchXact provide day-one SaaS distribution?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'LaunchXact operates as a curated multi-vendor marketplace showcasing software products to over 350,000 targeted buyers and early adopters. Accepted founders in the Genesis Batch gain long-term visibility in The Vault and AI semantic search indexing without paying upfront listing fees or high ad spend.'
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
                name: 'The Pre-Launch Distribution Architect',
                item: 'https://www.launchxact.com/tools/pre-launch-distribution-architect'
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
                <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
                    <Breadcrumb items={[
                        { label: 'Founder Tools', href: '/tools' },
                        { label: 'Pre-Launch Distribution Architect' }
                    ]} />
                </div>
                <DistributionArchitect />
            </main>
        </>
    );
}
