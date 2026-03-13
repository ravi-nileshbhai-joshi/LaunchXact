import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { supabase } from '@/lib/supabase';

const SYSTEM_PROMPT = `You are the "LaunchXact Automated Auditor." Your goal is to review a SaaS landing page for the "Genesis Batch."
You are not a corporate SEO tool. You are a successful Technical Founder who is ruthless about conversion, trust, and shipping.

Analyze the provided landing page data (text, structure, CTAs) and provide a score out of 100 based on these 4 pillars:

1. THE HOOK (30% weight): Is the H1 solving a painful problem or just listing a feature? Does the sub-headline create urgency or curiosity? A great hook makes someone stop scrolling.

2. THE TRUST GAP (30% weight): Are there GitHub links, founder identity, social proof, testimonials, "Build in Public" signals, team photos, or investor logos? Does the page feel like a real human built it, or a template?

3. BUYER FRICTION (20% weight): Is the "Buy" or "Sign up" button clear and high-contrast? How many clicks to convert? Is there a "Wall of Text" problem? Is pricing transparent?

4. DISTRIBUTION POTENTIAL (20% weight): Would this tool survive the intense scrutiny of an enterprise buyer on a premium marketplace? Is there viral potential? Are there share hooks, embeddable widgets, or community elements?

TONE: Use "Founder Wit." Be direct and conversational. If something is bad, roast it — but constructively. If something is good, be genuinely encouraging. Think "senior dev code review" energy, not "corporate consultant."

Example roast lines:
- "This headline is so boring even your mom wouldn't click it."
- "Your CTA button is hiding like it owes someone money."
- "This is actually solid. You clearly ship."

You MUST return ONLY a valid JSON object with this exact structure:
{
  "product_name": "<string: the name of the SaaS/product being audited>",
  "total_score": <integer 0-100>,
  "pillar_scores": {
    "hook": <integer 0-100>,
    "trust": <integer 0-100>,
    "friction": <integer 0-100>,
    "distribution": <integer 0-100>
  },
  "founder_archetype": "<string: a fun, memorable archetype name like 'The Silent Architect', 'The Aggressive Shipper', 'The Hype Beast', 'The Technical Perfectionist', 'The Stealth Builder', 'The Overthinking Genius', etc.>",
  "roast_summary": "<string: 2-3 sentence witty, direct critique of the overall page>",
  "action_items": ["<string: functional, specific change #1>", "<string: functional, specific change #2>", "<string: functional, specific change #3>"],
  "ai_rewrite_h1": "<string: a high-converting replacement headline>",
  "original_h1": "<string: the current H1 from the page, or 'No H1 found' if missing>",
  "ecosystem_nudge": "<string: a sentence telling them how LaunchXact can help, e.g. 'There are 400 founders on LaunchXact right now looking for exactly this type of tool, but they can't find you.'>"
}`;

function normalizeUrl(url) {
    try {
        let normalized = url.toLowerCase().trim();
        if (!normalized.startsWith('http')) normalized = `https://${normalized}`;
        const parsed = new URL(normalized);
        let host = parsed.hostname.replace(/^www\./, '');
        return `${parsed.protocol}//${host}${parsed.pathname === '/' ? '' : parsed.pathname.replace(/\/$/, '')}`;
    } catch {
        return url;
    }
}

// Strip HTML to plain text, preserving some structure
function htmlToText(html) {
    let text = html;
    // Remove scripts and styles
    text = text.replace(/<script[\s\S]*?<\/script>/gi, '');
    text = text.replace(/<style[\s\S]*?<\/style>/gi, '');
    text = text.replace(/<noscript[\s\S]*?<\/noscript>/gi, '');
    // Extract H1 specifically
    const h1Match = text.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    const h1Text = h1Match ? h1Match[1].replace(/<[^>]+>/g, '').trim() : '';
    // Extract meta description
    const metaDescMatch = text.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i);
    const metaDesc = metaDescMatch ? metaDescMatch[1] : '';
    // Extract all headings
    const headings = [];
    const headingRegex = /<(h[1-6])[^>]*>([\s\S]*?)<\/\1>/gi;
    let match;
    while ((match = headingRegex.exec(text)) !== null) {
        headings.push(`[${match[1].toUpperCase()}] ${match[2].replace(/<[^>]+>/g, '').trim()}`);
    }
    // Extract links/CTAs
    const links = [];
    const linkRegex = /<a[^>]*>([\s\S]*?)<\/a>/gi;
    while ((match = linkRegex.exec(text)) !== null) {
        const linkText = match[1].replace(/<[^>]+>/g, '').trim();
        if (linkText.length > 1 && linkText.length < 100) {
            links.push(linkText);
        }
    }
    // Extract button text
    const buttons = [];
    const btnRegex = /<button[^>]*>([\s\S]*?)<\/button>/gi;
    while ((match = btnRegex.exec(text)) !== null) {
        const btnText = match[1].replace(/<[^>]+>/g, '').trim();
        if (btnText.length > 0) buttons.push(btnText);
    }
    // Strip all remaining HTML tags
    text = text.replace(/<[^>]+>/g, ' ');
    // Normalize whitespace
    text = text.replace(/\s+/g, ' ').trim();

    // Compose structured summary for the LLM
    let structured = '';
    if (h1Text) structured += `PRIMARY HEADLINE (H1): ${h1Text}\n\n`;
    if (metaDesc) structured += `META DESCRIPTION: ${metaDesc}\n\n`;
    if (headings.length > 0) structured += `ALL HEADINGS:\n${headings.join('\n')}\n\n`;
    if (buttons.length > 0) structured += `BUTTON/CTA TEXT: ${buttons.join(' | ')}\n\n`;
    if (links.length > 0) structured += `LINK TEXT (first 20): ${links.slice(0, 20).join(' | ')}\n\n`;
    structured += `FULL PAGE TEXT (truncated):\n${text.substring(0, 3000)}`;

    return structured;
}

