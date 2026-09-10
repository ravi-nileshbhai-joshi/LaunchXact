import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={`container ${styles.container}`}>
                <div className={styles.links}>
                    <Link href="/grade">Grade Your SaaS</Link>
                    <Link href="/tools/true-cost-of-payments">Payment Cost Simulator</Link>
                    <Link href="/tools/franken-stack-cost-forecaster">Franken-Stack Forecaster</Link>
                    <Link href="/tools/pre-launch-distribution-architect">Pre-Launch Architect</Link>
                    <Link href="/tools/geo-schema-snippet-generator" style={{ color: 'var(--primary)', fontWeight: '600' }}>GEO Schema Generator</Link>
                    <Link href="/tools">Founder Tools</Link>
                    <Link href="/about">About</Link>
                    <Link href="/contact">Contact</Link>
                    <Link href="/where-to-launch-saas">Where to Launch</Link>
                    <Link href="/saas-marketplace-guide">SaaS Launch Guide</Link>
                    <Link href="/articles">Articles & Resources</Link>
                    <a href="https://github.com/ravi-nileshbhai-joshi/LaunchXact" target="_blank" rel="noopener noreferrer">GitHub</a>
                    <Link href="/terms">Terms</Link>
                    <Link href="/privacy">Privacy</Link>
                    <Link href="/refund-policy">Refunds</Link>
                </div>
                <div className={styles.badgeWrapper}>
                    <a
                        href="https://spacerrapps.com/apps/launchxact?utm_source=badge&utm_medium=referral&utm_campaign=featured"
                        target="_blank"
                        rel="noopener"
                        className={styles.badgeLink}
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src="https://spacerrapps.com/badge/launchxact.svg?v=2"
                            alt="LaunchXact is featured on Spacerr"
                            width="192"
                            height="54"
                            className={styles.badgeImg}
                        />
                    </a>
                </div>
                <p>&copy; {new Date().getFullYear()} LaunchXact — A Context Forge Labs product</p>
            </div>
        </footer>
    );
}
