import Link from 'next/link';
import styles from './tools.module.css';

export const metadata = {
    title: 'Free Founder & SaaS Traffic Generation Tools | LaunchXact',
    description: 'Free calculators, schema generators, and distribution frameworks engineered to help indie founders scale revenue, streamline global tax, and optimize launch visibility.',
    alternates: {
        canonical: '/tools',
    },
};

export default function ToolsHubPage() {
    const tools = [
        {
            id: 'true-cost-of-payments',
            title: 'The "True Cost of Payments" Simulator',
            description: 'Calculate the hidden financial fees, international VAT/GST overhead, and hours lost per month on manual tax compliance compared to a flat Merchant of Record fee.',
            icon: '💸',
            status: 'Live MVP',
            isLive: true,
            href: '/tools/true-cost-of-payments',
        },
        {
            id: 'franken-stack-cost-forecaster',
            title: 'The "Franken-Stack" Cost Forecaster',
            description: 'Forecast infrastructure and DevOps costs as you scale from 0 to 10k+ Monthly Active Users across fragmented cloud services.',
            icon: '⚡',
            status: 'Building Next',
            isLive: false,
            href: '#',
        },
        {
            id: 'pre-launch-distribution-architect',
            title: 'The Pre-Launch Distribution Architect',
            description: 'Reverse-engineer a tactical, day-by-day launch timeline (D-30, D-14, D-3) to build hype and gather beta adopters before launch day.',
            icon: '🎯',
            status: 'Planned',
            isLive: false,
            href: '#',
        },
        {
            id: 'geo-schema-snippet-generator',
            title: 'GEO & Schema Snippet Generator',
            description: 'Automatically generate optimized JSON-LD schema markup tailored for Generative Engine Optimization (GEO) and AI search engines.',
            icon: '🤖',
            status: 'Planned',
            isLive: false,
            href: '#',
        },
    ];

    return (
        <main style={{ minHeight: '80vh', paddingTop: '7rem', paddingBottom: '6rem' }}>
            <div className={styles.container}>
                <header className={styles.header}>
                    <span className={styles.badge}>✦ High Traffic Tools Suite</span>
                    <h1 className={styles.title}>
                        Engineering-Led Growth Tools for <span style={{ color: '#7c3aed' }}>SaaS Founders</span>
                    </h1>
                    <p className={styles.subtitle}>
                        Free interactive calculators, cost simulators, and distribution engines built to eliminate founder friction and accelerate launch traction.
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
                                    {t.isLive ? 'Launch Simulator →' : 'In Development'}
                                </div>
                            </CardWrapper>
                        );
                    })}
                </div>
            </div>
        </main>
    );
}
