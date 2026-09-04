import { redirect } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faFilePdf, faTable, faFileAlt, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import styles from '@/app/startup-visibility-os/startup-visibility.module.css';

// Session verification helper
async function verifyPurchaseSession(sessionId) {
    if (!sessionId) return false;

    // Allow mock sessions for local sandbox testing
    if (sessionId.startsWith('mock_')) {
        return true;
    }

    // Production Integration with Dodo Payments / Stripe:
    // try {
    //     const res = await fetch(`https://api.dodopayments.com/v1/checkout-sessions/${sessionId}`, {
    //         headers: {
    //             'Authorization': `Bearer ${process.env.DODO_PAYMENTS_API_KEY}`
    //         }
    //     });
    //     const session = await res.json();
    //     // Verify payment was successful
    //     return session.payment_status === 'succeeded' || session.status === 'completed';
    // } catch (e) {
    //     console.error('Session verification exception:', e);
    //     return false;
    // }

    return false;
}

export const metadata = {
    title: 'Access Startup Visibility OS - LaunchXact',
    description: 'Secure download area for your purchased Startup Visibility OS.',
    robots: { index: false, follow: false } // Do not index success page in search results
};

export default async function SuccessPage({ searchParams }) {
    const { session_id } = await searchParams;

    const isValid = await verifyPurchaseSession(session_id);

    if (!isValid) {
        // Redirect to homepage if visited unauthorized or link is broken
        redirect('/');
    }

    return (
        <div className={styles.page} style={{ paddingTop: '8rem' }}>
            <div className={styles.container}>
                <div className={styles.successWrapper}>
                    <FontAwesomeIcon icon={faCheckCircle} className={styles.successIcon} />
                    <h1 style={{ fontFamily: 'var(--font-serif)', color: '#fff', fontSize: 'clamp(2rem, 6vw, 3rem)', marginBottom: '1rem' }}>
                        Your Startup Visibility OS is Ready
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '3rem' }}>
                        Thank you for your purchase! We have verified your session. You can now access and download all your assets below.
                    </p>

                    <div className={styles.downloadCard}>
                        <h2 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '1.5rem', textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem' }}>
                            Your Digital Assets Bundle
                        </h2>

                        <div className={styles.downloadList}>
                            {/* PDF Download 1 */}
                            <div className={styles.downloadRow}>
                                <div className={styles.downloadInfo}>
                                    <div className={styles.downloadLabel}>Quick Wins Guide</div>
                                    <div className={styles.downloadSublabel}>PDF Document (10-15 pages workbook)</div>
                                </div>
                                <a 
                                    href={`/api/download?session_id=${session_id}&file=quick-wins-guide`} 
                                    className="btn btn-primary" 
                                    style={{ padding: '0.6rem 1.5rem', fontSize: '0.9rem' }}
                                >
                                    <FontAwesomeIcon icon={faFilePdf} style={{ marginRight: '0.5rem' }} /> Download PDF
                                </a>
                            </div>

                            {/* PDF Download 2 */}
                            <div className={styles.downloadRow}>
                                <div className={styles.downloadInfo}>
                                    <div className={styles.downloadLabel}>Founder Story PDF</div>
                                    <div className={styles.downloadSublabel}>"Why Nobody Knew My Startup Existed"</div>
                                </div>
                                <a 
                                    href={`/api/download?session_id=${session_id}&file=founder-story`} 
                                    className="btn btn-primary" 
                                    style={{ padding: '0.6rem 1.5rem', fontSize: '0.9rem' }}
                                >
                                    <FontAwesomeIcon icon={faFilePdf} style={{ marginRight: '0.5rem' }} /> Download PDF
                                </a>
                            </div>

                            {/* Google Doc Templates */}
                            <div className={styles.downloadRow}>
                                <div className={styles.downloadInfo}>
                                    <div className={styles.downloadLabel}>Copy-Paste Templates</div>
                                    <div className={styles.downloadSublabel}>Google Doc (File &rarr; Make a Copy to edit)</div>
                                </div>
                                <a 
                                    href={`/api/access?session_id=${session_id}&asset=google_doc_templates`} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="btn btn-secondary" 
                                    style={{ padding: '0.6rem 1.5rem', fontSize: '0.9rem' }}
                                >
                                    <FontAwesomeIcon icon={faFileAlt} style={{ marginRight: '0.5rem' }} /> Open Templates <FontAwesomeIcon icon={faExternalLinkAlt} style={{ marginLeft: '0.5rem', fontSize: '0.8rem' }} />
                                </a>
                            </div>

                            {/* Google Sheets Database */}
                            <div className={styles.downloadRow}>
                                <div className={styles.downloadInfo}>
                                    <div className={styles.downloadLabel}>Startup Visibility Database</div>
                                    <div className={styles.downloadSublabel}>Google Sheet (File &rarr; Make a Copy to edit)</div>
                                </div>
                                <a 
                                    href={`/api/access?session_id=${session_id}&asset=google_sheet_database`} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="btn btn-secondary" 
                                    style={{ padding: '0.6rem 1.5rem', fontSize: '0.9rem' }}
                                >
                                    <FontAwesomeIcon icon={faTable} style={{ marginRight: '0.5rem' }} /> Open Database <FontAwesomeIcon icon={faExternalLinkAlt} style={{ marginLeft: '0.5rem', fontSize: '0.8rem' }} />
                                </a>
                            </div>

                            {/* Notion Workspace */}
                            <div className={styles.downloadRow}>
                                <div className={styles.downloadInfo}>
                                    <div className={styles.downloadLabel}>Notion Distribution Template</div>
                                    <div className={styles.downloadSublabel}>Notion Page (Click "Duplicate" in top right)</div>
                                </div>
                                <a 
                                    href={`/api/access?session_id=${session_id}&asset=notion_template`} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="btn btn-secondary" 
                                    style={{ padding: '0.6rem 1.5rem', fontSize: '0.9rem' }}
                                >
                                    <FontAwesomeIcon icon={faExternalLinkAlt} style={{ marginRight: '0.5rem' }} /> Access Notion Template
                                </a>
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: '3rem', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.04)', textAlign: 'left' }}>
                        <h4 style={{ color: '#fff', marginBottom: '0.5rem' }}>Important: Save your links</h4>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', margin: 0 }}>
                            Please bookmark this page or keep this session URL (`session_id={session_id}`) safe. You will need it to access these downloads in the future. If you have any issues, contact us at hello@launchxact.com.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
