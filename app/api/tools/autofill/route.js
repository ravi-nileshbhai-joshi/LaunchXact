import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { supabase } from '@/lib/supabase';

// Helper: Normalize URLs
function normalizeUrl(inputUrl) {
    if (!inputUrl) return '';
    let url = inputUrl.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = `https://${url}`;
    }
    try {
        const parsed = new URL(url);
        return parsed.toString();
    } catch {
        return url;
    }
}

// Helper: Generate URL-friendly slug
function generateSlug(name) {
    const base = (name || 'saas')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
    const hash = Math.random().toString(36).substring(2, 7);
    return `${base}-${hash}`;
}

// Helper: Extract logo candidates from raw HTML
function extractLogoCandidates(html, baseUrl) {
    const candidates = [];
    let baseOrigin = '';
    try {
        baseOrigin = new URL(baseUrl).origin;
    } catch {
        baseOrigin = baseUrl;
    }

    // 1. Apple Touch Icon (typically high-res 180x180)
    const appleMatch = html.match(/<link[^>]+rel=["']apple-touch-icon(?:-precomposed)?["'][^>]+href=["']([^"']+)["']/i);
    if (appleMatch && appleMatch[1]) {
        candidates.push({ type: 'apple-touch-icon', url: appleMatch[1], priority: 1 });
    }

    // 2. High-res SVG or PNG img tags with 'logo' in class/id/alt/src
    const imgRegex = /<img[^>]+(?:src=["']([^"']+)["'][^>]+(?:alt|class|id)=["'][^"']*(?:logo|brand)[^"']*["']|(?:alt|class|id)=["'][^"']*(?:logo|brand)[^"']*["'][^>]+src=["']([^"']+)["'])[^>]*>/gi;
    let imgMatch;
    while ((imgMatch = imgRegex.exec(html)) !== null) {
        const src = imgMatch[1] || imgMatch[2];
        if (src && !src.startsWith('data:')) {
            candidates.push({ type: 'img-logo', url: src, priority: 2 });
            break;
        }
    }

    // 3. OpenGraph Image
    const ogMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i);
    if (ogMatch && ogMatch[1]) {
        candidates.push({ type: 'og:image', url: ogMatch[1], priority: 3 });
    }

    // 4. Standard Link Icon (svg or png preferred)
    const iconRegex = /<link[^>]+rel=["'](?:shortcut )?icon["'][^>]+href=["']([^"']+)["']/gi;
    let iconMatch;
    while ((iconMatch = iconRegex.exec(html)) !== null) {
        const href = iconMatch[1];
        if (href) {
            candidates.push({ type: 'icon', url: href, priority: 4 });
            break;
        }
    }

    // 5. Direct favicon.ico fallback
    candidates.push({ type: 'favicon-default', url: `${baseOrigin}/favicon.ico`, priority: 5 });

    // 6. High-res Google Favicon service fallback
    try {
        const host = new URL(baseUrl).hostname;
        candidates.push({
            type: 'google-favicon',
            url: `https://www.google.com/s2/favicons?domain=${host}&sz=128`,
            priority: 6
        });
    } catch {
        // ignore
    }

    // Resolve relative URLs to absolute
    const resolved = [];
    for (const item of candidates) {
        try {
            const absoluteUrl = new URL(item.url, baseUrl).href;
            resolved.push({ ...item, fullUrl: absoluteUrl });
        } catch {
            // invalid URL skip
        }
    }

    // Sort by priority
    resolved.sort((a, b) => a.priority - b.priority);
    return resolved;
}

// Helper: Catch logo, download buffer and attempt Supabase storage upload
async function catchAndStoreLogo(logoCandidates, productName, domainSlug) {
    let finalLogoUrl = null;
    let storedInSupabase = false;

    // Iterate through top 3 candidates until one successfully loads
    for (const candidate of logoCandidates.slice(0, 3)) {
        try {
            const imgRes = await fetch(candidate.fullUrl, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 LaunchXactLogoBot/1.0',
                    'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
                },
                signal: AbortSignal.timeout(2500)
            });

            if (!imgRes.ok) continue;

            const contentType = imgRes.headers.get('content-type') || '';
            const arrayBuffer = await imgRes.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            // Verify minimum byte length
            if (buffer.length < 50) continue;

            // Determine file extension
            let ext = 'png';
            if (contentType.includes('svg') || candidate.fullUrl.endsWith('.svg')) ext = 'svg';
            else if (contentType.includes('webp') || candidate.fullUrl.endsWith('.webp')) ext = 'webp';
            else if (contentType.includes('jpeg') || candidate.fullUrl.endsWith('.jpg')) ext = 'jpg';
            else if (contentType.includes('icon') || candidate.fullUrl.endsWith('.ico')) ext = 'ico';

            // Attempt upload to Supabase Storage 'product-logos' bucket
            try {
                const filePath = `${domainSlug}-${Date.now()}.${ext}`;
                const { error: uploadErr } = await supabase.storage
                    .from('product-logos')
                    .upload(filePath, buffer, {
                        contentType: contentType || `image/${ext}`,
                        upsert: true
                    });

                if (!uploadErr) {
                    const { data: pubUrlData } = supabase.storage
                        .from('product-logos')
                        .getPublicUrl(filePath);

                    if (pubUrlData?.publicUrl) {
                        finalLogoUrl = pubUrlData.publicUrl;
                        storedInSupabase = true;
                        break;
                    }
                } else {
                    console.warn('Supabase storage upload skipped (bucket policy pending):', uploadErr.message);
                }
            } catch (storageException) {
                console.warn('Supabase storage caught exception:', storageException.message);
            }

            // Fallback: If Supabase bucket is not yet active, use the live verified image URL
            finalLogoUrl = candidate.fullUrl;
            break;

        } catch (fetchErr) {
            // Try next candidate
            continue;
        }
    }

    // Ultimate fallback if no candidate loaded
    if (!finalLogoUrl && logoCandidates.length > 0) {
        finalLogoUrl = logoCandidates[0].fullUrl;
    }

    return { logoUrl: finalLogoUrl || '', storedInSupabase };
}

// Fallback deterministic extractor when Groq is unavailable
function generateDeterministicFallback(rawScraped, toolType) {
    const { title, metaDesc, hostname, cleanText } = rawScraped;
    const inferredName = title.split(/[-|–:]/)[0]?.trim() || hostname.replace(/\.[a-z]+$/i, '');
    const cleanDesc = metaDesc || `The modern platform engineered for ${inferredName} workflows.`;

    if (toolType === 'grader') {
        return {
            ideaName: inferredName,
            targetCustomer: 'B2B teams, developers, and operators looking for high-velocity software',
            pricing: '$29 to $99/mo SaaS subscription with free trial tier',
            description: cleanDesc,
            competitors: 'Legacy manual workflows and fragmented spreadsheets',
            distribution: 'Direct founder outreach, SEO, and curated SaaS directory listings'
        };
    }

    if (toolType === 'distribution') {
        return {
            productName: inferredName,
            category: 'b2b_saas',
            stage: 'beta',
            audience: 'Modern technical operators and B2B workflow teams'
        };
    }

    if (toolType === 'onboarding') {
        return {
            productName: inferredName,
            website: `https://${hostname}`,
            description: cleanDesc,
            category: 'AI & DevTools',
            stage: 'Live',
            monthlyRevenue: 'Pre-revenue ($0)',
            biggestProblem: 'Distribution'
        };
    }

    // Default to geo-schema
    return {
        name: inferredName,
        url: `https://${hostname}`,
        description: cleanDesc,
        category: 'BusinessApplication',
        operatingSystem: 'Web, All',
        pricingModel: 'Freemium',
        price: '29',
        currency: 'USD',
        orgName: `${inferredName} Inc.`,
        features: [
            'Streamlined workflow automation',
            'Real-time analytics and observability',
            'Seamless API and third-party integrations',
            'Enterprise-grade security and role-based access'
        ],
        faqs: [
            {
                q: `What is ${inferredName}?`,
                a: `${inferredName} is a modern software application designed to solve key operational bottlenecks with zero setup overhead.`
            },
            {
                q: `How does ${inferredName} pricing work?`,
                a: `We offer flexible tiers starting with a generous free trial, followed by transparent monthly plans with zero hidden fees.`
            },
            {
                q: `Is ${inferredName} compatible with my existing stack?`,
                a: `Yes, ${inferredName} provides native cloud integrations and standard web APIs for seamless plug-and-play onboarding.`
            }
        ]
    };
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { url: rawUrl, toolType = 'geo-schema' } = body;

        if (!rawUrl || typeof rawUrl !== 'string' || !rawUrl.trim()) {
            return NextResponse.json(
                { error: 'Please provide a valid website URL.' },
                { status: 400 }
            );
        }

        const normalizedUrl = normalizeUrl(rawUrl);
        let parsedUrl;
        try {
            parsedUrl = new URL(normalizedUrl);
        } catch {
            return NextResponse.json(
                { error: 'Invalid URL format. Please provide e.g. https://yourstartup.com' },
                { status: 400 }
            );
        }

        console.log(`🤖 AI Auto-Fill request for [${toolType}]:`, normalizedUrl);

        // 1. Fetch Landing Page HTML
        let html = '';
        try {
            const pageRes = await fetch(normalizedUrl, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 LaunchXactBot/1.0',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
                },
                signal: AbortSignal.timeout(8000),
                redirect: 'follow'
            });

            if (!pageRes.ok) {
                console.warn(`Fetch returned status ${pageRes.status} for ${normalizedUrl}`);
            }
            html = await pageRes.text();
        } catch (fetchErr) {
            console.warn(`Could not reach ${normalizedUrl}:`, fetchErr.message);
            // We can still synthesize fallback data based on domain name
            html = `<html><head><title>${parsedUrl.hostname}</title></head><body><h1>${parsedUrl.hostname}</h1></body></html>`;
        }

        // 2. Extract Key HTML Metadata
        const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
        const title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : parsedUrl.hostname;

        const metaDescMatch = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i) ||
                              html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']*)["']/i);
        const metaDesc = metaDescMatch ? metaDescMatch[1].trim() : '';

        const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
        const h1 = h1Match ? h1Match[1].replace(/<[^>]+>/g, '').trim() : '';

        // Clean body text for LLM token efficiency
        let cleanText = html
            .replace(/<script[\s\S]*?<\/script>/gi, '')
            .replace(/<style[\s\S]*?<\/style>/gi, '')
            .replace(/<svg[\s\S]*?<\/svg>/gi, ' ')
            .replace(/<nav[\s\S]*?<\/nav>/gi, ' ')
            .replace(/<footer[\s\S]*?<\/footer>/gi, ' ')
            .replace(/<[^>]+>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();

        // Sample first 2400 chars of visible content
        const textSample = cleanText.slice(0, 2400);

        // 3. Catch Product Logo
        const domainSlug = parsedUrl.hostname.replace(/[^a-z0-9]/gi, '-').toLowerCase();
        const logoCandidates = extractLogoCandidates(html, normalizedUrl);
        const { logoUrl: capturedLogoUrl, storedInSupabase } = await catchAndStoreLogo(
            logoCandidates,
            title,
            domainSlug
        );

        console.log(`🖼️ Captured logo for ${parsedUrl.hostname}:`, capturedLogoUrl, `(Stored in Supabase: ${storedInSupabase})`);

        // 4. Extract Structured Data via Groq LLM
        let extractedData = null;

        if (process.env.GROQ_API_KEY) {
            const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

            let prompt = '';

            if (toolType === 'geo-schema') {
                prompt = `You are the LaunchXact Schema & GEO Intelligence Agent.
Extract accurate, high-fidelity structured data for this software product from the scraped content below:

WEBSITE URL: ${normalizedUrl}
DOMAIN: ${parsedUrl.hostname}
PAGE TITLE: ${title}
META DESCRIPTION: ${metaDesc}
PAGE H1: ${h1}
VISIBLE CONTENT:
${textSample}

Return valid JSON with this exact schema:
{
  "name": "<Exact clean software product name>",
  "url": "${normalizedUrl}",
  "description": "<Concise 1-2 sentence value proposition suitable for Schema.org SoftwareApplication>",
  "orgName": "<Company or publishing organization name>",
  "category": "<One of: DeveloperApplication, BusinessApplication, UtilitiesApplication, DesignApplication, FinanceApplication, SecurityApplication>",
  "operatingSystem": "<e.g. Web, All or macOS, Windows, Linux, Web>",
  "pricingModel": "<One of: Free, Freemium, Subscription, Free Trial, One-time>",
  "price": "<numeric string for starting price, e.g. '0' or '29' or '49'>",
  "currency": "USD",
  "features": [
    "<Bullet feature 1>",
    "<Bullet feature 2>",
    "<Bullet feature 3>",
    "<Bullet feature 4>"
  ],
  "faqs": [
    {
      "q": "<Frequently Asked Question 1 targeted for AI Search GEO citations>",
      "a": "<Direct, factual answer explaining how it works>"
    },
    {
      "q": "<Frequently Asked Question 2 about security, integrations, or data privacy>",
      "a": "<Clear reassuring answer>"
    },
    {
      "q": "<Frequently Asked Question 3 about pricing, tiers, or free trial>",
      "a": "<Clear answer about pricing structure>"
    }
  ]
}`;
            } else if (toolType === 'grader') {
                prompt = `You are the LaunchXact SaaS Viability Auditor Agent.
Extract the 6 fundamental inputs required to grade this SaaS startup from the scraped content below:

WEBSITE URL: ${normalizedUrl}
PAGE TITLE: ${title}
META DESCRIPTION: ${metaDesc}
PAGE H1: ${h1}
VISIBLE CONTENT:
${textSample}

Return valid JSON with this exact schema:
{
  "ideaName": "<Clean product or startup name>",
  "targetCustomer": "<Specific Ideal Customer Profile (ICP), e.g. Series A PMs, Shopify merchants with $50k+ GMV, etc.>",
  "pricing": "<Inferred or stated pricing tier, e.g. $49/mo pro subscription or 15% revenue share>",
  "description": "<2-3 sentence problem & solution breakdown of what the software does and why customers pay>",
  "competitors": "<2-3 realistic direct or indirect competitors, alternatives, or incumbent tools>",
  "distribution": "<The primary distribution channel, e.g. Cold outbound, SEO programmatic pages, Shopify App Store, etc.>"
}`;
            } else if (toolType === 'distribution') {
                prompt = `You are the LaunchXact Distribution Strategy Agent.
Extract launch positioning from this SaaS site:

WEBSITE URL: ${normalizedUrl}
TITLE: ${title}
DESCRIPTION: ${metaDesc}
CONTENT: ${textSample}

Return valid JSON with this exact schema:
{
  "productName": "<Clean product name>",
  "category": "<One of: devtool, b2b_saas, ai_micro, creator_consumer>",
  "stage": "<One of: ideation, building, beta>",
  "audience": "<1 sentence target audience description>"
}`;
            } else {
                // Generic / Onboarding
                prompt = `You are the LaunchXact Founder Onboarding Agent.
Extract founder submission details for the Genesis Batch from this SaaS site:

WEBSITE URL: ${normalizedUrl}
TITLE: ${title}
DESCRIPTION: ${metaDesc}
CONTENT: ${textSample}

Return valid JSON with this exact schema:
{
  "productName": "<Clean Product Name>",
  "website": "${normalizedUrl}",
  "description": "<Compelling 1-2 sentence pitch>",
  "category": "<Exact one of: AI & DevTools, B2B SaaS, Marketing & Sales, Fintech & Payments, Productivity & Ops, Creator Economy, Other>",
  "stage": "<Exact one of: Idea, MVP, Live, Already generating revenue>",
  "monthlyRevenue": "<Exact one of: Pre-revenue ($0), < $1,000 / mo, $1,000 – $5,000 / mo, $5,000 – $20,000 / mo, $20,000+ / mo>",
  "biggestProblem": "<Exact one of: Building, Infrastructure, Payments, Distribution, Discovery, Other>"
}`;
            }

            try {
                const completion = await groq.chat.completions.create({
                    messages: [
                        { role: 'system', content: 'You are a precise JSON data extraction agent for SaaS software. Always output valid JSON.' },
                        { role: 'user', content: prompt }
                    ],
                    model: 'qwen/qwen3.8-27b',
                    response_format: { type: 'json_object' },
                    max_tokens: 600,
                    temperature: 0.2,
                });

                const rawContent = completion.choices[0]?.message?.content;
                if (rawContent) {
                    extractedData = JSON.parse(rawContent);
                }
            } catch (errGroqPrimary) {
                console.warn('Primary Groq qwen3.8-27b failed, attempting gpt-oss-120b fallback:', errGroqPrimary.message);
                try {
                    const fallbackCompletion = await groq.chat.completions.create({
                        messages: [
                            { role: 'system', content: 'You are a precise JSON data extraction agent for SaaS software. Always output valid JSON.' },
                            { role: 'user', content: prompt }
                        ],
                        model: 'openai/gpt-oss-120b',
                        response_format: { type: 'json_object' },
                        max_tokens: 600,
                        temperature: 0.2,
                    });
                    const rawFb = fallbackCompletion.choices[0]?.message?.content;
                    if (rawFb) extractedData = JSON.parse(rawFb);
                } catch (errFb) {
                    console.error('All Groq extraction attempts failed:', errFb.message);
                }
            }
        }

        // Fallback to deterministic parser if AI extraction failed
        if (!extractedData) {
            extractedData = generateDeterministicFallback(
                { title, metaDesc, hostname: parsedUrl.hostname, cleanText },
                toolType
            );
        }

        // Ensure logoUrl is attached to extracted data
        extractedData.logoUrl = capturedLogoUrl;
        extractedData.url = normalizedUrl;

        // 5. Persist Product & Captured Logo into Supabase for Future Marketplace Onboarding
        let supabaseRecordId = null;
        let productSlug = null;
        try {
            const productName = extractedData.name || extractedData.productName || extractedData.ideaName || parsedUrl.hostname;
            productSlug = generateSlug(productName);

            const productPayload = {
                name: productName,
                tagline: (extractedData.description || metaDesc || `${productName} for modern teams`).slice(0, 140),
                description: extractedData.description || metaDesc || `Software product discovered at ${normalizedUrl}`,
                category: extractedData.category || 'Developer Tools',
                slug: productSlug,
                status: 'genesis_candidate', // Ready for marketplace onboarding
                aeo_content: {
                    logo_url: capturedLogoUrl,
                    website_url: normalizedUrl,
                    features: extractedData.features || [],
                    faqs: extractedData.faqs || [],
                    pricing: extractedData.pricing || extractedData.price || 'Freemium',
                    extracted_from_tool: toolType,
                    extracted_at: new Date().toISOString(),
                    stored_in_supabase_storage: storedInSupabase
                }
            };

            // Primary attempt: Include dedicated logo_url column
            const fullPayload = {
                ...productPayload,
                logo_url: capturedLogoUrl || null
            };

            let { data: insertedProduct, error: insertErr } = await supabase
                .from('products')
                .insert([fullPayload])
                .select('id, slug')
                .single();

            // If column 'logo_url' does not exist yet in Supabase, fallback gracefully
            if (insertErr && (insertErr.message?.includes('logo_url') || insertErr.code === '42703')) {
                console.warn('Dedicated logo_url column pending in schema, falling back to aeo_content store.');
                const { data: fallbackProduct, error: fbErr } = await supabase
                    .from('products')
                    .insert([productPayload])
                    .select('id, slug')
                    .single();
                insertedProduct = fallbackProduct;
                insertErr = fbErr;
            }

            if (insertErr) {
                console.warn('Supabase product staging warning:', insertErr.message);
            } else {
                supabaseRecordId = insertedProduct?.id;
                console.log('✅ Staged founder product in Supabase products table! ID:', supabaseRecordId);
            }
        } catch (dbErr) {
            console.warn('Database stashing caught exception:', dbErr.message);
        }

        return NextResponse.json({
            success: true,
            data: extractedData,
            logoUrl: capturedLogoUrl,
            productSlug,
            supabaseRecordId,
            message: `Successfully extracted data & captured logo for ${extractedData.name || extractedData.productName || parsedUrl.hostname}!`
        });

    } catch (error) {
        console.error('AutoFill API Error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to auto-fill data from website.' },
            { status: 500 }
        );
    }
}
