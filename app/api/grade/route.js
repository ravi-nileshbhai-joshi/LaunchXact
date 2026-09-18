import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { supabase } from '@/lib/supabase';
import { enrollInLifecycle } from '@/lib/email-lifecycle';

const SYSTEM_PROMPT = `You are the "LaunchXact Free SaaS Discovery Auditor." You are an expert SaaS growth strategist, conversion copywriter, and AI engine optimization (GEO/AEO) engineer.
You evaluate SaaS landing pages and products to determine whether they are ready to be discovered by real human buyers, traditional search engines, and AI recommendation engines (ChatGPT, Perplexity, Gemini).

Evaluate the SaaS across 5 core discovery pillars (scored 0 to 100 each):

1. MESSAGING (0-100):
Can visitors immediately understand what the product does within 3 seconds? Is the outcome explicit or obscured by generic fluff ("The future of X")?

2. CONVERSION (0-100):
Does the landing page make the next action obvious? Is the call-to-action frictionless, above the fold, with transparent pricing and low commitment?

3. TRUST (0-100):
Does the website provide enough proof and evidence to believe the product? Are there social proof badges, customer numbers, founder signals, real screenshots, or case studies above the fold?

4. SEARCH (0-100):
Can traditional search engines (Google, Bing) understand, crawl, and index it? Is the page structured with clear H1/H2 hierarchy, descriptive meta tags, and clean semantic markup?

5. AI DISCOVERY (0-100):
Is the product represented clearly enough for AI systems (ChatGPT, Perplexity, Gemini, Claude) to understand and surface it? Are entity definitions, software schemas, and clear use-case mappings present?

Calculate the OVERALL SCORE (0-100) as the average of these 5 pillars.

Identify the TOP 3 PRIORITY FIXES in order of impact (Fix these 3 things first):
Item 1 (🔴 High Priority): Focus on H1 headline clarity / outcome positioning. Include "current" (what they currently say or common pitfall) and "recommended" (the rewritten outcome-focused copy).
Item 2 (🟠 Medium Priority): Focus on social proof / trust signals above the fold.
Item 3 (🟠 Medium Priority): Focus on structured product info, search tags, or AI-search readiness.

You MUST return ONLY a valid JSON object with this exact structure:
{
  "idea_name": "<string: name or title of the product>",
  "overall_score": <integer 0-100>,
  "pillar_scores": {
    "messaging": <integer 0-100>,
    "conversion": <integer 0-100>,
    "trust": <integer 0-100>,
    "search": <integer 0-100>,
    "ai_discovery": <integer 0-100>
  },
  "verdict_headline": "<string: 1 punchy sentence summarizing overall discovery readiness>",
  "diagnosis_items": [
    {
      "priority": "high",
      "title": "Your H1 doesn't explain the outcome",
      "current": "The future of...",
      "recommended": "Automate X without Y",
      "details": "<string: explanation of why this fix matters>"
    },
    {
      "priority": "medium",
      "title": "No social proof above the fold",
      "current": "<string: current status>",
      "recommended": "<string: recommended addition>",
      "details": "<string: explanation>"
    },
    {
      "priority": "medium",
      "title": "Missing structured product information",
      "current": "<string: current status>",
      "recommended": "<string: recommended addition>",
      "details": "<string: explanation>"
    }
  ]
}`;

// Helper: normalize URLs
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

// Scrape helper for landing page content if a URL is provided
async function scrapeUrlSafe(url) {
    try {
        const parsedUrl = new URL(url.startsWith('http') ? url : `https://${url}`);
        const response = await fetch(parsedUrl.toString(), {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; LaunchXactBot/1.0; +https://launchxact.com)',
                'Accept': 'text/html,application/xhtml+xml',
            },
            signal: AbortSignal.timeout(6000), // 6s max
        });

        if (!response.ok) return null;
        const html = await response.text();
        
        // Strip scripts & styles
        let text = html.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '');
        const h1Match = text.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
        const h1 = h1Match ? h1Match[1].replace(/<[^>]+>/g, '').trim() : '';
        const metaMatch = text.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i);
        const metaDesc = metaMatch ? metaMatch[1] : '';

        text = text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        return `[LANDING PAGE DETECTED]\nURL: ${parsedUrl.toString()}\nH1: ${h1}\nDescription: ${metaDesc}\nPage Snippet: ${text.substring(0, 1500)}`;
    } catch (err) {
        console.warn('URL scraping skipped/failed:', err.message);
        return null;
    }
}

