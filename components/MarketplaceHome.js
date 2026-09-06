'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faRocket, 
    faCircleCheck, 
    faCode, 
    faGlobe, 
    faTag, 
    faUser, 
    faCompass, 
    faShieldHalved,
    faArrowRight,
    faCheck
} from '@fortawesome/free-solid-svg-icons';
import { faXTwitter, faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import FloatingRocket from '@/components/FloatingRocket';
import FloatingTelescope from '@/components/FloatingTelescope';
import styles from './MarketplaceHome.module.css';

const BUYER_TAGLINES = [
    "Find the next tools before they go mainstream.",
    "Explore new software built by real founders.",
    "Discover powerful tools without the noise.",
    "Discover useful tools before everyone else does."
];

const FOUNDER_TAGLINES = [
    "You build the product. We handle the visibility.",
    "Build your tool. We’ll help it get discovered.",
    "Focus on building. We’ll take care of the launch.",
    "Ship the product. We’ll bring the early users."
];

export default function MarketplaceHome({ latestArticles }) {
    const [buyerTaglineIndex, setBuyerTaglineIndex] = useState(0);
    const [founderTaglineIndex, setFounderTaglineIndex] = useState(0);

    // Rotating taglines
    useEffect(() => {
        const interval = setInterval(() => {
            setBuyerTaglineIndex(prev => (prev + 1) % BUYER_TAGLINES.length);
            setFounderTaglineIndex(prev => (prev + 1) % FOUNDER_TAGLINES.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    // Scroll reveal observer
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add(styles.visible);
                }
            });
        }, { threshold: 0.08 });

        const reveals = document.querySelectorAll(`.${styles.reveal}`);
        reveals.forEach(el => observer.observe(el));
        return () => reveals.forEach(el => observer.unobserve(el));
    }, []);

    // Form States
    const [founderForm, setFounderForm] = useState({
        founderName: '',
        email: '',
        productName: '',
        website: '',
        category: 'AI & DevTools',
        social: '',
        description: '',
        stage: 'MVP',
        monthlyRevenue: 'Pre-revenue ($0)',
        biggestProblem: 'Distribution'
    });


    const [buyerForm, setBuyerForm] = useState({
        email: '',
        interests: ''
    });

    const [founderStatus, setFounderStatus] = useState('idle'); // 'idle' | 'submitting' | 'success'
    const [buyerStatus, setBuyerStatus] = useState('idle');

    // Handle query params pre-filling from Grader
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const idea = params.get('idea') || params.get('website');
            const weakness = params.get('weakness');
            const desc = params.get('description');

            if (idea || weakness || desc) {
                setFounderForm(prev => ({
                    ...prev,
                    productName: idea || prev.productName,
                    biggestProblem: weakness?.includes('Distribution') ? 'Distribution' : (weakness?.includes('Moat') ? 'Infrastructure' : (weakness || prev.biggestProblem)),
                    description: desc || prev.description
                }));
            }
        }
    }, []);

    const handleFounderSubmit = async (e) => {
        e.preventDefault();
        setFounderStatus('submitting');
        try {
            const res = await fetch('/api/waitlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'founder', data: founderForm })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Submission failed');
            setFounderStatus('success');
        } catch (err) {
            console.error(err);
            alert(err.message);
            setFounderStatus('idle');
        }
    };

    const handleBuyerSubmit = async (e) => {
        e.preventDefault();
        setBuyerStatus('submitting');
        try {
            const res = await fetch('/api/waitlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'buyer', data: buyerForm })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Submission failed');
            setBuyerStatus('success');
        } catch (err) {
            console.error(err);
            alert(err.message);
            setBuyerStatus('idle');
        }
    };

    const scrollToSection = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className={styles.page}>
            {/* Ambient Background Tech Icons */}
            <div className={styles.bgIcons}>
                <FontAwesomeIcon icon={faCode} className={styles.floatingIcon} style={{ top: '12%', left: '6%', animationDelay: '0s' }} />
                <FontAwesomeIcon icon={faRocket} className={styles.floatingIcon} style={{ top: '22%', right: '8%', animationDelay: '3s' }} />
                <FontAwesomeIcon icon={faGlobe} className={styles.floatingIcon} style={{ top: '48%', left: '4%', animationDelay: '6s' }} />
                <FontAwesomeIcon icon={faTag} className={styles.floatingIcon} style={{ top: '65%', right: '6%', animationDelay: '4s' }} />
                <FontAwesomeIcon icon={faUser} className={styles.floatingIcon} style={{ top: '82%', left: '10%', animationDelay: '2s' }} />
            </div>

            {/* ===== 1. HERO SECTION ===== */}
            <section className={`${styles.hero} ${styles.reveal}`}>
                <div className={styles.heroContent}>
                    <div className={styles.heroBadge}>
                        🚀 Genesis Launch Batch 2026 • Only 40 Hand-Curated SaaS Slots
                    </div>

                    <h1 className={styles.heroTitle}>
                        Launch Your SaaS to 350k+ Real Users in Days.<br />
                        <span className={styles.gradientText}>Zero Ad Spend. Zero Commission.</span>
                    </h1>

                    <p className={styles.heroSub}>
                        Stop launching into the void. LaunchXact puts your software directly in front of active tech buyers, indie founders, and a 350k+ multi-channel distribution network. <strong>Only 40 hand-curated Genesis Batch slots available for Q1 2026.</strong>
                    </p>

                    <div className={styles.heroActions}>
                        <button onClick={() => scrollToSection('founder-form')} className={`${styles.btn} ${styles.btnPrimary} ${styles.heroPrimaryBtn}`}>
                            🚀 Apply to Genesis Batch — 100% Free
                        </button>
                    </div>

                    <p className={styles.graderNudgeLine}>
                        Need to test conversion first? <Link href="/grade" className={styles.graderInlineLink}>⚡ Run Free AI Grader (Score 80+ to fast-track approval) →</Link>
                    </p>

                    <div className={styles.heroTrustPill}>
                        <span>✓ 100% Free Forever for Builders</span>
                        <span>•</span>
                        <span>✓ Zero Revenue Cut</span>
                        <span>•</span>
                        <span>✓ Hand-Curated by Founders</span>
                        <span>•</span>
                        <span>✓ 350k+ Community Reach</span>
                    </div>

                    {/* Ecosystem & Partner Badges */}
                    <div className={styles.ecosystemStrip}>
                        <span className={styles.stripLabel}>Verified Tech Stack & Distribution Partners:</span>
                        <div className={styles.stripBadges}>
                            <span className={styles.trustBadge}>⚡ Next.js & Turbopack</span>
                            <span className={styles.trustBadge}>🛡️ Supabase Encrypted Storage</span>
                            <span className={styles.trustBadge}>📬 Resend Certified Delivery</span>
                            <span className={styles.trustBadge}>🌐 Reddit & IndieHackers Syndicated</span>
                        </div>
                    </div>

                    <p className={styles.userAltPrompt}>
                        Looking for innovative SaaS tools? <button onClick={() => scrollToSection('buyer-form')} className={styles.textLink}>Join as an Early Explorer →</button>
                    </p>
                </div>
            </section>

            {/* ===== TRUST & PROOF INFRASTRUCTURE ===== */}
            <section className={`${styles.trustProofSection} ${styles.reveal}`}>
                <div className={styles.founderProofWrapper}>
                    {/* Founder Identity Card */}
                    <div className={styles.founderCard}>
                        <div className={styles.founderIdentity}>
                            <div className={styles.founderAvatar}>RJ</div>
                            <div className={styles.founderInfo}>
                                <h4>Ravi Joshi</h4>
                                <p>Founder, LaunchXact & Context Forge Labs</p>
                                <div className={styles.founderSocials}>
                                    <a href="https://x.com/Ravi_Nileshbhai" target="_blank" rel="noopener noreferrer" className={styles.founderSocialLink}>
                                        <FontAwesomeIcon icon={faXTwitter} /> @Ravi_Nileshbhai
                                    </a>
                                    <a href="https://github.com/ravi-nileshbhai-joshi/LaunchXact" target="_blank" rel="noopener noreferrer" className={styles.founderSocialLink}>
                                        <FontAwesomeIcon icon={faGithub} /> GitHub
                                    </a>
                                    <Link href="/about" className={styles.founderSocialLink}>
                                        Our Story →
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <p className={styles.founderQuote}>
                            "We built LaunchXact because 24-hour launch days on Product Hunt burn founders out with bot upvotes and zero lasting users. We believe great software deserves permanent, indexed discoverability."
                        </p>
                    </div>

                    {/* Open Metrics Strip */}
                    <div className={styles.proofStatsGrid}>
                        <div className={styles.proofStat}>
                            <div className={styles.statNum}>350k+</div>
                            <p className={styles.statLabel}>Founder network reach across X, LinkedIn & Reddit</p>
                        </div>
                        <div className={styles.proofStat}>
                            <div className={styles.statNum}>40</div>
                            <p className={styles.statLabel}>Genesis Batch curated slots (Quality-filtered)</p>
                        </div>
                        <div className={styles.proofStat}>
                            <div className={styles.statNum}>100%</div>
                            <p className={styles.statLabel}>Free for builders (Keep 100% of your MRR)</p>
                        </div>
                        <div className={styles.proofStat}>
                            <div className={styles.statNum}>&lt; 48h</div>
                            <p className={styles.statLabel}>Application review & AI Grader fast-track</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== 2. FOUNDER VALUE PROP ===== */}
            <section className={`${styles.section} ${styles.reveal}`}>
                <div className={styles.container}>
                    <h2 className={styles.sectionHeading}>You build the product. We handle the visibility.</h2>
                    <p className={styles.sectionDesc}>
                        LaunchXact helps indie founders get early visibility, real users, and meaningful traction—without complicated launches or marketing strategies.
                        <br />
                        <Link href="/about" className={styles.missionLink}>
                            Learn more about our mission →
                        </Link>
                    </p>
                </div>
            </section>

            {/* ===== 3. FOUNDER ADVANTAGES (7 CARDS + FLOATING ROCKET) ===== */}
            <section className={`${styles.featuresWrapper} ${styles.reveal}`}>
                <div className={styles.container}>
                    <h3 className={styles.subHeading}>Why launch your product on LaunchXact</h3>
                    
                    <div className={styles.featuresLayout}>
                        <div className={styles.featuresGrid}>
                            {[
                                { title: "Continuous visibility", desc: "Your product stays discoverable instead of disappearing after a single launch day." },
                                { title: "Built for early-stage founders", desc: "Designed for solo builders and small teams—not just big, funded startups." },
                                { title: "Curated environment", desc: "A focused directory where users come specifically to discover tools." },
                                { title: "Simple listing process", desc: "No complex approval cycles. Submit and get listed quickly." },
                                { title: "Reach real early adopters", desc: "Founders, builders, and tech users actively exploring new tools." },
                                { title: "No forced discounts", desc: "You control your pricing. No lifetime-deal pressure." },
                                { title: "Founder-driven platform", desc: "Built by founders, for founders—focused on real products." }
                            ].map((item, i) => (
                                <div key={i} className={styles.featureCard}>
                                    <FontAwesomeIcon icon={faCircleCheck} className={styles.cardIcon} />
                                    <div>
                                        <h4>{item.title}</h4>
                                        <p>{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className={styles.sideVisualContainer}>
                            <FloatingRocket />
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== 4. FREE AI GRADER CTA BANNER ===== */}
            <section className={`${styles.graderCta} ${styles.reveal}`}>
                <div className={styles.graderCtaInner}>
                    <span className={styles.graderBadge}>🔥 FREE AI-POWERED TOOL</span>
                    <h2 className={styles.graderCtaTitle}>
                        Grade Your SaaS <span className={styles.gradientText}>for Free</span>
                    </h2>
                    <p className={styles.graderCtaDesc}>
                        Get an instant AI audit of your landing page. We'll score your conversion, trust signals, and distribution readiness — then tell you exactly what to fix.
                    </p>
                    <Link href="/grade" className={`${styles.btn} ${styles.btnPrimary} ${styles.graderCtaBtn}`}>
                        ⚡ Grade My Landing Page
                    </Link>
                    <p className={styles.graderCtaNote}>
                        Score 80+ to fast-track your Genesis Batch application
                    </p>
                </div>
            </section>

            {/* ===== 5. UPGRADED FOUNDER WAITLIST FORM ===== */}
            <section id="founder-form" className={`${styles.section} ${styles.reveal}`}>
                <div className={styles.formCard}>
                    <h2>Apply for the Genesis Launch Batch</h2>
                    <p className={styles.formSub}>
                        Be part of our curated Q1 2026 debut. We hand-select 40 breakout SaaS products for zero-fee launch day distribution.
                    </p>

                    <Link href="/grade" className={styles.gradeNudge}>
                        ⚡ Grade your SaaS first — score 80+ and your submission gets fast-tracked. <span>Get your free score →</span>
                    </Link>

                    {/* Transparent Pricing Guarantee */}
                    <div className={styles.pricingBanner}>
                        <span className={styles.pricingTag}>Transparent Pricing Guarantee</span>
                        <div className={styles.pricingDetails}>
                            <div className={styles.pricePoint}>
                                <strong>$0 Free</strong>
                                <span>Genesis Batch Listing</span>
                            </div>
                            <div className={styles.pricePerk}>
                                <FontAwesomeIcon icon={faCheck} style={{ color: '#16a34a', marginRight: '6px' }} />
                                0% Commission • Keep 100% MRR
                            </div>
                            <div className={styles.pricePerk}>
                                <FontAwesomeIcon icon={faCheck} style={{ color: '#16a34a', marginRight: '6px' }} />
                                No forced lifetime discounts
                            </div>
                            <div className={styles.pricePerk}>
                                <FontAwesomeIcon icon={faCheck} style={{ color: '#16a34a', marginRight: '6px' }} />
                                Permanent canonical DoFollow backlink
                            </div>
                        </div>
                    </div>

                    {founderStatus === 'success' ? (
                        <div className={styles.successBox}>
                            <span className={styles.successBadgePill}>🎉 Application Received</span>
                            <h3>Application Received, {founderForm.founderName}!</h3>
                            <p>
                                <strong>{founderForm.productName}</strong> has been logged into the <strong>Genesis Batch review queue</strong>.
                            </p>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: '0 0 1.5rem', lineHeight: '1.6' }}>
                                We manually audit every product for real utility, technical stability, and founder authenticity. Only 40 tools are accepted into the Genesis cohort.
                            </p>

                            <div className={styles.successActions}>
                                <a
                                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Just applied to the @LaunchXact Genesis Batch with ${founderForm.productName}! Excited to launch in a curated SaaS marketplace. 🚀`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.shareXBtn}
                                >
                                    <FontAwesomeIcon icon={faXTwitter} style={{ marginRight: '6px' }} /> Share on 𝕏 (+2x Priority Review)
                                </a>
                            </div>

                            <p className={styles.successNote}>Check your inbox ({founderForm.email}) for your application confirmation & review next steps.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleFounderSubmit}>
                            <div className={styles.formGrid}>
                                <div className={styles.fieldGroup}>
                                    <label className={styles.fieldLabel}>Founder Name *</label>
                                    <input 
                                        className={styles.input} 
                                        placeholder="e.g. Gabriel Lawson" 
                                        required
                                        value={founderForm.founderName} 
                                        onChange={e => setFounderForm({ ...founderForm, founderName: e.target.value })} 
                                    />
                                </div>
                                <div className={styles.fieldGroup}>
                                    <label className={styles.fieldLabel}>Work Email *</label>
                                    <input 
                                        className={styles.input} 
                                        placeholder="founder@company.com" 
                                        type="email" 
                                        required
                                        value={founderForm.email} 
                                        onChange={e => setFounderForm({ ...founderForm, email: e.target.value })} 
                                    />
                                </div>
                                <div className={styles.fieldGroup}>
                                    <label className={styles.fieldLabel}>Product Name *</label>
                                    <input 
                                        className={styles.input} 
                                        placeholder="e.g. SQLNinja AI" 
                                        required
                                        value={founderForm.productName} 
                                        onChange={e => setFounderForm({ ...founderForm, productName: e.target.value })} 
                                    />
                                </div>
                                <div className={styles.fieldGroup}>
                                    <label className={styles.fieldLabel}>
                                        Website / Prototype URL
                                        <span className={styles.fieldLabelHint}>Optional</span>
                                    </label>
                                    <input 
                                        className={styles.input} 
                                        placeholder="https://yoursaas.com or pre-launch" 
                                        value={founderForm.website} 
                                        onChange={e => setFounderForm({ ...founderForm, website: e.target.value })} 
                                    />
                                </div>
                                <div className={styles.fieldGroup}>
                                    <label className={styles.fieldLabel}>Category / Vertical *</label>
                                    <select 
                                        className={styles.input} 
                                        required 
                                        value={founderForm.category} 
                                        onChange={e => setFounderForm({ ...founderForm, category: e.target.value })}
                                    >
                                        <option value="AI & DevTools">AI & DevTools</option>
                                        <option value="B2B SaaS">B2B SaaS</option>
                                        <option value="Marketing & Sales">Marketing & Sales</option>
                                        <option value="Fintech & Payments">Fintech & Payments</option>
                                        <option value="Productivity & Ops">Productivity & Ops</option>
                                        <option value="Creator Economy">Creator Economy</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className={styles.fieldGroup}>
                                    <label className={styles.fieldLabel}>
                                        Founder Social / 𝕏 Handle
                                        <span className={styles.fieldLabelHint}>Optional</span>
                                    </label>
                                    <input 
                                        className={styles.input} 
                                        placeholder="@handle or LinkedIn URL"
                                        value={founderForm.social} 
                                        onChange={e => setFounderForm({ ...founderForm, social: e.target.value })} 
                                    />
                                </div>
                            </div>

                            {/* What are you building? */}
                            <div className={styles.fieldGroup}>
                                <label className={styles.fieldLabel}>
                                    What are you building? *
                                    <span className={styles.fieldLabelHint}>1-2 sentences</span>
                                </label>
                                <textarea 
                                    className={styles.textarea} 
                                    placeholder="What core problem does your SaaS solve and for whom?" 
                                    required 
                                    rows={2}
                                    value={founderForm.description} 
                                    onChange={e => setFounderForm({ ...founderForm, description: e.target.value })} 
                                />
                            </div>

                            {/* Current Stage Pills */}
                            <div className={styles.fieldGroup}>
                                <label className={styles.fieldLabel}>Current Product Stage *</label>
                                <div className={styles.pillGroup}>
                                    {[
                                        { id: 'Idea', label: '💡 Idea' },
                                        { id: 'MVP', label: '🔨 MVP' },
                                        { id: 'Live', label: '🚀 Live' },
                                        { id: 'Already generating revenue', label: '💰 Generating Revenue' }
                                    ].map(st => (
                                        <button
                                            key={st.id}
                                            type="button"
                                            className={`${styles.pillBtn} ${founderForm.stage === st.id ? styles.pillBtnActive : ''}`}
                                            onClick={() => setFounderForm({ ...founderForm, stage: st.id })}
                                        >
                                            {st.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Monthly Revenue Pills */}
                            <div className={styles.fieldGroup}>
                                <label className={styles.fieldLabel}>Monthly Revenue (MRR) *</label>
                                <div className={styles.pillGroup}>
                                    {[
                                        'Pre-revenue ($0)',
                                        '< $1,000 / mo',
                                        '$1,000 – $5,000 / mo',
                                        '$5,000 – $20,000 / mo',
                                        '$20,000+ / mo'
                                    ].map(rev => (
                                        <button
                                            key={rev}
                                            type="button"
                                            className={`${styles.pillBtn} ${founderForm.monthlyRevenue === rev ? styles.pillBtnActive : ''}`}
                                            onClick={() => setFounderForm({ ...founderForm, monthlyRevenue: rev })}
                                        >
                                            {rev}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Biggest Problem Pills */}
                            <div className={styles.fieldGroup}>
                                <label className={styles.fieldLabel}>What is your biggest problem right now? *</label>
                                <div className={styles.pillGroup}>
                                    {[
                                        { id: 'Building', label: '🔨 Building' },
                                        { id: 'Infrastructure', label: '⚙️ Infrastructure' },
                                        { id: 'Payments', label: '💳 Payments & Tax' },
                                        { id: 'Distribution', label: '📢 Distribution' },
                                        { id: 'Discovery', label: '🔍 Discovery & SEO' },
                                        { id: 'Other', label: '⚡ Other' }
                                    ].map(prob => (
                                        <button
                                            key={prob.id}
                                            type="button"
                                            className={`${styles.pillBtn} ${founderForm.biggestProblem === prob.id ? styles.pillBtnActive : ''}`}
                                            onClick={() => setFounderForm({ ...founderForm, biggestProblem: prob.id })}
                                        >
                                            {prob.label}
                                        </button>
                                    ))}
                                </div>
                            </div>


                            <button 
                                type="submit" 
                                disabled={founderStatus === 'submitting'} 
                                className={`${styles.btn} ${styles.btnPrimary}`}
                            >
                                {founderStatus === 'submitting' ? 'Submitting Application...' : '🚀 Apply to Genesis Batch →'}
                            </button>
                            <p className={styles.smallText}>Zero commission • Keep 100% of your revenue • Strict quality curation</p>
                        </form>
                    )}
                </div>
            </section>

            {/* ===== 6. BUYER VALUE PROP ===== */}
            <section className={`${styles.section} ${styles.reveal}`}>
                <div className={styles.container}>
                    <h2 className={styles.sectionHeading}>Discover useful tools before everyone else does.</h2>
                    <p className={styles.sectionDesc}>
                        LaunchXact is a curated space where early adopters explore new SaaS tools built by real founders.
                    </p>
                </div>
            </section>

            {/* ===== 7. BUYER ADVANTAGES (6 CARDS + FLOATING TELESCOPE) ===== */}
            <section className={`${styles.featuresWrapper} ${styles.reveal}`}>
                <div className={styles.container}>
                    <h3 className={styles.subHeading}>Why explore tools on LaunchXact</h3>
                    
                    <div className={styles.featuresLayout}>
                        <div className={styles.sideVisualContainer}>
                            <FloatingTelescope />
                        </div>

                        <div className={styles.featuresGrid}>
                            {[
                                { title: "Curated, high-quality tools", desc: "No spam, no low-effort listings—only real products." },
                                { title: "Early access to new software", desc: "Discover tools before they go mainstream." },
                                { title: "Clean discovery experience", desc: "No noisy feeds or distractions." },
                                { title: "Direct access to founder-built tools", desc: "Products created by real builders solving real problems." },
                                { title: "Transparent product pages", desc: "Clear descriptions and direct links to official sites." },
                                { title: "Constantly updated directory", desc: "New tools added regularly." }
                            ].map((item, i) => (
                                <div key={i} className={styles.featureCard}>
                                    <FontAwesomeIcon icon={faRocket} className={styles.cardIconAmber} />
                                    <div>
                                        <h4>{item.title}</h4>
                                        <p>{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== 8. BUYER FORM ===== */}
            <section id="buyer-form" className={`${styles.section} ${styles.reveal}`}>
                <div className={styles.formCard}>
                    <h2>Join the early adopter waitlist</h2>
                    <p className={styles.formSub}>Get notified when LaunchXact goes live.</p>

                    {buyerStatus === 'success' ? (
                        <div className={styles.successBox}>
                            <h3>You're on the list!</h3>
                            <p>We'll notify you as soon as the launch collection is live.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleBuyerSubmit}>
                            <input 
                                className={styles.input} 
                                style={{ marginBottom: '1rem' }}
                                placeholder="Email Address" 
                                type="email" 
                                required
                                value={buyerForm.email} 
                                onChange={e => setBuyerForm({ ...buyerForm, email: e.target.value })} 
                            />
                            <input 
                                className={styles.input} 
                                style={{ marginBottom: '1.25rem' }}
                                placeholder="(Optional) What kind of tools do you like?" 
                                value={buyerForm.interests} 
                                onChange={e => setBuyerForm({ ...buyerForm, interests: e.target.value })} 
                            />
                            <button 
                                type="submit" 
                                disabled={buyerStatus === 'submitting'} 
                                className={`${styles.btn} ${styles.btnSecondary}`}
                            >
                                {buyerStatus === 'submitting' ? 'Joining...' : 'Join Early User Waitlist'}
                            </button>
                        </form>
                    )}
                </div>
            </section>

            {/* ===== 10. ARTICLES & RESOURCES ===== */}
            {latestArticles && latestArticles.length > 0 && (
                <section className={`${styles.articlesSection} ${styles.reveal}`}>
                    <div className={styles.container}>
                        <div className={styles.articlesHeader}>
                            <h2 className={styles.sectionHeading}>Founder Insights & Resources</h2>
                            <p className={styles.sectionDesc}>
                                Tactical advice on launching, scaling, and succeeding in the SaaS ecosystem.
                            </p>
                        </div>
                        <div className={styles.articlesGrid}>
                            {latestArticles.map((article) => (
                                <Link 
                                    href={`/articles/${article.id}`} 
                                    key={article.id} 
                                    className={styles.articleCard}
                                >
                                    <div>
                                        <h4>{article.title}</h4>
                                        <p>{article.description}</p>
                                    </div>
                                    <span className={styles.readMore}>
                                        Read Post →
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ===== 11. FINAL CTA ===== */}
            <section className={`${styles.finalCta} ${styles.reveal}`}>
                <div className={styles.container}>
                    <h2>Be part of the first LaunchXact collection.</h2>
                    <p>
                        Whether you’re building a tool or looking for one,<br />
                        LaunchXact is where founders and early adopters meet.
                    </p>
                    <div className={styles.heroActions}>
                        <button onClick={() => scrollToSection('founder-form')} className={`${styles.btn} ${styles.btnPrimary}`} style={{ width: '220px' }}>
                            Join as Founder
                        </button>
                        <button onClick={() => scrollToSection('buyer-form')} className={`${styles.btn} ${styles.btnSecondary}`} style={{ width: '220px' }}>
                            Join as Early User
                        </button>
                    </div>
                    <div className={styles.finalLinks}>
                        <Link href="/where-to-launch-saas">Launch Comparison</Link>
                        <Link href="/about">Our Story</Link>
                        <Link href="/contact">Contact Us</Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
