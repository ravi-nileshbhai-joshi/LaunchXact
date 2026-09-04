const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { Groq } = require('groq-sdk');

const apiKey = process.env.GROQ_API_KEY;
if (!apiKey) {
    console.error('❌ Missing GROQ_API_KEY in environment variables.');
    console.error('Please run the script using: node --env-file=.env.local scripts/generate-article.js "Your Keyword" [--publish]');
    process.exit(1);
}

const groq = new Groq({ apiKey });

const args = process.argv.slice(2);
const isPublishDirect = args.includes('--publish');
const keywordArgs = args.filter(a => a !== '--publish');
const keyword = keywordArgs.join(' ') || 'The Post-Hype SaaS Launch: How Indie Founders Get Sustained Distribution in 2026';

const slugify = (text) => {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
};

const generateArticle = async () => {
    console.log(`🤖 Generating human-tone SEO article for: "${keyword}"...`);
    console.log(`🚀 Mode: ${isPublishDirect ? 'Direct Publish (Bypassing Draft)' : 'Draft Mode'}`);
    console.log('⏳ Generating via Groq ultra-fast inference...');

    const prompt = `
You are an experienced indie SaaS founder and distribution strategist writing an insightful, authentic guide for fellow builders.
Write an engaging, highly practical, SEO-optimized article about: "${keyword}".

TONE & STYLE GUIDELINES (CRITICAL HUMAN VOICE):
1. Talk like an authentic founder sharing hard-earned lessons over coffee. Be candid, transparent, realistic, and opinionated.
2. STRICTLY FORBIDDEN AI BUZZWORDS:
   Do NOT use: "delve", "testament", "tapestry", "realm", "navigating", "landscape", "paramount", "crucial", "beacon", "symphony", "in conclusion", "furthermore", "moreover", "beacon of hope", "game-changer", "unleash".
3. Write in short, punchy paragraphs (2-4 sentences max). Vary rhythm. Use sentence fragments where natural.
4. Ground every point in real founder pain: burning out on launch day, seeing 5,000 visitors drop to zero within 48 hours, high churn, payment fee shock, and the difficulty of standing out among AI wrapper spam.
5. Highlight actionable frameworks and modern distribution models.

LAUNCHXACT INTEGRATION & CONTEXT:
- Naturally weave in LaunchXact (https://www.launchxact.com) as a modern solution to legacy launch board decay:
  - LaunchXact is a curated multi-vendor marketplace for SaaS that enforces manual review (80% rejection rate for low-effort wrappers) to protect quality for enterprise buyers and adopters.
  - Mention LaunchXact's free growth utilities:
    * The SaaS Launch Readiness Grader (/grade) to fix headline hooks and trust signals before going public.
    * The Pre-Launch Distribution Architect (/tools/pre-launch-distribution-architect) for day-by-day community seeding.
    * The GEO & Schema Snippet Generator (/tools/geo-schema-snippet-generator) to get indexed by ChatGPT Search, Perplexity, and Google AI Overviews.
    * The True Cost of Payments Simulator (/tools/true-cost-of-payments) comparing Merchant of Record (MoR) with gateway tax friction.
  - Mention the Batch Launch and The Vault on LaunchXact which provide sustained month-over-month visibility rather than ephemeral 24-hour upvote contests.

FORMATTING REQUIREMENTS:
- Output MUST be strictly raw, valid Markdown starting immediately with the YAML frontmatter.
- Frontmatter format:
---
title: "Catchy, High-CTR Title for ${keyword}"
description: "Compelling 150-160 character meta description for Google search snippets."
date: "${new Date().toISOString().split('T')[0]}"
author: "Ravi"
status: "${isPublishDirect ? 'published' : 'draft'}"
---
- Use clear H2 (##) and H3 (###) headers.
- Use bullet points, comparison tables, and bold phrases for scannability.
- Provide practical steps that founders can implement today.
- Do NOT wrap in triple backtick code fences. Just output the raw markdown text starting with ---.
`;

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'qwen/qwen3.8-27b',
            temperature: 0.72,
            max_tokens: 4000,
        });

        let articleContent = chatCompletion.choices[0]?.message?.content || '';
        
        // Clean any code block wrappers if model wrapped the markdown
        if (articleContent.startsWith('```markdown')) {
            articleContent = articleContent.replace(/^```markdown\n/, '').replace(/\n```$/, '');
        } else if (articleContent.startsWith('```md')) {
            articleContent = articleContent.replace(/^```md\n/, '').replace(/\n```$/, '');
        } else if (articleContent.startsWith('```')) {
            articleContent = articleContent.replace(/^```\n/, '').replace(/\n```$/, '');
        }

        const slug = slugify(keyword);
        const fileName = `${slug}.md`;
        
        const targetDir = isPublishDirect 
            ? path.join(process.cwd(), 'data', 'articles', 'published')
            : path.join(process.cwd(), 'data', 'articles', 'drafts');

        if (!fs.existsSync(targetDir)){
            fs.mkdirSync(targetDir, { recursive: true });
        }

        const filePath = path.join(targetDir, fileName);
        fs.writeFileSync(filePath, articleContent.trim(), 'utf8');

        console.log(`\n✅ Success! Article generated.`);
        console.log(`📂 Saved to: ${filePath}`);

        if (isPublishDirect) {
            console.log(`\n🔄 Updating sitemap.xml automatically...`);
            try {
                const sitemapOutput = execSync('node scripts/update-sitemap.js', { encoding: 'utf8' });
                console.log(sitemapOutput.trim());
            } catch (sitemapErr) {
                console.warn('⚠️ Could not update sitemap automatically:', sitemapErr.message);
            }
            console.log(`\n🎉 Article is now LIVE on: /articles/${slug}`);
        } else {
            console.log(`\n👨‍💻 Draft created. Move to 'data/articles/published/' when ready.`);
        }
        
    } catch (error) {
        console.error('❌ Generation failed:', error.message);
        process.exit(1);
    }
};

generateArticle();
