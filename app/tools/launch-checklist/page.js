import LaunchChecklist from '@/components/tools/LaunchChecklist';
import Breadcrumb from '@/components/Breadcrumb';

export const metadata = {
    title: 'SaaS Launch Checklist: 30-Point Pre-Launch & Launch Day Protocol',
    description: 'Free interactive SaaS launch checklist. Audit technical hardening, Merchant of Record payment setup, SEO schema, and community distribution before you launch.',
    alternates: {
        canonical: '/tools/launch-checklist',
    },
    openGraph: {
        title: 'SaaS Launch Checklist | LaunchXact',
        description: 'Ensure zero fatal omissions on launch day. 30-checkpoint interactive audit for indie founders.',
        url: 'https://www.launchxact.com/tools/launch-checklist',
        type: 'website',
    },
};

export default function LaunchChecklistPage() {
    return (
        <main style={{ minHeight: '80vh', paddingTop: '7rem', paddingBottom: '6rem' }}>
            <div style={{ maxWidth: '1040px', margin: '0 auto', padding: '0 1.25rem' }}>
                <Breadcrumb
                    items={[
                        { label: 'Founder Tools', href: '/tools' },
                        { label: 'Launch Checklist' }
                    ]}
                />
                <LaunchChecklist />
            </div>
        </main>
    );
}
