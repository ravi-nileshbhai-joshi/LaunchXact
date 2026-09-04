'use client';
import { useState } from 'react';
import styles from '@/app/startup-visibility-os/startup-visibility.module.css';

export default function ImplementationTimeline({ daysPlan }) {
    const [activeIdx, setActiveIdx] = useState(0);
    const activeDay = daysPlan.days[activeIdx];

    return (
        <section className={`${styles.section} ${styles.sectionAlt}`}>
            <div className={styles.container}>
                <span className={styles.sectionLabel}>Implementation Plan</span>
                <h2 className={styles.sectionHeading}>
                    {daysPlan.title}
                </h2>
                <p className={styles.sectionSub}>{daysPlan.description}</p>

                <div className={styles.timelineWrapper}>
                    {/* Day Tabs */}
                    <div className={styles.timelineTabs}>
                        {daysPlan.days.map((d, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveIdx(idx)}
                                className={`${styles.timelineTab} ${activeIdx === idx ? styles.timelineTabActive : ''}`}
                            >
                                Day {d.day}: {d.title}
                            </button>
                        ))}
                    </div>

                    {/* Active Day Content */}
                    <div className={styles.timelineContent}>
                        <h3 className={styles.timelineDayTitle}>
                            <span className={styles.dayBadge}>{activeDay.day}</span>
                            {activeDay.title}
                        </h3>
                        <ul className={styles.timelineTaskList}>
                            {activeDay.tasks.map((task, idx) => (
                                <li key={idx}>
                                    <span className={styles.taskBullet}>→</span>
                                    <span>{task}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
