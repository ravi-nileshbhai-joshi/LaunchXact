'use client';
import { useState } from 'react';
import { logToolTelemetry } from '@/lib/telemetry';
import styles from './ToolShareCard.module.css';

/**
 * ToolShareCard
 * Reusable Layer 4 "Share My Result" viral growth loop component.
 */
export default function ToolShareCard({
    badge = 'Tool Result',
    statHighlight = '$0',
    statLabel = 'Annual Cost',
    subMetrics = [],
    quote = '',
    toolName = 'LaunchXact Tool',
    toolUrl = 'https://www.launchxact.com/tools',
    shareTextX = '',
    shareTitleReddit = '',
    shareTextReddit = '',
    copySummaryText = '',
}) {
    const [copied, setCopied] = useState(false);

    // Intent URLs
    const twitterIntent = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTextX || `${quote}\n\nCalculate yours → ${toolUrl}`)}`;
    const redditIntent = `https://www.reddit.com/submit?title=${encodeURIComponent(shareTitleReddit || `${toolName} Audit Result`)}&text=${encodeURIComponent(shareTextReddit || `${quote}\n\nCalculate yours at: ${toolUrl}`)}`;
    const linkedInIntent = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(toolUrl)}`;

    const handleCopy = () => {
        logToolTelemetry({ toolId: toolName, action: 'copy_summary' });
        const textToCopy = copySummaryText || `${quote}\n\nCalculate yours here: ${toolUrl}`;
        navigator.clipboard?.writeText(textToCopy).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        });
    };

    const handleShareClick = (platform) => {
        logToolTelemetry({ toolId: toolName, action: `share_${platform}` });
    };

    return (
        <div className={styles.shareLoopContainer}>
            <div className={styles.sectionHeader}>
                <span className={styles.sectionBadge}>✦ Growth Loop · Share Your Result</span>
                <h3 className={styles.sectionHeading}>Share Your Diagnosis & Challenge Other Founders</h3>
                <p className={styles.sectionSubtext}>
                    Compare your numbers with other indie builders on X and Reddit. Turn your diagnosis into distribution.
                </p>
            </div>

            {/* Visual Social Card Preview */}
            <div className={styles.socialCardWrapper}>
                <div className={styles.socialCard}>
                    <div className={styles.cardGlow} />
                    
                    {/* Top Row: Brand + Status */}
                    <div className={styles.cardTopRow}>
                        <div className={styles.brandGroup}>
                            <span className={styles.brandIcon}>▲</span>
                            <span className={styles.brandName}>LaunchXact</span>
                            <span className={styles.brandDivider}>/</span>
                            <span className={styles.toolSlug}>{toolName}</span>
                        </div>
                        <span className={styles.cardPill}>{badge}</span>
                    </div>

                    {/* Hero Stat in Card */}
                    <div className={styles.cardStatHero}>
                        <div className={styles.statNumber}>{statHighlight}</div>
                        <div className={styles.statLabel}>{statLabel}</div>
                    </div>

                    {/* Sub Metrics Pills */}
                    {subMetrics && subMetrics.length > 0 && (
                        <div className={styles.subMetricsGrid}>
                            {subMetrics.map((item, idx) => (
                                <div key={idx} className={styles.subMetricItem}>
                                    <span className={styles.subMetricValue}>{item.value}</span>
                                    <span className={styles.subMetricLabel}>{item.label}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Quote / Discovery Callout */}
                    {quote && (
                        <div className={styles.quoteBox}>
                            <span className={styles.quoteMark}>“</span>
                            <p className={styles.quoteText}>{quote}</p>
                        </div>
                    )}

                    {/* Card Footer Watermark */}
                    <div className={styles.cardFooter}>
                        <span className={styles.watermarkUrl}>
                            launchxact.com/tools
                        </span>
                        <span className={styles.watermarkTag}>Verified Diagnosis</span>
                    </div>
                </div>
            </div>

            {/* Direct 1-Click Action Buttons */}
            <div className={styles.actionsRow}>
                <a
                    href={twitterIntent}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleShareClick('x')}
                    className={`${styles.shareBtn} ${styles.btnTwitter}`}
                    id="share-to-x-btn"
                >
                    <svg className={styles.btnIcon} viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    Post to 𝕏
                </a>

                <a
                    href={redditIntent}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleShareClick('reddit')}
                    className={`${styles.shareBtn} ${styles.btnReddit}`}
                    id="share-to-reddit-btn"
                >
                    <svg className={styles.btnIcon} viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                        <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.702zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.197-2.512-.73a.326.326 0 0 0-.232-.095z" />
                    </svg>
                    Post to Reddit
                </a>

                <a
                    href={linkedInIntent}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleShareClick('linkedin')}
                    className={`${styles.shareBtn} ${styles.btnLinkedIn}`}
                    id="share-to-linkedin-btn"
                >
                    <svg className={styles.btnIcon} viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                    Share on LinkedIn
                </a>

                <button
                    type="button"
                    onClick={handleCopy}
                    className={`${styles.shareBtn} ${styles.btnCopy}`}
                    id="copy-summary-btn"
                >
                    <svg className={styles.btnIcon} viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M8 4v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7.242a2 2 0 0 0-.602-1.43L16.083 2.57A2 2 0 0 0 14.685 2H10a2 2 0 0 0-2 2z" />
                        <path d="M16 18v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h2" />
                    </svg>
                    {copied ? '✓ Copied to Clipboard!' : 'Copy Summary & Link'}
                </button>
            </div>
        </div>
    );
}
