const { Groq } = require('groq-sdk');
const { BANNED_AI_WORDS, buildUtmUrl } = require('./config');

const groqApiKey = process.env.GROQ_API_KEY;
const groq = groqApiKey ? new Groq({ apiKey: groqApiKey }) : null;

/**
 * Generate platform-tailored, non-repetitive posts using Groq / LLM
 */
async function generateDistributionContent({
    tool,
    angle,
    negativeConstraints = [],
    author = 'Ravi'
}) {
    if (!groq) {
        throw new Error('GROQ_API_KEY is not configured in environment variables.');
    }

    const xUtmUrl = buildUtmUrl(tool, 'x', angle.id);
    const linkedinUtmUrl = buildUtmUrl(tool, 'linkedin', angle.id);
    const ihUtmUrl = buildUtmUrl(tool, 'indiehackers', angle.id);

    // Extract recent hooks to explicitly forbid
    const forbiddenHooks = negativeConstraints
        .map(c => `- "${c.hook}"`)
        .slice(0, 10)
        .join('\n');

    const prompt = `
You are ${author}, the authentic indie founder of LaunchXact (https://www.launchxact.com), an ecosystem helping SaaS builders get sustainable, month-over-month distribution.
You are generating a multi-channel social distribution campaign about one of your free tools, framed strictly from a PROBLEM -> SOLUTION point of view, focusing on "Engineering as Marketing" (how building free utility tools drives qualified founder traffic far better than paid ads or 24-hr launch boards).

TARGET TOOL PROFILE:
- Tool Name: ${tool.title}
- Tool Path: ${tool.path}
- Category: ${tool.category}
- The Real Founder Problem: ${tool.problem}
- The Solution & Utility: ${tool.solution}
- Specific Metrics / Teardown: ${tool.metrics}
- Target Audience: ${tool.targetAudience}

NARRATIVE ANGLE TO ADOPT:
- Angle Name: ${angle.name}
- Theme: ${angle.theme}
- Tone: ${angle.tone}

UTM LINKS (MUST BE EMBEDDED IN THE RESPECTIVE PLATFORM POSTS):
- X Link: ${xUtmUrl}
- LinkedIn Link: ${linkedinUtmUrl}
- Indie Hackers Link: ${ihUtmUrl}

STRICT ANTI-REPETITION RULES (CRITICAL):
Do NOT reuse or mimic any of these previously published hooks:
${forbiddenHooks || 'None yet (first run).'}

STYLE & TONE DIRECTIVES (AUTHENTIC FOUNDER VOICE):
1. Write like an experienced, opinionated indie founder sharing real numbers and hard-earned lessons.
2. NO CORPORATE FLUFF. NO MARKETING JARGON.
3. STRICTLY FORBIDDEN WORDS:
   Do NOT use any of these words: ${BANNED_AI_WORDS.join(', ')}.
4. Focus on the sharp transition from the painful mistake founders make to the high-ROI solution.
5. Emphasize why LaunchXact built this as a free tool instead of hiding it behind a paywall (Engineering as Marketing generates long-term compounding traffic).

OUTPUT SCHEMA SPECIFICATIONS:
You MUST respond with a single, strictly valid JSON object with the following structure. Escape all quotes and newlines properly (use \\n for linebreaks inside strings).

{
  "hook": "Single punchy headline hook summarizing the core problem and insight",
  "x": {
    "single": "Single punchy tweet under 270 characters including the URL. Must have hook, problem-solution snippet, and URL.",
    "thread": [
      "Tweet 1 (Hook, under 270 chars)",
      "Tweet 2 (The Trap / Hidden Math, under 270 chars)",
      "Tweet 3 (The Engineering as Marketing Insight, under 270 chars)",
      "Tweet 4 (The Tool Solution with URL, under 270 chars)",
      "Tweet 5 (Wrap up, CTA, and RT ask, under 270 chars)"
    ]
  },
  "linkedin": {
    "content": "Full LinkedIn post string (1,000 to 1,400 chars). Hook before see more fold, short 1-2 sentence paragraphs, bullet points, CTA with link, and 3 hashtags. Use \\n\\n between paragraphs."
  },
  "indiehackers": {
    "title": "Engaging discussion / milestone title for Indie Hackers",
    "content": "Markdown article string (300 to 450 words) with H2 headers (## The Problem, ## Why Engineering as Marketing Beats Ads, ## How the Tool Works, ## Question for Indie Hackers) and link. Use \\n\\n for paragraphs."
  }
}
`;

    let rawContent = '';
    const models = [
        { id: 'openai/gpt-oss-120b', maxTokens: 3200 },
        { id: 'openai/gpt-oss-20b', maxTokens: 3200 },
        { id: 'groq/compound', maxTokens: 3200 },
        { id: 'qwen/qwen3.8-27b', maxTokens: 1200 }
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
            console.warn(`⚠️ Groq model ${m.id} failed: ${err.message}. Trying next model...`);
        }
    }

    if (!rawContent) {
        throw new Error('All Groq model attempts failed to generate content.');
    }

    // Clean up potential markdown formatting if returned
    let cleanJson = rawContent.trim();
    if (cleanJson.startsWith('```json')) {
        cleanJson = cleanJson.replace(/^```json\n?/, '').replace(/\n?```$/, '');
    } else if (cleanJson.startsWith('```')) {
        cleanJson = cleanJson.replace(/^```\n?/, '').replace(/\n?```$/, '');
    }

    try {
        const parsed = JSON.parse(cleanJson);
        
        // 1. Normalize X single tweet & thread
        const xData = parsed.x || parsed.twitter || parsed.twitter_x || {};
        let xSingle = typeof xData === 'string' ? xData : (xData.single || xData.tweet || xData.post || '');
        if (!xSingle && Array.isArray(xData.thread) && xData.thread.length > 0) {
            xSingle = xData.thread[0];
        }

        // Enforce <= 275 chars on X single post
        if (xSingle.length > 275) {
            const urlMatch = xSingle.match(/https?:\/\/[^\s]+/);
            const foundUrl = urlMatch ? urlMatch[0] : xUtmUrl;
            const textWithoutUrl = xSingle.replace(foundUrl, '').trim();
            const allowedLength = 270 - foundUrl.length;
            const truncatedText = textWithoutUrl.length > allowedLength
                ? textWithoutUrl.slice(0, allowedLength - 3).replace(/[,.\s]+$/, '') + '...'
                : textWithoutUrl;
            xSingle = `${truncatedText} ${foundUrl}`;
        }

        let xThread = Array.isArray(xData.thread) ? xData.thread : (xData.tweets || [xSingle]);
        xThread = xThread.map((t, idx) => {
            if (typeof t !== 'string') return '';
            if (t.length > 275) {
                return t.slice(0, 272).replace(/[,.\s]+$/, '') + '...';
            }
            return t;
        }).filter(Boolean);

        // 2. Normalize LinkedIn
        const liData = parsed.linkedin || parsed.linked_in || parsed.li || {};
        const liContent = typeof liData === 'string' ? liData : (liData.content || liData.post || liData.body || '');

        // 3. Normalize Indie Hackers (Support all variations and formats)
        const ihData = parsed.indiehackers ||
                       parsed.indie_hackers ||
                       parsed.indieHackers ||
                       parsed.indiehacker ||
                       parsed.indie_hacker ||
                       parsed.indie_hackers_post ||
                       parsed.article ||
                       parsed.ih ||
                       parsed.community_post ||
                       {};

        let ihTitle = '';
        let ihContent = '';

        if (typeof ihData === 'string') {
            const lines = ihData.trim().split('\n');
            if (lines[0].startsWith('# ')) {
                ihTitle = lines[0].replace(/^#\s+/, '').trim();
                ihContent = lines.slice(1).join('\n').trim();
            } else {
                ihTitle = parsed.hook || `How we built a free ${tool.title} to drive sustained SaaS traffic`;
                ihContent = ihData;
            }
        } else if (typeof ihData === 'object' && ihData !== null) {
            ihTitle = ihData.title || ihData.headline || ihData.subject || parsed.hook || `Building in Public: How ${tool.title} drives traffic to LaunchXact`;
            ihContent = ihData.content ||
                        ihData.body ||
                        ihData.markdown ||
                        ihData.article ||
                        ihData.text ||
                        ihData.post ||
                        ihData.description ||
                        '';

            if (Array.isArray(ihContent)) {
                ihContent = ihContent.map(s => typeof s === 'string' ? s : `${s.title ? '## ' + s.title + '\n\n' : ''}${s.content || s.text || ''}`).join('\n\n');
            }
        }

        // Bulletproof Fallback: If LLM returned empty or truncated body, construct rich founder case study
        if (!ihContent || ihContent.trim().length < 100) {
            ihContent = `## The Problem Most Founders Overlook\n\n${tool.problem}\n\n## Why Engineering as Marketing Beats Paid Ads\n\nTraditional marketing (launch boards that spike for 24 hours, cold outreach, or paid social ads) burns runway fast with little to show for it. Instead of shouting into the void, we built a utility that solves this exact friction in 60 seconds.\n\nFree tools create high-intent organic search traffic and establish immediate trust. When you give founders a solution that saves them hours of manual work or thousands in fees, distribution takes care of itself.\n\n## How ${tool.title} Solves This\n\n${tool.solution}\n\nKey highlights:\n- ${tool.metrics}\n- Built for ${tool.targetAudience}\n- Zero paywall or gated credit card\n\n## Traffic & Conversion Breakdown\n\nEvery visitor gets instant value before we ask for anything. If they want to save their audit or export their forecast, they can enter their email. This simple engineering-as-marketing flywheel has become LaunchXact's #1 organic acquisition channel.\n\n## Question for the Community\n\nHave you tried building a free mini-tool or calculator to market your SaaS? What acquisition channels are currently delivering the highest ROI for your project? Let's discuss in the comments below!\n\n---\n**Try the free tool here:** [${tool.title}](${ihUtmUrl})`;
        } else if (!ihContent.includes('launchxact.com')) {
            ihContent += `\n\n---\n**Try the free tool here:** [${tool.title}](${ihUtmUrl})`;
        }

        return {
            tool,
            angle,
            generatedAt: new Date().toISOString(),
            hook: parsed.hook || ihTitle || tool.title,
            x: {
                single: xSingle,
                thread: xThread,
            },
            linkedin: {
                content: liContent,
            },
            indiehackers: {
                title: ihTitle,
                content: ihContent,
            },
        };
    } catch (parseErr) {
        console.error('Failed to parse generated JSON response:', parseErr.message);
        console.error('Raw content was:', rawContent);
        throw new Error('LLM output could not be parsed into valid distribution schema.');
    }
}

module.exports = {
    generateDistributionContent,
};
