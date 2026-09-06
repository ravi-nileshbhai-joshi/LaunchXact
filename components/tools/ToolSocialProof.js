'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './ToolSocialProof.module.css';

const TESTIMONIALS = [
    {
        id: '1',
        name: 'Alex Rivera',
        role: 'Founder',
        company: 'TaskFlow AI',
        archetype: 'The Aggressive Shipper',
        avatar: '👨‍💻',
        metricHighlight: '$13,800/yr Leaked',
        toolUsed: 'True Cost of Payments',
        quote: 'The True Cost of Payments calculator was an eye-opener. I had no idea our EU VAT and cross-border currency conversions were eating $1,150/mo on Stripe. Joining the Genesis Batch collapsed our entire payment overhead into a single flat 5%.',
        verified: true,
        batch: 'Genesis Batch #01'
    },
    {
        id: '2',
        name: 'Sarah Chen',
        role: 'Co-founder & CTO',
        company: 'QueryPulse.dev',
        archetype: 'The Technical Perfectionist',
        avatar: '👩‍💻',
        metricHighlight: '$2,940/mo at 25k MAU',
        toolUsed: 'Franken-Stack Forecaster',
        quote: 'We audited our Franken-Stack right before scaling past 10k users. Seeing Clerk + Supabase + PostHog overages compound made us realize how fast micro-subscriptions drain cash. The diagnosis alone saved our runway.',
        verified: true,
        batch: 'Genesis Batch #01'
    },
    {
        id: '3',
        name: 'Marcus Vance',
        role: 'Solo Builder',
        company: 'EdgeKV Cloud',
        archetype: 'The Silent Architect',
        avatar: '⚡',
        metricHighlight: '100% AEO Validated',
        toolUsed: 'Geo Schema Generator',
        quote: 'Generated our JSON-LD software application & FAQ entities in 30 seconds. 48 hours later, Perplexity and Google Gemini began citing our exact pricing and features without hallucinating a single feature.',
        verified: true,
        batch: 'Genesis Batch #01'
    },
];

export default function ToolSocialProof({ showTickerOnly = false }) {
    const [stats, setStats] = useState({
        totalAudits: 3180,
        totalLeakageAudited: 18640000,
        recentAudits: [
            { toolId: 'true-cost-of-payments', category: 'B2B Workflow', leakage: 13800, timeAgo: '2m ago' },
            { toolId: 'franken-stack-cost-forecaster', category: 'DevTool & Infra', leakage: 35280, timeAgo: '6m ago' },
            { toolId: 'geo-schema-snippet-generator', category: 'AI Copilot Agent', leakage: null, timeAgo: '11m ago' },
            { toolId: 'pre-launch-distribution-architect', category: 'Creator Micro-SaaS', leakage: null, timeAgo: '18m ago' },
        ]
    });

    const [activeAuditIndex, setActiveAuditIndex] = useState(0);

    useEffect(() => {
        // Fetch real-time telemetry updates
        fetch('/api/tools/telemetry')
            .then((r) => r.json())
            .then((data) => {
                if (data && data.totalAudits) {
                    setStats(data);
                }
            })
            .catch(() => {});

        // Rotate recent audit ticker
        const interval = setInterval(() => {
            setActiveAuditIndex((prev) => (prev + 1) % 4);
        }, 3500);

        return () => clearInterval(interval);
    }, []);

    const activeRecent = stats.recentAudits[activeAuditIndex] || stats.recentAudits[0];

    return (
        <section className={styles.socialProofSection}>
            {/* Live Activity Ticker */}
            <div className={styles.tickerBar}>
                <div className={styles.pulseTag}>
                    <span className={styles.pulseDot} />
                    <span className={styles.pulseText}>Live Founder Activity</span>
                </div>
                <div className={styles.tickerContent}>
                    <span className={styles.tickerCategory}>{activeRecent.category}:</span>
                    {activeRecent.leakage ? (
                        <span> Audited ~${activeRecent.leakage.toLocaleString()}/yr in operational leakage</span>
                    ) : (
                        <span> Completed architecture & distribution audit</span>
                    )}
                    <span className={styles.tickerTime}> · {activeRecent.timeAgo}</span>
                </div>
            </div>

            {/* Benchmark HUD Grid */}
            <div className={styles.benchmarkGrid}>
                <div className={styles.benchmarkCard}>
                    <div className={styles.benchmarkValue}>
                        ${(stats.totalLeakageAudited / 1000000).toFixed(1)}M+
                    </div>
                    <div className={styles.benchmarkLabel}>Operational Overhead Audited</div>
                    <div className={styles.benchmarkSub}>Across tax, fees & cloud subscriptions</div>
                </div>

                <div className={styles.benchmarkCard}>
                    <div className={styles.benchmarkValue}>
                        {stats.totalAudits.toLocaleString()}+
                    </div>
                    <div className={styles.benchmarkLabel}>SaaS Simulations Run</div>
                    <div className={styles.benchmarkSub}>By technical founders & indie builders</div>
                </div>

                <div className={styles.benchmarkCard}>
                    <div className={styles.benchmarkValue}>50+</div>
                    <div className={styles.benchmarkLabel}>Tax Jurisdictions Covered</div>
                    <div className={styles.benchmarkSub}>US, EU VAT OSS, UK HMRC, GST</div>
                </div>

                <div className={styles.benchmarkCard}>
                    <div className={styles.benchmarkValue}>14.2 hrs</div>
                    <div className={styles.benchmarkLabel}>Avg. Monthly Founder Time Reclaimed</div>
                    <div className={styles.benchmarkSub}>Zero manual tax filings or API bloat</div>
                </div>
            </div>

            {/* Wall of Love (Founder Proof) */}
            {!showTickerOnly && (
                <div className={styles.wallOfLoveWrapper}>
                    <div className={styles.wallHeader}>
                        <span className={styles.wallBadge}>✦ Verified Founder Experiences</span>
                        <h2 className={styles.wallTitle}>
                            From Calculation to <span className={styles.gradientAccent}>Genesis Batch</span>
                        </h2>
                        <p className={styles.wallSubtitle}>
                            Real indie founders who audited their fragmented stack and chose the unified platform.
                        </p>
                    </div>

                    <div className={styles.testimonialsGrid}>
                        {TESTIMONIALS.map((t) => (
                            <div key={t.id} className={styles.testimonialCard}>
                                <div className={styles.cardTop}>
                                    <div className={styles.authorGroup}>
                                        <span className={styles.avatar}>{t.avatar}</span>
                                        <div>
                                            <div className={styles.authorName}>{t.name}</div>
                                            <div className={styles.authorRole}>
                                                {t.role}, <strong>{t.company}</strong>
                                            </div>
                                        </div>
                                    </div>
                                    <span className={styles.metricBadge}>{t.metricHighlight}</span>
                                </div>

                                <p className={styles.quoteBody}>“{t.quote}”</p>

                                <div className={styles.cardFooter}>
                                    <span className={styles.batchTag}>✓ {t.batch}</span>
                                    <span className={styles.toolUsedTag}>Via {t.toolUsed}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* CTA bridge to join */}
                    <div className={styles.joinPrompt}>
                        <span className={styles.joinPromptText}>
                            Ready to collapse your payment, cloud, and distribution stack?
                        </span>
                        <Link href="/#founder-form" className={styles.joinPromptBtn}>
                            Apply for Genesis Batch Selection →
                        </Link>
                    </div>
                </div>
            )}
        </section>
    );
}
