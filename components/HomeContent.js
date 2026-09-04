'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import styles from './HomeContent.module.css';

export default function HomeContent({ latestArticles }) {

    // Scroll reveal
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add(styles.visible); }),
            { threshold: 0.08 }
        );
        document.querySelectorAll(`.${styles.reveal}`).forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    return (
        <div className={styles.page}>

            {/* ===== HERO ===== */}
            <section className={styles.hero}>
                {/* Decorative blobs */}
                <div className={styles.blobLeft} />
                <div className={styles.blobRight} />

                <div className={styles.heroInner}>
                    <span className={styles.badge}>✦ Launching Now — Startup Visibility OS</span>

                    <h1 className={styles.heroTitle}>
                        Nobody knows your<br />
                        <span className={styles.accent}>startup exists.</span>
                    </h1>

                    <p className={styles.heroSub}>
                        Startup Visibility OS helps founders build discoverability, authority, and distribution systems using modern SEO, AI search optimization, Reddit, and founder-led content. <strong>No paid ads required.</strong>
                    </p>

                    <div className={styles.heroActions}>
                        <Link href="/startup-visibility-os" className={styles.btnPrimary}>
                            Get Startup Visibility OS — $49
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M8 3l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </Link>
                        <Link href="/startup-visibility-os#whats-inside" className={styles.btnSecondary}>
                            See What's Inside
                        </Link>
                    </div>

                    {/* Social proof row */}
                    <div className={styles.socialRow}>
                        <div className={styles.avatarStack}>
                            {['R','K','M','A','T'].map((l, i) => (
                                <div key={i} className={styles.avatar} style={{ background: ['#7c3aed','#6d28d9','#5b21b6','#8b5cf6','#a78bfa'][i] }}>
                                    {l}
                                </div>
                            ))}
                        </div>
                        <div>
                            <div className={styles.stars}>★★★★★</div>
                            <p className={styles.socialLabel}>300+ founders already inside</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== STATS BANNER ===== */}
            <section className={`${styles.reveal} ${styles.statsBanner}`}>
                <div className={styles.statsGrid}>
                    {[
                        { num: '300+', label: 'Founders in the OS' },
                        { num: '$49', label: 'One-time, lifetime access' },
                        { num: '7 Days', label: 'To your first traction results' },
                    ].map((s, i) => (
                        <div key={i} className={styles.statItem}>
                            <div className={styles.statNum}>{s.num}</div>
                            <div className={styles.statLabel}>{s.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ===== PRODUCT FEATURES (What it covers) ===== */}
            <section className={`${styles.reveal} ${styles.featuresSection}`}>
                <div className={styles.container}>
                    <span className={styles.sectionLabel}>The Visibility System</span>
                    <h2 className={styles.sectionHeading}>
                        Four systems that make you{' '}
                        <span className={styles.accent}>impossible to miss</span>
                    </h2>
                    <p className={styles.sectionSub}>
                        The Startup Visibility OS is not a collection of tips. It's four interconnected systems that compound on each other.
                    </p>
                    <div className={styles.featuresGrid}>
                        {[
                            {
                                icon: '🔍',
                                title: 'AI & SEO Discovery',
                                desc: 'Get cited by ChatGPT, Perplexity, and Gemini. Rank on Google for long-tail founder searches using our GEO/AEO/SEO blueprint.'
                            },
                            {
                                icon: '🟠',
                                title: 'Reddit Authority',
                                desc: 'Build a trusted presence in developer and founder subreddits without spamming. Our value-first system drives permanent traffic.'
                            },
                            {
                                icon: '🚀',
                                title: 'Launch with Confidence',
                                desc: 'A complete 100+ directory submission system and launch-day playbook that generates backlinks, search landing pads, and early adopter traffic.'
                            },
                            {
                                icon: '🔄',
                                title: 'Distribution Loops',
                                desc: 'Design content that compounds. Each post, comment, and SEO article builds on the last — creating a self-sustaining growth engine.'
                            },
                        ].map((f, i) => (
                            <div key={i} className={styles.featureCard}>
                                <span className={styles.featureIcon}>{f.icon}</span>
                                <h3 className={styles.featureTitle}>{f.title}</h3>
                                <p className={styles.featureDesc}>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== GRADE CTA CALLOUT ===== */}
            <section className={`${styles.reveal} ${styles.gradeCta}`}>
                <div className={styles.gradeCtaInner}>
                    <span className={styles.gradeBadge}>🔥 Free AI Tool</span>
                    <h2 className={styles.gradeTitle}>
                        Grade your landing page for free
                    </h2>
                    <p className={styles.gradeDesc}>
                        Get an instant AI audit. We'll score your conversion readiness, trust signals, and SEO structure — then tell you exactly what to fix.
                    </p>
                    <Link href="/grade" className={styles.btnPrimary}>
                        ⚡ Grade My Landing Page
                    </Link>
                    <p className={styles.gradeNote}>Score 80+ to fast-track your Beta Platform application</p>
                </div>
            </section>

            {/* ===== BETA PLATFORM SECTION ===== */}
            <section className={`${styles.reveal} ${styles.betaSection}`}>
                <div className={styles.container}>
                    <div className={styles.betaCard}>
                        <div className={styles.betaLeft}>
                            <span className={styles.betaBadge}>DIRECTORY BETA</span>
                            <h2 className={styles.betaTitle}>
                                List your SaaS in our<br />
                                <span className={styles.accent}>curated directory</span>
                            </h2>
                            <p className={styles.betaDesc}>
                                LaunchXact is building a premium, manually curated SaaS marketplace. Submit your product for our Genesis launch batch or join as an early adopter to discover tools before they go mainstream.
                            </p>
                            <div className={styles.betaActions}>
                                <Link href="/#founder-form" className={styles.btnPrimary}>
                                    Submit SaaS
                                </Link>
                                <Link href="/#buyer-form" className={styles.btnSecondary}>
                                    Join as Early User
                                </Link>
                            </div>
                        </div>
                        <div className={styles.betaRight}>
                            {[
                                { icon: '✓', text: 'Continuous visibility — not just 1 launch day' },
                                { icon: '✓', text: 'Built for solo builders and small teams' },
                                { icon: '✓', text: 'No forced discounts or lifetime-deal pressure' },
                                { icon: '✓', text: 'Curated environment — no spam or noise' },
                                { icon: '✓', text: 'Reach founders and early adopters directly' },
                                { icon: '✓', text: 'Simple submission — no complex approval cycles' },
                            ].map((item, i) => (
                                <div key={i} className={styles.betaFeature}>
                                    <span className={styles.betaCheck}>{item.icon}</span>
                                    <span>{item.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== LATEST ARTICLES ===== */}
            {latestArticles && latestArticles.length > 0 && (
                <section className={`${styles.reveal} ${styles.articlesSection}`}>
                    <div className={styles.container}>
                        <span className={styles.sectionLabel}>Resources</span>
                        <h2 className={styles.sectionHeading}>
                            Founder insights & <span className={styles.accent}>tactical guides</span>
                        </h2>
                        <p className={styles.sectionSub}>
                            Practical advice on launching, SEO, and getting traction in the modern SaaS ecosystem.
                        </p>
                        <div className={styles.articlesGrid}>
                            {latestArticles.map((article) => (
                                <Link href={`/articles/${article.id}`} key={article.id} className={styles.articleCard}>
                                    <h4 className={styles.articleTitle}>{article.title}</h4>
                                    <p className={styles.articleDesc}>{article.description}</p>
                                    <span className={styles.articleCta}>
                                        Read article
                                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ===== FINAL CTA ===== */}
            <section className={`${styles.reveal} ${styles.finalCta}`}>
                <div className={styles.finalCtaInner}>
                    <h2 className={styles.finalTitle}>
                        Stop building in silence.
                    </h2>
                    <p className={styles.finalDesc}>
                        Get the Startup Visibility OS today and start building your discoverability system in the next 7 days.
                    </p>
                    <div className={styles.heroActions}>
                        <Link href="/startup-visibility-os" className={styles.btnPrimary}>
                            Get Startup Visibility OS — $49
                        </Link>
                        <Link href="/#founder-form" className={styles.btnSecondary}>
                            Submit Your SaaS
                        </Link>
                    </div>
                    <div className={styles.finalLinks}>
                        <Link href="/where-to-launch-saas">Launch Comparison</Link>
                        <Link href="/about">Our Story</Link>
                        <Link href="/contact">Contact Us</Link>
                        <Link href="/articles">Resources</Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
