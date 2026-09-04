'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import styles from './PaymentCostSimulator.module.css';

export default function PaymentCostSimulator() {
    // Inputs
    const [revenue, setRevenue] = useState(10000);
    const [intPct, setIntPct] = useState(20);
    const [countries, setCountries] = useState(5);
    const [showBreakdown, setShowBreakdown] = useState(false);
    const [copied, setCopied] = useState(false);

    // Revenue presets
    const presets = [2500, 5000, 10000, 25000, 50000];

    // Mathematical Engine (Exact match to Gemini Visual Link)
    const metrics = useMemo(() => {
        const rev = Number(revenue) || 0;
        const intl = Number(intPct) || 0;
        const cnt = Number(countries) || 1;

        // Transaction volume model
        const avgTx = 50;
        const txCount = rev > 0 ? rev / avgTx : 0;
        const baseGatewayFees = (rev * 0.029) + (txCount * 0.30);

        // Manual compliance overhead
        const taxFilingCost = cnt * 50; // Invoicing software, VAT OSS, local filing tools
        const fxIntlRiskCost = (intl / 100) * rev * 0.02; // Cross-border FX fee
        const hours = cnt * 2; // Administrative time wasted
        const adminLaborCost = hours * 50; // Founder labor value ($50/hr)

        const manualTotal = baseGatewayFees + taxFilingCost + fxIntlRiskCost + adminLaborCost;
        const morTotal = rev * 0.05; // LaunchXact 5% flat all-in MoR

        const hoursSaved = hours;
        const monthlySavings = manualTotal - morTotal;
        const annualSavings = monthlySavings * 12;

        return {
            baseGatewayFees,
            taxFilingCost,
            fxIntlRiskCost,
            adminLaborCost,
            hours,
            manualTotal,
            morTotal,
            hoursSaved,
            monthlySavings,
            annualSavings,
            txCount
        };
    }, [revenue, intPct, countries]);

    // Bar chart scale calculation
    const maxBarValue = Math.max(metrics.manualTotal, metrics.morTotal, 1);
    const manualWidthPct = Math.min(100, Math.max(8, (metrics.manualTotal / maxBarValue) * 100));
    const morWidthPct = Math.min(100, Math.max(8, (metrics.morTotal / maxBarValue) * 100));

    // Share / Copy handler
    const handleCopySummary = () => {
        const text = `💸 LaunchXact Payment Cost Simulator:
Monthly Revenue: $${revenue.toLocaleString()}
Countries Sold To: ${countries} (${intPct}% International)
----------------------------------------
❌ Manual Gateway + Tax Tools: $${Math.round(metrics.manualTotal).toLocaleString()}/mo (${metrics.hours} hrs lost)
✅ LaunchXact Native MoR (5%): $${Math.round(metrics.morTotal).toLocaleString()}/mo (0 hrs lost)
----------------------------------------
🎉 Annual Savings: $${Math.max(0, Math.round(metrics.annualSavings)).toLocaleString()} + ${Math.round(metrics.hoursSaved * 12)} hrs reclaimed/yr!
Calculate yours at: https://www.launchxact.com/tools/true-cost-of-payments`;

        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 3000);
        });
    };

    return (
        <div className={styles.container}>
            {/* Header */}
            <header className={styles.toolHeader}>
                <span className={styles.toolBadge}>✦ Interactive Simulator</span>
                <h1 className={styles.toolTitle}>
                    The True Cost of <span className={styles.gradientAccent}>Payments & Global Tax</span>
                </h1>
                <p className={styles.toolSubtitle}>
                    Founders drastically underestimate the headache of global VAT/GST compliance, foreign exchange fees, and lost hours when using raw payment gateways. Compare raw gateway costs against a flat Merchant of Record (MoR).
                </p>
            </header>

            {/* Main Grid: Controls + Results */}
            <div className={styles.simulatorGrid}>
                {/* Controls Card */}
                <div className={styles.controlsCard}>
                    <div className={styles.cardHeader}>
                        <h2 className={styles.cardTitle}>Your SaaS Parameters</h2>
                        <p className={styles.cardDesc}>Adjust the sliders to reflect your current or projected metrics.</p>
                    </div>

                    {/* Parameter 1: Revenue */}
                    <div className={styles.controlGroup}>
                        <div className={styles.labelRow}>
                            <label htmlFor="revenue-slider" className={styles.controlLabel}>
                                Monthly Revenue (MRR)
                            </label>
                            <div className={styles.inputBadge}>
                                <span className={styles.inputPrefix}>$</span>
                                <input
                                    id="revenue-input"
                                    type="number"
                                    min="0"
                                    max="100000"
                                    step="500"
                                    value={revenue}
                                    onChange={(e) => setRevenue(Math.max(0, Number(e.target.value)))}
                                    className={styles.numberInput}
                                    aria-label="Monthly Revenue in dollars"
                                />
                            </div>
                        </div>
                        <div className={styles.sliderWrap}>
                            <input
                                id="revenue-slider"
                                type="range"
                                min="0"
                                max="100000"
                                step="500"
                                value={revenue}
                                onChange={(e) => setRevenue(Number(e.target.value))}
                                className={styles.rangeSlider}
                                aria-label="Monthly Revenue slider"
                            />
                        </div>
                        <div className={styles.presetsRow}>
                            {presets.map((p) => (
                                <button
                                    key={p}
                                    type="button"
                                    onClick={() => setRevenue(p)}
                                    className={`${styles.presetBtn} ${revenue === p ? styles.presetBtnActive : ''}`}
                                >
                                    ${(p / 1000).toFixed(p % 1000 === 0 ? 0 : 1)}k
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Parameter 2: International % */}
                    <div className={styles.controlGroup}>
                        <div className={styles.labelRow}>
                            <label htmlFor="intl-slider" className={styles.controlLabel}>
                                International Customers (%)
                            </label>
                            <div className={styles.inputBadge}>
                                <input
                                    id="intl-input"
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="1"
                                    value={intPct}
                                    onChange={(e) => setIntPct(Math.min(100, Math.max(0, Number(e.target.value))))}
                                    className={styles.numberInput}
                                    aria-label="International customers percentage"
                                />
                                <span className={styles.inputPrefix}>%</span>
                            </div>
                        </div>
                        <div className={styles.sliderWrap}>
                            <input
                                id="intl-slider"
                                type="range"
                                min="0"
                                max="100"
                                step="1"
                                value={intPct}
                                onChange={(e) => setIntPct(Number(e.target.value))}
                                className={styles.rangeSlider}
                                aria-label="International customers percentage slider"
                            />
                        </div>
                    </div>

                    {/* Parameter 3: Countries Sold To */}
                    <div className={styles.controlGroup}>
                        <div className={styles.labelRow}>
                            <label htmlFor="countries-slider" className={styles.controlLabel}>
                                Countries Sold To (Tax Jurisdictions)
                            </label>
                            <div className={styles.inputBadge}>
                                <input
                                    id="countries-input"
                                    type="number"
                                    min="1"
                                    max="50"
                                    step="1"
                                    value={countries}
                                    onChange={(e) => setCountries(Math.min(50, Math.max(1, Number(e.target.value))))}
                                    className={styles.numberInput}
                                    aria-label="Countries sold to"
                                />
                            </div>
                        </div>
                        <div className={styles.sliderWrap}>
                            <input
                                id="countries-slider"
                                type="range"
                                min="1"
                                max="50"
                                step="1"
                                value={countries}
                                onChange={(e) => setCountries(Number(e.target.value))}
                                className={styles.rangeSlider}
                                aria-label="Countries sold to slider"
                            />
                        </div>
                    </div>
                </div>

                {/* Results Card */}
                <div className={styles.resultsCard}>
                    {/* HUD Metrics */}
                    <div className={styles.hudGrid}>
                        <div className={`${styles.hudCard} ${styles.hudCardHighlight}`}>
                            <div className={styles.hudLabel}>Admin Hours Saved</div>
                            <div className={`${styles.hudValue} ${styles.hudValueHours}`}>
                                {Math.round(metrics.hoursSaved)} hrs/mo
                            </div>
                        </div>
                        <div className={styles.hudCard}>
                            <div className={styles.hudLabel}>Annual Cost Savings</div>
                            <div className={`${styles.hudValue} ${styles.hudValueSavings}`}>
                                ${Math.max(0, Math.round(metrics.annualSavings)).toLocaleString()}
                            </div>
                        </div>
                    </div>

                    {/* Visual Comparison Chart */}
                    <div className={styles.chartContainer}>
                        <div className={styles.chartTitleRow}>
                            <span className={styles.chartHeading}>Estimated Monthly Burden</span>
                            <span className={styles.chartScale}>All-inclusive cash + labor</span>
                        </div>

                        <div className={styles.barComparison}>
                            {/* Bar 1: Manual Setup */}
                            <div className={styles.barRow}>
                                <div className={styles.barLabelArea}>
                                    <span className={styles.barName}>
                                        Manual Gateway Setup
                                        <span className={styles.barTagManual}>High Overhead</span>
                                    </span>
                                    <span className={`${styles.barAmount} ${styles.amountManual}`}>
                                        ${Math.round(metrics.manualTotal).toLocaleString()}/mo
                                    </span>
                                </div>
                                <div className={styles.trackBg}>
                                    <div
                                        className={styles.barFillManual}
                                        style={{ width: `${manualWidthPct}%` }}
                                    >
                                        ${Math.round(metrics.manualTotal).toLocaleString()}
                                    </div>
                                </div>
                            </div>

                            {/* Bar 2: LaunchXact MoR */}
                            <div className={styles.barRow}>
                                <div className={styles.barLabelArea}>
                                    <span className={styles.barName}>
                                        LaunchXact Native MoR
                                        <span className={styles.barTagMor}>5% Flat · Zero Liability</span>
                                    </span>
                                    <span className={`${styles.barAmount} ${styles.amountMor}`}>
                                        ${Math.round(metrics.morTotal).toLocaleString()}/mo
                                    </span>
                                </div>
                                <div className={styles.trackBg}>
                                    <div
                                        className={styles.barFillMor}
                                        style={{ width: `${morWidthPct}%` }}
                                    >
                                        ${Math.round(metrics.morTotal).toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Itemized Breakdown Toggle */}
                        <button
                            type="button"
                            onClick={() => setShowBreakdown(!showBreakdown)}
                            className={styles.breakdownToggle}
                        >
                            <span>{showBreakdown ? '▲ Hide cost breakdown' : '▼ View itemized line items'}</span>
                            <span>{showBreakdown ? 'Collapse' : 'Explain every dollar'}</span>
                        </button>

                        {showBreakdown && (
                            <table className={styles.breakdownTable}>
                                <thead>
                                    <tr>
                                        <th>Cost Component</th>
                                        <th>Manual Setup</th>
                                        <th>LaunchXact MoR</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Base Processing (2.9% + 30¢)</td>
                                        <td>${Math.round(metrics.baseGatewayFees).toLocaleString()}</td>
                                        <td rowSpan={4} style={{ verticalAlign: 'middle', background: '#f5f3ff', color: '#6d28d9', fontWeight: 700 }}>
                                            ${Math.round(metrics.morTotal).toLocaleString()}<br />
                                            <small style={{ fontWeight: 400, color: '#7c3aed' }}>Single Flat 5%</small>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Cross-Border & FX Conversion (2%)</td>
                                        <td>${Math.round(metrics.fxIntlRiskCost).toLocaleString()}</td>
                                    </tr>
                                    <tr>
                                        <td>Tax Filing Software & Invoicing ($50/country)</td>
                                        <td>${Math.round(metrics.taxFilingCost).toLocaleString()}</td>
                                    </tr>
                                    <tr>
                                        <td>Founder Time ({metrics.hours} hrs @ $50/hr)</td>
                                        <td>${Math.round(metrics.adminLaborCost).toLocaleString()}</td>
                                    </tr>
                                    <tr style={{ fontWeight: 700, borderTop: '2px solid #e2e8f0' }}>
                                        <td>Total Monthly Real Cost</td>
                                        <td style={{ color: '#dc2626' }}>${Math.round(metrics.manualTotal).toLocaleString()}</td>
                                        <td style={{ color: '#7c3aed', background: '#ede9fe' }}>${Math.round(metrics.morTotal).toLocaleString()}</td>
                                    </tr>
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>

            {/* Conversion Handoff Card */}
            <section className={styles.handoffCard}>
                <div className={styles.handoffGlow} />
                <h3 className={styles.handoffHeadline}>
                    Stop wasting 15+ hours a month on tax compliance.
                </h3>
                <p className={styles.handoffDesc}>
                    Join the LaunchXact waitlist for native Merchant of Record (MoR) and focus 100% on building your product. We legally handle global VAT, GST, and currency remittance on every order.
                </p>
                <div className={styles.handoffActions}>
                    <Link href="/#founder-form" className={styles.btnPrimary}>
                        Apply to Genesis Batch with Native MoR →
                    </Link>
                    <button
                        type="button"
                        onClick={handleCopySummary}
                        className={styles.btnSecondary}
                    >
                        {copied ? '✓ Calculation Copied!' : 'Copy Calculation Summary'}
                    </button>
                </div>
            </section>

            {/* Educational FAQ Section for SEO */}
            <section className={styles.faqSection}>
                <h2 className={styles.faqHeading}>Frequently Asked Questions About SaaS Payments</h2>

                <div className={styles.faqItem}>
                    <h3 className={styles.faqQuestion}>What is a Merchant of Record (MoR)?</h3>
                    <p className={styles.faqAnswer}>
                        A Merchant of Record is the legal entity that sells software or digital products to the end customer. Unlike a traditional payment gateway (which only processes card transactions while leaving full tax and legal liability on you), an MoR takes on legal responsibility for calculating, collecting, and remitting global sales tax, VAT, and GST in every jurisdiction worldwide.
                    </p>
                </div>

                <div className={styles.faqItem}>
                    <h3 className={styles.faqQuestion}>Why is Stripe direct more expensive than it looks?</h3>
                    <p className={styles.faqAnswer}>
                        Stripe charges 2.9% + 30¢ for domestic transactions, but international transactions incur an extra 1.5% cross-border fee and a 1% currency conversion fee. On top of that, you must pay for tax software (TaxJar, Quaderno, or Anrok) costing $100–$500/month, plus CPA quarterly filing fees and dozens of hours spent reconciling reverse-charge VAT and tax exemption forms.
                    </p>
                </div>

                <div className={styles.faqItem}>
                    <h3 className={styles.faqQuestion}>How does LaunchXact compare?</h3>
                    <p className={styles.faqAnswer}>
                        LaunchXact provides a built-in, native Merchant of Record solution for all products listed in our marketplace. Founders receive clean payouts without ever having to register for VAT in Europe, HMRC in the UK, or sales tax permits across US states.
                    </p>
                </div>
            </section>
        </div>
    );
}
