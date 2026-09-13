import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { createClient } from '@supabase/supabase-js';

const articlesDirectory = path.join(process.cwd(), 'data', 'articles', 'published');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

/**
 * Get all sorted articles from markdown files + Supabase
 */
export function getSortedArticlesData() {
    if (!fs.existsSync(articlesDirectory)) {
        return [];
    }

    const fileNames = fs.readdirSync(articlesDirectory);
    const allArticlesData = fileNames
        .filter(fileName => fileName.endsWith('.md'))
        .map(fileName => {
            const id = fileName.replace(/\.md$/, '');
            const fullPath = path.join(articlesDirectory, fileName);
            const fileContents = fs.readFileSync(fullPath, 'utf8');
            
            // Use gray-matter to parse the post metadata section
            const matterResult = matter(fileContents);

            return {
                id,
                ...matterResult.data
            };
        });

    // Sort articles by date descending
    return allArticlesData.sort((a, b) => {
        if ((a.date || '') < (b.date || '')) {
            return 1;
        } else {
            return -1;
        }
    });
}

/**
 * Filter articles by founder domain
 */
export function getArticlesByDomain(domain) {
    const all = getSortedArticlesData();
    if (!domain) return all;
    const clean = domain.toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '').replace(/^www\./, '');
    return all.filter(item => {
        const rawDomain = item.domain || item.websiteUrl;
        if (!rawDomain) {
            // Unassigned articles belong to launchxact
            return clean.includes('launchxact');
        }
        const itemDomain = rawDomain.toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '').replace(/^www\./, '');
        return itemDomain.includes(clean) || clean.includes(itemDomain);
    });
}

export function getAllArticleIds() {
    if (!fs.existsSync(articlesDirectory)) {
        return [];
    }
    const fileNames = fs.readdirSync(articlesDirectory);
    return fileNames
        .filter(fileName => fileName.endsWith('.md'))
        .map(fileName => {
            return {
                params: {
                    slug: fileName.replace(/\.md$/, '')
                }
            };
        });
}

/**
 * Fetch article by slug, checking local file system then Supabase fallback
 */
export async function getArticleData(id) {
    const fullPath = path.join(articlesDirectory, `${id}.md`);
    
    // 1. Try reading from filesystem
    if (fs.existsSync(fullPath)) {
        try {
            const fileContents = fs.readFileSync(fullPath, 'utf8');
            const matterResult = matter(fileContents);

            return {
                id,
                contentMarkdown: matterResult.content,
                ...matterResult.data
            };
        } catch (e) {
            console.warn('Filesystem article read error:', e.message);
        }
    }

    // 2. Fallback to Supabase auto_blog_posts table
    if (supabase) {
        try {
            const { data, error } = await supabase
                .from('auto_blog_posts')
                .select('*')
                .eq('slug', id)
                .maybeSingle();

            if (data && !error) {
                return {
                    id: data.slug,
                    title: data.title,
                    description: data.meta_description,
                    date: data.published_at || new Date().toISOString(),
                    author: data.author || 'Founder Team',
                    domain: data.website_url,
                    websiteUrl: data.website_url,
                    contentMarkdown: data.markdown_content,
                    canonical: data.canonical_url || `/articles/${data.slug}`,
                };
            }
        } catch (dbErr) {
            console.warn('Supabase article fallback error:', dbErr.message);
        }
    }

    return null;
}

/**
 * Save an article to the published articles directory
 */
export function savePublishedArticle({ slug, title, description, contentMarkdown, author, domain, websiteUrl }) {
    if (!fs.existsSync(articlesDirectory)) {
        fs.mkdirSync(articlesDirectory, { recursive: true });
    }

    const safeSlug = slug.replace(/[^a-z0-9-]/gi, '-').toLowerCase();
    const filePath = path.join(articlesDirectory, `${safeSlug}.md`);

    const frontmatter = `---
title: "${(title || '').replace(/"/g, '\\"')}"
description: "${(description || '').replace(/"/g, '\\"')}"
date: "${new Date().toISOString().split('T')[0]}"
author: "${(author || 'LaunchXact Founder Network').replace(/"/g, '\\"')}"
domain: "${domain || ''}"
websiteUrl: "${websiteUrl || ''}"
canonical: "/articles/${safeSlug}"
---

${contentMarkdown}
`;

    fs.writeFileSync(filePath, frontmatter, 'utf8');
    return filePath;
}
