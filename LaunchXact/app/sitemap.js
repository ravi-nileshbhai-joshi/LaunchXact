import { getAllTools } from '@/lib/data';

export default function sitemap() {
    const baseUrl = 'https://www.launchxact.com';
    const tools = getAllTools();

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

    const allRoutes = [...staticRoutes];

    return allRoutes.map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' || route === '/grade' ? 'daily' : 'monthly',
        priority: route === '' ? 1 : route.startsWith('/product/') ? 0.8 : route === '/grade' ? 0.9 : 0.7,
    }));
}
