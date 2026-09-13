import { notFound } from 'next/navigation';
import { getSearchSpoke, getAllSearchSpokeSlugs, getSearchCluster } from '@/data/search-ecosystem';
import SearchEcosystemTemplate from '@/components/seo/SearchEcosystemTemplate';

// Enforce strict static prerendering: only valid ecosystem spoke slugs are rendered
export const dynamicParams = false;

export async function generateStaticParams() {
    const slugs = getAllSearchSpokeSlugs();
    return slugs.map((slug) => ({
        spokeSlug: slug,
    }));
}

export async function generateMetadata({ params }) {
    const { spokeSlug } = await params;
    const spoke = getSearchSpoke(spokeSlug);

    if (!spoke) {
        return {
            title: 'Guide Not Found | LaunchXact',
            description: 'The requested founder guide or tool does not exist.',
        };
    }

    const cluster = getSearchCluster(spoke.clusterId);

    return {
        title: `${spoke.title} | LaunchXact`,
        description: spoke.metaDescription,
        keywords: [
            spoke.targetKeyword,
            spoke.clusterId,
            cluster?.name || 'SaaS Tools',
            'LaunchXact',
            'micro-SaaS',
            'founder guide'
        ],
        alternates: {
            canonical: `/${spoke.slug}`,
        },
        openGraph: {
            title: `${spoke.title} | LaunchXact`,
            description: spoke.metaDescription,
            url: `https://www.launchxact.com/${spoke.slug}`,
            type: 'article',
            siteName: 'LaunchXact',
        },
        twitter: {
            card: 'summary_large_image',
            title: `${spoke.title} | LaunchXact`,
            description: spoke.metaDescription,
        },
    };
}

export default async function SearchEcosystemPage({ params }) {
    const { spokeSlug } = await params;
    const spoke = getSearchSpoke(spokeSlug);

    if (!spoke) {
        notFound();
    }

    return <SearchEcosystemTemplate spoke={spoke} />;
}
