import Link from 'next/link';
import styles from './FounderCTA.module.css';

export default function FounderCTA() {
    return (
        <section className={styles.ctaSection}>
            <div className={`container ${styles.container}`}>
                <div className={`glass-panel ${styles.panel}`}>
                    <h2 className={styles.headline}>Built something new?</h2>
                    <p className={styles.text}>
                        List your product on LaunchXact and reach early adopters.
                    </p>
                    <Link href="/submit" className="btn btn-primary">
                        Submit your product
                    </Link>
                </div>
            </div>
        </section>
    );
}
