'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import ToolShareCard from './ToolShareCard';
import Founding50FunnelBanner from './Founding50FunnelBanner';
import styles from './SaasPricingCalculator.module.css';

export default function SaasPricingCalculator() {
    // Inputs
    const [targetMrr, setTargetMrr] = useState(10000);
    const [arpu, setArpu] = useState(49);
    const [churnRate, setChurnRate] = useState(5);
    const [cac, setCac] = useState(120);
    const [margin, setMargin] = useState(85);
    const [copied, setCopied] = useState(false);

    // Computations
    const metrics = useMemo(() => {
        const mrr = Number(targetMrr) || 1000;
        const price = Number(arpu) || 10;
        const churn = Math.max(Number(churnRate) || 1, 0.5);
        const costAcq = Number(cac) || 0;
        const grossMarginPct = (Number(margin) || 80) / 100;

        // Required customers
        const requiredCustomers = Math.ceil(mrr / price);

        // Lifetime in months: 1 / (churn rate decimal)
        const lifetimeMonths = Math.round(1 / (churn / 100));

        // Customer Lifetime Value: ARPU * Lifetime * Gross Margin
        const ltv = Math.round(price * lifetimeMonths * grossMarginPct);

        // LTV:CAC ratio
        const ltvCacRatio = costAcq > 0 ? (ltv / costAcq).toFixed(1) : '∞';

        // Payback period (months to recover CAC from gross margin)
        const monthlyGrossProfit = price * grossMarginPct;
        const paybackMonths = monthlyGrossProfit > 0 && costAcq > 0
            ? (costAcq / monthlyGrossProfit).toFixed(1)
            : '0.0';

        // Annual Recurring Revenue
        const arr = mrr * 12;

        return {
            mrr,
            price,
            churn,
            costAcq,
            requiredCustomers,
            lifetimeMonths,
            ltv,
            ltvCacRatio: Number(ltvCacRatio) || 0,
            paybackMonths,
            arr,
        };
    }, [targetMrr, arpu, churnRate, cac, margin]);

    const ltvCacStatus = useMemo(() => {
        if (metrics.costAcq === 0) return { label: 'Organic / Zero CAC', color: '#065f46', bg: '#d1fae5' };
        if (metrics.ltvCacRatio >= 3.0) return { label: 'Healthy & Scale-Ready (≥ 3x)', color: '#065f46', bg: '#d1fae5' };
        if (metrics.ltvCacRatio >= 1.5) return { label: 'Viable but Fragile (1.5x - 3x)', color: '#92400e', bg: '#fef3c7' };
        return { label: 'Danger: Negative Unit Economics (< 1.5x)', color: '#991b1b', bg: '#fee2e2' };
    }, [metrics]);

    // Recommended 3-tier price points based on entered ARPU
    const tierPricing = useMemo(() => {
        const starter = Math.max(Math.round(arpu * 0.49), 9);
        const pro = arpu;
        const scale = Math.round(arpu * 2.8);
        return { starter, pro, scale };
    }, [arpu]);

    const copySummary = () => {
        const text = `SaaS Unit Economics Summary (LaunchXact Pricing Calculator):
- Target MRR: $${metrics.mrr.toLocaleString()} ($${metrics.arr.toLocaleString()} ARR)
- Blended ARPU: $${metrics.price}/mo
- Required Subscribers: ${metrics.requiredCustomers.toLocaleString()}
- Expected Lifetime: ${metrics.lifetimeMonths} months (${metrics.churn}% monthly churn)
- Estimated LTV: $${metrics.ltv.toLocaleString()}
- LTV:CAC Ratio: ${metrics.ltvCacRatio}x (Payback: ${metrics.paybackMonths} mo)
- Recommended Tiers: Starter ($${tierPricing.starter}/mo), Pro ($${tierPricing.pro}/mo), Scale ($${tierPricing.scale}/mo)`;

        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.badge}>
                    <span>💰 SaaS Economics Engine</span>
                </div>
                <h1 className={styles.title}>
                    SaaS Pricing & <span style={{ color: '#10b981' }}>Unit Economics Modeler</span>
                </h1>
                <p className={styles.subtitle}>
                    Model revenue targets, customer volume thresholds, churn sensitivity, and LTV:CAC ratios to design profitable multi-tier pricing structures before launching.
                </p>
            </header>

            <div className={styles.grid}>
                {/* Inputs Card */}
                <div className={styles.card}>
                    <h2 className={styles.cardTitle}>⚙️ Modeling Parameters</h2>

                    <div className={styles.inputGroup}>
                        <div className={styles.inputLabelRow}>
                            <span className={styles.inputLabel}>Target Monthly Revenue (MRR)</span>
                            <span className={styles.inputValueDisplay}>${targetMrr.toLocaleString()}</span>
                        </div>
                        <input
                            type="range"
                            min="1000"
                            max="50000"
                            step="1000"
                            value={targetMrr}
                            onChange={(e) => setTargetMrr(Number(e.target.value))}
                            className={styles.rangeInput}
                        />
                        <div className={styles.inputHelp}>Target ARR: ${(targetMrr * 12).toLocaleString()}</div>
                    </div>

                    <div className={styles.inputGroup}>
                        <div className={styles.inputLabelRow}>
                            <span className={styles.inputLabel}>Average Revenue Per User (ARPU)</span>
                            <span className={styles.inputValueDisplay}>${arpu}/mo</span>
                        </div>
                        <input
                            type="range"
                            min="9"
                            max="299"
                            step="5"
                            value={arpu}
                            onChange={(e) => setArpu(Number(e.target.value))}
                            className={styles.rangeInput}
                        />
                        <div className={styles.inputHelp}>Blended monthly subscription or usage price</div>
                    </div>

                    <div className={styles.inputGroup}>
                        <div className={styles.inputLabelRow}>
                            <span className={styles.inputLabel}>Monthly Churn Rate</span>
                            <span className={styles.inputValueDisplay}>{churnRate}%</span>
                        </div>
                        <input
                            type="range"
                            min="1"
                            max="15"
                            step="0.5"
                            value={churnRate}
                            onChange={(e) => setChurnRate(Number(e.target.value))}
                            className={styles.rangeInput}
                        />
                        <div className={styles.inputHelp}>Typical indie B2B SaaS benchmarks: 3% - 6%</div>
                    </div>

                    <div className={styles.inputGroup}>
                        <div className={styles.inputLabelRow}>
                            <span className={styles.inputLabel}>Customer Acquisition Cost (CAC)</span>
                            <span className={styles.inputValueDisplay}>${cac}</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="600"
                            step="10"
                            value={cac}
                            onChange={(e) => setCac(Number(e.target.value))}
                            className={styles.rangeInput}
                        />
                        <div className={styles.inputHelp}>Blended paid ads, affiliate, or tooling spend per buyer</div>
                    </div>

                    <div className={styles.inputGroup}>
                        <div className={styles.inputLabelRow}>
                            <span className={styles.inputLabel}>Estimated Gross Margin %</span>
                            <span className={styles.inputValueDisplay}>{margin}%</span>
                        </div>
                        <input
                            type="range"
                            min="50"
                            max="95"
                            step="5"
                            value={margin}
                            onChange={(e) => setMargin(Number(e.target.value))}
                            className={styles.rangeInput}
                        />
                        <div className={styles.inputHelp}>After AI inference, cloud hosting, and payment fees</div>
                    </div>
                </div>

                {/* Outputs Card */}
                <div className={styles.card}>
                    <h2 className={styles.cardTitle}>📊 Unit Economics & Scale Reality</h2>

                    <div className={styles.ratioBanner}>
                        <div>
                            <div className={styles.ratioTitle}>LTV : CAC Health Ratio</div>
                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                                Benchmark: ≥ 3.0x required for venture or self-sustaining scale
                            </div>
                        </div>
                        <span
                            className={styles.ratioBadge}
                            style={{ background: ltvCacStatus.bg, color: ltvCacStatus.color, fontWeight: 800 }}
                        >
                            {metrics.costAcq > 0 ? `${metrics.ltvCacRatio}x · ` : ''}{ltvCacStatus.label}
                        </span>
                    </div>

                    <div className={styles.kpiGrid}>
                        <div className={styles.kpiCard}>
                            <span className={styles.kpiLabel}>Required Customers</span>
                            <span className={styles.kpiValue} style={{ color: '#2563eb' }}>
                                {metrics.requiredCustomers.toLocaleString()}
                            </span>
                            <span className={styles.kpiSub}>Active paying subscribers</span>
                        </div>

                        <div className={styles.kpiCard}>
                            <span className={styles.kpiLabel}>Customer Lifetime</span>
                            <span className={styles.kpiValue} style={{ color: '#7c3aed' }}>
                                {metrics.lifetimeMonths} mo
                            </span>
                            <span className={styles.kpiSub}>Avg duration before churn</span>
                        </div>

                        <div className={styles.kpiCard}>
                            <span className={styles.kpiLabel}>Customer LTV</span>
                            <span className={styles.kpiValue} style={{ color: '#059669' }}>
                                ${metrics.ltv.toLocaleString()}
                            </span>
                            <span className={styles.kpiSub}>Gross margin adjusted</span>
                        </div>

                        <div className={styles.kpiCard}>
                            <span className={styles.kpiLabel}>CAC Payback Period</span>
                            <span className={styles.kpiValue} style={{ color: '#d97706' }}>
                                {metrics.paybackMonths} mo
                            </span>
                            <span className={styles.kpiSub}>Months to recover CAC</span>
                        </div>
                    </div>

                    <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <Link
                            href="/#founder-form?source=saas-pricing-calculator"
                            style={{
                                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                                color: '#ffffff',
                                padding: '0.65rem 1.25rem',
                                borderRadius: '0.6rem',
                                fontWeight: 700,
                                fontSize: '0.88rem',
                                textDecoration: 'none',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)'
                            }}
                        >
                            🚀 Apply for Founding 50 →
                        </Link>
                        <button
                            onClick={copySummary}
                            style={{
                                background: '#10b981',
                                border: 'none',
                                color: '#0f172a',
                                padding: '0.65rem 1.25rem',
                                borderRadius: '0.6rem',
                                fontWeight: 700,
                                fontSize: '0.88rem',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            {copied ? '✓ Copied Model Summary!' : '📋 Copy Model Summary'}
                        </button>
                        <Link
                            href="/tools/true-cost-of-payments"
                            style={{
                                background: '#ffffff',
                                border: '1.5px solid #e2e8f0',
                                color: '#334155',
                                padding: '0.65rem 1.25rem',
                                borderRadius: '0.6rem',
                                fontWeight: 700,
                                fontSize: '0.88rem',
                                textDecoration: 'none',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            Audit Payment Processing Fees →
                        </Link>
                    </div>
                </div>
            </div>

            {/* 3-Tier Pricing Model Suggestions */}
            <div className={styles.tiersSection}>
                <h2 className={styles.cardTitle}>📐 Suggested 3-Tier Pricing Architecture</h2>
                <p style={{ color: '#475569', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                    Based on your ${arpu}/mo target ARPU, here is an optimized three-tier pricing model engineered to steer buyers toward the high-margin Pro tier:
                </p>

                <div className={styles.tiersGrid}>
                    <div className={styles.tierCard}>
                        <div className={styles.tierName}>Starter / Indie</div>
                        <div className={styles.tierPrice}>${tierPricing.starter}<span className={styles.tierPeriod}>/mo</span></div>
                        <div className={styles.tierDesc}>For solo operators testing workflows. Anchors value and limits compute.</div>
                        <ul className={styles.tierFeatures}>
                            <li className={styles.tierFeatureItem}>✓ 1 User Seat</li>
                            <li className={styles.tierFeatureItem}>✓ Core functionality</li>
                            <li className={styles.tierFeatureItem}>✓ Standard community support</li>
                            <li className={styles.tierFeatureItem}>✓ 500 actions / mo limit</li>
                        </ul>
                    </div>

                    <div className={`${styles.tierCard} ${styles.tierCardPopular}`}>
                        <div className={styles.popularBadge}>POPULAR TIER</div>
                        <div className={styles.tierName}>Pro / Growth</div>
                        <div className={styles.tierPrice}>${tierPricing.pro}<span className={styles.tierPeriod}>/mo</span></div>
                        <div className={styles.tierDesc}>Your primary ARPU driver. Designed for small teams and power users.</div>
                        <ul className={styles.tierFeatures}>
                            <li className={styles.tierFeatureItem}>✓ Up to 5 Team Seats</li>
                            <li className={styles.tierFeatureItem}>✓ Priority AI reasoning queues</li>
                            <li className={styles.tierFeatureItem}>✓ Unlimited projects & history</li>
                            <li className={styles.tierFeatureItem}>✓ Priority email support</li>
                        </ul>
                    </div>

                    <div className={styles.tierCard}>
                        <div className={styles.tierName}>Scale / Enterprise</div>
                        <div className={styles.tierPrice}>${tierPricing.scale}<span className={styles.tierPeriod}>/mo</span></div>
                        <div className={styles.tierDesc}>High-margin capture for high-volume users requiring custom SLAs and webhooks.</div>
                        <ul className={styles.tierFeatures}>
                            <li className={styles.tierFeatureItem}>✓ Unlimited Team Seats</li>
                            <li className={styles.tierFeatureItem}>✓ Custom integrations & webhooks</li>
                            <li className={styles.tierFeatureItem}>✓ 99.9% SLA & Dedicated Slack</li>
                            <li className={styles.tierFeatureItem}>✓ Custom invoicing & MoR tax</li>
                        </ul>
                    </div>
                </div>
            </div>

            <Founding50FunnelBanner
                toolId="saas-pricing-calculator"
                toolName="SaaS Pricing & Economics Modeler"
                headline={
                    <>
                        Modeled your unit economics?{' '}
                        <span style={{
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            Keep 100% of your revenue. Zero listing fees.
                        </span>
                    </>
                }
                description="LaunchXact never takes a cut of your revenue for listing your product. Every submission is manually tested for market gap, alternatives, and real problem-solving utility."
                ctaText="Submit Product for Founding 50 Review →"
            />

            <ToolShareCard
                toolTitle="SaaS Pricing & Unit Economics Modeler"
                score={`$${metrics.mrr.toLocaleString()} MRR · ${metrics.requiredCustomers} Users`}
                shareText={`I just modeled my SaaS pricing economics on @LaunchXact: to hit $${metrics.mrr.toLocaleString()} MRR at $${arpu}/mo, I need ${metrics.requiredCustomers} users. Calculate yours for free:`}
                shareUrl="https://www.launchxact.com/tools/saas-pricing-calculator"
            />
        </div>
    );
}
