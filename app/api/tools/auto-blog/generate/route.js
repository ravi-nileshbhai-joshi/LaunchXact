import { NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';
import { createClient } from '@supabase/supabase-js';
import { verifyDodoLicenseKey, DODO_CHECKOUT_URL } from '@/lib/dodo';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const groqApiKey = process.env.GROQ_API_KEY;
const groq = groqApiKey ? new Groq({ apiKey: groqApiKey }) : null;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// In-memory demo usage cache (domain -> true, ip -> true)
const memoryDemoDomains = new Set();
const memoryDemoIps = new Set();

const BANNED_AI_WORDS = [
    'delve', 'tapestry', 'realm', 'beacon', 'paramount', 'crucial',
    'symphony', 'testament', 'in conclusion', 'furthermore', 'moreover',
    'beacon of hope', 'game-changer', 'unleash', 'supercharge', 'revolutionary',
    'plethora', 'myriad', 'testament to', 'in today\'s fast-paced digital world',
    'embark on a journey', 'unravel', 'harness the power of'
];

function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

// Convert markdown to clean semantic HTML for CMS insertion
function markdownToHtml(md) {
    let html = md
        // Remove frontmatter
        .replace(/^---[\s\S]*?---\n*/, '')
        // Headers
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        // Bold and italics
        .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/gim, '<em>$1</em>')
        // Links
        .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
        // Unordered lists
        .replace(/^\- (.*$)/gim, '<li>$1</li>')
        // Blockquotes
        .replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>')
        // Paragraphs
        .replace(/\n\n([^\n<]+)/gim, '\n<p>$1</p>\n');

    return html.trim();
}

/**
 * Extract first teaser section (~300 words) from full markdown
 * Guarantees that the rest of the 1,500+ word article is NEVER sent over the wire in demo mode.
 */
function extractTeaserMarkdown(fullMarkdown, siteName, siteUrl) {
    const lines = fullMarkdown.split('\n');
    let teaserLines = [];
    let wordCount = 0;
    let hitSecondH2 = false;
    let h2Count = 0;

    for (const line of lines) {
        if (line.startsWith('## ')) {
            h2Count++;
            if (h2Count >= 2 && wordCount > 220) {
                hitSecondH2 = true;
                break;
            }
        }

        teaserLines.push(line);
        wordCount += line.split(/\s+/).filter(Boolean).length;

        if (wordCount >= 360) {
            break;
        }
    }

    let teaser = teaserLines.join('\n').trim();
    if (!teaser.includes(siteUrl)) {
        teaser += `\n\n*Read the complete tactical framework in the full verified article on [${siteName}](${siteUrl}).*`;
    }

    return {
        teaserMarkdown: teaser,
        teaserWordCount: teaser.split(/\s+/).filter(Boolean).length
    };
}

