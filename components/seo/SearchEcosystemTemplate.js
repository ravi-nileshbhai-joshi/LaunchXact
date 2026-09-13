'use client';

import { useState } from 'react';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import GradePage from '@/app/grade/page';
import PaymentCostSimulator from '@/components/tools/PaymentCostSimulator';
import FrankenStackForecaster from '@/components/tools/FrankenStackForecaster';
import { getSearchSpoke, getSearchCluster } from '@/data/search-ecosystem';
import styles from './SearchEcosystem.module.css';

export default function SearchEcosystemTemplate({ spoke }) {
    const [openFaqIndices, setOpenFaqIndices] = useState([0]); // First FAQ open by default

    const toggleFaq = (index) => {
        setOpenFaqIndices(prev => 
            prev.includes(index) 
                ? prev.filter(i => i !== index) 
                : [...prev, index]
        );
    };

    if (!spoke) return null;

    const cluster = getSearchCluster(spoke.clusterId);
    const relatedSpokesData = (spoke.relatedSlugs || [])
        .map(slug => getSearchSpoke(slug))
        .filter(Boolean);

    // JSON-LD Structured Data
    const articleJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        headline: spoke.title,
        description: spoke.metaDescription,
        url: `https://www.launchxact.com/${spoke.slug}`,
        datePublished: '2026-01-15T08:00:00Z',
        dateModified: new Date().toISOString().split('T')[0],
        author: {
            '@type': 'Organization',
            name: 'LaunchXact Research Lab',
            url: 'https://www.launchxact.com'
        },
        publisher: {
            '@type': 'Organization',
            name: 'LaunchXact',
            url: 'https://www.launchxact.com',
            logo: {
                '@type': 'ImageObject',
                url: 'https://www.launchxact.com/icon.png'
            }
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `https://www.launchxact.com/${spoke.slug}`
        }
    };

    const softwareJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: cluster?.toolName || 'LaunchXact Founder Tool',
        url: `https://www.launchxact.com/${spoke.slug}#interactive-tool`,
        applicationCategory: 'BusinessApplication, DeveloperApplication, UtilitiesApplication',
        operatingSystem: 'Web, All',
        browserRequirements: 'Requires JavaScript',
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD'
        },
        creator: {
            '@type': 'Organization',
            name: 'LaunchXact',
            url: 'https://www.launchxact.com'
        }
    };

    const faqJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: (spoke.faqs || []).map(item => ({
            '@type': 'Question',
            name: item.q,
            acceptedAnswer: {
                '@type': 'Answer',
                text: item.a
            }
        }))
    };

    const breadcrumbJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://www.launchxact.com'
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: 'Founder Tools',
                item: 'https://www.launchxact.com/tools'
            },
            {
                '@type': 'ListItem',
                position: 3,
                name: spoke.title,
                item: `https://www.launchxact.com/${spoke.slug}`
            }
        ]
    };

    // Render corresponding embedded interactive tool
    const renderEmbeddedTool = () => {
        switch (spoke.clusterId) {
            case 'grader':
                return <GradePage isEmbeddedSpoke={true} hideBreadcrumb={true} />;
            case 'payments':
                return <PaymentCostSimulator isEmbeddedSpoke={true} />;
            case 'stack':
                return <FrankenStackForecaster isEmbeddedSpoke={true} />;
            default:
                return null;
        }
    };

    return (
        <main className={styles.container}>
            {/* Structured Data Scripts */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />

            <div className={styles.inner}>
                {/* Breadcrumb Navigation */}
                <div style={{ marginBottom: '1.75rem' }}>
                    <Breadcrumb items={[
                        { label: 'Founder Tools', href: '/tools' },
                        { label: cluster?.name || 'Search Ecosystem', href: cluster?.toolUrl || '/tools' },
                        { label: spoke.title }
                    ]} />
                </div>

                {/* Header */}
                <header className={styles.header}>
                    <div className={styles.badgeRow}>
                        <span className={styles.clusterBadge}>
                            🔥 {spoke.badge || cluster?.badge}
                        </span>
                        <span className={styles.readingBadge}>
                            ⏱️ {spoke.readingTime}
                        </span>
                        <span className={styles.readingBadge}>
                            📅 Updated September 2026
                        </span>
                    </div>

                    <h1 className={styles.title}>
                        {spoke.heroH1}
                    </h1>

                    <p className={styles.subtitle}>
                        {spoke.heroSubtitle}
                    </p>
                </header>

                {/* Direct Answer Box (Google AI Overviews / Featured Snippets / GEO) */}
                {spoke.directAnswer && (
                    <section className={styles.directAnswerBox} aria-label="Key Takeaways and Direct Answer">
                        <div className={styles.directAnswerHeader}>
                            <span>⚡</span> Direct Answer & Key Takeaway
                        </div>
                        <p className={styles.directAnswerText}>
                            {spoke.directAnswer}
                        </p>
                    </section>
                )}

                {/* Two-Column Layout */}
                <div className={styles.layout}>
                    {/* Main Content Body */}
                    <article className={styles.article}>
                        {/* Part 1: Editorial Content Before Tool */}
                        <div 
                            className={styles.articleBody}
                            dangerouslySetInnerHTML={{ __html: spoke.introHtml }}
                        />

                        {/* LIVE EMBEDDED TOOL IN THE MIDDLE */}
                        <section id="interactive-tool" className={styles.toolAnchorSection} aria-label="Interactive Tool Engine">
                            <div className={styles.toolAnchorHeader}>
                                <span className={styles.toolBadge}>
                                    ⚙️ Live Algorithmic Simulator
                                </span>
                                <p className={styles.toolPromptText}>
                                    {spoke.toolPrompt || 'Run your numbers through the live diagnostic engine below:'}
                                </p>
                            </div>

                            <div className={styles.embeddedToolContainer}>
                                {renderEmbeddedTool()}
                            </div>
                        </section>

                        {/* Part 2: Editorial Content After Tool */}
                        <div 
                            className={styles.articleBody}
                            dangerouslySetInnerHTML={{ __html: spoke.outroHtml }}
                        />

                        {/* Interactive FAQ Accordion */}
                        {spoke.faqs && spoke.faqs.length > 0 && (
                            <section id="faq" className={styles.faqSection} aria-label="Frequently Asked Questions">
                                <h2 className={styles.faqSectionTitle}>Frequently Asked Questions</h2>
                                <div className={styles.faqList}>
                                    {spoke.faqs.map((faq, idx) => {
                                        const isOpen = openFaqIndices.includes(idx);
                                        return (
                                            <div key={idx} className={styles.faqItem}>
                                                <button
                                                    type="button"
                                                    className={styles.faqQuestion}
                                                    onClick={() => toggleFaq(idx)}
                                                    aria-expanded={isOpen}
                                                >
                                                    <span>{faq.q}</span>
                                                    <span className={`${styles.faqChevron} ${isOpen ? styles.faqChevronOpen : ''}`}>
                                                        ▼
                                                    </span>
                                                </button>
                                                {isOpen && (
                                                    <div className={styles.faqAnswer}>
                                                        {faq.a}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        )}

                        {/* High-Converting LaunchXact CTA Banner */}
                        <section className={styles.ctaBanner}>
                            <span className={styles.ctaBadge}>
                                LaunchXact Founder Network
                            </span>
                            <h2 className={styles.ctaTitle}>
                                Build, Launch & Distribute Your SaaS
                            </h2>
                            <p className={styles.ctaDesc}>
                                Join hundreds of ambitious software founders using LaunchXact to get discovered, collect payments globally without tax headaches, and scale sustained organic traffic.
                            </p>
                            <Link href="/checkout/fast-track" className={styles.ctaButton}>
                                🚀 Fast-Track Your Product Submission →
                            </Link>
                        </section>

                        {/* Cluster Interlinking Section */}
                        {relatedSpokesData.length > 0 && (
                            <section className={styles.clusterSection} aria-label="Related Guides in this Search Ecosystem">
                                <div className={styles.clusterHeader}>
                                    <h2 className={styles.clusterTitle}>
                                        Explore More Guides in the {cluster?.name} Ecosystem
                                    </h2>
                                    <p className={styles.clusterSubtitle}>
                                        Deep-dive into related frameworks, financial benchmarks, and operational playbooks:
                                    </p>
                                </div>

                                <div className={styles.spokeGrid}>
                                    {relatedSpokesData.map(rel => (
                                        <Link 
                                            key={rel.slug} 
                                            href={`/${rel.slug}`} 
                                            className={styles.spokeCard}
                                        >
                                            <div>
                                                <span className={styles.spokeCardBadge}>
                                                    {rel.badge}
                                                </span>
                                                <h3 className={styles.spokeCardTitle}>
                                                    {rel.title}
                                                </h3>
                                            </div>
                                            <div className={styles.spokeCardMeta}>
                                                <span>⏱️ {rel.readingTime}</span>
                                                <span>•</span>
                                                <span>Read Guide →</span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}
                    </article>

                    {/* Desktop Sticky Table of Contents */}
                    {spoke.toc && spoke.toc.length > 0 && (
                        <aside className={styles.sidebar} aria-label="Table of Contents">
                            <div className={styles.tocCard}>
                                <div className={styles.tocTitle}>Table of Contents</div>
                                <ul className={styles.tocList}>
                                    {spoke.toc.map(item => (
                                        <li key={item.id} className={styles.tocItem}>
                                            <a href={`#${item.id}`}>
                                                {item.label}
                                            </a>
                                        </li>
                                    ))}
                                    <li className={styles.tocItem}>
                                        <a href="#interactive-tool" style={{ color: '#7c3aed', fontWeight: 600 }}>
                                            ⚡ Jump to Interactive Tool
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </aside>
                    )}
                </div>
            </div>
        </main>
    );
}
