import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import ProductHero from '@/components/sales/ProductHero';
import EmpathyGrid from '@/components/sales/EmpathyGrid';
import OutcomesGrid from '@/components/sales/OutcomesGrid';
import ProductInside from '@/components/sales/ProductInside';
import ImplementationTimeline from '@/components/sales/ImplementationTimeline';
import FounderStory from '@/components/sales/FounderStory';
import FaqAccordion from '@/components/sales/FaqAccordion';
import Breadcrumb from '@/components/Breadcrumb';
import staticStyles from '@/app/startup-visibility-os/startup-visibility.module.css';
import styles from './product.module.css';

async function getProduct(slug) {
    // 1. Check local static files in data/products
    try {
        const filePath = path.join(process.cwd(), 'data', 'products', `${slug}.json`);
        if (fs.existsSync(filePath)) {
            const fileContents = fs.readFileSync(filePath, 'utf8');
            return { ...JSON.parse(fileContents), isStatic: true };
        }
    } catch (e) {
        console.warn(`Static file check error for slug ${slug}:`, e.message);
    }

    // 2. Check Supabase products table
    try {
        const { data: dbProduct, error } = await supabase
            .from('products')
            .select('*, waitlist_founders(*)')
            .eq('slug', slug)
            .single();

        if (error || !dbProduct) {
            return null;
        }

        const aeo = dbProduct.aeo_content || {};
        const founder = dbProduct.waitlist_founders || {};

        return {
            id: dbProduct.id,
            slug: dbProduct.slug,
            name: dbProduct.name,
            tagline: dbProduct.tagline || aeo.tagline || dbProduct.description,
            description: dbProduct.description || aeo.problem_solved,
            category: dbProduct.category || 'B2B SaaS',
            status: dbProduct.status || 'Live',
            stage: aeo.stage || founder.stage || 'Live',
            monthly_revenue: aeo.monthly_revenue || founder.monthly_revenue || 'Pre-revenue',
            biggest_problem: aeo.biggest_problem || founder.biggest_problem || 'Distribution',
            founder_name: aeo.founder_name || founder.founder_name || 'Founder',
            social_profile: aeo.social_profile || founder.social_profile || '',
            website_url: aeo.website_url || founder.website_url || '',
            key_features: aeo.key_features || [
                `Engineered for ${dbProduct.category || 'modern workflows'}`,
                `Hand-curated candidate for the LaunchXact Genesis Batch 2026`,
                `Direct founder contact & rapid iteration cycles`
            ],
            isStatic: false
        };
    } catch (err) {
        console.error(`Error querying product from Supabase for slug ${slug}:`, err);
        return null;
    }
}

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const product = await getProduct(slug);
    if (!product) {
        return { title: 'Product Not Found - LaunchXact' };
    }

    if (product.isStatic) {
        return {
            title: `${product.name} — ${product.subheadline_top}`,
            description: product.subheadline,
            alternates: { canonical: `/products/${slug}` }
        };
    }

    return {
        title: `${product.name} — ${product.category} | LaunchXact Genesis Batch`,
        description: product.tagline || product.description,
        alternates: { canonical: `/products/${slug}` },
        openGraph: {
            title: `${product.name} — LaunchXact Genesis Showcase`,
            description: product.tagline || product.description,
            url: `https://www.launchxact.com/products/${slug}`,
            siteName: 'LaunchXact',
            type: 'website'
        }
    };
}

