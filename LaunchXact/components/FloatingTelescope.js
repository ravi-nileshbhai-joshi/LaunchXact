import styles from './FloatingTelescope.module.css';

export default function FloatingTelescope() {
    return (
        <div className={styles.container}>
            <svg
                viewBox="0 0 400 300"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={styles.telescope}
            >
                <defs>
                    <linearGradient id="metalGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#e2e8f0" />
                        <stop offset="50%" stopColor="#94a3b8" />
                        <stop offset="100%" stopColor="#64748b" />
                    </linearGradient>
                    <linearGradient id="glassGradient" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
                    </linearGradient>
                </defs>

                {/* Tripod Back Leg */}
                <path d="M200 200 L160 300" stroke="#475569" strokeWidth="8" strokeLinecap="round" />

                {/* Main Tube */}
                <rect x="100" y="100" width="200" height="60" rx="5" transform="rotate(-20 200 130)" fill="url(#metalGradient)" />

                {/* Lens Cap / Front */}
                <ellipse cx="285" cy="65" rx="15" ry="30" transform="rotate(-20 286 64)" fill="#334155" />
                <ellipse cx="287" cy="64" rx="12" ry="25" transform="rotate(-20 286 64)" fill="url(#glassGradient)" />

                {/* Eyepiece */}
                <rect x="80" y="135" width="40" height="20" transform="rotate(-20 100 145)" fill="#334155" />

                {/* Tripod Front Legs */}
                <path d="M200 200 L240 300" stroke="#64748b" strokeWidth="8" strokeLinecap="round" />
                <path d="M200 200 L200 300" stroke="#64748b" strokeWidth="8" strokeLinecap="round" />

                {/* Mount */}
                <circle cx="200" cy="200" r="15" fill="#334155" />

                {/* Stars Reflection on Lens */}
                <circle cx="285" cy="60" r="2" fill="white" opacity="0.8" />
                <circle cx="290" cy="70" r="1.5" fill="white" opacity="0.6" />

            </svg>
        </div>
    );
}
