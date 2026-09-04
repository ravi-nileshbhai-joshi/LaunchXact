'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe, faUser, faRocket, faCode } from '@fortawesome/free-solid-svg-icons';
import styles from '@/app/startup-visibility-os/startup-visibility.module.css';

const ICON_MAP = {
    faGlobe: faGlobe,
    faUser: faUser,
    faRocket: faRocket,
    faCode: faCode
};

export default function OutcomesGrid({ outcomes }) {
    return (
        <section className={`${styles.section} ${styles.sectionAlt}`}>
            <div className={styles.container}>
                <span className={styles.sectionLabel}>What You'll Learn</span>
                <h2 className={styles.sectionHeading}>
                    Turn your startup into a{' '}
                    <span className={styles.accentWord}>discovery machine</span>
                </h2>
                <p className={styles.sectionSub}>
                    We turn features into outcomes. Here is what changes for you after implementing the Startup Visibility OS.
                </p>
                <div className={styles.outcomesGrid}>
                    {outcomes.map((outcome, idx) => {
                        const icon = ICON_MAP[outcome.icon] || faGlobe;
                        return (
                            <div key={idx} className={styles.outcomeCard}>
                                <div className={styles.outcomeIcon}>
                                    <FontAwesomeIcon icon={icon} />
                                </div>
                                <h3 className={styles.outcomeTitle}>{outcome.title}</h3>
                                <p className={styles.outcomeDesc}>{outcome.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
