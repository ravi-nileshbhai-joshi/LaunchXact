'use client';
import styles from '@/app/startup-visibility-os/startup-visibility.module.css';

export default function FounderStory({ founderStory }) {
    return (
        <section className={`${styles.section} ${styles.storySection}`}>
            <div className={styles.container}>
                <span className={styles.sectionLabel}>Founder Story</span>
                <h2 className={styles.sectionHeading}>
                    Why this framework <span className={styles.accentWord}>exists</span>
                </h2>
                <div className={styles.storyWrapper}>
                    <blockquote className={styles.quoteBlock}>
                        "{founderStory.quote}"
                    </blockquote>
                    <div className={styles.storySignature}>
                        <p className={styles.sigName}>— {founderStory.signature}</p>
                        <p className={styles.sigTitle}>{founderStory.title}</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
