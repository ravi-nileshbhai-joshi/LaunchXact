import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={`container ${styles.container}`}>
                <p>&copy; {new Date().getFullYear()} LaunchXact — A Context Forge Labs product</p>
                <div className={styles.links}>
                    <Link href="/startup-visibility-engine" style={{ color: 'var(--primary-light)', fontWeight: '600' }}>Startup Visibility Engine</Link>
                    <Link href="/grade">Grade Your SaaS</Link>
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
            </div>
        </footer>
    );
}
