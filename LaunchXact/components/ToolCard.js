import Link from 'next/link';
import styles from './ToolCard.module.css';

export default function ToolCard({ tool }) {
    return (
        <div className={`glass-panel ${styles.card}`}>
            <div className={styles.header}>
                {/* Placeholder for Logo if image not available */}
                <div className={styles.logoPlaceholder}>{tool.name[0]}</div>
                <h3 className={styles.name}>{tool.name}</h3>
            </div>
            <p className={styles.tagline}>{tool.tagline}</p>
            <div className={styles.footer}>
                <span className={styles.category}>{tool.category}</span>
                <Link href={`/product/${tool.id}`} className={styles.viewBtn}>
                    View
                </Link>
            </div>
        </div>
    );
}
