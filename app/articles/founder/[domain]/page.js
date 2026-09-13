import Link from 'next/link';
import { getArticlesByDomain } from '@/lib/articles';
import Breadcrumb from '@/components/Breadcrumb';
import styles from '../../page.module.css';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
    const { domain } = await params;
    const cleanDomain = decodeURIComponent(domain);
    return {
        title: `${cleanDomain} - Articles, Guides & Engineering Notes | LaunchXact`,
        description: `Read official technical articles, product deep dives, and founder updates published by ${cleanDomain}.`,
        alternates: { canonical: `/articles/founder/${domain}` }
    };
}

export default async function FounderArticlesHub({ params }) {
    const { domain } = await params;
    const cleanDomain = decodeURIComponent(domain);
    const domainArticles = getArticlesByDomain(cleanDomain);

    const founderSiteUrl = cleanDomain.startsWith('http') ? cleanDomain : `https://${cleanDomain}`;

    return (
        <div className={styles.container} style={{ maxWidth: '1100px', margin: '0 auto', paddingTop: 'clamp(110px, 14vh, 135px)', paddingBottom: '6rem', paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
            <Breadcrumb items={[
                { label: 'Articles', href: '/articles' },
                { label: `Founder: ${cleanDomain}` }
            ]} />

            <header className={styles.header} style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.4rem 1rem',
                    background: '#ecfdf5',
                    border: '1px solid #a7f3d0',
                    borderRadius: '9999px',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: '#047857',
                    marginBottom: '1rem'
                }}>
                    🌐 Official Founder Engineering & SEO Hub
                </div>
                <h1 className={styles.title} style={{ fontSize: 'clamp(2.2rem, 4vw, 3rem)', color: '#0f172a', fontWeight: 800 }}>
                    {cleanDomain} Articles & Playbooks
                </h1>
                <p className={styles.subtitle} style={{ color: '#475569', fontSize: '1.1rem', maxWidth: '700px', margin: '0.5rem auto 1.5rem' }}>
                    Technical deep-dives, architectural teardowns, and problem-to-solution guides authored by the team at {cleanDomain}.
                </p>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <a
                        href={founderSiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary"
                        style={{ padding: '0.65rem 1.5rem', fontSize: '0.95rem' }}
                    >
                        🚀 Visit {cleanDomain} Website &rarr;
                    </a>
                    <Link
                        href="/tools/auto-blog-generator"
                        className="btn btn-secondary"
                        style={{ padding: '0.65rem 1.5rem', fontSize: '0.95rem', background: '#ffffff', border: '1.5px solid #cbd5e1', color: '#0f172a' }}
                    >
                        ✍️ Publish New Article for This Site
                    </Link>
                </div>
            </header>

            {domainArticles.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 2rem', background: '#f8fafc', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
                    <h3 style={{ color: '#0f172a', marginBottom: '0.5rem' }}>No articles published yet for {cleanDomain}</h3>
                    <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
                        Generate your first human-voice problem/solution article in 60 seconds using our autonomous engine.
                    </p>
                    <Link href="/tools/auto-blog-generator" className="btn btn-primary">
                        ⚡ Generate Article for {cleanDomain}
                    </Link>
                </div>
            ) : (
                <div className={styles.grid}>
                    {domainArticles.map(({ id, date, title, description, author }) => (
                        <Link href={`/articles/${id}`} key={id} className={`glass-panel ${styles.card}`} style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}>
                            <div className={styles.meta} style={{ color: '#64748b' }}>
                                <time dateTime={date}>{new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
                                <span>•</span>
                                <span>{author || cleanDomain}</span>
                            </div>
                            <h2 className={styles.cardTitle} style={{ color: '#0f172a' }}>{title}</h2>
                            <p className={styles.cardDesc} style={{ color: '#475569' }}>{description}</p>
                            <span className={styles.readMore} style={{ color: '#7c3aed', fontWeight: 700 }}>Read Full Article &rarr;</span>
                        </Link>
                    ))}
                </div>
            )}

            {/* Drop-in Embed Code for Founder */}
            <div style={{ marginTop: '4rem', background: '#faf5ff', border: '1.5px solid #ddd6fe', borderRadius: '1rem', padding: '2rem' }}>
                <h3 style={{ margin: '0 0 0.5rem', color: '#4c1d95', fontSize: '1.25rem', fontWeight: 800 }}>
                    ⚡ Embed This Articles Page Directly on {cleanDomain}
                </h3>
                <p style={{ margin: '0 0 1rem', color: '#5b21b6', fontSize: '0.92rem' }}>
                    If your website doesn&apos;t have a built-in articles engine, copy and paste this 1-line snippet into your HTML or React layout to instantly host your /articles page on your own domain:
                </p>
                <div style={{ background: '#0f172a', borderRadius: '0.5rem', padding: '1rem', color: '#38bdf8', fontFamily: 'monospace', fontSize: '0.85rem', overflowX: 'auto' }}>
                    {`<div id="launchxact-articles" data-site="${cleanDomain}"></div>\n<script src="https://www.launchxact.com/api/tools/auto-blog/embed.js?site=${cleanDomain}" async></script>`}
                </div>
            </div>
        </div>
    );
}
