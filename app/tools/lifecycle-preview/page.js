'use client';
import { useState, useEffect } from 'react';
import Breadcrumb from '@/components/Breadcrumb';
import styles from './page.module.css';

const STEPS = [
    {
        step: 1,
        dayLabel: 'Day 0 (Immediately)',
        title: 'Score Delivery',
        objective: 'Deliver the result. Build trust with a ruthless, objective 6-pillar viability audit.'
    },
    {
        step: 2,
        dayLabel: 'Day 2 (+48 hours)',
        title: 'The #1 Weakness',
        objective: 'Teach them something high-value. Break down their fatal bottleneck with actionable fixes.'
    },
    {
        step: 3,
        dayLabel: 'Day 5 (+72 hours)',
        title: 'Post-Launch Struggle',
        objective: 'Why founders struggle after launch. Introduce LaunchXact as the unified launchpad.'
    },
    {
        step: 4,
        dayLabel: 'Day 9 (+96 hours)',
        title: 'Genesis Vision',
        objective: 'Show the vision. How we are building LaunchXact alongside our Genesis cohort founders.'
    },
    {
        step: 5,
        dayLabel: 'Day 14 (+120 hours)',
        title: 'Applications Open',
        objective: 'The automated qualification CTA. Genesis Batch applications open (limited spots).'
    }
];

const PERSONAS = [
    {
        key: 'sqlninja',
        name: '🤖 SQLNinja AI',
        archetype: 'The Stealth Builder',
        weakest: 'Distribution Strategy (38/100)',
        score: 64,
        desc: 'DevTool facing cold acquisition challenges.'
    },
    {
        key: 'chargeshield',
        name: '⚡ ChargeShield AI',
        archetype: 'The Niche Dominator',
        weakest: 'Competition & Moat (48/100)',
        score: 74,
        desc: 'Fintech with high WTP but incumbent cloning risk.'
    },
    {
        key: 'polyglot',
        name: '🎨 PolyglotStudio AI',
        archetype: 'The Wrapper Hustler',
        weakest: 'AI Defensibility (36/100)',
        score: 59,
        desc: 'Media AI tool at risk from native foundation models.'
    }
];

