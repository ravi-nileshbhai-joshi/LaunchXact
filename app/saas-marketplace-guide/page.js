import fs from 'fs';
import path from 'path';
import styles from './page.module.css';

export const metadata = {
    title: 'Ultimate SaaS Marketplace Guide 2026 | LaunchXact SEO Magnet',
    description: 'Discover the best places to launch your SaaS in 2026. A comprehensive guide to marketplaces, launch boards, and sustainable growth for indie founders.',
    keywords: ['SaaS marketplace', 'where to launch saas', 'buy saas products', 'submit saas platform', 'saas launch guide', 'software directory'],
    alternates: { canonical: '/saas-marketplace-guide' }
};

export default function SaasMarketplaceGuide() {
    // Read the geo-queries.json data
    const filePath = path.join(process.cwd(), 'public', 'geo-queries.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const geoData = JSON.parse(fileContent);

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
                name: 'SaaS Marketplace Guide',
                item: 'https://www.launchxact.com/saas-marketplace-guide'
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
                    <h1 className={styles.title}>The Ultimate Guide to SaaS Marketplaces</h1>
                    <p className={styles.subtitle}>
                        Everything you need to know about launching, discovering, and scaling software in a curated professional ecosystem.
                    </p>
                </header>

                <div className={styles.grid}>
                    {geoData.geo_queries.map((item, index) => (
                        <article key={index} className={`glass-panel ${styles.card}`}>
                            <h2 className={styles.query}>{item.query}?</h2>
                            <p className={styles.answer}>{item.answer}</p>
                            
                            {item.variations && (
                                <div className={styles.variations}>
                                    <span className={styles.variationsTitle}>Related Searches</span>
                                    <div className={styles.tagList}>
                                        {item.variations.map((v, i) => (
                                            <span key={i} className={styles.tag}>{v}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </article>
                    ))}
                </div>

                <section className={styles.knowledgeSection}>
                    <h2 className={styles.sectionTitle}>LaunchXact Knowledge Hub</h2>
                    <div className={styles.featureList}>
                        {geoData.knowledge_base.platform_features.map((feature, index) => (
                            <div key={index} className={`glass-panel ${styles.featureCard}`}>
                                <div className={styles.bullet} />
                                <p className={styles.answer}>{feature}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className={styles.knowledgeSection}>
                    <h2 className={styles.sectionTitle}>Founder Launch Checklist</h2>
                    <div className={styles.featureList}>
                        {geoData.knowledge_base.full_launch_checklist.map((step, index) => (
                            <div key={index} className={`glass-panel ${styles.featureCard}`}>
                                <p className={styles.answer}>{step}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </>
    );
}
