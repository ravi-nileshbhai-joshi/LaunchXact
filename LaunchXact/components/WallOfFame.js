'use client';
import { useEffect, useState } from 'react';
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
                    .limit(10);

                if (error) throw error;
                // Only duplicate for scroll if we have enough items (e.g., > 2)
                if (data.length > 2) {
                    setResults([...data, ...data]);
                } else {
                    setResults(data);
                }
            } catch (err) {
                console.error('Wall of Fame Fetch Error:', err);
            } finally {
                setLoading(false);
            }
        }

        fetchResults();

        // Subscribe to new results
        const channel = supabase
            .channel('grader_results_realtime')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'grader_results' }, (payload) => {
                setResults(prev => {
                    const newResult = payload.new;
                    const combined = [newResult, ...prev.filter(r => r.id !== newResult.id)];
                    // If we just crossed the threshold for scrolling, duplicate
                    if (combined.length > 2) {
                        return [...combined, ...combined].slice(0, 20); // Keep it reasonable
                    }
                    return combined;
                });
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const getScoreClass = (score) => {
        if (score >= 80) return styles.scoreGreen;
        if (score >= 50) return styles.scoreAmber;
        return styles.scoreRed;
    };

    if (loading || results.length === 0) return null;

    const isScrolling = results.length > 2;

    return (
        <section className={styles.wallSection}>
            <h3 className={styles.title}>Live Audit Stream</h3>
            <div className={`${styles.tickerContainer} ${isScrolling ? styles.animateTicker : styles.staticTicker}`}>
                {results.map((item, idx) => (
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
                        <div className={styles.time}>
                            {new Date(item.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
