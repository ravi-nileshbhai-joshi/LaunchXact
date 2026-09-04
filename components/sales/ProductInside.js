'use client';
import styles from '@/app/startup-visibility-os/startup-visibility.module.css';

export default function ProductInside({ inside }) {
    return (
        <section id="whats-inside" className={`${styles.section} ${styles.insideSection}`}>
            <div className={styles.container}>
                <span className={styles.sectionLabel}>What's Inside</span>
                <h2 className={styles.sectionHeading}>
                    Everything you need to get{' '}
                    <span className={styles.accentWord}>discovered</span>
                </h2>
                <p className={styles.sectionSub}>
                    The frameworks, templates, and databases included in your Startup Visibility OS bundle — ready to use from day one.
                </p>
                <div className={styles.insideGrid}>
                    {inside.map((item, idx) => (
                        <div key={idx} className={styles.insideCard}>
                            <div className={styles.insideCardHeader}>
                                <span className={styles.checkIcon}>✓</span>
                                <h3 className={styles.insideCardTitle}>{item.title}</h3>
                            </div>
                            <p className={styles.insideCardDesc}>{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
