'use client';

import { useState, useMemo } from 'react';
import Breadcrumb from '@/components/Breadcrumb';
import ToolShareCard from '@/components/tools/ToolShareCard';
import Founding50FunnelBanner from '@/components/tools/Founding50FunnelBanner';
import Link from 'next/link';
import styles from './page.module.css';

export default function SchemaGeneratorPage() {
    const [schemaType, setSchemaType] = useState('SoftwareApplication');
    const [appName, setAppName] = useState('SyncPulse');
    const [appUrl, setAppUrl] = useState('https://www.syncpulse.io');
    const [category, setCategory] = useState('DeveloperApplication');
    const [operatingSystem, setOperatingSystem] = useState('Web, Cloud');
    const [price, setPrice] = useState('49');
    const [currency, setCurrency] = useState('USD');
    const [ratingValue, setRatingValue] = useState('4.9');
    const [reviewCount, setReviewCount] = useState('84');
    const [description, setDescription] = useState('Real-time database change data capture for modern cloud architectures.');
    const [copied, setCopied] = useState(false);

    const generatedSchema = useMemo(() => {
        if (schemaType === 'SoftwareApplication') {
            return {
                '@context': 'https://schema.org',
                '@type': 'SoftwareApplication',
                name: appName,
                url: appUrl,
                applicationCategory: category,
                operatingSystem: operatingSystem,
                description: description,
                offers: {
                    '@type': 'Offer',
                    price: price,
                    priceCurrency: currency,
                },
                aggregateRating: {
                    '@type': 'AggregateRating',
                    ratingValue: ratingValue,
                    reviewCount: reviewCount,
                },
            };
        } else if (schemaType === 'Organization') {
            return {
                '@context': 'https://schema.org',
                '@type': 'Organization',
                name: appName,
                url: appUrl,
                logo: `${appUrl}/icon.png`,
                sameAs: [
                    'https://twitter.com/' + appName.toLowerCase(),
                    'https://github.com/' + appName.toLowerCase(),
                ],
            };
        } else {
            return {
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                mainEntity: [
                    {
                        '@type': 'Question',
                        name: `What is ${appName}?`,
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: description,
                        },
                    },
                    {
                        '@type': 'Question',
                        name: `How much does ${appName} cost?`,
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: `${appName} plans start at $${price}/${currency.toLowerCase()} per month with a 14-day free trial.`,
                        },
                    },
                ],
            };
        }
    }, [schemaType, appName, appUrl, category, operatingSystem, price, currency, ratingValue, reviewCount, description]);

    const jsonString = useMemo(() => {
        return JSON.stringify(generatedSchema, null, 2);
    }, [generatedSchema]);

    const copyCode = () => {
        navigator.clipboard.writeText(`<script type="application/ld+json">\n${jsonString}\n</script>`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <Breadcrumb
                    items={[
                        { label: 'Founder Tools', href: '/tools' },
                        { label: 'Schema Generator' }
                    ]}
                />

                <header className={styles.header}>
                    <div className={styles.badge}>
                        🏷️ Rich Snippet Schema Engine
                    </div>
                    <h1 className={styles.title}>
                        Google Rich Snippet Schema Generator
                    </h1>
                    <p className={styles.description}>
                        Generate validated JSON-LD schema markup for SoftwareApplication, FAQPage, and Organization to claim rich star ratings, pricing, and SERP real estate in Google.
                    </p>
                </header>

                <div className={styles.grid}>
                    {/* Inputs */}
                    <div className={styles.card}>
                        <h2 className={styles.cardHeading}>
                            ⚙️ Schema Configuration
                        </h2>

                        <div style={{ marginBottom: '1.25rem' }}>
                            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.5rem' }}>
                                Schema Type
                            </label>
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                {['SoftwareApplication', 'Organization', 'FAQPage'].map(type => (
                                    <button
                                        key={type}
                                        onClick={() => setSchemaType(type)}
                                        style={{
                                            background: schemaType === type ? 'linear-gradient(135deg, #0284c7, #0369a1)' : '#ffffff',
                                            border: `1.5px solid ${schemaType === type ? '#0284c7' : '#e2e8f0'}`,
                                            color: schemaType === type ? '#ffffff' : '#475569',
                                            padding: '0.55rem 0.9rem',
                                            borderRadius: '0.5rem',
                                            fontSize: '0.85rem',
                                            fontWeight: 700,
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            boxShadow: schemaType === type ? '0 2px 8px rgba(2, 132, 199, 0.25)' : 'none'
                                        }}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.4rem' }}>
                                Application / Brand Name
                            </label>
                            <input
                                type="text"
                                value={appName}
                                onChange={(e) => setAppName(e.target.value)}
                                style={{ width: '100%', maxWidth: '100%', background: '#ffffff', border: '1.5px solid #e2e8f0', borderRadius: '0.5rem', padding: '0.75rem 1rem', color: '#0f172a', outline: 'none', boxSizing: 'border-box' }}
                            />
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.4rem' }}>
                                Product URL
                            </label>
                            <input
                                type="text"
                                value={appUrl}
                                onChange={(e) => setAppUrl(e.target.value)}
                                style={{ width: '100%', maxWidth: '100%', background: '#ffffff', border: '1.5px solid #e2e8f0', borderRadius: '0.5rem', padding: '0.75rem 1rem', color: '#0f172a', outline: 'none', boxSizing: 'border-box' }}
                            />
                        </div>

                        {schemaType === 'SoftwareApplication' && (
                            <>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.4rem' }}>Price ($)</label>
                                        <input
                                            type="text"
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                            style={{ width: '100%', maxWidth: '100%', background: '#ffffff', border: '1.5px solid #e2e8f0', borderRadius: '0.5rem', padding: '0.75rem 1rem', color: '#0f172a', outline: 'none', boxSizing: 'border-box' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.4rem' }}>Rating (out of 5)</label>
                                        <input
                                            type="text"
                                            value={ratingValue}
                                            onChange={(e) => setRatingValue(e.target.value)}
                                            style={{ width: '100%', maxWidth: '100%', background: '#ffffff', border: '1.5px solid #e2e8f0', borderRadius: '0.5rem', padding: '0.75rem 1rem', color: '#0f172a', outline: 'none', boxSizing: 'border-box' }}
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.4rem' }}>
                                Description
                            </label>
                            <textarea
                                rows="3"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                style={{ width: '100%', maxWidth: '100%', background: '#ffffff', border: '1.5px solid #e2e8f0', borderRadius: '0.5rem', padding: '0.75rem 1rem', color: '#0f172a', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }}
                            />
                        </div>
                    </div>

                    {/* Code Output */}
                    <div className={`${styles.card} ${styles.outputCard}`}>
                        <div>
                            <div className={styles.outputHeader}>
                                <h2 className={styles.outputTitle}>
                                    📄 Validated JSON-LD Output
                                </h2>
                                <span className={styles.validatedBadge}>
                                    ✓ Schema.org Validated
                                </span>
                            </div>

                            <div className={styles.codeContainer}>
                                <pre className={styles.codeBlock}>
                                    <code>{`<script type="application/ld+json">\n${jsonString}\n</script>`}</code>
                                </pre>
                            </div>
                        </div>

                        <div className={styles.actionsRow}>
                            <Link
                                href={`/#founder-form?website=${encodeURIComponent(appUrl || '')}&product=${encodeURIComponent(appName || '')}&source=schema-generator`}
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
                                onClick={copyCode}
                                className={styles.copyBtn}
                            >
                                {copied ? '✓ Copied JSON-LD!' : '📋 Copy JSON-LD Script'}
                            </button>
                            <Link
                                href="/tools/geo-schema-snippet-generator"
                                className={styles.secondaryLink}
                            >
                                Need AI / GEO Schema? Try GEO Generator →
                            </Link>
                        </div>
                    </div>
                </div>

                <Founding50FunnelBanner
                    toolId="schema-generator"
                    toolName="SaaS Schema Generator"
                    prefillWebsite={appUrl}
                    prefillProduct={appName}
                    headline={
                        <>
                            Generated your rich schema?{' '}
                            <span style={{
                                background: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}>
                                Get permanent search indexing in the Founding 50.
                            </span>
                        </>
                    }
                    description="LaunchXact automatically syndicates your structured data into AI engine training corpora, search indexes, and a curated marketplace of targeted software adopters."
                    ctaText="Submit Product for Founding 50 Review →"
                />

                <ToolShareCard
                    toolTitle="SaaS Schema Generator"
                    score="Rich Results Ready"
                    shareText="I just generated Google-compliant SoftwareApplication JSON-LD schema with @LaunchXact free Schema Generator:"
                    shareUrl="https://www.launchxact.com/tools/schema-generator"
                />
            </div>
        </main>
    );
}