// Demo/fallback result when no API key is configured
function getDemoResult(url) {
    return {
        total_score: 72,
        pillar_scores: { hook: 65, trust: 70, friction: 80, distribution: 68 },
        founder_archetype: "The Stealth Builder",
        roast_summary: `Your landing page has potential, but it's hiding like a ninja at a job fair. The headline could be sharper, and you're missing the social proof that makes visitors think "other smart people trust this."`,
        action_items: [
            "Rewrite your H1 to address a specific pain point, not just describe what you do",
            "Add at least one trust signal above the fold — founder photo, company logos, or a testimonial",
            "Make your primary CTA button 2x bigger and use a high-contrast color"
        ],
        ai_rewrite_h1: "Stop wasting 10 hours/week on [their problem] — automate it in 5 minutes",
        original_h1: "Welcome to our platform",
        ecosystem_nudge: "There are 400+ founders on LaunchXact right now looking for tools in your category, but they can't find you. Submit to the Genesis Batch to get discovered.",
        is_demo: true
    };
}

// Basic in-memory rate limiting (Reset on server restart)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS = 5; // 5 grades per hour per IP

function isRateLimited(ip) {
    const now = Date.now();
    const userData = rateLimitMap.get(ip) || { count: 0, firstRequest: now };

    if (now - userData.firstRequest > RATE_LIMIT_WINDOW) {
        userData.count = 1;
        userData.firstRequest = now;
        rateLimitMap.set(ip, userData);
        return false;
    }

    if (userData.count >= MAX_REQUESTS) {
        return true;
    }

    userData.count++;
    rateLimitMap.set(ip, userData);
    return false;
}

export async function POST(request) {
    try {
        const { url } = await request.json();

        // 0. Rate Limiting Check
        const ip = request.headers.get('x-forwarded-for') || 'anonymous';
        if (isRateLimited(ip)) {
            return NextResponse.json(
                { error: 'Too many requests. Please wait an hour before grading another URL.' },
                { status: 429 }
            );
        }

        if (!url) {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 });
        }

        // Validate URL format
        let parsedUrl;
        try {
            parsedUrl = new URL(url.startsWith('http') ? url : `https://${url}`);
        } catch {
            return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
        }

        // 1. Fetch the page HTML
        let html;
        try {
            const response = await fetch(parsedUrl.toString(), {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (compatible; LaunchXactBot/1.0; +https://launchxact.com)',
                    'Accept': 'text/html,application/xhtml+xml',
                },
                signal: AbortSignal.timeout(10000), // 10s timeout
            });

            if (!response.ok) {
                let errorMsg = `Could not reach that URL (HTTP ${response.status}).`;
                if (response.status === 403) errorMsg = "Your landing page is protected by a firewall/Cloudflare. Please ensure LaunchXactBot isn't blocked.";
                if (response.status === 404) errorMsg = "Landing page not found. Please check the URL.";

                return NextResponse.json(
                    { error: `${errorMsg} Make sure it's a live, public page.` },
                    { status: 422 }
                );
            }

            html = await response.text();
        } catch (fetchErr) {
            console.error('Scraper Error:', fetchErr);
            return NextResponse.json(
                { error: 'Could not fetch that URL. Make sure it\'s a live, publicly accessible page.' },
                { status: 422 }
            );
        }

        // 2. Extract structured text
        const pageText = htmlToText(html);

        // 3. Call Groq (or return demo)
        if (!process.env.GROQ_API_KEY) {
            console.warn('GROQ_API_KEY not set — returning demo grade result.');
            return NextResponse.json(getDemoResult(parsedUrl.toString()));
        }

        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                {
                    role: 'user',
                    content: `Audit this SaaS landing page for launch readiness.\n\nURL: ${parsedUrl.toString()}\n\n${pageText}`
                }
            ],
            model: 'llama-3.3-70b-versatile',
            response_format: { type: 'json_object' },
            temperature: 0.7,
        });

        const resultText = chatCompletion.choices[0]?.message?.content;

        if (!resultText) {
            return NextResponse.json({ error: 'AI returned an empty response. Try again.' }, { status: 500 });
        }

        const parsed = JSON.parse(resultText);

        // 4. Persist to Supabase (Async)
        try {
            const normalized = normalizeUrl(parsedUrl.toString());
            supabase.from('grader_results').upsert(
                {
                    url: normalized,
                    product_name: parsed.product_name || 'Unknown SaaS',
                    score: parsed.total_score,
                    archetype: parsed.founder_archetype,
                },
                { onConflict: 'url' }
            ).then(({ error }) => {
                if (error) console.error('Supabase Grader Error:', error);
            });
        } catch (dbErr) {
            console.error('DB Persistence Error:', dbErr);
        }

        return NextResponse.json(parsed);

    } catch (error) {
        console.error('Grade API Error:', error);
        return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
    }
}
