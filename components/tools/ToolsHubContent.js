'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { TOOL_PILLARS, ECOSYSTEM_TOOLS } from '@/data/tools-ecosystem';
import styles from '@/app/tools/tools.module.css';

export default function ToolsHubContent() {
    const [activePillar, setActivePillar] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Filter logic
    const filteredTools = useMemo(() => {
        return ECOSYSTEM_TOOLS.filter((tool) => {
            const matchesPillar = activePillar === 'all' || tool.pillarId === activePillar;
            if (!matchesPillar) return false;

            if (!searchQuery.trim()) return true;

            const q = searchQuery.toLowerCase();
            const inTitle = tool.title.toLowerCase().includes(q);
            const inDesc = tool.description.toLowerCase().includes(q);
            const inPillar = tool.pillarName.toLowerCase().includes(q);
            const inTags = tool.tags?.some((t) => t.toLowerCase().includes(q));

            return inTitle || inDesc || inPillar || inTags;
        });
    }, [activePillar, searchQuery]);

    // Grouping for "all" view
    const groupedPillars = useMemo(() => {
        if (activePillar !== 'all') {
            const pillar = TOOL_PILLARS.find((p) => p.id === activePillar);
            return [
                {
                    ...pillar,
                    tools: filteredTools,
                },
            ];
        }

        return TOOL_PILLARS.map((pillar) => ({
            ...pillar,
            tools: filteredTools.filter((t) => t.pillarId === pillar.id),
        })).filter((group) => group.tools.length > 0);
    }, [activePillar, filteredTools]);

    return (
        <div>
            {/* Header */}
            <header className={styles.header}>
                <div className={styles.badge}>
                    <span>✦ Founder Operating System · 4 Pillars · 13 Engines</span>
                </div>
                <h1 className={styles.title}>
                    <span className={styles.titleMain}>The SaaS Founder </span>
                    <span className={styles.titleGradient}>Tool Ecosystem</span>
                </h1>
                <p className={styles.subtitle}>
                    Battle-tested calculators, AI discovery simulators, and launch frameworks engineered to eliminate founder friction and scale indie SaaS from $0 to $50k MRR.
                </p>
            </header>

            {/* Telemetry Strip */}
            <div className={styles.telemetryStrip}>
                <div className={styles.telemetryItem}>
                    <span className={`${styles.telemetryValue} ${styles.telemetryPillars}`}>4 Pillars</span>
                    <span className={styles.telemetryLabel}>Strategic Verticals</span>
                </div>
                <div className={styles.telemetryItem}>
                    <span className={`${styles.telemetryValue} ${styles.telemetryEngines}`}>13 Engines</span>
                    <span className={styles.telemetryLabel}>Specialized Utilities</span>
                </div>
                <div className={styles.telemetryItem}>
                    <span className={`${styles.telemetryValue} ${styles.telemetryMath}`}>100% Client-Side</span>
                    <span className={styles.telemetryLabel}>Real-Time Math</span>
                </div>
                <div className={styles.telemetryItem}>
                    <span className={`${styles.telemetryValue} ${styles.telemetryGatekept}`}>$0 Gatekept</span>
                    <span className={styles.telemetryLabel}>Free Founder Access</span>
                </div>
            </div>

            {/* Founder Journey Roadmap */}
            <div className={styles.roadmapBox}>
                <div className={styles.roadmapTitle}>
                    <span>🗺️ The Founder Traction Roadmap</span>
                </div>
                <div className={styles.roadmapSteps}>
                    <div className={styles.stepCard}>
                        <span className={styles.stepNum}>STAGE 1</span>
                        <span className={styles.stepTitle}>💰 Economics</span>
                        <span className={styles.stepDesc}>
                            Model target MRR, audit payment fees, and forecast multi-tier cloud overages.
                        </span>
                    </div>
                    <div className={styles.stepCard}>
                        <span className={styles.stepNum}>STAGE 2</span>
                        <span className={styles.stepTitle}>🔍 SEO Authority</span>
                        <span className={styles.stepDesc}>
                            Preview SERP snippets, construct topic cluster silos, and audit on-page CTR.
                        </span>
                    </div>
                    <div className={styles.stepCard}>
                        <span className={styles.stepNum}>STAGE 3</span>
                        <span className={styles.stepTitle}>🤖 AI Discovery</span>
                        <span className={styles.stepDesc}>
                            Inject GEO schemas and simulate ChatGPT &amp; Perplexity buyer prompt citations.
                        </span>
                    </div>
                    <div className={styles.stepCard}>
                        <span className={styles.stepNum}>STAGE 4</span>
                        <span className={styles.stepTitle}>🚀 Launch Velocity</span>
                        <span className={styles.stepDesc}>
                            Audit landing page conversion, execute 30-day timelines, and apply for the Founding 50.
                        </span>
                    </div>
                </div>
            </div>

            {/* Command Bar: Search + Filter Tabs */}
            <div className={styles.controlBar}>
                <div className={styles.searchBox}>
                    <span className={styles.searchIcon}>🔍</span>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search ecosystem (e.g. pricing, schema, checklist, payments)..."
                        className={styles.searchInput}
                    />
                </div>

                <div className={styles.filterTabs}>
                    <button
                        className={`${styles.filterTabBtn} ${activePillar === 'all' ? styles.filterTabBtnActive : ''}`}
                        onClick={() => setActivePillar('all')}
                    >
                        All Engines ({ECOSYSTEM_TOOLS.length})
                    </button>
                    {TOOL_PILLARS.map((p) => {
                        const count = ECOSYSTEM_TOOLS.filter((t) => t.pillarId === p.id).length;
                        return (
                            <button
                                key={p.id}
                                className={`${styles.filterTabBtn} ${activePillar === p.id ? styles.filterTabBtnActive : ''}`}
                                onClick={() => setActivePillar(p.id)}
                            >
                                <span>{p.icon}</span> {p.name} ({count})
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Pillar Groups */}
            {groupedPillars.map((group) => {
                const gradientClass =
                    group.id === 'launch'
                        ? styles.pillarNameGradientLaunch
                        : group.id === 'seo'
                        ? styles.pillarNameGradientSeo
                        : group.id === 'ai-discovery'
                        ? styles.pillarNameGradientAi
                        : styles.pillarNameGradientEconomics;

                return (
                    <section key={group.id} className={styles.pillarGroup}>
                        <div className={styles.pillarHeader}>
                            <div className={styles.pillarTitleGroup}>
                                <div className={styles.pillarIcon}>{group.icon}</div>
                                <div>
                                    <h2 className={styles.pillarName}>
                                        <span className={gradientClass}>{group.name}</span>
                                        <span
                                            className={styles.pillarBadge}
                                            style={{
                                                color: group.themeColor,
                                                background: group.accentBg,
                                                borderColor: group.borderColor,
                                            }}
                                        >
                                            {group.badge}
                                        </span>
                                    </h2>
                                    <p className={styles.pillarTagline}>{group.tagline}</p>
                                </div>
                            </div>
                            <span className={styles.pillarCountBadge}>
                                {group.tools.length} {group.tools.length === 1 ? 'Engine' : 'Engines'}
                            </span>
                        </div>

                        <div className={styles.grid}>
                            {group.tools.map((t) => (
                                <Link
                                    key={t.id}
                                    href={t.href}
                                    className={styles.toolCard}
                                >
                                    <div>
                                        <div className={styles.cardTop}>
                                            <div className={styles.iconWrap}>{t.icon}</div>
                                            <span className={styles.statusLive}>
                                                {t.badge}
                                            </span>
                                        </div>
                                        <h3 className={styles.cardTitle}>{t.title}</h3>
                                        <p className={styles.cardDesc}>{t.description}</p>

                                        {t.tags && (
                                            <div className={styles.tagRow}>
                                                {t.tags.map((tag, idx) => (
                                                    <span key={idx} className={styles.tagPill}>
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {t.previewMetric && (
                                            <div className={styles.previewMetric}>
                                                ⚡ {t.previewMetric}
                                            </div>
                                        )}
                                    </div>

                                    <div className={styles.cardAction}>
                                        {t.actionText}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                );
            })}

            {filteredTools.length === 0 && (
                <div style={{ textAlign: 'center', padding: '4rem 1rem', background: '#ffffff', borderRadius: '1rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔍</div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
                        No tools found matching &quot;{searchQuery}&quot;
                    </h3>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                        Try searching for &quot;pricing&quot;, &quot;schema&quot;, &quot;checklist&quot;, or reset your filters.
                    </p>
                    <button
                        onClick={() => { setSearchQuery(''); setActivePillar('all'); }}
                        style={{ background: '#7c3aed', color: '#ffffff', border: 'none', padding: '0.65rem 1.4rem', borderRadius: '9999px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)' }}
                    >
                        Reset Search Filters
                    </button>
                </div>
            )}

            {/* Bottom Founding 50 Conversion CTA */}
            <div className={styles.bottomCta}>
                <span className={styles.foundingBadge}>🏅 Hand-Curated Founding Collection</span>
                <h2 className={styles.bottomCtaTitle}>
                    Apply for the LaunchXact <span className={styles.gradientFounding}>Founding 50</span>
                </h2>
                <p className={styles.bottomCtaDesc}>
                    We&apos;re hand-selecting the first 50 exceptional SaaS products for our permanent founding collection. Every product is reviewed by hand. Free permanent listing, dedicated editorial setup, and zero recurring fees.
                </p>

                <div className={styles.foundingPerksGrid}>
                    <div className={styles.foundingPerk}>
                        <span className={styles.perkIcon}>🏅</span>
                        <div>
                            <div className={styles.perkTitle}>Permanent Founding Badge</div>
                            <div className={styles.perkDesc}>Distinguishes your software as one of the first 50 verified builder products.</div>
                        </div>
                    </div>
                    <div className={styles.foundingPerk}>
                        <span className={styles.perkIcon}>✍️</span>
                        <div>
                            <div className={styles.perkTitle}>Free Editorial Setup</div>
                            <div className={styles.perkDesc}>We write, format, and optimize your listing — you just submit. No manual overhead.</div>
                        </div>
                    </div>
                    <div className={styles.foundingPerk}>
                        <span className={styles.perkIcon}>🎯</span>
                        <div>
                            <div className={styles.perkTitle}>Category &amp; Use-Case Placement</div>
                            <div className={styles.perkDesc}>Tagged by what your product actually does so targeted buyers find you indefinitely.</div>
                        </div>
                    </div>
                    <div className={styles.foundingPerk}>
                        <span className={styles.perkIcon}>✅</span>
                        <div>
                            <div className={styles.perkTitle}>No Recurring Fee. Ever.</div>
                            <div className={styles.perkDesc}>A permanent discovery asset. You don&apos;t pay monthly. Keep 100% of your revenue.</div>
                        </div>
                    </div>
                </div>

                <Link href="/#founder-form?source=tools-hub" className={styles.bottomCtaBtn}>
                    🚀 Submit Your Product for Founding 50 →
                </Link>
            </div>
        </div>
    );
}
