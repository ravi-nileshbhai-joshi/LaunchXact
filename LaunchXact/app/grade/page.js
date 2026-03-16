'use client';
import { useState, useEffect, useRef } from 'react';
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
    const resultsRef = useRef(null);

    useEffect(() => {
        if (status === 'done' && resultsRef.current) {
            const yOffset = -120; // Increased offset to ensure it stops before touching nav bar
            const elementY = resultsRef.current.getBoundingClientRect().top;
            const targetY = elementY + window.scrollY + yOffset;
            
            // Custom Ease-In-Out Smooth Scroll
            const duration = 1500; // 1.5 seconds for a slower, premium feel
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
                    window.scrollTo(0, targetY); // Ensure it lands exactly on the target
                }
            };

            requestAnimationFrame(animation);
        }
    }, [status]);

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

    const getTweetText = () => {
        if (!result) return '';

        const score = result.total_score;
        const archetype = result.founder_archetype;
        const url_clean = 'www.launchxact.com/grade';
        const officialTags = '@LaunchXact @Ravi_Nileshbhai';

        if (score >= 85) {
            return `Just got a ${score}/100 on the ${officialTags} AI Auditor. Apparently, I'm "${archetype}." 🚀\n\nMy primary headline was weak, but the AI rewrite is fire. Check your SaaS readiness: ${url_clean}`;
        }

        return `I just got my LaunchXact Readiness Score: ${score}/100 ${getScoreEmoji(score)}\n\nMy Founder Archetype: "${archetype}"\n\nCheck yours here (via ${officialTags}) → ${url_clean}`;
    };

    const tweetText = getTweetText();

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

            {status === 'done' && result && (
                <section ref={resultsRef} className={styles.results}>

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

                    {/* Launch Readiness Meter */}
                    <div className={styles.readinessSection}>
                        <div className={styles.readinessHeader}>
                            <h3 className={styles.readinessTitle}>Launch Readiness</h3>
                            <div className={styles.readinessOverall}>
                                <span className={styles.readinessValue}>{(animatedScore / 10).toFixed(1)}</span>
                                <span className={styles.readinessMax}>/10</span>
                            </div>
                        </div>
                        
                        <div className={styles.readinessMeter}>
                            <div 
                                className={`${styles.readinessBar} ${styles[`readinessBar${getScoreColor(animatedScore)}`]}`}
                                style={{ width: `${animatedScore}%` }}
                            />
                        </div>

                        <div className={styles.readinessGuidance}>
                            {animatedScore < 65 && "🚨 Improve messaging and trust signals before launch."}
                            {animatedScore >= 65 && animatedScore < 80 && "✨ You're close. Optimize a few elements to hit the Genesis Batch bar."}
                            {animatedScore >= 80 && "🚀 Ready for Genesis Batch submission. High conversion potential."}
                        </div>

                        <div className={styles.readinessGrid}>
                            <div className={styles.readinessItem}>
                                <div className={styles.readinessItemLabel}>Landing Page Clarity</div>
                                <div className={styles.readinessItemTrack}>
                                    <div className={styles.readinessItemFill} style={{ width: `${(result.pillar_scores?.hook + result.pillar_scores?.friction) / 2 || 0}%` }} />
                                </div>
                            </div>
                            <div className={styles.readinessItem}>
                                <div className={styles.readinessItemLabel}>Messaging Strength</div>
                                <div className={styles.readinessItemTrack}>
                                    <div className={styles.readinessItemFill} style={{ width: `${result.pillar_scores?.distribution || 0}%` }} />
                                </div>
                            </div>
                            <div className={styles.readinessItem}>
                                <div className={styles.readinessItemLabel}>Conversion Potential</div>
                                <div className={styles.readinessItemTrack}>
                                    <div className={styles.readinessItemFill} style={{ width: `${result.pillar_scores?.trust || 0}%` }} />
                                </div>
                            </div>
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

                    {/* Visual Launch Roadmap */}
                    <div className={styles.roadmapSection}>
                        <h3 className={styles.roadmapTitle}>What happens if you launch on LaunchXact?</h3>
                        <div className={styles.roadmapLine}>
                            <div className={styles.roadmapStep}>
                                <div className={styles.roadmapStepIcon}>1</div>
                                <div className={styles.roadmapCard}>
                                    <h4>Genesis Batch Launch</h4>
                                    <p>Your product launches with a curated batch of new SaaS tools.</p>
                                </div>
                            </div>
                            <div className={styles.roadmapStep}>
                                <div className={styles.roadmapStepIcon}>2</div>
                                <div className={styles.roadmapCard}>
                                    <h4>Visibility Cycles</h4>
                                    <p>Your product enters the Founder Visibility Engine for guaranteed exposure.</p>
                                </div>
                            </div>
                            <div className={styles.roadmapStep}>
                                <div className={styles.roadmapStepIcon}>3</div>
                                <div className={styles.roadmapCard}>
                                    <h4>Proof of Life</h4>
                                    <p>Connect GitHub or payment platforms to verify active development.</p>
                                </div>
                            </div>
                            <div className={styles.roadmapStep}>
                                <div className={styles.roadmapStepIcon}>4</div>
                                <div className={styles.roadmapCard}>
                                    <h4>AI Discovery</h4>
                                    <p>Your tool becomes indexable by intent-based AI semantic search.</p>
                                </div>
                            </div>
                            <div className={styles.roadmapStep}>
                                <div className={styles.roadmapStepIcon}>5</div>
                                <div className={styles.roadmapCard}>
                                    <h4>Discovery Map</h4>
                                    <p>Buyers find your product inside real-world B2B workflows.</p>
                                </div>
                            </div>
                        </div>
                    </div>

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

                                <div className={styles.benefitsBox}>
                                    <h4 className={styles.benefitsTitle}>Genesis Batch Benefits</h4>
                                    <ul className={styles.benefitsList}>
                                        <li><span>✓</span> Curated launch alongside premium tools</li>
                                        <li><span>✓</span> Lifetime discovery cycles</li>
                                        <li><span>✓</span> Semantic search discovery integration</li>
                                        <li><span>✓</span> Proof-of-life verification badge</li>
                                        <li><span>✓</span> Optional native checkout & hosting</li>
                                        <li><span>✓</span> LaunchXact ecosystem tool inclusion</li>
                                    </ul>
                                </div>
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
                            🚀 Submit to Reddit
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
                        {emailSent ? (
                            <div className={styles.badgeSuccess}>
                                <div className={styles.badgeInner}>
                                    <p className={styles.badgeSuccessMsg}>✓ Audit sent to <strong>{auditEmail}</strong>!</p>
                                    <div className={styles.badgeCodeWrapper}>
                                        <p className={styles.badgeCodeLabel}>Your Selection Badge HTML:</p>
                                        <code className={styles.badgeCode}>
                                            {`<a href="https://www.launchxact.com/grade?url=${url}" target="_blank">
  <img src="https://www.launchxact.com/badges/selected-genesis.svg" alt="LaunchXact Selected Genesis Batch" width="180" />
</a>`}
                                        </code>
                                        <button
                                            className={styles.copyBadgeBtn}
                                            onClick={() => {
                                                navigator.clipboard.writeText(`<a href="https://www.launchxact.com/grade?url=${url}" target="_blank">\n  <img src="https://www.launchxact.com/badges/selected-genesis.svg" alt="LaunchXact Selected Genesis Batch" width="180" />\n</a>`);
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

                    {/* Share Card (Visual Preview for Founders) */}
                    <div className={styles.shareCardContainer}>
                        <div className={styles.shareCard}>
                            <div className={styles.shareCardHeader}>
                                <div className={styles.shareCardBrand}>LaunchXact</div>
                                <div className={styles.shareCardStatus}>Genesis Batch Ready</div>
                            </div>
                            <div className={styles.shareCardBody}>
                                <div className={styles.shareCardScore}>
                                    <span className={styles.shareCardNumber}>{result.total_score}</span>
                                    <span className={styles.shareCardLabel}>Audit Score</span>
                                </div>
                                <div className={styles.shareCardInfo}>
                                    <div className={styles.shareCardName}>{result.product_name || 'Your SaaS'}</div>
                                    <div className={styles.shareCardArchetype}>{result.founder_archetype}</div>
                                </div>
                            </div>
                        <div className={styles.shareCardFooter}>
                                <p>“{result.action_items?.[0] || 'Optimized for high-growth SaaS distribution.'}”</p>
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}
