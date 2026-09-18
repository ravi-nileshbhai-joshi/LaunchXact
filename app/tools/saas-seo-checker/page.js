import SaasSeoChecker from '@/components/tools/SaasSeoChecker';
import Breadcrumb from '@/components/Breadcrumb';

export const metadata = {
    title: 'SaaS SEO Checker: On-Page SEO & Landing Page CTR Diagnostic',
    description: 'Free technical on-page SEO checker for SaaS landing pages. Audit title tag length, meta descriptions, heading structure, canonicals, and rich snippets.',
    alternates: {
        canonical: '/tools/saas-seo-checker',
    },
    openGraph: {
        title: 'SaaS SEO Checker | LaunchXact',
        description: 'Audit your SaaS landing page SEO health in 30 seconds. Fix title truncation, missing canonicals, and CTR leaks.',
        url: 'https://www.launchxact.com/tools/saas-seo-checker',
        type: 'website',
    },
};

export default function SaasSeoCheckerPage() {
    return (
        <main style={{ minHeight: '80vh', paddingTop: '7rem', paddingBottom: '6rem' }}>
            <div style={{ maxWidth: '1040px', margin: '0 auto', padding: '0 1.25rem' }}>
                <Breadcrumb
                    items={[
                        { label: 'Founder Tools', href: '/tools' },
                        { label: 'SaaS SEO Checker' }
                    ]}
                />
                <SaasSeoChecker />
            </div>
        </main>
    );
}
