import styles from './page.module.css';

export default function About() {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>About LaunchXact</h1>
                <p className={styles.subtitle}>Empowering the next generation of indie hackers.</p>
            </header>

            <div className={`glass-panel ${styles.content}`}>
                <section className={styles.section}>
                    <h2>Our Mission</h2>
                    <p>
                        LaunchXact was built to solve a simple problem: <strong>Visibility</strong>.
                        Every day, thousands of incredible tools are built by indie developers, but they often get lost in the noise.
                    </p>
                    <p>
                        We curate the best new SaaS launches, giving founders a platform to shine and early adopters a place to discover the next big thing.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>For Founders</h2>
                    <p>
                        Submit your product to get in front of a community of tech enthusiasts, investors, and fellow founders.
                        Get feedback, validate your idea, and find your first 100 users.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>For Explorers</h2>
                    <p>
                        Stop using the same old tools. Discover innovative software that can 10x your productivity,
                        designed by passionate developers who care about craftsmanship.
                    </p>
                </section>
            </div>
        </div>
    );
}
