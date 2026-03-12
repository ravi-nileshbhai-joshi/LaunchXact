export default function sitemap() {
    const baseUrl = 'https://launchxact.com';

    const routes = [
        '',
        '/grade',
        '/where-to-launch-saas',
        '/explore',
        '/submit',
        '/about',
        '/contact',
        '/terms',
        '/privacy',
        '/refund-policy'
    ];

    return routes.map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' || route === '/grade' ? 'daily' : 'monthly',
        priority: route === '' ? 1 : route === '/grade' ? 0.9 : 0.7,
    }));
}
