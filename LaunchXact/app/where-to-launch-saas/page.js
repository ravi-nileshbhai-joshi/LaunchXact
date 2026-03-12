import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import styles from './page.module.css';

export const metadata = {
    title: 'Where to Launch Your SaaS Product in 2026? The Premium Approach',
    description: 'Stop using legacy launch boards. Discover why LaunchXact is the premium, manually curated multi-vendor marketplace for serious SaaS founders.',
    keywords: ['where to launch saas', 'premium saas marketplace', 'b2b software directory', 'launchxact', 'saas launch platforms'],
};

export default function LaunchComparison() {
    return (
        <div className={styles.container}>
            <Navbar />

            <main className={styles.main}>
                <article className={styles.article}>
                    <h1 className={styles.title}>Where to launch your SaaS product in 2026</h1>
                    <p className={styles.subtitle}>The landscape has changed. Here is the honest comparison of the top platforms for indie hackers.</p>

                    <div className={styles.tableContainer}>
                        <table className={styles.comparisonTable}>
                            <thead>
                                <tr>
                                    <th>Platform</th>
                                    <th>Best For</th>
                                    <th>Cost</th>
                                    <th>Verdict</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className={styles.brand}>Legacy Launch Boards</td>
                                    <td>Viral exposure & Tech enthusiasts</td>
                                    <td>Pay-to-play (Ads starting at $5k+)</td>
                                    <td>Crowded open submission. Good for a 24-hour spike, but traffic fades quickly and enterprise buyers ignore the noise.</td>
                                </tr>
                                <tr>
                                    <td className={styles.brand}>Lifetime Discount Sites</td>
                                    <td>Bargain hunters</td>
                                    <td>High commission (up to 70%)</td>
                                    <td>Great for quick cash, but dangerous for your brand value and terrible for recurring revenue (MRR).</td>
                                </tr>
                                <tr>
                                    <td className={styles.brand}>Basic Payment Gateways</td>
                                    <td>Digital Creators</td>
                                    <td>Transaction fees</td>
                                    <td>Excellent for processing payments, but provides ZERO active discovery or built-in traffic for B2B SaaS.</td>
                                </tr>
                                <tr className={styles.highlightRow}>
                                    <td className={styles.brand}>LaunchXact Marketplace</td>
                                    <td>Premium SaaS & Serious Founders</td>
                                    <td>Curated Partnership</td>
                                    <td><strong>A true multi-vendor marketplace.</strong> We reject 80% of low-value tools to ensure enterprise buyers only discover premium software that solves real headaches.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <section className={styles.section}>
                        <h2>1. Legacy Launch Boards</h2>
                        <p>The traditional "upvote" model is broken for serious founders. In 2026, it has become pay-to-play and saturated with low-effort tools. If you don't have a massive existing audience, you will be buried in hours. It's an environment optimized for indie hacker high-fives, not for attracting enterprise buyers.</p>
                    </section>

                    <section className={styles.section}>
                        <h2>2. Lifetime Discount Sites</h2>
                        <p>If you want fast cash and don't mind giving away your software for life, discount sites exist. But be warned: these users are incredibly demanding, support-heavy, and rarely convert to MRR. It devalues your brand in the eyes of professional B2B buyers.</p>
                    </section>

                    <section className={styles.section}>
                        <h2>3. The LaunchXact Marketplace</h2>
                        <p>LaunchXact is not a competitor to open boards—it's a fundamentally different model. We are a <strong>manually curated multi-vendor SaaS marketplace</strong>. We reject over 80% of submissions to ensure our ecosystem remains pristine. However, we are intensely founder-friendly: rejected founders receive a full customized audit explaining exactly how to optimize their tool for the next batch. For buyers, LaunchXact represents absolute trust and premium quality.</p>
                        <div className={styles.cta}>
                            <Link href="/#founder-form" className={styles.btn}>
                                Launch on LaunchXact (Free)
                            </Link>
                        </div>
                    </section>
                </article>
            </main>

            <Footer />
        </div>
    );
}