export default async function DynamicProductPage({ params }) {
    const { slug } = await params;
    const product = await getProduct(slug);

    if (!product) {
        notFound();
    }

    // =========================================================================
    // 1. STATIC PRODUCT (e.g. Startup Visibility OS)
    // =========================================================================
    if (product.isStatic) {
        const productJsonLd = {
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.name,
            description: product.subheadline,
            url: `https://www.launchxact.com/products/${slug}`,
            brand: { '@type': 'Brand', name: 'LaunchXact' },
            offers: {
                '@type': 'Offer',
                price: product.pricing?.current_price || '49',
                priceCurrency: 'USD',
                availability: 'https://schema.org/InStock',
                url: `https://www.launchxact.com/products/${slug}`
            }
        };

        return (
            <div className={staticStyles.page}>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
                />
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem 1.5rem 0' }}>
                    <Breadcrumb items={[
                        { label: 'Products', href: '/#products' },
                        { label: product.name }
                    ]} />
                </div>
                <ProductHero product={product} />
                {product.painPoints && <EmpathyGrid painPoints={product.painPoints} />}
                {product.outcomes && <OutcomesGrid outcomes={product.outcomes} />}
                {product.inside && <ProductInside inside={product.inside} />}
                {product.daysPlan && <ImplementationTimeline daysPlan={product.daysPlan} />}
                {product.founderStory && <FounderStory founderStory={product.founderStory} />}
                {product.faq && <FaqAccordion faq={product.faq} />}
            </div>
        );
    }

    // =========================================================================
    // 2. DYNAMIC SAAS SHOWCASE PAGE (Automatically generated for Waitlist Founder)
    // =========================================================================
    const saasJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: product.name,
        applicationCategory: product.category,
        description: product.tagline || product.description,
        url: `https://www.launchxact.com/products/${slug}`,
        author: {
            '@type': 'Person',
            name: product.founder_name
        },
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock'
        }
    };

    const founderInitials = (product.founder_name || 'Founder')
        .split(' ')
        .map(w => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    return (
        <div className={styles.showcasePage}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(saasJsonLd) }}
            />

            <div className={styles.container}>
                <div className={styles.breadcrumbWrapper}>
                    <Breadcrumb items={[
                        { label: 'Home', href: '/' },
                        { label: product.category || 'SaaS' },
                        { label: product.name }
                    ]} />
                </div>

                {/* HERO SHOWCASE CARD */}
                <section className={styles.heroSection}>
                    <div className={styles.heroTopRow}>
                        <span className={styles.genesisBadge}>✦ Genesis Batch 2026</span>
                        <span className={styles.stageBadge}>
                            {product.stage === 'Live' && '🚀 Live'}
                            {product.stage === 'Already generating revenue' && '💰 Generating Revenue'}
                            {product.stage === 'MVP' && '🔨 MVP Ready'}
                            {product.stage === 'Idea' && '💡 Validating Idea'}
                            {!['Live', 'Already generating revenue', 'MVP', 'Idea'].includes(product.stage) && `⚡ ${product.stage}`}
                        </span>
                        <span className={styles.categoryPill}>{product.category}</span>
                    </div>

                    <h1 className={styles.productTitle}>{product.name}</h1>
                    <p className={styles.productTagline}>{product.tagline}</p>

                    <div className={styles.heroActions}>
                        {product.website_url ? (
                            <a
                                href={product.website_url.startsWith('http') ? product.website_url : `https://${product.website_url}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.primaryCta}
                            >
                                Visit Official Website ↗
                            </a>
                        ) : (
                            <Link href="/#buyer-form" className={styles.primaryCta}>
                                Request Early Access →
                            </Link>
                        )}

                        <Link href="/#founder-form" className={styles.secondaryCta}>
                            Submit Your SaaS to Genesis Batch →
                        </Link>
                    </div>

                    <div className={styles.verifiedStrip}>
                        <span className={styles.verifiedIcon}>✓</span>
                        <span>Permanent canonical DoFollow showcase on LaunchXact • Verified founder-built software</span>
                    </div>
                </section>

                {/* DETAILS GRID */}
                <section className={styles.detailsGrid}>
                    <div className={styles.detailCard}>
                        <div className={styles.cardHeader}>
                            <span className={styles.cardIcon}>🎯</span>
                            <h3 className={styles.cardHeading}>Problem & Workflow</h3>
                        </div>
                        <p className={styles.cardText}>
                            {product.description || 'Solving key operational frictions and saving hours of manual workflow execution.'}
                        </p>
                    </div>

                    <div className={styles.detailCard}>
                        <div className={styles.cardHeader}>
                            <span className={styles.cardIcon}>⚡</span>
                            <h3 className={styles.cardHeading}>Key Highlights</h3>
                        </div>
                        <ul className={styles.featuresList}>
                            {product.key_features.map((feature, idx) => (
                                <li key={idx} className={styles.featureItem}>
                                    <span className={styles.featureCheck}>✓</span>
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                {/* FOUNDER & ARCHITECTURE CARD */}
                <section className={styles.founderCard}>
                    <div className={styles.founderInfo}>
                        <div className={styles.founderAvatar}>
                            {founderInitials || 'FD'}
                        </div>
                        <div className={styles.founderDetails}>
                            <h4>Built by {product.founder_name}</h4>
                            <p>Founder, {product.name}</p>
                            {product.social_profile && (
                                <a
                                    href={product.social_profile.startsWith('http') ? product.social_profile : `https://x.com/${product.social_profile.replace('@', '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.socialLink}
                                >
                                    Follow Founder ↗
                                </a>
                            )}
                        </div>
                    </div>

                    <div className={styles.founderStats}>
                        <div className={styles.statBox}>
                            <div className={styles.statValue}>{product.stage}</div>
                            <div className={styles.statLabel}>Current Stage</div>
                        </div>
                        <div className={styles.statBox}>
                            <div className={styles.statValue}>{product.monthly_revenue}</div>
                            <div className={styles.statLabel}>Revenue Tier</div>
                        </div>
                    </div>
                </section>

                {/* BOTTOM CTA BANNER */}
                <section className={styles.bottomBanner}>
                    <h3 className={styles.bottomHeading}>Building software like {product.name}?</h3>
                    <p className={styles.bottomSub}>
                        Join the LaunchXact Genesis Batch. Get permanent directory discovery, multi-region billing infrastructure, and access to 350k+ tech users.
                    </p>
                    <Link href="/#founder-form" className={styles.bottomBtn}>
                        Apply to Join Genesis Batch (Free) →
                    </Link>
                </section>
            </div>
        </div>
    );
}
