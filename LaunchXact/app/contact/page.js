'use client';
import styles from './page.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXTwitter, faLinkedin, faInstagram, faFacebook } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

export default function Contact() {
    const handleSocialClick = (e, platform) => {
        e.preventDefault();
        alert(`${platform} account is coming soon!`);
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Contact Us</h1>
                <p className={styles.subtitle}>Have a question or want to partner? Get in touch.</p>
            </header>

            <div className={`glass-panel ${styles.content}`}>
                <p className={styles.intro}>
                    We'd love to hear from you. Whether you're a founder looking to launch or an investor seeking the next unicorn, drop us a line.
                </p>

                <div className={styles.contactMethods}>
                    <div className={styles.method}>
                        <h3>Email</h3>
                        <a href="mailto:hello@launchxact.com" className={styles.link}>hello@launchxact.com</a>
                    </div>

                    <div className={styles.method}>
                        <h3>Support Hours</h3>
                        <p className={styles.text}>Mon-Fri, 9 AM - 6 PM IST</p>
                    </div>

                    <div className={styles.method}>
                        <h3>Contact Number</h3>
                        <a href="tel:+917990786383" className={styles.link}>+91 7990786383</a>
                    </div>

                    <div className={styles.method}>
                        <h3>Grievance Officer</h3>
                        <p className={styles.text}>Krupa Joshi</p>
                    </div>

                    <div className={styles.method}>
                        <h3>Registered Address</h3>
                        <p className={styles.text}>Shree Dresses, Nr. Vachraj Temple, Canal Road, Chhaya, Porbandar, Gujarat Pin code- 360-575</p>
                    </div>

                    <div className={styles.method}>
                        <h3>Socials</h3>
                        <div className={styles.socialLinks}>
                            <a href="https://twitter.com/launchxact" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} title="X (Twitter)">
                                <FontAwesomeIcon icon={faXTwitter} />
                            </a>
                            <a href="#" onClick={(e) => handleSocialClick(e, 'LinkedIn')} className={styles.socialIcon} title="LinkedIn (Coming Soon)">
                                <FontAwesomeIcon icon={faLinkedin} />
                            </a>
                            <a href="https://www.instagram.com/launchxact/" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} title="Instagram">
                                <FontAwesomeIcon icon={faInstagram} />
                            </a>
                            <a href="https://www.facebook.com/profile.php?id=61588146346749" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} title="Facebook">
                                <FontAwesomeIcon icon={faFacebook} />
                            </a>
                        </div>
                    </div>


                </div>
            </div>
        </div>
    );
}