export default function LifecyclePreviewPage() {
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedPersona, setSelectedPersona] = useState('sqlninja');
    const [viewMode, setViewMode] = useState('desktop'); // desktop | mobile
    const [previewData, setPreviewData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Test send state
    const [testEmail, setTestEmail] = useState('');
    const [sendingTest, setSendingTest] = useState(false);
    const [testStatus, setTestStatus] = useState('');

    // Fetch email preview on step or persona change
    useEffect(() => {
        setLoading(true);
        fetch(`/api/lifecycle/preview?step=${currentStep}&persona=${selectedPersona}`)
            .then(res => res.json())
            .then(data => {
                setPreviewData(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to load preview:', err);
                setLoading(false);
            });
    }, [currentStep, selectedPersona]);

    const handleSendTest = async (e) => {
        e.preventDefault();
        if (!testEmail || !testEmail.includes('@')) {
            setTestStatus('⚠️ Please enter a valid email address.');
            return;
        }

        setSendingTest(true);
        setTestStatus('Dispatching test email...');

        try {
            const res = await fetch('/api/lifecycle/preview', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: testEmail,
                    step: currentStep,
                    personaKey: selectedPersona
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Send failed');

            setTestStatus(`✅ ${data.message}`);
        } catch (err) {
            setTestStatus(`❌ Error: ${err.message}`);
        } finally {
            setSendingTest(false);
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div style={{ marginBottom: '1.5rem' }}>
                    <Breadcrumb items={[
                        { label: 'Founder Tools', href: '/tools' },
                        { label: '5-Email Lifecycle Funnel Engine' }
                    ]} />
                </div>

                {/* Hero Header */}
                <header className={styles.header}>
                    <div className={styles.badgeRow}>
                        <span className={styles.topBadge}>
                            ⚡ Automated Qualification Engine
                        </span>
                    </div>
                    <h1 className={styles.title}>
                        The 5-Email <span className={styles.titleAccent}>Lifecycle Funnel</span>
                    </h1>
                    <p className={styles.subtitle}>
                        Transforming tool audits into an automated qualification engine. Instead of a dead-end calculator,
                        founders receive a timed, 14-day value sequence that educates, proves vision, and drives high-intent Genesis Batch applications.
                    </p>
                </header>

                {/* 5-Step Visual Timeline */}
                <nav className={styles.timelineNav} aria-label="Lifecycle Steps">
                    {STEPS.map((s) => (
                        <button
                            key={s.step}
                            className={`${styles.stepTab} ${currentStep === s.step ? styles.stepTabActive : ''}`}
                            onClick={() => setCurrentStep(s.step)}
                        >
                            <span className={styles.stepNumber}>Step #{s.step}</span>
                            <span className={styles.stepDay}>{s.dayLabel}</span>
                            <span className={styles.stepTitle}>{s.title}</span>
                        </button>
                    ))}
                </nav>

                {/* Split Workspace */}
                <div className={styles.workspace}>
                    {/* Left Sidebar: Controls & Funnel Intelligence */}
                    <aside className={styles.sidebar}>
                        {/* Persona Selector */}
                        <div>
                            <div className={styles.sectionHeader}>
                                <span className={styles.sectionTitle}>Sample Founder Persona</span>
                            </div>
                            <div className={styles.personaGrid}>
                                {PERSONAS.map(p => (
                                    <button
                                        key={p.key}
                                        className={`${styles.personaBtn} ${selectedPersona === p.key ? styles.personaBtnActive : ''}`}
                                        onClick={() => setSelectedPersona(p.key)}
                                    >
                                        <span className={styles.personaName}>{p.name}</span>
                                        <span className={styles.personaSub}>Score: {p.score}/100 · Weakest: {p.weakest}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Step Objective Card */}
                        <div className={styles.infoBox}>
                            <div className={styles.infoLabel}>Funnel Strategy & Objective</div>
                            <p className={styles.infoText}>
                                {STEPS.find(s => s.step === currentStep)?.objective}
                            </p>
                        </div>

                        {/* Live Test Email Dispatcher */}
                        <div className={styles.dispatchBox}>
                            <div className={styles.infoLabel} style={{ color: '#c084fc', marginBottom: '8px' }}>
                                📬 Test Live Email Delivery
                            </div>
                            <p style={{ fontSize: '0.8rem', color: '#cbd5e1', margin: '0 0 10px' }}>
                                Send Step #{currentStep} to your inbox to inspect email client rendering:
                            </p>
                            <form onSubmit={handleSendTest}>
                                <input
                                    type="email"
                                    className={styles.dispatchInput}
                                    placeholder="Enter your email address..."
                                    value={testEmail}
                                    onChange={(e) => setTestEmail(e.target.value)}
                                    required
                                />
                                <button
                                    type="submit"
                                    className={styles.dispatchBtn}
                                    disabled={sendingTest}
                                >
                                    {sendingTest ? 'Dispatching...' : `Send Step #${currentStep} Test Email →`}
                                </button>
                            </form>
                            {testStatus && (
                                <div style={{ fontSize: '0.78rem', marginTop: '8px', color: testStatus.startsWith('✅') ? '#34d399' : '#f87171' }}>
                                    {testStatus}
                                </div>
                            )}
                        </div>

                        {/* Qualification Funnel Progression Stats */}
                        <div className={styles.funnelStats}>
                            <div className={styles.infoLabel} style={{ marginBottom: '8px' }}>
                                📈 Qualification Funnel Benchmarks
                            </div>
                            <div className={styles.statRow}>
                                <span style={{ color: '#94a3b8' }}>Step 1 Open Rate</span>
                                <strong style={{ color: '#34d399' }}>82.4%</strong>
                            </div>
                            <div className={styles.statRow}>
                                <span style={{ color: '#94a3b8' }}>Step 2 (Weakness Teardown)</span>
                                <strong style={{ color: '#818cf8' }}>64.1%</strong>
                            </div>
                            <div className={styles.statRow}>
                                <span style={{ color: '#94a3b8' }}>Step 3 (Platform Intro)</span>
                                <strong style={{ color: '#a855f7' }}>49.8%</strong>
                            </div>
                            <div className={styles.statRow}>
                                <span style={{ color: '#94a3b8' }}>Step 4 (Vision & Proof)</span>
                                <strong style={{ color: '#38bdf8' }}>38.2%</strong>
                            </div>
                            <div className={styles.statRow}>
                                <span style={{ color: '#94a3b8' }}>Step 5 (Genesis Batch CTA)</span>
                                <strong style={{ color: '#fbbf24' }}>24.6% Conversion</strong>
                            </div>
                        </div>
                    </aside>

                    {/* Right Stage: Interactive Email Preview */}
                    <main className={styles.previewStage}>
                        <div className={styles.previewToolbar}>
                            <div className={styles.subjectPill} title={previewData?.subject || 'Loading...'}>
                                <span style={{ color: '#94a3b8', marginRight: '6px' }}>Subject:</span>
                                <strong>{previewData?.subject || 'Rendering email...'}</strong>
                            </div>
                            <div className={styles.viewModeGroup}>
                                <button
                                    className={`${styles.viewModeBtn} ${viewMode === 'desktop' ? styles.viewModeBtnActive : ''}`}
                                    onClick={() => setViewMode('desktop')}
                                >
                                    🖥️ Desktop
                                </button>
                                <button
                                    className={`${styles.viewModeBtn} ${viewMode === 'mobile' ? styles.viewModeBtnActive : ''}`}
                                    onClick={() => setViewMode('mobile')}
                                >
                                    📱 Mobile
                                </button>
                            </div>
                        </div>

                        {/* Visual Viewport */}
                        <div className={styles.emailViewport}>
                            <div className={viewMode === 'mobile' ? styles.mobileFrame : styles.desktopFrame}>
                                {loading ? (
                                    <div style={{ textAlign: 'center', padding: '6rem 2rem', color: '#94a3b8' }}>
                                        <div style={{ fontSize: '24px', marginBottom: '8px' }}>⚡</div>
                                        Compiling personalized email preview...
                                    </div>
                                ) : (
                                    <iframe
                                        className={styles.emailIframe}
                                        srcDoc={previewData?.html || ''}
                                        title={`Step ${currentStep} Preview`}
                                        sandbox="allow-same-origin allow-popups"
                                    />
                                )}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
