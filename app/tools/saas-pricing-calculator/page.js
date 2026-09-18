import SaasPricingCalculator from '@/components/tools/SaasPricingCalculator';
import Breadcrumb from '@/components/Breadcrumb';

export const metadata = {
    title: 'SaaS Pricing & Unit Economics Calculator: LTV, CAC, MRR & Churn Modeler',
    description: 'Free interactive SaaS pricing calculator. Model Target MRR, ARPU, churn sensitivity, customer lifetime, and LTV:CAC ratios to design profitable tiers.',
    alternates: {
        canonical: '/tools/saas-pricing-calculator',
    },
    openGraph: {
        title: 'SaaS Pricing & Unit Economics Calculator | LaunchXact',
        description: 'Design profitable SaaS pricing tiers and stress-test your LTV:CAC unit economics before launch.',
        url: 'https://www.launchxact.com/tools/saas-pricing-calculator',
        type: 'website',
    },
};

export default function SaasPricingCalculatorPage() {
    return (
        <main style={{ minHeight: '80vh', paddingTop: '7rem', paddingBottom: '6rem' }}>
            <div style={{ maxWidth: '1040px', margin: '0 auto', padding: '0 1.25rem' }}>
                <Breadcrumb
                    items={[
                        { label: 'Founder Tools', href: '/tools' },
                        { label: 'SaaS Pricing Calculator' }
                    ]}
                />
                <SaasPricingCalculator />
            </div>
        </main>
    );
}
