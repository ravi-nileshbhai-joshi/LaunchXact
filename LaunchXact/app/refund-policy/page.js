import styles from '../about/page.module.css';

export const metadata = {
    title: 'Refund & Cancellation Policy | LaunchXact',
    description: 'Refund & Cancellation Policy for LaunchXact proprietary and third-party SaaS products.',
};

export default function RefundPolicy() {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Refund & Cancellation Policy</h1>
                <p className={styles.subtitle}>Last Updated: February 27, 2026</p>
            </header>

            <div className={`glass-panel ${styles.content}`}>
                <section className={styles.section}>
                    <p>
                        At LaunchXact, transparency in transactions is a core value. While the platform is currently in a waitlist phase and no payments are being processed, the following policy will apply upon our official launch:
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>1. No Charges During Waitlist</h2>
                    <p>
                        Joining the LaunchXact waitlist is free of charge. No payment information is collected at this stage.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>2. Marketplace Refunds</h2>
                    <p>
                        Once the marketplace is live, LaunchXact will host both proprietary and third-party SaaS products.
                    </p>
                    <p>
                        <strong>Proprietary Products:</strong> We will offer a 7-day "No Questions Asked" refund policy for our own software tools.
                    </p>
                    <p>
                        <strong>Third-Party Products:</strong> Refunds for third-party SaaS vendors will be governed by the individual vendor's refund policy, clearly displayed on each product listing.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>3. Cancellation of Subscriptions</h2>
                    <p>
                        For all recurring monthly models, users will be able to cancel their subscriptions at any time through their LaunchXact dashboard. In compliance with RBI guidelines, users will receive a pre-debit notification 24 hours before any recurring charge.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>4. Contact for Disputes</h2>
                    <p>
                        For any payment-related queries, you can reach us at <strong>hello@launchxact.com</strong>.
                    </p>
                </section>
            </div>
        </div>
    );
}
