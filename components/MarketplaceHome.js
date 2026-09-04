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
        category: '',
        social: '',
        description: ''
    });

    const [buyerForm, setBuyerForm] = useState({
        email: '',
        interests: ''
    });

    const [founderStatus, setFounderStatus] = useState('idle'); // 'idle' | 'submitting' | 'success'
    const [buyerStatus, setBuyerStatus] = useState('idle');

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

            {/* ===== 5. FOUNDER FORM ===== */}
            <section id="founder-form" className={`${styles.section} ${styles.reveal}`}>
                <div className={styles.formCard}>
                    <h2>Join the LaunchXact founder waitlist</h2>
                    <p className={styles.formSub}>Be part of the first curated launch collection.</p>

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
                            <h3>Application Received!</h3>
                            <p>Check your email for confirmation. Good luck!</p>
                        </div>
                    ) : (
                        <form onSubmit={handleFounderSubmit}>
                            <div className={styles.formGrid}>
                                <input 
                                    className={styles.input} 
                                    placeholder="Founder Name" 
                                    required
                                    value={founderForm.founderName} 
                                    onChange={e => setFounderForm({ ...founderForm, founderName: e.target.value })} 
                                />
                                <input 
                                    className={styles.input} 
                                    placeholder="Founder Email" 
                                    type="email" 
                                    required
                                    value={founderForm.email} 
                                    onChange={e => setFounderForm({ ...founderForm, email: e.target.value })} 
                                />
                                <input 
                                    className={styles.input} 
                                    placeholder="Product Name" 
                                    required
                                    value={founderForm.productName} 
                                    onChange={e => setFounderForm({ ...founderForm, productName: e.target.value })} 
                                />
                                <input 
                                    className={styles.input} 
                                    placeholder="Website URL" 
                                    type="url" 
                                    required
                                    value={founderForm.website} 
                                    onChange={e => setFounderForm({ ...founderForm, website: e.target.value })} 
                                />
                                <select 
                                    className={styles.input} 
                                    required 
                                    value={founderForm.category} 
                                    onChange={e => setFounderForm({ ...founderForm, category: e.target.value })}
                                >
                                    <option value="">Category</option>
                                    <option value="DevTools">DevTools</option>
                                    <option value="Marketing">Marketing</option>
                                    <option value="Productivity">Productivity</option>
                                    <option value="Design">Design</option>
                                    <option value="Other">Other</option>
                                </select>
                                <input 
                                    className={styles.input} 
                                    placeholder="Social Profile (Optional)"
                                    value={founderForm.social} 
                                    onChange={e => setFounderForm({ ...founderForm, social: e.target.value })} 
                                />
                            </div>

                            <textarea 
                                className={styles.textarea} 
                                placeholder="Short Description of your product" 
                                required 
                                rows={3}
                                value={founderForm.description} 
                                onChange={e => setFounderForm({ ...founderForm, description: e.target.value })} 
                            />

                            <button 
                                type="submit" 
                                disabled={founderStatus === 'submitting'} 
                                className={`${styles.btn} ${styles.btnPrimary}`}
                            >
                                {founderStatus === 'submitting' ? 'Submitting Application...' : 'Join Founder Waitlist'}
                            </button>
                            <p className={styles.smallText}>Selected products will be featured on launch day.</p>
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

            {/* ===== 9. DEDICATED STARTUP VISIBILITY ENGINE SPOTLIGHT ===== */}
            <section className={`${styles.engineSpotlight} ${styles.reveal}`}>
                <div className={styles.engineCard}>
                    <div>
                        <span className={styles.engineBadge}>✦ THE DISTRIBUTION ENGINE</span>
                        <h2 className={styles.engineTitle}>Startup Visibility Engine</h2>
                        <p className={styles.engineSub}>
                            Learn how founders build discoverability, authority, and compounding distribution systems using modern SEO, AI search optimization, Reddit, and founder-led content. <strong>No paid ads required.</strong>
                        </p>
                    </div>
                    <Link href="/startup-visibility-engine" className={`${styles.btn} ${styles.engineBtn}`}>
                        Explore the Engine →
                    </Link>
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
                        <Link href="/startup-visibility-engine">Visibility Engine</Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
