import AiMentionTracker from '@/components/tools/AiMentionTracker';
import Breadcrumb from '@/components/Breadcrumb';

export const metadata = {
    title: 'AI Mention Tracker: LLM Brand Prompt & Citation Share Simulator',
    description: 'Free AI Mention Tracker for SaaS founders. Simulate how ChatGPT Search, Perplexity, and Claude answer buyer prompts in your category and claim citation share.',
    alternates: {
        canonical: '/tools/ai-mention-tracker',
    },
    openGraph: {
        title: 'AI Mention Tracker | LaunchXact',
        description: 'Simulate high-intent buyer prompts across ChatGPT and Perplexity. Track your SaaS citation share.',
        url: 'https://www.launchxact.com/tools/ai-mention-tracker',
        type: 'website',
    },
};

export default function AiMentionTrackerPage() {
    return (
        <main style={{ minHeight: '80vh', paddingTop: '7rem', paddingBottom: '6rem' }}>
            <div style={{ maxWidth: '1040px', margin: '0 auto', padding: '0 1.25rem' }}>
                <Breadcrumb
                    items={[
                        { label: 'Founder Tools', href: '/tools' },
                        { label: 'AI Mention Tracker' }
                    ]}
                />
                <AiMentionTracker />
            </div>
        </main>
    );
}