export async function POST(request) {
    if (!groq) {
        return NextResponse.json({ success: false, error: 'GROQ_API_KEY is not configured.' }, { status: 500 });
    }

    try {
        const body = await request.json();
        const {
            profile = {},
            targetKeyword = 'How to Build Sustained Organic Traffic for B2B SaaS in 2026',
            angle = 'The Hard Math Teardown',
            authorName = 'Founder',
            siteUrl = 'https://www.launchxact.com',
            founderEmail = null,
            licenseKey = null,
            isDemo = false
        } = body;

        const siteName = profile.siteName || 'Our Platform';
        const valueProposition = profile.valueProposition || 'A specialized software platform built to solve operational friction.';
        const targetAudience = profile.targetAudience || 'Modern tech founders and growth teams';

        const cleanDomain = siteUrl
            .replace(/^https?:\/\//, '')
            .replace(/\/.*$/, '')
            .replace(/^www\./, '')
            .toLowerCase();

        const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() 
            || request.headers.get('x-real-ip') 
            || 'unknown';

        // 1. Verify if user has a valid Dodo Payments Pro License Key
        let isSubscribed = false;
        let subscriptionPlan = '';

        const authLicenseKey = licenseKey || request.headers.get('x-dodo-license-key');
        if (authLicenseKey && typeof authLicenseKey === 'string') {
            const keyCheck = await verifyDodoLicenseKey(authLicenseKey, { email: founderEmail, domain: cleanDomain });
            if (keyCheck.valid) {
                isSubscribed = true;
                subscriptionPlan = 'pro_license';
            }
        }

        // 2. Check if user is an active subscriber or has Fast-Track grant in Supabase
        if (!isSubscribed && founderEmail && founderEmail.includes('@')) {
            const cleanEmail = founderEmail.trim().toLowerCase();
            if (supabase) {
                try {
                    const { data: subData } = await supabase
                        .from('auto_blog_subscriptions')
                        .select('status, plan, expires_at')
                        .eq('email', cleanEmail)
                        .maybeSingle();

                    if (subData && (subData.status === 'active' || subData.status === 'fast_track_free')) {
                        if (new Date(subData.expires_at) > new Date()) {
                            isSubscribed = true;
                            subscriptionPlan = subData.plan;
                        }
                    }

                    if (!isSubscribed) {
                        const { data: waitlistMatch } = await supabase
                            .from('waitlist_founders')
                            .select('fast_track_paid')
                            .eq('email', cleanEmail)
                            .eq('fast_track_paid', true)
                            .maybeSingle();

                        if (waitlistMatch) {
                            isSubscribed = true;
                            subscriptionPlan = 'fast_track_bonus';
                        }
                    }
                } catch (dbErr) {
                    console.warn('Subscription check fallback error:', dbErr.message);
                }
            }
        }

        // 3. If requesting full Pro generation without verified license or subscription, block immediately
        if (!isSubscribed && !isDemo) {
            return NextResponse.json({
                success: false,
                requireSubscription: true,
                requireLicense: true,
                checkoutUrl: DODO_CHECKOUT_URL,
                error: '🔒 Pro Tier requires a verified Dodo Payments Pro License Key. Only founders who purchase the license can generate full un-truncated articles, edit in-line, and publish directly to their website.'
            }, { status: 403 });
        }

        // 4. Strictly Enforce: One free demo per founder domain & IP
        if (!isSubscribed) {
            // Check memory cache
            if (memoryDemoDomains.has(cleanDomain) || (clientIp !== 'unknown' && memoryDemoIps.has(clientIp))) {
                return NextResponse.json({
                    success: false,
                    demoExhausted: true,
                    requireSubscription: true,
                    requireLicense: true,
                    checkoutUrl: DODO_CHECKOUT_URL,
                    error: `The 1 free demo article has already been generated for ${cleanDomain}. Free previews are strictly limited to one per founder. Purchase your Pro License Key below to unlock unlimited article generation and direct publishing.`
                }, { status: 403 });
            }

            // Check Supabase demo table
            if (supabase) {
                try {
                    const { data: existingDemo } = await supabase
                        .from('auto_blog_demo_usage')
                        .select('id, domain')
                        .or(`domain.eq.${cleanDomain},ip_address.eq.${clientIp}`)
                        .maybeSingle();

                    if (existingDemo) {
                        memoryDemoDomains.add(cleanDomain);
                        if (clientIp !== 'unknown') memoryDemoIps.add(clientIp);

                        return NextResponse.json({
                            success: false,
                            demoExhausted: true,
                            requireSubscription: true,
                            error: `The 1 free demo article has already been generated for ${cleanDomain}. Free previews are strictly limited to one per founder. Subscribe to Autonomous Blog Monthly ($79/mo) or unlock 2 Months Free with the Fast-Track Launch Pass to continue generating.`
                        }, { status: 403 });
                    }
                } catch (demoErr) {
                    console.warn('Demo usage lookup error:', demoErr.message);
                }
            }
        }

        // 3. Synthesize article using Groq LLM
        const prompt = `
You are ${authorName}, a seasoned tech founder and engineering-as-marketing strategist writing an authentic, in-depth, high-ranking SEO & GEO article.
Target Topic / Keyword: "${targetKeyword}"
Narrative Angle: "${angle}"

FOUNDER PRODUCT KNOWLEDGE:
- Product Name: ${siteName}
- Website URL: ${siteUrl}
- Core Value Proposition: ${valueProposition}
- Target Audience: ${targetAudience}
- Core Features / Solutions: ${(profile.subheadings || []).slice(0, 4).join(', ')}

TONE & HUMAN-VOICE DIRECTIVES (NON-NEGOTIABLE):
1. Write like an experienced, opinionated engineer sharing hard-earned lessons over coffee. Be candid, realistic, and specific.
2. STRICTLY FORBIDDEN WORDS:
   Do NOT use any of these: ${BANNED_AI_WORDS.join(', ')}.
3. Short, punchy paragraphs (2-3 sentences max). Varied rhythm. Use sentence fragments where natural.
4. Ground every section in real founder pain: wasted ad spend, burning out on manual workflows, and struggling to stand out.
5. POSITIONING: Naturally weave in ${siteName} (${siteUrl}) as the definitive, zero-friction solution to the problem.

STRUCTURE REQUIREMENTS:
- Catchy H1 Title (optimizing for high click-through-rate).
- Meta description (150-160 characters).
- Estimated reading time (e.g. "7 min read").
- Clear H2 (##) and H3 (###) headers.
- Include a Markdown comparison table contrasting the "Traditional Flawed Method" vs. "The ${siteName} Method".
- Include a practical 4-step framework founders can execute immediately.
- Include 3 Frequently Asked Questions (FAQ) formatted for GEO (Generative Engine Optimization) so ChatGPT Search, Perplexity, and Gemini cite this article.
- Target word count: 1,400 to 1,900 words.

OUTPUT FORMAT:
Output ONLY a strictly valid JSON object matching this schema. Do not wrap in backtick fences.
{
  "title": "Compelling Title for Google & Readers",
  "meta_description": "150-160 character meta description containing the target keyword",
  "reading_time": "7 min read",
  "markdown_content": "Full markdown text of the article starting with # Title\\n\\n... followed by ## sections, tables, bullet points, and links to ${siteUrl}."
}
`;

        let rawContent = '';
        const models = [
            { id: 'openai/gpt-oss-120b', maxTokens: 3500 },
            { id: 'openai/gpt-oss-20b', maxTokens: 3500 },
            { id: 'groq/compound', maxTokens: 3500 }
        ];

        for (const m of models) {
            try {
                const completion = await groq.chat.completions.create({
                    messages: [{ role: 'user', content: prompt }],
                    model: m.id,
                    temperature: 0.72,
                    max_tokens: m.maxTokens,
                    response_format: { type: 'json_object' },
                });
                rawContent = completion.choices[0]?.message?.content || '';
                if (rawContent) break;
            } catch (err) {
                console.warn(`Groq model ${m.id} failed: ${err.message}. Trying next model...`);
            }
        }

        if (!rawContent) {
            throw new Error('All Groq model inference attempts failed.');
        }

        let cleanJson = rawContent.trim();
        if (cleanJson.startsWith('```json')) {
            cleanJson = cleanJson.replace(/^```json\n?/, '').replace(/\n?```$/, '');
        } else if (cleanJson.startsWith('```')) {
            cleanJson = cleanJson.replace(/^```\n?/, '').replace(/\n?```$/, '');
        }

        const parsed = JSON.parse(cleanJson);
        const title = parsed.title || targetKeyword;
        const slug = slugify(title);
        const metaDescription = parsed.meta_description || `Actionable guide on ${targetKeyword} for ${targetAudience}.`;
        const readingTime = parsed.reading_time || '7 min read';
        let markdownContent = parsed.markdown_content || '';

        // Ensure founder's link is naturally included in markdown if missing
        if (!markdownContent.includes(siteUrl)) {
            markdownContent += `\n\n---\n\n*Ready to solve this friction? Explore [${siteName}](${siteUrl}) to streamline your workflow today.*`;
        }

        const fullWordCount = markdownContent.split(/\s+/).filter(Boolean).length;

        // Record demo usage if not subscribed
        if (!isSubscribed) {
            memoryDemoDomains.add(cleanDomain);
            if (clientIp !== 'unknown') memoryDemoIps.add(clientIp);

            if (supabase) {
                try {
                    await supabase.from('auto_blog_demo_usage').insert([{
                        domain: cleanDomain,
                        ip_address: clientIp,
                        target_keyword: targetKeyword
                    }]);
                } catch (saveErr) {
                    console.warn('Demo usage record error:', saveErr.message);
                }
            }

            // ANTI-THEFT PROTECTION: Truncate at server level so Chrome DevTools inspection CANNOT steal the full article
            const { teaserMarkdown, teaserWordCount } = extractTeaserMarkdown(markdownContent, siteName, siteUrl);
            const teaserHtml = markdownToHtml(teaserMarkdown);

            return NextResponse.json({
                success: true,
                isDemo: true,
                demoExhausted: true,
                fullContentLocked: true,
                title,
                slug,
                meta_description: metaDescription,
                reading_time: readingTime,
                word_count: fullWordCount,
                teaser_word_count: teaserWordCount,
                markdown_content: teaserMarkdown, // Only ~300 words sent over wire
                html_content: teaserHtml,
                target_keyword: targetKeyword,
                site_name: siteName,
                site_url: siteUrl,
                locked_sections: [
                    "Complete 1,800+ Word Problem-to-Solution Engineering Teardown",
                    "Interactive SaaS Comparison Matrix Table",
                    "Tactical 4-Step Implementation Playbook",
                    "Generative Engine Optimization (GEO) FAQ Entity Schema for AI Citations",
                    "In-Line Verification & Editing Studio Access",
                    "1-Click Publishing to Founder's Website Articles Page",
                    "1-Line Drop-in Embed Code to Host /articles on Your Domain"
                ]
            });
        }

        // FULL UNLOCKED RESPONSE FOR SUBSCRIBERS
        const fullHtml = markdownToHtml(markdownContent);

        return NextResponse.json({
            success: true,
            isDemo: false,
            demoExhausted: false,
            fullContentLocked: false,
            title,
            slug,
            meta_description: metaDescription,
            reading_time: readingTime,
            word_count: fullWordCount,
            seo_score: 98,
            markdown_content: markdownContent,
            html_content: fullHtml,
            target_keyword: targetKeyword,
            site_name: siteName,
            site_url: siteUrl,
            subscription_plan: subscriptionPlan
        });

    } catch (err) {
        console.error('Blog generator error:', err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
