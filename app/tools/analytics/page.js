'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import styles from './analytics.module.css';

const TOOLS = [
    { id: 'all', name: 'All Tools Combined' },
    { id: 'true-cost-of-payments', name: '💸 True Cost of Payments Simulator' },
    { id: 'franken-stack-cost-forecaster', name: '⚡ Franken-Stack Cost Forecaster' },
    { id: 'pre-launch-distribution-architect', name: '🚀 Pre-Launch Distribution Architect' },
    { id: 'geo-schema-snippet-generator', name: '🤖 GEO & AI Schema Generator' },
    { id: 'ai-saas-grader', name: '🎯 AI SaaS Readiness Grader' },
];

const UTM_SOURCES = [
    { id: 'all', name: 'All Traffic Channels' },
    { id: 'x_twitter', name: '𝕏 / Twitter' },
    { id: 'reddit', name: 'Reddit' },
    { id: 'linkedin', name: 'LinkedIn' },
    { id: 'viral_share', name: 'Founder Viral Referrals' },
    { id: 'direct', name: 'Direct / Organic' },
];

export default function FunnelAnalyticsPage() {
    const [selectedTool, setSelectedTool] = useState('all');
    const [selectedUtm, setSelectedUtm] = useState('all');
    const [funnelData, setFunnelData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [autoRefresh, setAutoRefresh] = useState(true);

    const fetchFunnelData = async () => {
        try {
            const queryParams = new URLSearchParams();
            if (selectedTool !== 'all') queryParams.set('toolId', selectedTool);
            if (selectedUtm !== 'all') queryParams.set('utmSource', selectedUtm);

            const res = await fetch(`/api/analytics/funnel?${queryParams.toString()}`);
            const data = await res.json();
            setFunnelData(data);
        } catch (err) {
            console.error('Failed to load funnel analytics:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setLoading(true);
        fetchFunnelData();
    }, [selectedTool, selectedUtm]);

    // Live auto-refresh every 12 seconds
    useEffect(() => {
        if (!autoRefresh) return;
        const interval = setInterval(() => {
            fetchFunnelData();
        }, 12000);
        return () => clearInterval(interval);
    }, [autoRefresh, selectedTool, selectedUtm]);

    const maxCount = funnelData?.funnelSteps
        ? Math.max(...funnelData.funnelSteps.map((s) => s.count), 1)
        : 1;

    return (
        <main className={styles.page}>
            <div className={styles.container}>
                <Breadcrumb items={[
                    { label: 'Founder Tools', href: '/tools' },
                    { label: 'Acquisition Telemetry & Funnel Breakdown' }
                ]} />

                {/* Dashboard Header */}
                <header className={styles.header}>
                    <div className={styles.headerTop}>
                        <span className={styles.badge}>✦ Acquisition Telemetry Engine</span>
                        <div className={styles.liveIndicator}>
                            <span className={styles.livePulse} />
                            <span>Live Telemetry Active</span>
                        </div>
                    </div>

                    <h1 className={styles.title}>
                        Full-Funnel Acquisition &amp; <span className={styles.gradientAccent}>Drop-Off Breakdown</span>
                    </h1>
                    <p className={styles.subtitle}>
                        Real-time visitor tracking across all 8 acquisition stages. Pinpoint exactly where the funnel breaks, discover channel-specific conversion leakage, and track viral referral loops.
                    </p>

                    {/* Filter Controls Row */}
                    <div className={styles.filtersBar}>
                        <div className={styles.filterGroup}>
                            <label className={styles.filterLabel}>Filter by Tool:</label>
                            <select
                                value={selectedTool}
                                onChange={(e) => setSelectedTool(e.target.value)}
                                className={styles.select}
                            >
                                {TOOLS.map((t) => (
                                    <option key={t.id} value={t.id}>{t.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.filterGroup}>
                            <label className={styles.filterLabel}>Filter by Traffic Source:</label>
                            <select
                                value={selectedUtm}
                                onChange={(e) => setSelectedUtm(e.target.value)}
                                className={styles.select}
                            >
                                {UTM_SOURCES.map((u) => (
                                    <option key={u.id} value={u.id}>{u.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.refreshToggle}>
                            <button
                                type="button"
                                onClick={() => fetchFunnelData()}
                                className={styles.btnRefresh}
                            >
                                ⟳ Refresh
                            </button>
                            <label className={styles.autoRefreshLabel}>
                                <input
                                    type="checkbox"
                                    checked={autoRefresh}
                                    onChange={(e) => setAutoRefresh(e.target.checked)}
                                />
                                <span>Auto-refresh</span>
                            </label>
                        </div>
                    </div>
                </header>

                {/* TOP METRIC CARDS */}
                <div className={styles.kpiGrid}>
                    <div className={styles.kpiCard}>
                        <span className={styles.kpiLabel}>Total Landing Views</span>
                        <div className={styles.kpiValue}>
                            {loading ? '...' : (funnelData?.totalVisitors || 0).toLocaleString()}
                        </div>
                        <span className={styles.kpiSub}>Top of Funnel</span>
                    </div>

                    <div className={styles.kpiCard}>
                        <span className={styles.kpiLabel}>Emails Captured (After Value)</span>
                        <div className={styles.kpiValue} style={{ color: '#818cf8' }}>
                            {loading ? '...' : (funnelData?.totalLeadsCaptured || 0).toLocaleString()}
                        </div>
                        <span className={styles.kpiSub}>
                            {funnelData?.totalVisitors ? Math.round((funnelData.totalLeadsCaptured / funnelData.totalVisitors) * 100) : 0}% Visitor Conversion
                        </span>
                    </div>

                    <div className={styles.kpiCard}>
                        <span className={styles.kpiLabel}>Genesis Applications</span>
                        <div className={styles.kpiValue} style={{ color: '#4ade80' }}>
                            {loading ? '...' : (funnelData?.totalApplications || 0).toLocaleString()}
                        </div>
                        <span className={styles.kpiSub}>Bottom of Funnel (Cohort Candidates)</span>
                    </div>

                    <div className={styles.kpiCard}>
                        <span className={styles.kpiLabel}>Primary Bottleneck Drop</span>
                        <div className={styles.kpiValue} style={{ color: '#f87171' }}>
                            {loading ? '...' : `${funnelData?.bottleneck?.dropOffRate || 0}%`}
                        </div>
                        <span className={styles.kpiSub}>Where the funnel breaks</span>
                    </div>
                </div>

                {/* BOTTLENECK RADAR ALERT: WHERE THE FUNNEL BREAKS */}
                {funnelData?.bottleneck && (
                    <section className={styles.bottleneckRadar}>
                        <div className={styles.radarHeader}>
                            <span className={styles.radarIcon}>🚨</span>
                            <div>
                                <span className={styles.radarBadge}>Single Largest Funnel Leakage Point</span>
                                <h2 className={styles.radarTitle}>
                                    The Funnel Breaks at: <span style={{ color: '#f87171' }}>{funnelData.bottleneck.bottleneckStage}</span> ({funnelData.bottleneck.dropOffRate}% Drop-off)
                                </h2>
                            </div>
                        </div>

                        <p className={styles.radarVerdict}>
                            {funnelData.bottleneck.verdict} Approximately <strong>{funnelData.bottleneck.lostVisitors.toLocaleString()} potential founders</strong> exited without completing this transition.
                        </p>

                        <div className={styles.fixRecommendation}>
                            <span className={styles.fixLabel}>💡 Tactical Growth Fix:</span>
                            <p className={styles.fixText}>{funnelData.bottleneck.actionableFix}</p>
                        </div>
                    </section>
                )}

                {/* 8-STAGE FUNNEL WATERFALL */}
                <section className={styles.waterfallSection}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>The 8-Stage Visitor Conversion Waterfall</h2>
                        <span className={styles.sectionSub}>Normalized against initial landing views</span>
                    </div>

                    <div className={styles.waterfallList}>
                        {funnelData?.funnelSteps?.map((step, idx) => {
                            const barWidth = Math.max(8, Math.round((step.count / maxCount) * 100));
                            return (
                                <div key={step.key} className={styles.waterfallRow}>
                                    <div className={styles.stepMeta}>
                                        <div className={styles.stepNumberBadge}>{idx + 1}</div>
                                        <div>
                                            <div className={styles.stepName}>{step.name}</div>
                                            <div className={styles.stepDesc}>{step.description}</div>
                                        </div>
                                    </div>

                                    <div className={styles.barArea}>
                                        <div className={styles.barTrack}>
                                            <div
                                                className={styles.barFill}
                                                style={{ width: `${barWidth}%` }}
                                            >
                                                <span className={styles.barCountLabel}>
                                                    {step.count.toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={styles.conversionPctCol}>
                                        <span className={styles.conversionBigVal}>{step.overallConversionPct}%</span>
                                        <span className={styles.conversionSub}>of Total</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* STAGE-TO-STAGE TRANSITIONS & DROP-OFFS */}
                <section className={styles.transitionsSection}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Stage-to-Stage Transition Velocity &amp; Drop-Off Rates</h2>
                        <span className={styles.sectionSub}>Loss rate between sequential actions</span>
                    </div>

                    <div className={styles.transitionsGrid}>
                        {funnelData?.transitions?.map((t, i) => {
                            const isWorst = t.dropOffRate === funnelData?.bottleneck?.dropOffRate;
                            return (
                                <div
                                    key={i}
                                    className={`${styles.transitionCard} ${isWorst ? styles.transitionCardWorst : ''}`}
                                >
                                    {isWorst && (
                                        <div className={styles.worstPill}>🚨 WORST DROP-OFF</div>
                                    )}
                                    <h3 className={styles.transitionLabel}>{t.label}</h3>
                                    
                                    <div className={styles.transitionMetricsRow}>
                                        <div>
                                            <span className={styles.transitionValLabel}>Converted</span>
                                            <div className={styles.conversionRateVal}>
                                                {t.conversionRate}%
                                            </div>
                                        </div>
                                        <div>
                                            <span className={styles.transitionValLabel}>Dropped Off</span>
                                            <div className={`${styles.dropOffRateVal} ${isWorst ? styles.dropWorstText : ''}`}>
                                                {t.dropOffRate}%
                                            </div>
                                        </div>
                                    </div>

                                    <div className={styles.volumeRow}>
                                        <span>{t.fromCount.toLocaleString()} entered</span>
                                        <span>→</span>
                                        <span>{t.toCount.toLocaleString()} passed</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* CHANNEL ATTRIBUTION BREAKDOWN */}
                <div className={styles.attributionGrid}>
                    <section className={styles.channelsCard}>
                        <h3 className={styles.cardHeading}>Traffic Channel Quality &amp; Conversion</h3>
                        <p className={styles.cardSub}>Calculated across active UTM tags and viral social loops</p>

                        <div className={styles.channelsList}>
                            {funnelData?.channelBreakdown?.map((ch, idx) => (
                                <div key={idx} className={styles.channelRow}>
                                    <span className={styles.channelName}>{ch.source}</span>
                                    <div className={styles.channelStats}>
                                        <span className={styles.channelShare}>{ch.share} volume</span>
                                        <span className={styles.channelConversion}>{ch.estConversion} conversion</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* LIVE ACTIVITY FEED */}
                    <section className={styles.feedCard}>
                        <h3 className={styles.cardHeading}>Live Telemetry Ingestion Stream</h3>
                        <p className={styles.cardSub}>Most recent raw events processed by /api/analytics/track</p>

                        <div className={styles.feedList}>
                            {funnelData?.recentEvents && funnelData.recentEvents.length > 0 ? (
                                funnelData.recentEvents.map((ev, i) => (
                                    <div key={i} className={styles.feedItem}>
                                        <span className={styles.feedEventDot} />
                                        <div className={styles.feedDetails}>
                                            <span className={styles.feedEventName}>{ev.event_name}</span>
                                            <span className={styles.feedTool}>{ev.tool_id}</span>
                                            {ev.utm_source && (
                                                <span className={styles.feedUtm}>via {ev.utm_source}</span>
                                            )}
                                        </div>
                                        <span className={styles.feedTime}>Just now</span>
                                    </div>
                                ))
                            ) : (
                                <p className={styles.feedEmpty}>Telemetry listener active. Waiting for incoming events...</p>
                            )}
                        </div>
                    </section>
                </div>

                {/* Bottom Navigation */}
                <div className={styles.bottomNav}>
                    <Link href="/tools" className={styles.backBtn}>
                        ← Return to Founder Tools Suite
                    </Link>
                    <Link href="/#founder-form" className={styles.genesisLink}>
                        Open Genesis Application Portal →
                    </Link>
                </div>

            </div>
        </main>
    );
}
