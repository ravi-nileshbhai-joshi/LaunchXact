'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import styles from './FrankenStackForecaster.module.css';

// Catalog of stack components
const SERVICES = [
    // Hosting
    {
        id: 'vercel',
        name: 'Vercel Pro',
        category: 'Hosting & Edge',
        basePrice: 20,
        desc: '$20/seat + bandwidth overages',
        icon: '▲',
        calculate: (mau) => 20 + (mau > 15000 ? Math.round(((mau - 15000) / 5000) * 15) : 0),
    },
    {
        id: 'render',
        name: 'Render / AWS',
        category: 'Hosting & Edge',
        basePrice: 25,
        desc: '$25/mo base + CPU scaling',
        icon: '☁️',
        calculate: (mau) => 25 + Math.round((mau / 10000) * 30),
    },

    // Database
    {
        id: 'supabase',
        name: 'Supabase Pro',
        category: 'Database & Storage',
        basePrice: 25,
        desc: '$25/mo + compute add-ons & egress',
        icon: '⚡',
        calculate: (mau) => 25 + (mau > 10000 ? 25 : 0) + (mau > 30000 ? 50 : 0),
    },
    {
        id: 'neon',
        name: 'Neon Postgres',
        category: 'Database & Storage',
        basePrice: 19,
        desc: '$19/mo base + compute hours',
        icon: '🐘',
        calculate: (mau) => 19 + Math.round((mau / 12000) * 20),
    },

    // Authentication
    {
        id: 'clerk',
        name: 'Clerk Auth',
        category: 'Authentication',
        basePrice: 25,
        desc: '$25/mo + $0.02/MAU over 10k',
        icon: '🔐',
        calculate: (mau) => 25 + (mau > 10000 ? Math.round((mau - 10000) * 0.02) : 0),
    },
    {
        id: 'auth0',
        name: 'Auth0 B2C',
        category: 'Authentication',
        basePrice: 23,
        desc: '$23/mo base + $0.07/MAU over 7.5k',
        icon: '🛡️',
        calculate: (mau) => 23 + (mau > 7500 ? Math.round((mau - 7500) * 0.07) : 0),
    },

    // Email
    {
        id: 'resend',
        name: 'Resend Pro',
        category: 'Transactional Email',
        basePrice: 20,
        desc: '$20/mo (up to 50k emails)',
        icon: '✉️',
        calculate: (mau) => 20 + (mau > 25000 ? 30 : 0),
    },
    {
        id: 'postmark',
        name: 'Postmark',
        category: 'Transactional Email',
        basePrice: 15,
        desc: '$15/mo base + $1.25/1k sends',
        icon: '📬',
        calculate: (mau) => 15 + Math.round((mau / 1000) * 1.25),
    },

    // Analytics
    {
        id: 'posthog',
        name: 'PostHog Cloud',
        category: 'Product Analytics',
        basePrice: 0,
        desc: 'Free to 1k, tiered by events',
        icon: '🦔',
        calculate: (mau) => (mau < 1500 ? 0 : mau < 8000 ? 45 : mau < 20000 ? 120 : 260),
    },
    {
        id: 'mixpanel',
        name: 'Mixpanel Growth',
        category: 'Product Analytics',
        basePrice: 28,
        desc: '$28/mo base + MTU overages',
        icon: '📊',
        calculate: (mau) => 28 + (mau > 5000 ? Math.round(((mau - 5000) / 2000) * 15) : 0),
    },

    // Monitoring
    {
        id: 'sentry',
        name: 'Sentry Team',
        category: 'Error Monitoring',
        basePrice: 26,
        desc: '$26/mo base + error quotas',
        icon: '🚨',
        calculate: (mau) => 26 + (mau > 15000 ? 30 : 0),
    },
    {
        id: 'datadog',
        name: 'Datadog Pro',
        category: 'Error Monitoring',
        basePrice: 35,
        desc: '$35/mo base monitoring',
        icon: '🐶',
        calculate: (mau) => 35 + (mau > 10000 ? 40 : 0),
    },
];

// Presets for quick selection
const PRESETS = [
    {
        id: 'standard',
        name: 'Standard Indie Stack',
        selected: ['vercel', 'supabase', 'clerk', 'resend'],
    },
    {
        id: 'full',
        name: 'Full Observability Stack',
        selected: ['vercel', 'supabase', 'clerk', 'resend', 'posthog', 'sentry'],
    },
    {
        id: 'lean',
        name: 'Lean Bootstrapper',
        selected: ['vercel', 'supabase'],
    },
];

