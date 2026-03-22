export default function sitemap() {
    const baseUrl = 'https://www.launchxact.com';

    const staticRoutes = [
        '',
        '/grade',
        '/where-to-launch-saas',
        '/about',
        '/contact',
        '/terms',
        '/privacy',
        '/refund-policy'
    ];

    return staticRoutes.map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' || route === '/grade' ? 'daily' : 'monthly',
        priority: route === '' ? 1 : route === '/grade' ? 0.9 : 0.7,
    }));
}
