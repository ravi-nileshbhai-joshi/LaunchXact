'use client';
import { useState } from 'react';
import styles from '@/app/startup-visibility-os/startup-visibility.module.css';

export default function FaqAccordion({ faq }) {
    const [openIdx, setOpenIdx] = useState(null);

    return (
        <section className={`${styles.section} ${styles.faqSection}`}>
            <div className={styles.container}>
                <span className={styles.sectionLabel}>FAQ</span>
                <h2 className={styles.sectionHeading}>
                    Questions? <span className={styles.accentWord}>Answered.</span>
                </h2>
                <p className={styles.sectionSub}>
                    Everything you need to know before investing in the Startup Visibility OS.
                </p>

                <div className={styles.faqList}>
                    {faq.map((item, idx) => {
                        const isOpen = openIdx === idx;
                        return (
                            <div key={idx} className={styles.faqItem}>
                                <button
                                    onClick={() => setOpenIdx(isOpen ? null : idx)}
                                    className={styles.faqQuestion}
                                    aria-expanded={isOpen}
                                    id={`faq-q-${idx}`}
                                >
                                    <span>{item.question}</span>
                                    <svg
                                        className={`${styles.faqArrow} ${isOpen ? styles.faqArrowOpen : ''}`}
                                        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                                        strokeLinecap="round" strokeLinejoin="round"
                                    >
                                        <path d="M6 9l6 6 6-6"/>
                                    </svg>
                                </button>
                                <div
                                    className={`${styles.faqAnswer} ${isOpen ? styles.faqAnswerOpen : ''}`}
                                    id={`faq-a-${idx}`}
                                    role="region"
                                    aria-labelledby={`faq-q-${idx}`}
                                >
                                    <p>{item.answer}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
