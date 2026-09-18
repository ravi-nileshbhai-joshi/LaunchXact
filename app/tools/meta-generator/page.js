import MetaGenerator from '@/components/tools/MetaGenerator';
import Breadcrumb from '@/components/Breadcrumb';

export const metadata = {
    title: 'SaaS Meta & OpenGraph Generator: Next.js & HTML SERP Preview Studio',
    description: 'Free visual meta tag & OpenGraph generator. Live previews for Google SERP, Twitter cards, and LinkedIn with 1-click Next.js App Router metadata export.',
    alternates: {
        canonical: '/tools/meta-generator',
    },
    openGraph: {
        title: 'SaaS Meta & OpenGraph Generator | LaunchXact',
        description: 'Design pixel-perfect Google SERP snippets and Twitter social cards in seconds.',
        url: 'https://www.launchxact.com/tools/meta-generator',
        type: 'website',
    },
};

export default function MetaGeneratorPage() {
    return (
        <main style={{ minHeight: '80vh', paddingTop: '7rem', paddingBottom: '6rem' }}>
            <div style={{ maxWidth: '1040px', margin: '0 auto', padding: '0 1.25rem' }}>
                <Breadcrumb
                    items={[
                        { label: 'Founder Tools', href: '/tools' },
                        { label: 'Meta Generator' }
                    ]}
                />
                <MetaGenerator />
            </div>
        </main>
    );
}
