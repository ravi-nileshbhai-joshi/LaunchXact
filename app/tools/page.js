import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import ToolSocialProof from '@/components/tools/ToolSocialProof';
import styles from './tools.module.css';

export const metadata = {
    title: 'Founder Toolkit: Free SaaS Calculators & Growth Engines',
    description: 'Free calculators, AI landing page graders, schema generators, and distribution frameworks engineered to help indie founders scale revenue, audit conversion, and streamline global tax.',
    alternates: {
        canonical: '/tools',
    },
    openGraph: {
        title: 'Founder Toolkit: Free SaaS Calculators & Growth Engines | LaunchXact',
        description: 'Free AI graders, payment simulators, and distribution engines built to eliminate founder friction and accelerate launch traction.',
        url: 'https://www.launchxact.com/tools',
        type: 'website',
    },
};

export default function ToolsHubPage() {
    const tools = [
        {
            id: 'saas-readiness-grader',
            title: 'SaaS Launch Readiness Grader',
            description: 'AI-powered audit for your SaaS landing page. Evaluates conversion psychology, trust signals, headline hooks, and buyer friction with actionable recommendations.',
            icon: '🎯',
            status: 'Live MVP',
            isLive: true,
            href: '/grade',
            actionText: 'Grade Your SaaS Now →',
        },
        {
            id: 'true-cost-of-payments',
            title: 'The "True Cost of Payments" Simulator',
            description: 'Calculate the hidden financial fees, international VAT/GST overhead, and hours lost per month on manual tax compliance compared to a flat Merchant of Record fee.',
            icon: '💸',
            status: 'Live MVP',
            isLive: true,
            href: '/tools/true-cost-of-payments',
            actionText: 'Launch Simulator →',
        },
        {
            id: 'franken-stack-cost-forecaster',
            title: 'The "Franken-Stack" Cost Forecaster',
            description: 'Forecast infrastructure, database, and auth costs as your indie SaaS scales from 500 to 50k MAU across fragmented cloud services.',
            icon: '⚡',
            status: 'Live MVP',
            isLive: true,
            href: '/tools/franken-stack-cost-forecaster',
            actionText: 'Forecast Stack Cost →',
        },
        {
            id: 'pre-launch-distribution-architect',
            title: 'The Pre-Launch Distribution Architect',
            description: 'Reverse-engineer a tactical, day-by-day launch timeline (D-30, D-14, D-7, Launch Day) to seed niche communities and build hyper-targeted beta hype.',
            icon: '🚀',
            status: 'Live MVP',
            isLive: true,
            href: '/tools/pre-launch-distribution-architect',
            actionText: 'Build Launch Timeline →',
        },
        {
            id: 'geo-schema-snippet-generator',
            title: 'GEO & Schema Snippet Generator',
            description: 'Automatically generate optimized JSON-LD schema markup tailored for Generative Engine Optimization (GEO) and AI search engines.',
            icon: '🤖',
            status: 'Live MVP',
            isLive: true,
            href: '/tools/geo-schema-snippet-generator',
            actionText: 'Generate Schema Markup →',
        },
        {
            id: 'distribution-agent',
            title: 'Autonomous AI Distribution Agent',
            description: 'Automated multi-channel growth engine. Generates non-repetitive, problem-to-solution posts across X, LinkedIn, and Indie Hackers with embedded telemetry.',
            icon: '📡',
            status: 'New Engine',
            isLive: true,
            href: '/tools/distribution-agent',
            actionText: 'Launch Distribution Agent →',
        },
        {
            id: 'auto-blog-generator',
            title: 'Autonomous Auto Blog & SEO Traffic Engine',
            description: 'Crawl your SaaS website, generate deeply researched human-voice SEO/GEO articles that rank on Google and AI search engines, and publish to your CMS in 1 click.',
            icon: '✍️',
            status: '$79/mo · 2 Mo Free w/ Fast-Track',
            isLive: true,
            href: '/tools/auto-blog-generator',
            actionText: 'Open Blog Generator →',
        },
        {
            id: 'lifecycle-preview',
            title: '5-Email Automated Qualification Funnel',
            description: 'Automated 14-day founder qualification sequence. Turns AI SaaS audits into a high-converting drip funnel that delivers scores, teaches weaknesses, and drives Genesis applications.',
            icon: '📬',
            status: 'Automated Engine',
            isLive: true,
            href: '/tools/lifecycle-preview',
            actionText: 'Explore Lifecycle Funnel →',
        },
    ];

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'LaunchXact Free SaaS & Founder Growth Tools',
        url: 'https://www.launchxact.com/tools',
        isPartOf: {
            '@type': 'WebSite',
            '@id': 'https://www.launchxact.com/#website'
        },
        description: 'Collection of free engineering-led growth tools for SaaS founders, including landing page graders and payment cost simulators.',
        mainEntity: {
            '@type': 'ItemList',
            itemListElement: tools.map((tool, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: tool.title,
                description: tool.description,
                url: tool.isLive ? `https://www.launchxact.com${tool.href}` : undefined,
            })),
        },
    };

    const breadcrumbJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://www.launchxact.com',
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: 'Founder Tools',
                item: 'https://www.launchxact.com/tools',
            },
        ],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
            <main style={{ minHeight: '80vh', paddingTop: '7rem', paddingBottom: '6rem' }}>
                <div className={styles.container}>
                    <Breadcrumb items={[{ label: 'Founder Tools' }]} />
                    <header className={styles.header}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem', flexWrap: 'wrap' }}>
                            <span className={styles.badge}>✦ High Traffic Tools Suite</span>
                            <Link
                                href="/tools/analytics"
                                style={{
                                    fontSize: '0.78rem',
                                    fontWeight: 700,
                                    color: '#818cf8',
                                    textDecoration: 'none',
                                    background: 'rgba(99, 102, 241, 0.12)',
                                    border: '1px solid rgba(99, 102, 241, 0.3)',
                                    padding: '4px 12px',
                                    borderRadius: '9999px',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                }}
                            >
                                <span style={{ width: '6px', height: '6px', background: '#22c55e', borderRadius: '50%', boxShadow: '0 0 6px #22c55e' }} />
                                Live Funnel Telemetry &amp; Breakdown →
                            </Link>
                        </div>
                        <h1 className={styles.title}>
                            Engineering-Led Growth Tools for <span style={{ color: '#7c3aed' }}>SaaS Founders</span>
                        </h1>
                        <p className={styles.subtitle}>
                            Free interactive calculators, AI landing page graders, and distribution engines built to eliminate founder friction and accelerate launch traction.
                        </p>
                    </header>

                    <div className={styles.grid}>
                        {tools.map((t) => {
                            const CardWrapper = t.isLive ? Link : 'div';
                            return (
                                <CardWrapper
                                    key={t.id}
                                    href={t.isLive ? t.href : undefined}
                                    className={`${styles.toolCard} ${!t.isLive ? styles.toolCardDisabled : ''}`}
                                >
                                    <div>
                                        <div className={styles.cardTop}>
                                            <div className={styles.iconWrap}>{t.icon}</div>
                                            <span className={t.isLive ? styles.statusLive : styles.statusComingSoon}>
                                                {t.status}
                                            </span>
                                        </div>
                                        <h2 className={styles.cardTitle}>{t.title}</h2>
                                        <p className={styles.cardDesc}>{t.description}</p>
                                    </div>
                                    <div className={styles.cardAction}>
                                        {t.actionText}
                                    </div>
                                </CardWrapper>
                            );
                        })}
                    </div>

                    {/* Live Benchmarks & Verified Founder Testimonials */}
                    <ToolSocialProof />
                </div>
            </main>
        </>
    );
}
