'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './ToolSocialProof.module.css';

export default function ToolSocialProof({ showTickerOnly = false, toolId = 'tool-social-proof' }) {
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
                        <span> Completed architecture &amp; distribution audit</span>
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
                    <div className={styles.benchmarkSub}>Across tax, fees &amp; cloud subscriptions</div>
                </div>

                <div className={styles.benchmarkCard}>
                    <div className={styles.benchmarkValue}>
                        {stats.totalAudits.toLocaleString()}+
                    </div>
                    <div className={styles.benchmarkLabel}>SaaS Simulations Run</div>
                    <div className={styles.benchmarkSub}>By technical founders &amp; indie builders</div>
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

            {/* Bridge to Founding 50 */}
            {!showTickerOnly && (
                <div className={styles.foundingBridge}>
                    <div className={styles.foundingBridgeContent}>
                        <span className={styles.foundingBridgeBadge}>🏅 Founding Collection</span>
                        <h3 className={styles.foundingBridgeTitle}>
                            From Diagnostics to the <span className={styles.gradientAccent}>Founding 50</span>
                        </h3>
                        <p className={styles.foundingBridgeDesc}>
                            We&apos;re hand-selecting the first 50 exceptional SaaS products for LaunchXact&apos;s permanent founding collection. Every product is reviewed by hand. Free permanent listing, dedicated editorial setup, and zero recurring fees.
                        </p>
                    </div>
                    <Link href={`/#founder-form?source=${encodeURIComponent(toolId)}`} className={styles.foundingBridgeBtn}>
                        🚀 Apply for Founding 50 Selection →
                    </Link>
                </div>
            )}
        </section>
    );
}
