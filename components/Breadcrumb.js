import Link from 'next/link';
import styles from './Breadcrumb.module.css';

/**
 * Reusable visual & semantic Breadcrumb navigation
 * Prevents duplicate 'Home' elements if passed by the caller
 * @param {Array} items - Array of { label: string, href?: string }
 */
export default function Breadcrumb({ items = [] }) {
    // If the caller already provided 'Home' as the first item, don't duplicate it
    const cleanItems = items.filter((item, idx) => {
        if (idx === 0 && (item.label?.toLowerCase() === 'home' || item.href === '/')) {
            return false;
        }
        return true;
    });

    const allItems = [
        { label: 'Home', href: '/' },
        ...cleanItems
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
