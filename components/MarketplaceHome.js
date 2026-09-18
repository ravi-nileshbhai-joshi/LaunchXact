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
    faCheck,
    faShieldAlt,
    faCheckCircle,
    faExclamationTriangle,
    faBolt,
    faExternalLinkAlt
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

    // Prefill from tool funnels and handle smooth scroll to founder-form
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const params = new URLSearchParams(window.location.search);
        const websiteParam = params.get('website') || params.get('url');
        const productParam = params.get('product') || params.get('name');
        const emailParam = params.get('email');

        if (websiteParam || productParam || emailParam) {
            setFounderForm(prev => ({
                ...prev,
                website: websiteParam || prev.website,
                productName: productParam || prev.productName,
                email: emailParam || prev.email,
            }));
        }

        if (window.location.hash === '#founder-form' || websiteParam) {
            const timer = setTimeout(() => {
                const target = document.getElementById('founder-form');
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 300);
            return () => clearTimeout(timer);
        }
    }, []);

    // Form States (Founding 50 3-Step Wizard)
    const [formStep, setFormStep] = useState(1); // 1 | 2 | 3
    const [step2Editable, setStep2Editable] = useState(false);
    const [step1Error, setStep1Error] = useState('');
    const [step3Error, setStep3Error] = useState('');

    const [founderForm, setFounderForm] = useState({
        founderName: '',
        email: '',
        productName: '',
        website: '',
        category: 'AI & DevTools',
        social: '',
        description: '', // One-line description
        useCases: '',
        targetCustomer: '',
        pricing: '',
        keyFeatures: '',
        founderStory: '',
        stage: 'Live', // 'MVP' | 'Live' | 'Generating revenue'
        monthlyRevenue: 'Pre-revenue ($0)',
        biggestProblem: 'Distribution',
        reviewTier: 'standard',
        logoUrl: ''
    });


    const [buyerForm, setBuyerForm] = useState({
        email: '',
        interests: ''
    });

    const [founderStatus, setFounderStatus] = useState('idle'); // 'idle' | 'submitting' | 'success'
    const [buyerStatus, setBuyerStatus] = useState('idle');

    // Badge Verification States for Free Tier
    const [badgeStatus, setBadgeStatus] = useState('idle'); // 'idle' | 'verifying' | 'verified' | 'failed'
    const [badgeError, setBadgeError] = useState('');
    const [copiedBadge, setCopiedBadge] = useState(false);

    const checkBadgeLive = async (websiteUrl) => {
        const urlToTest = websiteUrl || founderForm.website;
        if (!urlToTest) {
            setBadgeError('Please enter your website URL in the form above first.');
            setBadgeStatus('failed');
            return false;
        }

        setBadgeStatus('verifying');
        setBadgeError('');
        try {
            const res = await fetch('/api/waitlist/verify-badge', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ website: urlToTest })
            });
            const data = await res.json();
            if (data.verified) {
                setBadgeStatus('verified');
                setBadgeError('');
                return true;
            } else {
                setBadgeStatus('failed');
                setBadgeError(data.message || 'LaunchXact badge was not detected on your website footer.');
                return false;
            }
        } catch (err) {
            setBadgeStatus('failed');
            setBadgeError('Could not connect to website: ' + err.message);
            return false;
        }
    };

    // Auto-fill Data Normalization & Form Hydration
    const [inlineAutofillLoading, setInlineAutofillLoading] = useState(false);

    const applyAutoFillData = (extractedData, logoUrl) => {
        if (!extractedData) return;

        // 1. Stage normalization
        let normStage = 'Live';
        const rawStage = (extractedData.stage || '').toLowerCase();
        if (rawStage.includes('revenue') || rawStage.includes('paying') || rawStage.includes('generating')) {
            normStage = 'Generating revenue';
        } else if (rawStage.includes('mvp') || rawStage.includes('build') || rawStage.includes('idea')) {
            normStage = 'MVP';
        } else {
            normStage = 'Live';
        }

        // 2. Category normalization
        const validCats = [
            'AI & DevTools',
            'B2B SaaS',
            'Marketing & Sales',
            'Fintech & Payments',
            'Productivity & Ops',
            'Creator Economy',
            'Other'
        ];
        let normCat = 'AI & DevTools';
        const rawCat = (extractedData.category || '').toLowerCase();
        if (rawCat.includes('b2b')) normCat = 'B2B SaaS';
        else if (rawCat.includes('market') || rawCat.includes('sales')) normCat = 'Marketing & Sales';
        else if (rawCat.includes('fin') || rawCat.includes('pay') || rawCat.includes('commerce')) normCat = 'Fintech & Payments';
        else if (rawCat.includes('prod') || rawCat.includes('ops') || rawCat.includes('util')) normCat = 'Productivity & Ops';
        else if (rawCat.includes('creat')) normCat = 'Creator Economy';
        else if (rawCat.includes('ai') || rawCat.includes('dev') || rawCat.includes('tool')) normCat = 'AI & DevTools';
        else if (validCats.includes(extractedData.category)) normCat = extractedData.category;
        else normCat = 'Other';

        // 3. Name fallback
        let inferredName = extractedData.productName || extractedData.name || '';
        if (!inferredName && founderForm.website) {
            try {
                const host = new URL(founderForm.website).hostname.replace('www.', '').split('.')[0];
                inferredName = host.charAt(0).toUpperCase() + host.slice(1);
            } catch (_) {}
        }

        const cleanDesc = extractedData.description || (inferredName ? `${inferredName} helps modern teams streamline key operations.` : 'Modern software tool.');
        const cleanUseCases = Array.isArray(extractedData.useCases) ? extractedData.useCases.join(', ') : (extractedData.useCases || 'Workflow automation, team productivity, real-time analytics');
        const cleanTargetCustomer = extractedData.targetCustomer || 'Modern software teams, founders, and technical operators';
        const cleanPricing = extractedData.pricing || extractedData.price || 'Free tier available / freemium';
        const cleanKeyFeatures = Array.isArray(extractedData.keyFeatures) 
            ? extractedData.keyFeatures.join(', ') 
            : (Array.isArray(extractedData.features) ? extractedData.features.join(', ') : (extractedData.keyFeatures || 'Instant setup, clean interface, automated syncing, developer API'));

        setFounderForm(prev => ({
            ...prev,
            productName: inferredName || prev.productName,
            website: extractedData.website || extractedData.url || prev.website,
            description: cleanDesc || prev.description,
            category: normCat,
            useCases: cleanUseCases || prev.useCases,
            targetCustomer: cleanTargetCustomer || prev.targetCustomer,
            pricing: cleanPricing || prev.pricing,
            keyFeatures: cleanKeyFeatures || prev.keyFeatures,
            stage: normStage,
            logoUrl: logoUrl || extractedData.logoUrl || prev.logoUrl
        }));
    };

    const handleStep1Continue = async (e) => {
        if (e) e.preventDefault();
        setStep1Error('');

        let rawUrl = founderForm.website.trim();
        if (!rawUrl) {
            setStep1Error('Please enter your product website URL.');
            return;
        }
        if (!founderForm.email.trim() || !founderForm.email.includes('@')) {
            setStep1Error('Please enter a valid email address.');
            return;
        }

        if (!rawUrl.startsWith('http://') && !rawUrl.startsWith('https://')) {
            rawUrl = `https://${rawUrl}`;
            setFounderForm(prev => ({ ...prev, website: rawUrl }));
        }

        setInlineAutofillLoading(true);
        try {
            const res = await fetch('/api/tools/autofill', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: rawUrl, toolType: 'onboarding' })
            });
            const data = await res.json();
            if (res.ok && data.data) {
                applyAutoFillData(data.data, data.logoUrl);
            } else {
                let fallbackName = 'My Product';
                try {
                    fallbackName = new URL(rawUrl).hostname.replace('www.', '').split('.')[0];
                    fallbackName = fallbackName.charAt(0).toUpperCase() + fallbackName.slice(1);
                } catch (_) {}
                applyAutoFillData({
                    productName: fallbackName,
                    website: rawUrl,
                    description: `${fallbackName} is a modern software platform built for high-velocity teams.`,
                    category: 'AI & DevTools',
                    useCases: 'Workflow optimization, team collaboration, automated tasks',
                    targetCustomer: 'Founders, developers, and growing teams',
                    pricing: 'Free tier available',
                    keyFeatures: 'Fast onboarding, collaborative dashboard, native integrations',
                    stage: 'Live'
                });
            }
        } catch (err) {
            console.error('Autofill error:', err);
            let fallbackName = 'My Product';
            try {
                fallbackName = new URL(rawUrl).hostname.replace('www.', '').split('.')[0];
                fallbackName = fallbackName.charAt(0).toUpperCase() + fallbackName.slice(1);
            } catch (_) {}
            applyAutoFillData({
                productName: fallbackName,
                website: rawUrl,
                description: `${fallbackName} is a modern software platform built for high-velocity teams.`,
                category: 'AI & DevTools',
                useCases: 'Workflow optimization, team collaboration, automated tasks',
                targetCustomer: 'Founders, developers, and growing teams',
                pricing: 'Free tier available',
                keyFeatures: 'Fast onboarding, collaborative dashboard, native integrations',
                stage: 'Live'
            });
        } finally {
            setInlineAutofillLoading(false);
            setFormStep(2);
        }
    };

    const handleInlineUrlAutoFill = async () => {
        handleStep1Continue();
    };

    // 𝕏 Tweet Verification States
    const [tweetUrlInput, setTweetUrlInput] = useState('');
    const [tweetStatus, setTweetStatus] = useState('idle'); // 'idle' | 'verifying' | 'verified' | 'failed'
    const [tweetMessage, setTweetMessage] = useState('');
    const [verifiedAuthor, setVerifiedAuthor] = useState('');

    const handleVerifyTweet = async (e) => {
        e?.preventDefault();
        const trimmed = tweetUrlInput.trim();
        if (!trimmed) {
            setTweetMessage('Please paste your 𝕏 post link.');
            setTweetStatus('failed');
            return;
        }

        setTweetStatus('verifying');
        setTweetMessage('');
        try {
            const res = await fetch('/api/waitlist/verify-tweet', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: founderForm.email,
                    productName: founderForm.productName,
                    tweetUrl: trimmed
                })
            });
            const data = await res.json();
            if (data.verified) {
                setTweetStatus('verified');
                setTweetMessage(data.message || '+2x Priority Boost Activated!');
                setVerifiedAuthor(data.authorName || '');
            } else {
                setTweetStatus('failed');
                setTweetMessage(data.message || 'Could not verify this post on 𝕏.');
            }
        } catch (err) {
            setTweetStatus('failed');
            setTweetMessage('Verification error: ' + err.message);
        }
    };

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
        if (e) e.preventDefault();
        setStep3Error('');

        if (!founderForm.founderName.trim()) {
            setStep3Error('Please enter your name.');
            return;
        }

        setFounderStatus('submitting');
        try {
            const res = await fetch('/api/waitlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    type: 'founder', 
                    data: {
                        ...founderForm,
                        reviewTier: 'standard'
                    }
                })
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || data.message || 'Submission failed');
            }
            setFounderStatus('success');
            setTimeout(() => {
                const target = document.getElementById('founder-form');
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 80);
        } catch (err) {
            console.error('Founder submit error:', err);
            setStep3Error(err.message || 'Submission failed. Please try again.');
            setFounderStatus('idle');
        }
    };

    useEffect(() => {
        if (founderStatus === 'success') {
            const timer = setTimeout(() => {
                const target = document.getElementById('founder-form');
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [founderStatus]);

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
            {/* ===== 1. HERO SECTION ===== */}
            <section className={`${styles.hero} ${styles.reveal}`}>
                <div className={styles.heroContent}>
                    <div className={styles.heroBadge}>
                        🧭 Curated Software Discovery
                    </div>

                    <h1 className={styles.heroTitle}>
                        Discover software by what you
                        <br /><span className={styles.gradientText}>actually need.</span>
                    </h1>

                    <p className={styles.heroSub}>
                        Explore emerging SaaS, AI tools, developer products and useful software — curated for people who want to find the right product, not just the loudest launch.
                    </p>

                    <div className={styles.heroActions}>
                        <button onClick={() => scrollToSection('founder-form')} className={`${styles.btn} ${styles.btnPrimary} ${styles.heroPrimaryBtn}`}>
                            🚀 Launch Your Product
                        </button>
                        <Link href="/tools" className={`${styles.btn} ${styles.btnSecondary} ${styles.heroSecondaryBtn}`}>
                            🛠️ Explore 13 Free Tools
                        </Link>
                    </div>

                    <div className={styles.heroAuditCallout}>
                        <span style={{ fontSize: '1rem' }}>⚡</span>
                        <span>Want to know how your landing page performs?</span>
                        <Link href="/grade" className={styles.graderInlineLink}>
                            Run Free AI Grader →
                        </Link>
                    </div>

                    <div className={styles.heroTrustGrid}>
                        <div className={styles.heroTrustItem}><span className={styles.trustCheckIcon}>✓</span> 100% Free for Builders</div>
                        <div className={styles.heroTrustItem}><span className={styles.trustCheckIcon}>✓</span> Zero Revenue Cut</div>
                        <div className={styles.heroTrustItem}><span className={styles.trustCheckIcon}>✓</span> Hand-Curated Quality</div>
                        <div className={styles.heroTrustItem}><span className={styles.trustCheckIcon}>✓</span> Permanent Discovery</div>
                    </div>

                    {/* Ecosystem & Partner Badges */}
                    <div className={styles.ecosystemStrip}>
                        <span className={styles.stripLabel}>Built & verified with</span>
                        <div className={styles.stripBadges}>
                            <span className={styles.trustBadge}>⚡ Next.js & Turbopack</span>
                            <span className={styles.trustBadge}>🛡️ Supabase Encrypted Storage</span>
                            <span className={styles.trustBadge}>📬 Resend Certified Delivery</span>
                            <span className={styles.trustBadge}>🌐 Open for Founders Worldwide</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== NEW THIS WEEK ===== */}
            <section id="new-this-week" className={`${styles.section} ${styles.reveal}`}>
                <div className={styles.container}>
                    <div className={styles.sectionHeaderRow}>
                        <div>
                            <div className={styles.sectionBadge}>🔥 Fresh Curation</div>
                            <h2 className={styles.sectionHeadingLeft}>New this week</h2>
                            <p className={styles.sectionDescLeft}>Fresh tools, hand-checked before they're listed.</p>
                        </div>
                        <span className={styles.curationBadge}>
                            <span className={styles.pulseDot} /> Curation in progress • Batch 01
                        </span>
                    </div>

                    <div className={styles.toolDropGrid}>
                        {[
                            { emoji: '🤖', cat: 'AI Tools', name: 'Curating Batch 01', desc: 'We are reviewing the first batch of AI tools for real utility, model speed, and honest pricing. Check back shortly.', tint: '#f5f3ff', border: '#ddd6fe' },
                            { emoji: '🛠️', cat: 'Developer', name: 'In Technical Review', desc: 'Dev-focused CLI tools, APIs, and infrastructure utilities are undergoing code & deployment quality audits.', tint: '#eff6ff', border: '#bfdbfe' },
                            { emoji: '📈', cat: 'Marketing', name: 'Evaluation Phase', desc: 'Growth, analytics, and conversion software being checked for tangible founder ROI and clean UX.', tint: '#f0fdf4', border: '#bbf7d0' },
                        ].map((card, i) => (
                            <div key={i} className={styles.toolDropCard}>
                                <div className={styles.toolDropCardTop}>
                                    <div className={styles.toolDropEmoji} style={{ background: card.tint, border: `1px solid ${card.border}` }}>
                                        {card.emoji}
                                    </div>
                                    <span className={styles.toolDropCategory}>{card.cat}</span>
                                </div>
                                <h4 className={styles.toolDropName}>{card.name}</h4>
                                <p className={styles.toolDropDesc}>{card.desc}</p>
                                <div className={styles.toolDropStatus}>
                                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#7c3aed' }} />
                                    Review queue active
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== EXPLORE BY CATEGORY ===== */}
            <section className={`${styles.section} ${styles.reveal}`}>
                <div className={styles.container}>
                    <div className={styles.sectionHeaderCenter}>
                        <div className={styles.sectionBadge}>📂 Taxonomy & Directory</div>
                        <h2 className={styles.sectionHeading}>Explore by category</h2>
                        <p className={styles.sectionDesc}>Find tools matched to what you're actually working on.</p>
                    </div>
                    <div className={styles.categoryGrid}>
                        {[
                            { emoji: '🤖', label: 'AI Tools', tint: '#f5f3ff' },
                            { emoji: '💻', label: 'Developer', tint: '#eff6ff' },
                            { emoji: '📢', label: 'Marketing', tint: '#fdf2f8' },
                            { emoji: '⚙️', label: 'Productivity', tint: '#fffbeb' },
                            { emoji: '💳', label: 'Fintech', tint: '#f0fdf4' },
                            { emoji: '🎨', label: 'Creator Tools', tint: '#faf5ff' },
                            { emoji: '📦', label: 'B2B SaaS', tint: '#f8fafc' },
                            { emoji: '🔍', label: 'SEO & Growth', tint: '#ecfeff' },
                        ].map((cat, i) => (
                            <div
                                key={i}
                                className={styles.categoryCard}
                                title="Directory opening soon for this category"
                            >
                                <div className={styles.categoryIconBox} style={{ background: cat.tint }}>
                                    {cat.emoji}
                                </div>
                                <span className={styles.categoryLabel}>{cat.label}</span>
                                <span className={styles.categoryStatus}>Curating</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== FOUNDING 50 ===== */}
            <section id="founding-50" className={`${styles.section} ${styles.reveal}`}>
                <div className={styles.founding50Wrapper}>
                    <span className={styles.founding50Badge}>🏅 Founding Collection</span>

                    <h2 className={styles.founding50Heading}>
                        Founding <span className={styles.gradientText}>50</span>
                    </h2>

                    <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.7, margin: '0 0 0.5rem' }}>
                        We&apos;re selecting the first <strong style={{ color: '#0f172a' }}>50 products</strong> for LaunchXact&apos;s founding collection.
                    </p>
                    <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: 1.65, margin: '0 0 2rem' }}>
                        Every product is reviewed by hand. We look for real utility, working software, and founders who care about what they build. No noise. No filler.
                    </p>

                    {/* What Founding 50 means */}
                    <div style={{ textAlign: 'left', marginBottom: '1.75rem' }}>
                        <p style={{ fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#7c3aed', marginBottom: '1rem' }}>
                            The first 50 accepted products receive:
                        </p>
                        <div className={styles.founding50PerksGrid}>
                            {[
                                { icon: '📄', label: 'Free permanent listing', desc: 'Your product page lives on LaunchXact indefinitely.' },
                                { icon: '✍️', label: 'Free editorial setup', desc: 'We write and format your listing — you just submit.' },
                                { icon: '👤', label: 'Founder profile', desc: 'A dedicated space to tell your story as a builder.' },
                                { icon: '📂', label: 'Category placement', desc: 'Listed under the right category so the right people find you.' },
                                { icon: '🎯', label: 'Use-case placement', desc: 'Tagged by what your product actually does, not just what it is.' },
                                { icon: '⚖️', label: 'Comparison eligibility', desc: 'Included when users compare tools in your space.' },
                                { icon: '📣', label: 'Launch announcement', desc: 'We announce your listing when it goes live.' },
                                { icon: '📊', label: 'Analytics access', desc: 'See how your product is being discovered and viewed.' },
                                { icon: '🏅', label: 'Founding badge', desc: 'A permanent badge marking you as one of the first 50.' },
                            ].map((item, i) => (
                                <div key={i} className={styles.founding50PerkCard}>
                                    <div className={styles.founding50PerkIcon}>{item.icon}</div>
                                    <div>
                                        <div className={styles.founding50PerkLabel}>{item.label}</div>
                                        <div className={styles.founding50PerkDesc}>{item.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* No recurring fee callout */}
                    <div className={styles.noFeeBanner}>
                        <span style={{ fontSize: '1.3rem', flexShrink: 0 }}>✅</span>
                        <div>
                            <div className={styles.noFeeBannerTitle}>No recurring fee. Ever.</div>
                            <div className={styles.noFeeBannerText}>
                                We&apos;re giving you a permanent asset — not selling you traffic. Your listing doesn&apos;t expire. You don&apos;t pay monthly. You&apos;re not renting visibility. You own your place in the collection.
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => scrollToSection('founder-form')}
                        className={`${styles.btn} ${styles.btnPrimary} ${styles.heroPrimaryBtn}`}
                        style={{ fontSize: '1.05rem', padding: '0.95rem 2.5rem' }}
                    >
                        🚀 Submit Your Product
                    </button>
                    <p style={{ marginTop: '0.85rem', fontSize: '0.82rem', color: '#64748b' }}>No hype. Just great products.</p>
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
                            <div className={styles.statNum}>50</div>
                            <p className={styles.statLabel}>Founding collection spots — hand-curated</p>
                        </div>
                        <div className={styles.proofStat}>
                            <div className={styles.statNum}>100%</div>
                            <p className={styles.statLabel}>Free for builders. Keep all of your revenue.</p>
                        </div>
                        <div className={styles.proofStat}>
                            <div className={styles.statNum}>0%</div>
                            <p className={styles.statLabel}>Commission. Zero platform cut, always.</p>
                        </div>
                        <div className={styles.proofStat}>
                            <div className={styles.statNum}>Real</div>
                            <p className={styles.statLabel}>Human review. Every product, every time.</p>
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

            {/* ===== 4. FREE SAAS DISCOVERY AUDIT CTA BANNER ===== */}
            <section className={`${styles.graderCta} ${styles.reveal}`}>
                <div className={styles.graderCtaInner}>
                    <span className={styles.graderBadge}>✨ FREE DISCOVERY AUDIT</span>
                    <h2 className={styles.graderCtaTitle}>
                        Is your SaaS ready <span className={styles.gradientText}>to be discovered?</span>
                    </h2>
                    <p className={styles.graderCtaDesc}>
                        Enter your website and get a free analysis of your landing page, messaging, trust signals, SEO and AI-search readiness.
                    </p>
                    <Link href="/grade" className={`${styles.btn} ${styles.btnPrimary} ${styles.graderCtaBtn}`}>
                        Analyze My SaaS — Free →
                    </Link>
                </div>
            </section>

            {/* ===== 5. FOUNDER SUBMISSION FORM (FOUNDING 50 MULTI-STEP WIZARD) ===== */}
            <section id="founder-form" className={`${styles.section} ${styles.reveal}`}>
                <div className={styles.wizardWrapper}>
                    <div className={styles.wizardHeader}>
                        <h1>Apply to the LaunchXact Founding 50</h1>
                        <h3>Give your SaaS a permanent place to be discovered.</h3>
                        <p>
                            We&apos;re hand-selecting the first 50 products for LaunchXact&apos;s founding collection. Every submission goes through our curation funnel where each product is manually tested by hand for real market gap, competitive alternatives, and genuine problem-solving utility.
                        </p>
                        <p>
                            Accepted products receive a 100% free permanent listing in The Vault, founder profile, category placement, and direct indexing into AI search engines.
                        </p>
                        <div className={styles.wizardGuarantees}>
                            <strong>100% Free Listing. Zero Revenue Cuts. Manually Tested &amp; Curated.</strong>
                        </div>
                    </div>

                    {founderStatus === 'success' ? (
                        <div className={styles.successBox}>
                            <span className={styles.successBadgePill}>🎉 Application Received</span>
                            <h3>Application Received, {founderForm.founderName}!</h3>
                            <p>
                                <strong>{founderForm.productName}</strong> has been logged into the <strong>Founding 50 curation queue</strong>.
                            </p>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: '0 0 1.5rem', lineHeight: '1.6' }}>
                                A real person will review your product and website. We&apos;ll turn your website information into a structured LaunchXact product page and send you a preview at <strong>{founderForm.email}</strong> before it goes live.
                            </p>

                            <div className={styles.successActions}>
                                <a
                                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Just applied to the @LaunchXact Founding 50 with ${founderForm.productName}! Excited to get a permanent place to be discovered. 🚀 https://launchxact.com`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.shareXBtn}
                                >
                                    <FontAwesomeIcon icon={faXTwitter} style={{ marginRight: '6px' }} /> Share on 𝕏 (+2x Priority Review)
                                </a>
                            </div>

                            {/* 𝕏 Post Verification Card & Automated Priority Claimer */}
                            <div className={styles.tweetVerificationCard}>
                                {tweetStatus === 'verified' ? (
                                    <div className={styles.tweetVerifiedBanner}>
                                        <FontAwesomeIcon icon={faCheckCircle} className={styles.tweetVerifiedIcon} />
                                        <div>
                                            <strong>+2x Priority Review Boost Activated! 🎉</strong>
                                            <p>
                                                Verified 𝕏 post by <strong>@{verifiedAuthor || 'you'}</strong>. Your application for <strong>{founderForm.productName}</strong> has been tagged with priority review in our queue!
                                            </p>
                                            <a href={tweetUrlInput} target="_blank" rel="noopener noreferrer" className={styles.viewTweetLink}>
                                                View Verified 𝕏 Post <FontAwesomeIcon icon={faExternalLinkAlt} style={{ marginLeft: '4px', fontSize: '0.75rem' }} />
                                            </a>
                                        </div>
                                    </div>
                                ) : (
                                    <div className={styles.claimPriorityBox}>
                                        <div className={styles.claimPriorityHeader}>
                                            <span className={styles.claimPriorityBadge}>⚡ Automated Priority Boost</span>
                                            <span className={styles.claimPriorityTitle}>Already posted on 𝕏? Paste your post link to claim +2x queue priority:</span>
                                        </div>
                                        <form onSubmit={handleVerifyTweet} className={styles.tweetInputGroup}>
                                            <input
                                                type="url"
                                                className={styles.tweetUrlInput}
                                                placeholder="Paste your 𝕏 post link (e.g. https://x.com/username/status/...)"
                                                value={tweetUrlInput}
                                                onChange={(e) => setTweetUrlInput(e.target.value)}
                                                required
                                            />
                                            <button
                                                type="submit"
                                                disabled={tweetStatus === 'verifying'}
                                                className={styles.claimPriorityBtn}
                                            >
                                                {tweetStatus === 'verifying' ? 'Verifying with 𝕏... ⏳' : 'Claim +2x Priority 🚀'}
                                            </button>
                                        </form>
                                        {tweetStatus === 'failed' && (
                                            <div className={styles.tweetErrorText}>
                                                <FontAwesomeIcon icon={faExclamationTriangle} style={{ marginRight: '6px' }} />
                                                {tweetMessage}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <p className={styles.successNote}>Check your inbox ({founderForm.email}) for review updates and your draft listing preview.</p>
                        </div>
                    ) : (
                        <div>
                            {/* Stepper progress bar */}
                            <div className={styles.stepper}>
                                <button
                                    type="button"
                                    onClick={() => setFormStep(1)}
                                    className={`${styles.stepperItem} ${formStep === 1 ? styles.stepperItemActive : (formStep > 1 ? styles.stepperItemCompleted : '')}`}
                                >
                                    <div className={styles.stepperCircle}>
                                        {formStep > 1 ? '✓' : '1'}
                                    </div>
                                    <span className={styles.stepperLabel}>Step 1: Built</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (founderForm.website && founderForm.email) setFormStep(2);
                                    }}
                                    className={`${styles.stepperItem} ${formStep === 2 ? styles.stepperItemActive : (formStep > 2 ? styles.stepperItemCompleted : '')}`}
                                >
                                    <div className={styles.stepperCircle}>
                                        {formStep > 2 ? '✓' : '2'}
                                    </div>
                                    <span className={styles.stepperLabel}>Step 2: Profile</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (founderForm.website && founderForm.email) setFormStep(3);
                                    }}
                                    className={`${styles.stepperItem} ${formStep === 3 ? styles.stepperItemActive : ''}`}
                                >
                                    <div className={styles.stepperCircle}>3</div>
                                    <span className={styles.stepperLabel}>Step 3: Founder</span>
                                </button>
                            </div>

                            {/* Step 1 — Tell us what you built */}
                            {formStep === 1 && (
                                <div className={styles.stepBox}>
                                    <h2 className={styles.stepTitle}>Step 1 — Tell us what you built</h2>
                                    <p className={styles.stepSub}>Enter your product URL and email to get started.</p>

                                    {step1Error && (
                                        <div className={styles.wizardErrorText}>
                                            <FontAwesomeIcon icon={faExclamationTriangle} style={{ marginRight: '6px' }} />
                                            {step1Error}
                                        </div>
                                    )}

                                    {inlineAutofillLoading && (
                                        <div className={styles.scanningBanner}>
                                            <span>⚡ Scanning your website and preparing draft listing...</span>
                                        </div>
                                    )}

                                    <form onSubmit={handleStep1Continue}>
                                        <div className={styles.formGroup}>
                                            <label className={styles.formLabel}>Product website *</label>
                                            <span className={styles.formHint}>Paste your product URL.</span>
                                            <input
                                                type="text"
                                                className={styles.input}
                                                placeholder="https://yourproduct.com"
                                                required
                                                value={founderForm.website}
                                                onChange={e => setFounderForm({ ...founderForm, website: e.target.value })}
                                            />
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label className={styles.formLabel}>Your email *</label>
                                            <span className={styles.formHint}>We&apos;ll use this to send your listing preview and review updates.</span>
                                            <input
                                                type="email"
                                                className={styles.input}
                                                placeholder="founder@company.com"
                                                required
                                                value={founderForm.email}
                                                onChange={e => setFounderForm({ ...founderForm, email: e.target.value })}
                                            />
                                        </div>

                                        <div className={styles.wizardBtnGroup}>
                                            <button
                                                type="submit"
                                                disabled={inlineAutofillLoading}
                                                className={styles.wizardPrimaryBtn}
                                            >
                                                {inlineAutofillLoading ? 'Scanning Website...' : 'Continue →'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {/* Step 2 — Review your product profile */}
                            {formStep === 2 && (
                                <div className={styles.stepBox}>
                                    <h2 className={styles.stepTitle}>Step 2 — Review your product profile</h2>
                                    <p className={styles.stepSub}>We&apos;ve scanned your website and prepared a draft listing.</p>

                                    {!step2Editable ? (
                                        <div className={styles.profileReviewGrid}>
                                            <div className={styles.profileReviewItem}>
                                                <div className={styles.profileItemHeader}>
                                                    <h4>Product name</h4>
                                                    <span className={styles.aiPill}>AI-generated</span>
                                                </div>
                                                <div className={styles.profileItemValue}>
                                                    {founderForm.productName || '—'}
                                                </div>
                                            </div>

                                            <div className={styles.profileReviewItem}>
                                                <div className={styles.profileItemHeader}>
                                                    <h4>One-line description</h4>
                                                    <span className={styles.aiPill}>AI-generated</span>
                                                </div>
                                                <div className={styles.profileItemValue}>
                                                    {founderForm.description || '—'}
                                                </div>
                                            </div>

                                            <div className={styles.profileReviewItem}>
                                                <div className={styles.profileItemHeader}>
                                                    <h4>Category</h4>
                                                    <span className={styles.aiPill}>AI-generated</span>
                                                </div>
                                                <div className={styles.profileItemValue}>
                                                    {founderForm.category || '—'}
                                                </div>
                                            </div>

                                            <div className={styles.profileReviewItem}>
                                                <div className={styles.profileItemHeader}>
                                                    <h4>Use cases</h4>
                                                    <span className={styles.aiPill}>AI-generated</span>
                                                </div>
                                                <div className={styles.profileItemValue}>
                                                    {founderForm.useCases || '—'}
                                                </div>
                                            </div>

                                            <div className={styles.profileReviewItem}>
                                                <div className={styles.profileItemHeader}>
                                                    <h4>Target customer</h4>
                                                    <span className={styles.aiPill}>AI-generated</span>
                                                </div>
                                                <div className={styles.profileItemValue}>
                                                    {founderForm.targetCustomer || '—'}
                                                </div>
                                            </div>

                                            <div className={styles.profileReviewItem}>
                                                <div className={styles.profileItemHeader}>
                                                    <h4>Pricing</h4>
                                                    <span className={styles.aiPill}>AI-generated</span>
                                                </div>
                                                <div className={styles.profileItemValue}>
                                                    {founderForm.pricing || '—'}
                                                </div>
                                            </div>

                                            <div className={styles.profileReviewItem}>
                                                <div className={styles.profileItemHeader}>
                                                    <h4>Key features</h4>
                                                    <span className={styles.aiPill}>AI-generated</span>
                                                </div>
                                                <div className={styles.profileItemValue}>
                                                    {founderForm.keyFeatures || '—'}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className={styles.profileReviewGrid}>
                                            <div className={styles.formGroup}>
                                                <label className={styles.formLabel}>Product name</label>
                                                <input
                                                    type="text"
                                                    className={styles.input}
                                                    value={founderForm.productName}
                                                    onChange={e => setFounderForm({ ...founderForm, productName: e.target.value })}
                                                />
                                            </div>

                                            <div className={styles.formGroup}>
                                                <label className={styles.formLabel}>One-line description</label>
                                                <textarea
                                                    className={styles.textarea}
                                                    rows={2}
                                                    value={founderForm.description}
                                                    onChange={e => setFounderForm({ ...founderForm, description: e.target.value })}
                                                />
                                            </div>

                                            <div className={styles.formGroup}>
                                                <label className={styles.formLabel}>Category</label>
                                                <select
                                                    className={styles.input}
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

                                            <div className={styles.formGroup}>
                                                <label className={styles.formLabel}>Use cases</label>
                                                <input
                                                    type="text"
                                                    className={styles.input}
                                                    value={founderForm.useCases}
                                                    onChange={e => setFounderForm({ ...founderForm, useCases: e.target.value })}
                                                />
                                            </div>

                                            <div className={styles.formGroup}>
                                                <label className={styles.formLabel}>Target customer</label>
                                                <input
                                                    type="text"
                                                    className={styles.input}
                                                    value={founderForm.targetCustomer}
                                                    onChange={e => setFounderForm({ ...founderForm, targetCustomer: e.target.value })}
                                                />
                                            </div>

                                            <div className={styles.formGroup}>
                                                <label className={styles.formLabel}>Pricing</label>
                                                <input
                                                    type="text"
                                                    className={styles.input}
                                                    value={founderForm.pricing}
                                                    onChange={e => setFounderForm({ ...founderForm, pricing: e.target.value })}
                                                />
                                            </div>

                                            <div className={styles.formGroup}>
                                                <label className={styles.formLabel}>Key features</label>
                                                <textarea
                                                    className={styles.textarea}
                                                    rows={2}
                                                    value={founderForm.keyFeatures}
                                                    onChange={e => setFounderForm({ ...founderForm, keyFeatures: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <div className={styles.wizardBtnGroup}>
                                        <button
                                            type="button"
                                            onClick={() => setFormStep(3)}
                                            className={styles.wizardPrimaryBtn}
                                        >
                                            Looks good →
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setStep2Editable(!step2Editable)}
                                            className={styles.wizardSecondaryBtn}
                                        >
                                            {step2Editable ? '✓ Done Editing' : 'Edit details'}
                                        </button>
                                    </div>
                                    <div style={{ textAlign: 'center', marginTop: '12px' }}>
                                        <button
                                            type="button"
                                            onClick={() => setFormStep(1)}
                                            className={styles.wizardBackBtn}
                                        >
                                            ← Change website or email
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Step 3 — Tell us about the founder */}
                            {formStep === 3 && (
                                <div className={styles.stepBox}>
                                    <h2 className={styles.stepTitle}>Step 3 — Tell us about the founder</h2>
                                    <p className={styles.stepSub}>Final details so we can curate your founder profile.</p>

                                    {step3Error && (
                                        <div className={styles.wizardErrorText}>
                                            <FontAwesomeIcon icon={faExclamationTriangle} style={{ marginRight: '6px' }} />
                                            {step3Error}
                                        </div>
                                    )}

                                    <form onSubmit={handleFounderSubmit}>
                                        <div className={styles.formGroup}>
                                            <label className={styles.formLabel}>Your name *</label>
                                            <input
                                                type="text"
                                                className={styles.input}
                                                placeholder="e.g. Gabriel Lawson"
                                                required
                                                value={founderForm.founderName}
                                                onChange={e => setFounderForm({ ...founderForm, founderName: e.target.value })}
                                            />
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label className={styles.formLabel}>X / LinkedIn</label>
                                            <input
                                                type="text"
                                                className={styles.input}
                                                placeholder="@yourhandle or https://linkedin.com/in/you"
                                                value={founderForm.social}
                                                onChange={e => setFounderForm({ ...founderForm, social: e.target.value })}
                                            />
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label className={styles.formLabel}>Tell us what you&apos;re building</label>
                                            <span className={styles.formHint}>Optional. Tell us what inspired the product or what problem you&apos;re trying to solve.</span>
                                            <textarea
                                                className={styles.textarea}
                                                rows={3}
                                                placeholder="What inspired the product or what problem are you trying to solve?"
                                                value={founderForm.founderStory}
                                                onChange={e => setFounderForm({ ...founderForm, founderStory: e.target.value })}
                                            />
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label className={styles.formLabel}>Product stage</label>
                                            <div className={styles.stageRadioGroup}>
                                                {[
                                                    { id: 'MVP', label: 'MVP' },
                                                    { id: 'Live', label: 'Live' },
                                                    { id: 'Generating revenue', label: 'Generating revenue' }
                                                ].map(st => (
                                                    <div
                                                        key={st.id}
                                                        onClick={() => setFounderForm({ ...founderForm, stage: st.id })}
                                                        className={`${styles.stageRadioOption} ${founderForm.stage === st.id ? styles.stageRadioOptionActive : ''}`}
                                                    >
                                                        <div className={styles.stageRadioIndicator}>
                                                            {founderForm.stage === st.id && (
                                                                <div className={styles.stageRadioIndicatorDot} />
                                                            )}
                                                        </div>
                                                        <span>{st.label}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <hr className={styles.infoSectionDivider} />

                                        {/* What happens next? */}
                                        <div className={styles.whatNextBox}>
                                            <h3 className={styles.whatNextHeading}>What happens next?</h3>
                                            <div className={styles.whatNextGrid}>
                                                <div className={styles.whatNextItem}>
                                                    <h4>1. We review</h4>
                                                    <p>A real person checks the product.</p>
                                                </div>
                                                <div className={styles.whatNextItem}>
                                                    <h4>2. We prepare your listing</h4>
                                                    <p>We turn your website information into a structured LaunchXact product page.</p>
                                                </div>
                                                <div className={styles.whatNextItem}>
                                                    <h4>3. You approve it</h4>
                                                    <p>You&apos;ll receive a preview before it goes live.</p>
                                                </div>
                                                <div className={styles.whatNextItem}>
                                                    <h4>4. Your listing stays</h4>
                                                    <p>Accepted products receive a permanent LaunchXact listing.</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Founding 50 benefits */}
                                        <div className={styles.benefitsSection}>
                                            <h3 className={styles.benefitsTitle}>Founding 50 benefits</h3>
                                            <div className={styles.benefitsCheckGrid}>
                                                {[
                                                    "Free permanent listing",
                                                    "Free editorial setup",
                                                    "Founder profile",
                                                    "Category placement",
                                                    "Use-case placement",
                                                    "Comparison eligibility",
                                                    "Launch announcement",
                                                    "LaunchXact analytics",
                                                    "Founding-product badge"
                                                ].map((benefit, i) => (
                                                    <div key={i} className={styles.benefitCheckItem}>
                                                        <FontAwesomeIcon icon={faCheck} className={styles.benefitCheckIcon} />
                                                        <span>{benefit}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className={styles.noFeeBanner}>
                                                No recurring fee. No mandatory backlink. No guaranteed traffic claims.
                                            </div>
                                        </div>

                                        {/* Ready? */}
                                        <div className={styles.readySection}>
                                            <h3 className={styles.readyTitle}>Ready?</h3>
                                            <button
                                                type="submit"
                                                disabled={founderStatus === 'submitting'}
                                                className={styles.wizardPrimaryBtn}
                                            >
                                                {founderStatus === 'submitting' ? 'Submitting Application...' : 'Apply to the Founding 50 →'}
                                            </button>
                                        </div>

                                        <div style={{ textAlign: 'center', marginTop: '12px' }}>
                                            <button
                                                type="button"
                                                onClick={() => setFormStep(2)}
                                                className={styles.wizardBackBtn}
                                            >
                                                ← Back to product review
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>
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

            {/* ===== 8. EXPLORER NOTIFY FORM ===== */}
            <section id="buyer-form" className={`${styles.section} ${styles.reveal}`}>
                <div className={styles.formCard}>
                    <h2>Stay in the loop</h2>
                    <p className={styles.formSub}>Get notified when new products are added to the collection. No newsletters. Just product drops.</p>

                    {buyerStatus === 'success' ? (
                        <div className={styles.successBox}>
                            <h3>You're in. 👋</h3>
                            <p>We'll reach out when the first products go live. No spam, ever.</p>
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
                                placeholder="(Optional) What kind of tools do you look for?" 
                                value={buyerForm.interests} 
                                onChange={e => setBuyerForm({ ...buyerForm, interests: e.target.value })} 
                            />
                            <button 
                                type="submit" 
                                disabled={buyerStatus === 'submitting'} 
                                className={`${styles.btn} ${styles.btnSecondary}`}
                            >
                                {buyerStatus === 'submitting' ? 'Saving...' : 'Notify Me of New Products'}
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
                    <h2>Good software deserves to be found.</h2>
                    <p>
                        If you've built something useful, we want to list it.<br />
                        If you're looking for the right tool, this is where to start.
                    </p>
                    <div className={styles.heroActions}>
                        <button onClick={() => scrollToSection('founder-form')} className={`${styles.btn} ${styles.btnPrimary}`} style={{ width: '240px' }}>
                            🚀 Submit Your Product
                        </button>
                        <button onClick={() => scrollToSection('buyer-form')} className={`${styles.btn} ${styles.btnSecondary}`} style={{ width: '240px' }}>
                            🔔 Get Notified
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
