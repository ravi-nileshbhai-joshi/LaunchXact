'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import ToolShareCard from './ToolShareCard';
import ToolSocialProof from './ToolSocialProof';
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
    const [selectedIds, setSelectedIds] = useState(['vercel', 'supabase', 'clerk', 'resend', 'posthog', 'sentry']);
    const [mau, setMau] = useState(25000);

    const mauPresets = [2500, 5000, 10000, 25000, 50000];

    const toggleService = (id) => {
        if (selectedIds.includes(id)) {
            if (selectedIds.length > 1) {
                setSelectedIds(selectedIds.filter((item) => item !== id));
            }
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const applyPreset = (preset) => {
        setSelectedIds(preset.selected);
    };

    // Calculate dynamic metrics
    const calculations = useMemo(() => {
        const activeServices = SERVICES.filter((s) => selectedIds.includes(s.id));
        const currentBill = activeServices.reduce((sum, s) => sum + s.calculate(mau), 0);

        // Calculate founder hours spent on fragmented tooling & billing
        const adminHours = Number((Math.min(24, Math.max(4, activeServices.length * 2.2 + (mau / 5000)))).toFixed(1));

        // Forecast points for visual curve: 1k, 5k, 10k, 25k, 50k
        const curvePoints = [1000, 5000, 10000, 25000, 50000].map((ptsMau) => {
            const cost = activeServices.reduce((sum, s) => sum + s.calculate(ptsMau), 0);
            return { mau: ptsMau, cost };
        });

        // Inflection point: lowest MAU where monthly bill exceeds $150
        const inflectionPt = curvePoints.find((p) => p.cost > 150) || curvePoints[curvePoints.length - 1];

        const annualBill = currentBill * 12;

        return {
            activeServices,
            currentBill,
            annualBill,
            adminHours,
            curvePoints,
            inflectionPt,
        };
    }, [selectedIds, mau]);

    // Group services by category
    const categories = useMemo(() => {
        const cats = {};
        SERVICES.forEach((s) => {
            if (!cats[s.category]) cats[s.category] = [];
            cats[s.category].push(s);
        });
        return cats;
    }, []);

    // Smooth scroll to tool
    const scrollToTool = () => {
        const el = document.getElementById('tool-stage');
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    // SVG scaling curve calculation
    const maxCost = Math.max(...calculations.curvePoints.map((p) => p.cost), 300);
    const svgWidth = 400;
    const svgHeight = 160;
    const padding = 25;

    const chartPoints = calculations.curvePoints.map((p, idx) => {
        const x = padding + (idx / (calculations.curvePoints.length - 1)) * (svgWidth - padding * 2);
        const y = svgHeight - padding - (p.cost / maxCost) * (svgHeight - padding * 2);
        return { x, y, cost: p.cost, mau: p.mau };
    });

    const pathD = chartPoints.reduce((acc, pt, i) => {
        return i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
    }, '');

    const areaD = chartPoints.length > 0
        ? `${pathD} L ${chartPoints[chartPoints.length - 1].x} ${svgHeight - padding} L ${chartPoints[0].x} ${svgHeight - padding} Z`
        : '';

    // Social share copy
    const quoteText = `My Franken-Stack will cost $${calculations.currentBill.toLocaleString()}/month at ${mau.toLocaleString()} MAU across ${selectedIds.length} fragmented services. What's yours?`;
    const shareX = `My Franken-Stack will cost $${calculations.currentBill.toLocaleString()}/month at ${mau.toLocaleString()} MAU. What's yours?

→ Calculate it: https://www.launchxact.com/tools/franken-stack-cost-forecaster`;
    const redditTitle = `My indie SaaS Franken-Stack bill: $${calculations.currentBill.toLocaleString()}/mo at ${mau.toLocaleString()} MAU`;
    const redditText = `Stitched together ${selectedIds.length} cloud point solutions and forecasted my real bill:

• Scale: ${mau.toLocaleString()} Monthly Active Users
• Active Stack: ${calculations.activeServices.map(s => s.name).join(', ')}
• Current Monthly Cloud Bill: $${calculations.currentBill.toLocaleString()}/mo
• Annualized Infrastructure: $${calculations.annualBill.toLocaleString()}/year
• Founder DevOps Time: ~${calculations.adminHours} hrs/mo

Check what your stack costs at scale: https://www.launchxact.com/tools/franken-stack-cost-forecaster`;

    const copyText = `⚡ LaunchXact Franken-Stack Cost Forecast:
• MAU Scale: ${mau.toLocaleString()}
• Active Services (${selectedIds.length}): ${calculations.activeServices.map(s => s.name).join(', ')}
• Monthly Cloud Bill: $${calculations.currentBill.toLocaleString()}/mo ($${calculations.annualBill.toLocaleString()}/yr)
• Founder DevOps Burden: ~${calculations.adminHours} hrs/mo
Forecast your stack: https://www.launchxact.com/tools/franken-stack-cost-forecaster`;

    return (
        <div className={styles.container}>
            {/* =========================================================
                LAYER 1 — BIG PAINFUL PROBLEM
               ========================================================= */}
            <header className={styles.toolHeader}>
                <span className={styles.toolBadge}>✦ Layer 1 · Cloud Cost Audit</span>
                <h1 className={styles.toolTitle}>
                    The Hidden Tax of the <span className={styles.gradientAccent}>Franken-Stack</span>
                </h1>
                <p className={styles.painHookHero}>
                    Your cloud bill isn&apos;t $20/month.
                </p>
                <p className={styles.toolSubtitle}>
                    Indie hackers stitch together Vercel, Supabase, Clerk, Resend, and PostHog. At 5k–50k MAU, multiple subscription tiers trigger simultaneously. Forecast your real bill before scaling.
                </p>

                <div className={styles.heroActionHub}>
                    <div className={styles.heroButtonCluster}>
                        <button
                            type="button"
                            onClick={scrollToTool}
                            className={styles.heroPrimaryCta}
                            id="audit-cloud-stack-hero-btn"
                        >
                            <span className={styles.ctaIconBadge}>⚡</span>
                            <span>Forecast My Stack Overages ↓</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                applyPreset(PRESETS[1]);
                                scrollToTool();
                            }}
                            className={styles.heroSecondaryCta}
                            id="demo-stack-hero-btn"
                        >
                            <span>✨ Test 6-Tool Stack Demo</span>
                        </button>
                    </div>

                    <div className={styles.heroTrustStrip}>
                        <div className={styles.trustItem}>
                            <span className={styles.trustPulse} />
                            <span>Live pricing formulas</span>
                        </div>
                        <span className={styles.trustDivider}>•</span>
                        <div className={styles.trustItem}>
                            <span>12 Micro-SaaS services modeled</span>
                        </div>
                        <span className={styles.trustDivider}>•</span>
                        <div className={styles.trustItem}>
                            <span>100% Free · No sign-up required</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* =========================================================
                LAYER 2 — THE INTERACTIVE TOOL
               ========================================================= */}
            <div id="tool-stage" className={styles.simulatorGrid}>
                {/* Controls Card */}
                <div className={styles.controlsCard}>
                    <div className={styles.cardHeader}>
                        <h2 className={styles.cardTitle}>Assemble Your Current Stack</h2>
                        <p className={styles.cardDesc}>Select the cloud point-solutions powering your SaaS today.</p>
                    </div>

                    {/* Presets */}
                    <div className={styles.presetsRow}>
                        <span className={styles.presetLabel}>Quick Presets:</span>
                        {PRESETS.map((p) => {
                            const isPresetActive =
                                p.selected.length === selectedIds.length &&
                                p.selected.every((id) => selectedIds.includes(id));
                            return (
                                <button
                                    key={p.id}
                                    type="button"
                                    onClick={() => applyPreset(p)}
                                    className={`${styles.presetBtn} ${isPresetActive ? styles.presetBtnActive : ''}`}
                                >
                                    {p.name}
                                </button>
                            );
                        })}
                    </div>

                    {/* Category Service Selector */}
                    {Object.entries(categories).map(([catName, services]) => (
                        <div key={catName} className={styles.categoryBlock}>
                            <h3 className={styles.categoryTitle}>{catName}</h3>
                            <div className={styles.serviceGrid}>
                                {services.map((svc) => {
                                    const isSelected = selectedIds.includes(svc.id);
                                    return (
                                        <button
                                            key={svc.id}
                                            type="button"
                                            onClick={() => toggleService(svc.id)}
                                            className={`${styles.serviceTile} ${isSelected ? styles.serviceTileActive : ''}`}
                                        >
                                            <div className={styles.tileHeader}>
                                                <span className={styles.tileIcon}>{svc.icon}</span>
                                                <span className={styles.tileName}>{svc.name}</span>
                                                <span className={styles.tileCheck}>{isSelected ? '✓' : '+'}</span>
                                            </div>
                                            <div className={styles.tileDesc}>{svc.desc}</div>
                                            <div className={styles.tileCost}>
                                                ${svc.calculate(mau)}/mo at {mau >= 1000 ? `${mau / 1000}k` : mau} MAU
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Forecast & Results Card */}
                <div className={styles.resultsCard}>
                    {/* Scale Slider */}
                    <div className={styles.scaleControl}>
                        <div className={styles.scaleHeader}>
                            <label htmlFor="mau-slider" className={styles.scaleLabel}>
                                Active User Scale (Monthly Active Users)
                            </label>
                            <span className={styles.mauBadge}>{mau.toLocaleString()} MAU</span>
                        </div>
                        <input
                            id="mau-slider"
                            type="range"
                            min="1000"
                            max="50000"
                            step="1000"
                            value={mau}
                            onChange={(e) => setMau(Number(e.target.value))}
                            className={styles.rangeSlider}
                            aria-label="Monthly Active Users slider"
                        />
                        <div className={styles.mauPresets}>
                            {mauPresets.map((val) => (
                                <button
                                    key={val}
                                    type="button"
                                    onClick={() => setMau(val)}
                                    className={`${styles.mauPresetBtn} ${mau === val ? styles.mauPresetBtnActive : ''}`}
                                >
                                    {val >= 1000 ? `${val / 1000}k` : val}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* HUD Cards */}
                    <div className={styles.hudGrid}>
                        <div className={`${styles.hudCard} ${styles.hudCardAlert}`}>
                            <div className={styles.hudLabel}>Monthly Cloud Bill</div>
                            <div className={styles.hudValueAlert}>
                                ${calculations.currentBill.toLocaleString()}/mo
                            </div>
                            <div className={styles.hudSub}>
                                ${(calculations.annualBill).toLocaleString()}/year run-rate
                            </div>
                        </div>
                        <div className={styles.hudCard}>
                            <div className={styles.hudLabel}>DevOps & Billing Admin</div>
                            <div className={styles.hudValue}>
                                ~{calculations.adminHours} hrs/mo
                            </div>
                            <div className={styles.hudSub}>Across {selectedIds.length} billing portals</div>
                        </div>
                    </div>

                    {/* Exponential Scaling Graph */}
                    <div className={styles.chartContainer}>
                        <div className={styles.chartHeader}>
                            <span className={styles.chartTitle}>Cost Scaling Curve (1k to 50k MAU)</span>
                            <span className={styles.chartLegend}>Tier escalations preview</span>
                        </div>

                        <svg
                            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                            className={styles.chartSvg}
                            role="img"
                            aria-label="Cost Scaling Curve graph"
                        >
                            <line
                                x1={padding}
                                y1={svgHeight - padding}
                                x2={svgWidth - padding}
                                y2={svgHeight - padding}
                                stroke="#e2e8f0"
                                strokeWidth="1"
                            />

                            {chartPoints.length > 0 && <path d={areaD} className={styles.chartArea} />}
                            {chartPoints.length > 0 && <path d={pathD} className={styles.chartCurve} />}

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
                            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
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
                            <div className={styles.itemRow} style={{ borderTop: '2px solid #e2e8f0', paddingTop: '0.65rem', marginTop: '0.5rem' }}>
                                <span className={styles.itemLabel} style={{ fontWeight: 800, color: '#0f172a' }}>
                                    Total Fragmented Cloud Bill
                                </span>
                                <span className={styles.itemAmount} style={{ color: '#dc2626', fontSize: '1.1rem', fontWeight: 800 }}>
                                    ${calculations.currentBill}/mo
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* =========================================================
                LAYER 3 — THE "AHA!" MOMENT (Personalized Diagnosis)
               ========================================================= */}
            <section className={styles.ahaDiagnosisCard}>
                <div className={styles.ahaBadge}>✦ Layer 3 · Personalized Diagnosis</div>
                
                <h2 className={styles.ahaHeadline}>
                    Your Franken-Stack will cost ${calculations.currentBill.toLocaleString()}/month (${calculations.annualBill.toLocaleString()}/year) at {mau.toLocaleString()} MAU across {selectedIds.length} fragmented services.
                </h2>
                
                <p className={styles.ahaSubtext}>
                    You&apos;ll spend an estimated <strong>~{calculations.adminHours} founder-hours/month</strong> managing API keys, reconciling fragmented bills, and dodging surprise bandwidth overages.
                </p>

                <div className={styles.pivotDivider}>
                    <span className={styles.pivotQuestion}>What if you didn&apos;t have to?</span>
                </div>

                <p className={styles.ahaBridge}>
                    That&apos;s where <strong>LaunchXact</strong> enters. LaunchXact is being built to collapse this fragmented developer stack into one founder-first platform.
                </p>

                <div className={styles.ahaSolutionCard}>
                    <div className={styles.solutionHeader}>
                        <div className={styles.solutionBadge}>
                            <span className={styles.solutionBadgeIcon}>✦</span>
                            <span>The LaunchXact Alternative</span>
                        </div>
                        <div className={styles.savingsPill}>
                            Calculated Overhead: <strong>${calculations.currentBill.toLocaleString()}/mo</strong> + <strong>~{calculations.adminHours} hrs/mo DevOps tax</strong>
                        </div>
                    </div>

                    <div className={styles.comparisonGrid}>
                        <div className={styles.comparisonColPain}>
                            <div className={styles.comparisonColHeader}>
                                <span className={styles.colIcon}>❌</span>
                                <span className={styles.colTitle}>Your Fragmented Franken-Stack</span>
                            </div>
                            <ul className={styles.comparisonList}>
                                <li>
                                    <strong>{selectedIds.length} Separate Monthly Invoices:</strong> Disparate billing portals draining time and runway.
                                </li>
                                <li>
                                    <strong>Simultaneous Tier Cliff Jumps:</strong> Bandwidth, egress, and per-MAU penalties compound non-linearly.
                                </li>
                                <li>
                                    <strong>DevOps Maintenance Tax:</strong> ~{calculations.adminHours} hrs/month managing API keys, webhooks, and billing reconciliation.
                                </li>
                                <li>
                                    <strong>Zero Built-in Discovery:</strong> Building the stack doesn&apos;t bring paying customers to your SaaS.
                                </li>
                            </ul>
                        </div>

                        <div className={styles.comparisonColFix}>
                            <div className={styles.comparisonColHeader}>
                                <span className={styles.colIcon}>✅</span>
                                <span className={styles.colTitle}>The LaunchXact Genesis Model</span>
                            </div>
                            <ul className={styles.comparisonList}>
                                <li>
                                    <strong>0% Commission for 90 Days:</strong> Keep 100% of your MRR during the Genesis Launch.
                                </li>
                                <li>
                                    <strong>Native Merchant of Record:</strong> Eliminate standalone Stripe, sales tax, and EU VAT invoicing software.
                                </li>
                                <li>
                                    <strong>350k+ Buyer Reach:</strong> Direct distribution push across LinkedIn, 𝕏, Reddit, and active tech buyers.
                                </li>
                                <li>
                                    <strong>Permanent High-Authority Backlink:</strong> DoFollow SEO equity that drives organic discovery long after launch.
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className={styles.solutionActionArea}>
                        <div className={styles.solutionButtons}>
                            <Link href="/#founder-form" className={styles.solutionPrimaryBtn}>
                                <span>🚀 Apply to Genesis Batch with This Stack →</span>
                            </Link>
                            <Link href="/grade" className={styles.solutionSecondaryBtn}>
                                <span>⚡ Grade SaaS Viability First (Free AI Audit) →</span>
                            </Link>
                        </div>
                        <div className={styles.solutionGuarantees}>
                            <span>✓ Zero platform fees for 90 days</span>
                            <span>•</span>
                            <span>Keep 100% MRR</span>
                            <span>•</span>
                            <span>Strict 40-product curation</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* =========================================================
                LAYER 4 — THE "SHARE MY RESULT" VIRAL LOOP
               ========================================================= */}
            <ToolShareCard
                badge="Franken-Stack Cost Audit"
                statHighlight={`$${calculations.currentBill.toLocaleString()}/mo`}
                statLabel={`Cloud Bill at ${mau.toLocaleString()} MAU`}
                subMetrics={[
                    { label: 'Annual Cloud Cost', value: `$${calculations.annualBill.toLocaleString()}/yr` },
                    { label: 'Fragmented Tools', value: `${selectedIds.length} services` },
                    { label: 'DevOps Burden', value: `~${calculations.adminHours} hrs/mo` },
                    { label: 'Scale Horizon', value: `${mau.toLocaleString()} MAU` }
                ]}
                quote={quoteText}
                toolName="Franken-Stack Forecaster"
                toolUrl="https://www.launchxact.com/tools/franken-stack-cost-forecaster"
                shareTextX={shareX}
                shareTitleReddit={redditTitle}
                shareTextReddit={redditText}
                copySummaryText={copyText}
            />

            {/* Social Proof Telemetry & Testimonials */}
            <ToolSocialProof />

            {/* =========================================================
                LAYER 5 — GENESIS BATCH CONVERSION SUITE
               ========================================================= */}
            <section className={styles.handoffCard}>
                <div className={styles.handoffGlow} />
                <div className={styles.handoffMesh} />
                
                <div className={styles.handoffContent}>
                    <div className={styles.handoffBadge}>
                        <span className={styles.handoffBadgePulse} />
                        <span>🚀 Q1 2026 Genesis Cohort · Limited to 40 Curated Products</span>
                    </div>

                    <h2 className={styles.handoffHeadline}>
                        Stop duct-taping cloud infrastructure.<br />
                        <span className={styles.handoffGradientText}>Launch where active software buyers already are.</span>
                    </h2>

                    <p className={styles.handoffDesc}>
                        Instead of juggling 6 billing dashboards, unpredictable tier spikes, and zero organic distribution, launch your software in LaunchXact&apos;s curated marketplace. Get built-in monetization, tax compliance, and direct exposure to 350k+ founders and early adopters.
                    </p>

                    {/* 3 Value Pillars Grid */}
                    <div className={styles.handoffPillars}>
                        <div className={styles.pillarCard}>
                            <div className={styles.pillarIcon}>💳</div>
                            <div className={styles.pillarTitle}>0% Platform Fees</div>
                            <div className={styles.pillarDesc}>Keep 100% of your revenue for 90 days. Zero commission.</div>
                        </div>
                        <div className={styles.pillarCard}>
                            <div className={styles.pillarIcon}>🌍</div>
                            <div className={styles.pillarTitle}>Native MoR & Tax</div>
                            <div className={styles.pillarDesc}>Global sales tax, EU VAT OSS, and invoicing fully automated.</div>
                        </div>
                        <div className={styles.pillarCard}>
                            <div className={styles.pillarIcon}>📢</div>
                            <div className={styles.pillarTitle}>350k+ Distribution</div>
                            <div className={styles.pillarDesc}>Featured launch day debut across high-intent software buyers.</div>
                        </div>
                    </div>

                    {/* Designed CTA Buttons */}
                    <div className={styles.handoffActionCluster}>
                        <Link href="/#founder-form" className={styles.handoffPrimaryBtn}>
                            <span>🚀 Apply for Genesis Batch Selection →</span>
                        </Link>
                        <Link href="/grade" className={styles.handoffSecondaryBtn}>
                            <span>⚡ Test SaaS Readiness (Free AI Grader) →</span>
                        </Link>
                    </div>

                    <div className={styles.handoffTrustFooter}>
                        <div className={styles.trustFooterItem}>
                            <span>🔒 100% Free Application</span>
                        </div>
                        <span>•</span>
                        <div className={styles.trustFooterItem}>
                            <span>Zero Forced Lifetime Discounts</span>
                        </div>
                        <span>•</span>
                        <div className={styles.trustFooterItem}>
                            <span>Permanent High-Authority DoFollow Link</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Educational FAQ Section for SEO */}
            <section className={styles.faqSection}>
                <h2 className={styles.faqHeading}>Frequently Asked Questions About SaaS Stack Costs</h2>

                <div className={styles.faqItem}>
                    <h3 className={styles.faqQuestion}>What is the &quot;Franken-Stack&quot; problem in SaaS?</h3>
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
