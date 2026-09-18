'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import ToolShareCard from './ToolShareCard';
import Founding50FunnelBanner from './Founding50FunnelBanner';
import styles from './LaunchChecklist.module.css';

const CHECKLIST_DATA = [
    {
        phaseId: 'validation',
        phaseName: 'Phase 1: Pre-Build Problem & WTP Validation',
        badge: 'Validation',
        icon: '🎯',
        items: [
            { id: 'val-1', title: '5+ Live ICP Interviews Completed', desc: 'Spoke directly with 5 verified potential customers who experience this bleeding-neck pain daily.', tag: 'Urgent' },
            { id: 'val-2', title: 'Explicit Willingness-To-Pay (WTP) Confirmed', desc: 'Secured at least 1 paid pre-order or letter of intent before writing frontend code.', tag: 'Critical' },
            { id: 'val-3', title: 'Competitor Moat & Defensibility Audited', desc: 'Ensured core value is not a thin OpenAI wrapper that foundation models can clone in 1 prompt.', tag: 'Moat' },
            { id: 'val-4', title: 'Ideal Customer Profile (ICP) Documented', desc: 'Identified exact job title, company size, and specific tool stack your buyer uses daily.', tag: 'Core' },
            { id: 'val-5', title: 'Landing Page Lead Capture Live', desc: 'Setup waitlist page with email notification to measure visitor interest and baseline conversion.', tag: 'Lead' },
        ]
    },
    {
        phaseId: 'technical',
        phaseName: 'Phase 2: Tech Hardening, Auth & Database Safety',
        badge: 'Security',
        icon: '🛡️',
        items: [
            { id: 'tech-1', title: 'Passwordless or Social Auth Flow Verified', desc: 'Tested sign-up, email verification, password reset, and session expiry edge cases.', tag: 'Auth' },
            { id: 'tech-2', title: 'Database Row-Level Security (RLS) Enforced', desc: 'Verified that multi-tenant data cannot leak across user organizations in PostgreSQL/Supabase.', tag: 'Critical' },
            { id: 'tech-3', title: 'Production Error Tracking Setup (Sentry/LogRocket)', desc: 'Installed client & server crash instrumentation to capture unhandled promise rejections.', tag: 'DevOps' },
            { id: 'tech-4', title: 'Automated Database Backups Configured', desc: 'Daily automated snapshot backups enabled with tested point-in-time recovery.', tag: 'Data' },
            { id: 'tech-5', title: 'API Rate Limiting & DDOS Protection', desc: 'Enabled Redis/Cloudflare rate limiting to protect LLM endpoints against credit exhaustion.', tag: 'Safety' },
            { id: 'tech-6', title: 'Mobile Responsiveness & Viewport Audit', desc: 'Tested all core flows on iPhone, Android, and tablets to ensure zero layout breakage.', tag: 'UI/UX' },
            { id: 'tech-7', title: 'SSL/TLS & Custom Domain DNS Propagated', desc: 'Verified HTTPS enforcement, HSTS headers, and non-www to www canonical redirection.', tag: 'Infra' },
        ]
    },
    {
        phaseId: 'payments',
        phaseName: 'Phase 3: Payments, MoR & Global Tax Compliance',
        badge: 'Finance',
        icon: '💳',
        items: [
            { id: 'pay-1', title: 'Merchant of Record (MoR) or Gateway Configured', desc: 'Integrated D協力/LemonSqueezy/Paddle or Stripe with full test-mode transaction passes.', tag: 'Revenue' },
            { id: 'pay-2', title: 'Webhook Verification & Idempotency Handled', desc: 'Secured checkout.session.completed webhooks with signature checks and duplicate guards.', tag: 'Critical' },
            { id: 'pay-3', title: 'Automatic Upgrade/Downgrade Proration Tested', desc: 'Verified user tier updates immediately upon successful billing event without delay.', tag: 'Logic' },
            { id: 'pay-4', title: 'Self-Serve Customer Portal (Invoices & Receipts)', desc: 'Provided 1-click customer billing portal for card updates and VAT invoice downloads.', tag: 'SaaS' },
            { id: 'pay-5', title: 'Failed Payment (Dunning) Sequence Enabled', desc: 'Configured automated retry emails for expired cards to salvage 70%+ of involuntary churn.', tag: 'Retention' },
            { id: 'pay-6', title: 'Terms of Service, Privacy Policy & Refund Policy Live', desc: 'Published explicit GDPR-compliant terms and refund policy linked from checkout.', tag: 'Legal' },
        ]
    },
    {
        phaseId: 'seo',
        phaseName: 'Phase 4: SEO, OpenGraph & Generative Engine Prep',
        badge: 'Discovery',
        icon: '🔍',
        items: [
            { id: 'seo-1', title: 'Dynamic OpenGraph & Twitter Social Cards', desc: 'Tested 1200x630 OG image rendering across Twitter Card Validator and LinkedIn Debugger.', tag: 'Social' },
            { id: 'seo-2', title: 'JSON-LD SoftwareApplication Schema Embedded', desc: 'Injected structured data with rating, price, and category for Google Rich Snippets.', tag: 'Schema' },
            { id: 'seo-3', title: 'Robots.txt & XML Sitemap Verified', desc: 'Submitted dynamic XML sitemap to Google Search Console and allowed GPTBot/PerplexityBot.', tag: 'Crawling' },
            { id: 'seo-4', title: 'Unique Title (<60 chars) & Meta Description (<160 chars)', desc: 'Drafted high-CTR copy incorporating target buyer search query and distinct UVP.', tag: 'CTR' },
            { id: 'seo-5', title: 'Generative Engine Optimization (GEO) Direct Definition', desc: 'Included unambiguous "What is [Product]?" answer sentence for AI search citations.', tag: 'GEO' },
            { id: 'seo-6', title: 'Favicon Package (SVG, 32x32, Apple Touch Icon)', desc: 'Ensured sharp favicon renders in dark mode browser tabs and mobile bookmarks.', tag: 'Brand' },
        ]
    },
    {
        phaseId: 'launchday',
        phaseName: 'Phase 5: Launch Day Blastoff & Community Seeding',
        badge: 'Launch Day',
        icon: '🚀',
        items: [
            { id: 'ld-1', title: 'Product Hunt Scheduled for 12:01 AM PST', desc: 'Prepared gallery slides, first comment with founder story, and maker invite links.', tag: 'PH' },
            { id: 'ld-2', title: 'LaunchXact Founding 50 Application Submitted', desc: 'Submitted SaaS for LaunchXact hand-curated Founding 50 collection for permanent indexed discoverability.', tag: 'LaunchXact' },
            { id: 'ld-3', title: 'Hacker News "Show HN" Drafted', desc: 'Drafted plain-text technical breakdown focusing on engineering decisions, not marketing fluff.', tag: 'HN' },
            { id: 'ld-4', title: 'X / Twitter Launch Announcement Thread Scheduled', desc: 'Prepared visual hook, problem agitate solve demo video, and free trial call-to-action.', tag: 'Viral' },
            { id: 'ld-5', title: 'Niche Subreddits & Discord Communities Seeded', desc: 'Posted helpful case study in 3 target communities with organic problem teardown.', tag: 'Community' },
            { id: 'ld-6', title: 'Live Chat / Founder DM Monitoring Active', desc: 'All alerts on to respond to early adopters within 3 minutes of feedback or friction.', tag: 'Speed' },
        ]
    }
];

