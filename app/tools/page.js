import Breadcrumb from '@/components/Breadcrumb';
import ToolsHubContent from '@/components/tools/ToolsHubContent';
import { ECOSYSTEM_TOOLS } from '@/data/tools-ecosystem';
import styles from './tools.module.css';

export const metadata = {
    title: 'Founder Tool Ecosystem: 13 Free SaaS Calculators & Growth Engines',
    description: 'Free calculators, AI discovery simulators, meta tag generators, schema builders, and launch frameworks engineered to help indie founders scale revenue and launch traction.',
    alternates: {
        canonical: '/tools',
    },
    openGraph: {
        title: 'Founder Tool Ecosystem: Free SaaS Calculators & Growth Engines | LaunchXact',
        description: 'Free AI graders, payment simulators, launch checklists, and distribution engines built to eliminate founder friction and accelerate launch traction.',
        url: 'https://www.launchxact.com/tools',
        type: 'website',
    },
};

export default function ToolsHubPage() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'LaunchXact Free SaaS Founder Tool Ecosystem',
        url: 'https://www.launchxact.com/tools',
        isPartOf: {
            '@type': 'WebSite',
            '@id': 'https://www.launchxact.com/#website'
        },
        description: 'Comprehensive ecosystem of free engineering-led growth tools for SaaS founders, organized across Launch, SEO, AI Discovery, and Economics.',
        mainEntity: {
            '@type': 'ItemList',
            itemListElement: ECOSYSTEM_TOOLS.map((tool, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: tool.title,
                description: tool.description,
                url: `https://www.launchxact.com${tool.href}`,
            })),
        },
    };

    const breadcrumbJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://www.launchxact.com',
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: 'Founder Tools',
                item: 'https://www.launchxact.com/tools',
            },
        ],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
            <main style={{ minHeight: '80vh', paddingTop: '7rem', paddingBottom: '6rem' }}>
                <div className={styles.container}>
                    <Breadcrumb items={[{ label: 'Founder Tools' }]} />
                    <ToolsHubContent />
                </div>
            </main>
        </>
    );
}
