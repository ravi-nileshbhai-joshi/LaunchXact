'use client';
import styles from '@/app/startup-visibility-os/startup-visibility.module.css';

export default function ProductHero({ product }) {
    const handleAction = () => {
        window.location.href = '/#founder-form';
    };

    const scrollToInside = () => {
        document.getElementById('whats-inside')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className={styles.hero}>
            <div className={styles.heroContent}>
                <span className={styles.badge}>✦ FEATURED PRODUCT</span>

                <h1 className={styles.heroHeadline}>
                    {product.headline}<br />
                    <span className={styles.heroAccent}>without paid ads.</span>
                </h1>

                <p className={styles.heroSublineTop}>{product.subheadline_top}</p>
                <p className={styles.heroSubline}>{product.subheadline}</p>

                <div className={styles.heroActions}>
                    <button onClick={handleAction} className={styles.heroCta}>
                        {product.ctaText}
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M3 8h10M8 3l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                    <button onClick={scrollToInside} className={styles.heroCtaSecondary}>
                        {product.secondaryCtaText}
                    </button>
                </div>

                <div className={styles.socialProof}>
                    <span className={styles.stars}>★★★★★</span>
                    <span>300+ founders already building their visibility systems</span>
                </div>
            </div>
        </section>
    );
}
