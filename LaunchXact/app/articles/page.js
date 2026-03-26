import Link from 'next/link';
import { getSortedArticlesData } from '@/lib/articles';
import styles from './page.module.css';

export const metadata = {
    title: 'SaaS Launch Articles & Founder Resources | LaunchXact',
    description: 'Read the latest guides, founder interviews, and tactical resources for launching and scaling high-value SaaS products.',
    alternates: { canonical: '/articles' }
};

export default function ArticlesHub() {
    const allArticlesData = getSortedArticlesData();

    const breadcrumbJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://www.launchxact.com'
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: 'Articles',
                item: 'https://www.launchxact.com/articles'
            }
        ]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
            <div className={styles.container}>
                <header className={styles.header}>
                    <h1 className={styles.title}>Articles & Resources</h1>
                    <p className={styles.subtitle}>
                        Tactical guides, SEO deep-dives, and real-world advice for building, launching, and scaling your SaaS.
                    </p>
                </header>

                {allArticlesData.length === 0 ? (
                    <div style={{ textAlign: 'center', opacity: 0.7, marginTop: '4rem' }}>
                        <p>No articles published yet. Check back soon!</p>
                    </div>
                ) : (
                    <div className={styles.grid}>
                        {allArticlesData.map(({ id, date, title, description, author }) => (
                            <Link href={`/articles/${id}`} key={id} className={`glass-panel ${styles.card}`}>
                                <div className={styles.meta}>
                                    <time dateTime={date}>{new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
                                    <span>{author || 'LaunchXact Team'}</span>
                                </div>
                                <h2 className={styles.cardTitle}>{title}</h2>
                                <p className={styles.cardDesc}>{description}</p>
                                <span className={styles.readMore}>Read Article &rarr;</span>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
