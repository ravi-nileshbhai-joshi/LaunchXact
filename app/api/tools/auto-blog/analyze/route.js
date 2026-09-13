import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

function cleanText(text) {
    if (!text) return '';
    return text
        .replace(/<[^>]*>/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/\s+/g, ' ')
        .trim();
}

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');
    return handleAnalyze(url);
}

export async function POST(request) {
    try {
        const body = await request.json();
        return handleAnalyze(body.url);
    } catch {
        return NextResponse.json({ success: false, error: 'Invalid JSON request' }, { status: 400 });
    }
}

async function handleAnalyze(rawUrl) {
    if (!rawUrl) {
        return NextResponse.json({ success: false, error: 'Website URL is required' }, { status: 400 });
    }

    let targetUrl = rawUrl.trim();
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
        targetUrl = `https://${targetUrl}`;
    }

    try {
        const parsedUrl = new URL(targetUrl);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 LaunchXactBot/1.0',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            },
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: Failed to load ${targetUrl}`);
        }

        const html = await response.text();

        // 1. Extract Title
        const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
        const title = titleMatch ? cleanText(titleMatch[1]) : parsedUrl.hostname;

        // 2. Extract Meta Description
        const descMatch = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i) ||
                          html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i) ||
                          html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i);
        const description = descMatch ? cleanText(descMatch[1]) : '';

        // 3. Extract OpenGraph Title
        const ogTitleMatch = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i);
        const ogTitle = ogTitleMatch ? cleanText(ogTitleMatch[1]) : title;

        // 4. Extract H1 Headings
        const h1Matches = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)];
        const h1List = h1Matches.map(m => cleanText(m[1])).filter(Boolean);

        // 5. Extract H2 Headings
        const h2Matches = [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)];
        const h2List = h2Matches.map(m => cleanText(m[1])).filter(Boolean).slice(0, 8);

        // 6. Extract Hero Text / Paragraph snippets
        const pMatches = [...html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)];
        const paragraphs = pMatches.map(m => cleanText(m[1])).filter(p => p.length > 40).slice(0, 5);

        // 7. Determine Site Name / Brand
        const siteName = ogTitle.split(/[|\-–:]/)[0].trim() || parsedUrl.hostname.replace(/^www\./, '').split('.')[0];

        // 8. Derive Primary Value Prop & Problem
        const primaryHeadline = h1List[0] || ogTitle || title;
        const valueProposition = description || paragraphs[0] || 'Modern SaaS solution built for efficiency and scale.';

        // 9. Infer Target Audience & Keywords
        const combinedText = `${title} ${description} ${primaryHeadline} ${h2List.join(' ')} ${paragraphs.join(' ')}`.toLowerCase();
        
        let targetAudience = 'SaaS Founders, Product Managers & Growth Teams';
        if (combinedText.includes('developer') || combinedText.includes('api') || combinedText.includes('code') || combinedText.includes('stack')) {
            targetAudience = 'Full-Stack Developers, Technical Founders & Software Engineers';
        } else if (combinedText.includes('marketing') || combinedText.includes('seo') || combinedText.includes('traffic') || combinedText.includes('content')) {
            targetAudience = 'Growth Marketers, SEO Strategists & Solopreneurs';
        } else if (combinedText.includes('sales') || combinedText.includes('crm') || combinedText.includes('pipeline') || combinedText.includes('lead')) {
            targetAudience = 'B2B Sales Leaders, Account Executives & Revenue Operations';
        } else if (combinedText.includes('finance') || combinedText.includes('payment') || combinedText.includes('invoice') || combinedText.includes('tax')) {
            targetAudience = 'Bootstrapped Founders, CFOs & Operations Leaders';
        }

        // Generate recommended high-intent blog topic angles based on crawled data
        const suggestedKeywords = [
            `Why traditional solutions for ${siteName} are broken (and the 2026 alternative)`,
            `How to solve ${h2List[0] ? h2List[0].slice(0, 45) : 'founder bottlenecks'} without expensive enterprise software`,
            `The true cost of manual workflows vs. automated ${siteName}`,
            `The definitive guide to evaluating ${siteName} for modern teams`,
            `How top companies generate high-intent pipeline with ${primaryHeadline.slice(0, 40)}`,
        ];

        return NextResponse.json({
            success: true,
            url: targetUrl,
            profile: {
                siteName,
                domain: parsedUrl.hostname,
                title,
                description,
                headline: primaryHeadline,
                subheadings: h2List,
                valueProposition,
                targetAudience,
                suggestedKeywords,
                sampleCopy: paragraphs.slice(0, 3),
            }
        });

    } catch (err) {
        console.error('Website crawler error:', err.message);
        // Provide graceful fallback profile using domain name
        const domain = new URL(targetUrl).hostname.replace(/^www\./, '');
        const fallbackName = domain.split('.')[0].toUpperCase();

        return NextResponse.json({
            success: true,
            url: targetUrl,
            fallbackUsed: true,
            profile: {
                siteName: fallbackName,
                domain,
                title: `${fallbackName} - Software Platform`,
                description: `Modern platform designed to streamline operations and accelerate growth for ${domain}.`,
                headline: `Scale your operations faster with ${fallbackName}`,
                subheadings: ['Eliminate manual overhead', 'Built for high performance', 'Actionable analytics'],
                valueProposition: `A modern, high-performance software utility engineered to solve operational friction.`,
                targetAudience: 'SaaS Founders, Tech Leads & Growth Teams',
                suggestedKeywords: [
                    `How to streamline workflows with ${fallbackName}`,
                    `Why modern builders are switching away from legacy platforms`,
                    `The 2026 guide to automated efficiency for ${fallbackName}`,
                ],
                sampleCopy: []
            }
        });
    }
}
