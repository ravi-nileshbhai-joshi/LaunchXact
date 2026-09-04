'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import styles from './GeoSchemaGenerator.module.css';

// Preset configurations for instant founder exploration
const PRESETS = [
    {
        id: 'ai-agent',
        label: '🤖 AI Agent SaaS',
        name: 'QueryFlow AI',
        url: 'https://queryflow.ai',
        description: 'Autonomous natural language SQL query engine and schema observer for Postgres and Snowflake teams.',
        category: 'DeveloperApplication',
        operatingSystem: 'Web, All',
        pricingModel: 'Freemium',
        price: '49',
        currency: 'USD',
        orgName: 'QueryFlow Technologies Inc.',
        logoUrl: 'https://queryflow.ai/logo.png',
        features: [
            'Natural language to verified SQL execution',
            'Zero data storage — metadata-only query orchestration',
            'Automated slow query diagnostics & index suggestions',
            'Role-based data masking & SOC2 Type II compliance'
        ],
        faqs: [
            {
                q: 'How does QueryFlow protect confidential production database credentials?',
                a: 'QueryFlow operates entirely client-side or within your VPC through lightweight read-only proxy agents. Queries are generated using schema metadata only; raw customer table data never leaves your environment.'
            },
            {
                q: 'Is there a free tier for individual developers?',
                a: 'Yes, QueryFlow offers a perpetual free tier supporting up to 3 database connections and 500 AI-assisted query generations per month.'
            },
            {
                q: 'Which database engines are supported out of the box?',
                a: 'We natively support PostgreSQL, MySQL, Snowflake, ClickHouse, BigQuery, and Supabase with zero setup overhead.'
            }
        ]
    },
    {
        id: 'devtools',
        label: '⚡ DevTools & Infra',
        name: 'EdgeCache Engine',
        url: 'https://edgecache.dev',
        description: 'Ultra-low latency global KV storage and distributed cache invalidation API engineered for serverless runtimes.',
        category: 'DeveloperApplication',
        operatingSystem: 'Web, macOS, Windows, Linux',
        pricingModel: 'Subscription',
        price: '29',
        currency: 'USD',
        orgName: 'EdgeCache Systems',
        logoUrl: 'https://edgecache.dev/logo.png',
        features: [
            'Sub-15ms worldwide read latency across 32 edge regions',
            'Instant tag-based cache purging via webhooks or REST API',
            'Drop-in Redis-compatible wire protocol adapter',
            'Zero cold-start connection pooling for Next.js & Cloudflare Workers'
        ],
        faqs: [
            {
                q: 'Can EdgeCache replace Redis in production?',
                a: 'Yes. EdgeCache provides a wire-compatible Redis interface with persistent durable storage backed by NVMe clusters and global active-active replication.'
            },
            {
                q: 'What happens when my edge traffic spikes during a product launch?',
                a: 'Our architecture auto-scales without manual provisioning. Overages are billed at a predictable flat rate per million requests without sudden rate-limiting.'
            }
        ]
    },
    {
        id: 'creator',
        label: '🎨 Creator & Workflow',
        name: 'FramePilot',
        url: 'https://framepilot.io',
        description: 'AI-assisted video repurposing suite that transforms 60-minute webinars into viral short clips with animated subtitles.',
        category: 'DesignApplication',
        operatingSystem: 'Web, All',
        pricingModel: 'Free Trial',
        price: '19',
        currency: 'USD',
        orgName: 'FramePilot Labs',
        logoUrl: 'https://framepilot.io/logo.png',
        features: [
            'AI speaker tracking and dynamic 9:16 vertical re-framing',
            'One-click viral subtitle styling inspired by top creators',
            'Automatic hook detection and b-roll insert engine',
            'Direct scheduled publishing to TikTok, YouTube Shorts, and Reels'
        ],
        faqs: [
            {
                q: 'How long does it take to process a 1-hour video?',
                a: 'FramePilot processes a 60-minute video in under 4 minutes, outputting 8-12 ranked viral clips complete with captions and audio balancing.'
            },
            {
                q: 'Does FramePilot place a watermark on free trial exports?',
                a: 'No. The 14-day free trial provides full access to high-definition 4K exports without watermarks.'
            }
        ]
    }
];

