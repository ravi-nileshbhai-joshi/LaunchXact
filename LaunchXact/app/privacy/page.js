import styles from '../about/page.module.css';

export const metadata = {
    title: 'Privacy Policy | LaunchXact',
    description: 'LaunchXact Privacy Policy, compliant with the Digital Personal Data Protection (DPDP) Act of India.',
};

export default function PrivacyPolicy() {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Privacy Policy</h1>
                <p className={styles.subtitle}>Last Updated: February 27, 2026</p>
            </header>

            <div className={`glass-panel ${styles.content}`}>
                <section className={styles.section}>
                    <p>
                        LaunchXact (“we,” “us,” or “our”) is committed to protecting your privacy in accordance with the Digital Personal Data Protection (DPDP) Act of India. This policy explains how we handle your data during our pre-launch/waitlist phase.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>1. Data We Collect</h2>
                    <p>
                        We currently only collect your email address and basic voluntarily provided details (such as Name, Website URL, Product Details) via our waitlist form.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>2. Purpose of Collection</h2>
                    <p>
                        Your data is collected solely to provide updates regarding the LaunchXact platform launch, early access invitations, and relevant SaaS industry insights.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>3. Data Storage & Security</h2>
                    <p>
                        We implement industry-standard security measures (SSL/TLS encryption) to prevent unauthorized access. We do not sell or rent your personal information to third parties.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>4. Your Rights</h2>
                    <p>
                        Under the DPDP Act, you have the right to access, correct, or request the erasure of your data. To withdraw your consent or be removed from our waitlist, please contact us at <strong>hello@launchxact.com</strong>.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>5. Third-Party Services</h2>
                    <p>
                        We use Resend to manage our waitlist communications. Our providers are compliant with global and local data protection standards.
                    </p>
                </section>
            </div>
        </div>
    );
}
