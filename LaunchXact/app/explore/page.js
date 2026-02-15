'use client';

import { useState } from 'react';
import { getAllTools } from '../../lib/data';
import ToolGrid from '../../components/ToolGrid';
import styles from './page.module.css';

const categories = ['All', 'Developer Tools', 'Analytics', 'Marketing', 'Productivity', 'Design', 'Hosting'];

export default function Explore() {
    const [activeCategory, setActiveCategory] = useState('All');
    const allTools = getAllTools();

    const filteredTools = activeCategory === 'All'
        ? allTools
        : allTools.filter(tool => tool.category === activeCategory);

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div className="container">
                    <h1 className={styles.title}>Explore Tools</h1>
                    <p className={styles.subtitle}>Discover the best new SaaS products, curated for you.</p>

                    <div className={styles.filters}>
                        {categories.map(category => (
                            <button
                                key={category}
                                className={`${styles.filterBtn} ${activeCategory === category ? styles.active : ''}`}
                                onClick={() => setActiveCategory(category)}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            <ToolGrid tools={filteredTools} />
        </div>
    );
}