export default function GeoSchemaGenerator() {
    // Active preset
    const [activePreset, setActivePreset] = useState('ai-agent');

    // Form inputs state
    const [name, setName] = useState(PRESETS[0].name);
    const [url, setUrl] = useState(PRESETS[0].url);
    const [description, setDescription] = useState(PRESETS[0].description);
    const [category, setCategory] = useState(PRESETS[0].category);
    const [operatingSystem, setOperatingSystem] = useState(PRESETS[0].operatingSystem);
    const [pricingModel, setPricingModel] = useState(PRESETS[0].pricingModel);
    const [price, setPrice] = useState(PRESETS[0].price);
    const [currency, setCurrency] = useState(PRESETS[0].currency);
    const [orgName, setOrgName] = useState(PRESETS[0].orgName);
    const [logoUrl, setLogoUrl] = useState(PRESETS[0].logoUrl);

    // Feature bullet list
    const [features, setFeatures] = useState(PRESETS[0].features);
    const [newFeature, setNewFeature] = useState('');

    // FAQ Q&A list
    const [faqs, setFaqs] = useState(PRESETS[0].faqs);

    // Schema tab and format state
    const [schemaTab, setSchemaTab] = useState('bundle'); // 'bundle' | 'software' | 'faq' | 'org'
    const [format, setFormat] = useState('nextjs'); // 'nextjs' | 'html' | 'json'
    const [copied, setCopied] = useState(false);

    // Apply preset
    const handleSelectPreset = (presetId) => {
        const p = PRESETS.find((item) => item.id === presetId);
        if (!p) return;
        setActivePreset(presetId);
        setName(p.name);
        setUrl(p.url);
        setDescription(p.description);
        setCategory(p.category);
        setOperatingSystem(p.operatingSystem);
        setPricingModel(p.pricingModel);
        setPrice(p.price);
        setCurrency(p.currency);
        setOrgName(p.orgName);
        setLogoUrl(p.logoUrl);
        setFeatures(p.features);
        setFaqs(p.faqs);
    };

    // Feature list handlers
    const addFeature = () => {
        if (!newFeature.trim()) return;
        setFeatures([...features, newFeature.trim()]);
        setNewFeature('');
    };

    const removeFeature = (idx) => {
        setFeatures(features.filter((_, i) => i !== idx));
    };

    const updateFeature = (idx, value) => {
        const next = [...features];
        next[idx] = value;
        setFeatures(next);
    };

    // FAQ handlers
    const addFaq = () => {
        setFaqs([...faqs, { q: 'What is your refund policy?', a: 'We offer a 30-day no-questions-asked refund policy for all subscription tiers.' }]);
    };

    const removeFaq = (idx) => {
        setFaqs(faqs.filter((_, i) => i !== idx));
    };

    const updateFaq = (idx, field, value) => {
        const next = [...faqs];
        next[idx] = { ...next[idx], [field]: value };
        setFaqs(next);
    };

    // Build Schema Objects
    const schemaObjects = useMemo(() => {
        const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
        const cleanPrice = pricingModel === 'Free' ? '0' : price || '0';

        // 1. SoftwareApplication Schema
        const softwareApplicationSchema = {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: name || 'Your Product Name',
            url: formattedUrl,
            description: description || 'Software application value proposition.',
            applicationCategory: category,
            operatingSystem: operatingSystem,
            offers: {
                '@type': 'Offer',
                price: cleanPrice,
                priceCurrency: currency,
                priceValidUntil: '2027-12-31',
                availability: 'https://schema.org/InStock',
                category: pricingModel
            },
            featureList: features.length > 0 ? features : undefined,
            publisher: orgName ? {
                '@type': 'Organization',
                name: orgName,
                url: formattedUrl
            } : undefined
        };

        // 2. FAQPage Schema
        const faqPageSchema = {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map((faq) => ({
                '@type': 'Question',
                name: faq.q,
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: faq.a
                }
            }))
        };

        // 3. Organization Schema
        const organizationSchema = {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: orgName || name,
            url: formattedUrl,
            logo: logoUrl || undefined,
            description: description || undefined
        };

        // 4. BreadcrumbList Schema
        const breadcrumbSchema = {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
                {
                    '@type': 'ListItem',
                    position: 1,
                    name: 'Home',
                    item: formattedUrl
                },
                {
                    '@type': 'ListItem',
                    position: 2,
                    name: name,
                    item: formattedUrl
                }
            ]
        };

        // 5. All-in-One GEO Bundle (@graph)
        const allInOneBundle = {
            '@context': 'https://schema.org',
            '@graph': [
                {
                    ...softwareApplicationSchema,
                    '@context': undefined
                },
                {
                    ...organizationSchema,
                    '@context': undefined
                },
                faqs.length > 0 ? {
                    ...faqPageSchema,
                    '@context': undefined
                } : null,
                {
                    ...breadcrumbSchema,
                    '@context': undefined
                }
            ].filter(Boolean)
        };

        return {
            bundle: allInOneBundle,
            software: softwareApplicationSchema,
            faq: faqPageSchema,
            org: organizationSchema
        };
    }, [name, url, description, category, operatingSystem, pricingModel, price, currency, orgName, logoUrl, features, faqs]);

    // Active schema payload based on tab
    const currentSchemaObj = schemaObjects[schemaTab] || schemaObjects.bundle;

    // Generated code output based on format
    const generatedCode = useMemo(() => {
        const jsonString = JSON.stringify(currentSchemaObj, null, 2);

        if (format === 'nextjs') {
            return `// Next.js App Router (app/layout.js or app/page.js)
export default function Page() {
  const jsonLd = ${jsonString};

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Your page content */}
    </>
  );
}`;
        }

        if (format === 'html') {
            return `<!-- Standard HTML (Webflow, Framer, WordPress, HTML Head) -->
<script type="application/ld+json">
${jsonString}
</script>`;
        }

        // Raw JSON-LD
        return jsonString;
    }, [currentSchemaObj, format]);

    // Copy to clipboard
    const handleCopy = () => {
        navigator.clipboard.writeText(generatedCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Download .jsonld file
    const handleDownload = () => {
        const blob = new Blob([JSON.stringify(currentSchemaObj, null, 2)], { type: 'application/ld+json' });
        const downloadUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `${name.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'schema'}-${schemaTab}.jsonld`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(downloadUrl);
    };

    // Linter / Validation checks
    const validationStatus = useMemo(() => {
        const checks = [
            { id: 'name', label: 'Product / Brand Name', valid: Boolean(name && name.trim().length > 1) },
            { id: 'url', label: 'Canonical Domain URL', valid: Boolean(url && url.includes('.')) },
            { id: 'desc', label: 'Value Proposition (>25 chars)', valid: Boolean(description && description.length >= 25) },
            { id: 'features', label: 'At least 3 Features in List', valid: features.length >= 3 },
            { id: 'pricing', label: 'Pricing & Currency Defined', valid: pricingModel === 'Free' || Boolean(price && currency) },
            { id: 'faqs', label: 'Valid FAQ Question/Answers', valid: faqs.length > 0 && faqs.every(f => f.q && f.a) }
        ];

        const passedCount = checks.filter(c => c.valid).length;
        const isValid = passedCount === checks.length;
        const charCount = JSON.stringify(currentSchemaObj).length;
        const estimatedTokens = Math.round(charCount / 4);

        return {
            checks,
            isValid,
            passedCount,
            totalCount: checks.length,
            charCount,
            estimatedTokens
        };
    }, [name, url, description, features, pricingModel, price, currency, faqs, currentSchemaObj]);

    return (
        <div className={styles.container}>
            {/* Header */}
            <header className={styles.header}>
                <span className={styles.badge}>✦ High Traffic Tools Suite</span>
                <h1 className={styles.title}>
                    GEO & Schema Snippet <span style={{ color: '#7c3aed' }}>Generator</span>
                </h1>
                <p className={styles.subtitle}>
                    Generate verified JSON-LD structured data tailored for Generative Engine Optimization (GEO). Get cited by ChatGPT Search, Perplexity, and Google AI Overviews.
                </p>
            </header>

            {/* Quick-Load Presets Bar */}
            <div className={styles.presetsBar}>
                <span className={styles.presetsLabel}>🚀 Quick-Load Demo Presets:</span>
                {PRESETS.map((p) => (
                    <button
                        key={p.id}
                        type="button"
                        onClick={() => handleSelectPreset(p.id)}
                        className={`${styles.presetBtn} ${activePreset === p.id ? styles.presetBtnActive : ''}`}
                    >
                        {p.label}
                    </button>
                ))}
            </div>

            {/* Main Interactive Grid */}
            <div className={styles.generatorGrid}>
                {/* Left: Input Form Panel */}
                <div className={styles.formPanel}>
                    <h2 className={styles.panelTitle}>⚙️ Product Schema Configuration</h2>
                    <p className={styles.panelSubtitle}>
                        Structured linked data tells LLMs and search engines exactly what your SaaS does, how much it costs, and why users choose it.
                    </p>

                    <div className={styles.sectionHeading}>🏷️ Core Product Identity</div>
                    <div className={styles.inputRow}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Product / SaaS Name *</label>
                            <input
                                type="text"
                                className={styles.input}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g., LaunchMetrics AI"
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Website / Domain URL *</label>
                            <input
                                type="text"
                                className={styles.input}
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="https://yourdomain.com"
                            />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Value Proposition / AI Answer Summary *</label>
                        <textarea
                            className={styles.textarea}
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Clear, punchy 1-2 sentence description explaining who it is for and what core problem it solves."
                        />
                        <div className={styles.helperText}>
                            Generative engines extract this field directly when responding to user software recommendations.
                        </div>
                    </div>

                    <div className={styles.inputRow}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Software Category</label>
                            <select
                                className={styles.select}
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="BusinessApplication">Business Application</option>
                                <option value="DeveloperApplication">Developer Tool / Application</option>
                                <option value="UtilitiesApplication">Utility / Productivity</option>
                                <option value="DesignApplication">Design / Creative Tool</option>
                                <option value="FinanceApplication">Finance & Payments</option>
                                <option value="SecurityApplication">Security & Privacy</option>
                                <option value="HealthApplication">Health & Wellness</option>
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Operating System / Platform</label>
                            <select
                                className={styles.select}
                                value={operatingSystem}
                                onChange={(e) => setOperatingSystem(e.target.value)}
                            >
                                <option value="Web, All">Web, All Browsers</option>
                                <option value="Web, macOS, Windows, Linux">Web, macOS, Windows, Linux</option>
                                <option value="macOS, iOS">macOS, iOS</option>
                                <option value="Windows">Windows Native</option>
                                <option value="Cross-Platform">Cross-Platform</option>
                            </select>
                        </div>
                    </div>

                    <div className={styles.sectionDivider} />

                    <div className={styles.sectionHeading}>💰 Pricing & Commercial Offer</div>
                    <div className={styles.inputRow}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Pricing Model</label>
                            <select
                                className={styles.select}
                                value={pricingModel}
                                onChange={(e) => setPricingModel(e.target.value)}
                            >
                                <option value="Free">100% Free</option>
                                <option value="Freemium">Freemium</option>
                                <option value="Subscription">Monthly Subscription</option>
                                <option value="One-Time">One-Time / Lifetime</option>
                                <option value="Free Trial">Free Trial</option>
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Price & Currency</label>
                            <div className={styles.priceCurrencyRow}>
                                <input
                                    type="text"
                                    className={styles.currencyInput}
                                    value={currency}
                                    onChange={(e) => setCurrency(e.target.value)}
                                    placeholder="USD"
                                    disabled={pricingModel === 'Free'}
                                />
                                <input
                                    type="number"
                                    className={styles.priceInput}
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    placeholder="29"
                                    disabled={pricingModel === 'Free'}
                                />
                            </div>
                        </div>
                    </div>

                    <div className={styles.inputRow}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Publisher / Organization</label>
                            <input
                                type="text"
                                className={styles.input}
                                value={orgName}
                                onChange={(e) => setOrgName(e.target.value)}
                                placeholder="Your Company Inc."
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Logo URL (Optional)</label>
                            <input
                                type="text"
                                className={styles.input}
                                value={logoUrl}
                                onChange={(e) => setLogoUrl(e.target.value)}
                                placeholder="https://yourdomain.com/logo.png"
                            />
                        </div>
                    </div>

                    <div className={styles.sectionDivider} />

                    {/* Features List */}
                    <div className={styles.sectionHeading}>✨ Key Feature Bullets (`featureList`)</div>
                    <div className={styles.featuresList}>
                        {features.map((feat, idx) => (
                            <div key={idx} className={styles.featureItem}>
                                <input
                                    type="text"
                                    className={styles.featureInput}
                                    value={feat}
                                    onChange={(e) => updateFeature(idx, e.target.value)}
                                    placeholder="Key technical or business feature..."
                                />
                                <button
                                    type="button"
                                    className={styles.deleteBtn}
                                    onClick={() => removeFeature(idx)}
                                    title="Delete feature"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className={styles.featureAddRow}>
                        <input
                            type="text"
                            className={styles.featureInput}
                            value={newFeature}
                            onChange={(e) => setNewFeature(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addFeature()}
                            placeholder="Type a new feature bullet and press Enter..."
                        />
                        <button
                            type="button"
                            className={styles.presetBtn}
                            onClick={addFeature}
                            style={{ background: '#7c3aed', color: '#fff', borderColor: '#7c3aed', minWidth: '70px' }}
                        >
                            + Add
                        </button>
                    </div>

                    <div className={styles.sectionDivider} />

                    {/* FAQ Builder */}
                    <div className={styles.sectionHeading}>❓ Conversational Founder FAQs (`FAQPage`)</div>
                    <p className={styles.helperText} style={{ marginBottom: '1rem' }}>
                        AI engines frequently cite FAQ questions verbatim when answering user inquiries like "Is [Your SaaS] free?" or "How does security work?".
                    </p>

                    {faqs.map((faq, idx) => (
                        <div key={idx} className={styles.faqItem}>
                            <div className={styles.faqHeader}>
                                <span className={styles.faqNumber}>FAQ #{idx + 1}</span>
                                <button
                                    type="button"
                                    className={styles.deleteBtn}
                                    onClick={() => removeFaq(idx)}
                                    style={{ padding: '0.2rem 0.5rem' }}
                                >
                                    ✕ Delete
                                </button>
                            </div>
                            <input
                                type="text"
                                className={styles.input}
                                value={faq.q}
                                onChange={(e) => updateFaq(idx, 'q', e.target.value)}
                                placeholder="Frequently Asked Question..."
                            />
                            <textarea
                                className={styles.textarea}
                                rows={2}
                                value={faq.a}
                                onChange={(e) => updateFaq(idx, 'a', e.target.value)}
                                placeholder="Direct, authoritative answer..."
                            />
                        </div>
                    ))}

                    <button
                        type="button"
                        className={styles.addBtn}
                        onClick={addFaq}
                    >
                        + Add New FAQ Question
                    </button>
                </div>

                {/* Right: Output Preview & Controls Panel */}
                <div className={styles.outputPanel}>
                    {/* Schema Type Switcher Tabs */}
                    <div className={styles.schemaTabs}>
                        <button
                            type="button"
                            className={`${styles.schemaTab} ${schemaTab === 'bundle' ? styles.schemaTabActive : ''}`}
                            onClick={() => setSchemaTab('bundle')}
                        >
                            🌐 All-in-One Bundle
                        </button>
                        <button
                            type="button"
                            className={`${styles.schemaTab} ${schemaTab === 'software' ? styles.schemaTabActive : ''}`}
                            onClick={() => setSchemaTab('software')}
                        >
                            💻 SoftwareApp
                        </button>
                        <button
                            type="button"
                            className={`${styles.schemaTab} ${schemaTab === 'faq' ? styles.schemaTabActive : ''}`}
                            onClick={() => setSchemaTab('faq')}
                        >
                            ❓ FAQPage
                        </button>
                        <button
                            type="button"
                            className={`${styles.schemaTab} ${schemaTab === 'org' ? styles.schemaTabActive : ''}`}
                            onClick={() => setSchemaTab('org')}
                        >
                            🏢 Organization
                        </button>
                    </div>

                    {/* Format Selector & Actions Bar */}
                    <div className={styles.outputControls}>
                        <div className={styles.formatTabs}>
                            <button
                                type="button"
                                className={`${styles.formatBtn} ${format === 'nextjs' ? styles.formatBtnActive : ''}`}
                                onClick={() => setFormat('nextjs')}
                            >
                                Next.js &lt;script&gt;
                            </button>
                            <button
                                type="button"
                                className={`${styles.formatBtn} ${format === 'html' ? styles.formatBtnActive : ''}`}
                                onClick={() => setFormat('html')}
                            >
                                Standard HTML
                            </button>
                            <button
                                type="button"
                                className={`${styles.formatBtn} ${format === 'json' ? styles.formatBtnActive : ''}`}
                                onClick={() => setFormat('json')}
                            >
                                Raw JSON-LD
                            </button>
                        </div>

                        <div className={styles.copyActions}>
                            <button
                                type="button"
                                className={`${styles.copyBtn} ${copied ? styles.copyBtnSuccess : ''}`}
                                onClick={handleCopy}
                            >
                                {copied ? '✓ Copied!' : '📋 Copy Code'}
                            </button>
                            <button
                                type="button"
                                className={styles.downloadBtn}
                                onClick={handleDownload}
                                title="Download .jsonld file"
                            >
                                ⬇ Download
                            </button>
                        </div>
                    </div>

                    {/* Generated Code Window */}
                    <div className={styles.codeContainer}>
                        <pre>
                            <code>{generatedCode}</code>
                        </pre>
                    </div>

                    {/* Linter & Syntax Health Check */}
                    <div className={styles.validationCard}>
                        <div className={styles.validationHeader}>
                            <span className={`${styles.validationBadge} ${validationStatus.isValid ? styles.badgeValid : styles.badgeWarning}`}>
                                {validationStatus.isValid ? '✓ Schema.org Valid' : `⚠ ${validationStatus.passedCount}/${validationStatus.totalCount} Recommended Fields`}
                            </span>
                            <div className={styles.metricItem}>
                                Size: <span className={styles.metricValue}>{validationStatus.charCount} chars</span> (~{validationStatus.estimatedTokens} tokens)
                            </div>
                        </div>

                        <div className={styles.checklistGrid}>
                            {validationStatus.checks.map((c) => (
                                <div key={c.id} className={styles.checkItem}>
                                    <span className={c.valid ? styles.checkIconSuccess : styles.checkIconPending}>
                                        {c.valid ? '✓' : '○'}
                                    </span>
                                    <span>{c.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* External Testing Tools Link */}
                    <div className={styles.testButtonRow}>
                        <a
                            href="https://search.google.com/test/rich-results"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.testLink}
                        >
                            ↗ Validate on Google Rich Results Test
                        </a>
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                            Schema.org standard compliant
                        </span>
                    </div>
                </div>
            </div>

            {/* Educational Explainer Grid */}
            <section className={styles.explainerSection}>
                <h2 className={styles.explainerTitle}>Why Generative Engine Optimization (GEO) Matters</h2>
                <p className={styles.explainerSubtitle}>
                    Traditional SEO focuses on backlinks and keywords. GEO feeds LLM crawlers structured entity graphs so AI models can cite your product with complete accuracy.
                </p>

                <div className={styles.explainerGrid}>
                    <div className={styles.explainerCard}>
                        <div className={styles.explainerIcon}>🤖</div>
                        <h3 className={styles.explainerCardTitle}>Direct AI Model Citations</h3>
                        <p className={styles.explainerCardDesc}>
                            When users ask ChatGPT Search or Perplexity "What is the best tool for X?", LLM crawlers query high-confidence Schema.org <code>SoftwareApplication</code> graphs to summarize feature lists and pricing without hallucinating.
                        </p>
                    </div>

                    <div className={styles.explainerCard}>
                        <div className={styles.explainerIcon}>💬</div>
                        <h3 className={styles.explainerCardTitle}>Conversational Q&A Snippets</h3>
                        <p className={styles.explainerCardDesc}>
                            Embedding structured <code>FAQPage</code> markup ensures answers to security, refund policies, and API integrations appear as verbatim rich answers in Google AI Overviews and conversational summaries.
                        </p>
                    </div>

                    <div className={styles.explainerCard}>
                        <div className={styles.explainerIcon}>⚡</div>
                        <h3 className={styles.explainerCardTitle}>Zero Crawler Misinterpretation</h3>
                        <p className={styles.explainerCardDesc}>
                            JavaScript-heavy single-page applications often confuse web scrapers. Clean JSON-LD scripts are parsed instantly upon raw HTML delivery, guaranteeing 100% indexing fidelity.
                        </p>
                    </div>
                </div>
            </section>

            {/* Conversion Handoff Card */}
            <section className={styles.handoffCard}>
                <div className={styles.handoffGlow} />
                <h3 className={styles.handoffHeadline}>
                    Want instant indexing in our semantic AI search engine?
                </h3>
                <p className={styles.handoffDesc}>
                    Skip waiting months for organic search crawlers. High-value software products accepted into the LaunchXact Genesis Batch get indexed directly into The Tornado semantic engine and showcased to over 350,000 targeted enterprise buyers and tech adopters.
                </p>
                <div className={styles.handoffActions}>
                    <Link href="/#founder-form" className={styles.btnPrimary}>
                        Submit to LaunchXact for Semantic Indexing →
                    </Link>
                    <button
                        type="button"
                        onClick={handleCopy}
                        className={styles.btnSecondary}
                    >
                        {copied ? '✓ Schema Copied!' : '📋 Copy All-in-One GEO Bundle'}
                    </button>
                </div>
            </section>
        </div>
    );
}
