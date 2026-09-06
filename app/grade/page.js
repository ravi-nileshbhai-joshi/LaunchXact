'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import ToolShareCard from '@/components/tools/ToolShareCard';
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

export default function GradePage() {
    // Form fields
    const [ideaName, setIdeaName] = useState('');
    const [targetCustomer, setTargetCustomer] = useState('');
    const [pricing, setPricing] = useState('');
    const [description, setDescription] = useState('');
    const [competitors, setCompetitors] = useState('');
    const [distribution, setDistribution] = useState('');
    const [url, setUrl] = useState('');

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
    const handleGrade = async (e) => {
        e.preventDefault();
        if (!ideaName.trim() && !description.trim() && !url.trim()) {
            setError('Please enter at least your SaaS Idea Name or Description.');
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
                body: JSON.stringify({
                    ideaName: ideaName.trim(),
                    targetCustomer: targetCustomer.trim(),
                    pricing: pricing.trim(),
                    description: description.trim(),
                    competitors: competitors.trim(),
                    distribution: distribution.trim(),
                    url: url.trim(),
                }),
            });

            const data = await res.json();
            clearInterval(quipInterval);

            if (!res.ok) {
                throw new Error(data.error || 'Something went wrong while grading.');
            }

            setResult(data);
            setStatus('done');

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

    const getScoreEmoji = (score) => {
        if (score >= 85) return '🔥';
        if (score >= 70) return '🚀';
        if (score >= 50) return '⚡';
        if (score >= 35) return '⚠️';
        return '🚨';
    };

    // Pillar configuration
    const pillars = [
        {
            key: 'market_potential',
            label: 'Market Potential',
            desc: 'TAM size, expansion velocity, and urgency of budget.',
        },
        {
            key: 'problem_severity',
            label: 'Problem Severity',
            desc: 'Bleeding-neck painkiller ($10k+ problem) vs optional vitamin.',
        },
        {
            key: 'competition_moat',
            label: 'Competition & Moat',
            desc: 'Defensibility against OpenAI native models & incumbent cloning.',
        },
        {
            key: 'distribution',
            label: 'Distribution Reality',
            desc: 'Repeatable acquisition channel vs wishful thinking.',
        },
        {
            key: 'monetization',
            label: 'Monetization Power',
            desc: 'Willingness to pay, margin health against LLM inference.',
        },
        {
            key: 'ai_defensibility',
            label: 'AI Defensibility',
            desc: 'Proprietary workflows & switching costs vs thin API wrapper.',
        },
    ];

    // Weakest pillar information
    const weakestKey = result?.weakest_pillar || 'distribution';
    const weakestScore = result?.pillar_scores?.[weakestKey] ?? 0;
    const weakestName = result?.weakest_pillar_name || 'Distribution Strategy';

    // SVG circle calculations
    const radius = 90;
    const circumference = 2 * Math.PI * radius;
    const scorePercent = result ? (animatedScore / 100) : 0;
    const dashOffset = circumference * (1 - scorePercent);

    return (
        <div className={styles.page}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
                <Breadcrumb items={[
                    { label: 'Founder Tools', href: '/tools' },
                    { label: 'AI SaaS Viability Grader' }
                ]} />
            </div>

            {/* LAYER 1: THE BRUTAL ACQUISITION HOOK */}
            <section className={styles.hero}>
                <div className={styles.badgeRow}>
                    <span className={styles.topBadge}>
                        🔥 60-SECOND BRUTAL AUDIT · TOP OF FUNNEL
                    </span>
                </div>
                <h1 className={styles.heroTitle}>
                    Will Your AI SaaS Idea<br />Actually Work?
                </h1>
                <p className={styles.heroSub}>
                    Get brutally graded before you burn 6 months and $20,000 building something nobody wants.
                    Scored on <strong>Market Potential, Problem Severity, Defensibility, Distribution, Monetization, and Moat</strong>.
                </p>

                {/* Real-time Founder Proof Banner */}
                <div className={styles.socialProofBar}>
                    <span className={styles.proofDot} />
                    <span className={styles.proofText}>
                        <strong>{founderCount} founders</strong> have already joined the Genesis Batch. Real-time founder intelligence · 0% generic fluff.
                    </span>
                </div>
            </section>

            {/* LAYER 2: THE INTERACTIVE PROFILE INPUT */}
            <section className={styles.formContainer}>
                {/* Quick Presets Bar */}
                <div className={styles.presetsBar}>
                    <span className={styles.presetsLabel}>⚡ Quick Presets:</span>
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
                        {/* 1. Idea Name */}
                        <div className={styles.formGroup}>
                            <label htmlFor="idea-name" className={styles.inputLabel}>
                                1. SaaS / Idea Name <span className={styles.required}>*</span>
                            </label>
                            <input
                                id="idea-name"
                                type="text"
                                className={styles.textInput}
                                placeholder="e.g. SQLNinja AI, ChargeShield, AutoBrief..."
                                value={ideaName}
                                onChange={(e) => setIdeaName(e.target.value)}
                                disabled={status === 'loading'}
                            />
                        </div>

                        {/* 2. Target Customer */}
                        <div className={styles.formGroup}>
                            <label htmlFor="target-customer" className={styles.inputLabel}>
                                2. Target Customer (ICP) <span className={styles.required}>*</span>
                            </label>
                            <input
                                id="target-customer"
                                type="text"
                                className={styles.textInput}
                                placeholder="e.g. Solo founders, B2B sales reps, Shopify stores doing $50k+/mo..."
                                value={targetCustomer}
                                onChange={(e) => setTargetCustomer(e.target.value)}
                                disabled={status === 'loading'}
                            />
                        </div>

                        {/* 3. Pricing Model */}
                        <div className={styles.formGroup}>
                            <label htmlFor="pricing-model" className={styles.inputLabel}>
                                3. Pricing Model & Price Point <span className={styles.required}>*</span>
                            </label>
                            <input
                                id="pricing-model"
                                type="text"
                                className={styles.textInput}
                                placeholder="e.g. $49/mo subscription, Usage-based $0.02/token, $299/mo enterprise..."
                                value={pricing}
                                onChange={(e) => setPricing(e.target.value)}
                                disabled={status === 'loading'}
                            />
                        </div>

                        {/* 4. Known Competitors */}
                        <div className={styles.formGroup}>
                            <label htmlFor="competitors" className={styles.inputLabel}>
                                4. Competitors & Existing Alternatives
                            </label>
                            <input
                                id="competitors"
                                type="text"
                                className={styles.textInput}
                                placeholder="e.g. ChatGPT, Gong, Gorgias, manual spreadsheets..."
                                value={competitors}
                                onChange={(e) => setCompetitors(e.target.value)}
                                disabled={status === 'loading'}
                            />
                        </div>

                        {/* 5. Problem & Description (Full width) */}
                        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                            <label htmlFor="idea-desc" className={styles.inputLabel}>
                                5. Problem & Solution Description <span className={styles.required}>*</span>
                            </label>
                            <textarea
                                id="idea-desc"
                                className={styles.textArea}
                                rows={3}
                                placeholder="What urgent, expensive problem are you solving? How does your AI workflow actually work under the hood?"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                disabled={status === 'loading'}
                            />
                        </div>

                        {/* 6. Distribution Strategy (Full width) */}
                        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                            <label htmlFor="distribution-strategy" className={styles.inputLabel}>
                                6. Distribution Strategy (How will you get your first 100 paying customers?) <span className={styles.required}>*</span>
                            </label>
                            <input
                                id="distribution-strategy"
                                type="text"
                                className={styles.textInput}
                                placeholder="e.g. Cold outbound on LinkedIn, Product Hunt launch, Shopify App store ranking, niche Discord community..."
                                value={distribution}
                                onChange={(e) => setDistribution(e.target.value)}
                                disabled={status === 'loading'}
                            />
                        </div>

                        {/* 7. Optional Live URL */}
                        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                            <label htmlFor="live-url" className={styles.inputLabel}>
                                7. Live Landing Page or Prototype URL <span className={styles.optional}>(Optional)</span>
                            </label>
                            <input
                                id="live-url"
                                type="text"
                                className={styles.textInput}
                                placeholder="https://your-startup.com (we'll scrape H1, CTAs & proof signals if available)"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
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
                            {status === 'loading' ? 'Analyzing 6 Viability Pillars...' : '🔥 Brutally Grade My AI SaaS in 60s →'}
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
                    <p className={styles.loadingTitle}>Conducting Ruthless Viability Audit...</p>
                    <p className={styles.loadingQuip}>{loadingQuip}</p>
                </section>
            )}

            {/* LAYER 3: THE "AHA" MOMENT & RESULTS */}
            {status === 'done' && result && (
                <section ref={resultsRef} className={styles.resultsSection}>

                    {/* OVERALL VIABILITY SCORE HUD */}
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
                                <div className={styles.scoreCaption}>Overall Viability</div>
                            </div>
                        </div>

                        <div className={styles.hudMeta}>
                            <div className={styles.archetypeBadge}>
                                <span className={styles.archetypeIcon}>{getScoreEmoji(result.overall_score)}</span>
                                <span className={styles.archetypeName}>{result.founder_archetype}</span>
                            </div>

                            <h2 className={styles.verdictTitle}>
                                “{result.verdict_headline}”
                            </h2>

                            <div className={styles.weakestWarning}>
                                <span className={styles.warningIcon}>🚨</span>
                                <div>
                                    <strong className={styles.warningLabel}>Single Fatal Bottleneck:</strong>
                                    <span className={styles.warningPillar}>
                                        {' '}{result.weakest_pillar_name} ({result.pillar_scores?.[result.weakest_pillar]}/100)
                                    </span>
                                    <p className={styles.warningDiagnosis}>
                                        {result.weakness_diagnosis}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 6-PILLAR SCORECARD GRID */}
                    <div className={styles.pillarsSection}>
                        <div className={styles.pillarsHeader}>
                            <h3 className={styles.pillarsTitle}>The 6 Core Viability Pillars</h3>
                            <span className={styles.pillarsSub}>Ruthless score per dimension</span>
                        </div>

                        <div className={styles.pillarsGrid}>
                            {pillars.map((p) => {
                                const score = result.pillar_scores?.[p.key] ?? 0;
                                const isWeakest = result.weakest_pillar === p.key;

                                return (
                                    <div
                                        key={p.key}
                                        className={`${styles.pillarCard} ${isWeakest ? styles.pillarCardWeakest : ''}`}
                                    >
                                        {isWeakest && (
                                            <div className={styles.weakestBadgeTag}>
                                                🚨 FATAL BOTTLENECK
                                            </div>
                                        )}
                                        <div className={styles.pillarTop}>
                                            <span className={styles.pillarName}>{p.label}</span>
                                            <span className={`${styles.pillarScoreVal} ${getScoreColorClass(score)}`}>
                                                {score}<small>/100</small>
                                            </span>
                                        </div>

                                        <div className={styles.pillarMeterTrack}>
                                            <div
                                                className={`${styles.pillarMeterBar} ${getScoreColorClass(score)}`}
                                                style={{ width: `${score}%` }}
                                            />
                                        </div>

                                        <p className={styles.pillarDescription}>{p.desc}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* BRUTAL CRITIQUE DEEP-DIVE */}
                    <div className={styles.critiqueCard}>
                        <div className={styles.critiqueHeader}>
                            <span className={styles.critiqueBadge}>Senior Founder Review</span>
                            <h3 className={styles.critiqueHeading}>The Raw, Unvarnished Truth</h3>
                        </div>
                        <div className={styles.critiqueBody}>
                            {result.brutal_critique?.split('\n\n').map((para, i) => (
                                <p key={i}>{para}</p>
                            ))}
                        </div>
                    </div>

                    {/* "HERE'S WHAT WE'D CHANGE" PIVOT PLAYBOOK */}
                    {result.action_items && result.action_items.length > 0 && (
                        <div className={styles.pivotCard}>
                            <h3 className={styles.pivotTitle}>Here&apos;s What We&apos;d Change Before Writing Code</h3>
                            <div className={styles.actionItemsList}>
                                {result.action_items.map((item, idx) => (
                                    <div key={idx} className={styles.actionItemRow}>
                                        <span className={styles.actionIndex}>{idx + 1}</span>
                                        <p className={styles.actionText}>{item}</p>
                                    </div>
                                ))}
                            </div>

                            {result.ai_pricing_advice && (
                                <div className={styles.pricingAdviceBox}>
                                    <div className={styles.pricingAdviceLabel}>💰 Pricing Power & Margin Recommendation</div>
                                    <p className={styles.pricingAdviceText}>{result.ai_pricing_advice}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* LAYER 4: DEDICATED GENESIS BATCH TRANSITION FUNNEL */}
                    <div className={styles.genesisFunnelCard}>
                        <div className={styles.genesisGlow} />
                        <div className={styles.genesisHeader}>
                            <span className={styles.genesisPill}>✦ Dedicated Founder Transition</span>
                            <h3 className={styles.genesisTitle}>Want to fix the weaknesses?</h3>
                            <p className={styles.genesisSub}>
                                Join the LaunchXact Genesis Batch. We don&apos;t just diagnose fatal bottlenecks — we solve them with native B2B infrastructure.
                            </p>
                        </div>

                        {/* Highlight weakest score specifically */}
                        <div className={styles.genesisBottleneckCallout}>
                            <div className={styles.bottleneckIcon}>⚡</div>
                            <div className={styles.bottleneckContent}>
                                <h4 className={styles.bottleneckHeading}>
                                    {weakestName}: {weakestScore}/100
                                </h4>
                                <p className={styles.bottleneckMessage}>
                                    That&apos;s probably the single biggest existential risk to <strong>{result.idea_name || 'your idea'}</strong>.
                                    We&apos;re building LaunchXact for exactly this: zero-overhead global payments, built-in directory distribution,
                                    and enterprise compliance so you can focus on engineering defensibility.
                                </p>
                            </div>
                        </div>

                        {/* Genesis Batch Perks List */}
                        <div className={styles.perksGrid}>
                            <div className={styles.perkItem}>
                                <span className={styles.perkCheck}>✓</span>
                                <div>
                                    <strong>0% launch platform fees</strong>
                                    <p>Zero platform fees on all marketplace transactions for your first 90 days.</p>
                                </div>
                            </div>
                            <div className={styles.perkItem}>
                                <span className={styles.perkCheck}>✓</span>
                                <div>
                                    <strong>Direct distribution push</strong>
                                    <p>Featured exposure to our network of 400+ verified B2B software buyers.</p>
                                </div>
                            </div>
                            <div className={styles.perkItem}>
                                <span className={styles.perkCheck}>✓</span>
                                <div>
                                    <strong>1-on-1 architecture review</strong>
                                    <p>Deep-dive with senior SaaS architects to lock down AI defensibility.</p>
                                </div>
                            </div>
                            <div className={styles.perkItem}>
                                <span className={styles.perkCheck}>✓</span>
                                <div>
                                    <strong>Unified multi-region billing</strong>
                                    <p>Instant Merchant of Record support with 100% automated international VAT/sales tax.</p>
                                </div>
                            </div>
                        </div>

                        {/* Dynamic Honest Founder Counter & CTA */}
                        <div className={styles.genesisCtaRow}>
                            <div className={styles.genesisCounterBadge}>
                                <span className={styles.pulseDot} />
                                <span><strong>{founderCount} founders</strong> have already joined</span>
                            </div>

                            <Link
                                href={`/?idea=${encodeURIComponent(result.idea_name || ideaName)}&weakness=${encodeURIComponent(weakestName)}&score=${result.overall_score}&from_grader=true#founder-form`}
                                className={styles.genesisApplyBtn}
                            >
                                Apply for Genesis Batch →
                            </Link>
                        </div>
                    </div>

                    {/* LAYER 5: VIRAL GROWTH LOOP (ToolShareCard) */}
                    <div style={{ margin: '3rem 0' }}>
                        <ToolShareCard
                            badge="AI SaaS Viability Audit"
                            statHighlight={`${result.overall_score}/100`}
                            statLabel="Launch Viability Score"
                            subMetrics={[
                                { label: 'Archetype', value: result.founder_archetype || 'Builder' },
                                { label: 'Weakest Link', value: `${weakestName} (${weakestScore})` },
                                { label: 'Moat Rating', value: `${result.pillar_scores?.competition_moat || 0}/100` },
                            ]}
                            quote={result.verdict_headline}
                            toolName="AI SaaS Viability Grader"
                            toolUrl="https://www.launchxact.com/grade"
                            shareTextX={`Just put my SaaS idea "${result.idea_name || 'project'}" through the @LaunchXact Brutal AI Grader.\n\nViability: ${result.overall_score}/100 ${getScoreEmoji(result.overall_score)}\nArchetype: "${result.founder_archetype}"\nFatal Bottleneck: ${weakestName} (${weakestScore}/100)\n\nGrade your AI SaaS in 60s:`}
                            shareTitleReddit={`My AI SaaS idea just got a ${result.overall_score}/100 brutal viability score 💀`}
                            shareTextReddit={`I just ran my SaaS idea ("${result.idea_name || 'My Project'}") through the LaunchXact Brutal AI Grader.\n\nOverall Score: ${result.overall_score}/100\nVerdict: ${result.verdict_headline}\nFatal Bottleneck: ${weakestName} (${weakestScore}/100)\n\nCheck your startup viability here: https://www.launchxact.com/grade`}
                            copySummaryText={`LaunchXact AI Viability Audit: ${result.idea_name || 'My SaaS'}\nOverall Score: ${result.overall_score}/100\nArchetype: "${result.founder_archetype}"\nFatal Bottleneck: ${weakestName} (${weakestScore}/100)\nVerdict: ${result.verdict_headline}\nhttps://www.launchxact.com/grade`}
                        />
                    </div>

                    {/* EMAIL CAPTURE: FULL 5-PAGE BLUEPRINT */}
                    <div className={styles.emailCaptureCard}>
                        <h4 className={styles.emailTitle}>Want the full 5-page AI Viability & Distribution Blueprint?</h4>
                        <p className={styles.emailSub}>
                            We&apos;ll send you the deep-dive positioning teardown, 30-day validation sprint checklist, and technical moat blueprint directly to your inbox.
                        </p>

                        {emailSent ? (
                            <div className={styles.emailSuccess}>
                                ✓ Blueprint dispatched to <strong>{auditEmail}</strong>! Check your inbox in 2 minutes.
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
                                    {isAuditing ? 'Generating Blueprint...' : 'Send Me The Full Dossier →'}
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
