import styles from './RocketLogo.module.css';

export default function RocketLogo() {
    return (
        <div className={styles.logoContainer}>
            <svg
                width="165"
                height="46"
                viewBox="0 0 165 46"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                aria-label="LaunchXact Logo"
            >
                <defs>
                    <linearGradient id="rocketGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#d97706" />
                    </linearGradient>
                    <linearGradient id="trailGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#f59e0b" stopOpacity="0" />
                        <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.8" />
                    </linearGradient>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Unified single text with zero gaps */}
                <text
                    x="8"
                    y="32"
                    fontFamily="var(--font-sans)"
                    fontWeight="800"
                    fontSize="24"
                    letterSpacing="-0.03em"
                    className={styles.logoText}
                >
                    Launch<tspan className={styles.accentX}>X</tspan>act
                </text>

                {/* Rocket positioned right over the X (center ~x=93, y=20) */}
                <g transform="translate(93, 20)">
                    <g className={styles.rocketGroup}>
                        {/* Trail */}
                        <path d="M0 5 Q 0 15, -2 25" className={styles.trail} stroke="url(#trailGradient)" fill="none" />

                        {/* Rocket Body */}
                        <g transform="rotate(45)">
                            <path
                                d="M0 -10 C -3 -3, -3 3, -4 7 L -6 10 L 0 8 L 6 10 L 4 7 C 3 3, 3 -3, 0 -10 Z"
                                className={styles.rocketBody}
                                fill="url(#rocketGradient)"
                            />
                            {/* Window */}
                            <circle cx="0" cy="0" r="1.5" fill="#1e293b" />
                            {/* Flame */}
                            <path d="M-1 8 Q 0 14, 1 8 Z" className={styles.rocketFlame} />
                        </g>
                    </g>
                </g>

                {/* Spark at the top of X */}
                <g transform="translate(93, 10)">
                    <circle cx="0" cy="0" r="1" className={styles.spark} fill="#fbbf24" />
                    <path d="M0 -4 L0 4 M-4 0 L4 0" stroke="#fbbf24" strokeWidth="0.5" className={styles.spark} />
                </g>

            </svg>
        </div>
    );
}
