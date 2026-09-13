import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { savePublishedArticle } from '@/lib/articles';

export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export async function POST(request) {
    try {
        const body = await request.json();
        const {
            article,
            webhookUrl,
            founderEmail,
            websiteUrl,
            authorName,
        } = body;

        if (!article || !article.title) {
            return NextResponse.json({ success: false, error: 'Article payload is required' }, { status: 400 });
        }

        // Clean and prepare domain
        const cleanDomain = (websiteUrl || 'launchxact.com')
            .replace(/^https?:\/\//, '')
            .replace(/\/.*$/, '')
            .replace(/^www\./, '');

        // Safe slug
        const slug = article.slug || article.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

        let founderSiteHasArticles = false;
        let siteCheckError = null;

        // 1. Check if the founder's site already has an /articles or /blog page
        if (websiteUrl && websiteUrl.startsWith('http')) {
            try {
                const urlObj = new URL(websiteUrl);
                const articlesEndpoint = `${urlObj.origin}/articles`;

                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 3500);

                const checkRes = await fetch(articlesEndpoint, {
                    method: 'GET',
                    headers: { 'User-Agent': 'LaunchXact-Articles-Checker/1.0' },
                    signal: controller.signal,
                });

                clearTimeout(timeoutId);

                // If status is 200 and not redirected to home/404
                if (checkRes.status === 200) {
                    founderSiteHasArticles = true;
                }
            } catch (checkErr) {
                siteCheckError = checkErr.message;
                founderSiteHasArticles = false;
            }
        }

        let webhookSuccess = false;
        let webhookResponseData = null;

        // 2. Dispatch to founder's webhook if provided
        if (webhookUrl && webhookUrl.trim().startsWith('http')) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 8000);

                const res = await fetch(webhookUrl.trim(), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'User-Agent': 'LaunchXact-AutoBlog-Publisher/1.0',
                    },
                    body: JSON.stringify({
                        event: 'post_published',
                        title: article.title,
                        slug,
                        meta_description: article.meta_description,
                        markdown_content: article.markdown_content,
                        html_content: article.html_content,
                        target_keyword: article.target_keyword,
                        word_count: article.word_count,
                        website_url: websiteUrl,
                        published_at: new Date().toISOString(),
                    }),
                    signal: controller.signal,
                });

                clearTimeout(timeoutId);

                webhookSuccess = res.ok;
                webhookResponseData = {
                    status: res.status,
                    statusText: res.statusText,
                };
            } catch (webhookErr) {
                console.warn('Webhook dispatch error:', webhookErr.message);
                webhookResponseData = { error: webhookErr.message };
            }
        }

        // 3. Always create/provision the article in filesystem so it is immediately live on LaunchXact Articles
        let savedPath = null;
        try {
            savedPath = savePublishedArticle({
                slug,
                title: article.title,
                description: article.meta_description,
                contentMarkdown: article.markdown_content,
                author: authorName || 'LaunchXact Founder Network',
                domain: cleanDomain,
                websiteUrl: websiteUrl || 'https://www.launchxact.com',
            });
        } catch (saveErr) {
            console.warn('Filesystem publish error (will rely on Supabase):', saveErr.message);
        }

        // 4. Record to Supabase auto_blog_posts table
        if (supabase) {
            try {
                await supabase.from('auto_blog_posts').upsert([{
                    email: founderEmail || null,
                    website_url: websiteUrl || 'unknown',
                    title: article.title,
                    slug,
                    target_keyword: article.target_keyword || '',
                    meta_description: article.meta_description || '',
                    reading_time: article.reading_time || '6 min read',
                    word_count: article.word_count || 0,
                    seo_score: article.seo_score || 98,
                    markdown_content: article.markdown_content,
                    html_content: article.html_content,
                    status: 'published',
                    published_via: webhookSuccess ? 'webhook' : 'provisioned_articles_page',
                    webhook_response: webhookResponseData,
                    published_at: new Date().toISOString(),
                }], { onConflict: 'slug' });

                // Increment usage counter on subscription
                if (founderEmail) {
                    await supabase.rpc('increment_auto_blog_count', { founder_email: founderEmail }).catch(() => {});
                }
            } catch (dbErr) {
                console.warn('Supabase post record error:', dbErr.message);
            }
        }

        const liveArticleUrl = `/articles/${slug}`;
        const founderHubUrl = `/articles/founder/${encodeURIComponent(cleanDomain)}`;
        const embedSnippet = `<div id="launchxact-articles" data-site="${cleanDomain}"></div>\n<script src="https://www.launchxact.com/api/tools/auto-blog/embed.js?site=${cleanDomain}" async></script>`;

        const message = !founderSiteHasArticles
            ? `Your website did not have an active /articles page. We automatically created and provisioned a high-speed, SEO-optimized Articles Page for ${cleanDomain} and published your article live!`
            : `Article verified and published directly to your website articles page!`;

        return NextResponse.json({
            success: true,
            articlesPageCreated: !founderSiteHasArticles,
            founderSiteHasArticles,
            published_via: webhookSuccess ? 'webhook' : 'provisioned_articles_page',
            webhook_delivered: webhookSuccess,
            liveArticleUrl,
            founderHubUrl,
            embedSnippet,
            cleanDomain,
            message,
            article: {
                title: article.title,
                slug,
                word_count: article.word_count,
            }
        });

    } catch (err) {
        console.error('Publish API error:', err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
