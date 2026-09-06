import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { supabase } from '@/lib/supabase';

const SYSTEM_PROMPT = `You are the "LaunchXact AI SaaS Viability Auditor." You are a ruthless, battle-tested SaaS founder, angel investor, and product engineer.
You have reviewed thousands of B2B and AI SaaS startups. You do not offer fluffy polite encouragement. You offer senior-partner, code-review level honesty.

Your goal is to evaluate an AI SaaS idea across 6 critical pillars (scored 0 to 100 each):

1. MARKET POTENTIAL (0-100):
Is this a real, expanding B2B market with urgent budget, or a crowded graveyard? Are there tailwinds or is it riding temporary LLM novelty?

2. PROBLEM SEVERITY (0-100):
Is this a bleeding-neck painkiller ($10k+/yr problem where customers actively seek solutions) or a "nice-to-have" vitamin that gets cut during budget reviews?

3. COMPETITION & MOAT (0-100):
What happens when OpenAI, Anthropic, or Google release a native prompt or feature for this? Can an incumbent (Zendesk, Salesforce, Notion, Shopify) clone this in a sprint? What is their defensibility moat?

4. DISTRIBUTION STRATEGY (0-100):
Is the founder's distribution plan realistic, repeatable, and scalable? Or is it magical thinking ("post on X and launch on Product Hunt")? Will customer acquisition cost (CAC) eat them alive?

5. MONETIZATION POWER (0-100):
Will customers pull out credit cards and pay recurring revenue? Is the pricing model sustainable against AI inference and API token costs? What is the churn danger?

6. AI DEFENSIBILITY (0-100):
Is this a thin prompt wrapper around an API that anyone can build over a weekend, or does it own embedded workflow logic, proprietary datasets, fine-tuned pipelines, and high switching costs?

You MUST identify the SINGLE WEAKEST PILLAR (the fatal flaw that will cause this startup to die if unaddressed).

You MUST return ONLY a valid JSON object with this exact structure:
{
  "idea_name": "<string: name or concise title of the idea>",
  "overall_score": <integer 0-100: weighted overall viability>,
  "pillar_scores": {
    "market_potential": <integer 0-100>,
    "problem_severity": <integer 0-100>,
    "competition_moat": <integer 0-100>,
    "distribution": <integer 0-100>,
    "monetization": <integer 0-100>,
    "ai_defensibility": <integer 0-100>
  },
  "founder_archetype": "<string: a memorable archetype like 'The Wrapper Hustler', 'The Niche Dominator', 'The Infrastructure Architect', 'The Solution Seeking a Problem', 'The Stealth Builder', 'The Hype Surfer'>",
  "verdict_headline": "<string: punchy 1-sentence verdict, e.g. 'Promising problem. Fatal distribution strategy.' or 'High willingness to pay, zero defensibility against OpenAI.'>",
  "brutal_critique": "<string: 2-3 paragraphs of candid, razor-sharp critique. Point out the exact friction points, why customers will churn or ignore it, and what works.>",
  "weakest_pillar": "<string: exactly one of 'market_potential', 'problem_severity', 'competition_moat', 'distribution', 'monetization', 'ai_defensibility'>",
  "weakest_pillar_name": "<string: e.g. 'Distribution Strategy' or 'AI Defensibility' or 'Competition & Moat'>",
  "weakness_diagnosis": "<string: 2-3 sentences explaining exactly why this weakest pillar is their existential bottleneck and how it kills the business.>",
  "action_items": [
    "<string: tactical pivot #1 - immediate fix to positioning or workflow>",
    "<string: tactical pivot #2 - distribution channel or wedge change>",
    "<string: tactical pivot #3 - pricing or packaging overhaul>"
  ],
  "ai_pricing_advice": "<string: concrete advice on how to structure pricing, eliminate inference margin erosion, and charge more>",
  "genesis_bridge": "<string: 1-2 sentences explaining how LaunchXact's Genesis Batch (pre-vetted B2B distribution, 0% platform fee, unified billing) fixes their weakest link.>"
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
    const name = ideaName || 'Your SaaS Idea';
    const isWrapperRisk = /chatgpt|openai|wrapper|prompt|llm|ai bot/i.test(description || '');
    const hasEnterpriseCustomer = /b2b|enterprise|mid-market|companies|teams|executives/i.test(targetCustomer || '');
    const weakDist = /twitter|social media|viral|reddit|launching|waitlist/i.test(distribution || '');

    const market_potential = hasEnterpriseCustomer ? 78 : 64;
    const problem_severity = description?.length > 40 ? 74 : 58;
    const competition_moat = isWrapperRisk ? 44 : 62;
    const dist_score = weakDist ? 38 : 65;
    const monetization = /month|\$|pricing|annual/i.test(pricing || '') ? 71 : 52;
    const ai_defensibility = isWrapperRisk ? 36 : 59;

    const overall_score = Math.round(
        (market_potential * 0.2) +
        (problem_severity * 0.2) +
        (competition_moat * 0.15) +
        (dist_score * 0.2) +
        (monetization * 0.15) +
        (ai_defensibility * 0.1)
    );

    let weakest_pillar = 'distribution';
    let weakest_pillar_name = 'Distribution Strategy';
    let minScore = dist_score;

    if (ai_defensibility < minScore) {
        minScore = ai_defensibility;
        weakest_pillar = 'ai_defensibility';
        weakest_pillar_name = 'AI Defensibility';
    }
    if (competition_moat < minScore) {
        minScore = competition_moat;
        weakest_pillar = 'competition_moat';
        weakest_pillar_name = 'Competition & Moat';
    }

    return {
        idea_name: name,
        overall_score,
        pillar_scores: {
            market_potential,
            problem_severity,
            competition_moat,
            distribution: dist_score,
            monetization,
            ai_defensibility
        },
        founder_archetype: isWrapperRisk ? 'The Wrapper Hustler' : (hasEnterpriseCustomer ? 'The Stealth Builder' : 'The Solution Seeking a Problem'),
        verdict_headline: dist_score < 50 ? 'Promising problem. Fatal distribution strategy.' : 'Solid concept. Defensibility requires proprietary workflow lock-in.',
        brutal_critique: `Your concept targets a tangible pain point, but you're drastically underestimating the friction of customer acquisition. Relying on organic noise or generic launch spikes will bleed your momentum before you reach $10k MRR.\n\nFurthermore, if your primary value prop can be replicated by an OpenAI developer prompt or a Zapier recipe in 48 hours, enterprise buyers will refuse annual contracts. You need deep deterministic hooks into the customer's daily data pipeline.\n\nTo survive, narrow your ICP by 80%, tie pricing to measurable economic output rather than user seats, and secure an unfair distribution channel before writing more code.`,
        weakest_pillar,
        weakest_pillar_name,
        weakness_diagnosis: `${weakest_pillar_name} is your single biggest point of failure (${minScore}/100). Without fixing this bottleneck, even a flawless product will fail to convert and churn out before hitting product-market fit.`,
        action_items: [
            `Narrow your target customer from "${targetCustomer || 'broad market'}" to one ultra-specific buyer whose bonus depends on solving this problem.`,
            `Ditch passive launch tactics. Secure 5 design partner pilots via high-touch workflow teardowns before scaling ad spend.`,
            `Restructure pricing to value-based metrics ($/workflow or % of savings) to prevent LLM inference API costs from cannibalizing gross margins.`
        ],
        ai_pricing_advice: `Avoid low-tier $9–$19/mo pricing. For B2B AI tools, minimum viable pricing should be $99/mo to $299/mo with usage boundaries to protect token unit economics.`,
        genesis_bridge: `LaunchXact's Genesis Batch directly eliminates your ${weakest_pillar_name} deficit by plugging your tool into our curated directory, multi-region compliance billing, and pre-vetted B2B buyer network.`,
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

        // Make sure weakest_pillar is properly identified if missing
        if (!resultData.weakest_pillar && resultData.pillar_scores) {
            const scores = resultData.pillar_scores;
            let lowestKey = 'distribution';
            let lowestVal = Infinity;
            for (const [key, val] of Object.entries(scores)) {
                if (typeof val === 'number' && val < lowestVal) {
                    lowestVal = val;
                    lowestKey = key;
                }
            }
            resultData.weakest_pillar = lowestKey;
        }

        // Human readable name for the weakest pillar
        const pillarNames = {
            market_potential: 'Market Potential',
            problem_severity: 'Problem Severity',
            competition_moat: 'Competition & Moat',
            distribution: 'Distribution Strategy',
            monetization: 'Monetization Power',
            ai_defensibility: 'AI Defensibility'
        };
        resultData.weakest_pillar_name = resultData.weakest_pillar_name || pillarNames[resultData.weakest_pillar] || 'Distribution Strategy';

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
                market_potential: resultData.pillar_scores?.market_potential ?? null,
                problem_severity: resultData.pillar_scores?.problem_severity ?? null,
                competition_moat: resultData.pillar_scores?.competition_moat ?? null,
                distribution_score: resultData.pillar_scores?.distribution ?? null,
                monetization_score: resultData.pillar_scores?.monetization ?? null,
                ai_defensibility: resultData.pillar_scores?.ai_defensibility ?? null,
                weakest_pillar: resultData.weakest_pillar || null,
                verdict_headline: resultData.verdict_headline || null,
                brutal_critique: resultData.brutal_critique || null,
                action_items: resultData.action_items || []
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
