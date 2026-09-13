import { getArticleData, getAllArticleIds } from '@/lib/articles';
import ReactMarkdown from 'react-markdown';
import styles from '../page.module.css';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';

// Enable dynamic params so dynamically published articles from founders render immediately
export const dynamicParams = true;
export const revalidate = 30;

export async function generateStaticParams() {
    const paths = getAllArticleIds();
    return paths.map((path) => ({
        slug: path.params.slug,
    }));
}

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const articleData = await getArticleData(slug);
    if (!articleData) {
        return { title: 'Article Not Found | LaunchXact' };
    }

    return {
        title: `${articleData.title} | LaunchXact Articles`,
        description: articleData.description,
        alternates: { canonical: `/articles/${slug}` },
        openGraph: {
            title: `${articleData.title} | LaunchXact`,
            description: articleData.description,
            type: 'article',
            publishedTime: articleData.date,
            authors: [articleData.author || 'LaunchXact Team'],
        },
        twitter: {
            card: 'summary_large_image',
            title: `${articleData.title} | LaunchXact`,
            description: articleData.description,
        }
    };
}

export default async function Article({ params }) {
    const { slug } = await params;
    const articleData = await getArticleData(slug);

    if (!articleData) {
        return (
            <div className={styles.articleContainer}>
                <h1 style={{ textAlign: 'center', marginTop: '100px', color: '#0f172a' }}>Article not found.</h1>
                <p style={{ textAlign: 'center', color: '#64748b' }}>The article you are looking for may have moved or is pending publication.</p>
                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                    <Link href="/articles" className="btn btn-primary">
                        Browse All Articles
                    </Link>
                </div>
            </div>
        );
    }

    const { title, date, author, contentMarkdown, domain, websiteUrl } = articleData;

    const articleJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: title,
        datePublished: date,
        isPartOf: {
            '@type': 'WebSite',
            '@id': 'https://www.launchxact.com/#website'
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `https://www.launchxact.com/articles/${slug}`
        },
        author: {
            '@type': 'Person',
            name: author || 'LaunchXact Team',
        },
        publisher: {
            '@type': 'Organization',
            name: 'LaunchXact',
            url: 'https://www.launchxact.com',
            logo: {
                '@type': 'ImageObject',
                url: 'https://www.launchxact.com/icon.png'
            }
        }
    };

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
            },
            {
                '@type': 'ListItem',
                position: 3,
                name: title,
                item: `https://www.launchxact.com/articles/${slug}`
            }
        ]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
            
            <article className={styles.articleContainer}>
                <Breadcrumb items={[
                    { label: 'Articles', href: '/articles' },
                    { label: title }
                ]} />

                <header className={styles.articleHeader}>
                    <h1 className={styles.title} style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#0f172a' }}>
                        {title}
                    </h1>
                    
                    <div className={styles.articleMeta} style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                        <time dateTime={date} style={{ color: '#64748b' }}>
                            {new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </time>
                        <span style={{ color: '#cbd5e1' }}>•</span>
                        <span style={{ color: '#0f172a', fontWeight: 600 }}>{author || 'LaunchXact Team'}</span>
                        
                        {(websiteUrl || domain) && (
                            <>
                                <span style={{ color: '#cbd5e1' }}>•</span>
                                <a
                                    href={websiteUrl || `https://${domain}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.35rem',
                                        padding: '0.25rem 0.75rem',
                                        background: '#ecfdf5',
                                        border: '1px solid #a7f3d0',
                                        color: '#047857',
                                        borderRadius: '9999px',
                                        fontSize: '0.82rem',
                                        fontWeight: 700,
                                        textDecoration: 'none'
                                    }}
                                >
                                    🌐 Verified Product: {domain || websiteUrl} &rarr;
                                </a>
                            </>
                        )}
                    </div>
                </header>

                <div className={styles.content}>
                    <ReactMarkdown>{contentMarkdown}</ReactMarkdown>
                </div>

                {/* Direct CTA Back to Founder Website or LaunchXact */}
                <div className={styles.articleCtaBox}>
                    <h2 className={styles.articleCtaTitle}>
                        {websiteUrl ? `Explore ${domain || 'This Product'}` : 'Ready to launch your SaaS?'}
                    </h2>
                    <p className={styles.articleCtaDesc}>
                        {websiteUrl 
                            ? `Discover how ${domain || 'this platform'} solves real engineering bottlenecks. Check out live demo and feature roadmap.`
                            : 'Join the next curated collection of high-value tools on LaunchXact. Get early visibility and reach serious adopters.'}
                    </p>
                    {websiteUrl ? (
                        <a
                            href={websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary"
                            style={{ padding: '1rem 2.5rem' }}
                        >
                            🚀 Visit {domain || 'Official Website'} &rarr;
                        </a>
                    ) : (
                        <Link href="/grade" className="btn btn-primary" style={{ padding: '1rem 2.5rem' }}>
                            ⚡ Grade Your Landing Page
                        </Link>
                    )}
                </div>

                <div style={{ marginTop: '5rem', textAlign: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '3rem' }}>
                    <Link href="/articles" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>
                        &larr; Back to all articles
                    </Link>
                </div>
            </article>
        </>
    );
}
