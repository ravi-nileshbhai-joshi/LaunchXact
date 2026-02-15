'use client';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRocket, faCheckCircle, faEnvelope, faGlobe, faUser, faCode, faTag } from '@fortawesome/free-solid-svg-icons';
import styles from './waiting-list-full.module.css';
import Link from 'next/link';
import ConstellationCanvas from '@/components/ConstellationCanvas';
import FloatingRocket from '@/components/FloatingRocket';
import FloatingTelescope from '@/components/FloatingTelescope';

// Buyer Taglines rotator
const BUYER_TAGLINES = [
    "Find the next tools before they go mainstream.",
    "Explore new software built by real founders.",
    "Discover powerful tools without the noise.",
    "Discover useful tools before everyone else does."
];

// Founder Taglines rotator
const FOUNDER_TAGLINES = [
    "You build the product. We handle the visibility.",
    "Build your tool. We’ll help it get discovered.",
    "Focus on building. We’ll take care of the launch.",
    "Ship the product. We’ll bring the early users."
]

export default function WaitingListFull() {
    const [buyerTaglineIndex, setBuyerTaglineIndex] = useState(0);
    const [founderTaglineIndex, setFounderTaglineIndex] = useState(0);

    // Rotating taglines effect
    useEffect(() => {
        const interval = setInterval(() => {
            setBuyerTaglineIndex(prev => (prev + 1) % BUYER_TAGLINES.length);
            setFounderTaglineIndex(prev => (prev + 1) % FOUNDER_TAGLINES.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    // Form State
    const [founderForm, setFounderForm] = useState({
        productName: '',
        website: '',
        description: '',
        category: '',
        email: '',
        social: '',
        founderName: '' // Added explicitly
    });
    const [buyerForm, setBuyerForm] = useState({
        email: '',
        interests: ''
    });

    const [founderStatus, setFounderStatus] = useState('idle');
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

    // Scroll Animation Observer
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Start animation when 10% visible
                    entry.target.classList.add(styles.revealActive);
                }
            });
        }, { threshold: 0.1 });

        const reveals = document.querySelectorAll(`.${styles.reveal}`);
        reveals.forEach(el => observer.observe(el));

        return () => reveals.forEach(el => observer.unobserve(el));
    }, []);

    return (
        <div className={styles.page}>
            {/* Background Tech Icons */}
            <div className={styles.bgIcons}>
                <FontAwesomeIcon icon={faCode} className={`${styles.floatingIcon} ${styles.iconCode}`} style={{ top: '15%', left: '8%', animationDelay: '0s' }} />
                <FontAwesomeIcon icon={faRocket} className={`${styles.floatingIcon} ${styles.iconRocket}`} style={{ top: '25%', right: '12%', animationDelay: '5s' }} />
                <FontAwesomeIcon icon={faGlobe} className={`${styles.floatingIcon} ${styles.iconGlobe}`} style={{ top: '55%', left: '4%', animationDelay: '12s' }} />
                <FontAwesomeIcon icon={faTag} className={`${styles.floatingIcon} ${styles.iconTag}`} style={{ top: '65%', right: '8%', animationDelay: '8s' }} />
                <FontAwesomeIcon icon={faUser} className={`${styles.floatingIcon} ${styles.iconUser}`} style={{ top: '80%', left: '15%', animationDelay: '15s' }} />
                <FontAwesomeIcon icon={faCheckCircle} className={`${styles.floatingIcon} ${styles.iconCheck}`} style={{ top: '45%', right: '25%', animationDelay: '3s' }} />
                {/* Extra Icons to fill space */}
                <FontAwesomeIcon icon={faCode} className={`${styles.floatingIcon} ${styles.iconCode}`} style={{ top: '85%', right: '20%', animationDelay: '7s', opacity: 0.1 }} />
                <FontAwesomeIcon icon={faRocket} className={`${styles.floatingIcon} ${styles.iconRocket}`} style={{ top: '5%', right: '40%', animationDelay: '10s', opacity: 0.1 }} />
                <FontAwesomeIcon icon={faGlobe} className={`${styles.floatingIcon} ${styles.iconGlobe}`} style={{ top: '35%', left: '35%', animationDelay: '2s', opacity: 0.08 }} />
            </div>

            {/* SECTION 1: HERO */}
            <section className={`${styles.hero} ${styles.reveal}`}>
                <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>
                        Launch your product. Reach real users.<br />
                        <span className={styles.gradientText}>Skip the marketing chaos.</span>
                    </h1>
                    <p className={styles.heroSub}>
                        LaunchXact is a curated platform where indie founders list their products and early adopters discover new tools—without the noise, algorithms, or one-day launches.
                    </p>

                    <div className={styles.heroActions}>
                        <div className={styles.ctaGroup}>
                            <div className={styles.taglineContainer}>
                                <p key={founderTaglineIndex} className={styles.rotatingTagline}>
                                    {FOUNDER_TAGLINES[founderTaglineIndex]}
                                </p>
                            </div>
                            <button onClick={() => scrollToSection('founder-form')} className={`${styles.btn} ${styles.btnPrimary}`}>
                                Join as a Founder
                            </button>
                        </div>

                        <div className={styles.ctaGroup}>
                            <div className={styles.taglineContainer}>
                                <p key={buyerTaglineIndex} className={styles.rotatingTagline}>
                                    {BUYER_TAGLINES[buyerTaglineIndex]}
                                </p>
                            </div>
                            <button onClick={() => scrollToSection('buyer-form')} className={`${styles.btn} ${styles.btnSecondary}`}>
                                Join as an Early User
                            </button>
                        </div>
                    </div>

                    <p className={styles.trustText}>Early access collection opening soon</p>
                </div>
            </section>

            {/* SECTION 2: FOUNDER VALUE PROP */}
            <section className={`${styles.section} ${styles.reveal}`}>
                <div className={styles.container}>
                    <h2 className={styles.sectionHeading}>You build the product. We handle the visibility.</h2>
                    <p className={styles.sectionDesc}>
                        LaunchXact helps indie founders get early visibility, real users, and meaningful traction—without complicated launches or marketing strategies.
                    </p>
                </div>
            </section>

            {/* SECTION 3: FOUNDER ADVANTAGES */}
            <section className={`glass-panel ${styles.featuresSection} ${styles.reveal} ${styles.contentShiftLeft}`} style={{ position: 'relative', overflow: 'hidden' }}>
                <div className={styles.constellationBg}>
                    <ConstellationCanvas />
                </div>
                {/* Side Visual */}
                <div className={`${styles.sideVisual} ${styles.sideRocket}`}>
                    <FloatingRocket />
                </div>
                <div className={styles.container}>
                    <h3 className={styles.subHeading}>Why launch your product on LaunchXact</h3>
                    <div className={styles.grid}>
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
                                <FontAwesomeIcon icon={faCheckCircle} className={styles.checkIcon} />
                                <div>
                                    <h4>{item.title}</h4>
                                    <p>{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECTION 4: FOUNDER FORM */}
            <section id="founder-form" className={`${styles.section} ${styles.reveal}`}>
                <div className={`glass-panel ${styles.formCard}`}>
                    <h2>Join the LaunchXact founder waitlist</h2>
                    <p className={styles.formSub}>Be part of the first curated launch collection.</p>

                    {founderStatus === 'success' ? (
                        <div className={styles.successBox}>
                            <h3>Application Received!</h3>
                            <p>Check your email for confirmation. Good luck!</p>
                        </div>
                    ) : (
                        <form onSubmit={handleFounderSubmit} className={styles.form}>
                            <div className={styles.formGrid}>
                                <input className={styles.input} placeholder="Founder Name" required
                                    value={founderForm.founderName} onChange={e => setFounderForm({ ...founderForm, founderName: e.target.value })} />
                                <input className={styles.input} placeholder="Founder Email" type="email" required
                                    value={founderForm.email} onChange={e => setFounderForm({ ...founderForm, email: e.target.value })} />

                                <input className={styles.input} placeholder="Product Name" required
                                    value={founderForm.productName} onChange={e => setFounderForm({ ...founderForm, productName: e.target.value })} />
                                <input className={styles.input} placeholder="Website URL" type="url" required
                                    value={founderForm.website} onChange={e => setFounderForm({ ...founderForm, website: e.target.value })} />

                                <select className={styles.input} required value={founderForm.category} onChange={e => setFounderForm({ ...founderForm, category: e.target.value })}>
                                    <option value="">Category</option>
                                    <option value="DevTools">DevTools</option>
                                    <option value="Marketing">Marketing</option>
                                    <option value="Productivity">Productivity</option>
                                    <option value="Design">Design</option>
                                    <option value="Other">Other</option>
                                </select>
                                <input className={styles.input} placeholder="Social Profile (Optional)"
                                    value={founderForm.social} onChange={e => setFounderForm({ ...founderForm, social: e.target.value })} />
                            </div>
                            <textarea className={styles.textarea} placeholder="Short Description" required rows={3}
                                value={founderForm.description} onChange={e => setFounderForm({ ...founderForm, description: e.target.value })} />

                            <button type="submit" disabled={founderStatus === 'submitting'} className={`${styles.btn} ${styles.btnPrimary} ${styles.formBtn}`}>
                                {founderStatus === 'submitting' ? 'Joining...' : 'Join Founder Waitlist'}
                            </button>
                            <p className={styles.smallText}>Selected products will be featured on launch day.</p>
                        </form>
                    )}
                </div>
            </section>

            {/* SECTION 5: BUYER VALUE PROP */}
            <section className={`${styles.section} ${styles.reveal}`}>
                <div className={styles.container}>
                    <h2 className={styles.sectionHeading}>Discover useful tools before everyone else does.</h2>
                    <p className={styles.sectionDesc}>
                        LaunchXact is a curated space where early adopters explore new SaaS tools built by real founders.
                    </p>
                </div>
            </section>

            {/* SECTION 6: BUYER ADVANTAGES */}
            <section className={`glass-panel ${styles.featuresSection} ${styles.reveal} ${styles.contentShiftRight}`} style={{ position: 'relative', overflow: 'hidden' }}>
                <div className={styles.constellationBg}>
                    <ConstellationCanvas />
                </div>
                {/* Side Visual */}
                <div className={`${styles.sideVisual} ${styles.sideTelescope}`}>
                    <FloatingTelescope />
                </div>
                <div className={styles.container}>
                    <h3 className={styles.subHeading}>Why explore tools on LaunchXact</h3>
                    <div className={styles.grid}>
                        {[
                            { title: "Curated, high-quality tools", desc: "No spam, no low-effort listings—only real products." },
                            { title: "Early access to new software", desc: "Discover tools before they go mainstream." },
                            { title: "Clean discovery experience", desc: "No noisy feeds or distractions." },
                            { title: "Direct access to founder-built tools", desc: "Products created by real builders solving real problems." },
                            { title: "Transparent product pages", desc: "Clear descriptions and direct links to official sites." },
                            { title: "Constantly updated directory", desc: "New tools added regularly." },
                        ].map((item, i) => (
                            <div key={i} className={styles.featureCard}>
                                <FontAwesomeIcon icon={faRocket} className={styles.checkIcon} />
                                <div>
                                    <h4>{item.title}</h4>
                                    <p>{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECTION 7: BUYER FORM */}
            <section id="buyer-form" className={`${styles.section} ${styles.reveal}`}>
                <div className={`glass-panel ${styles.formCard}`}>
                    <h2>Join the early adopter waitlist</h2>
                    <p className={styles.formSub}>Get notified when LaunchXact goes live.</p>

                    {buyerStatus === 'success' ? (
                        <div className={styles.successBox}>
                            <h3>You're on the list!</h3>
                            <p>Expect great tools in your inbox soon.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleBuyerSubmit} className={styles.form}>
                            <input className={styles.input} placeholder="Email Address" type="email" required
                                value={buyerForm.email} onChange={e => setBuyerForm({ ...buyerForm, email: e.target.value })} />
                            <input className={styles.input} placeholder="(Optional) What kind of tools do you like?"
                                value={buyerForm.interests} onChange={e => setBuyerForm({ ...buyerForm, interests: e.target.value })} />

                            <button type="submit" disabled={buyerStatus === 'submitting'} className={`${styles.btn} ${styles.btnSecondary} ${styles.formBtn}`}>
                                {buyerStatus === 'submitting' ? 'Joining...' : 'Join Early User Waitlist'}
                            </button>
                        </form>
                    )}
                </div>
            </section>

            {/* SECTION 8: FINAL CTA */}
            <section className={`${styles.finalCta} ${styles.reveal}`}>
                <h2>Be part of the first LaunchXact collection.</h2>
                <p>Whether you’re building a tool or looking for one,<br />LaunchXact is where founders and early adopters meet.</p>
                <div className={styles.heroActions}>
                    <button onClick={() => scrollToSection('founder-form')} className={`${styles.btn} ${styles.btnPrimary}`}>Join as Founder</button>
                    <button onClick={() => scrollToSection('buyer-form')} className={`${styles.btn} ${styles.btnSecondary}`}>Join as Early User</button>
                </div>
            </section>

            {/* SECTION 9: FOOTER */}
            <footer className={styles.footer}>
                <div className={styles.links}>
                    <Link href="/about">About</Link>
                    <Link href="/contact">Contact</Link>
                    <button onClick={() => scrollToSection('founder-form')} className={styles.linkBtn}>Founder waitlist</button>
                    <button onClick={() => scrollToSection('buyer-form')} className={styles.linkBtn}>Buyer waitlist</button>
                </div>
                <p className={styles.disclaimer}>
                    LaunchXact is a product discovery directory. We do not process payments or handle transactions between buyers and sellers. Please review products and terms on the official product websites before purchasing.
                </p>
                <p>&copy; {new Date().getFullYear()} LaunchXact</p>
            </footer>
        </div>
    );
}
