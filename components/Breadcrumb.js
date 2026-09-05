import Link from 'next/link';
import styles from './Breadcrumb.module.css';

/**
 * Reusable visual & semantic Breadcrumb navigation
 * @param {Array} items - Array of { label: string, href?: string }
 */
export default function Breadcrumb({ items = [] }) {
    const allItems = [
        { label: 'Home', href: '/' },
        ...items
    ];

    return (
        <nav aria-label="Breadcrumb" className={styles.breadcrumbNav}>
            <ol className={styles.breadcrumbList}>
                {allItems.map((item, index) => {
                    const isLast = index === allItems.length - 1;
                    return (
                        <li key={index} className={styles.breadcrumbItem}>
                            {index > 0 && <span className={styles.separator} aria-hidden="true">/</span>}
                            {item.href && !isLast ? (
                                <Link href={item.href} className={styles.breadcrumbLink}>
                                    {item.label}
                                </Link>
                            ) : (
                                <span className={styles.currentPage} aria-current={isLast ? 'page' : undefined}>
                                    {item.label}
                                </span>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
