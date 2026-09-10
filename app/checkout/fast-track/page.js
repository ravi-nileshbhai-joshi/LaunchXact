'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from './page.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faBolt, 
    faCheck, 
    faShieldAlt, 
    faClock, 
    faLink, 
    faArrowRight, 
    faCheckCircle,
    faExternalLinkAlt,
    faReceipt,
    faGlobe,
    faInfinity,
    faHome,
    faChartLine
} from '@fortawesome/free-solid-svg-icons';

function FastTrackContent() {
    const searchParams = useSearchParams();
    const productName = searchParams.get('product') || searchParams.get('productName') || 'Your SaaS';
    const email = searchParams.get('email') || '';

    const dodoCheckoutUrl = process.env.NEXT_PUBLIC_DODO_FAST_TRACK_URL || '';
    const [isSimulating, setIsSimulating] = useState(false);
    const [confirmed, setConfirmed] = useState(false);
    const [message, setMessage] = useState('');

    const handleSimulatePayment = async () => {
        setIsSimulating(true);
        try {
            const res = await fetch('/api/checkout/fast-track/confirm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productName, email })
            });
            const data = await res.json();
            if (res.ok) {
                setConfirmed(true);
                setMessage(data.message || 'Payment confirmed! Fast-Track review activated.');
            } else {
                setConfirmed(true);
                setMessage('Fast-Track status registered for testing!');
            }
        } catch (err) {
            setConfirmed(true);
            setMessage('Fast-Track status marked for testing!');
        } finally {
            setIsSimulating(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <div className={styles.badge}>
                        <FontAwesomeIcon icon={faBolt} className={styles.badgeIcon} />
                        Genesis Batch #1 Priority Review
                    </div>
                    <h1 className={styles.title}>Fast-Track 48-Hour Launch Pass</h1>
                    <p className={styles.subtitle}>
                        Skip the 14–21 day community backlog. Lock in guaranteed 48-hour audit turnaround, an in-depth founder positioning teardown, and priority placement in the Genesis Cohort.
                    </p>
                </div>

                {confirmed ? (
                    <div className={styles.successState}>
                        <FontAwesomeIcon icon={faCheckCircle} className={styles.successIcon} />
                        <h2 className={styles.successTitle}>Fast-Track Review Pass Activated! 🎉</h2>
                        <p className={styles.successDesc}>
                            We have prioritized <strong>{productName}</strong> in our review queue. Your 48-hour SLA review period has officially started.
                        </p>
                        <div className={styles.successBox}>
                            <p><strong>Product:</strong> {productName}</p>
                            {email && <p><strong>Founder Email:</strong> {email}</p>}
                            <p><strong>Review SLA:</strong> Guaranteed response within 48 business hours</p>
                            <p><strong>Next Step:</strong> You will receive a personalized positioning audit & editorial score directly from our team.</p>
                        </div>
                        <Link href="/" className={styles.primaryBtn}>
                            Return to Homepage →
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Order Summary */}
                        <div className={styles.orderSummary}>
                            <div className={styles.orderRow}>
                                <div className={styles.orderItem}>
                                    <div className={styles.itemName}>
                                        LaunchXact 48h Fast-Track Pass
                                        <span className={styles.itemMeta}>For: <strong>{productName}</strong></span>
                                    </div>
                                    <span className={styles.itemPrice}>$99</span>
                                </div>
                            </div>
                            <div className={styles.totalRow}>
                                <span>Total Due (One-Time)</span>
                                <span className={styles.totalPrice}>$99 USD</span>
                            </div>
                        </div>

                        {/* Deliverables Grid */}
                        <div className={styles.deliverables}>
                            <h3 className={styles.deliverablesTitle}>What is included in your Fast-Track Pass:</h3>
                            <ul className={styles.perksList}>
                                <li>
                                    <FontAwesomeIcon icon={faGlobe} className={styles.perkIcon} />
                                    <div>
                                        <strong>Dedicated AEO, GEO & SEO-Optimized Product Page</strong>
                                        <p>Engineered with rich JSON-LD schema so ChatGPT, Perplexity, Gemini, and Google index and cite your product when users ask for tools in your niche.</p>
                                    </div>
                                </li>
                                <li>
                                    <FontAwesomeIcon icon={faInfinity} className={styles.perkIcon} />
                                    <div>
                                        <strong>Lifetime Platform Visibility</strong>
                                        <p>Permanent, high-authority listing on LaunchXact that never expires or gets buried in an archive.</p>
                                    </div>
                                </li>
                                <li>
                                    <FontAwesomeIcon icon={faHome} className={styles.perkIcon} />
                                    <div>
                                        <strong>Featured Homepage Product Showcase</strong>
                                        <p>Guaranteed spotlight in the curated homepage product carousel on launch day.</p>
                                    </div>
                                </li>
                                <li>
                                    <FontAwesomeIcon icon={faChartLine} className={styles.perkIcon} />
                                    <div>
                                        <strong>Dedicated Referral Traffic to Your Website</strong>
                                        <p>Direct click-throughs from early adopters, engineers, and founders actively discovering software.</p>
                                    </div>
                                </li>
                                <li>
                                    <FontAwesomeIcon icon={faClock} className={styles.perkIcon} />
                                    <div>
                                        <strong>Guaranteed 48-Hour Review SLA</strong>
                                        <p>Skip the 14–21 day community backlog. Our editorial team prioritizes your submission within 48 business hours.</p>
                                    </div>
                                </li>
                                <li>
                                    <FontAwesomeIcon icon={faBolt} className={styles.perkIcon} />
                                    <div>
                                        <strong>1-on-1 Positioning & CRO Teardown</strong>
                                        <p>A comprehensive review of your value proposition, landing page copy, ICP resonance, and fatal conversion bottlenecks.</p>
                                    </div>
                                </li>
                                <li>
                                    <FontAwesomeIcon icon={faLink} className={styles.perkIcon} />
                                    <div>
                                        <strong>Zero Badge Requirement & DoFollow Backlink</strong>
                                        <p>No requirement to add any badge to your footer, plus a permanent canonical DoFollow editorial backlink passed to your SaaS.</p>
                                    </div>
                                </li>
                                <li>
                                    <FontAwesomeIcon icon={faShieldAlt} className={styles.perkIcon} />
                                    <div>
                                        <strong>0% Marketplace Commission</strong>
                                        <p>Retain 100% of all customer revenue generated through LaunchXact — zero platform fees or transaction cuts.</p>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        {/* Payment Actions */}
                        <div className={styles.actions}>
                            {dodoCheckoutUrl ? (
                                <a 
                                    href={dodoCheckoutUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className={styles.primaryBtn}
                                >
                                    Proceed to Secure Checkout ($99)
                                    <FontAwesomeIcon icon={faExternalLinkAlt} style={{ marginLeft: '8px' }} />
                                </a>
                            ) : (
                                <div className={styles.checkoutOptions}>
                                    <button 
                                        onClick={handleSimulatePayment} 
                                        disabled={isSimulating}
                                        className={styles.primaryBtn}
                                    >
                                        {isSimulating ? 'Activating Fast-Track...' : '⚡ Complete Fast-Track ($99) →'}
                                    </button>
                                </div>
                            )}

                            <div className={styles.alternativePayment}>
                                <p>
                                    Need an invoice, corporate card payment, or direct transfer? 
                                    <a href={`mailto:hello@launchxact.com?subject=${encodeURIComponent(`Fast-Track Pass Invoice for ${productName}`)}`}>
                                        <FontAwesomeIcon icon={faReceipt} style={{ margin: '0 4px' }} /> Request Invoice via Email
                                    </a>
                                </p>
                            </div>
                        </div>

                        {/* Guarantee note */}
                        <div className={styles.guaranteeBox}>
                            <FontAwesomeIcon icon={faShieldAlt} className={styles.guaranteeIcon} />
                            <span>
                                <strong>100% Satisfaction SLA:</strong> If we fail to deliver your positioning teardown and editorial review within 48 business hours, your $99 is immediately refunded in full.
                            </span>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default function FastTrackCheckoutPage() {
    return (
        <main className={styles.page}>
            <Navbar />
            <Suspense fallback={<div style={{ textAlign: 'center', padding: '100px 20px', color: '#64748b' }}>Loading checkout details...</div>}>
                <FastTrackContent />
            </Suspense>
            <Footer />
        </main>
    );
}
