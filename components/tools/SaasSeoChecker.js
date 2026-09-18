'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import ToolShareCard from './ToolShareCard';
import Founding50FunnelBanner from './Founding50FunnelBanner';
import styles from './SaasSeoChecker.module.css';

export default function SaasSeoChecker() {
    // Inputs
    const [title, setTitle] = useState('SyncPulse: Real-Time Postgres Change Data Capture for Microservices');
    const [description, setDescription] = useState('Stream database mutations directly to Kafka, Webhooks, and ClickHouse with sub-10ms latency. Zero complex debezium setup.');
    const [keyword, setKeyword] = useState('postgres change data capture');
    const [h1, setH1] = useState('Real-Time Postgres Change Data Capture Without Kafka Headaches');
    const [hasCanonical, setHasCanonical] = useState(true);
    const [hasOgImage, setHasOgImage] = useState(true);
    const [hasSchema, setHasSchema] = useState(true);

    // Scoring Engine
    const auditResults = useMemo(() => {
        let score = 0;
        const vectors = [];

        // 1. Title Tag Length (Ideal: 50-60 chars)
        const tLen = title.length;
        if (tLen >= 45 && tLen <= 65) {
            score += 20;
            vectors.push({
                status: 'pass',
                icon: '✅',
                title: `Title Tag Length Optimal (${tLen} chars)`,
                desc: 'Length is within the sweet spot (45-65 characters), preventing SERP truncation.'
            });
        } else if (tLen > 0 && tLen < 45) {
            score += 10;
            vectors.push({
                status: 'warning',
                icon: '⚠️',
                title: `Title Tag Short (${tLen} chars)`,
                desc: 'Under 45 characters. Consider adding your primary value hook or brand name.'
            });
        } else {
            score += 5;
            vectors.push({
                status: 'fail',
                icon: '❌',
                title: `Title Tag Truncated (${tLen} chars)`,
                desc: 'Over 65 characters. Google will likely cut off the end with an ellipsis (...).'
            });
        }

        // 2. Keyword in Title
        const lowerTitle = title.toLowerCase();
        const lowerKw = keyword.toLowerCase().trim();
        if (lowerKw && lowerTitle.includes(lowerKw)) {
            score += 20;
            vectors.push({
                status: 'pass',
                icon: '✅',
                title: 'Primary Keyword in Title Tag',
                desc: `Exact phrase "${keyword}" is present in the title tag.`
            });
        } else {
            score += 5;
            vectors.push({
                status: 'fail',
                icon: '❌',
                title: 'Target Keyword Missing from Title',
                desc: `Include your high-intent phrase "${keyword}" near the beginning of your title.`
            });
        }

        // 3. Meta Description Length (Ideal: 130-160 chars)
        const dLen = description.length;
        if (dLen >= 120 && dLen <= 165) {
            score += 15;
            vectors.push({
                status: 'pass',
                icon: '✅',
                title: `Meta Description Length Optimal (${dLen} chars)`,
                desc: 'Full description will render cleanly on both desktop and mobile SERPs.'
            });
        } else if (dLen > 165) {
            score += 8;
            vectors.push({
                status: 'warning',
                icon: '⚠️',
                title: `Meta Description Exceeds Limit (${dLen} chars)`,
                desc: 'Over 165 characters. May be truncated on mobile Google search.'
            });
        } else {
            score += 5;
            vectors.push({
                status: 'warning',
                icon: '⚠️',
                title: `Meta Description Too Short (${dLen} chars)`,
                desc: 'Under 120 characters. Add a clear call-to-action or key differentiator.'
            });
        }

        // 4. H1 Relevance
        const lowerH1 = h1.toLowerCase();
        if (h1.length > 10 && lowerKw && lowerH1.includes(lowerKw)) {
            score += 15;
            vectors.push({
                status: 'pass',
                icon: '✅',
                title: 'H1 Headline Contains Primary Keyword',
                desc: 'Strong semantic alignment between page title and main H1 heading.'
            });
        } else if (h1.length > 10) {
            score += 10;
            vectors.push({
                status: 'warning',
                icon: '⚠️',
                title: 'H1 Partially Aligned',
                desc: 'H1 is present, but consider integrating the exact target keyword.'
            });
        } else {
            vectors.push({
                status: 'fail',
                icon: '❌',
                title: 'H1 Headline Missing or Empty',
                desc: 'Every SaaS page must contain exactly one distinct H1 headline.'
            });
        }

        // 5. Canonical Tag
        if (hasCanonical) {
            score += 10;
            vectors.push({
                status: 'pass',
                icon: '✅',
                title: 'Canonical URL Specified',
                desc: 'Protects link equity and prevents duplicate content penalties across query strings.'
            });
        } else {
            vectors.push({
                status: 'warning',
                icon: '⚠️',
                title: 'Missing Canonical Tag',
                desc: 'Add rel="canonical" to prevent UTM parameters from splitting PageRank.'
            });
        }

        // 6. OpenGraph Card
        if (hasOgImage) {
            score += 10;
            vectors.push({
                status: 'pass',
                icon: '✅',
                title: 'OpenGraph Social Card Configured',
                desc: 'Generates rich image previews when shared on X, LinkedIn, and Slack.'
            });
        } else {
            vectors.push({
                status: 'warning',
                icon: '⚠️',
                title: 'Missing OpenGraph Image (1200x630)',
                desc: 'Social shares will appear as plain text links, lowering CTR by up to 60%.'
            });
        }

        // 7. Structured Schema
        if (hasSchema) {
            score += 10;
            vectors.push({
                status: 'pass',
                icon: '✅',
                title: 'JSON-LD SoftwareApplication Schema Active',
                desc: 'Enables rich Google search snippets, ratings, and AI discovery citations.'
            });
        } else {
            vectors.push({
                status: 'warning',
                icon: '⚠️',
                title: 'No Structured Schema Detected',
                desc: 'Add SoftwareApplication schema to claim Google Rich Snippet real estate.'
            });
        }

        return { score, vectors };
    }, [title, description, keyword, h1, hasCanonical, hasOgImage, hasSchema]);

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.badge}>
                    <span>🔍 Technical SEO Engine</span>
                </div>
                <h1 className={styles.title}>
                    SaaS <span style={{ color: '#0ea5e9' }}>SEO Checker</span>
                </h1>
                <p className={styles.subtitle}>
                    Instant on-page technical SEO and CTR audit for SaaS landing pages. Stress-test title tag density, meta intent, heading hierarchy, and rich snippet readiness.
                </p>
            </header>

            <div className={styles.grid}>
                {/* Inputs */}
                <div className={styles.card}>
                    <h2 className={styles.cardTitle}>⚙️ Landing Page Elements</h2>

                    <div className={styles.inputGroup}>
                        <div className={styles.labelRow}>
                            <span className={styles.label}>Target Keyword</span>
                        </div>
                        <input
                            type="text"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            className={styles.textInput}
                            placeholder="e.g. postgres change data capture"
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <div className={styles.labelRow}>
                            <span className={styles.label}>Page Title Tag</span>
                            <span
                                className={styles.charCount}
                                style={{ color: title.length >= 45 && title.length <= 65 ? '#10b981' : '#f59e0b' }}
                            >
                                {title.length} / 60 chars
                            </span>
                        </div>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className={styles.textInput}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <div className={styles.labelRow}>
                            <span className={styles.label}>Meta Description</span>
                            <span
                                className={styles.charCount}
                                style={{ color: description.length >= 120 && description.length <= 165 ? '#10b981' : '#f59e0b' }}
                            >
                                {description.length} / 160 chars
                            </span>
                        </div>
                        <textarea
                            rows="3"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className={styles.textarea}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <div className={styles.labelRow}>
                            <span className={styles.label}>Primary H1 Headline</span>
                        </div>
                        <input
                            type="text"
                            value={h1}
                            onChange={(e) => setH1(e.target.value)}
                            className={styles.textInput}
                        />
                    </div>

                    <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.88rem', color: '#1e293b', fontWeight: 600, cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={hasCanonical}
                                onChange={(e) => setHasCanonical(e.target.checked)}
                                style={{ accentColor: '#0ea5e9', width: '16px', height: '16px' }}
                            />
                            Page has canonical tag (&lt;link rel="canonical" ...&gt;)
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.88rem', color: '#1e293b', fontWeight: 600, cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={hasOgImage}
                                onChange={(e) => setHasOgImage(e.target.checked)}
                                style={{ accentColor: '#0ea5e9', width: '16px', height: '16px' }}
                            />
                            OpenGraph social image (og:image) defined
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.88rem', color: '#1e293b', fontWeight: 600, cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={hasSchema}
                                onChange={(e) => setHasSchema(e.target.checked)}
                                style={{ accentColor: '#0ea5e9', width: '16px', height: '16px' }}
                            />
                            Structured JSON-LD schema (SoftwareApplication) embedded
                        </label>
                    </div>
                </div>

                {/* Audit Results */}
                <div className={styles.card}>
                    <h2 className={styles.cardTitle}>📊 SEO Score & Recommendations</h2>

                    <div className={styles.scoreBanner}>
                        <div className={styles.scoreLeft}>
                            <div className={styles.scoreDial}>
                                {auditResults.score}
                            </div>
                            <div>
                                <div className={styles.scoreText}>
                                    {auditResults.score >= 85 ? 'Excellent SEO Health' : auditResults.score >= 65 ? 'Moderate SERP Readiness' : 'Needs Optimization'}
                                </div>
                                <div className={styles.scoreSub}>
                                    {auditResults.score >= 85 ? 'Strong CTR hooks & search bot signals' : 'Fix warnings below to maximize organic rankings'}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.vectorList}>
                        {auditResults.vectors.map((vec, idx) => (
                            <div key={idx} className={styles.vectorItem}>
                                <span className={styles.vectorIcon}>{vec.icon}</span>
                                <div>
                                    <div className={styles.vectorTitle}>{vec.title}</div>
                                    <div className={styles.vectorDesc}>{vec.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <Link
                            href="/#founder-form?source=saas-seo-checker"
                            style={{
                                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                                color: '#ffffff',
                                padding: '0.65rem 1.25rem',
                                borderRadius: '0.6rem',
                                fontWeight: 700,
                                fontSize: '0.88rem',
                                textDecoration: 'none',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)'
                            }}
                        >
                            🚀 Apply for Founding 50 →
                        </Link>
                        <Link
                            href="/tools/meta-generator"
                            style={{
                                background: '#0ea5e9',
                                color: '#ffffff',
                                padding: '0.65rem 1.25rem',
                                borderRadius: '0.6rem',
                                fontWeight: 700,
                                fontSize: '0.88rem',
                                textDecoration: 'none',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            Open Meta Generator Studio →
                        </Link>
                        <Link
                            href="/tools/geo-schema-snippet-generator"
                            style={{
                                background: '#ffffff',
                                border: '1.5px solid #e2e8f0',
                                color: '#334155',
                                padding: '0.65rem 1.25rem',
                                borderRadius: '0.6rem',
                                fontWeight: 700,
                                fontSize: '0.88rem',
                                textDecoration: 'none',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            Generate Schema Markup →
                        </Link>
                    </div>
                </div>
            </div>

            <Founding50FunnelBanner
                toolId="saas-seo-checker"
                toolName="SaaS SEO Checker"
                headline={
                    <>
                        Audited your SEO score?{' '}
                        <span style={{
                            background: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            Get permanent high-authority backlinks in the Founding 50.
                        </span>
                    </>
                }
                description="LaunchXact gives accepted products permanent showcase visibility in The Vault, programmatic SEO distribution, and 100% free lifetime listing with zero revenue cuts."
                ctaText="Submit Product for Founding 50 Review →"
            />

            <ToolShareCard
                toolTitle="SaaS SEO Checker"
                score={`${auditResults.score}/100 Score`}
                shareText={`My SaaS scored ${auditResults.score}/100 on the @LaunchXact SaaS SEO Checker! Test your landing page SEO for free:`}
                shareUrl="https://www.launchxact.com/tools/saas-seo-checker"
            />
        </div>
    );
}
