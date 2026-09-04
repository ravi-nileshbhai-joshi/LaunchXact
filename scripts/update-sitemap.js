const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const articlesDir = path.join(process.cwd(), 'data', 'articles', 'published');
const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');

const staticRoutes = [
    { loc: '', priority: '1.0', changefreq: 'daily' },
    { loc: '/grade', priority: '0.9', changefreq: 'daily' },
    { loc: '/where-to-launch-saas', priority: '0.7', changefreq: 'monthly' },
    { loc: '/saas-marketplace-guide', priority: '0.8', changefreq: 'monthly' },
    { loc: '/articles', priority: '0.8', changefreq: 'daily' },
    { loc: '/about', priority: '0.7', changefreq: 'monthly' },
    { loc: '/contact', priority: '0.7', changefreq: 'monthly' },
    { loc: '/terms', priority: '0.5', changefreq: 'monthly' },
    { loc: '/privacy', priority: '0.5', changefreq: 'monthly' },
    { loc: '/refund-policy', priority: '0.5', changefreq: 'monthly' },
];

let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

// Add static routes
for (const route of staticRoutes) {
    sitemapXml += `  <url>\n    <loc>https://www.launchxact.com${route.loc}</loc>\n    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n    <changefreq>${route.changefreq}</changefreq>\n    <priority>${route.priority}</priority>\n  </url>\n`;
}

// Add dynamic articles
if (fs.existsSync(articlesDir)) {
    const files = fs.readdirSync(articlesDir).filter(f => f.endsWith('.md'));
    for (const file of files) {
        const slug = file.replace('.md', '');
        const content = fs.readFileSync(path.join(articlesDir, file), 'utf8');
        const parsed = matter(content);
        const date = parsed.data.date || new Date().toISOString().split('T')[0];
        
        sitemapXml += `  <url>\n    <loc>https://www.launchxact.com/articles/${slug}</loc>\n    <lastmod>${date}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
    }
}

sitemapXml += `</urlset>`;

fs.writeFileSync(sitemapPath, sitemapXml, 'utf8');

console.log('✅ sitemap.xml updated successfully with dynamic article routes.');
