import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
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
                        <span className={styles.badge}>✦ High Traffic Tools Suite</span>
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
                </div>
            </main>
        </>
    );
}
