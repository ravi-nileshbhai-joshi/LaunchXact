'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import styles from './WallOfFame.module.css';

export default function WallOfFame() {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchResults() {
            try {
                const { data, error } = await supabase
                    .from('grader_results')
                    .select('*')
                    .order('created_at', { ascending: false })
                    .limit(20);

                if (error) throw error;
                setResults(data || []);
            } catch (err) {
                console.error('Error fetching wall of fame:', err);
            } finally {
                setLoading(false);
            }
        }

        fetchResults();

        // Optional: Real-time subscription to new grades
        const channel = supabase
            .channel('grader_results_changes')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'grader_results' }, 
            payload => {
                setResults(prev => [payload.new, ...prev].slice(0, 20));
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    if (loading) return null;
    if (results.length === 0) return null;

    const getScoreClass = (score) => {
        if (score >= 80) return styles.scoreGreen;
        if (score >= 50) return styles.scoreAmber;
        return styles.scoreRed;
    };

    return (
        <section className={styles.container}>
            <h2 className={styles.title}>Live Audit Stream</h2>
            <div className={`${styles.ticker} ${results.length > 5 ? styles.tickerAnimated : styles.tickerStatic}`}>
                {/* Double the array for seamless infinite scroll if enough items */}
                {[...results, ...(results.length > 5 ? results : [])].map((item, idx) => (
                    <div key={`${item.id}-${idx}`} className={styles.card}>
                        <div className={styles.header}>
                            <span className={styles.productName}>{item.product_name}</span>
                            <span className={`${styles.score} ${getScoreClass(item.score)}`}>
                                {item.score}/100
                            </span>
                        </div>
                        <div className={styles.archetype}>
                            {item.archetype}
                        </div>
                        <div className={styles.url}>
                            {item.url.replace(/^https?:\/\//, '').split('/')[0]}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
