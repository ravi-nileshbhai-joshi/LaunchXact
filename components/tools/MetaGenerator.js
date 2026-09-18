'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import ToolShareCard from './ToolShareCard';
import Founding50FunnelBanner from './Founding50FunnelBanner';
import styles from './MetaGenerator.module.css';

export default function MetaGenerator() {
    // Inputs
    const [title, setTitle] = useState('SyncPulse: Real-Time Database Replication for High-Growth SaaS');
    const [description, setDescription] = useState('Replicate PostgreSQL to ClickHouse, Kafka, and Redis in milliseconds. Built for modern developer-led teams scaling past 10M events/day.');
    const [url, setUrl] = useState('https://www.syncpulse.io');
    const [siteName, setSiteName] = useState('SyncPulse');
    const [ogImage, setOgImage] = useState('https://www.syncpulse.io/og-image.png');
    const [twitterHandle, setTwitterHandle] = useState('@syncpulse');
    const [previewTab, setPreviewTab] = useState('google');
    const [codeTab, setCodeTab] = useState('nextjs');
    const [copied, setCopied] = useState(false);

    // Truncation statuses
    const titleStatus = useMemo(() => {
        const len = title.length;
        if (len <= 60) return { label: 'Optimal (< 60 chars)', color: '#10b981' };
        return { label: 'Will Truncate (> 60 chars)', color: '#f59e0b' };
    }, [title]);

    const descStatus = useMemo(() => {
        const len = description.length;
        if (len <= 160) return { label: 'Optimal (< 160 chars)', color: '#10b981' };
        return { label: 'Will Truncate (> 160 chars)', color: '#f59e0b' };
    }, [description]);

    // Code generators
    const generatedCode = useMemo(() => {
        if (codeTab === 'nextjs') {
            return `// Next.js App Router (app/page.js or app/layout.js)
export const metadata = {
  title: '${title.replace(/'/g, "\\'")}',
  description: '${description.replace(/'/g, "\\'")}',
  alternates: {
    canonical: '${url}',
  },
  openGraph: {
    title: '${title.replace(/'/g, "\\'")}',
    description: '${description.replace(/'/g, "\\'")}',
    url: '${url}',
    siteName: '${siteName.replace(/'/g, "\\'")}',
    images: [
      {
        url: '${ogImage}',
        width: 1200,
        height: 630,
        alt: '${title.replace(/'/g, "\\'")}',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '${title.replace(/'/g, "\\'")}',
    description: '${description.replace(/'/g, "\\'")}',
    creator: '${twitterHandle}',
    images: ['${ogImage}'],
  },
};`;
        }

        // Standard HTML
        return `<!-- Standard HTML Meta Tags -->
<title>${title}</title>
<meta name="description" content="${description}">
<link rel="canonical" href="${url}">

<!-- Open Graph / Facebook / LinkedIn -->
<meta property="og:type" content="website">
<meta property="og:url" content="${url}">
<meta property="og:site_name" content="${siteName}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:image" content="${ogImage}">

<!-- Twitter / X -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:url" content="${url}">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${description}">
<meta name="twitter:creator" content="${twitterHandle}">
<meta name="twitter:image" content="${ogImage}">`;
    }, [title, description, url, siteName, ogImage, twitterHandle, codeTab]);

    const copyCode = () => {
        navigator.clipboard.writeText(generatedCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.badge}>
                    <span>🖼️ Visual SERP Studio</span>
                </div>
                <h1 className={styles.title}>
                    SaaS <span style={{ color: '#0ea5e9' }}>Meta & OpenGraph Generator</span>
                </h1>
                <p className={styles.subtitle}>
                    Design pixel-perfect Google SERP snippets, Twitter / X summary large image cards, and LinkedIn previews with 1-click Next.js and HTML metadata code export.
                </p>
            </header>

            <div className={styles.grid}>
                {/* Inputs */}
                <div className={styles.card}>
                    <h2 className={styles.cardTitle}>⚙️ Metadata Fields</h2>

                    <div className={styles.inputGroup}>
                        <div className={styles.labelRow}>
                            <span className={styles.label}>Page Title</span>
                            <span className={styles.charCount} style={{ color: titleStatus.color }}>
                                {title.length}/60 · {titleStatus.label}
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
                            <span className={styles.charCount} style={{ color: descStatus.color }}>
                                {description.length}/160 · {descStatus.label}
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
                            <span className={styles.label}>Canonical URL</span>
                        </div>
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className={styles.textInput}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <div className={styles.labelRow}>
                            <span className={styles.label}>Site / Brand Name</span>
                        </div>
                        <input
                            type="text"
                            value={siteName}
                            onChange={(e) => setSiteName(e.target.value)}
                            className={styles.textInput}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <div className={styles.labelRow}>
                            <span className={styles.label}>OpenGraph Image URL (1200x630)</span>
                        </div>
                        <input
                            type="text"
                            value={ogImage}
                            onChange={(e) => setOgImage(e.target.value)}
                            className={styles.textInput}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <div className={styles.labelRow}>
                            <span className={styles.label}>Twitter / X Creator Handle</span>
                        </div>
                        <input
                            type="text"
                            value={twitterHandle}
                            onChange={(e) => setTwitterHandle(e.target.value)}
                            className={styles.textInput}
                        />
                    </div>
                </div>

                {/* Previews */}
                <div className={styles.card}>
                    <h2 className={styles.cardTitle}>👁️ Real-Time Live Previews</h2>

                    <div className={styles.previewTabs}>
                        <button
                            className={`${styles.previewTabBtn} ${previewTab === 'google' ? styles.previewTabBtnActive : ''}`}
                            onClick={() => setPreviewTab('google')}
                        >
                            Google SERP
                        </button>
                        <button
                            className={`${styles.previewTabBtn} ${previewTab === 'twitter' ? styles.previewTabBtnActive : ''}`}
                            onClick={() => setPreviewTab('twitter')}
                        >
                            Twitter / X Card
                        </button>
                    </div>

                    {previewTab === 'google' && (
                        <div className={styles.serpBox}>
                            <div className={styles.serpUrl}>
                                <span className={styles.serpFavicon} />
                                <span>{url.replace('https://', '').replace('http://', '')}</span>
                            </div>
                            <div className={styles.serpTitle}>{title || 'Your Page Title'}</div>
                            <div className={styles.serpSnippet}>{description || 'Your meta description will appear here on Google search results...'}</div>
                        </div>
                    )}

                    {previewTab === 'twitter' && (
                        <div className={styles.twitterBox}>
                            <div className={styles.twitterImagePlaceholder}>
                                <div>
                                    <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{siteName}</div>
                                    <div style={{ fontSize: '0.85rem', opacity: 0.8, marginTop: '4px' }}>1200 × 630 Social Preview Image</div>
                                </div>
                            </div>
                            <div className={styles.twitterMeta}>
                                <div className={styles.twitterDomain}>{url.replace('https://', '').replace('http://', '').split('/')[0]}</div>
                                <div className={styles.twitterTitle}>{title}</div>
                                <div className={styles.twitterDesc}>{description}</div>
                            </div>
                        </div>
                    )}

                    <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <button
                            onClick={copyCode}
                            style={{
                                background: '#0ea5e9',
                                color: '#0f172a',
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
                            {copied ? '✓ Copied to Clipboard!' : '📋 Copy Ready Code'}
                        </button>
                        <Link
                            href={`/#founder-form?website=${encodeURIComponent(url || '')}&product=${encodeURIComponent(siteName || '')}&source=meta-generator`}
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
                            Run Full On-Page SEO Audit →
                        </Link>
                    </div>
                </div>
            </div>

            {/* Generated Code Display */}
            <div className={styles.codeSection}>
                <div className={styles.codeHeader}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                            className={`${styles.previewTabBtn} ${codeTab === 'nextjs' ? styles.previewTabBtnActive : ''}`}
                            onClick={() => setCodeTab('nextjs')}
                        >
                            Next.js App Router (TypeScript / JavaScript)
                        </button>
                        <button
                            className={`${styles.previewTabBtn} ${codeTab === 'html' ? styles.previewTabBtnActive : ''}`}
                            onClick={() => setCodeTab('html')}
                        >
                            Standard HTML &lt;head&gt;
                        </button>
                    </div>
                    <button
                        onClick={copyCode}
                        style={{
                            background: '#ffffff',
                            border: '1.5px solid #cbd5e1',
                            color: '#1e293b',
                            padding: '0.45rem 0.9rem',
                            borderRadius: '0.5rem',
                            fontSize: '0.82rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                        }}
                    >
                        {copied ? '✓ Copied!' : 'Copy Code'}
                    </button>
                </div>
                <pre className={styles.codePre}>
                    <code>{generatedCode}</code>
                </pre>
            </div>

            <Founding50FunnelBanner
                toolId="meta-generator"
                toolName="Meta & OpenGraph Generator"
                prefillWebsite={url}
                prefillProduct={siteName}
                headline={
                    <>
                        Social cards configured?{' '}
                        <span style={{
                            background: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            Showcase {siteName || 'your SaaS'} to high-intent early adopters.
                        </span>
                    </>
                }
                description="Founding 50 members receive verified builder badges, direct indexed backlinks in The Vault, curated directory syndication, and 100% free permanent listing."
                ctaText="Submit Product for Founding 50 Review →"
            />

            <ToolShareCard
                toolTitle="SaaS Meta & OpenGraph Generator"
                score="100% SERP & Social Ready"
                shareText="I just generated pixel-perfect Next.js metadata and Twitter cards using @LaunchXact free Meta Generator:"
                shareUrl="https://www.launchxact.com/tools/meta-generator"
            />
        </div>
    );
}
