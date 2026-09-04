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
        return { title: 'Product Not Found - LaunchXact' };
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

    return (
        <div className={styles.page}>
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
