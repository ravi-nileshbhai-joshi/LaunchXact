'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import RocketLogo from './RocketLogo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import styles from './Navbar.module.css';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Close menu when clicking a link
    const closeMenu = () => setIsMenuOpen(false);

    // Prevent scroll when menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isMenuOpen]);

    return (
        <nav className={`${styles.navbar} ${isMenuOpen ? styles.navbarOpen : ''}`}>
            <div className={`container ${styles.container}`}>
                <Link href="/" className={styles.logoWrapper} onClick={closeMenu}>
                    <RocketLogo />
                </Link>

                <button 
                    className={styles.mobileToggle} 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle Menu"
                >
                    <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} />
                </button>

                <div className={`${styles.links} ${isMenuOpen ? styles.linksOpen : ''}`}>
                    <Link href="/grade" onClick={closeMenu}>Grade</Link>
                    <Link href="/about" onClick={closeMenu}>About</Link>
                    <Link href="/contact" onClick={closeMenu}>Contact</Link>
                </div>
            </div>
        </nav>
    );
}
