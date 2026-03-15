import styles from '../about/page.module.css';

export const metadata = {
    title: 'Terms of Service | LaunchXact',
    description: 'Terms of Service and Agreement for LaunchXact platform and waitlist.',
    alternates: { canonical: '/terms' }
};

export default function TermsOfService() {
    const breadcrumbJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://launchxact.com'
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: 'Terms of Service',
                item: 'https://launchxact.com/terms'
            }
        ]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
            <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Terms of Service</h1>
                <p className={styles.subtitle}>Last Updated: February 27, 2026</p>
            </header>

            <div className={`glass-panel ${styles.content}`}>
                <section className={styles.section}>
                    <p>
                        Welcome to LaunchXact (www.launchxact.com). By signing up for our waitlist, you agree to the following terms:
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>1. Nature of Service</h2>
                    <p>
                        LaunchXact is currently in its pre-launch phase. Joining the waitlist does not guarantee immediate access to the platform or the right to purchase software until the official marketplace launch.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>2. User Eligibility</h2>
                    <p>
                        You must be at least 18 years of age and representing a legal business entity or as an individual professional to use our services.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>3. Intellectual Property</h2>
                    <p>
                        All content, logos, and designs on this website are the property of LaunchXact.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>4. Future Transactions</h2>
                    <p>
                        Upon the launch of our marketplace, all purchases will be subject to our full Marketplace Terms, which will govern multi-vendor transactions, recurring billing, and RBI e-mandate compliance for Indian users.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>5. Governing Law</h2>
                    <p>
                        These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Bengaluru, India.
                    </p>
                </section>
            </div>
        </div>
        </>
    );
}
