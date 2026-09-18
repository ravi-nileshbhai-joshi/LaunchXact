'use client';
import Link from 'next/link';
import { trackAcquisitionEvent, ACQUISITION_EVENTS } from '@/lib/acquisition';
import styles from './Founding50FunnelBanner.module.css';

/**
 * Founding50FunnelBanner
 * High-converting funnel component embedded across all tools to bridge 
 * testers and builders directly into the Founding 50 submission flow.
 */
export default function Founding50FunnelBanner({
    toolId = 'founder-tool',
    toolName = 'LaunchXact Tool',
    prefillWebsite = '',
    prefillProduct = '',
    headline = '',
    description = '',
    ctaText = 'Apply for Founding 50 →'
}) {
    // Construct submission URL with prefill parameters
    const queryParams = new URLSearchParams();
    if (prefillWebsite) queryParams.set('website', prefillWebsite);
    if (prefillProduct) queryParams.set('product', prefillProduct);
    queryParams.set('source', toolId);

    const targetUrl = `/#founder-form?${queryParams.toString()}`;

    const handleCtaClick = () => {
        trackAcquisitionEvent(ACQUISITION_EVENTS.GENESIS_APPLICATION, { 
            toolId,
            metadata: { prefillWebsite, prefillProduct }
        });
    };

    return (
        <section className={styles.bannerContainer}>
            <div className={styles.glowTop} />
            <div className={styles.innerContent}>
                <div className={styles.topBadgeRow}>
                    <div className={styles.badge}>
                        <span className={styles.badgePulse} />
                        <span>🚀 Tested with {toolName}? Claim Your Launch Spot</span>
                    </div>
                    <span className={styles.spotsLeft}>Founding 50 Cohort · Curated Selection</span>
                </div>

                <h2 className={styles.headline}>
                    {headline || (
                        <>
                            Turn your diagnosis into distribution. <span className={styles.gradientText}>Join the Founding 50.</span>
                        </>
                    )}
                </h2>

                <p className={styles.description}>
                    {description || (
                        'Stop shipping in isolation. Every submission is manually tested for real problem-solving utility and market defensibility. Accepted products receive a 100% free permanent listing in The Vault and direct indexing into AI search engines.'
                    )}
                </p>

                <div className={styles.benefitsGrid}>
                    <div className={styles.benefitItem}>
                        <span className={styles.benefitIcon}>🏛️</span>
                        <span className={styles.benefitTitle}>Permanent Vault Listing</span>
                        <span className={styles.benefitDesc}>Permanent high-authority DoFollow backlink that never expires.</span>
                    </div>
                    <div className={styles.benefitItem}>
                        <span className={styles.benefitIcon}>💎</span>
                        <span className={styles.benefitTitle}>100% Free Listing</span>
                        <span className={styles.benefitDesc}>We never charge founders to list products. Keep 100% of your customer revenue.</span>
                    </div>
                    <div className={styles.benefitItem}>
                        <span className={styles.benefitIcon}>🤖</span>
                        <span className={styles.benefitTitle}>AI Engine Syndication</span>
                        <span className={styles.benefitDesc}>Indexed by Perplexity, ChatGPT Search, and Google AI Overviews.</span>
                    </div>
                    <div className={styles.benefitItem}>
                        <span className={styles.benefitIcon}>🔍</span>
                        <span className={styles.benefitTitle}>Hand-Curated Quality</span>
                        <span className={styles.benefitDesc}>Manually tested and vetted for real market gap, alternatives, and genuine utility.</span>
                    </div>
                </div>

                <div className={styles.actionCluster}>
                    <Link
                        href={targetUrl}
                        onClick={handleCtaClick}
                        className={styles.primaryBtn}
                    >
                        <span>{ctaText}</span>
                    </Link>
                    <Link href="/grade" className={styles.secondaryBtn}>
                        <span>⚡ Run Free SaaS Viability Grader →</span>
                    </Link>
                    <Link href="/tools" className={styles.secondaryBtn}>
                        <span>🛠️ Explore All 13 Founder Tools</span>
                    </Link>
                </div>

                <div className={styles.trustFooter}>
                    <div className={styles.trustItem}>
                        <span>✓</span>
                        <span>Zero upfront listing fee</span>
                    </div>
                    <div className={styles.trustItem}>
                        <span>✓</span>
                        <span>No recurring monthly charge</span>
                    </div>
                    <div className={styles.trustItem}>
                        <span>✓</span>
                        <span>No mandatory backlink required</span>
                    </div>
                    <div className={styles.trustItem}>
                        <span>✓</span>
                        <span>100% human editorial review</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
