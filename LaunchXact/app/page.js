import HomeContent from '@/components/HomeContent';
import { getSortedArticlesData } from '@/lib/articles';

export const metadata = {
    title: 'LaunchXact - Premium Curated SaaS Marketplace',
    description: 'A manually curated multi-vendor SaaS marketplace. Discover high-value software that solves real problems, and launch your product in a premium ecosystem.',
    alternates: { canonical: '/' }
};

export default function Home() {
    const articles = getSortedArticlesData().slice(0, 3);
    return <HomeContent latestArticles={articles} />;
}
