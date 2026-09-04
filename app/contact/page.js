import ContactContent from '@/components/ContactContent';

export const metadata = {
    title: 'Contact LaunchXact | Partnership & Support',
    description: 'Get in touch with LaunchXact for partnerships, support, or inquiries. We are always looking for innovative SaaS products and passionate founders.',
    alternates: { canonical: '/contact' }
};

export default function Contact() {
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
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
            <ContactContent />
        </>
    );
}
