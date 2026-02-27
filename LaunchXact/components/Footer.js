import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={`container ${styles.container}`}>
                <p>&copy; {new Date().getFullYear()} LaunchXact — A Context Forge Labs product</p>
                <div className={styles.links}>
                    {/* <Link href="/explore">Explore</Link> */}
                    {/* <Link href="/submit">Submit</Link> */}
                    <Link href="/about">About</Link>
                    <Link href="/contact">Contact</Link>
                    <Link href="/where-to-launch-saas">Where to Launch</Link>
                    <Link href="/terms">Terms</Link>
                    <Link href="/privacy">Privacy</Link>
                    <Link href="/refund-policy">Refunds</Link>
                </div>
            </div>
        </footer>
    );
}
