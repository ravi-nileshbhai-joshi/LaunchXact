'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import styles from './page.module.css';

const LOADING_QUIPS = [
    "Scanning for trust signals...",
    "Checking if your CTA is hiding...",
    "Judging your headline choices...",
    "Looking for social proof...",
    "Simulating a buyer's journey...",
    "Calculating your founder archetype...",
];

export default function GradePage() {
    const [url, setUrl] = useState('');
    const [status, setStatus] = useState('idle'); // idle | loading | done | error
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [loadingQuip, setLoadingQuip] = useState(LOADING_QUIPS[0]);
    const [animatedScore, setAnimatedScore] = useState(0);
    const [emailSent, setEmailSent] = useState(false);
    const [auditEmail, setAuditEmail] = useState('');
    const [isAuditing, setIsAuditing] = useState(false);
    const [auditError, setAuditError] = useState('');

    const handleGrade = async (e) => {
        e.preventDefault();
        if (!url.trim()) return;

        setStatus('loading');
        setError('');
        setResult(null);
        setAnimatedScore(0);

        // Rotate quips
        let quipIdx = 0;
        const quipInterval = setInterval(() => {
            quipIdx = (quipIdx + 1) % LOADING_QUIPS.length;
            setLoadingQuip(LOADING_QUIPS[quipIdx]);
        }, 2000);

        try {
            const res = await fetch('/api/grade', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: url.trim() }),
            });

            const data = await res.json();

            clearInterval(quipInterval);

            if (!res.ok) {
                throw new Error(data.error || 'Something went wrong');
            }

            setResult(data);
            setStatus('done');

            // Save to DB if not demo
            if (!data.is_demo) {
                try {
                    await supabase.from('grader_results').insert([{
                        url: url.trim(),
                        product_name: data.product_name || 'Unknown',
                        score: data.total_score,
                        archetype: data.founder_archetype
                    }]);
                } catch (dbErr) {
                    console.error('Failed to save result:', dbErr);
                }
            }

            // Animate score counter
            const target = data.total_score || 0;
            let current = 0;
            const step = Math.max(1, Math.floor(target / 50));
            const scoreInterval = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(scoreInterval);
                }
                setAnimatedScore(current);
            }, 25);

        } catch (err) {
            clearInterval(quipInterval);
            setError(err.message);
            setStatus('error');
        }
    };

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
                    url: url.trim(),
                    email: auditEmail.trim(),
                    summaryResult: result
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Audit failed');

            setEmailSent(true);
        } catch (err) {
            setAuditError(err.message);
        } finally {
            setIsAuditing(false);
        }
    };

    const getScoreColor = (score) => {
        if (score >= 80) return 'Green';
        if (score >= 50) return 'Amber';
        return 'Red';
    };

    const getScoreEmoji = (score) => {
        if (score >= 90) return '🔥';
        if (score >= 80) return '🚀';
        if (score >= 60) return '⚡';
        if (score >= 40) return '🔧';
        return '🚨';
    };

    // SVG circle math
    const radius = 88;
    const circumference = 2 * Math.PI * radius;
    const scorePercent = result ? (animatedScore / 100) : 0;
    const dashOffset = circumference * (1 - scorePercent);

    const tweetText = result
        ? `I just got my LaunchXact Readiness Score: ${result.total_score}/100 ${getScoreEmoji(result.total_score)}\n\nMy Founder Archetype: "${result.founder_archetype}"\n\nCheck yours → https://launchxact.com/grade`
        : '';

    const pillarConfig = [
        { key: 'hook', name: 'The Hook', weight: '30%' },
        { key: 'trust', name: 'Trust Signal', weight: '30%' },
        { key: 'friction', name: 'Buyer Friction', weight: '20%' },
        { key: 'distribution', name: 'Distribution', weight: '20%' },
    ];

    return (
        <div className={styles.page}>
            {/* HERO */}
            <section className={styles.hero}>
                <h1 className={styles.heroTitle}>
                    Is Your SaaS Ready for<br />the Genesis Batch?
                </h1>
                <p className={styles.heroSub}>
                    Free AI-powered audit of your landing page. Get scored on conversion psychology,
                    trust signals, and distribution readiness — by a founder, not a robot.
                </p>
                <span className={styles.qualifier}>
                    ⚡ Score 80+ to fast-track your application
                </span>
            </section>

            {/* URL INPUT */}
            <section className={styles.inputSection}>
                <form onSubmit={handleGrade}>
                    <div className={styles.inputWrapper}>
                        <input
                            id="grade-url-input"
                            type="text"
                            className={styles.urlInput}
                            placeholder="Paste your landing page URL..."
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            disabled={status === 'loading'}
                        />
                        <button
                            id="grade-submit-btn"
                            type="submit"
                            className={styles.gradeBtn}
                            disabled={status === 'loading' || !url.trim()}
                        >
                            {status === 'loading' ? 'Grading...' : 'Grade My SaaS'}
                        </button>
                    </div>
                    {error && <p className={styles.errorMsg}>{error}</p>}
                </form>
            </section>

            {/* LOADING */}
            {status === 'loading' && (
                <section className={styles.loadingSection}>
                    <div className={styles.spinner} />
                    <p className={styles.loadingText}>Auditing your landing page...</p>
                    <p className={styles.loadingWit}>{loadingQuip}</p>
                </section>
            )}

            {/* RESULTS */}
            {status === 'done' && result && (
                <section className={styles.results}>

                    {/* Demo Banner */}
                    {result.is_demo && (
                        <div className={styles.demoBanner}>
                            📋 This is a demo result. Connect an OpenAI API key for live AI grading.
                        </div>
                    )}

                    {/* Score Ring */}
                    <div className={styles.scoreSection}>
                        <div className={styles.scoreRing}>
                            <svg className={styles.scoreRingSvg} viewBox="0 0 200 200">
                                <circle className={styles.scoreTrack} cx="100" cy="100" r={radius} />
                                <circle
                                    className={`${styles.scoreFill} ${styles[`scoreFill${getScoreColor(result.total_score)}`]}`}
                                    cx="100" cy="100" r={radius}
                                    strokeDasharray={circumference}
                                    strokeDashoffset={dashOffset}
                                />
                            </svg>
                            <div className={styles.scoreValue}>
                                <div className={`${styles.scoreNumber} ${styles[`scoreNumber${getScoreColor(result.total_score)}`]}`}>
                                    {animatedScore}
                                </div>
                                <div className={styles.scoreLabel}>Launch Score</div>
                            </div>
                        </div>

                        {/* Archetype Badge */}
                        <div className={styles.archetypeBadge}>
                            <span className={styles.archetypeIcon}>{getScoreEmoji(result.total_score)}</span>
                            {result.founder_archetype}
                        </div>
                    </div>

                    {/* Roast Summary */}
                    <div className={styles.roastCard}>
                        <div className={styles.roastLabel}>The Verdict</div>
                        <p className={styles.roastText}>{result.roast_summary}</p>
                    </div>

                    {/* Pillar Breakdown */}
                    <div className={styles.pillarsGrid}>
                        {pillarConfig.map((pillar) => (
                            <div key={pillar.key} className={styles.pillarCard}>
                                <div className={`${styles.pillarScore} ${styles[`scoreNumber${getScoreColor(result.pillar_scores?.[pillar.key] || 0)}`]}`}>
                                    {result.pillar_scores?.[pillar.key] || '—'}
                                </div>
                                <div className={styles.pillarName}>{pillar.name}</div>
                                <div className={styles.pillarWeight}>{pillar.weight} weight</div>
                            </div>
                        ))}
                    </div>

                    {/* Headline Rewrite */}
                    {result.ai_rewrite_h1 && (
                        <div className={styles.headlineRewrite}>
                            <div className={styles.headlineLabel}>AI Headline Rewrite</div>
                            <div className={styles.headlineCompare}>
                                <div className={styles.headlineBefore}>
                                    <div className={`${styles.headlineTag} ${styles.headlineTagBefore}`}>Current</div>
                                    <p className={styles.headlineText}>{result.original_h1 || 'No H1 found'}</p>
                                </div>
                                <div className={styles.headlineAfter}>
                                    <div className={`${styles.headlineTag} ${styles.headlineTagAfter}`}>AI Suggestion</div>
                                    <p className={styles.headlineText}>{result.ai_rewrite_h1}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Action Items */}
                    {result.action_items && result.action_items.length > 0 && (
                        <div className={styles.actionItems}>
                            <div className={styles.actionItemsTitle}>Top 3 Things to Fix</div>
                            {result.action_items.map((item, i) => (
                                <div key={i} className={styles.actionItem}>
                                    <div className={styles.actionNumber}>{i + 1}</div>
                                    <p className={styles.actionText}>{item}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Bridge CTA */}
                    <div className={styles.bridgeCta}>
                        {result.total_score >= 80 ? (
                            <>
                                <p className={styles.bridgeText}>
                                    🎉 <strong>Congratulations! You scored {result.total_score}/100.</strong> Your SaaS qualifies for fast-track
                                    submission to the Genesis Batch. We&apos;ve pre-filled your application based on this audit.
                                </p>
                                <Link
                                    href={`/?website=${encodeURIComponent(url)}&description=${encodeURIComponent(result.ai_rewrite_h1 || '')}&grade_score=${result.total_score}&archetype=${encodeURIComponent(result.founder_archetype || '')}&from_grader=true#founder-form`}
                                    className={styles.bridgeBtn}
                                >
                                    🚀 Submit to Genesis Batch — Fast-Tracked
                                </Link>
                            </>
                        ) : (
                            <>
                                <p className={styles.bridgeText}>
                                    We&apos;ve analyzed your landing page. <strong>To maintain the quality of the Genesis Batch,
                                        we only accept products with a score of 80+.</strong> Use the action items above to improve,
                                    then grade again or submit anyway.
                                </p>
                                <Link
                                    href={`/?website=${encodeURIComponent(url)}&description=${encodeURIComponent(result.ai_rewrite_h1 || '')}&grade_score=${result.total_score}&archetype=${encodeURIComponent(result.founder_archetype || '')}&from_grader=true#founder-form`}
                                    className={styles.bridgeBtn}
                                >
                                    📝 Submit Anyway
                                </Link>
                            </>
                        )}
                        {result.ecosystem_nudge && (
                            <p className={styles.ecosystemNudge}>{result.ecosystem_nudge}</p>
                        )}
                    </div>

                    {/* Share */}
                    <div className={styles.shareRow}>
                        <a
                            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.shareBtn}
                        >
                            𝕏 Share on X
                        </a>
                        <a
                            href={`https://www.reddit.com/submit?title=${encodeURIComponent(`My SaaS got a ${result.total_score}/100 Launch Score! 🚀`)}&text=${encodeURIComponent(`I just used the LaunchXact AI Grader to audit my landing page.\n\nScore: ${result.total_score}/100\nArchetype: ${result.founder_archetype}\n\nCheck your SaaS readiness: https://launchxact.com/grade`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.shareBtn}
                        >
                             Submit to Reddit
                        </a>
                        <button
                            className={styles.shareBtn}
                            onClick={() => {
                                navigator.clipboard?.writeText(
                                    `My LaunchXact Readiness Score: ${result.total_score}/100 — "${result.founder_archetype}" 🚀\nhttps://launchxact.com/grade`
                                );
                                alert('Copied to clipboard!');
                            }}
                        >
                            📋 Copy Score
                        </button>
                    </div>

                    {/* Email Capture */}
                    <div className={styles.emailCapture}>
                        <div className={styles.emailCaptureTitle}>
                            Want the full 5-page AI Audit?
                        </div>
                        <p className={styles.emailCaptureSub}>
                            Get a detailed breakdown + the &quot;Selection Badge&quot; for your site. Enter your email to save your progress.
                        </p>
                        {emailSent ? (
                            <div className={styles.badgeSuccess}>
                                <div className={styles.badgeInner}>
                                    <p className={styles.badgeSuccessMsg}>✓ Audit sent to <strong>{auditEmail}</strong>!</p>
                                    <div className={styles.badgeCodeWrapper}>
                                        <p className={styles.badgeCodeLabel}>Your Selection Badge HTML:</p>
                                        <code className={styles.badgeCode}>
                                            {`<a href="https://launchxact.com/grade?url=${url}" target="_blank">
  <img src="https://launchxact.com/badges/selected-genesis.svg" alt="LaunchXact Selected Genesis Batch" width="180" />
</a>`}
                                        </code>
                                        <button
                                            className={styles.copyBadgeBtn}
                                            onClick={() => {
                                                navigator.clipboard.writeText(`<a href="https://launchxact.com/grade?url=${url}" target="_blank">\n  <img src="https://launchxact.com/badges/selected-genesis.svg" alt="LaunchXact Selected Genesis Batch" width="180" />\n</a>`);
                                                alert('Badge code copied!');
                                            }}
                                        >
                                            Copy Code
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <form
                                className={styles.emailForm}
                                onSubmit={handleFullAudit}
                            >
                                <input
                                    type="email"
                                    className={styles.emailInput}
                                    placeholder="founder@example.com"
                                    required
                                    value={auditEmail}
                                    onChange={(e) => setAuditEmail(e.target.value)}
                                    disabled={isAuditing}
                                />
                                <button type="submit" className={styles.emailSubmit} disabled={isAuditing}>
                                    {isAuditing ? 'Generating Audit...' : 'Get Full Audit'}
                                </button>
                                {auditError && <p className={styles.auditError}>{auditError}</p>}
                            </form>
                        )}
                    </div>
                </section>
            )}
        </div>
    );
}
