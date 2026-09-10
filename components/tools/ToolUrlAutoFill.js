'use client';
import { useState } from 'react';
import styles from './ToolUrlAutoFill.module.css';

const LOADING_STEPS = [
    'Crawling landing page, meta tags & OpenGraph...',
    'Catching brand logo & stashing candidate in Supabase...',
    'AI agent extracting ICP, value prop & features...',
    'Structuring verified tool inputs & generating results...'
];

export default function ToolUrlAutoFill({
    toolType = 'geo-schema',
    onSuccess,
    onAutoTrigger,
    buttonText = 'Auto-Fill with AI ✨',
    autoTriggerText = null,
    title = 'Instant AI Auto-Fill from Website URL',
    subtitle = 'Paste your live SaaS or landing page link. Our AI Agent extracts your brand, features, pricing, and logo automatically so you never have to fill out the form manually.'
}) {
    const [url, setUrl] = useState('');
    const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'done' | 'error'
    const [stepIndex, setStepIndex] = useState(0);
    const [errorMsg, setErrorMsg] = useState('');
    const [extractedMeta, setExtractedMeta] = useState(null);

    const handleAutoFill = async (triggerAuditAfter = false) => {
        if (!url.trim()) {
            setErrorMsg('Please paste your product link first (e.g. yourstartup.com)');
            return;
        }

        setStatus('loading');
        setErrorMsg('');
        setStepIndex(0);

        // Step transition timer for smooth user experience
        let currentStep = 0;
        const interval = setInterval(() => {
            currentStep = (currentStep + 1) % LOADING_STEPS.length;
            setStepIndex(currentStep);
        }, 1200);

        try {
            const res = await fetch('/api/tools/autofill', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    url: url.trim(),
                    toolType
                })
            });

            clearInterval(interval);
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to extract product data.');
            }

            setExtractedMeta({
                name: data.data?.name || data.data?.ideaName || data.data?.productName || 'SaaS Product',
                logoUrl: data.logoUrl || data.data?.logoUrl || '',
                slug: data.productSlug,
                storedInSupabase: !!data.supabaseRecordId
            });

            setStatus('done');

            if (onSuccess) {
                onSuccess(data.data, data.logoUrl, data);
            }

            // Optional 1-click immediate run (e.g. for AI SaaS Grader)
            if (triggerAuditAfter && onAutoTrigger) {
                setTimeout(() => {
                    onAutoTrigger(data.data);
                }, 300);
            }

        } catch (err) {
            clearInterval(interval);
            console.error('AutoFill error:', err);
            setErrorMsg(err.message || 'Something went wrong while scraping the website.');
            setStatus('error');
        }
    };

    const handleReset = () => {
        setUrl('');
        setStatus('idle');
        setExtractedMeta(null);
        setErrorMsg('');
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.box}>
                <div className={styles.headerRow}>
                    <div className={styles.titleArea}>
                        <span className={styles.sparkleIcon}>✨</span>
                        <h3 className={styles.title}>{title}</h3>
                    </div>
                    <span className={styles.badge}>
                        ⚡ Zero-Effort Autofill
                    </span>
                </div>

                <p className={styles.subtitle}>{subtitle}</p>

                <div className={styles.inputGroup}>
                    <div className={styles.inputWrapper}>
                        <span className={styles.urlIcon}>🔗</span>
                        <input
                            type="text"
                            className={styles.input}
                            placeholder="Paste product link (e.g. https://resend.com or myproduct.io)..."
                            value={url}
                            onChange={(e) => {
                                setUrl(e.target.value);
                                if (errorMsg) setErrorMsg('');
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAutoFill(false);
                                }
                            }}
                            disabled={status === 'loading'}
                        />
                    </div>

                    <div className={styles.buttonGroup}>
                        <button
                            type="button"
                            className={styles.submitBtn}
                            onClick={() => handleAutoFill(false)}
                            disabled={status === 'loading'}
                        >
                            {status === 'loading' ? (
                                <>
                                    <span className={styles.spinner}></span>
                                    <span>Extracting...</span>
                                </>
                            ) : (
                                <span>{buttonText}</span>
                            )}
                        </button>

                        {autoTriggerText && (
                            <button
                                type="button"
                                className={styles.auditBtn}
                                onClick={() => handleAutoFill(true)}
                                disabled={status === 'loading'}
                            >
                                <span>{autoTriggerText}</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Progress Status Bar while crawling/extracting */}
                {status === 'loading' && (
                    <div className={styles.progressContainer}>
                        <div className={styles.spinner}></div>
                        <p className={styles.progressText}>
                            {LOADING_STEPS[stepIndex]}
                        </p>
                    </div>
                )}

                {/* Success Card with Captured Logo preview and Supabase verification */}
                {status === 'done' && extractedMeta && (
                    <div className={styles.successCard}>
                        <div className={styles.successDetails}>
                            {extractedMeta.logoUrl ? (
                                <div className={styles.logoPreviewWrapper}>
                                    <img
                                        src={extractedMeta.logoUrl}
                                        alt={`${extractedMeta.name} Logo`}
                                        className={styles.logoImg}
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                </div>
                            ) : (
                                <div className={styles.logoPreviewWrapper}>
                                    <span>🚀</span>
                                </div>
                            )}

                            <div className={styles.successMeta}>
                                <span className={styles.productNameHeading}>
                                    {extractedMeta.name}
                                    <span className={styles.verifiedPill}>✓ Logo Saved in Supabase</span>
                                </span>
                                <p className={styles.successSubtext}>
                                    All form fields populated by AI. Candidate staged for launch onboarding.
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            className={styles.resetBtn}
                            onClick={handleReset}
                        >
                            Change URL
                        </button>
                    </div>
                )}

                {/* Error Banner */}
                {status === 'error' && (
                    <div className={styles.errorAlert}>
                        <span>⚠️ {errorMsg}</span>
                        <button
                            type="button"
                            className={styles.dismissError}
                            onClick={() => setStatus('idle')}
                        >
                            ×
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
