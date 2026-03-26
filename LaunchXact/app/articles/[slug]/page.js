import { getArticleData, getAllArticleIds } from '@/lib/articles';
import ReactMarkdown from 'react-markdown';
import styles from '../page.module.css';
import Link from 'next/link';

export const dynamicParams = false;

export async function generateStaticParams() {
    const paths = getAllArticleIds();
    return paths.map((path) => ({
        slug: path.params.slug,
    }));
}

export async function generateMetadata({ params }) {
    const articleData = await getArticleData(params.slug);
    if (!articleData) {
        return { title: 'Article Not Found | LaunchXact' };
    }

    return {
        title: `${articleData.title} | LaunchXact Articles`,
        description: articleData.description,
        alternates: { canonical: `/articles/${params.slug}` },
        openGraph: {
            title: articleData.title,
            description: articleData.description,
            type: 'article',
            publishedTime: articleData.date,
            authors: [articleData.author || 'LaunchXact'],
        }
    };
}

export default async function Article({ params }) {
    const articleData = await getArticleData(params.slug);

    if (!articleData) {
        return (
            <div className={styles.articleContainer}>
                <h1 style={{ textAlign: 'center', marginTop: '100px' }}>Article not found.</h1>
            </div>
        );
    }

    const { title, date, author, contentMarkdown } = articleData;

    const articleJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: title,
        datePublished: date,
        author: {
            '@type': 'Person',
            name: author || 'LaunchXact Team',
        },
        publisher: {
            '@type': 'Organization',
            name: 'LaunchXact',
            logo: {
                '@type': 'ImageObject',
                url: 'https://www.launchxact.com/icon'
            }
        }
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
            />
            
            <article className={styles.articleContainer}>
                <header className={styles.articleHeader}>
                    <h1 className={styles.title} style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>{title}</h1>
                    <div className={styles.articleMeta}>
                        <time dateTime={date}>{new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
                        <span>•</span>
                        <span>{author || 'LaunchXact Team'}</span>
                    </div>
                </header>

                <div className={styles.content}>
                    <ReactMarkdown>{contentMarkdown}</ReactMarkdown>
                </div>

                <div style={{ marginTop: '5rem', textAlign: 'center', borderTop: '1px solid var(--glass-border)', paddingTop: '3rem' }}>
                    <Link href="/articles" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>
                        &larr; Back to all articles
                    </Link>
                </div>
            </article>
        </>
    );
}
