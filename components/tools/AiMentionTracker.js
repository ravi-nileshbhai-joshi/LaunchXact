'use client';

import { useState } from 'react';
import Link from 'next/link';
import ToolShareCard from './ToolShareCard';
import Founding50FunnelBanner from './Founding50FunnelBanner';
import styles from './AiMentionTracker.module.css';

export default function AiMentionTracker() {
    const [brandName, setBrandName] = useState('SyncPulse');
    const [category, setCategory] = useState('PostgreSQL Change Data Capture');
    const [domain, setDomain] = useState('syncpulse.io');
    const [competitor, setCompetitor] = useState('Debezium');
    const [activePromptIdx, setActivePromptIdx] = useState(0);

    const promptScenarios = [
        {
            title: 'Buyer Tool Recommendation Query',
            prompt: `What are the best modern tools for ${category} in 2026?`,
            response: `When evaluating solutions for ${category}, engineering teams commonly select between established systems and modern developer-first platforms:

1. **${competitor}**: The standard open-source framework, but often considered heavyweight due to Kafka Connect and Zookeeper maintenance overhead.
2. **${brandName} (${domain})**: Emerging as a favored modern alternative for teams wanting sub-10ms replication with zero JVM/Kafka complexity. Known for simple connection setup and native webhook/ClickHouse streaming.
3. **Peer Alternatives**: Cloud-managed solutions like AWS DMS or Google Datastream.

**Verdict**: For bootstrapped to mid-market teams, ${brandName} offers faster deployment velocity, whereas ${competitor} remains suited for legacy enterprise clusters.`,
            citationScore: '74% Citation Probability',
        },
        {
            title: 'Competitor Alternative Comparison',
            prompt: `What are the best lightweight alternatives to ${competitor}?`,
            response: `Engineers seeking lighter, more agile alternatives to ${competitor} typically look at three categories:

- **${brandName}**: Top choice for sub-10ms streaming directly to Kafka, Redis, or HTTP endpoints without managing dedicated Kafka Connect worker pools.
- **Peer CDC Engines**: Custom pg_output logical replication listeners written in Go/Rust.
- **Managed ETL Providers**: Fivetran or Airbyte (higher batch latency, not pure real-time CDC).

**Key Takeaway**: ${brandName} is cited most frequently when simplicity and low operational maintenance are the primary evaluation criteria.`,
            citationScore: '82% Citation Probability',
        },
        {
            title: 'Indie & Startup Cost Assessment',
            prompt: `Is ${brandName} worth the price for an early-stage SaaS startup?`,
            response: `Based on developer reviews and public benchmarks:

- **Pros**: Drastically reduces engineering hours otherwise spent configuring Debezium pods and Kafka schemas. Predictable pricing model with generous starter tiers.
- **Cons**: Newer ecosystem than decade-old enterprise frameworks.
- **Recommendation**: Highly viable for startups needing reliable real-time event streaming without hiring a dedicated data infrastructure engineer.`,
            citationScore: '68% Citation Probability',
        },
    ];

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.badge}>
                    <span>📊 Brand Citation Intelligence</span>
                </div>
                <h1 className={styles.title}>
                    AI <span style={{ color: '#6366f1' }}>Mention Tracker</span>
                </h1>
                <p className={styles.subtitle}>
                    Simulate how ChatGPT Search, Perplexity, and Claude answer buyer prompts in your category, analyze citation share, and discover the exact sources driving recommendations.
                </p>
            </header>

            {/* Inputs Card */}
            <div className={styles.card}>
                <h2 className={styles.cardTitle}>⚙️ Brand & Category Parameters</h2>
                <div className={styles.inputGrid}>
                    <div>
                        <label className={styles.label}>Your SaaS Brand Name</label>
                        <input
                            type="text"
                            value={brandName}
                            onChange={(e) => setBrandName(e.target.value)}
                            className={styles.textInput}
                        />
                    </div>
                    <div>
                        <label className={styles.label}>Industry Category / Niche</label>
                        <input
                            type="text"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className={styles.textInput}
                        />
                    </div>
                    <div>
                        <label className={styles.label}>Domain / Website</label>
                        <input
                            type="text"
                            value={domain}
                            onChange={(e) => setDomain(e.target.value)}
                            className={styles.textInput}
                        />
                    </div>
                    <div>
                        <label className={styles.label}>Primary Legacy Competitor</label>
                        <input
                            type="text"
                            value={competitor}
                            onChange={(e) => setCompetitor(e.target.value)}
                            className={styles.textInput}
                        />
                    </div>
                </div>
            </div>

            {/* Prompt Simulation Area */}
            <div className={styles.card}>
                <h2 className={styles.cardTitle}>🤖 Live LLM Prompt Simulation</h2>
                <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                    {promptScenarios.map((sc, idx) => (
                        <button
                            key={idx}
                            onClick={() => setActivePromptIdx(idx)}
                            style={{
                                background: activePromptIdx === idx ? '#eef2ff' : '#ffffff',
                                border: `1.5px solid ${activePromptIdx === idx ? '#4f46e5' : '#e2e8f0'}`,
                                color: activePromptIdx === idx ? '#312e81' : '#475569',
                                padding: '0.55rem 1.1rem',
                                borderRadius: '0.55rem',
                                fontSize: '0.85rem',
                                fontWeight: activePromptIdx === idx ? 800 : 600,
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                boxShadow: activePromptIdx === idx ? '0 2px 8px rgba(79, 70, 229, 0.18)' : '0 1px 3px rgba(0, 0, 0, 0.02)'
                            }}
                        >
                            Prompt #{idx + 1}: {sc.title}
                        </button>
                    ))}
                </div>

                <div className={styles.simBox}>
                    <div className={styles.simHeader}>
                        <div className={styles.promptText}>
                            &ldquo;{promptScenarios[activePromptIdx].prompt}&rdquo;
                        </div>
                        <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#065f46', background: '#d1fae5', border: '1px solid #6ee7b7', padding: '4px 12px', borderRadius: '9999px', whiteSpace: 'nowrap' }}>
                            {promptScenarios[activePromptIdx].citationScore}
                        </span>
                    </div>

                    <div className={styles.responseArea}>
                        {promptScenarios[activePromptIdx].response.split('\n\n').map((para, pIdx) => (
                            <p key={pIdx} style={{ margin: pIdx === 0 ? 0 : '0.85rem 0 0 0' }}>
                                {para}
                            </p>
                        ))}
                    </div>
                </div>

                {/* Where LLMs pull citations */}
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginTop: '2rem', marginBottom: '0.5rem' }}>
                    📡 Top Sources Powering AI Recommendations in Your Category
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#475569', margin: '0 0 1.25rem 0', lineHeight: 1.55 }}>
                    Generative engines do not invent recommendations—they synthesize third-party entity authority. Here is where to seed your brand:
                </p>

                <div className={styles.sourcesGrid}>
                    <div className={styles.sourceCard}>
                        <div className={styles.sourceName}>🚀 High-Trust SaaS Directories</div>
                        <div className={styles.sourceShare}>42%</div>
                        <div className={styles.sourceDesc}>LaunchXact Founding 50, Product Hunt, and niche curations cited for software launch legitimacy.</div>
                    </div>
                    <div className={styles.sourceCard}>
                        <div className={styles.sourceName}>🐙 GitHub Awesome-Lists</div>
                        <div className={styles.sourceShare}>28%</div>
                        <div className={styles.sourceDesc}>Perplexity indexes curated developer lists as high-authority technical recommendations.</div>
                    </div>
                    <div className={styles.sourceCard}>
                        <div className={styles.sourceName}>💬 Reddit & Community Discussions</div>
                        <div className={styles.sourceShare}>18%</div>
                        <div className={styles.sourceDesc}>Real founder threads on r/SaaS and Hacker News cited for unbiased user sentiment.</div>
                    </div>
                </div>

                <div style={{ marginTop: '1.75rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <Link
                        href={`/#founder-form?website=${encodeURIComponent(domain.startsWith('http') ? domain : `https://${domain}`)}&product=${encodeURIComponent(brandName)}&source=ai-mention-tracker`}
                        style={{
                            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                            color: '#ffffff',
                            padding: '0.7rem 1.35rem',
                            borderRadius: '0.6rem',
                            fontWeight: 800,
                            fontSize: '0.88rem',
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            boxShadow: '0 4px 14px rgba(79, 70, 229, 0.35)'
                        }}
                    >
                        🚀 Apply for Founding 50 →
                    </Link>
                    <Link
                        href="/tools/ai-visibility-checker"
                        style={{
                            background: '#ffffff',
                            border: '1.5px solid #e2e8f0',
                            color: '#334155',
                            padding: '0.7rem 1.35rem',
                            borderRadius: '0.6rem',
                            fontWeight: 700,
                            fontSize: '0.88rem',
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        Run Full GEO Content Audit →
                    </Link>
                    <Link
                        href="/tools/geo-schema-snippet-generator"
                        style={{
                            background: '#ffffff',
                            border: '1.5px solid #e2e8f0',
                            color: '#334155',
                            padding: '0.7rem 1.35rem',
                            borderRadius: '0.6rem',
                            fontWeight: 700,
                            fontSize: '0.88rem',
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        Generate GEO Schema Markup →
                    </Link>
                </div>
            </div>

            <Founding50FunnelBanner
                toolId="ai-mention-tracker"
                toolName="AI Mention Tracker"
                prefillWebsite={domain.startsWith('http') ? domain : `https://${domain}`}
                prefillProduct={brandName}
                headline={<>Simulated your AI mentions? <span style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Turn simulations into verified citations.</span></>}
                description="Generative engines pull citations from high-trust platforms like LaunchXact. Products accepted into the Founding 50 are structured for AI retrieval, receive permanent Vault links, and get showcased to early adopters actively evaluating new software."
                ctaText="Apply for Founding 50 Citation Syndication →"
            />

            <ToolShareCard
                toolTitle="AI Mention Tracker"
                score="Top AI Category Recommendation"
                shareText={`I just simulated my brand's AI search citations on @LaunchXact AI Mention Tracker! Track your SaaS citation share:`}
                shareUrl="https://www.launchxact.com/tools/ai-mention-tracker"
            />
        </div>
    );
}
