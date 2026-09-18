'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import ToolShareCard from '@/components/tools/ToolShareCard';
import ToolUrlAutoFill from '@/components/tools/ToolUrlAutoFill';
import { trackAcquisitionEvent, ACQUISITION_EVENTS } from '@/lib/acquisition';
import styles from './page.module.css';

const LOADING_QUIPS = [
    "Checking if OpenAI can kill this in their next keynote...",
    "Measuring willingness to pull out a corporate credit card...",
    "Stress-testing your distribution strategy against realistic CAC...",
    "Searching for your actual defensibility moat...",
    "Analyzing if this is a $10k painkiller or a $5 vitamin...",
    "Simulating 1,000 cold customer conversations...",
    "Calculating unit economics against LLM inference costs...",
    "Determining your founder archetype...",
];

const PRESETS = [
    {
        name: '🤖 AI SQL Data Analyst',
        badge: 'DevTool / Data',
        data: {
            ideaName: 'SQLNinja AI',
            targetCustomer: 'Non-technical Product Managers & BizOps teams at Series A-B startups',
            pricing: '$49/mo per seat with up to 5,000 query conversions',
            description: 'Converts natural English into optimized Postgres & Snowflake SQL queries with auto-visualizations and Slack scheduled reports.',
            competitors: 'ChatGPT Plus, Text2SQL.ai, Metabase AI, internal data engineers',
            distribution: 'Cold LinkedIn outreach to Heads of Product, Product Hunt launch, open-source Github repository with 2,000 stars.',
            url: 'https://sqlninja.demo.dev',
        }
    },
    {
        name: '⚡ Chargeback Defense Bot',
        badge: 'Fintech / E-com',
        data: {
            ideaName: 'ChargeShield AI',
            targetCustomer: 'Shopify & Stripe merchants generating $30k–$200k/mo GMV with high dispute rates',
            pricing: '$199/mo base subscription + 15% of successfully recovered dispute revenue',
            description: 'Scrapes dispute transaction logs, gathers tracking evidence automatically, writes bank-specific rebuttal letters via fine-tuned LLM, and submits directly via Stripe API.',
            competitors: 'Chargeflow, Midigator, manual founder dispute handling via Stripe Dashboard',
            distribution: 'Shopify App Store ranking, Stripe Apps ecosystem listing, revenue-share partnerships with e-commerce accounting agencies.',
            url: 'https://chargeshield.io',
        }
    },
    {
        name: '🎨 Localized Video Dubber',
        badge: 'Creator / Media',
        data: {
            ideaName: 'PolyglotStudio AI',
            targetCustomer: 'YouTube creators, course creators, and podcasters with 10k–500k followers looking to expand to Spanish and Japanese',
            pricing: '$79/mo for 120 minutes of voice-cloned video translation and burned-in captions',
            description: 'Translates video voice tracks into 30+ languages using voice cloning, lip-sync correction, and automated SRT subtitle generation.',
            competitors: 'ElevenLabs Dubbing, HeyGen, Rask.ai, manual human dubbing agencies',
            distribution: 'Build in public on X with viral side-by-side clips, free 1-minute sample watermark videos, direct DM outreach to top 200 educational YouTubers.',
            url: '',
        }
    }
];

