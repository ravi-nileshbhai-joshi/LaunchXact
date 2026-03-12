import { getToolById, getAllTools } from '../../../lib/data';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import styles from './page.module.css';
import Script from 'next/script';

export async function generateMetadata({ params }) {
    const { id } = await params;
    const tool = getToolById(id);

    if (!tool) return { title: 'Product Not Found' };

    return {
        title: `${tool.name} - Curated SaaS | LaunchXact Marketplace`,
        description: `${tool.description} - Discover ${tool.name} on the LaunchXact premium multi-vendor SaaS marketplace.`,
        openGraph: {
            title: `${tool.name} | LaunchXact`,
            description: tool.tagline,
            images: [{ url: '/opengraph-image.png' }], // Fallback to global OG
        }
    };
}

export async function generateStaticParams() {
    const tools = getAllTools();
    return tools.map((tool) => ({
        id: tool.id,
    }));
}

export default async function ProductDetail({ params }) {
    const { id } = await params;
    const tool = getToolById(id);

    if (!tool) {
        notFound();
    }

    const productJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: tool.name,
        description: tool.description,
        applicationCategory: tool.category,
        operatingSystem: 'Web',
        offers: {
            '@type': 'Offer',
            price: tool.price.includes('$') ? tool.price.replace(/[^\d.]/g, '') : '0',
            priceCurrency: 'USD',
        },
        url: `https://launchxact.com/product/${id}`,
        creator: {
            '@type': 'Organization',
            name: 'LaunchXact',
            url: 'https://launchxact.com',
        },
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
            />
            <div className={styles.container}>
            <div className={styles.grid}>
                <div className={styles.left}>
                    <div
                        className={styles.logoPlaceholder}
                        style={{ background: tool.logoColor || 'var(--primary)' }}
                    >
                        {tool.name[0]}
                    </div>
                    <h1 className={styles.name}>{tool.name}</h1>
                    <p className={styles.tagline}>{tool.tagline}</p>

                    <div className={styles.meta}>
                        <div className={styles.metaItem}>
                            <span className={styles.label}>Category</span>
                            <span className={styles.value}>{tool.category}</span>
                        </div>
                        <div className={styles.metaItem}>
                            <span className={styles.label}>Price</span>
                            <span className={styles.value}>{tool.price}</span>
                        </div>
                    </div>

                    <a href={tool.website} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                        Visit Website
                    </a>
                </div>

                <div className={`glass-panel ${styles.right}`}>
                    <h2 className={styles.sectionTitle}>About {tool.name}</h2>
                    <p className={styles.description}>{tool.description}</p>

                    {/* Screenshot placeholder */}
                    <div className={styles.screenshot}>
                        <div className={styles.screenshotPlaceholder}>
                            Screenshot of {tool.name}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}