// Deterministic high-quality fallback generator if Groq API is unavailable
function generateFallbackGrade({ ideaName, targetCustomer, pricing, description, competitors, distribution, url }) {
    const name = ideaName || 'Your SaaS';
    const hasClearH1 = description && description.length > 25;
    const hasPricing = pricing && pricing.length > 5;

    const messaging = hasClearH1 ? 78 : 58;
    const conversion = hasPricing ? 64 : 48;
    const trust = 71;
    const search = 52;
    const ai_discovery = 43;

    const overall_score = Math.round((messaging + conversion + trust + search + ai_discovery) / 5);

    return {
        idea_name: name,
        overall_score,
        pillar_scores: {
            messaging,
            conversion,
            trust,
            search,
            ai_discovery
        },
        verdict_headline: "Good core concept, but your messaging & AI discovery layer need immediate optimization to scale organic traffic.",
        diagnosis_items: [
            {
                priority: 'high',
                title: "Your H1 doesn't explain the outcome",
                current: description ? `"${description.substring(0, 35)}..."` : '"The future of automated productivity..."',
                recommended: `"Automate ${targetCustomer || 'your key workflow'} without ${competitors || 'manual overhead'}"`,
                details: "Visitors leave within 3 seconds if your primary headline describes your technology instead of the concrete outcome your customer gets."
            },
            {
                priority: 'medium',
                title: "No social proof above the fold",
                current: "Hero section relies primarily on text claims without visible proof indicators.",
                recommended: 'Add "Trusted by 100+ teams", live user counters, or verified customer rating badges directly below your main CTA button.',
                details: "Social proof placed above the fold increases visitor trial conversion by up to 34%."
            },
            {
                priority: 'medium',
                title: "Missing structured product information for AI Search",
                current: "No JSON-LD SoftwareApplication schema or structured capabilities matrix.",
                recommended: "Add schema tags & explicit feature lists so ChatGPT, Perplexity, and Gemini can index and recommend your product.",
                details: "Modern AI search engines require structured metadata to surface your SaaS when users ask for recommendations in your niche."
            }
        ],
        is_demo: true
    };
}

// Rate limiting (In-memory, 10 per hour per IP)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000;
const MAX_REQUESTS = 10;

function isRateLimited(ip) {
    const now = Date.now();
    const userData = rateLimitMap.get(ip) || { count: 0, firstRequest: now };

    if (now - userData.firstRequest > RATE_LIMIT_WINDOW) {
        userData.count = 1;
        userData.firstRequest = now;
        rateLimitMap.set(ip, userData);
        return false;
    }

    if (userData.count >= MAX_REQUESTS) return true;

    userData.count++;
    rateLimitMap.set(ip, userData);
    return false;
}

// GET: Return real-time count of joined Genesis Batch founders from Supabase
export async function GET() {
    try {
        const { count, error } = await supabase
            .from('waitlist_founders')
            .select('*', { count: 'exact', head: true });

        if (error) {
            console.warn('Supabase waitlist_founders count query error:', error.message);
            return NextResponse.json({ founderCount: 14 });
        }

        return NextResponse.json({ founderCount: count ?? 14 });
    } catch (err) {
        console.error('GET /api/grade error:', err);
        return NextResponse.json({ founderCount: 14 });
    }
}

