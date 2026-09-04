'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import RocketLogo from './RocketLogo';
import styles from './Navbar.module.css';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    return (
        <header className={styles.header}>
            <div className={styles.navWrapper}>
                <nav className={`${styles.navbar} ${scrolled ? styles.navbarScrolled : ''} ${isOpen ? styles.navbarOpen : ''}`}>
                    {/* Logo with Rocket Animation */}
                    <Link href="/" className={styles.logo} onClick={() => setIsOpen(false)} aria-label="LaunchXact Home">
                        <div className={styles.rocketLogoWrapper}>
                            <RocketLogo />
                        </div>
                    </Link>

                    {/* Desktop Nav Links */}
                    <div className={styles.desktopLinks}>
                        <Link href="/grade" className={styles.navLink}>Grade SaaS</Link>
                        <Link href="/where-to-launch-saas" className={styles.navLink}>Where to Launch</Link>
                        <Link href="/articles" className={styles.navLink}>Articles</Link>
                        <Link href="/about" className={styles.navLink}>About</Link>
                        <Link href="/contact" className={styles.navLink}>Contact</Link>
                    </div>

                    {/* Desktop CTA Area */}
                    <div className={styles.ctaArea}>
                        <Link href="/#founder-form" className={styles.ctaBtn}>
                            Submit SaaS
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </Link>
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        className={styles.mobileToggle}
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Toggle menu"
                        aria-expanded={isOpen}
                    >
                        <span className={`${styles.bar} ${isOpen ? styles.barTop : ''}`} />
                        <span className={`${styles.bar} ${isOpen ? styles.barMid : ''}`} />
                        <span className={`${styles.bar} ${isOpen ? styles.barBot : ''}`} />
                    </button>
                </nav>

                {/* Mobile Menu */}
                <div className={`${styles.mobileMenu} ${isOpen ? styles.mobileMenuOpen : ''}`}>
                    <div className={styles.mobileLinks}>
                        <Link href="/grade" className={styles.mobileLink} onClick={() => setIsOpen(false)}>Grade SaaS</Link>
                        <Link href="/where-to-launch-saas" className={styles.mobileLink} onClick={() => setIsOpen(false)}>Where to Launch</Link>
                        <Link href="/articles" className={styles.mobileLink} onClick={() => setIsOpen(false)}>Articles & Resources</Link>
                        <Link href="/about" className={styles.mobileLink} onClick={() => setIsOpen(false)}>About</Link>
                        <Link href="/contact" className={styles.mobileLink} onClick={() => setIsOpen(false)}>Contact</Link>
                    </div>
                    <div className={styles.mobileCta}>
                        <Link href="/#founder-form" className={styles.ctaBtn} onClick={() => setIsOpen(false)}>
                            Submit SaaS to Genesis Batch →
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}