export default function LaunchChecklist() {
    const [checkedItems, setCheckedItems] = useState({});
    const [activeTab, setActiveTab] = useState('all');
    const [copied, setCopied] = useState(false);

    // Initialize from localStorage
    useEffect(() => {
        try {
            const saved = localStorage.getItem('launchxact_launch_checklist');
            if (saved) {
                setCheckedItems(JSON.parse(saved));
            }
        } catch (e) {
            console.error('Failed to load saved checklist', e);
        }
    }, []);

    // Save to localStorage
    const toggleItem = (id) => {
        setCheckedItems(prev => {
            const next = { ...prev, [id]: !prev[id] };
            try {
                localStorage.setItem('launchxact_launch_checklist', JSON.stringify(next));
            } catch (e) {}
            return next;
        });
    };

    // Calculate metrics
    const totalItems = useMemo(() => {
        return CHECKLIST_DATA.reduce((acc, p) => acc + p.items.length, 0);
    }, []);

    const completedCount = useMemo(() => {
        return Object.values(checkedItems).filter(Boolean).length;
    }, [checkedItems]);

    const percentComplete = Math.round((completedCount / totalItems) * 100) || 0;

    const resetChecklist = () => {
        if (window.confirm('Are you sure you want to reset your launch checklist progress?')) {
            setCheckedItems({});
            try {
                localStorage.removeItem('launchxact_launch_checklist');
            } catch (e) {}
        }
    };

    const exportToMarkdown = () => {
        let md = `# SaaS Launch Readiness Checklist (${percentComplete}% Complete)\n\n`;
        md += `*Generated via LaunchXact Launch Checklist - ${completedCount}/${totalItems} items completed*\n\n`;

        CHECKLIST_DATA.forEach(phase => {
            md += `## ${phase.phaseName}\n`;
            phase.items.forEach(item => {
                const isDone = !!checkedItems[item.id];
                md += `- [${isDone ? 'x' : ' '}] **${item.title}**: ${item.desc}\n`;
            });
            md += `\n`;
        });

        navigator.clipboard.writeText(md);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    const filteredPhases = useMemo(() => {
        if (activeTab === 'all') return CHECKLIST_DATA;
        return CHECKLIST_DATA.filter(p => p.phaseId === activeTab);
    }, [activeTab]);

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.badge}>
                    <span>🚀 Launch Accelerator Utility</span>
                </div>
                <h1 className={styles.title}>
                    Interactive SaaS <span style={{ color: '#8b5cf6' }}>Launch Checklist</span>
                </h1>
                <p className={styles.subtitle}>
                    The battle-tested 30-checkpoint protocol covering pre-build validation, technical hardening, MoR payment setup, SEO hygiene, and launch day traffic seeding.
                </p>
            </header>

            {/* Progress Card */}
            <div className={styles.progressCard}>
                <div className={styles.progressTop}>
                    <div className={styles.progressLabel}>
                        <span>Checklist Readiness Progress:</span>
                        <span style={{ color: '#475569', fontSize: '0.9rem', fontWeight: 500 }}>
                            ({completedCount} of {totalItems} items completed)
                        </span>
                    </div>
                    <div className={styles.progressPercent}>{percentComplete}%</div>
                </div>

                <div className={styles.progressBarTrack}>
                    <div
                        className={styles.progressBarFill}
                        style={{ width: `${percentComplete}%` }}
                    />
                </div>

                <div className={styles.actionsRow}>
                    <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                        <button onClick={exportToMarkdown} className={styles.actionBtn}>
                            {copied ? '✓ Copied Markdown!' : '📋 Export Checklist to Markdown'}
                        </button>
                        <button onClick={resetChecklist} className={styles.actionBtn} style={{ color: '#ef4444' }}>
                            ↺ Reset Progress
                        </button>
                    </div>
                    <Link
                        href="/grade"
                        style={{
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            color: '#8b5cf6',
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                        }}
                    >
                        Want AI to audit your landing page? Try Grader →
                    </Link>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className={styles.filterTabs}>
                <button
                    className={`${styles.tabBtn} ${activeTab === 'all' ? styles.tabBtnActive : ''}`}
                    onClick={() => setActiveTab('all')}
                >
                    All Phases ({totalItems})
                </button>
                {CHECKLIST_DATA.map(p => {
                    const phaseCompleted = p.items.filter(i => checkedItems[i.id]).length;
                    return (
                        <button
                            key={p.phaseId}
                            className={`${styles.tabBtn} ${activeTab === p.phaseId ? styles.tabBtnActive : ''}`}
                            onClick={() => setActiveTab(p.phaseId)}
                        >
                            {p.icon} {p.badge} ({phaseCompleted}/{p.items.length})
                        </button>
                    );
                })}
            </div>

            {/* Phases List */}
            {filteredPhases.map(phase => (
                <div key={phase.phaseId} className={styles.phaseSection}>
                    <div className={styles.phaseHeader}>
                        <div className={styles.phaseTitle}>
                            <span>{phase.icon}</span>
                            <span>{phase.phaseName}</span>
                        </div>
                        <span className={styles.phaseBadge}>
                            {phase.items.filter(i => checkedItems[i.id]).length} / {phase.items.length} Done
                        </span>
                    </div>

                    <div className={styles.itemsList}>
                        {phase.items.map(item => {
                            const isChecked = !!checkedItems[item.id];
                            return (
                                <div
                                    key={item.id}
                                    className={styles.checkItem}
                                    onClick={() => toggleItem(item.id)}
                                >
                                    <div className={`${styles.checkbox} ${isChecked ? styles.checkboxChecked : ''}`}>
                                        {isChecked && '✓'}
                                    </div>
                                    <div className={styles.itemContent}>
                                        <div className={`${styles.itemTitle} ${isChecked ? styles.itemTitleChecked : ''}`}>
                                            {item.title}
                                            {item.tag && <span className={styles.itemTag}>{item.tag}</span>}
                                        </div>
                                        <div className={`${styles.itemDesc} ${isChecked ? styles.itemDescChecked : ''}`}>
                                            {item.desc}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}

            <Founding50FunnelBanner
                toolId="launch-checklist"
                toolName="Interactive SaaS Launch Checklist"
                headline={
                    <>
                        Completed your launch protocol?{' '}
                        <span style={{
                            background: 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            Launch directly to early adopters & active builders.
                        </span>
                    </>
                }
                description="Founding 50 products receive curated spotlight placement, automated SEO schema syndication, 100% free permanent listing, and verified founder community access."
                ctaText="Submit Launch Checklist & Apply for Founding 50 →"
            />

            <ToolShareCard
                toolTitle="SaaS Launch Readiness Checklist"
                score={`${percentComplete}% Complete`}
                shareText={`I'm currently at ${percentComplete}% on the @LaunchXact SaaS Launch Checklist! Check your launch readiness for free:`}
                shareUrl="https://www.launchxact.com/tools/launch-checklist"
            />
        </div>
    );
}
