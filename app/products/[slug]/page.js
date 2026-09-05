import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import ProductHero from '@/components/sales/ProductHero';
import EmpathyGrid from '@/components/sales/EmpathyGrid';
import OutcomesGrid from '@/components/sales/OutcomesGrid';
import ProductInside from '@/components/sales/ProductInside';
import ImplementationTimeline from '@/components/sales/ImplementationTimeline';
import FounderStory from '@/components/sales/FounderStory';
import FaqAccordion from '@/components/sales/FaqAccordion';
import Breadcrumb from '@/components/Breadcrumb';
import styles from '@/app/startup-visibility-os/startup-visibility.module.css';

function getProduct(slug) {
    try {
        const filePath = path.join(process.cwd(), 'data', 'products', `${slug}.json`);
        if (!fs.existsSync(filePath)) {
            return null;
        }
        const fileContents = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(fileContents);
    } catch (e) {
        console.error(`Error loading product config for slug ${slug}:`, e);
        return null;
    }
}

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const product = getProduct(slug);
    if (!product) {
        return { title: 'Product Not Found' };
    }
    return {
        title: `${product.name} — ${product.subheadline_top}`,
        description: product.subheadline,
        alternates: { canonical: `/products/${slug}` }
    };
}

export default async function DynamicProductPage({ params }) {
    const { slug } = await params;
    const product = getProduct(slug);

    if (!product) {
        notFound();
    }

    const productJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.subheadline,
        url: `https://www.launchxact.com/products/${slug}`,
        isPartOf: {
            '@type': 'WebSite',
            '@id': 'https://www.launchxact.com/#website'
        },
        brand: {
            '@type': 'Brand',
            name: 'LaunchXact'
        },
        offers: {
            '@type': 'Offer',
            price: product.pricing?.current_price || '49',
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
            url: `https://www.launchxact.com/products/${slug}`
        }
    };

    const breadcrumbJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://www.launchxact.com'
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: 'Products',
                item: 'https://www.launchxact.com/#products'
            },
            {
                '@type': 'ListItem',
                position: 3,
                name: product.name,
                item: `https://www.launchxact.com/products/${slug}`
            }
        ]
    };

    return (
        <div className={styles.page}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem 1.5rem 0' }}>
                <Breadcrumb items={[
                    { label: 'Products', href: '/#products' },
                    { label: product.name }
                ]} />
            </div>
            <ProductHero product={product} />
            
            {product.painPoints && (
                <EmpathyGrid painPoints={product.painPoints} />
            )}
            
            {product.outcomes && (
                <OutcomesGrid outcomes={product.outcomes} />
            )}
            
            {product.inside && (
                <ProductInside inside={product.inside} />
            )}
            
            {product.daysPlan && (
                <ImplementationTimeline daysPlan={product.daysPlan} />
            )}
            
            {product.founderStory && (
                <FounderStory founderStory={product.founderStory} />
            )}
            
            {product.faq && (
                <FaqAccordion faq={product.faq} />
            )}
        </div>
    );
}
