import InternalLinkPlanner from '@/components/tools/InternalLinkPlanner';
import Breadcrumb from '@/components/Breadcrumb';

export const metadata = {
    title: 'SaaS Internal Link Planner: Hub-and-Spoke Topic Cluster Architect',
    description: 'Free internal linking silo planner for SaaS. Model PageRank authority distribution, prevent cannibalization, and export internal link manifests to Markdown.',
    alternates: {
        canonical: '/tools/internal-link-planner',
    },
    openGraph: {
        title: 'SaaS Internal Link Planner | LaunchXact',
        description: 'Design hub-and-spoke topic silos to rank for high-intent commercial software keywords.',
        url: 'https://www.launchxact.com/tools/internal-link-planner',
        type: 'website',
    },
};

export default function InternalLinkPlannerPage() {
    return (
        <main style={{ minHeight: '80vh', paddingTop: '7rem', paddingBottom: '6rem' }}>
            <div style={{ maxWidth: '1040px', margin: '0 auto', padding: '0 1.25rem' }}>
                <Breadcrumb
                    items={[
                        { label: 'Founder Tools', href: '/tools' },
                        { label: 'Internal Link Planner' }
                    ]}
                />
                <InternalLinkPlanner />
            </div>
        </main>
    );
}
