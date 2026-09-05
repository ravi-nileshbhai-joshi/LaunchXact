const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const articlesDir = path.join(process.cwd(), 'data', 'articles', 'published');
const productsDir = path.join(process.cwd(), 'data', 'products');
const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');

const staticRoutes = [
    // Primary Homepage
    { loc: '', priority: '1.0', changefreq: 'daily' },

    // Primary Core Tools (High Priority Sitelink Candidates)
    { loc: '/grade', priority: '0.9', changefreq: 'daily' },
    { loc: '/tools/ai-saas-grader', priority: '0.9', changefreq: 'daily' },
    { loc: '/tools', priority: '0.9', changefreq: 'weekly' },
    { loc: '/tools/true-cost-of-payments', priority: '0.9', changefreq: 'weekly' },
    { loc: '/tools/franken-stack-cost-forecaster', priority: '0.9', changefreq: 'weekly' },
    { loc: '/tools/pre-launch-distribution-architect', priority: '0.9', changefreq: 'weekly' },
    { loc: '/tools/geo-schema-snippet-generator', priority: '0.9', changefreq: 'weekly' },

    // Core Guides & Playbooks
    { loc: '/where-to-launch-saas', priority: '0.8', changefreq: 'weekly' },
    { loc: '/saas-marketplace-guide', priority: '0.8', changefreq: 'weekly' },
    { loc: '/articles', priority: '0.8', changefreq: 'daily' },

    // Core Company Endpoints
    { loc: '/about', priority: '0.7', changefreq: 'monthly' },
    { loc: '/contact', priority: '0.7', changefreq: 'monthly' },

    // Utility & Legal Pages (Lower Priority to prevent Brand SERP crowding)
    { loc: '/terms', priority: '0.3', changefreq: 'monthly' },
    { loc: '/privacy', priority: '0.3', changefreq: 'monthly' },
    { loc: '/refund-policy', priority: '0.3', changefreq: 'monthly' },
];

let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

// Add static routes
for (const route of staticRoutes) {
    sitemapXml += `  <url>\n    <loc>https://www.launchxact.com${route.loc}</loc>\n    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n    <changefreq>${route.changefreq}</changefreq>\n    <priority>${route.priority}</priority>\n  </url>\n`;
}

// Add dynamic products
if (fs.existsSync(productsDir)) {
    const productFiles = fs.readdirSync(productsDir).filter(f => f.endsWith('.json'));
    for (const file of productFiles) {
        const slug = file.replace('.json', '');
        sitemapXml += `  <url>\n    <loc>https://www.launchxact.com/products/${slug}</loc>\n    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
    }
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

console.log('✅ sitemap.xml updated successfully with weighted tool pages, products, and articles.');
