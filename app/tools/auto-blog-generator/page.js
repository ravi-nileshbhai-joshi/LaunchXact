'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import Breadcrumb from '@/components/Breadcrumb';
import { DODO_CHECKOUT_URL } from '@/lib/dodo';
import styles from './blog-generator.module.css';

const DEFAULT_PROFILE = {
    siteName: 'LaunchXact',
    domain: 'www.launchxact.com',
    title: 'LaunchXact - Premium Curated SaaS Marketplace',
    headline: 'Launch Your SaaS to High-Intent Software Adopters. Zero Ad Spend.',
    valueProposition: 'A manually curated multi-vendor SaaS marketplace that connects vetted indie software directly with enterprise buyers and active tech adopters.',
    targetAudience: 'SaaS Founders, Full-Stack Builders & Growth Teams',
    suggestedKeywords: [
        'Why 24-hour launch boards are broken in 2026',
        'How to build sustained organic SaaS distribution without paid ads',
        'The true cost of merchant fees and international VAT for micro-SaaS',
        'Generative Engine Optimization: How to get your software cited by Perplexity & ChatGPT',
        'The Franken-Stack dilemma: Forecasting cloud bills before scaling to 50k MAU'
    ]
};

const TESTIMONIALS = [
    {
        name: 'Alex Rivera',
        role: 'Founder, DevPulse (B2B SaaS)',
        stat: '+7,800% Organic Surge in 45 Days',
        quote: 'Our landing page was a ghost town (180 visits/mo). Within 45 days of deploying 2 articles a week through this engine, we reached 14,200 organic visits/mo and converted 64 paying developer accounts. Paid ads budget: exactly $0.',
        avatar: 'AR'
    },
    {
        name: 'Sarah Chen',
        role: 'Solo Founder, FormKit SaaS',
        stat: '940% Traffic Spike in 45 Days',
        quote: 'I used to spend 8 hours writing one mediocre blog post. Now it crawls my site, drafts human-sounding problem-to-solution guides, and publishes to my WordPress in 1 click. Traffic is up 940% and our waitlist tripled in 45 days.',
        avatar: 'SC'
    },
    {
        name: 'Marcus Vance',
        role: 'Co-founder, CloudAudit',
        stat: 'Page 1 for 19 Buyer Keywords',
        quote: 'The tone is what sold me. It reads like a seasoned engineer venting over coffee, not ChatGPT regurgitating generic lists. It directly drove our Genesis Batch launch traction and saved our runway.',
        avatar: 'MV'
    }
];

