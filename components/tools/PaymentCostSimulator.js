'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import ToolShareCard from './ToolShareCard';
import styles from './PaymentCostSimulator.module.css';

export default function PaymentCostSimulator() {
    // Inputs (Defaults match the exact prompt spec)
    const [revenue, setRevenue] = useState(10000);
    const [intPct, setIntPct] = useState(45);
    const [avgTx, setAvgTx] = useState(79);
    const [countries, setCountries] = useState(8);
    const [showBreakdown, setShowBreakdown] = useState(false);

    // Presets
    const revenuePresets = [2500, 5000, 10000, 25000, 50000];
    const aovPresets = [29, 49, 79, 149];
    const countryPresets = [3, 8, 15, 30];

    // Mathematical Engine
    const metrics = useMemo(() => {
        const rev = Number(revenue) || 0;
        const intl = Number(intPct) || 0;
        const cnt = Number(countries) || 1;
        const aov = Number(avgTx) || 50;

        const txCount = aov > 0 ? Math.round(rev / aov) : 0;

        // 1. Base Payment Processing (2.9%)
        const baseGateway = Math.round(rev * 0.029);

        // 2. Tax & Compliance ($100 base software + $40/jurisdiction)
        const taxCompliance = Math.round(100 + (cnt * 40));

        // 3. Accounting, Invoicing & Admin (cross-border reconciliation + CPA filing)
        const accountingAdmin = Math.round(150 + (cnt * 12) + (rev * 0.0064));

        // 4. Chargeback & Dispute Exposure (~1.3% fraud buffer & chargeback reserve)
        const chargebackExposure = Math.round(rev * 0.013);

        // 5. Estimated Founder/Admin Time
        const founderHours = Number((3.5 + (cnt * 1.0)).toFixed(1));

        // 6. Total Estimated Hidden Cost
        const totalHiddenCost = baseGateway + taxCompliance + accountingAdmin + chargebackExposure;
        const annualLeakage = totalHiddenCost * 12;

        // 7. LaunchXact Unified Cost (Flat 5% MoR, 0 hrs lost)
        const launchXactCost = Math.round(rev * 0.05);

        // Net Savings
        const monthlySavings = totalHiddenCost - launchXactCost;
        const annualSavings = monthlySavings * 12;

        return {
            baseGateway,
            taxCompliance,
            accountingAdmin,
            chargebackExposure,
            founderHours,
            totalHiddenCost,
            annualLeakage,
            launchXactCost,
            monthlySavings,
            annualSavings,
            txCount
        };
    }, [revenue, intPct, avgTx, countries]);

    // Bar chart scale calculation
    const maxBarValue = Math.max(metrics.totalHiddenCost, metrics.launchXactCost, 1);
    const manualWidthPct = Math.min(100, Math.max(12, (metrics.totalHiddenCost / maxBarValue) * 100));
    const morWidthPct = Math.min(100, Math.max(12, (metrics.launchXactCost / maxBarValue) * 100));

    // Smooth scroll to tool
    const scrollToTool = () => {
        const el = document.getElementById('tool-stage');
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    // Personalized Share Text
    const quoteText = `I discovered my SaaS is spending $${metrics.annualLeakage.toLocaleString()}/year on hidden payment + compliance overhead. And I didn't even realize it.`;
    const shareX = `I discovered my SaaS is spending $${metrics.annualLeakage.toLocaleString()}/year on hidden payment + compliance overhead. And I didn't even realize it.

Calculate yours → https://www.launchxact.com/tools/true-cost-of-payments`;
    const redditTitle = `Calculated my true SaaS payment costs: Leaking $${metrics.annualLeakage.toLocaleString()}/year`;
    const redditText = `I ran my SaaS numbers through the True Cost of Payments simulator:

• Monthly Revenue: $${revenue.toLocaleString()}
• Countries Sold To: ${countries} (${intPct}% international)
• Base Payment Processing: $${metrics.baseGateway}/mo
• Tax & Compliance Software: $${metrics.taxCompliance}/mo
• Accounting & Reconciliation: $${metrics.accountingAdmin}/mo
• Chargeback Exposure: $${metrics.chargebackExposure}/mo
• Founder Time Wasted: ${metrics.founderHours} hrs/mo

Total Hidden Burden: $${metrics.totalHiddenCost.toLocaleString()}/mo ($${metrics.annualLeakage.toLocaleString()}/year).

Calculate yours here: https://www.launchxact.com/tools/true-cost-of-payments`;

    const copyText = `💸 LaunchXact True Cost of Payments Audit:
• MRR: $${revenue.toLocaleString()} | ${intPct}% International | ${countries} Countries
• Real Gateway & Tax Burden: $${metrics.totalHiddenCost.toLocaleString()}/mo + ${metrics.founderHours} hrs/mo
• LaunchXact Unified MoR (5%): $${metrics.launchXactCost.toLocaleString()}/mo (0 hrs lost)
---------------------------------------------
Annual Leaked Overhead: $${metrics.annualLeakage.toLocaleString()}/yr
Calculate yours: https://www.launchxact.com/tools/true-cost-of-payments`;

    return (
        <div className={styles.container}>
            {/* =========================================================
                LAYER 1 — BIG PAINFUL PROBLEM
               ========================================================= */}
            <header className={styles.toolHeader}>
                <span className={styles.toolBadge}>✦ Layer 1 · Revenue Leakage Audit</span>
                <h1 className={styles.toolTitle}>
                    The True Cost of <span className={styles.gradientAccent}>Payments & Global Tax</span>
                </h1>
                <p className={styles.painHookHero}>
                    Your payment processor isn&apos;t your real cost.
                </p>
                <p className={styles.toolSubtitle}>
                    Calculate what international taxes, chargebacks, compliance software, and founder accounting hours actually cost your SaaS every month.
                </p>

                <div className={styles.heroActionArea}>
                    <button
                        type="button"
                        onClick={scrollToTool}
                        className={styles.heroCtaBtn}
                        id="calculate-true-cost-hero-btn"
                    >
                        Calculate My True Cost ↓
                    </button>
                    <span className={styles.noEmailNote}>
                        ⚡ 100% Free · Immediate Value · No email required upfront
                    </span>
                </div>
            </header>

            {/* =========================================================
                LAYER 2 — THE INTERACTIVE TOOL
               ========================================================= */}
            <div id="tool-stage" className={styles.simulatorGrid}>
                {/* Controls Card */}
                <div className={styles.controlsCard}>
                    <div className={styles.cardHeader}>
                        <h2 className={styles.cardTitle}>Your SaaS Parameters</h2>
                        <p className={styles.cardDesc}>Enter your real metrics for an instant financial & labor audit.</p>
                    </div>

                    {/* Parameter 1: MRR */}
                    <div className={styles.controlGroup}>
                        <div className={styles.labelRow}>
                            <label htmlFor="revenue-input" className={styles.controlLabel}>
                                Monthly Recurring Revenue (MRR)
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
                                    aria-label="Monthly Recurring Revenue"
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
                            {revenuePresets.map((p) => (
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
                            <label htmlFor="intl-input" className={styles.controlLabel}>
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

                    {/* Parameter 3: Average Transaction (AOV) */}
                    <div className={styles.controlGroup}>
                        <div className={styles.labelRow}>
                            <label htmlFor="aov-input" className={styles.controlLabel}>
                                Average Transaction (AOV)
                            </label>
                            <div className={styles.inputBadge}>
                                <span className={styles.inputPrefix}>$</span>
                                <input
                                    id="aov-input"
                                    type="number"
                                    min="5"
                                    max="1000"
                                    step="5"
                                    value={avgTx}
                                    onChange={(e) => setAvgTx(Math.max(5, Number(e.target.value)))}
                                    className={styles.numberInput}
                                    aria-label="Average transaction price"
                                />
                            </div>
                        </div>
                        <div className={styles.sliderWrap}>
                            <input
                                id="aov-slider"
                                type="range"
                                min="10"
                                max="500"
                                step="5"
                                value={avgTx}
                                onChange={(e) => setAvgTx(Number(e.target.value))}
                                className={styles.rangeSlider}
                                aria-label="Average transaction price slider"
                            />
                        </div>
                        <div className={styles.presetsRow}>
                            {aovPresets.map((p) => (
                                <button
                                    key={p}
                                    type="button"
                                    onClick={() => setAvgTx(p)}
                                    className={`${styles.presetBtn} ${avgTx === p ? styles.presetBtnActive : ''}`}
                                >
                                    ${p}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Parameter 4: Countries Sold To */}
                    <div className={styles.controlGroup}>
                        <div className={styles.labelRow}>
                            <label htmlFor="countries-input" className={styles.controlLabel}>
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
                        <div className={styles.presetsRow}>
                            {countryPresets.map((c) => (
                                <button
                                    key={c}
                                    type="button"
                                    onClick={() => setCountries(c)}
                                    className={`${styles.presetBtn} ${countries === c ? styles.presetBtnActive : ''}`}
                                >
                                    {c} countries
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Layer 2 Results Card: Exact Breakdown */}
                <div className={styles.resultsCard}>
                    <div className={styles.cardHeader}>
                        <h2 className={styles.cardTitle}>Itemized Real Cost Audit</h2>
                        <p className={styles.cardDesc}>What your payment stack actually costs you per month:</p>
                    </div>

                    {/* 4-Item Breakdown Grid */}
                    <div className={styles.itemizedGrid}>
                        <div className={styles.itemCard}>
                            <span className={styles.itemLabel}>💳 Payment Processing</span>
                            <span className={styles.itemVal}>${metrics.baseGateway}/mo</span>
                            <span className={styles.itemDetail}>2.9% gateway fee</span>
                        </div>
                        <div className={styles.itemCard}>
                            <span className={styles.itemLabel}>🏛️ Tax / Compliance</span>
                            <span className={styles.itemVal}>${metrics.taxCompliance}/mo</span>
                            <span className={styles.itemDetail}>TaxJar/Anrok + VAT OSS ({countries} jurs.)</span>
                        </div>
                        <div className={styles.itemCard}>
                            <span className={styles.itemLabel}>📊 Accounting / Admin</span>
                            <span className={styles.itemVal}>${metrics.accountingAdmin}/mo</span>
                            <span className={styles.itemDetail}>Filing fees & cross-border FX</span>
                        </div>
                        <div className={styles.itemCard}>
                            <span className={styles.itemLabel}>⚠️ Chargeback Exposure</span>
                            <span className={styles.itemVal}>${metrics.chargebackExposure}/mo</span>
                            <span className={styles.itemDetail}>Dispute reserves & risk liability</span>
                        </div>
                    </div>

                    {/* Summary Totals Banner */}
                    <div className={styles.summaryTotalsRow}>
                        <div className={styles.totalBoxManual}>
                            <div className={styles.totalBoxLabel}>Estimated Hidden Cost</div>
                            <div className={styles.totalBoxValue}>
                                ${metrics.totalHiddenCost.toLocaleString()}/mo
                                <span className={styles.timeTag}>+ {metrics.founderHours} hrs</span>
                            </div>
                            <div className={styles.totalBoxSub}>Fragmented gateway setup</div>
                        </div>

                        <div className={styles.totalBoxMor}>
                            <div className={styles.totalBoxLabel}>LaunchXact Unified MoR</div>
                            <div className={styles.totalBoxValueMor}>
                                ${metrics.launchXactCost.toLocaleString()}/mo
                                <span className={styles.timeTagZero}>0 hrs lost</span>
                            </div>
                            <div className={styles.totalBoxSubMor}>Single flat 5% · 100% compliant</div>
                        </div>
                    </div>

                    {/* Visual Comparison Bars */}
                    <div className={styles.barComparison}>
                        <div className={styles.barRow}>
                            <div className={styles.barLabelArea}>
                                <span className={styles.barName}>Manual Gateway + Tax Tools</span>
                                <span className={`${styles.barAmount} ${styles.amountManual}`}>
                                    ${metrics.totalHiddenCost.toLocaleString()}/mo
                                </span>
                            </div>
                            <div className={styles.trackBg}>
                                <div
                                    className={styles.barFillManual}
                                    style={{ width: `${manualWidthPct}%` }}
                                >
                                    ${metrics.totalHiddenCost.toLocaleString()}
                                </div>
                            </div>
                        </div>

                        <div className={styles.barRow}>
                            <div className={styles.barLabelArea}>
                                <span className={styles.barName}>LaunchXact Native MoR</span>
                                <span className={`${styles.barAmount} ${styles.amountMor}`}>
                                    ${metrics.launchXactCost.toLocaleString()}/mo
                                </span>
                            </div>
                            <div className={styles.trackBg}>
                                <div
                                    className={styles.barFillMor}
                                    style={{ width: `${morWidthPct}%` }}
                                >
                                    ${metrics.launchXactCost.toLocaleString()}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Line-by-Line Breakdown Toggle */}
                    <button
                        type="button"
                        onClick={() => setShowBreakdown(!showBreakdown)}
                        className={styles.breakdownToggle}
                    >
                        <span>{showBreakdown ? '▲ Hide detailed table' : '▼ View full itemized audit'}</span>
                        <span>{showBreakdown ? 'Collapse' : 'Explain every line'}</span>
                    </button>

                    {showBreakdown && (
                        <table className={styles.breakdownTable}>
                            <thead>
                                <tr>
                                    <th>Cost Component</th>
                                    <th>Manual Gateway</th>
                                    <th>LaunchXact MoR</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Payment Processing (2.9%)</td>
                                    <td>${metrics.baseGateway}/mo</td>
                                    <td rowSpan={5} style={{ verticalAlign: 'middle', background: '#f5f3ff', color: '#6d28d9', fontWeight: 700, textAlign: 'center' }}>
                                        ${metrics.launchXactCost}/mo<br />
                                        <small style={{ fontWeight: 400, color: '#7c3aed' }}>Single Flat 5% · Zero Add-ons</small>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Tax Compliance Software ({countries} jurisdictions)</td>
                                    <td>${metrics.taxCompliance}/mo</td>
                                </tr>
                                <tr>
                                    <td>Accounting, Invoicing & Cross-Border FX</td>
                                    <td>${metrics.accountingAdmin}/mo</td>
                                </tr>
                                <tr>
                                    <td>Chargeback & Fraud Exposure</td>
                                    <td>${metrics.chargebackExposure}/mo</td>
                                </tr>
                                <tr>
                                    <td>Founder Time Reclaimed ({metrics.founderHours} hrs/mo)</td>
                                    <td style={{ color: '#dc2626' }}>{metrics.founderHours} hrs lost/mo</td>
                                </tr>
                                <tr style={{ fontWeight: 700, borderTop: '2px solid #e2e8f0' }}>
                                    <td>Total Monthly Financial Burden</td>
                                    <td style={{ color: '#dc2626' }}>${metrics.totalHiddenCost.toLocaleString()}/mo</td>
                                    <td style={{ color: '#7c3aed', background: '#ede9fe', textAlign: 'center' }}>${metrics.launchXactCost.toLocaleString()}/mo</td>
                                </tr>
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* =========================================================
                LAYER 3 — THE "AHA!" MOMENT (Personalized Diagnosis)
               ========================================================= */}
            <section className={styles.ahaDiagnosisCard}>
                <div className={styles.ahaBadge}>✦ Layer 3 · Personalized Diagnosis</div>
                
                <h2 className={styles.ahaHeadline}>
                    Your SaaS is leaking ~${metrics.annualLeakage.toLocaleString()}/year in operational overhead.
                </h2>
                
                <p className={styles.ahaSubtext}>
                    You&apos;re currently spending an estimated <strong>{metrics.founderHours} founder-hours/month</strong> dealing with infrastructure, tax and payment complexity.
                </p>

                <div className={styles.pivotDivider}>
                    <span className={styles.pivotQuestion}>What if you didn&apos;t have to?</span>
                </div>

                <p className={styles.ahaBridge}>
                    That&apos;s where <strong>LaunchXact</strong> enters. LaunchXact is being built to collapse this fragmented stack into one founder-first platform.
                </p>

                <div className={styles.ahaActionRow}>
                    <Link href="/#founder-form" className={styles.btnAhaGenesis}>
                        Join the Genesis Batch →
                    </Link>
                    <span className={styles.genesisGuarantees}>
                        ✓ 5% Flat Merchant of Record · Zero VAT/GST liability · Built-in distribution
                    </span>
                </div>
            </section>

            {/* =========================================================
                LAYER 4 — THE "SHARE MY RESULT" VIRAL LOOP
               ========================================================= */}
            <ToolShareCard
                badge="True Cost of Payments Audit"
                statHighlight={`$${metrics.annualLeakage.toLocaleString()}/yr`}
                statLabel="Hidden Payment + Compliance Overhead"
                subMetrics={[
                    { label: 'Monthly Leakage', value: `$${metrics.totalHiddenCost.toLocaleString()}/mo` },
                    { label: 'Founder Hours', value: `${metrics.founderHours} hrs/mo` },
                    { label: 'Tax Jurisdictions', value: `${countries} countries` },
                    { label: 'LaunchXact Flat MoR', value: `$${metrics.launchXactCost}/mo` }
                ]}
                quote={quoteText}
                toolName="True Cost of Payments"
                toolUrl="https://www.launchxact.com/tools/true-cost-of-payments"
                shareTextX={shareX}
                shareTitleReddit={redditTitle}
                shareTextReddit={redditText}
                copySummaryText={copyText}
            />

            {/* =========================================================
                LAYER 5 — GENESIS BATCH COLLAPSE & SEO FAQS
               ========================================================= */}
            <section className={styles.handoffCard}>
                <div className={styles.handoffGlow} />
                <h3 className={styles.handoffHeadline}>
                    Collapse your fragmented payment stack into one platform.
                </h3>
                <p className={styles.handoffDesc}>
                    Stop managing separate subscriptions for Stripe, TaxJar, invoicing software, and foreign exchange brokers. LaunchXact acts as your legal Merchant of Record, instantly handling worldwide sales tax, EU VAT OSS, and chargeback protection.
                </p>
                <div className={styles.handoffActions}>
                    <Link href="/#founder-form" className={styles.btnPrimary}>
                        Apply to Genesis Batch with Native MoR →
                    </Link>
                </div>
            </section>

            {/* Educational FAQ Section for SEO */}
            <section className={styles.faqSection}>
                <h2 className={styles.faqHeading}>Frequently Asked Questions About SaaS Payments</h2>

                <div className={styles.faqItem}>
                    <h3 className={styles.faqQuestion}>What is the true cost of using raw payment gateways like Stripe?</h3>
                    <p className={styles.faqAnswer}>
                        While raw payment gateways advertise a base transaction fee of 2.9% + 30¢, the true cost includes additional cross-border and currency conversion fees (typically 1.5% to 2.5%), third-party tax calculation and invoicing software ($99 to $499/month), quarterly CPA and local filing costs ($150 to $350/month), and 8 to 22 hours of founder time spent on manual tax compliance.
                    </p>
                </div>

                <div className={styles.faqItem}>
                    <h3 className={styles.faqQuestion}>What is a Merchant of Record (MoR) and how does it save SaaS founders money?</h3>
                    <p className={styles.faqAnswer}>
                        A Merchant of Record (MoR) is the legal seller of software to the end customer. An MoR assumes 100% legal responsibility for calculating, collecting, and remitting global sales tax, VAT, and GST worldwide. By bundling payment processing, tax compliance, invoicing, and dispute liability into a single flat percentage fee (typically ~5%), founders eliminate third-party tax software subscriptions and save 10 to 20 administrative hours each month.
                    </p>
                </div>

                <div className={styles.faqItem}>
                    <h3 className={styles.faqQuestion}>How does LaunchXact handle payments for founders?</h3>
                    <p className={styles.faqAnswer}>
                        LaunchXact provides a built-in native Merchant of Record solution for products featured in its curated SaaS marketplace. Founders can sell worldwide to 50+ countries without having to register for VAT OSS in the EU, HMRC in the UK, or sales tax nexus permits across individual US states.
                    </p>
                </div>

                <div className={styles.faqItem}>
                    <h3 className={styles.faqQuestion}>When should a SaaS switch from a raw payment gateway to a Merchant of Record?</h3>
                    <p className={styles.faqAnswer}>
                        A SaaS should switch to a Merchant of Record as soon as it begins accepting customers from multiple international countries, especially the European Union, the United Kingdom, Canada, or Australia, where digital services are subject to strict destination-based VAT and GST reporting.
                    </p>
                </div>
            </section>
        </div>
    );
}
