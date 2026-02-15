import Link from 'next/link';
import RocketLogo from './RocketLogo';
import styles from './Navbar.module.css';

export default function Navbar() {
    return (
        <nav className={styles.navbar}>
            <div className={`container ${styles.container}`}>
                <Link href="/" className={styles.logoWrapper}>
                    <RocketLogo />
                </Link>
                <div className={styles.links}>
                    {/* <Link href="/explore">Explore</Link> */}
                    {/* <Link href="/submit">Submit</Link> */}
                    <Link href="/about">About</Link>
                    <Link href="/contact">Contact</Link>
                </div>
            </div>
        </nav>
    );
}
