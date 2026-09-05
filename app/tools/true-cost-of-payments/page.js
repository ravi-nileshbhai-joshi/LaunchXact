import PaymentCostSimulator from '@/components/tools/PaymentCostSimulator';
import Breadcrumb from '@/components/Breadcrumb';

export const metadata = {
    title: 'Payment Cost Simulator: Merchant of Record vs Gateway',
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
        title: 'The True Cost of Payments Simulator | LaunchXact',
        description: 'Compare raw gateway tax overhead with flat Merchant of Record fees for your SaaS.',
    },
};

export default function TrueCostOfPaymentsPage() {
    const webAppJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'The True Cost of Payments Simulator',
        url: 'https://www.launchxact.com/tools/true-cost-of-payments',
        isPartOf: {
            '@type': 'WebSite',
            '@id': 'https://www.launchxact.com/#website'
        },
        applicationCategory: 'BusinessApplication, FinanceApplication, UtilitiesApplication',
        operatingSystem: 'Web, All',
        browserRequirements: 'Requires JavaScript',
        description: 'Free interactive simulator comparing the real financial fees, tax software costs, and hours lost on manual payment gateway compliance against a flat Merchant of Record fee.',
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
        featureList: [
            'Real-Time Payment Gateway vs. MoR Calculator',
            'Cross-Border FX and Conversion Cost Forecaster',
            'Global VAT / GST Compliance Software Overhead Breakdown',
            'Founder Admin Hours Reclaimed Estimator',
            'Itemized Line-by-Line Cost Audit'
        ],
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.9',
            ratingCount: '128'
        }
    };

    const faqJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
            {
                '@type': 'Question',
                name: 'What is the true cost of using raw payment gateways like Stripe?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'While raw payment gateways advertise a base transaction fee of 2.9% + 30¢, the true cost includes additional cross-border and currency conversion fees (typically 1.5% to 2.5%), third-party tax calculation and invoicing software ($99 to $499/month), quarterly CPA and local filing costs ($150 to $350/month), and 8 to 22 hours of founder time spent on manual tax compliance.'
                }
            },
            {
                '@type': 'Question',
                name: 'What is a Merchant of Record (MoR) and how does it save SaaS founders money?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'A Merchant of Record (MoR) is the legal seller of software to the end customer. An MoR assumes 100% legal responsibility for calculating, collecting, and remitting global sales tax, VAT, and GST worldwide. By bundling payment processing, tax compliance, invoicing, and dispute liability into a single flat percentage fee (typically ~5%), founders eliminate third-party tax software subscriptions and save 10 to 20 administrative hours each month.'
                }
            },
            {
                '@type': 'Question',
                name: 'How does LaunchXact handle payments for founders?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'LaunchXact provides a built-in native Merchant of Record solution for products featured in its curated SaaS marketplace. Founders can sell worldwide to 50+ countries without having to register for VAT OSS in the EU, HMRC in the UK, or sales tax nexus permits across individual US states.'
                }
            },
            {
                '@type': 'Question',
                name: 'When should a SaaS switch from a raw payment gateway to a Merchant of Record?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'A SaaS should switch to a Merchant of Record as soon as it begins accepting customers from multiple international countries, especially the European Union, the United Kingdom, Canada, or Australia, where digital services are subject to strict destination-based VAT and GST reporting.'
                }
            }
        ]
    };

    const breadcrumbJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://www.launchxact.com'
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: 'Founder Tools',
                item: 'https://www.launchxact.com/tools'
            },
            {
                '@type': 'ListItem',
                position: 3,
                name: 'The True Cost of Payments Simulator',
                item: 'https://www.launchxact.com/tools/true-cost-of-payments'
            }
        ]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
            <main style={{ minHeight: '80vh', paddingTop: '7rem', paddingBottom: '6rem' }}>
                <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
                    <Breadcrumb items={[
                        { label: 'Founder Tools', href: '/tools' },
                        { label: 'Payment Cost Simulator' }
                    ]} />
                </div>
                <PaymentCostSimulator />
            </main>
        </>
    );
}
