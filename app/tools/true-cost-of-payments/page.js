import PaymentCostSimulator from '@/components/tools/PaymentCostSimulator';

export const metadata = {
    title: 'The True Cost of Payments Simulator | Merchant of Record vs. Gateway Calculator',
    description: 'Calculate the hidden costs of raw payment gateways: international VAT/GST compliance, tax software fees, and hours lost per month compared to a flat Merchant of Record fee.',
    keywords: [
        'payment cost calculator',
        'merchant of record vs stripe',
        'saas tax compliance cost',
        'paddle vs stripe cost',
        'true cost of payments',
        'saas vat gst simulator'
    ],
    alternates: {
        canonical: '/tools/true-cost-of-payments',
    },
    openGraph: {
        title: 'The True Cost of Payments Simulator | LaunchXact',
        description: 'Are you overpaying for raw payment gateways? Calculate your hidden tax compliance, FX, and CPA fees in seconds.',
        url: 'https://www.launchxact.com/tools/true-cost-of-payments',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'The True Cost of Payments Simulator',
        description: 'Compare raw gateway tax overhead with flat Merchant of Record fees for your SaaS.',
    },
};

export default function TrueCostOfPaymentsPage() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'The True Cost of Payments Simulator',
        url: 'https://www.launchxact.com/tools/true-cost-of-payments',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'All',
        browserRequirements: 'Requires JavaScript',
        description: 'Interactive simulator comparing the real financial and time cost of manual gateway tax compliance against a flat Merchant of Record fee.',
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
        },
        creator: {
            '@type': 'Organization',
            name: 'LaunchXact',
            url: 'https://www.launchxact.com',
        },
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <main style={{ minHeight: '80vh', paddingTop: '7rem', paddingBottom: '6rem' }}>
                <PaymentCostSimulator />
            </main>
        </>
    );
}