export default function FrankenStackForecaster() {
    const [selectedIds, setSelectedIds] = useState(['vercel', 'supabase', 'clerk', 'resend']);
    const [mau, setMau] = useState(5000);
    const [copied, setCopied] = useState(false);

    // Toggle component in stack
    const toggleService = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    // Apply preset
    const applyPreset = (preset) => {
        setSelectedIds(preset.selected);
    };

    // Calculation Engine
    const calculations = useMemo(() => {
        const activeServices = SERVICES.filter((s) => selectedIds.includes(s.id));
        const currentBill = activeServices.reduce((sum, s) => sum + s.calculate(mau), 0);

        // DevOps friction metric (~1.5 hours per dashboard/API key per month)
        const devOpsHours = Math.round(activeServices.length * 1.5);
        const devOpsCost = devOpsHours * 60; // $60/hr engineering value

        const totalMonthlyDrain = currentBill + devOpsCost;
        const annualDrain = totalMonthlyDrain * 12;

        // Scaling trajectory points for SVG chart
        const scaleSteps = [500, 2500, 5000, 10000, 20000, 35000, 50000];
        const trajectory = scaleSteps.map((stepMau) => {
            const cost = activeServices.reduce((sum, s) => sum + s.calculate(stepMau), 0);
            return { mau: stepMau, cost };
        });

        const maxTrajectoryCost = Math.max(...trajectory.map((t) => t.cost), 300);

        return {
            activeServices,
            currentBill,
            devOpsHours,
            devOpsCost,
            totalMonthlyDrain,
            annualDrain,
            trajectory,
            maxTrajectoryCost,
        };
    }, [selectedIds, mau]);

    // Copy breakdown
    const handleCopy = () => {
        const serviceNames = calculations.activeServices.map((s) => s.name).join(', ');
        const text = `⚡ LaunchXact Franken-Stack Cost Forecast:
Active Stack: ${serviceNames || 'None'}
Projected Scale: ${mau.toLocaleString()} MAU
----------------------------------------
💸 Cloud Invoices: $${calculations.currentBill}/month
⏱️ DevOps Time Burned: ~${calculations.devOpsHours} hrs/month ($${calculations.devOpsCost} engineering value)
🚨 Total Monthly Drain: $${calculations.totalMonthlyDrain}/mo ($${calculations.annualDrain.toLocaleString()}/year)
----------------------------------------
Eliminate the DevOps bloat with LaunchXact: https://www.launchxact.com/tools/franken-stack-cost-forecaster`;

        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 3000);
        });
    };

    // SVG coordinate mapping for growth chart (380x160 canvas)
    const svgWidth = 380;
    const svgHeight = 160;
    const padding = 25;

    const chartPoints = calculations.trajectory.map((pt, idx) => {
        const x = padding + (idx / (calculations.trajectory.length - 1)) * (svgWidth - padding * 2);
        const y = svgHeight - padding - (pt.cost / calculations.maxTrajectoryCost) * (svgHeight - padding * 2);
        return { x, y, cost: pt.cost, mau: pt.mau };
    });

    const pathD = chartPoints.reduce((acc, pt, i) => {
        return i === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`;
    }, '');

    const areaD = `${pathD} L ${chartPoints[chartPoints.length - 1].x},${svgHeight - padding} L ${chartPoints[0].x},${svgHeight - padding} Z`;

    return (
        <div className={styles.container}>
            {/* Header */}
            <header className={styles.toolHeader}>
                <span className={styles.toolBadge}>✦ Interactive Architecture Forecaster</span>
                <h1 className={styles.toolTitle}>
                    The <span className={styles.gradientAccent}>"Franken-Stack"</span> Cost Forecaster
                </h1>
                <p className={styles.toolSubtitle}>
                    Indie hackers piece together 5+ separate cloud services, only to face unpredictable "bill shock" when traffic scales. Select your stack components and forecast your infrastructure bill.
                </p>
            </header>

            {/* Presets Bar */}
            <div className={styles.presetsBar}>
                <span className={styles.presetsLabel}>Quick Presets:</span>
                {PRESETS.map((p) => {
                    const isActive =
                        p.selected.length === selectedIds.length &&
                        p.selected.every((id) => selectedIds.includes(id));
                    return (
                        <button
                            key={p.id}
                            type="button"
                            onClick={() => applyPreset(p)}
                            className={`${styles.presetChip} ${isActive ? styles.presetChipActive : ''}`}
                        >
                            {p.name}
                        </button>
                    );
                })}
            </div>

            {/* Main Simulator Grid */}
            <div className={styles.simulatorGrid}>
                {/* Left: Component Grid & MAU Slider */}
                <div>
                    {/* MAU Slider Card */}
                    <div className={styles.sliderCard}>
                        <div className={styles.labelRow}>
                            <label htmlFor="mau-slider" className={styles.controlLabel}>
                                Projected Monthly Active Users (MAU)
                            </label>
                            <div className={styles.inputBadge}>
                                <span className={styles.inputBadgeText}>{mau.toLocaleString()}</span>
                                <span className={styles.inputBadgeLabel}>MAU</span>
                            </div>
                        </div>
                        <div className={styles.sliderWrap}>
                            <input
                                id="mau-slider"
                                type="range"
                                min="500"
                                max="50000"
                                step="500"
                                value={mau}
                                onChange={(e) => setMau(Number(e.target.value))}
                                className={styles.rangeSlider}
                                aria-label="Monthly Active Users Slider"
                            />
                        </div>
                        <div className={styles.mauPresets}>
                            {[1000, 2500, 5000, 10000, 25000, 50000].map((val) => (
                                <button
                                    key={val}
                                    type="button"
                                    onClick={() => setMau(val)}
                                    className={`${styles.mauPresetBtn} ${mau === val ? styles.mauPresetActive : ''}`}
                                >
                                    {val >= 1000 ? `${val / 1000}k` : val}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Component Grid Card */}
                    <div className={styles.componentsCard}>
                        <div className={styles.cardHeader}>
                            <h2 className={styles.cardTitle}>Choose Your Stack Components</h2>
                            <p className={styles.cardDesc}>
                                Click to toggle each service on or off. Watch how multiple subscriptions compound.
                            </p>
                        </div>

                        {/* Group by Categories */}
                        {['Hosting & Edge', 'Database & Storage', 'Authentication', 'Transactional Email', 'Product Analytics', 'Error Monitoring'].map(
                            (category) => (
                                <div key={category} className={styles.categoryBlock}>
                                    <div className={styles.categoryTitle}>{category}</div>
                                    <div className={styles.serviceGrid}>
                                        {SERVICES.filter((s) => s.category === category).map((svc) => {
                                            const isSelected = selectedIds.includes(svc.id);
                                            return (
                                                <button
                                                    key={svc.id}
                                                    type="button"
                                                    onClick={() => toggleService(svc.id)}
                                                    className={`${styles.serviceToggle} ${
                                                        isSelected ? styles.serviceToggleActive : ''
                                                    }`}
                                                >
                                                    <div className={styles.serviceTop}>
                                                        <span className={styles.serviceName}>
                                                            {svc.icon} {svc.name}
                                                        </span>
                                                        <span className={styles.checkIndicator}>
                                                            {isSelected ? '✓' : ''}
                                                        </span>
                                                    </div>
                                                    <div className={styles.servicePricing}>
                                                        {svc.desc}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                </div>

                {/* Right: Results & Trajectory Column */}
                <div className={styles.resultsCol}>
                    {/* HUD Cards */}
                    <div className={styles.hudGrid}>
                        <div className={`${styles.hudCard} ${styles.hudCardHighlight}`}>
                            <div className={styles.hudLabel}>Monthly Cloud Bill</div>
                            <div className={`${styles.hudValue} ${styles.hudValueBill}`}>
                                ${calculations.currentBill}
                                <span style={{ fontSize: '0.9rem', fontWeight: 500, color: '#64748b' }}>/mo</span>
                            </div>
                        </div>
                        <div className={styles.hudCard}>
                            <div className={styles.hudLabel}>DevOps Time Lost</div>
                            <div className={`${styles.hudValue} ${styles.hudValueHours}`}>
                                ~{calculations.devOpsHours} hrs
                                <span style={{ fontSize: '0.9rem', fontWeight: 500, color: '#64748b' }}>/mo</span>
                            </div>
                        </div>
                    </div>

                    {/* Cost Scaling Curve Chart */}
                    <div className={styles.chartContainer}>
                        <div className={styles.chartHeader}>
                            <div>
                                <h3 className={styles.chartTitle}>Scaling Cost Trajectory</h3>
                                <p className={styles.chartSubtitle}>Cost projection from 500 to 50k MAU</p>
                            </div>
                            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#dc2626', background: '#fee2e2', padding: '0.2rem 0.5rem', borderRadius: '0.25rem' }}>
                                Bill Shock Risk
                            </span>
                        </div>

                        <svg className={styles.chartSvg} viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
                            <defs>
                                <linearGradient id="costGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#ef4444" stopOpacity="0.25" />
                                    <stop offset="100%" stopColor="#ef4444" stopOpacity="0.0" />
                                </linearGradient>
                            </defs>

                            {/* Axis Guides */}
                            <line
                                x1={padding}
                                y1={svgHeight - padding}
                                x2={svgWidth - padding}
                                y2={svgHeight - padding}
                                stroke="#e2e8f0"
                                strokeWidth="1"
                            />

                            {/* Area Fill */}
                            {chartPoints.length > 0 && <path d={areaD} className={styles.chartArea} />}

                            {/* Curve Line */}
                            {chartPoints.length > 0 && <path d={pathD} className={styles.chartCurve} />}

                            {/* Data Points */}
                            {chartPoints.map((pt, i) => (
                                <g key={i}>
                                    <circle cx={pt.x} cy={pt.y} r="4" className={styles.chartPoint} />
                                    <text x={pt.x} y={svgHeight - 8} className={styles.chartAxisText}>
                                        {pt.mau >= 1000 ? `${pt.mau / 1000}k` : pt.mau}
                                    </text>
                                </g>
                            ))}
                        </svg>

                        {/* Itemized Services Breakdown */}
                        <div className={styles.itemList}>
                            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                                Active Invoices at {mau.toLocaleString()} MAU
                            </div>
                            {calculations.activeServices.map((svc) => (
                                <div key={svc.id} className={styles.itemRow}>
                                    <span className={styles.itemLabel}>
                                        {svc.icon} {svc.name}
                                    </span>
                                    <span className={styles.itemAmount}>
                                        ${svc.calculate(mau)}/mo
                                    </span>
                                </div>
                            ))}
                            <div className={styles.itemRow} style={{ borderTop: '1px solid #e2e8f0', paddingTop: '0.5rem', marginTop: '0.25rem' }}>
                                <span className={styles.itemLabel} style={{ fontWeight: 700, color: '#0f172a' }}>
                                    Total Cloud Subscriptions
                                </span>
                                <span className={styles.itemAmount} style={{ color: '#dc2626', fontSize: '1rem' }}>
                                    ${calculations.currentBill}/mo
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Conversion Handoff Card */}
            <section className={styles.handoffCard}>
                <div className={styles.handoffGlow} />
                <h3 className={styles.handoffHeadline}>
                    Cut the DevOps bloat and unpredictable bills.
                </h3>
                <p className={styles.handoffDesc}>
                    Get zero-config, unified hosting organically built into LaunchXact. Avoid managing 6 separate billing portals, API keys, and SDK migrations. Secure your Genesis Batch invite today.
                </p>
                <div className={styles.handoffActions}>
                    <Link href="/#founder-form" className={styles.btnPrimary}>
                        Apply to Genesis Batch →
                    </Link>
                    <button
                        type="button"
                        onClick={handleCopy}
                        className={styles.btnSecondary}
                    >
                        {copied ? '✓ Architecture Copied!' : 'Copy Architecture Forecast'}
                    </button>
                </div>
            </section>

            {/* Educational FAQ Section for SEO */}
            <section className={styles.faqSection}>
                <h2 className={styles.faqHeading}>Frequently Asked Questions About SaaS Stack Costs</h2>

                <div className={styles.faqItem}>
                    <h3 className={styles.faqQuestion}>What is the "Franken-Stack" problem in SaaS?</h3>
                    <p className={styles.faqAnswer}>
                        The Franken-Stack problem occurs when an indie hacker or micro-SaaS builder stitches together independent point solutions for hosting (Vercel), databases (Supabase), authentication (Clerk), email (Resend), and analytics (PostHog). While each tool has a generous free tier, as soon as user volume scales past 5k to 10k MAU, multiple subscription tiers trigger simultaneously, causing cloud bills to double or triple unexpectedly.
                    </p>
                </div>

                <div className={styles.faqItem}>
                    <h3 className={styles.faqQuestion}>Why does Clerk authentication get expensive at scale?</h3>
                    <p className={styles.faqAnswer}>
                        Clerk is widely loved for its developer experience, but after their free tier ends (typically at 10,000 Monthly Active Users), each additional active user costs $0.02. For a consumer SaaS or product with high signup volume, reaching 30,000 MAU adds $400/month just for authentication, on top of base plan fees.
                    </p>
                </div>

                <div className={styles.faqItem}>
                    <h3 className={styles.faqQuestion}>How does LaunchXact help founders avoid infrastructure bloat?</h3>
                    <p className={styles.faqAnswer}>
                        LaunchXact is designed to be an all-in-one distribution and monetization engine. By providing native Merchant of Record capabilities, automated SEO indexing, and unified discoverability, founders can focus on their core product rather than wasting 10+ hours a month managing fragmented third-party developer platforms.
                    </p>
                </div>
            </section>
        </div>
    );
}
