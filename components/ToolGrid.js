import ToolCard from './ToolCard';
import styles from './ToolGrid.module.css';

export default function ToolGrid({ tools, title }) {
    if (!tools || tools.length === 0) return null;

    return (
        <section className={styles.section}>
            <div className={`container ${styles.container}`}>
                {title && <h2 className={styles.title}>{title}</h2>}
                <div className={styles.grid}>
                    {tools.map((tool) => (
                        <ToolCard key={tool.id} tool={tool} />
                    ))}
                </div>
            </div>
        </section>
    );
}
