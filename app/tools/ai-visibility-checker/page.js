import AiVisibilityChecker from '@/components/tools/AiVisibilityChecker';
import Breadcrumb from '@/components/Breadcrumb';

export const metadata = {
    title: 'AI Visibility Checker: Generative Engine Optimization (GEO) Audit',
    description: 'Free AI Visibility Checker for SaaS. Audit whether your software is structured to be cited and recommended by ChatGPT Search, Perplexity, and Claude.',
    alternates: {
        canonical: '/tools/ai-visibility-checker',
    },
    openGraph: {
        title: 'AI Visibility Checker | LaunchXact',
        description: 'Audit your SaaS for Generative Engine Optimization (GEO). Get cited by ChatGPT and Perplexity.',
        url: 'https://www.launchxact.com/tools/ai-visibility-checker',
        type: 'website',
    },
};

export default function AiVisibilityCheckerPage() {
    return (
        <main style={{ minHeight: '80vh', paddingTop: '7rem', paddingBottom: '6rem' }}>
            <div style={{ maxWidth: '1040px', margin: '0 auto', padding: '0 1.25rem' }}>
                <Breadcrumb
                    items={[
                        { label: 'Founder Tools', href: '/tools' },
                        { label: 'AI Visibility Checker' }
                    ]}
                />
                <AiVisibilityChecker />
            </div>
        </main>
    );
}
