'use client';
import styles from '@/app/startup-visibility-os/startup-visibility.module.css';

export default function EmpathyGrid({ painPoints }) {
    return (
        <section className={`${styles.section} ${styles.empathySection}`}>
            <div className={styles.container}>
                <span className={styles.sectionLabel}>Does this sound familiar?</span>
                <div className={styles.empathyInner}>
                    <div className={styles.empathyCard}>
                        <h2 className={styles.empathyTitle}>{painPoints.title}</h2>
                        <ul className={styles.empathyList}>
                            {painPoints.items.map((item, idx) => (
                                <li key={idx}>
                                    <span className={styles.crossIcon}>✕</span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                        <p className={styles.empathyOutcome}>{painPoints.outcome}</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