// POST: Brutally grade the AI SaaS idea
export async function POST(request) {
    try {
        const body = await request.json();
        const {
            ideaName = '',
            targetCustomer = '',
            pricing = '',
            description = '',
            competitors = '',
            distribution = '',
            url = '',
            email = '',
        } = body;

        // Rate limiting
        const ip = request.headers.get('x-forwarded-for') || 'anonymous';
        if (isRateLimited(ip)) {
            return NextResponse.json(
                { error: 'Rate limit exceeded. You can perform up to 10 idea audits per hour.' },
                { status: 429 }
            );
        }

        // Must provide at least an idea name or description or URL
        if (!ideaName.trim() && !description.trim() && !url.trim()) {
            return NextResponse.json(
                { error: 'Please provide at least your SaaS Idea Name or Description.' },
                { status: 400 }
            );
        }

        // Optional URL scraping for deeper context if user provided a URL
        let urlContext = '';
        if (url.trim()) {
            urlContext = await scrapeUrlSafe(url.trim());
        }

        // Construct user prompt with all 6 inputs
        const userPrompt = `Audit this AI SaaS for launch readiness, moat, and business viability:

IDEA / PRODUCT NAME: ${ideaName || 'Not specified'}
TARGET CUSTOMER: ${targetCustomer || 'Not specified'}
PRICING MODEL & TIER: ${pricing || 'Not specified'}
PROBLEM & SOLUTION DESCRIPTION: ${description || 'Not specified'}
KNOWN COMPETITORS & ALTERNATIVES: ${competitors || 'None mentioned'}
DISTRIBUTION STRATEGY: ${distribution || 'None detailed'}
OPTIONAL LIVE URL: ${url || 'None provided'}
${urlContext ? `\nSCRAPED WEBSITE CONTENT:\n${urlContext}` : ''}

Deliver your brutal, quantitative 6-pillar viability audit in valid JSON format.`;

        let resultData = null;

        if (!process.env.GROQ_API_KEY) {
            console.warn('GROQ_API_KEY not set — generating fallback grade.');
            resultData = generateFallbackGrade({ ideaName, targetCustomer, pricing, description, competitors, distribution, url });
        } else {
            const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

            try {
                const completion = await groq.chat.completions.create({
                    messages: [
                        { role: 'system', content: SYSTEM_PROMPT },
                        { role: 'user', content: userPrompt }
                    ],
                    model: 'openai/gpt-oss-120b',
                    response_format: { type: 'json_object' },
                    temperature: 0.7,
                });

                const rawContent = completion.choices[0]?.message?.content;
                if (rawContent) {
                    resultData = JSON.parse(rawContent);
                }
            } catch (err120b) {
                console.warn('Primary model openai/gpt-oss-120b failed, trying fallback:', err120b.message);
                try {
                    const fallbackCompletion = await groq.chat.completions.create({
                        messages: [
                            { role: 'system', content: SYSTEM_PROMPT },
                            { role: 'user', content: userPrompt }
                        ],
                        model: 'openai/gpt-oss-20b',
                        response_format: { type: 'json_object' },
                        temperature: 0.7,
                    });
                    const rawFallback = fallbackCompletion.choices[0]?.message?.content;
                    if (rawFallback) {
                        resultData = JSON.parse(rawFallback);
                    }
                } catch (errFallback) {
                    console.error('All Groq models failed, using intelligent fallback:', errFallback.message);
                    resultData = generateFallbackGrade({ ideaName, targetCustomer, pricing, description, competitors, distribution, url });
                }
            }
        }

        if (!resultData) {
            resultData = generateFallbackGrade({ ideaName, targetCustomer, pricing, description, competitors, distribution, url });
        }

        // Human readable name mapping for the 5 discovery pillars
        const pillarNames = {
            messaging: 'Messaging',
            conversion: 'Conversion',
            trust: 'Trust',
            search: 'Search',
            ai_discovery: 'AI Discovery'
        };

        // 4. Persist data into Supabase
        // Attempt insert into saas_idea_audits
        try {
            const auditPayload = {
                idea_name: resultData.idea_name || ideaName || 'Unnamed SaaS',
                target_customer: targetCustomer || null,
                pricing: pricing || null,
                description: description || null,
                competitors: competitors || null,
                distribution: distribution || null,
                url: url ? normalizeUrl(url) : null,
                overall_score: resultData.overall_score || 0,
                messaging_score: resultData.pillar_scores?.messaging ?? null,
                conversion_score: resultData.pillar_scores?.conversion ?? null,
                trust_score: resultData.pillar_scores?.trust ?? null,
                search_score: resultData.pillar_scores?.search ?? null,
                ai_discovery_score: resultData.pillar_scores?.ai_discovery ?? null,
                verdict_headline: resultData.verdict_headline || null,
                diagnosis_items: resultData.diagnosis_items || [],
                founder_email: email ? email.trim().toLowerCase() : null
            };

            const { error: insertAuditErr } = await supabase
                .from('saas_idea_audits')
                .insert([auditPayload]);

            if (insertAuditErr) {
                // Table might not be created yet in user's Supabase dashboard
                console.warn('saas_idea_audits table insert skipped (schema pending):', insertAuditErr.message);
            } else {
                console.log('✅ Saved audit to saas_idea_audits table for:', auditPayload.idea_name);
            }

            // Automatically enroll free tool user into the 5-Email Qualification Lifecycle Funnel!
            if (email && email.includes('@')) {
                try {
                    await enrollInLifecycle({
                        email: email.trim().toLowerCase(),
                        ideaName: resultData.idea_name || ideaName || 'Your AI SaaS',
                        auditResult: resultData,
                        toolId: 'ai-saas-grader'
                    });
                    console.log(`✅ Automatically enrolled free tool user ${email} into 5-email qualification lifecycle!`);
                } catch (lifeErr) {
                    console.warn('[Grader Lifecycle Enrollment Note]:', lifeErr.message);
                }
            }
        } catch (dbErr) {
            console.warn('saas_idea_audits insertion caught error:', dbErr.message);
        }

        // Also update/insert into legacy grader_results if URL is present or for legacy dashboard compatibility
        if (url.trim()) {
            try {
                const normUrl = normalizeUrl(url.trim());
                const { data: existing } = await supabase
                    .from('grader_results')
                    .select('id')
                    .eq('url', normUrl)
                    .single();

                if (existing) {
                    await supabase
                        .from('grader_results')
                        .update({
                            product_name: resultData.idea_name || ideaName || 'AI SaaS',
                            score: resultData.overall_score || 0,
                            archetype: resultData.founder_archetype || 'The Stealth Builder'
                        })
                        .eq('id', existing.id);
                } else {
                    await supabase
                        .from('grader_results')
                        .insert([{
                            url: normUrl,
                            product_name: resultData.idea_name || ideaName || 'AI SaaS',
                            score: resultData.overall_score || 0,
                            archetype: resultData.founder_archetype || 'The Stealth Builder'
                        }]);
                }
            } catch (legacyErr) {
                console.warn('grader_results legacy write skipped:', legacyErr.message);
            }
        }

        return NextResponse.json(resultData);

    } catch (error) {
        console.error('Grade API Error:', error);
        return NextResponse.json(
            { error: error.message || 'Something went wrong while grading your idea. Please try again.' },
            { status: 500 }
        );
    }
}
