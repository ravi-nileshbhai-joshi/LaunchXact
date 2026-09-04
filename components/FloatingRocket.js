import styles from './FloatingRocket.module.css';

export default function FloatingRocket() {
    return (
        <div className={styles.container}>
            <svg
                viewBox="0 0 200 400"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={styles.rocket}
            >
                <defs>
                    <linearGradient id="bodyGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#d97706" />
                        <stop offset="50%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#d97706" />
                    </linearGradient>
                    <linearGradient id="finGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#b45309" />
                        <stop offset="100%" stopColor="#92400e" />
                    </linearGradient>
                    <linearGradient id="flameGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#fef3c7" />
                        <stop offset="30%" stopColor="#fcd34d" />
                        <stop offset="100%" stopColor="#ef4444" opacity="0" />
                    </linearGradient>
                </defs>

                {/* Left Fin */}
                <path d="M50 250 L20 320 L60 300 Z" fill="url(#finGradient)" />

                {/* Right Fin */}
                <path d="M150 250 L180 320 L140 300 Z" fill="url(#finGradient)" />

                {/* Center Fin (Back) */}
                <path d="M100 250 L100 330 L100 300 Z" stroke="#78350f" strokeWidth="2" />

                {/* Flame */}
                <path d="M70 310 Q 100 400, 130 310 Q 100 340, 70 310" fill="url(#flameGradient)" className={styles.flame} />

                {/* Main Body */}
                <path
                    d="M100 20 
                       C 130 60, 150 150, 150 250 
                       C 150 300, 130 320, 100 320 
                       C 70 320, 50 300, 50 250 
                       C 50 150, 70 60, 100 20 Z"
                    fill="url(#bodyGradient)"
                />

                {/* Window */}
                <circle cx="100" cy="120" r="25" fill="#1e293b" stroke="#fcd34d" strokeWidth="3" />
                <circle cx="100" cy="120" r="20" fill="#3b82f6" fillOpacity="0.2" />

                {/* Window Reflection */}
                <path d="M90 110 A 15 15 0 0 1 110 110" stroke="white" strokeWidth="2" strokeLinecap="round" className={styles.reflection} />

                {/* Rivets / Details */}
                <circle cx="100" cy="60" r="2" fill="#78350f" opacity="0.5" />
                <circle cx="100" cy="180" r="2" fill="#78350f" opacity="0.5" />
                <circle cx="100" cy="220" r="2" fill="#78350f" opacity="0.5" />

                <path d="M55 250 Q 100 260, 145 250" stroke="#b45309" strokeWidth="1" opacity="0.5" />

            </svg>
        </div>
    );
}
