import { NextResponse } from 'next/server';
import { getArticlesByDomain } from '@/lib/articles';

export const dynamic = 'force-dynamic';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const site = searchParams.get('site') || '';

    const articles = getArticlesByDomain(site);

    const js = `
(function() {
    const target = document.getElementById('launchxact-articles');
    if (!target) return;

    const articles = ${JSON.stringify(articles)};

    if (articles.length === 0) {
        target.innerHTML = '<div style="padding: 2rem; text-align: center; color: #64748b; font-family: sans-serif;">No published articles yet. Check back soon!</div>';
        return;
    }

    const html = '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; font-family: -apple-system, sans-serif;">' +
        articles.map(a => 
            '<div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 1rem; padding: 1.5rem; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">' +
                '<div style="font-size: 0.8rem; color: #64748b; margin-bottom: 0.5rem;">' + (a.date ? new Date(a.date).toLocaleDateString() : '') + ' • ' + (a.author || 'Team') + '</div>' +
                '<h3 style="margin: 0 0 0.5rem; font-size: 1.25rem; font-weight: 700; color: #0f172a;"><a href="https://www.launchxact.com/articles/' + a.id + '" target="_blank" style="color: inherit; text-decoration: none;">' + a.title + '</a></h3>' +
                '<p style="margin: 0 0 1rem; font-size: 0.95rem; color: #475569; line-height: 1.5;">' + (a.description || '') + '</p>' +
                '<a href="https://www.launchxact.com/articles/' + a.id + '" target="_blank" style="color: #7c3aed; font-weight: 700; font-size: 0.9rem; text-decoration: none;">Read Article &rarr;</a>' +
            '</div>'
        ).join('') +
    '</div>';

    target.innerHTML = html;
})();
    `;

    return new NextResponse(js, {
        headers: {
            'Content-Type': 'application/javascript',
            'Cache-Control': 'public, max-age=60, s-maxage=60',
        }
    });
}
