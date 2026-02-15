import Link from 'next/link';
import styles from './Hero.module.css';

export default function Hero() {
    return (
        <section className={styles.hero}>
            <div className={`container ${styles.container}`}>
                <h1 className={styles.headline}>
                    Launch and discover the next generation of <span className={styles.highlight}>indie SaaS tools</span>
                </h1>
                <p className={styles.subheadline}>
                    A curated platform where founders showcase their products and early adopters discover new software.
                </p>
                <div className={styles.actions}>
                    <Link href="/explore" className="btn btn-primary">
                        Explore tools
                    </Link>
                    <Link href="/submit" className="btn btn-secondary">
                        Submit your product
                    </Link>
                </div>
            </div>
        </section>
    );
}
