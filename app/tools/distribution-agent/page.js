'use client';

import { useState, useEffect } from 'react';
import Breadcrumb from '@/components/Breadcrumb';
import styles from './agent.module.css';

const TOOLS_LIST = [
    { id: 'auto', title: '🔄 Auto-Rotate (Anti-Repetition Memory)' },
    { id: 'saas-readiness-grader', title: '🎯 SaaS Launch Readiness Grader' },
    { id: 'true-cost-of-payments', title: '💸 The "True Cost of Payments" Simulator' },
    { id: 'franken-stack-cost-forecaster', title: '⚡ The "Franken-Stack" Cost Forecaster' },
    { id: 'pre-launch-distribution-architect', title: '🚀 The Pre-Launch Distribution Architect' },
    { id: 'geo-schema-snippet-generator', title: '🤖 GEO & AI Schema Snippet Generator' },
];

const ANGLES_LIST = [
    { id: 'auto', name: '🔄 Auto-Rotate Narrative Angle' },
    { id: 'contrarian_take', name: '🔥 The Contrarian Hot Take' },
    { id: 'hard_math_teardown', name: '📊 The Hard Math / Data Teardown' },
    { id: 'build_in_public_milestone', name: '🛠️ Build in Public & Traffic Case Study' },
    { id: 'tactical_playbook', name: '📋 The 4-Step Tactical Playbook' },
    { id: 'problem_agitate_solve', name: '⚠️ The Hidden Trap & Escape Hatch' },
    { id: 'engineering_as_marketing', name: '💡 Engineering-as-Marketing Philosophy' },
];

