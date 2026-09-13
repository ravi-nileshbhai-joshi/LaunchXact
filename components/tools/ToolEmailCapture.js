'use client';
import { useState } from 'react';
import Link from 'next/link';
import { trackAcquisitionEvent, ACQUISITION_EVENTS, getSessionId, getActiveAttribution } from '@/lib/acquisition';
import styles from './ToolEmailCapture.module.css';

// Default messaging configurations per tool
const TOOL_CONFIGS = {
    'true-cost-of-payments': {
        badge: '⚡ Instant Founder Deliverable',
        title: 'Get Your Full Payment Leakage Audit & MoR Migration Checklist',
        subtitle: 'We’ll email you the itemized spreadsheet calculation, cross-border VAT breakdown, and senior founder checklist to eliminate 100% of payment overhead.',
        buttonText: 'Send Me The Payment Audit Dossier →',
        fileTitle: 'launchxact-payment-audit.md',
    },
    'franken-stack-cost-forecaster': {
        badge: '⚡ Cloud Cost Optimization',
        title: 'Email Me My Cloud Stack Projections & Scaling Playbook',
        subtitle: 'Get the line-by-line infrastructure breakdown, Clerk vs NextAuth cost comparison, and Supabase tier-transition blueprint directly to your inbox.',
        buttonText: 'Send Me The Franken-Stack Playbook →',
        fileTitle: 'launchxact-stack-projections.md',
    },
    'pre-launch-distribution-architect': {
        badge: '⚡ 30-Day Launch Blueprint',
        title: 'Email Me My Complete Day-by-Day Launch Sprint Checklist',
        subtitle: 'Receive the full 30-day tactical timeline, cold LinkedIn outreach templates, and high-converting Reddit post hooks ready to copy-paste.',
        buttonText: 'Send Me The 30-Day Launch Sprint →',
        fileTitle: 'launchxact-distribution-roadmap.md',
    },
    'geo-schema-snippet-generator': {
        badge: '⚡ Verified AEO Schema',
        title: 'Email Me My Validated JSON-LD Schema & AI Indexing Guide',
        subtitle: 'Get your verified SoftwareApplication + FAQPage markup and our tactical guide to forcing ChatGPT Search, Perplexity, and Gemini to cite your SaaS.',
        buttonText: 'Send Me The Validated Schema Bundle →',
        fileTitle: 'launchxact-geo-schema.json',
    },
    'ai-saas-grader': {
        badge: '⚡ Senior Founder Dossier',
        title: 'Get The Full 5-Page AI Viability & Defensibility Dossier',
        subtitle: 'Receive your 6-pillar viability scorecard, fatal bottleneck diagnosis, and actionable pivot playbook to prevent building unviable software.',
        buttonText: 'Send Me The Viability Blueprint →',
        fileTitle: 'launchxact-viability-dossier.md',
    }
};

export default function ToolEmailCapture({
    toolId = 'true-cost-of-payments',
    customTitle = '',
    customSubtitle = '',
    resultSummary = {},
    exportContent = '',
    onSubmitted = null,
}) {
    const config = TOOL_CONFIGS[toolId] || TOOL_CONFIGS['true-cost-of-payments'];
    const [email, setEmail] = useState('');
    const [joinedWaitlist, setJoinedWaitlist] = useState(true);
    const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
    const [errorMessage, setErrorMessage] = useState('');
    const [copiedContent, setCopiedContent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const cleanEmail = email.trim();
        if (!cleanEmail || !cleanEmail.includes('@')) {
            setErrorMessage('Please enter a valid email address.');
            return;
        }

        setStatus('loading');
        setErrorMessage('');

        try {
            const sessionId = getSessionId();
            const attribution = getActiveAttribution();

            const res = await fetch('/api/tools/lead-capture', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: cleanEmail,
                    toolId,
                    sessionId,
                    resultSummary,
                    joinedWaitlist,
                    utmSource: attribution.utm_source,
                    utmMedium: attribution.utm_medium,
                    utmCampaign: attribution.utm_campaign,
                    refCode: attribution.ref_code
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to capture email');

            // Dispatch acquisition telemetry events
            trackAcquisitionEvent(ACQUISITION_EVENTS.EMAIL_SUBMITTED, {
                toolId,
                metadata: { email_domain: cleanEmail.split('@')[1] }
            });

            if (joinedWaitlist) {
                trackAcquisitionEvent(ACQUISITION_EVENTS.WAITLIST_JOINED, {
                    toolId,
                    metadata: { source: 'email_capture_checkbox' }
                });
            }

            setStatus('success');
            if (onSubmitted) onSubmitted(cleanEmail);

        } catch (err) {
            setErrorMessage(err.message || 'Something went wrong. Please try again.');
            setStatus('error');
        }
    };

    const handleCopyExport = () => {
        const textToCopy = exportContent || JSON.stringify(resultSummary, null, 2);
        navigator.clipboard?.writeText(textToCopy).then(() => {
            setCopiedContent(true);
            setTimeout(() => setCopiedContent(false), 2500);
        });
    };

    const handleDownload = () => {
        const textToDownload = exportContent || JSON.stringify(resultSummary, null, 2);
        const blob = new Blob([textToDownload], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = config.fileTitle;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className={styles.captureContainer}>
            <div className={styles.glowOverlay} />

            <div className={styles.contentWrap}>
                <span className={styles.badge}>{config.badge}</span>
                <h3 className={styles.title}>{customTitle || config.title}</h3>
                <p className={styles.subtitle}>{customSubtitle || config.subtitle}</p>

                {status === 'success' ? (
                    <div className={styles.successState}>
                        <div className={styles.successIcon}>🎉</div>
                        <h4 className={styles.successHeading}>Report Delivered to {email}!</h4>
                        <p className={styles.successDesc}>
                            Check your inbox in 1–2 minutes. You can also download or copy your instant export immediately below:
                        </p>

                        <div className={styles.successActions}>
                            <button
                                type="button"
                                onClick={handleDownload}
                                className={styles.btnDownload}
                            >
                                <span>⬇️ Download Blueprint File</span>
                            </button>

                            <button
                                type="button"
                                onClick={handleCopyExport}
                                className={styles.btnCopyExport}
                            >
                                <span>{copiedContent ? '✓ Copied to Clipboard!' : '📋 Copy Raw Content'}</span>
                            </button>

                            <Link
                                href="/#founder-form"
                                onClick={() => trackAcquisitionEvent(ACQUISITION_EVENTS.GENESIS_APPLICATION, { toolId })}
                                className={styles.btnGenesis}
                            >
                                <span>Apply to Genesis Batch →</span>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.inputRow}>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="founder@yourcompany.com"
                                required
                                disabled={status === 'loading'}
                                className={styles.emailInput}
                                aria-label="Enter your work email"
                            />
                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className={styles.submitBtn}
                            >
                                {status === 'loading' ? 'Preparing Report...' : config.buttonText}
                            </button>
                        </div>

                        <label className={styles.waitlistCheckboxLabel}>
                            <input
                                type="checkbox"
                                checked={joinedWaitlist}
                                onChange={(e) => setJoinedWaitlist(e.target.checked)}
                                className={styles.checkbox}
                            />
                            <span className={styles.checkboxText}>
                                Also reserve my spot in the LaunchXact Genesis Batch (0% platform fees for 90 days).
                            </span>
                        </label>

                        {errorMessage && <p className={styles.errorText}>{errorMessage}</p>}

                        <div className={styles.privacyGuarantee}>
                            <span>🔒 Zero spam. 100% actionable founder intelligence. Unsubscribe in 1 click.</span>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