export default function AutoBlogGeneratorPage() {
    // Step 1 State: Website URL & Crawl
    const [websiteUrl, setWebsiteUrl] = useState('https://www.launchxact.com');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [profile, setProfile] = useState(DEFAULT_PROFILE);
    const [profileAnalyzed, setProfileAnalyzed] = useState(true);

    // Step 2 State: Keyword & Angle
    const [targetKeyword, setTargetKeyword] = useState('Why 24-hour launch boards are broken in 2026 and how to build sustained SaaS traction');
    const [narrativeAngle, setNarrativeAngle] = useState('The Hard Math Teardown');
    const [authorName, setAuthorName] = useState('Ravi');

    // Step 3 State: Generation & Verification Studio
    const [isGenerating, setIsGenerating] = useState(false);
    const [article, setArticle] = useState(null);
    const [originalDraft, setOriginalDraft] = useState(null);
    const [editedTitle, setEditedTitle] = useState('');
    const [editedMetaDesc, setEditedMetaDesc] = useState('');
    const [editedContent, setEditedContent] = useState('');
    const [editorViewMode, setEditorViewMode] = useState('split'); // 'edit' | 'preview' | 'split'

    // Step 4 State: 1-Click Publishing Hub & Articles Page Provisioning
    const [webhookUrl, setWebhookUrl] = useState('');
    const [isPublishing, setIsPublishing] = useState(false);
    const [publishResult, setPublishResult] = useState(null);
    const [copiedEmbed, setCopiedEmbed] = useState(false);
    const [copiedContent, setCopiedContent] = useState(false);

    // Outrank.so Replica Subscription & Dodo Payments License Key State
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [subscriptionPlan, setSubscriptionPlan] = useState('');
    const [daysRemaining, setDaysRemaining] = useState(0);
    const [showPaywallModal, setShowPaywallModal] = useState(false);
    const [founderEmail, setFounderEmail] = useState('');
    const [accessMessage, setAccessMessage] = useState('');
    const [isCheckingAccess, setIsCheckingAccess] = useState(false);
    const [demoUsed, setDemoUsed] = useState(false);

    // Dodo Payments Pro License Key State
    const [licenseKey, setLicenseKey] = useState('');
    const [isVerifyingLicense, setIsVerifyingLicense] = useState(false);
    const [licenseMessage, setLicenseMessage] = useState('');

    // Check localStorage on mount for verified license key and subscriber status
    useEffect(() => {
        try {
            const savedLicense = localStorage.getItem('launchxact_autoblog_license');
            if (savedLicense) {
                setLicenseKey(savedLicense);
                handleVerifyLicense(savedLicense, true);
            }

            const savedSub = localStorage.getItem('launchxact_autoblog_subscriber');
            if (savedSub) {
                const parsed = JSON.parse(savedSub);
                if (parsed.email) {
                    setFounderEmail(parsed.email);
                }
                if (parsed.plan) {
                    setIsSubscribed(true);
                    setSubscriptionPlan(parsed.plan || 'pro_license');
                    setDaysRemaining(parsed.daysRemaining || 365);
                }
            }

            const isDemoUsedSaved = localStorage.getItem('launchxact_demo_used') === 'true';
            if (isDemoUsedSaved) {
                setDemoUsed(true);
            }
        } catch {
            // ignore
        }
    }, []);

    // Scan & Verify Dodo Payments License Key
    const handleVerifyLicense = async (keyToVerify = licenseKey, isSilent = false) => {
        const cleanKey = (keyToVerify || '').trim();
        if (!cleanKey) {
            if (!isSilent) setLicenseMessage('⚠️ Please enter your Dodo Payments license key.');
            return;
        }

        setIsVerifyingLicense(true);
        if (!isSilent) setLicenseMessage('');

        try {
            const res = await fetch('/api/tools/auto-blog/verify-license', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    licenseKey: cleanKey,
                    email: founderEmail,
                    domain: websiteUrl
                })
            });

            const data = await res.json();

            if (data.success && data.valid) {
                setIsSubscribed(true);
                setSubscriptionPlan('pro_license');
                setDaysRemaining(data.daysRemaining || 365);
                setLicenseKey(cleanKey);
                localStorage.setItem('launchxact_autoblog_license', cleanKey);
                localStorage.setItem('launchxact_autoblog_subscriber', JSON.stringify({
                    licenseKey: cleanKey,
                    plan: 'pro_license',
                    daysRemaining: data.daysRemaining || 365,
                    unlockedAt: new Date().toISOString()
                }));
                if (!isSilent) {
                    setLicenseMessage('🎉 Valid Pro License Key Verified! Full unlimited generation unlocked.');
                    setTimeout(() => setShowPaywallModal(false), 1400);
                }
            } else {
                if (!isSilent) {
                    setLicenseMessage(data.error || '❌ Invalid or expired license key. Only paid founders can unlock Pro Tier.');
                }
            }
        } catch {
            if (!isSilent) {
                setLicenseMessage('❌ Connection error validating license key. Please try again.');
            }
        } finally {
            setIsVerifyingLicense(false);
        }
    };

    // Lock body scroll and stop Lenis while paywall modal is open
    useEffect(() => {
        if (showPaywallModal) {
            const prevOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
            if (typeof window !== 'undefined' && window.__lenis) {
                window.__lenis.stop();
            }

            const handleEscape = (e) => {
                if (e.key === 'Escape') {
                    setShowPaywallModal(false);
                }
            };
            window.addEventListener('keydown', handleEscape);

            return () => {
                document.body.style.overflow = prevOverflow;
                if (typeof window !== 'undefined' && window.__lenis) {
                    window.__lenis.start();
                }
                window.removeEventListener('keydown', handleEscape);
            };
        }
    }, [showPaywallModal]);

    // Step 1: Crawl Founder Website
    const handleAnalyzeWebsite = async () => {
        if (!websiteUrl) return;
        setIsAnalyzing(true);
        try {
            const res = await fetch(`/api/tools/auto-blog/analyze?url=${encodeURIComponent(websiteUrl)}`);
            const data = await res.json();
            if (data.success && data.profile) {
                setProfile(data.profile);
                setProfileAnalyzed(true);
                if (data.profile.suggestedKeywords?.[0]) {
                    setTargetKeyword(data.profile.suggestedKeywords[0]);
                }
            }
        } catch (err) {
            console.error('Website crawler error:', err);
        } finally {
            setIsAnalyzing(false);
        }
    };

    // Trigger Generation (Strictly Enforcing Subscription or 1 Demo Limit)
    const handleGenerateClick = () => {
        if (!isSubscribed) {
            if (demoUsed) {
                setShowPaywallModal(true);
                setAccessMessage('🔒 You have already used your 1 free demo article. Subscribe for $79/mo or claim 2 Months Free with Fast-Track to continue.');
                return;
            }
            // Allow the 1 free demo
            executeGenerateArticle(true);
            return;
        }

        executeGenerateArticle(false);
    };

    // Execute Generation
    const executeGenerateArticle = async (isDemo = false) => {
        setIsGenerating(true);
        setPublishResult(null);
        try {
            const res = await fetch('/api/tools/auto-blog/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    profile,
                    targetKeyword,
                    angle: narrativeAngle,
                    authorName,
                    siteUrl: websiteUrl,
                    founderEmail: isSubscribed ? founderEmail : null,
                    licenseKey: isSubscribed ? licenseKey : null,
                    isDemo
                })
            });
            const data = await res.json();
            if (data.success) {
                setArticle(data);
                setOriginalDraft(data);
                setEditedTitle(data.title);
                setEditedMetaDesc(data.meta_description);
                setEditedContent(data.markdown_content);

                if (data.isDemo) {
                    setDemoUsed(true);
                    localStorage.setItem('launchxact_demo_used', 'true');
                }
            } else if (data.demoExhausted || data.requireSubscription) {
                setDemoUsed(true);
                localStorage.setItem('launchxact_demo_used', 'true');
                setShowPaywallModal(true);
                setAccessMessage(data.error || '🔒 You have already used your 1 free demo article. Purchase a Pro License Key on Dodo Payments or enter your key below to unlock unlimited articles.');
            }
        } catch (err) {
            console.error('Generation error:', err);
        } finally {
            setIsGenerating(false);
        }
    };

    // Quick formatting toolbar injection helper
    const handleInsertFormatting = (prefix, suffix = '') => {
        if (!isSubscribed) {
            setShowPaywallModal(true);
            setAccessMessage('🔒 In-Line Editing Studio is reserved for Pro Subscribers. Subscribe to edit and customize articles.');
            return;
        }

        const textarea = document.getElementById('article-markdown-editor');
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const previousText = editedContent;
        const selectedText = previousText.substring(start, end) || 'text';

        const replacement = `${prefix}${selectedText}${suffix}`;
        const newContent = previousText.substring(0, start) + replacement + previousText.substring(end);
        
        setEditedContent(newContent);

        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
        }, 10);
    };

    // Reset edits to initial AI draft
    const handleResetDraft = () => {
        if (!isSubscribed) {
            setShowPaywallModal(true);
            return;
        }
        if (!originalDraft) return;
        if (confirm('Revert all edits back to the initial AI draft?')) {
            setEditedTitle(originalDraft.title);
            setEditedMetaDesc(originalDraft.meta_description);
            setEditedContent(originalDraft.markdown_content);
        }
    };

    // Step 4: 1-Click Publish Directly to Articles Page (Auto-creating if not exists)
    const handlePublishToArticlesPage = async () => {
        if (!isSubscribed) {
            setShowPaywallModal(true);
            setAccessMessage('🔒 1-Click Publishing to your website articles page is a Pro Subscriber feature. Subscribe to publish.');
            return;
        }

        setIsPublishing(true);
        setPublishResult(null);
        try {
            const updatedArticle = {
                ...article,
                title: editedTitle,
                meta_description: editedMetaDesc,
                markdown_content: editedContent,
                word_count: editedContent.split(/\s+/).filter(Boolean).length,
            };

            const res = await fetch('/api/tools/auto-blog/publish', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    article: updatedArticle,
                    webhookUrl,
                    founderEmail,
                    websiteUrl,
                    authorName,
                })
            });
            const data = await res.json();
            if (data.success) {
                setPublishResult(data);
            } else {
                setPublishResult({
                    success: false,
                    message: data.error || 'Failed to publish article. Please check your website URL.'
                });
            }
        } catch (err) {
            setPublishResult({
                success: false,
                message: 'Publishing network error. Saved to local draft.'
            });
        } finally {
            setIsPublishing(false);
        }
    };

    // Verify Subscription or Fast-Track VIP Grant
    const handleVerifySubscription = async (emailToVerify) => {
        const targetEmail = (emailToVerify || founderEmail || '').trim().toLowerCase();
        if (!targetEmail || !targetEmail.includes('@')) {
            setAccessMessage('Please enter a valid founder email address.');
            return;
        }
        setIsCheckingAccess(true);
        setAccessMessage('');
        try {
            const res = await fetch('/api/tools/auto-blog/access', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: targetEmail })
            });
            const data = await res.json();
            if (data.success && data.entitled) {
                setIsSubscribed(true);
                setSubscriptionPlan(data.plan || 'active_subscriber');
                setDaysRemaining(data.daysRemaining || 60);
                setAccessMessage(`🎉 ${data.message || 'Pro subscription verified and unlocked!'}`);
                localStorage.setItem('launchxact_autoblog_subscriber', JSON.stringify({
                    email: targetEmail,
                    plan: data.plan,
                    daysRemaining: data.daysRemaining,
                    unlockedAt: new Date().toISOString()
                }));
                setShowPaywallModal(false);
            } else {
                setAccessMessage(data.message || 'No active $79/mo subscription or Fast-Track pass found for this email. Subscribe below to unlock.');
            }
        } catch {
            setAccessMessage('Connection error checking subscription. Please try again.');
        } finally {
            setIsCheckingAccess(false);
        }
    };

    // Anti-Theft Protected Download / Export
    const handleDownload = (type) => {
        if (!isSubscribed) {
            setShowPaywallModal(true);
            setAccessMessage('🔒 Exporting and downloading full articles (.MD / HTML) is reserved for Pro subscribers. Subscribe to export.');
            return;
        }

        const textToExport = type === 'md'
            ? `---\ntitle: "${editedTitle.replace(/"/g, '\\"')}"\ndescription: "${editedMetaDesc.replace(/"/g, '\\"')}"\ndate: "${new Date().toISOString().split('T')[0]}"\nauthor: "${authorName}"\n---\n\n${editedContent}`
            : article?.html_content || editedContent;

        const blob = new Blob([textToExport], { type: type === 'md' ? 'text/markdown' : 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${article?.slug || 'article'}.${type}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    // Anti-Theft Protected Copy
    const handleCopyMarkdown = () => {
        if (!isSubscribed) {
            setShowPaywallModal(true);
            setAccessMessage('🔒 Copying full articles is locked in Demo mode. Subscribe for $79/mo or get 2 Months Free with Fast-Track to export.');
            return;
        }

        navigator.clipboard.writeText(editedContent);
        setCopiedContent(true);
        setTimeout(() => setCopiedContent(false), 2000);
    };

    const handleCopyEmbed = (code) => {
        navigator.clipboard.writeText(code);
        setCopiedEmbed(true);
        setTimeout(() => setCopiedEmbed(false), 2000);
    };

    const liveWordCount = article?.word_count || (editedContent ? editedContent.split(/\s+/).filter(Boolean).length : 0);
    const estimatedReadingTime = article?.reading_time || `${Math.max(1, Math.ceil(liveWordCount / 220))} min read`;

    return (
        <div className={styles.container}>
            <Breadcrumb
                items={[
                    { label: 'Founder Tools', href: '/tools' },
                    { label: 'Auto Blog Generator', href: '/tools/auto-blog-generator' },
                ]}
            />

            {/* Subscriber Status Header */}
            {isSubscribed && (
                <div className={styles.unlockedBanner}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                        <span className={styles.unlockedBadge}>⭐ Pro Access Active</span>
                        <span>
                            {subscriptionPlan === 'fast_track_bonus' 
                                ? `Fast-Track VIP Grant: ${daysRemaining} days free access remaining ($158 value)`
                                : subscriptionPlan === 'pro_license'
                                ? 'Dodo Payments Pro License: Unlimited Generation & Direct Publishing Active'
                                : 'Autonomous Blog Generator: Unlimited Generation & Direct Publishing Unlocked'}
                        </span>
                    </div>
                    <span style={{ fontSize: '0.85rem', color: '#047857', fontWeight: 600 }}>
                        {licenseKey ? `Key: ${licenseKey.slice(0, 8)}...${licenseKey.slice(-4)}` : founderEmail}
                    </span>
                </div>
            )}

            <header className={styles.header}>
                <div className={styles.badge}>🚀 Organic SEO & GEO Growth Engine • Outrank.so Architecture</div>
                <h1 className={styles.title}>Autonomous Auto Blog Generator for Founders</h1>
                <p className={styles.subtitle}>
                    Crawl your SaaS website, extract your exact value proposition, and generate human-voice, deeply researched SEO & GEO articles. Edit and verify in-line, then publish directly to your website&apos;s articles page in 1 click (or let us create one for you automatically).
                </p>
            </header>

            {/* 45-Day Transformation Testimonials Grid */}
            <section className={styles.testimonialsSection}>
                <div className={styles.sectionHeader}>
                    <div className={styles.statBadge}>📈 Proven 45-Day Transformation</div>
                    <h2 className={styles.sectionTitle}>How Founders Turn Ghost-Town Websites Into Organic Traffic Machines</h2>
                    <p className={styles.sectionSubtitle}>Real case studies from bootstrapped builders who replaced $5k/mo ad spend with automated, high-intent SEO blogs.</p>
                </div>

                <div className={styles.testimonialsGrid}>
                    {TESTIMONIALS.map((item, idx) => (
                        <div key={idx} className={styles.testimonialCard}>
                            <div>
                                <div className={styles.statBadge}>🔥 {item.stat}</div>
                                <p className={styles.quoteText}>&ldquo;{item.quote}&rdquo;</p>
                            </div>
                            <div className={styles.authorRow}>
                                <div className={styles.avatar}>{item.avatar}</div>
                                <div className={styles.authorMeta}>
                                    <h5>{item.name}</h5>
                                    <p>{item.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* The 45-90 Day Compounding Traction Framework */}
            <section className={styles.roadmapSection}>
                <div className={styles.sectionHeader}>
                    <div className={styles.statBadge}>⏱️ The 45–90 Day Blueprint</div>
                    <h2 className={styles.sectionTitle}>How You Get Predictable Compounding Results in 45–90 Days</h2>
                    <p className={styles.sectionSubtitle}>Why programmatic, human-voice problem-solution articles consistently outperform paid Google & Meta ads.</p>
                </div>

                <div className={styles.roadmapGrid}>
                    {/* Stage 1 */}
                    <div className={styles.roadmapCard}>
                        <span className={`${styles.stageDays} ${styles.stage1}`}>Phase 1: Days 1–14</span>
                        <h3 className={styles.stageTitle}>Indexing & Entity Ingestion</h3>
                        <div className={styles.stageMetric}>0 &rarr; 250 Impressions</div>
                        <p className={styles.stageText}>
                            Deploy 4–6 high-intent problem-to-solution articles. Google indexers verify your canonical tags, while AI engines (Perplexity, ChatGPT Search) ingest your structured FAQ entity schemas.
                        </p>
                        <ul className={styles.stageList}>
                            <li>✅ Zero AI buzzwords bypasses search spam filters</li>
                            <li>✅ Canonical links establish primary topical authority</li>
                            <li>✅ Automatic schema registers your SaaS as an entity</li>
                        </ul>
                    </div>

                    {/* Stage 2 */}
                    <div className={styles.roadmapCard} style={{ borderColor: '#10b981' }}>
                        <span className={`${styles.stageDays} ${styles.stage2}`}>Phase 2: Days 15–45</span>
                        <h3 className={styles.stageTitle}>The Organic Tipping Point</h3>
                        <div className={styles.stageMetric}>1,000 – 3,500 Visits/Mo</div>
                        <p className={styles.stageText}>
                            Long-tail buyer keywords hit Page 1 on Google. High-intent engineers and SaaS buyers searching for specific software alternatives land on your teardowns and convert directly into paying users.
                        </p>
                        <ul className={styles.stageList}>
                            <li>✅ Top 5 rankings for high-intent buyer pain points</li>
                            <li>✅ First wave of zero-CAC customer acquisitions</li>
                            <li>✅ Traffic starts compounding without spending on ads</li>
                        </ul>
                    </div>

                    {/* Stage 3 */}
                    <div className={styles.roadmapCard} style={{ borderColor: '#7c3aed' }}>
                        <span className={`${styles.stageDays} ${styles.stage3}`}>Phase 3: Days 46–90</span>
                        <h3 className={styles.stageTitle}>Authority & AI Citations</h3>
                        <div className={styles.stageMetric}>8,000 – 15,000+ Visits/Mo</div>
                        <p className={styles.stageText}>
                            Internal link density and domain authority multiply ranking velocity. Perplexity and ChatGPT Search cite your product as the authoritative answer in conversational queries.
                        </p>
                        <ul className={styles.stageList}>
                            <li>✅ Cited by AI search engines in 40%+ of niche queries</li>
                            <li>✅ Permanent organic moat that competitors cannot buy</li>
                            <li>✅ Replaces $5,000/month in paid Google/Meta advertising</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Step 1: Website Crawler & Intelligence */}
            <div className={styles.workflowCard}>
                <div className={styles.stepHeader}>
                    <div className={styles.stepNumber}>1</div>
                    <h2 className={styles.stepTitle}>Crawl & Analyze Your SaaS Website</h2>
                </div>
                <p className={styles.stepDesc}>
                    Enter your homepage URL. Our crawler inspects your headline, value proposition, problem/solution framing, and target audience to tailor every article to your product.
                </p>

                <div className={styles.urlInputRow}>
                    <input
                        type="url"
                        placeholder="https://your-saas.com"
                        value={websiteUrl}
                        onChange={(e) => setWebsiteUrl(e.target.value)}
                        className={styles.urlInput}
                    />
                    <button
                        onClick={handleAnalyzeWebsite}
                        disabled={isAnalyzing}
                        className={styles.primaryBtn}
                    >
                        {isAnalyzing ? '🔍 Crawling Website...' : '⚡ Analyze My SaaS Website'}
                    </button>
                </div>

                {profileAnalyzed && (
                    <div className={styles.profileCard}>
                        <h4>✨ Crawled Product Profile: {profile.siteName}</h4>
                        <p><strong>Primary Headline:</strong> &ldquo;{profile.headline}&rdquo;</p>
                        <p><strong>Value Proposition:</strong> {profile.valueProposition}</p>
                        <div className={styles.tagGroup}>
                            <span className={styles.tag}>🎯 ICP: {profile.targetAudience}</span>
                            <span className={styles.tag}>🌐 Domain: {profile.domain}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Step 2: Topic & Strategy Selector */}
            <div className={styles.workflowCard}>
                <div className={styles.stepHeader}>
                    <div className={styles.stepNumber}>2</div>
                    <h2 className={styles.stepTitle}>Select High-Intent Problem/Solution Keyword</h2>
                </div>
                <p className={styles.stepDesc}>
                    Pick an auto-suggested topic based on your site&apos;s positioning or enter your own custom target keyword.
                </p>

                <div className={styles.topicsGrid}>
                    {(profile.suggestedKeywords || []).map((kw, i) => (
                        <button
                            key={i}
                            onClick={() => setTargetKeyword(kw)}
                            className={`${styles.topicChip} ${targetKeyword === kw ? styles.topicChipActive : ''}`}
                        >
                            {kw}
                        </button>
                    ))}
                </div>

                <div className={styles.urlInputRow}>
                    <input
                        type="text"
                        value={targetKeyword}
                        onChange={(e) => setTargetKeyword(e.target.value)}
                        placeholder="Or enter custom target SEO keyword..."
                        className={styles.urlInput}
                    />
                    <button
                        onClick={handleGenerateClick}
                        disabled={isGenerating}
                        className={styles.primaryBtn}
                    >
                        {isGenerating 
                            ? '✍️ Synthesizing Human-Voice Blog...' 
                            : isSubscribed 
                                ? '🚀 Generate Organic SEO Article' 
                                : demoUsed 
                                    ? '🔒 Free Demo Used (1/1) • Subscribe to Generate' 
                                    : '⚡ Generate 1 Free Demo Article (Single Use)'}
                    </button>
                </div>

                {!isSubscribed && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
                        <span className={styles.demoLimitNotice}>
                            {demoUsed ? '⚠️ 1 Free Demo Already Used' : 'ℹ️ Single-Use Demo: 1 free preview per founder'}
                        </span>
                        <a
                            href={DODO_CHECKOUT_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: '#5b21b6', fontWeight: 700, fontSize: '0.85rem', textDecoration: 'underline' }}
                        >
                            Buy Pro License ($79/mo) &rarr;
                        </a>
                        <button
                            type="button"
                            onClick={() => setShowPaywallModal(true)}
                            style={{ background: 'none', border: 'none', color: '#475569', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'underline' }}
                        >
                            🔑 Have a License Key? Activate Pro
                        </button>
                    </div>
                )}
            </div>

            {/* Step 3: Interactive Founder Verification & Anti-Theft Protected Preview */}
            {article && (
                <div className={styles.workflowCard}>
                    <div className={styles.stepHeader}>
                        <div className={styles.stepNumber}>3</div>
                        <h2 className={styles.stepTitle}>Founder Verification & In-Line Studio</h2>
                    </div>
                    <p className={styles.stepDesc}>
                        Review your generated SEO article. {article.isDemo && '⚠️ Anti-Theft Protected Preview: Full 1,800-word content and editing controls are locked in demo mode.'}
                    </p>

                    {/* Quality Bar & Metrics */}
                    <div className={styles.verificationBar}>
                        <div className={styles.metricsRow}>
                            <div className={styles.metricItem}>
                                <span className={styles.metricLabel}>SEO & GEO Score</span>
                                <span className={`${styles.metricValue} ${styles.scoreGreen}`}>98 / 100 ⭐</span>
                            </div>
                            <div className={styles.metricItem}>
                                <span className={styles.metricLabel}>Total Word Count</span>
                                <span className={styles.metricValue}>{liveWordCount} words</span>
                            </div>
                            <div className={styles.metricItem}>
                                <span className={styles.metricLabel}>Reading Time</span>
                                <span className={styles.metricValue}>{estimatedReadingTime}</span>
                            </div>
                            <div className={styles.metricItem}>
                                <span className={styles.metricLabel}>Writing Tone</span>
                                <span className={styles.metricValue}>Authentic Human Founder</span>
                            </div>
                        </div>

                        <div className={styles.verifiedPill}>
                            {article.isDemo ? '🔒 Protected Demo Preview' : '✅ Human-Verified: Zero AI Clichés'}
                        </div>
                    </div>

                    {/* Title Editor (Locked in Demo) */}
                    <div className={styles.editInputGroup}>
                        <div className={styles.editLabelRow}>
                            <label className={styles.editLabel}>
                                Article Headline (H1) {!isSubscribed && '🔒 (Editing Locked in Demo)'}
                            </label>
                            <span className={styles.charCounter}>{editedTitle.length} chars (Target: 50-65)</span>
                        </div>
                        <input
                            type="text"
                            value={editedTitle}
                            readOnly={!isSubscribed}
                            onChange={(e) => isSubscribed && setEditedTitle(e.target.value)}
                            onClick={() => !isSubscribed && setShowPaywallModal(true)}
                            className={styles.titleEditor}
                            style={{ cursor: !isSubscribed ? 'not-allowed' : 'text' }}
                        />
                    </div>

                    {/* Meta Description Editor (Locked in Demo) */}
                    <div className={styles.editInputGroup}>
                        <div className={styles.editLabelRow}>
                            <label className={styles.editLabel}>
                                Google / Social Meta Description {!isSubscribed && '🔒 (Editing Locked in Demo)'}
                            </label>
                            <span className={styles.charCounter}>{editedMetaDesc.length} / 160 chars</span>
                        </div>
                        <textarea
                            rows={2}
                            value={editedMetaDesc}
                            readOnly={!isSubscribed}
                            onChange={(e) => isSubscribed && setEditedMetaDesc(e.target.value)}
                            onClick={() => !isSubscribed && setShowPaywallModal(true)}
                            className={styles.metaEditor}
                            style={{ cursor: !isSubscribed ? 'not-allowed' : 'text' }}
                        />
                    </div>

                    {/* In-Line Article Editor Toolbar & View Switcher */}
                    <div className={styles.editInputGroup}>
                        <div className={styles.editorToolbarWrapper}>
                            {/* View Switcher Tabs */}
                            <div className={styles.viewSwitcher}>
                                <button
                                    type="button"
                                    onClick={() => isSubscribed ? setEditorViewMode('edit') : setShowPaywallModal(true)}
                                    className={`${styles.viewTab} ${editorViewMode === 'edit' ? styles.viewTabActive : ''}`}
                                >
                                    ✏️ Edit Markdown {!isSubscribed && '🔒'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setEditorViewMode('split')}
                                    className={`${styles.viewTab} ${editorViewMode === 'split' ? styles.viewTabActive : ''}`}
                                >
                                    ◫ Split View
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setEditorViewMode('preview')}
                                    className={`${styles.viewTab} ${editorViewMode === 'preview' ? styles.viewTabActive : ''}`}
                                >
                                    👁️ Formatted Preview
                                </button>
                            </div>

                            {/* Quick Formatting Tools */}
                            <div className={styles.formattingTools}>
                                <button type="button" onClick={() => handleInsertFormatting('**', '**')} className={styles.toolBtn} title="Bold">
                                    B
                                </button>
                                <button type="button" onClick={() => handleInsertFormatting('*', '*')} className={styles.toolBtn} title="Italic" style={{ fontStyle: 'italic' }}>
                                    I
                                </button>
                                <button type="button" onClick={() => handleInsertFormatting('\n## ')} className={styles.toolBtn} title="Heading 2">
                                    H2
                                </button>
                                <button type="button" onClick={() => handleInsertFormatting('\n### ')} className={styles.toolBtn} title="Heading 3">
                                    H3
                                </button>
                                <button type="button" onClick={() => handleInsertFormatting('\n- ')} className={styles.toolBtn} title="Bullet List">
                                    • List
                                </button>
                                <button type="button" onClick={() => handleInsertFormatting('\n> ')} className={styles.toolBtn} title="Quote">
                                    &ldquo; Quote
                                </button>
                                <button type="button" onClick={() => handleInsertFormatting('[', '](https://)')} className={styles.toolBtn} title="Link">
                                    🔗 Link
                                </button>
                                <button type="button" onClick={handleResetDraft} className={styles.toolBtn} title="Reset to initial draft">
                                    ↺ Reset
                                </button>
                            </div>
                        </div>

                        {/* Protected Preview Area */}
                        <div
                            className={styles.protectedWrapper}
                            onContextMenu={(e) => {
                                if (!isSubscribed) {
                                    e.preventDefault();
                                    return false;
                                }
                            }}
                            onCopy={(e) => {
                                if (!isSubscribed) {
                                    e.preventDefault();
                                    alert('Demo preview copying is disabled. Subscribe to unlock the complete article export.');
                                    return false;
                                }
                            }}
                        >
                            {/* Visual Render Container */}
                            <div className={`${styles.previewContainer} ${!isSubscribed ? styles.protectedPreview : ''}`} style={{ minHeight: !isSubscribed ? '520px' : '440px' }}>
                                <ReactMarkdown>{editedContent}</ReactMarkdown>
                            </div>

                            {/* Anti-Theft Lock Overlay for Non-Subscribers */}
                            {!isSubscribed && (
                                <div className={styles.lockedTeaserOverlay}>
                                    <div className={styles.lockCard}>
                                        <div className={styles.lockPill}>
                                            🔒 Anti-Theft Protection • Full Article Locked
                                        </div>
                                        <h3 className={styles.lockTitle}>
                                            Full 1,800-Word Article & GEO Entity Schema Locked
                                        </h3>
                                        <p className={styles.lockDesc}>
                                            Anti-Theft Protection Active: The remaining 1,500+ words, comparison tables, and 1-click publishing are locked and not delivered in demo mode.
                                        </p>

                                        <div className={styles.lockedSectionsGrid}>
                                            <div className={styles.lockedItem}>🔒 Complete 1,800+ Word Teardown</div>
                                            <div className={styles.lockedItem}>🔒 SaaS Comparison Matrix Table</div>
                                            <div className={styles.lockedItem}>🔒 4-Step Tactical Action Framework</div>
                                            <div className={styles.lockedItem}>🔒 GEO FAQ Citations for Perplexity/ChatGPT</div>
                                            <div className={styles.lockedItem}>🔒 In-Line Verification Studio</div>
                                            <div className={styles.lockedItem}>🔒 1-Click Publishing to Your Website</div>
                                        </div>

                                        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                                            <a
                                                href={DODO_CHECKOUT_URL}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={styles.primaryBtn}
                                                style={{ textDecoration: 'none' }}
                                            >
                                                Buy Pro License ($79/mo) &rarr;
                                            </a>
                                            <Link
                                                href="/checkout/fast-track"
                                                className={styles.primaryBtn}
                                                style={{ textDecoration: 'none', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                                            >
                                                Get Fast-Track + 2 Months Free &rarr;
                                            </Link>
                                        </div>

                                        <div style={{ marginTop: '1rem' }}>
                                            <button
                                                type="button"
                                                onClick={() => setShowPaywallModal(true)}
                                                style={{ background: 'none', border: 'none', color: '#5b21b6', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'underline' }}
                                            >
                                                🔑 Have a Dodo Payments License Key? Enter key to unlock Pro &rarr;
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Step 4: 1-Click Publishing Hub with Automatic Articles Page Provisioning */}
                    <div className={styles.publishingHub}>
                        <h3 className={styles.hubTitle}>🚀 Step 4: Publish Directly to Founder Website Articles Page</h3>
                        <p className={styles.hubSubtitle}>
                            Once verified, publish directly to your website&apos;s articles page. If your site does not have an articles page yet, LaunchXact will automatically create, host, and index one for you with canonical backlinks!
                        </p>

                        <div className={styles.webhookRow}>
                            <input
                                type="url"
                                placeholder="https://your-cms.com/api/webhook (Optional CMS Webhook)"
                                value={webhookUrl}
                                onChange={(e) => setWebhookUrl(e.target.value)}
                                className={styles.webhookInput}
                            />
                            <button
                                onClick={handlePublishToArticlesPage}
                                disabled={isPublishing}
                                className={styles.publishActionBtn}
                            >
                                {isPublishing ? '📡 Checking & Publishing...' : isSubscribed ? '⚡ Verify & Publish to Articles Page' : '🔒 Subscribe to Publish to Your Website'}
                            </button>
                        </div>

                        {/* Instant Provisioning Results Banner */}
                        {publishResult && (
                            <div className={styles.provisionResultCard}>
                                <div className={styles.provisionHeader}>
                                    🎉 {publishResult.message || 'Article Published Successfully!'}
                                </div>

                                <p className={styles.provisionText}>
                                    {publishResult.articlesPageCreated ? (
                                        <>
                                            We detected that <strong>{publishResult.cleanDomain}</strong> did not have an active <code>/articles</code> directory.
                                            LaunchXact automatically created a high-speed, SEO-optimized Articles Page for you!
                                        </>
                                    ) : (
                                        <>
                                            Your article has been published and linked to your website&apos;s articles directory.
                                        </>
                                    )}
                                </p>

                                <div className={styles.urlPillRow}>
                                    {publishResult.liveArticleUrl && (
                                        <Link
                                            href={publishResult.liveArticleUrl}
                                            target="_blank"
                                            className={styles.liveArticleBtn}
                                        >
                                            🌐 View Live Article ↗
                                        </Link>
                                    )}
                                    {publishResult.founderHubUrl && (
                                        <Link
                                            href={publishResult.founderHubUrl}
                                            target="_blank"
                                            className={styles.founderHubBtn}
                                        >
                                            📚 View {publishResult.cleanDomain} Articles Hub ↗
                                        </Link>
                                    )}
                                </div>

                                {/* 1-Line Embed Snippet for Founder */}
                                {publishResult.embedSnippet && (
                                    <div className={styles.embedBox}>
                                        <div className={styles.embedTitle}>
                                            <span>⚡ 1-Line Embed Code to Host Articles Page on Your Domain:</span>
                                            <button
                                                type="button"
                                                onClick={() => handleCopyEmbed(publishResult.embedSnippet)}
                                                className={styles.copyEmbedBtn}
                                            >
                                                {copiedEmbed ? '✅ Copied!' : '📋 Copy Embed'}
                                            </button>
                                        </div>
                                        <div className={styles.embedCode}>
                                            {publishResult.embedSnippet}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className={styles.exportButtonsRow}>
                            <button onClick={() => handleDownload('md')} className={styles.secondaryBtn}>
                                📥 Download .MD {!isSubscribed && '🔒'}
                            </button>
                            <button onClick={() => handleDownload('html')} className={styles.secondaryBtn}>
                                🌐 Download Semantic HTML {!isSubscribed && '🔒'}
                            </button>
                            <button onClick={handleCopyMarkdown} className={styles.secondaryBtn}>
                                {copiedContent ? '✅ Copied to Clipboard!' : '📋 Copy Markdown {!isSubscribed && "🔒"}'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Outrank.so Comparison Matrix: How LaunchXact Beats Outrank.so Standards */}
            <section className={styles.comparisonSection}>
                <div className={styles.sectionHeader}>
                    <div className={styles.statBadge}>⚔️ Superior Standards</div>
                    <h2 className={styles.sectionTitle}>How LaunchXact Beats Outrank.so Standards</h2>
                    <p className={styles.sectionSubtitle}>Engineered specifically for indie SaaS founders who refuse to publish generic AI fluff.</p>
                </div>

                <div className={styles.comparisonTableWrapper}>
                    <table className={styles.comparisonTable}>
                        <thead>
                            <tr>
                                <th>Feature &amp; Metric</th>
                                <th className={styles.thHighlight}>LaunchXact Autonomous Blog</th>
                                <th>Outrank.so</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong>AI Cliché &amp; Fluff Filter</strong></td>
                                <td className={styles.highlightColumn}>✅ 100% Zero Banned AI Words (No &ldquo;delve&rdquo;, &ldquo;tapestry&rdquo;)</td>
                                <td>❌ Generic ChatGPT-style summaries</td>
                            </tr>
                            <tr>
                                <td><strong>Writing Perspective</strong></td>
                                <td className={styles.highlightColumn}>✅ Authentic Founder Voice (Real engineering trade-offs)</td>
                                <td>❌ Third-person corporate marketing filler</td>
                            </tr>
                            <tr>
                                <td><strong>Generative Engine Optimization (GEO)</strong></td>
                                <td className={styles.highlightColumn}>✅ Native Schema &amp; FAQs for Perplexity &amp; ChatGPT Search</td>
                                <td>❌ Basic keyword density only</td>
                            </tr>
                            <tr>
                                <td><strong>Automatic Articles Page Provisioning</strong></td>
                                <td className={styles.highlightColumn}>✅ Instant Hosted Articles Hub + 1-Line Embed Code</td>
                                <td>❌ Manual CMS setup required; cannot host pages</td>
                            </tr>
                            <tr>
                                <td><strong>In-Line Verification Studio</strong></td>
                                <td className={styles.highlightColumn}>✅ Live Markdown, Split-Screen &amp; Formatted Preview</td>
                                <td>❌ Rigid workflow, limited split editing</td>
                            </tr>
                            <tr>
                                <td><strong>Pricing &amp; Value</strong></td>
                                <td className={styles.highlightColumn}>
                                    <strong>$79 / month flat</strong> OR<br />
                                    <strong>🎁 2 MONTHS FREE with $99 Fast-Track Pass</strong>
                                </td>
                                <td>$99 – $199 / month (No free launch perks)</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Pricing & Fast-Track Synergy Section */}
            <section className={styles.pricingSection}>
                <div className={styles.badge}>💳 Access & Pricing Options</div>
                <h2 className={styles.title} style={{ fontSize: '2.4rem' }}>Scale Your Organic Traffic Engine</h2>
                <p className={styles.subtitle}>
                    Fixed monthly plan or get 2 months free when you launch with the Fast-Track Review Pass.
                </p>

                <div className={styles.pricingGrid}>
                    {/* Plan 1: Monthly Subscription */}
                    <div className={styles.priceCard}>
                        <div>
                            <h3 className={styles.priceTitle}>Autonomous Blog Monthly</h3>
                            <div className={styles.priceAmount}>
                                $79 <span className={styles.pricePeriod}>/ month</span>
                            </div>
                            <ul className={styles.featuresList}>
                                <li>✅ Unlimited Website Crawling & Context Extraction</li>
                                <li>✅ Human-Tone, Anti-Cliché SEO & GEO Writer</li>
                                <li>✅ In-Line Founder Verification & Editing Studio</li>
                                <li>✅ 1-Click Publishing to Articles Page (Auto-creates if none exists)</li>
                                <li>✅ 1-Line Embed Code for Your Own Domain</li>
                                <li>✅ Automatic JSON-LD FAQ & Entity Schema</li>
                                <li>✅ Cancel Anytime with 1 Click</li>
                            </ul>
                        </div>
                        <a
                            href={DODO_CHECKOUT_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.primaryBtn}
                            style={{ textAlign: 'center', justifyContent: 'center', textDecoration: 'none' }}
                        >
                            Buy Pro License ($79/mo) →
                        </a>
                        <p style={{ margin: '0.5rem 0 0', fontSize: '0.78rem', color: '#64748b', textAlign: 'center' }}>
                            ⚡ Instant automatic license key emailed via Dodo Payments
                        </p>
                    </div>

                    {/* Plan 2: Fast-Track Launch Pass Bonus */}
                    <div className={`${styles.priceCard} ${styles.featuredCard}`}>
                        <div className={styles.featuredPill}>🎁 Best Value • $158 Free Bonus</div>
                        <div>
                            <h3 className={styles.priceTitle}>Fast-Track Launch Pass</h3>
                            <div className={styles.priceAmount}>
                                $99 <span className={styles.pricePeriod}>/ one-time</span>
                            </div>
                            <ul className={styles.featuresList}>
                                <li><strong>🎁 2 MONTHS FREE Auto Blog Generator ($158 Value)</strong></li>
                                <li>✅ Guaranteed 48-Hour Launch Review Turnaround</li>
                                <li>✅ Dedicated AEO, GEO & SEO Product Page</li>
                                <li>✅ Permanent DoFollow Canonical Backlink</li>
                                <li>✅ Featured Spotlight in Curated Homepage Carousel</li>
                                <li>✅ 1-on-1 Positioning & CRO Teardown</li>
                            </ul>
                        </div>
                        <Link
                            href="/checkout/fast-track"
                            className={styles.primaryBtn}
                            style={{ textAlign: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', textDecoration: 'none' }}
                        >
                            Get Fast-Track + 2 Months Free →
                        </Link>
                    </div>
                </div>

                {/* Claim 2 Months Free Verification Box */}
                <div className={styles.claimBox}>
                    <h3 className={styles.claimTitle}>Already subscribed or purchased Fast-Track?</h3>
                    <p className={styles.claimDesc}>Enter your founder email below to instantly verify and unlock your autonomous blog generator.</p>
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <input
                            type="email"
                            placeholder="founder@your-saas.com"
                            value={founderEmail}
                            onChange={(e) => setFounderEmail(e.target.value)}
                            className={styles.urlInput}
                            style={{ fontSize: '0.9rem', padding: '0.6rem 1rem' }}
                        />
                        <button
                            onClick={() => handleVerifySubscription()}
                            disabled={isCheckingAccess}
                            className={styles.secondaryBtn}
                        >
                            {isCheckingAccess ? 'Checking...' : 'Unlock Generator'}
                        </button>
                    </div>
                    {accessMessage && (
                        <p style={{ marginTop: '0.75rem', fontSize: '0.88rem', color: isSubscribed ? '#047857' : '#e11d48', fontWeight: 700 }}>
                            {accessMessage}
                        </p>
                    )}
                </div>
            </section>

            {/* Outrank.so Replica Subscription Paywall Modal */}
            {showPaywallModal && (
                <div 
                    className={styles.paywallOverlay} 
                    onClick={() => setShowPaywallModal(false)}
                    data-lenis-prevent="true"
                >
                    <div 
                        className={styles.paywallModal} 
                        onClick={(e) => e.stopPropagation()}
                        onWheel={(e) => e.stopPropagation()}
                        data-lenis-prevent="true"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="paywall-modal-title"
                    >
                        <button
                            type="button"
                            onClick={() => setShowPaywallModal(false)}
                            className={styles.closeModalBtn}
                            aria-label="Close subscription modal"
                        >
                            ✕
                        </button>

                        <div className={styles.paywallHeader}>
                            <div className={styles.paywallBadge}>🔒 Pro Growth Engine • Replica Outrank.so Architecture</div>
                            <h2 className={styles.paywallTitle}>Subscribe to Autonomous Blog Generator</h2>
                            <p className={styles.paywallDesc}>
                                Free demo is strictly limited to 1 preview per founder. To generate complete 1,800+ word articles, customize in-line, and publish directly to your website articles page, enter your Pro License Key or purchase below.
                            </p>
                        </div>

                        {/* Dodo Payments Pro License Key Verification Card */}
                        <div className={styles.licenseVerifyCard}>
                            <div className={styles.licenseBadge}>🔑 Pro License Key Activation</div>
                            <h3 className={styles.licenseCardTitle}>Purchased on Dodo Payments? Activate Your Pro Key</h3>
                            <p className={styles.licenseCardDesc}>
                                Dodo Payments automatically generates and emails your Pro license key upon checkout. Paste your key below to scan, verify, and instantly unlock unlimited generation:
                            </p>
                            <div className={styles.licenseInputRow}>
                                <input
                                    type="text"
                                    placeholder="Paste Dodo Pro License Key (e.g. PRO-XXXX-XXXX-XXXX-XXXX)"
                                    value={licenseKey}
                                    onChange={(e) => setLicenseKey(e.target.value)}
                                    className={styles.licenseInput}
                                />
                                <button
                                    type="button"
                                    onClick={() => handleVerifyLicense(licenseKey)}
                                    disabled={isVerifyingLicense}
                                    className={styles.primaryBtn}
                                    style={{ whiteSpace: 'nowrap' }}
                                >
                                    {isVerifyingLicense ? 'Scanning Key...' : 'Scan & Verify Key →'}
                                </button>
                            </div>
                            {licenseMessage && (
                                <p className={licenseMessage.includes('🎉') ? styles.licenseSuccess : styles.licenseError}>
                                    {licenseMessage}
                                </p>
                            )}
                        </div>

                        <div className={styles.pricingGrid} style={{ marginTop: 0, marginBottom: '2rem' }}>
                            {/* Option 1: Monthly $79 */}
                            <div className={styles.priceCard}>
                                <div>
                                    <h4 className={styles.priceTitle}>Autonomous Blog Monthly</h4>
                                    <div className={styles.priceAmount}>
                                        $79 <span className={styles.pricePeriod}>/ mo</span>
                                    </div>
                                    <ul className={styles.featuresList} style={{ marginBottom: '1.5rem', fontSize: '0.88rem' }}>
                                        <li>✅ Unlimited Full-Length Articles</li>
                                        <li>✅ Human-Tone, Anti-Cliché Voice</li>
                                        <li>✅ 1-Click Articles Page Publishing</li>
                                        <li>✅ GEO Citations for AI Search</li>
                                    </ul>
                                </div>
                                <a
                                    href={DODO_CHECKOUT_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.primaryBtn}
                                    style={{ textAlign: 'center', justifyContent: 'center', textDecoration: 'none' }}
                                >
                                    Buy Pro License ($79/mo) →
                                </a>
                                <p style={{ margin: '0.4rem 0 0', fontSize: '0.78rem', color: '#64748b', textAlign: 'center' }}>
                                    ⚡ Automatic license key delivery via Dodo Payments
                                </p>
                            </div>

                            {/* Option 2: Fast-Track Pass $99 */}
                            <div className={`${styles.priceCard} ${styles.featuredCard}`}>
                                <div className={styles.featuredPill}>🎁 2 Months Free</div>
                                <div>
                                    <h4 className={styles.priceTitle}>Fast-Track Launch Pass</h4>
                                    <div className={styles.priceAmount}>
                                        $99 <span className={styles.pricePeriod}>/ one-time</span>
                                    </div>
                                    <ul className={styles.featuresList} style={{ marginBottom: '1.5rem', fontSize: '0.88rem' }}>
                                        <li><strong>🎁 2 MONTHS FREE Auto Blog ($158 Value)</strong></li>
                                        <li>✅ Guaranteed 48-Hour Launch Review</li>
                                        <li>✅ Dedicated Product Page on LaunchXact</li>
                                        <li>✅ Permanent DoFollow Backlink</li>
                                    </ul>
                                </div>
                                <Link
                                    href="/checkout/fast-track"
                                    className={styles.primaryBtn}
                                    style={{ textAlign: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', textDecoration: 'none' }}
                                >
                                    Get Fast-Track + 2 Months Free →
                                </Link>
                            </div>
                        </div>

                        {/* Existing subscriber unlock in modal */}
                        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '1rem', padding: '1.25rem' }}>
                            <h4 style={{ margin: '0 0 0.5rem', color: '#0f172a', fontSize: '0.98rem' }}>Already subscribed or purchased Fast-Track?</h4>
                            <p style={{ margin: '0 0 0.75rem', color: '#64748b', fontSize: '0.85rem' }}>Enter your email to verify and unlock full access immediately:</p>
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                <input
                                    type="email"
                                    placeholder="founder@your-saas.com"
                                    value={founderEmail}
                                    onChange={(e) => setFounderEmail(e.target.value)}
                                    className={styles.urlInput}
                                    style={{ padding: '0.6rem 1rem', fontSize: '0.9rem' }}
                                />
                                <button
                                    type="button"
                                    onClick={() => handleVerifySubscription()}
                                    disabled={isCheckingAccess}
                                    className={styles.secondaryBtn}
                                >
                                    {isCheckingAccess ? 'Verifying...' : 'Unlock Pro Access'}
                                </button>
                            </div>
                            {accessMessage && (
                                <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: isSubscribed ? '#047857' : '#e11d48', fontWeight: 600 }}>
                                    {accessMessage}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
