import styles from './page.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXTwitter, faLinkedin, faInstagram, faFacebook } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

export default function Contact() {
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
                        <h3>Socials</h3>
                        <div className={styles.socialLinks}>
                            <a href="https://twitter.com/launchxact" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} title="X (Twitter)">
                                <FontAwesomeIcon icon={faXTwitter} />
                            </a>
                            <a href="#" className={styles.socialIcon} title="LinkedIn (Coming Soon)">
                                <FontAwesomeIcon icon={faLinkedin} />
                            </a>
                            <a href="#" className={styles.socialIcon} title="Instagram (Coming Soon)">
                                <FontAwesomeIcon icon={faInstagram} />
                            </a>
                            <a href="#" className={styles.socialIcon} title="Facebook (Coming Soon)">
                                <FontAwesomeIcon icon={faFacebook} />
                            </a>
                        </div>
                    </div>


                </div>
            </div>
        </div>
    );
}
