import DynamicProductPage from '../products/[slug]/page';
import { generateMetadata as dynamicMetadata } from '../products/[slug]/page';

export async function generateMetadata() {
    return dynamicMetadata({ params: { slug: 'startup-visibility-os' } });
}

export default async function StartupVisibilityPage() {
    return <DynamicProductPage params={{ slug: 'startup-visibility-os' }} />;
}
