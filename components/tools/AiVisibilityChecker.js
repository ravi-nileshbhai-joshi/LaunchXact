'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import ToolShareCard from './ToolShareCard';
import Founding50FunnelBanner from './Founding50FunnelBanner';
import styles from './AiVisibilityChecker.module.css';

export default function AiVisibilityChecker() {
    const [productName, setProductName] = useState('SyncPulse');
    const [definition, setDefinition] = useState('SyncPulse is a low-latency Postgres change data capture engine that streams database mutations to Kafka, ClickHouse, and webhooks in real-time.');
    const [hasComparison, setHasComparison] = useState(true);
    const [hasStats, setHasStats] = useState(true);
    const [allowsLlmBots, setAllowsLlmBots] = useState(true);
    const [hasSemanticHtml, setHasSemanticHtml] = useState(true);
    const [hasFaqSection, setHasFaqSection] = useState(true);

    const audit = useMemo(() => {
        let score = 0;
        const vectors = [];

        // 1. Direct Definition Check
        const isDefinitionValid = definition.length >= 40 && definition.toLowerCase().includes(productName.toLowerCase()) && (definition.toLowerCase().includes(' is a ') || definition.toLowerCase().includes(' is an '));
        if (isDefinitionValid) {
            score += 25;
            vectors.push({
                icon: '✅',
                title: 'Clear LLM Definitional Sentence ("What is X?")',
                desc: 'LLMs like Perplexity and ChatGPT prioritize explicit noun phrases when answering brand queries.'
            });
        } else {
            score += 5;
            vectors.push({
                icon: '⚠️',
                title: 'Weak or Ambiguous Product Definition',
                desc: `Craft an explicit definition: "${productName} is an [industry category] that [solves core problem] for [target ICP]".`
            });
        }

        // 2. Comparison & Alternatives Table
        if (hasComparison) {
            score += 20;
            vectors.push({
                icon: '✅',
                title: 'Structured Competitor / Alternative Comparison',
                desc: 'LLMs heavily rely on markdown and HTML comparison tables to synthesize buyer recommendation lists.'
            });
        } else {
            vectors.push({
                icon: '❌',
                title: 'No Structured Comparison Table Found',
                desc: 'Add an "Alternatives to [Competitor]" or "Why Us vs [Legacy]" table to claim recommendation share.'
            });
        }

        // 3. Concrete Statistics & Benchmarks
        if (hasStats) {
            score += 15;
            vectors.push({
                icon: '✅',
                title: 'Quotable Data & Latency / ROI Benchmarks',
                desc: 'LLM engines extract numerical claims (e.g., "sub-10ms latency", "65% lower cost") as authoritative citations.'
            });
        } else {
            vectors.push({
                icon: '⚠️',
                title: 'Lacks Quotable Statistics',
                desc: 'Add quantifiable metrics and benchmark data to make your product cited as an authority source.'
            });
        }

        // 4. Crawler Permissions (GPTBot, PerplexityBot)
        if (allowsLlmBots) {
            score += 15;
            vectors.push({
                icon: '✅',
                title: 'LLM Crawlers Allowed in robots.txt',
                desc: 'GPTBot, ClaudeBot, and PerplexityBot are permitted to scrape and index your site.'
            });
        } else {
            vectors.push({
                icon: '❌',
                title: 'AI Crawlers Blocked in robots.txt',
                desc: 'Blocking GPTBot or PerplexityBot will prevent your product from appearing in generative search results.'
            });
        }

        // 5. Semantic HTML & Schema
        if (hasSemanticHtml) {
            score += 15;
            vectors.push({
                icon: '✅',
                title: 'Semantic HTML Structure & Hierarchy',
                desc: 'Clean DOM tree enables LLM context parsers to extract features without token noise.'
            });
        } else {
            vectors.push({
                icon: '⚠️',
                title: 'Messy DOM or Non-Semantic Containers',
                desc: 'Use semantic <article>, <section>, and <h3> tags instead of deeply nested <div> elements.'
            });
        }

        // 6. Direct Question-Answer FAQ
        if (hasFaqSection) {
            score += 10;
            vectors.push({
                icon: '✅',
                title: 'Q&A FAQ Section (Direct Answer Format)',
                desc: 'Matches conversational question prompts submitted directly by ChatGPT Search users.'
            });
        } else {
            vectors.push({
                icon: '⚠️',
                title: 'Missing Q&A Section',
                desc: 'Add 4-5 direct questions with 2-sentence answers matching common buyer queries.'
            });
        }

        return { score, vectors };
    }, [productName, definition, hasComparison, hasStats, allowsLlmBots, hasSemanticHtml, hasFaqSection]);

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.badge}>
                    <span>🤖 Generative Engine Optimization</span>
                </div>
                <h1 className={styles.title}>
                    AI <span style={{ color: '#6366f1' }}>Visibility Checker</span>
                </h1>
                <p className={styles.subtitle}>
                    Audit whether your SaaS content is engineered for LLM retrieval and citation by Perplexity, ChatGPT Search, Claude, and Google AI Overviews.
                </p>
            </header>

            <div className={styles.grid}>
                {/* Inputs */}
                <div className={styles.card}>
                    <h2 className={styles.cardTitle}>⚙️ GEO Content Vectors</h2>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>SaaS Product Name</label>
                        <input
                            type="text"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            className={styles.textInput}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Direct Definitional Sentence ("What is [Product]?")</label>
                        <textarea
                            rows="3"
                            value={definition}
                            onChange={(e) => setDefinition(e.target.value)}
                            className={styles.textarea}
                        />
                        <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px' }}>
                            Must explicitly define what your SaaS is, who it serves, and what core problem it solves.
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.25rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.88rem', color: '#1e293b', fontWeight: 600, cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={hasComparison}
                                onChange={(e) => setHasComparison(e.target.checked)}
                                style={{ accentColor: '#4f46e5', width: '16px', height: '16px' }}
                            />
                            Contains structured Comparison or Alternatives Table
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.88rem', color: '#1e293b', fontWeight: 600, cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={hasStats}
                                onChange={(e) => setHasStats(e.target.checked)}
                                style={{ accentColor: '#4f46e5', width: '16px', height: '16px' }}
                            />
                            Includes quotable performance statistics or ROI numbers
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.88rem', color: '#1e293b', fontWeight: 600, cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={allowsLlmBots}
                                onChange={(e) => setAllowsLlmBots(e.target.checked)}
                                style={{ accentColor: '#4f46e5', width: '16px', height: '16px' }}
                            />
                            Allows GPTBot, PerplexityBot, ClaudeBot in robots.txt
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.88rem', color: '#1e293b', fontWeight: 600, cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={hasSemanticHtml}
                                onChange={(e) => setHasSemanticHtml(e.target.checked)}
                                style={{ accentColor: '#4f46e5', width: '16px', height: '16px' }}
                            />
                            Uses semantic HTML5 markup (&lt;article&gt;, &lt;h1&gt;-&lt;h3&gt;)
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.88rem', color: '#1e293b', fontWeight: 600, cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={hasFaqSection}
                                onChange={(e) => setHasFaqSection(e.target.checked)}
                                style={{ accentColor: '#4f46e5', width: '16px', height: '16px' }}
                            />
                            Includes Question-and-Answer FAQ block
                        </label>
                    </div>
                </div>

                {/* Results */}
                <div className={styles.card}>
                    <h2 className={styles.cardTitle}>📊 AI Citation Readiness Score</h2>

                    <div className={styles.scoreBanner}>
                        <div>
                            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e1b4b', marginBottom: '4px' }}>
                                {audit.score >= 85 ? 'High Citation Probability' : audit.score >= 60 ? 'Moderate LLM Visibility' : 'Low AI Retrieval Index'}
                            </div>
                            <div style={{ fontSize: '0.88rem', color: '#475569', fontWeight: 500 }}>
                                Evaluated against 6 Generative Engine Optimization vectors
                            </div>
                        </div>
                        <div className={styles.scoreDial}>
                            {audit.score}
                        </div>
                    </div>

                    <div className={styles.vectorList}>
                        {audit.vectors.map((vec, idx) => (
                            <div key={idx} className={styles.vectorItem}>
                                <span style={{ fontSize: '1.1rem', marginTop: '1px' }}>{vec.icon}</span>
                                <div>
                                    <div className={styles.vectorTitle}>{vec.title}</div>
                                    <div className={styles.vectorDesc}>{vec.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <Link
                            href={`/#founder-form?product=${encodeURIComponent(productName)}&source=ai-visibility-checker`}
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
                        <Link
                            href="/tools/ai-mention-tracker"
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
                            Simulate LLM Brand Prompts →
                        </Link>
                    </div>
                </div>
            </div>

            <Founding50FunnelBanner
                toolId="ai-visibility-checker"
                toolName="AI Visibility Checker"
                prefillProduct={productName}
                headline={<>Audited your AI visibility? <span style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Get syndicated into AI search with Founding 50.</span></>}
                description="Turn your Generative Engine Optimization score into real organic citations. Accepted Founding 50 products are directly syndicated into AI search engines, receive permanent DoFollow authority in The Vault, and reach active software adopters searching for real solutions."
                ctaText="Apply for Founding 50 with Audited SaaS →"
            />

            <ToolShareCard
                toolTitle="AI Visibility Checker"
                score={`${audit.score}/100 GEO Score`}
                shareText={`My SaaS scored ${audit.score}/100 on the @LaunchXact AI Visibility Checker! Test your Perplexity & ChatGPT citation readiness:`}
                shareUrl="https://www.launchxact.com/tools/ai-visibility-checker"
            />
        </div>
    );
}
