'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import ToolShareCard from './ToolShareCard';
import Founding50FunnelBanner from './Founding50FunnelBanner';
import styles from './InternalLinkPlanner.module.css';

export default function InternalLinkPlanner() {
    // Hub (Pillar Page)
    const [hubTitle, setHubTitle] = useState('The Complete SaaS Payment & MoR Architecture Guide');
    const [hubUrl, setHubUrl] = useState('/tools/true-cost-of-payments');
    const [hubKeyword, setHubKeyword] = useState('saas payment processing cost');

    // Spokes
    const [spokes, setSpokes] = useState([
        { id: 1, title: 'Stripe vs LemonSqueezy vs Paddle: Fee Comparison', url: '/articles/stripe-vs-lemonsqueezy', anchor: 'SaaS payment gateway fees', intent: 'Commercial' },
        { id: 2, title: 'How Global SaaS VAT/GST Compliance Traps Indie Founders', url: '/articles/saas-vat-tax-traps', anchor: 'calculate true payment cost', intent: 'Informational' },
        { id: 3, title: 'What is a Merchant of Record (MoR) and Why You Need One', url: '/articles/what-is-a-merchant-of-record', anchor: 'Merchant of Record tax calculator', intent: 'Informational' },
        { id: 4, title: 'Hidden FX Conversion Spreads in International SaaS', url: '/articles/hidden-fx-saas-spreads', anchor: 'audit international payment leak', intent: 'Commercial' },
    ]);

    const [copied, setCopied] = useState(false);

    const addSpoke = () => {
        const nextId = Date.now();
        setSpokes([
            ...spokes,
            { id: nextId, title: 'New Spoke Article / Tool', url: '/articles/new-topic', anchor: hubKeyword, intent: 'Informational' }
        ]);
    };

    const updateSpoke = (id, field, value) => {
        setSpokes(spokes.map(s => s.id === id ? { ...s, [field]: value } : s));
    };

    const deleteSpoke = (id) => {
        setSpokes(spokes.filter(s => s.id !== id));
    };

    const exportManifest = () => {
        let md = `# Internal Linking Architecture Manifest\n\n`;
        md += `## Pillar (Hub Page)\n`;
        md += `- **Title**: ${hubTitle}\n`;
        md += `- **URL**: ${hubUrl}\n`;
        md += `- **Target Keyword**: ${hubKeyword}\n\n`;
        md += `## Spoke Pages (${spokes.length} Spokes)\n\n`;
        md += `| Spoke Title | Spoke URL | Target Anchor to Hub | Search Intent |\n`;
        md += `| :--- | :--- | :--- | :--- |\n`;
        spokes.forEach(s => {
            md += `| ${s.title} | ${s.url} | **"${s.anchor}"** → \`${hubUrl}\` | ${s.intent} |\n`;
        });
        md += `\n### Linking Rules:\n`;
        md += `1. **Upward Equity**: Every Spoke MUST include at least one in-body contextual link to the Pillar (\`${hubUrl}\`) within the first 300 words using its assigned anchor text.\n`;
        md += `2. **Horizontal Equity**: Spokes should cross-link to adjacent sibling spokes when referencing sub-concepts.\n`;
        md += `3. **Zero Orphans**: No spoke may exist without receiving at least one inbound link from another authoritative page.\n`;

        navigator.clipboard.writeText(md);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.badge}>
                    <span>🔗 Topic Silo Architect</span>
                </div>
                <h1 className={styles.title}>
                    SaaS <span style={{ color: '#0ea5e9' }}>Internal Link Planner</span>
                </h1>
                <p className={styles.subtitle}>
                    Architect hub-and-spoke topic clusters to funnel PageRank and topical authority directly into your high-converting product and pricing pages.
                </p>
            </header>

            {/* Hub Configuration */}
            <div className={styles.card}>
                <h2 className={styles.cardTitle}>🏛️ Pillar Hub Page (Conversion Epicenter)</h2>
                <div className={styles.hubGrid}>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Pillar Page Title</label>
                        <input
                            type="text"
                            value={hubTitle}
                            onChange={(e) => setHubTitle(e.target.value)}
                            className={styles.textInput}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Pillar Page Canonical URL</label>
                        <input
                            type="text"
                            value={hubUrl}
                            onChange={(e) => setHubUrl(e.target.value)}
                            className={styles.textInput}
                        />
                    </div>
                </div>
                <div className={styles.inputGroup} style={{ marginBottom: 0 }}>
                    <label className={styles.label}>Primary High-Intent Keyword (Target Anchor)</label>
                    <input
                        type="text"
                        value={hubKeyword}
                        onChange={(e) => setHubKeyword(e.target.value)}
                        className={styles.textInput}
                    />
                </div>
            </div>

            {/* Visual Silo Diagram */}
            <div className={styles.siloDiagram}>
                <div className={styles.hubNode}>
                    <div>🏛️ HUB: {hubTitle}</div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.9, marginTop: '4px' }}>Canonical: {hubUrl}</div>
                </div>

                <div className={styles.diagramConnector}>
                    ▲ ▲ ▲ (Contextual PageRank Equity Flow) ▲ ▲ ▲
                </div>

                <div className={styles.spokesNodeRow}>
                    {spokes.map((s, idx) => (
                        <div key={s.id} className={styles.spokeNode}>
                            <div style={{ color: '#0284c7', fontSize: '0.75rem', fontWeight: 800, marginBottom: '3px' }}>SPOKE #{idx + 1}</div>
                            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>{s.title}</div>
                            <div style={{ color: '#475569', fontSize: '0.75rem', fontWeight: 600 }}>Anchor: &quot;{s.anchor}&quot;</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Spokes Configuration */}
            <div className={styles.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <h2 className={styles.cardTitle} style={{ margin: 0 }}>🌿 Supporting Spoke Pages ({spokes.length})</h2>
                    <button onClick={addSpoke} className={styles.addBtn}>
                        + Add Spoke Page
                    </button>
                </div>

                {spokes.map((s, idx) => (
                    <div key={s.id} className={styles.spokeItem}>
                        <div>
                            <label className={styles.label}>Spoke #{idx + 1} Title</label>
                            <input
                                type="text"
                                value={s.title}
                                onChange={(e) => updateSpoke(s.id, 'title', e.target.value)}
                                className={styles.textInput}
                            />
                        </div>
                        <div>
                            <label className={styles.label}>Relative URL</label>
                            <input
                                type="text"
                                value={s.url}
                                onChange={(e) => updateSpoke(s.id, 'url', e.target.value)}
                                className={styles.textInput}
                            />
                        </div>
                        <div>
                            <label className={styles.label}>Anchor to Pillar</label>
                            <input
                                type="text"
                                value={s.anchor}
                                onChange={(e) => updateSpoke(s.id, 'anchor', e.target.value)}
                                className={styles.textInput}
                            />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-end', height: '100%' }}>
                            <button
                                onClick={() => deleteSpoke(s.id)}
                                className={styles.deleteBtn}
                                title="Delete Spoke"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                ))}

                <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <Link
                        href="/#founder-form?source=internal-link-planner"
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
                    <button
                        onClick={exportManifest}
                        style={{
                            background: '#0ea5e9',
                            color: '#ffffff',
                            padding: '0.65rem 1.25rem',
                            borderRadius: '0.6rem',
                            fontWeight: 700,
                            fontSize: '0.88rem',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        {copied ? '✓ Copied Linking Manifest!' : '📋 Export Linking Manifest to Markdown'}
                    </button>
                    <Link
                        href="/tools/saas-seo-checker"
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
                        Audit On-Page SEO →
                    </Link>
                </div>
            </div>

            <Founding50FunnelBanner
                toolId="internal-link-planner"
                toolName="Internal Link Planner"
                headline={
                    <>
                        Mapped your topic clusters?{' '}
                        <span style={{
                            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            Get high-DA marketplace syndication with Founding 50.
                        </span>
                    </>
                }
                description="LaunchXact indexes your SaaS in curated software categories with high-intent inbound search queries, programmatic category architecture, and targeted discovery for active software buyers."
                ctaText="Submit Product for Founding 50 Syndication →"
            />

            <ToolShareCard
                toolTitle="SaaS Internal Link Planner"
                score={`${spokes.length} Connected Spokes`}
                shareText="I just mapped my SaaS topic clusters and internal link equity using @LaunchXact free Internal Link Planner:"
                shareUrl="https://www.launchxact.com/tools/internal-link-planner"
            />
        </div>
    );
}
