import { getToolById, getAllTools } from '../../../lib/data';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import styles from './page.module.css';

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

    return (
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
    );
}