export default function GradePage({ initialPreset = null, hideBreadcrumb = false, isEmbeddedSpoke = false } = {}) {
    // Form fields
    const [ideaName, setIdeaName] = useState('');
    const [targetCustomer, setTargetCustomer] = useState('');
    const [pricing, setPricing] = useState('');
    const [description, setDescription] = useState('');
    const [competitors, setCompetitors] = useState('');
    const [distribution, setDistribution] = useState('');
    const [url, setUrl] = useState('');
    const [founderEmail, setFounderEmail] = useState('');
    const [capturedLogo, setCapturedLogo] = useState('');

    // Dynamic founder count from Supabase
    const [founderCount, setFounderCount] = useState(14);

    // Flow states
    const [status, setStatus] = useState('idle'); // idle | loading | done | error
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [loadingQuip, setLoadingQuip] = useState(LOADING_QUIPS[0]);
    const [animatedScore, setAnimatedScore] = useState(0);

    // Email blueprint capture
    const [emailSent, setEmailSent] = useState(false);
    const [auditEmail, setAuditEmail] = useState('');
    const [isAuditing, setIsAuditing] = useState(false);
    const [auditError, setAuditError] = useState('');

    const resultsRef = useRef(null);
    const hasStartedRef = useRef(false);
    const resultsViewedRef = useRef(false);

    // Track 1. landing_page_view on mount & Restore session state if returning
    useEffect(() => {
        trackAcquisitionEvent(ACQUISITION_EVENTS.LANDING_PAGE_VIEW, {
            toolId: 'ai-saas-grader',
            once: true
        });

        // Restore audit session if returning within the same browser tab
        try {
            const savedSession = sessionStorage.getItem('launchxact_grader_session');
            if (savedSession) {
                const data = JSON.parse(savedSession);
                if (data && data.result && data.status === 'done') {
                    if (data.ideaName) setIdeaName(data.ideaName);
                    if (data.targetCustomer) setTargetCustomer(data.targetCustomer);
                    if (data.pricing) setPricing(data.pricing);
                    if (data.description) setDescription(data.description);
                    if (data.competitors) setCompetitors(data.competitors);
                    if (data.distribution) setDistribution(data.distribution);
                    if (data.url) setUrl(data.url);
                    if (data.founderEmail) setFounderEmail(data.founderEmail);
                    if (data.capturedLogo) setCapturedLogo(data.capturedLogo);
                    setResult(data.result);
                    setStatus('done');
                    setAnimatedScore(data.result.overall_score || 0);
                    if (data.founderEmail) setAuditEmail(data.founderEmail);
                }
            }
        } catch (e) {
            console.warn('Could not restore grader session:', e);
        }
    }, []);

    const notifyToolStarted = () => {
        if (!hasStartedRef.current) {
            hasStartedRef.current = true;
            trackAcquisitionEvent(ACQUISITION_EVENTS.TOOL_STARTED, {
                toolId: 'ai-saas-grader',
                metadata: { ideaName },
                once: true
            });
        }
    };

    // Fetch real live founder count from Supabase on mount
    useEffect(() => {
        fetch('/api/grade')
            .then((res) => res.json())
            .then((data) => {
                if (data.founderCount) {
                    setFounderCount(data.founderCount);
                }
            })
            .catch((err) => console.warn('Could not load founder count:', err));
    }, []);

    // Smooth scroll to results once completed
    useEffect(() => {
        if (status === 'done' && resultsRef.current) {
            const yOffset = -90;
            const elementY = resultsRef.current.getBoundingClientRect().top;
            const targetY = elementY + window.scrollY + yOffset;

            const duration = 1200;
            const startY = window.scrollY;
            const distance = targetY - startY;
            let startTime = null;

            const easeInOutQuad = (t, b, c, d) => {
                t /= d / 2;
                if (t < 1) return (c / 2) * t * t + b;
                t--;
                return (-c / 2) * (t * (t - 2) - 1) + b;
            };

            const animation = (currentTime) => {
                if (startTime === null) startTime = currentTime;
                const timeElapsed = currentTime - startTime;
                const nextY = easeInOutQuad(timeElapsed, startY, distance, duration);
                window.scrollTo(0, nextY);

                if (timeElapsed < duration) {
                    requestAnimationFrame(animation);
                } else {
                    window.scrollTo(0, targetY);
                }
            };

            requestAnimationFrame(animation);
        }
    }, [status]);

    // Handle Preset selection
    const applyPreset = (preset) => {
        notifyToolStarted();
        setIdeaName(preset.data.ideaName);
        setTargetCustomer(preset.data.targetCustomer);
        setPricing(preset.data.pricing);
        setDescription(preset.data.description);
        setCompetitors(preset.data.competitors);
        setDistribution(preset.data.distribution);
        setUrl(preset.data.url);
        setError('');
    };

    // Submit for brutal grading
    const handleGrade = async (e, customPayload = null) => {
        if (e && e.preventDefault) e.preventDefault();
        notifyToolStarted();

        const payload = customPayload || {
            ideaName: ideaName.trim(),
            targetCustomer: targetCustomer.trim(),
            pricing: pricing.trim(),
            description: description.trim(),
            competitors: competitors.trim(),
            distribution: distribution.trim(),
            url: url.trim(),
            email: founderEmail.trim().toLowerCase(),
        };

        if (!payload.ideaName && !payload.description && !payload.url) {
            setError('Please enter at least your SaaS Idea Name or Description.');
            return;
        }

        if (!payload.email || !payload.email.includes('@')) {
            setError('Please enter your founder work email so we can dispatch your report & score.');
            return;
        }

        setStatus('loading');
        setError('');
        setResult(null);
        setAnimatedScore(0);

        let quipIdx = 0;
        const quipInterval = setInterval(() => {
            quipIdx = (quipIdx + 1) % LOADING_QUIPS.length;
            setLoadingQuip(LOADING_QUIPS[quipIdx]);
        }, 2200);

        try {
            const res = await fetch('/api/grade', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            clearInterval(quipInterval);

            if (!res.ok) {
                throw new Error(data.error || 'Something went wrong while grading.');
            }

            setResult(data);
            setStatus('done');

            if (payload.email) {
                setAuditEmail(payload.email);
                setEmailSent(true);
            }

            // Save to sessionStorage so audit results persist across page navigation until browser tab closes
            try {
                sessionStorage.setItem('launchxact_grader_session', JSON.stringify({
                    ideaName: payload.ideaName || ideaName,
                    targetCustomer: payload.targetCustomer || targetCustomer,
                    pricing: payload.pricing || pricing,
                    description: payload.description || description,
                    competitors: payload.competitors || competitors,
                    distribution: payload.distribution || distribution,
                    url: payload.url || url,
                    founderEmail: payload.email || founderEmail,
                    capturedLogo,
                    result: data,
                    status: 'done'
                }));
            } catch (e) {
                console.warn('Could not save grader session:', e);
            }

            // Track 3. tool_completed and 4. result_viewed
            trackAcquisitionEvent(ACQUISITION_EVENTS.TOOL_COMPLETED, {
                toolId: 'ai-saas-grader',
                metadata: {
                    overall_score: data.overall_score,
                    weakest_pillar: data.weakest_pillar,
                    idea_name: data.idea_name || ideaName
                }
            });

            if (!resultsViewedRef.current) {
                resultsViewedRef.current = true;
                trackAcquisitionEvent(ACQUISITION_EVENTS.RESULT_VIEWED, {
                    toolId: 'ai-saas-grader',
                    metadata: { overall_score: data.overall_score },
                    once: true
                });
            }

            // Animated score counter
            const target = data.overall_score || 0;
            let current = 0;
            const step = Math.max(1, Math.floor(target / 40));
            const scoreInterval = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(scoreInterval);
                }
                setAnimatedScore(current);
            }, 30);

        } catch (err) {
            clearInterval(quipInterval);
            setError(err.message);
            setStatus('error');
        }
    };

    // Handle Full Email Blueprint
    const handleFullAudit = async (e) => {
        e.preventDefault();
        if (!auditEmail.trim()) return;

        setIsAuditing(true);
        setAuditError('');

        try {
            const res = await fetch('/api/grade/full', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: auditEmail.trim(),
                    ideaName: ideaName.trim(),
                    targetCustomer: targetCustomer.trim(),
                    pricing: pricing.trim(),
                    description: description.trim(),
                    competitors: competitors.trim(),
                    distribution: distribution.trim(),
                    url: url.trim(),
                    summaryResult: result,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to send blueprint');

            // Track 6. email_submitted and 7. waitlist_joined
            trackAcquisitionEvent(ACQUISITION_EVENTS.EMAIL_SUBMITTED, {
                toolId: 'ai-saas-grader',
                metadata: { email_domain: auditEmail.split('@')[1] }
            });
            trackAcquisitionEvent(ACQUISITION_EVENTS.WAITLIST_JOINED, {
                toolId: 'ai-saas-grader',
                metadata: { source: 'ai_grader_blueprint' }
            });

            setEmailSent(true);
        } catch (err) {
            setAuditError(err.message);
        } finally {
            setIsAuditing(false);
        }
    };

    // Color indicators
    const getScoreColorClass = (score) => {
        if (score >= 75) return styles.scoreGreen;
        if (score >= 50) return styles.scoreAmber;
        return styles.scoreRed;
    };

    const getScoreHexColor = (score) => {
        if (score >= 75) return '#16a34a';
        if (score >= 50) return '#d97706';
        return '#dc2626';
    };

    const getScoreEmoji = (score) => {
        if (score >= 85) return '🔥';
        if (score >= 70) return '🚀';
        if (score >= 50) return '⚡';
        if (score >= 35) return '⚠️';
        return '🚨';
    };

    // 5 Discovery Audit Pillars
    const pillars = [
        {
            key: 'messaging',
            label: '1. Messaging',
            question: 'Can visitors understand what the product does?',
            desc: 'Evaluates headline clarity, speed of understanding, and outcome-focused positioning.',
        },
        {
            key: 'conversion',
            label: '2. Conversion',
            question: 'Does the page make the next action obvious?',
            desc: 'Evaluates CTA placement, friction, onboarding clarity, and price transparency.',
        },
        {
            key: 'trust',
            label: '3. Trust',
            question: 'Does the website provide enough evidence to believe the product?',
            desc: 'Evaluates social proof, customer logos, founder transparency, and rating badges.',
        },
        {
            key: 'search',
            label: '4. Search',
            question: 'Can traditional search engines understand and discover it?',
            desc: 'Evaluates heading hierarchy (H1/H2), meta tags, semantic HTML, and organic indexability.',
        },
        {
            key: 'ai_discovery',
            label: '5. AI Discovery',
            question: 'Is the product represented clearly enough for AI systems to understand and potentially surface it?',
            desc: 'Evaluates entity clarity, schema markup, and AI-search readiness (ChatGPT, Perplexity, Gemini).',
        },
    ];

    // SVG circle calculations
    const radius = 90;
    const circumference = 2 * Math.PI * radius;
    const scorePercent = result ? (animatedScore / 100) : 0;
    const dashOffset = circumference * (1 - scorePercent);

    return (
        <div className={styles.page}>
            {!hideBreadcrumb && !isEmbeddedSpoke && (
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
                    <Breadcrumb items={[
                        { label: 'Founder Tools', href: '/tools' },
                        { label: 'Free SaaS Discovery Audit' }
                    ]} />
                </div>
            )}

            {!isEmbeddedSpoke ? (
                /* LAYER 1: HERO SECTION */
                <section className={styles.hero}>
                    <div className={styles.badgeRow}>
                        <span className={styles.topBadge}>
                            ✨ FREE SAAS DISCOVERY AUDIT
                        </span>
                    </div>
                    <h1 className={styles.heroTitle}>
                        Is your SaaS ready to be discovered?
                    </h1>
                    <p className={styles.heroSub}>
                        Enter your website and get a free analysis of your landing page, messaging, trust signals, SEO and AI-search readiness.
                    </p>

                    {/* Real-time Founder Proof Banner */}
                    <div className={styles.socialProofBar}>
                        <span className={styles.proofDot} />
                        <span className={styles.proofText}>
                            <strong>{founderCount} founders</strong> have run their SaaS discovery audit this week.
                        </span>
                    </div>
                </section>
            ) : (
                <div style={{ textAlign: 'center', padding: '1rem 1.5rem 2.5rem', maxWidth: '820px', margin: '0 auto' }}>
                    <span className={styles.topBadge} style={{ marginBottom: '0.75rem', display: 'inline-flex' }}>
                        ⚡ Free Discovery Audit
                    </span>
                    <h2 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.25rem)', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', margin: '0.5rem 0' }}>
                        Is your SaaS ready to be discovered?
                    </h2>
                    <p style={{ color: '#64748b', fontSize: '1.05rem', lineHeight: 1.6, margin: '0 auto' }}>
                        Enter your website and get a free analysis of your landing page, messaging, trust signals, SEO and AI-search readiness.
                    </p>
                </div>
            )}

            {/* LAYER 2: THE INTERACTIVE URL & SaaS PROFILE INPUT */}
            <section className={styles.formContainer}>
                {/* Instant AI Auto-Fill & Audit Bar */}
                <ToolUrlAutoFill
                    toolType="grader"
                    title="Instant Audit from Website URL"
                    subtitle="Paste your website URL below (e.g. https://yourproduct.com). Our AI Agent crawls your landing page, analyzes H1s, trust proof, CTAs & meta tags, and generates your 5-score discovery analysis."
                    buttonText="Auto-Fill & Analyze ✨"
                    autoTriggerText="Analyze My SaaS ⚡"
                    onSuccess={(extractedData, logo) => {
                        if (extractedData.ideaName) setIdeaName(extractedData.ideaName);
                        if (extractedData.targetCustomer) setTargetCustomer(extractedData.targetCustomer);
                        if (extractedData.pricing) setPricing(extractedData.pricing);
                        if (extractedData.description) setDescription(extractedData.description);
                        if (extractedData.competitors) setCompetitors(extractedData.competitors);
                        if (extractedData.distribution) setDistribution(extractedData.distribution);
                        if (extractedData.url) setUrl(extractedData.url);
                        if (logo || extractedData.logoUrl) setCapturedLogo(logo || extractedData.logoUrl);
                        setError('');
                    }}
                    onAutoTrigger={(extractedData) => {
                        const payload = {
                            ideaName: extractedData.ideaName || '',
                            targetCustomer: extractedData.targetCustomer || '',
                            pricing: extractedData.pricing || '',
                            description: extractedData.description || '',
                            competitors: extractedData.competitors || '',
                            distribution: extractedData.distribution || '',
                            url: extractedData.url || '',
                        };
                        handleGrade(null, payload);
                    }}
                />

                {/* Quick Presets Bar */}
                <div className={styles.presetsBar}>
                    <span className={styles.presetsLabel}>⚡ Or Try A Sample SaaS:</span>
                    <div className={styles.presetsList}>
                        {PRESETS.map((preset, idx) => (
                            <button
                                key={idx}
                                type="button"
                                className={styles.presetChip}
                                onClick={() => applyPreset(preset)}
                            >
                                <span>{preset.name}</span>
                                <span className={styles.presetBadge}>{preset.badge}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <form onSubmit={handleGrade} className={styles.graderForm}>
                    <div className={styles.formGrid}>
                        {/* 1. Website URL Primary Input */}
                        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                            <label htmlFor="live-url" className={styles.inputLabel}>
                                🌐 Website URL <span className={styles.required}>*</span>
                                {capturedLogo && (
                                    <span style={{ marginLeft: '8px', fontSize: '0.75rem', color: '#16a34a', fontWeight: 700 }}>
                                        ✓ Logo Cached
                                    </span>
                                )}
                            </label>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                {capturedLogo && (
                                    <div style={{ width: '42px', height: '42px', borderRadius: '8px', border: '1px solid #cbd5e1', padding: '4px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                                        <img src={capturedLogo} alt="Product Logo" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} onError={(e) => { e.target.style.display = 'none'; }} />
                                    </div>
                                )}
                                <input
                                    id="live-url"
                                    type="text"
                                    className={styles.textInput}
                                    placeholder="https://yourproduct.com"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    disabled={status === 'loading'}
                                />
                            </div>
                        </div>

                        {/* 2. SaaS Product Name */}
                        <div className={styles.formGroup}>
                            <label htmlFor="idea-name" className={styles.inputLabel}>
                                Product Name <span className={styles.optional}>(Optional)</span>
                            </label>
                            <input
                                id="idea-name"
                                type="text"
                                className={styles.textInput}
                                placeholder="e.g. Acme AI, SQLNinja..."
                                value={ideaName}
                                onChange={(e) => setIdeaName(e.target.value)}
                                disabled={status === 'loading'}
                            />
                        </div>

                        {/* 3. Founder Email */}
                        <div className={styles.formGroup}>
                            <label htmlFor="founder-email" className={styles.inputLabel}>
                                Founder Email <span className={styles.required}>*</span>
                            </label>
                            <input
                                id="founder-email"
                                type="email"
                                className={styles.textInput}
                                placeholder="founder@yourproduct.com"
                                value={founderEmail}
                                onChange={(e) => {
                                    setFounderEmail(e.target.value);
                                    if (error) setError('');
                                }}
                                disabled={status === 'loading'}
                                required
                            />
                        </div>

                        {/* 4. Value Proposition / Description */}
                        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                            <label htmlFor="idea-desc" className={styles.inputLabel}>
                                Product Headline / Value Prop <span className={styles.optional}>(Optional - extracted automatically from URL if empty)</span>
                            </label>
                            <textarea
                                id="idea-desc"
                                className={styles.textArea}
                                rows={2}
                                placeholder="What main problem does your product solve for buyers?"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                disabled={status === 'loading'}
                            />
                        </div>
                    </div>

                    {error && <p className={styles.errorMessage}>{error}</p>}

                    <div className={styles.submitRow}>
                        <button
                            id="grade-submit-btn"
                            type="submit"
                            className={styles.submitBtn}
                            disabled={status === 'loading'}
                        >
                            {status === 'loading' ? 'Analyzing 5 Discovery Pillars...' : 'Analyze My SaaS — Free →'}
                        </button>
                    </div>
                </form>
            </section>

            {/* LOADING STATE */}
            {status === 'loading' && (
                <section className={styles.loadingSection}>
                    <div className={styles.scannerWrapper}>
                        <div className={styles.spinner} />
                        <div className={styles.scannerPulse} />
                    </div>
                    <p className={styles.loadingTitle}>Analyzing Landing Page & Discovery Signals...</p>
                    <p className={styles.loadingQuip}>{loadingQuip}</p>
                </section>
            )}

            {/* LAYER 3: RESULTS & 5 SCORES BREAKDOWN */}
            {status === 'done' && result && (
                <section ref={resultsRef} className={styles.resultsSection}>

                    {/* OVERALL SCORE HUD */}
                    <div className={styles.scoreHud}>
                        <div className={styles.scoreRingWrapper}>
                            <svg className={styles.scoreRingSvg} viewBox="0 0 220 220">
                                <circle className={styles.scoreTrack} cx="110" cy="110" r={radius} />
                                <circle
                                    className={`${styles.scoreFill} ${getScoreColorClass(result.overall_score)}`}
                                    cx="110" cy="110" r={radius}
                                    strokeDasharray={circumference}
                                    strokeDashoffset={dashOffset}
                                />
                            </svg>
                            <div className={styles.scoreCenter}>
                                <div className={`${styles.scoreNumber} ${getScoreColorClass(result.overall_score)}`}>
                                    {animatedScore}
                                </div>
                                <div className={styles.scoreScale}>/ 100</div>
                                <div className={styles.scoreCaption}>Overall Discovery</div>
                            </div>
                        </div>

                        <div className={styles.hudMeta}>
                            {capturedLogo && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#fff', border: '1px solid #e2e8f0', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', flexShrink: 0 }}>
                                        <img src={capturedLogo} alt="Product Logo" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} onError={(e) => { e.target.style.display = 'none'; }} />
                                    </div>
                                    <div>
                                        <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', display: 'block' }}>
                                            {result.idea_name || ideaName || 'Your SaaS'}
                                        </span>
                                    </div>
                                </div>
                            )}

                            <h2 className={styles.verdictTitle}>
                                Overall: <span style={{ color: result.overall_score >= 70 ? '#16a34a' : '#d97706' }}>{result.overall_score}/100</span>
                            </h2>
                            <p style={{ color: '#475569', fontSize: '1.02rem', lineHeight: 1.6, margin: '0 0 1rem' }}>
                                {result.verdict_headline}
                            </p>

                            <button
                                type="button"
                                onClick={() => {
                                    try { sessionStorage.removeItem('launchxact_grader_session'); } catch (e) {}
                                    setStatus('idle');
                                    setResult(null);
                                    setAnimatedScore(0);
                                }}
                                style={{
                                    background: '#f1f5f9',
                                    border: '1px solid #cbd5e1',
                                    borderRadius: '9999px',
                                    padding: '6px 14px',
                                    fontSize: '0.8rem',
                                    fontWeight: 700,
                                    color: '#475569',
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                }}
                            >
                                🔄 Audit Another SaaS
                            </button>
                        </div>
                    </div>

                    {/* 5 SCORES BREAKDOWN GRID */}
                    <div className={styles.pillarsSection}>
                        <div className={styles.pillarsHeader}>
                            <h3 className={styles.pillarsTitle}>5 Core Discovery Scores</h3>
                            <span className={styles.pillarsSub}>Detailed 0-100 analysis per pillar</span>
                        </div>

                        <div className={styles.pillarsGrid}>
                            {pillars.map((p) => {
                                const score = result.pillar_scores?.[p.key] ?? 0;

                                return (
                                    <div
                                        key={p.key}
                                        className={styles.pillarCard}
                                    >
                                        <div className={styles.pillarTop}>
                                            <span className={styles.pillarName}>{p.label}</span>
                                            <span className={`${styles.pillarScoreVal} ${getScoreColorClass(score)}`}>
                                                {score}<small>/100</small>
                                            </span>
                                        </div>

                                        <p style={{ fontSize: '0.82rem', fontWeight: 600, color: '#4b5563', margin: '0 0 0.5rem', fontStyle: 'italic' }}>
                                            &quot;{p.question}&quot;
                                        </p>

                                        <div className={styles.pillarMeterTrack}>
                                            <div
                                                className={styles.pillarMeterBar}
                                                style={{ width: `${score}%`, backgroundColor: getScoreHexColor(score) }}
                                            />
                                        </div>

                                        <p className={styles.pillarDescription}>{p.desc}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* DIAGNOSIS SECTION: FIX THESE 3 THINGS FIRST */}
                    <div className={styles.pivotCard}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
                            <h3 className={styles.pivotTitle} style={{ margin: 0 }}>Fix these 3 things first</h3>
                            <span style={{ fontSize: '0.78rem', fontWeight: 800, background: '#fee2e2', color: '#dc2626', padding: '4px 12px', borderRadius: '9999px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Prioritized Diagnosis
                            </span>
                        </div>

                        <div className={styles.actionItemsList}>
                            {result.diagnosis_items && result.diagnosis_items.length > 0 ? (
                                result.diagnosis_items.map((item, idx) => (
                                    <div key={idx} className={styles.actionItemRow} style={{ borderLeft: item.priority === 'high' ? '4px solid #dc2626' : '4px solid #f59e0b' }}>
                                        <div style={{ fontSize: '1.2rem', flexShrink: 0 }}>
                                            {item.priority === 'high' ? '🔴' : '🟠'}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <h4 style={{ margin: '0 0 4px', fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                                                {idx + 1}. {item.title}
                                            </h4>
                                            {item.current && (
                                                <p style={{ margin: '0 0 4px', fontSize: '0.88rem', color: '#991b1b', background: '#fef2f2', padding: '6px 10px', borderRadius: '6px' }}>
                                                    <strong>Current:</strong> {item.current}
                                                </p>
                                            )}
                                            {item.recommended && (
                                                <p style={{ margin: '0 0 6px', fontSize: '0.88rem', color: '#166534', background: '#f0fdf4', padding: '6px 10px', borderRadius: '6px' }}>
                                                    <strong>Recommended:</strong> {item.recommended}
                                                </p>
                                            )}
                                            {item.details && (
                                                <p style={{ margin: 0, fontSize: '0.84rem', color: '#475569', lineHeight: 1.5 }}>
                                                    {item.details}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <>
                                    <div className={styles.actionItemRow} style={{ borderLeft: '4px solid #dc2626' }}>
                                        <div style={{ fontSize: '1.2rem', flexShrink: 0 }}>🔴</div>
                                        <div style={{ flex: 1 }}>
                                            <h4 style={{ margin: '0 0 4px', fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                                                1. Your H1 doesn&apos;t explain the outcome
                                            </h4>
                                            <p style={{ margin: '0 0 4px', fontSize: '0.88rem', color: '#991b1b', background: '#fef2f2', padding: '6px 10px', borderRadius: '6px' }}>
                                                <strong>Current:</strong> &quot;The future of automated productivity...&quot;
                                            </p>
                                            <p style={{ margin: '0 0 6px', fontSize: '0.88rem', color: '#166534', background: '#f0fdf4', padding: '6px 10px', borderRadius: '6px' }}>
                                                <strong>Recommended:</strong> &quot;Automate X without Y&quot;
                                            </p>
                                            <p style={{ margin: 0, fontSize: '0.84rem', color: '#475569', lineHeight: 1.5 }}>
                                                Visitors leave in 3 seconds when headlines describe technology instead of the concrete benefit.
                                            </p>
                                        </div>
                                    </div>

                                    <div className={styles.actionItemRow} style={{ borderLeft: '4px solid #f59e0b' }}>
                                        <div style={{ fontSize: '1.2rem', flexShrink: 0 }}>🟠</div>
                                        <div style={{ flex: 1 }}>
                                            <h4 style={{ margin: '0 0 4px', fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                                                2. No social proof above the fold
                                            </h4>
                                            <p style={{ margin: '0 0 6px', fontSize: '0.88rem', color: '#166534', background: '#f0fdf4', padding: '6px 10px', borderRadius: '6px' }}>
                                                <strong>Add:</strong> User counter, customer logos, or verified rating badge directly below your CTA.
                                            </p>
                                        </div>
                                    </div>

                                    <div className={styles.actionItemRow} style={{ borderLeft: '4px solid #f59e0b' }}>
                                        <div style={{ fontSize: '1.2rem', flexShrink: 0 }}>🟠</div>
                                        <div style={{ flex: 1 }}>
                                            <h4 style={{ margin: '0 0 4px', fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                                                3. Missing structured product information
                                            </h4>
                                            <p style={{ margin: '0 0 6px', fontSize: '0.88rem', color: '#166534', background: '#f0fdf4', padding: '6px 10px', borderRadius: '6px' }}>
                                                <strong>Add:</strong> SoftwareApplication JSON-LD schemas so AI recommendation tools can surface your product.
                                            </p>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* ECOSYSTEM ACQUISITION FUNNEL: WANT TO IMPROVE YOUR SCORE? */}
                    <div style={{
                        marginTop: '2.5rem',
                        marginBottom: '2.5rem',
                        padding: '2.25rem 2.5rem',
                        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
                        border: '2px solid #7c3aed',
                        borderRadius: '20px',
                        boxShadow: '0 20px 40px -15px rgba(124, 58, 237, 0.3)',
                        color: '#ffffff'
                    }}>
                        <div style={{ maxWidth: '820px' }}>
                            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '6px' }}>
                                🚀 LaunchXact Ecosystem Engine
                            </span>
                            <h3 style={{ fontSize: '1.85rem', fontWeight: 800, margin: '0 0 8px', color: '#ffffff', lineHeight: 1.25 }}>
                                Want to improve your score?
                            </h3>
                            <p style={{ color: '#cbd5e1', fontSize: '1rem', lineHeight: 1.6, margin: '0 0 1.75rem' }}>
                                Use LaunchXact&apos;s free tools, guides, and discovery network to optimize your SaaS landing page and scale your organic distribution.
                            </p>

                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                                gap: '1rem',
                                marginBottom: '2rem'
                            }}>
                                <Link href="/tools" style={{ background: 'rgba(255,255,255,0.07)', padding: '16px 18px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.12)', textDecoration: 'none', color: '#fff', transition: 'all 0.2s ease' }}>
                                    <div style={{ fontWeight: 800, fontSize: '1rem', color: '#a78bfa', marginBottom: '4px' }}>🔍 SEO Tools →</div>
                                    <p style={{ margin: 0, fontSize: '0.84rem', color: '#cbd5e1', lineHeight: 1.5 }}>Free tools to audit meta tags, heading structures, and search engine discoverability.</p>
                                </Link>

                                <Link href="/tools/geo-schema-generator" style={{ background: 'rgba(255,255,255,0.07)', padding: '16px 18px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.12)', textDecoration: 'none', color: '#fff', transition: 'all 0.2s ease' }}>
                                    <div style={{ fontWeight: 800, fontSize: '1rem', color: '#38bdf8', marginBottom: '4px' }}>🤖 GEO & AEO Tools →</div>
                                    <p style={{ margin: 0, fontSize: '0.84rem', color: '#cbd5e1', lineHeight: 1.5 }}>Generate SoftwareApplication schema blueprints for ChatGPT, Perplexity, and Gemini.</p>
                                </Link>

                                <Link href="/articles" style={{ background: 'rgba(255,255,255,0.07)', padding: '16px 18px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.12)', textDecoration: 'none', color: '#fff', transition: 'all 0.2s ease' }}>
                                    <div style={{ fontWeight: 800, fontSize: '1rem', color: '#f59e0b', marginBottom: '4px' }}>📚 LaunchXact Guides →</div>
                                    <p style={{ margin: 0, fontSize: '0.84rem', color: '#cbd5e1', lineHeight: 1.5 }}>Deep-dive positioning teardowns, conversion benchmarks, and distribution playbooks.</p>
                                </Link>

                                <Link
                                    href={`/#founder-form?website=${encodeURIComponent(url || '')}&product=${encodeURIComponent(ideaName || result?.idea_name || '')}&email=${encodeURIComponent(founderEmail || auditEmail || '')}&source=grader`}
                                    style={{ background: 'rgba(124,58,237,0.25)', padding: '16px 18px', borderRadius: '12px', border: '1px solid #7c3aed', textDecoration: 'none', color: '#fff', transition: 'all 0.2s ease' }}
                                >
                                    <div style={{ fontWeight: 800, fontSize: '1rem', color: '#c084fc', marginBottom: '4px' }}>🚀 Apply to Founding 50 →</div>
                                    <p style={{ margin: 0, fontSize: '0.84rem', color: '#e2e8f0', lineHeight: 1.5 }}>Get your product permanently listed in LaunchXact&apos;s curated discovery directory.</p>
                                </Link>
                            </div>

                            {/* CRITICAL NON-GATING EXPLANATION NOTICE */}
                            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '14px 18px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.55 }}>
                                <strong style={{ color: '#ffffff' }}>💡 How LaunchXact Curation Works:</strong> Your grader score is a free diagnostic tool to help you optimize your page. It is <em>not</em> an acceptance gate for product submission. LaunchXact&apos;s human curation team reviews every SaaS independently — a product scoring 62/100 can still be accepted into the Founding 50 if the underlying utility is strong.
                            </div>
                        </div>
                    </div>

                    {/* VIRAL SHARE CARD */}
                    <div style={{ margin: '3rem 0' }}>
                        <ToolShareCard
                            badge="Free SaaS Discovery Audit"
                            statHighlight={`${result.overall_score}/100`}
                            statLabel="Discovery Readiness Score"
                            subMetrics={[
                                { label: 'Messaging', value: `${result.pillar_scores?.messaging || 0}/100` },
                                { label: 'Conversion', value: `${result.pillar_scores?.conversion || 0}/100` },
                                { label: 'AI Discovery', value: `${result.pillar_scores?.ai_discovery || 0}/100` },
                            ]}
                            quote={result.verdict_headline}
                            toolName="Free SaaS Discovery Audit"
                            toolId="ai-saas-grader"
                            toolUrl="https://www.launchxact.com/grade"
                            shareTextX={`Just ran a Free SaaS Discovery Audit on "${result.idea_name || 'my product'}".\n\nDiscovery Score: ${result.overall_score}/100\nVerdict: ${result.verdict_headline}\n\nGet your free SaaS audit in 60s:`}
                            shareTitleReddit={`Ran my SaaS landing page through the LaunchXact Discovery Audit (${result.overall_score}/100)`}
                            shareTextReddit={`I just ran my SaaS ("${result.idea_name || 'My Product'}") through the LaunchXact Free SaaS Discovery Audit.\n\nOverall Score: ${result.overall_score}/100\nMessaging: ${result.pillar_scores?.messaging}/100\nAI Discovery: ${result.pillar_scores?.ai_discovery}/100\n\nCheck your SaaS readiness here: https://www.launchxact.com/grade`}
                            copySummaryText={`LaunchXact Discovery Audit: ${result.idea_name || 'My SaaS'}\nOverall Score: ${result.overall_score}/100\nVerdict: ${result.verdict_headline}\nhttps://www.launchxact.com/grade`}
                        />
                    </div>

                    {/* EMAIL BLUEPRINT CAPTURE */}
                    <div className={styles.emailCaptureCard}>
                        <h4 className={styles.emailTitle}>Want the full AI Discovery Teardown & Fix Checklist?</h4>
                        <p className={styles.emailSub}>
                            We&apos;ll send your confidential score breakdown and actionable copy rewrites directly to your inbox.
                        </p>

                        {emailSent ? (
                            <div className={styles.emailSuccess}>
                                ✓ Discovery Audit Report dispatched to <strong>{auditEmail || founderEmail}</strong>! Check your inbox in 2 minutes.
                            </div>
                        ) : (
                            <form onSubmit={handleFullAudit} className={styles.emailForm}>
                                <input
                                    type="email"
                                    className={styles.emailInput}
                                    placeholder="founder@yourcompany.com"
                                    required
                                    value={auditEmail}
                                    onChange={(e) => setAuditEmail(e.target.value)}
                                    disabled={isAuditing}
                                />
                                <button
                                    type="submit"
                                    className={styles.emailBtn}
                                    disabled={isAuditing}
                                >
                                    {isAuditing ? 'Sending Report...' : 'Send Me The Full Dossier →'}
                                </button>
                            </form>
                        )}
                        {auditError && <p className={styles.emailErrorMsg}>{auditError}</p>}
                    </div>

                </section>
            )}
        </div>
    );
}
