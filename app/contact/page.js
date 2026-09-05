import ContactContent from '@/components/ContactContent';

export const metadata = {
    title: 'Contact Us: Partnerships & Founder Support',
    description: 'Get in touch with LaunchXact for partnerships, support, or inquiries. We are always looking for innovative SaaS products and passionate founders.',
    alternates: { canonical: '/contact' }
};

export default function Contact() {
    const contactPageJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        name: 'Contact LaunchXact',
        url: 'https://www.launchxact.com/contact',
        isPartOf: {
            '@type': 'WebSite',
            '@id': 'https://www.launchxact.com/#website'
        },
        publisher: {
            '@type': 'Organization',
            name: 'LaunchXact',
            url: 'https://www.launchxact.com',
            logo: {
                '@type': 'ImageObject',
                url: 'https://www.launchxact.com/icon.png'
            }
        }
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
                name: 'Contact',
                item: 'https://www.launchxact.com/contact'
            }
        ]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
            <ContactContent />
        </>
    );
}