export default function DistributionAgentPage() {
    const [selectedTool, setSelectedTool] = useState('auto');
    const [selectedAngle, setSelectedAngle] = useState('auto');
    const [xMode, setXMode] = useState('single');
    const [activeTab, setActiveTab] = useState('x');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    
    // Initial post state
    const [postData, setPostData] = useState({
        hook: "Your 2.9%+30¢ pricing myth is stealing up to 22% of every international sale",
        tool: {
            id: "true-cost-of-payments",
            title: 'The "True Cost of Payments" Simulator',
            path: "/tools/true-cost-of-payments"
        },
        angle: {
            id: "contrarian_take",
            name: "The Contrarian Hot Take"
        },
        platforms: {
            x: {
                single: "Think 2.9%+30¢ is your only payment fee? Selling globally burns 15-22% of SaaS revenue on FX spreads, foreign card surcharges, and multi-state tax filing.\n\nWe built a free simulator to calculate your true leak: https://www.launchxact.com/tools/true-cost-of-payments?utm_source=twitter&utm_medium=social&utm_campaign=ai_agent_distrib",
                thread: [
                    "Most founders celebrate their first $10k month.\n\nThen tax season arrives, and they realize 18% of their gross revenue vanished into payment processing traps. 📉",
                    "Here's the trap:\n\nStripe advertises 2.9% + 30¢.\n\nWhat they don't highlight upfront:\n- 1.5% international card fees\n- 2% FX conversion spread\n- $15 chargeback defense fees\n- Nexus registration in 30+ US states + EU VAT",
                    "The traditional advice? Hire a $250/hr international CPA or spend 14 hours every month filing VAT MOSS returns.",
                    "The modern solution? Engineering as Marketing.\n\nInstead of writing another vague blog post, we built the True Cost of Payments Simulator. It models your real international leak in 60 seconds.",
                    "Audit your net payment margins for free:\nhttps://www.launchxact.com/tools/true-cost-of-payments?utm_source=twitter&utm_medium=social&utm_campaign=ai_agent_distrib\n\nRT if this helps a fellow builder keep their margins. 🚀"
                ]
            },
            linkedin: {
                content: `Most SaaS founders still believe payment processing is "just 2.9% + 30¢".\n\nThat simple number is the biggest financial trap in bootstrapped software.\n\n...see more\n\nWhen you start selling internationally, four hidden cost layers activate silently:\n\n1. Cross-Border Surcharges: 1.5% tacked onto every non-domestic credit card.\n2. FX Conversion Spreads: 2% lost every time a European customer pays in EUR and converts to USD.\n3. Compliance Overhead: Once you cross $10k in EU sales, you are legally required to register for VAT across European jurisdictions.\n4. Dispute & Chargeback Fees: $15 penalty per dispute, win or lose.\n\nFor a SaaS doing $20k MRR, that isn't $580 in processing fees.\nIt is often over $2,400 per month in net margin leakage.\n\nInstead of preaching this in an eBook, we wrote the code.\nWe built the "True Cost of Payments" Simulator on LaunchXact to calculate your actual leakage across 40+ countries in under a minute.\n\nCheck your true payment leak for free here:\nhttps://www.launchxact.com/tools/true-cost-of-payments?utm_source=linkedin&utm_medium=social&utm_campaign=ai_agent_distrib\n\n#buildinpublic #indiehackers #saas #startups`
            },
            indiehackers: {
                title: "Why 2.9% + 30¢ is a myth for global SaaS (and how our free simulator drove 400+ founder visits)",
                content: `## The Hidden Margin Leak Most Founders Ignore\n\nWhen I first started selling software internationally, I looked at Stripe's standard fee page and calculated our margins based on 2.9% + 30¢. \n\nBy month six, our net take-home was missing nearly 18% of our projected margins. Between foreign transaction fees, currency conversion spreads, and the nightmare of EU VAT compliance, our margin was quietly leaking away.\n\n## Why Engineering as Marketing Beats Cold Outreach\n\nRather than whining on social media or paying $500 for sponsored newsletter ads, we dogfooded our own philosophy at LaunchXact: Engineering-as-Marketing.\n\nWe spent 48 hours building the **True Cost of Payments Simulator**.\n\nIt allows founders to plug in their MRR, percentage of international customers, and current gateway, instantly outputting their real net margin vs. a flat Merchant of Record (MoR).\n\n## Traffic & Distribution Results\n\n- Organic Founder Visits: 1,200+\n- Lead Conversions: 140+ founders saved their audit reports\n- Ad Spend: Exactly $0.00\n\n---\n**Try the free tool here:** [The True Cost of Payments Simulator](https://www.launchxact.com/tools/true-cost-of-payments?utm_source=indiehackers&utm_medium=community&utm_campaign=ai_agent_distrib)\n\n## Question for Indie Hackers\n\nAre you currently handling VAT/sales tax registration manually, or did you switch to a Merchant of Record like Paddle / Lemon Squeezy / Dodo Payments? How has the fee tradeoff worked for you?`
            }
        }
    });

    const handleGenerate = async () => {
        setLoading(true);
        try {
            const query = new URLSearchParams();
            query.set('preview', 'true');
            if (selectedTool !== 'auto') query.set('tool', selectedTool);
            if (selectedAngle !== 'auto') query.set('angle', selectedAngle);
            query.set('mode', xMode);

            const res = await fetch(`/api/agent/distribute?${query.toString()}`);
            const data = await res.json();
            
            if (data && data.platforms) {
                const ihPayload = data.platforms?.indiehackers || {};
                const ihTitle = ihPayload.title ||
                                ihPayload.preview?.title ||
                                ihPayload.headline ||
                                data.hook ||
                                'How we built a free utility to drive SaaS distribution';

                let ihContent = ihPayload.content ||
                                ihPayload.preview?.content ||
                                ihPayload.body ||
                                ihPayload.article ||
                                '';

                setPostData({
                    hook: data.hook,
                    tool: data.tool,
                    angle: data.angle,
                    platforms: {
                        x: {
                            single: data.platforms.x?.preview && typeof data.platforms.x.preview === 'string' 
                                ? data.platforms.x.preview 
                                : (data.platforms.x?.text || ''),
                            thread: Array.isArray(data.platforms.x?.preview) 
                                ? data.platforms.x.preview 
                                : [data.platforms.x?.text || '']
                        },
                        linkedin: {
                            content: data.platforms.linkedin?.preview || data.platforms.linkedin?.content || ''
                        },
                        indiehackers: {
                            title: ihTitle,
                            content: ihContent
                        }
                    }
                });
            }
        } catch (err) {
            console.error('Failed to generate preview:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className={styles.container}>
            <Breadcrumb
                items={[
                    { label: 'Founder Tools', href: '/tools' },
                    { label: 'AI Distribution Agent', href: '/tools/distribution-agent' },
                ]}
            />

            <header className={styles.header}>
                <div className={styles.badge}>⚡ Autonomous Growth Engine</div>
                <h1 className={styles.title}>Autonomous AI Distribution Agent</h1>
                <p className={styles.subtitle}>
                    Automatically generates viral, problem-to-solution posts across X, LinkedIn, and Indie Hackers. Engineered to drive compounding founder traffic through LaunchXact&apos;s free tools with zero repetition.
                </p>
            </header>

            {/* Controls Panel */}
            <div className={styles.controlPanel}>
                <div className={styles.controlsGrid}>
                    <div className={styles.fieldGroup}>
                        <label>Featured Tool</label>
                        <select
                            value={selectedTool}
                            onChange={(e) => setSelectedTool(e.target.value)}
                            className={styles.selectInput}
                        >
                            {TOOLS_LIST.map((t) => (
                                <option key={t.id} value={t.id}>{t.title}</option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.fieldGroup}>
                        <label>Narrative Angle</label>
                        <select
                            value={selectedAngle}
                            onChange={(e) => setSelectedAngle(e.target.value)}
                            className={styles.selectInput}
                        >
                            {ANGLES_LIST.map((a) => (
                                <option key={a.id} value={a.id}>{a.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.fieldGroup}>
                        <label>X (Twitter) Publishing Mode</label>
                        <select
                            value={xMode}
                            onChange={(e) => setXMode(e.target.value)}
                            className={styles.selectInput}
                        >
                            <option value="single">Single Viral Tweet (&lt;280 chars)</option>
                            <option value="thread">5-Tweet Value Breakdown Thread</option>
                        </select>
                    </div>
                </div>

                <div className={styles.actionRow}>
                    <div className={styles.statusIndicator}>
                        <span className={styles.statusDot}></span>
                        <span>Memory Engine: <strong>Zero-Repetition Active</strong></span>
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={loading}
                        className={styles.generateBtn}
                    >
                        {loading ? '🤖 Synthesizing High-Converting Copy...' : '✨ Generate Fresh Distribution Post'}
                    </button>
                </div>
            </div>

            {/* Platform Preview Section */}
            <div className={styles.tabsHeader}>
                <button
                    onClick={() => setActiveTab('x')}
                    className={`${styles.tabBtn} ${activeTab === 'x' ? styles.activeTab : ''}`}
                >
                    🐦 X (Twitter)
                </button>
                <button
                    onClick={() => setActiveTab('linkedin')}
                    className={`${styles.tabBtn} ${activeTab === 'linkedin' ? styles.activeTab : ''}`}
                >
                    💼 LinkedIn
                </button>
                <button
                    onClick={() => setActiveTab('indiehackers')}
                    className={`${styles.tabBtn} ${activeTab === 'indiehackers' ? styles.activeTab : ''}`}
                >
                    🚀 Indie Hackers
                </button>
            </div>

            {/* Active Platform Card */}
            <div className={styles.previewCard}>
                <div className={styles.postHeader}>
                    <div className={styles.authorMeta}>
                        <div className={styles.avatar}>R</div>
                        <div className={styles.authorDetails}>
                            <h4>Ravi | Founder, LaunchXact</h4>
                            <p>
                                {activeTab === 'x' && '@ravi_launchxact · Just now'}
                                {activeTab === 'linkedin' && 'Building LaunchXact · 1st · Just now'}
                                {activeTab === 'indiehackers' && 'Indie Hacker Milestone · Just now'}
                            </p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        {activeTab === 'x' && (
                            <a
                                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(xMode === 'single' ? postData.platforms.x.single : postData.platforms.x.thread[0])}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.copyBtn}
                                style={{ textDecoration: 'none' }}
                            >
                                🐦 Open in X Composer ↗
                            </a>
                        )}
                        {activeTab === 'linkedin' && (
                            <a
                                href="https://www.linkedin.com/feed/?shareActive=true"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.copyBtn}
                                style={{ textDecoration: 'none' }}
                            >
                                💼 Open LinkedIn Feed ↗
                            </a>
                        )}
                        {activeTab === 'indiehackers' && (
                            <a
                                href="https://www.indiehackers.com/new-post"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.copyBtn}
                                style={{ textDecoration: 'none' }}
                            >
                                🚀 Open Indie Hackers Composer ↗
                            </a>
                        )}

                        <button
                            onClick={() => {
                                if (activeTab === 'x') {
                                    const text = xMode === 'single'
                                        ? postData.platforms.x.single
                                        : postData.platforms.x.thread.join('\n\n---\n\n');
                                    handleCopy(text);
                                } else if (activeTab === 'linkedin') {
                                    handleCopy(postData.platforms.linkedin.content);
                                } else {
                                    handleCopy(`# ${postData.platforms.indiehackers.title}\n\n${postData.platforms.indiehackers.content}`);
                                }
                            }}
                            className={styles.copyBtn}
                        >
                            {copied ? '✅ Copied to Clipboard!' : '📋 Copy Formatted Text'}
                        </button>
                    </div>
                </div>

                {/* X Platform View */}
                {activeTab === 'x' && (
                    <div>
                        {xMode === 'single' ? (
                            <div>
                                <div className={styles.postContent}>{postData.platforms.x.single}</div>
                                <div className={styles.charCounter}>
                                    Length: {postData.platforms.x.single.length} / 280 characters
                                </div>
                            </div>
                        ) : (
                            <div className={styles.threadContainer}>
                                {postData.platforms.x.thread.map((tweet, index) => (
                                    <div key={index} className={styles.threadTweet}>
                                        <div className={styles.tweetBadge}>{index + 1}</div>
                                        <div>{tweet}</div>
                                        <div className={styles.charCounter}>
                                            {tweet.length} / 280 characters
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* LinkedIn Platform View */}
                {activeTab === 'linkedin' && (
                    <div>
                        <div className={styles.postContent}>{postData.platforms.linkedin.content}</div>
                        <div className={styles.charCounter}>
                            Length: {postData.platforms.linkedin.content.length} characters (Optimized for LinkedIn algorithm)
                        </div>
                    </div>
                )}

                {/* Indie Hackers Platform View */}
                {activeTab === 'indiehackers' && (
                    <div>
                        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc', marginBottom: '1rem', lineHeight: 1.3 }}>
                            {postData.platforms.indiehackers.title}
                        </h2>
                        <div className={styles.postContent}>{postData.platforms.indiehackers.content}</div>
                        <div className={styles.charCounter}>
                            Article Length: {postData.platforms.indiehackers.content ? postData.platforms.indiehackers.content.length : 0} characters (~{postData.platforms.indiehackers.content ? postData.platforms.indiehackers.content.split(/\s+/).filter(Boolean).length : 0} words) · Ready for Indie Hackers Community
                        </div>
                    </div>
                )}

                {/* Dynamic Attribution Card */}
                <div className={styles.utmCard}>
                    <h4>🔗 Real-Time Telemetry & Attribution Tags</h4>
                    <code>
                        https://www.launchxact.com{postData.tool.path}?utm_source={activeTab === 'x' ? 'twitter' : activeTab}&utm_medium={activeTab === 'indiehackers' ? 'community' : 'social'}&utm_campaign=ai_agent_distrib&utm_content={postData.tool.id}_{postData.angle.id}
                    </code>
                </div>
            </div>
        </div>
    );
}
