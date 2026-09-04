const fs = require('fs');
const path = require('path');
const { Groq } = require('groq-sdk');

const apiKey = process.env.GROQ_API_KEY;
if (!apiKey) {
    console.error('❌ Missing GROQ_API_KEY in environment variables.');
    console.error('Please run the script using: node --env-file=.env.local scripts/generate-article.js "Your Keyword"');
    process.exit(1);
}

const groq = new Groq({ apiKey });

const keyword = process.argv[2];
if (!keyword) {
    console.error('❌ Please provide a keyword. Example: node --env-file=.env.local scripts/generate-article.js "SaaS Marketplace Benefits"');
    process.exit(1);
}

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
    console.log('⏳ This may take a minute depending on the AI speed.');

    const prompt = `
You are an expert SaaS founder and growth marketer. Write a highly engaging, SEO-optimized, 1500-word article about: "${keyword}".

CRITICAL TONE INSTRUCTIONS (HUMAN-IN-THE-LOOP):
1. Write like a real person talking to another founder at a coffee shop. Be direct, opinionated, and practical.
2. DO NOT USE typical AI filler words. BANNED WORDS: delve, testament, tapestry, realm, navigating, landscape, paramount, crucial, beacon, symphony, in conclusion.
3. Use short, punchy paragraphs. Vary your sentence length.
4. Include real-world sounding examples or relatable founder pain points.

FORMATTING:
- Output MUST be strictly valid Markdown.
- Start with a YAML frontmatter block containing:
---
title: "Catchy SEO Headling for ${keyword}"
description: "A 1-2 sentence meta description for Google."
date: "${new Date().toISOString().split('T')[0]}"
author: "Ravi"
status: "draft"
---
- Use H2 (##) and H3 (###) extensively for structure.
- Include bullet points and bold text for readability.
- Do not add any introductory or concluding conversational text outside the markdown block. Just output the raw markdown file content.
`;

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'llama-3.3-70b-versatile', 
            temperature: 0.7,
            max_tokens: 4000,
        });

        const articleContent = chatCompletion.choices[0]?.message?.content || '';
        
        const slug = slugify(keyword);
        const fileName = `${slug}.md`;
        const draftsDir = path.join(process.cwd(), 'data', 'articles', 'drafts');
        
        // Ensure directory exists
        if (!fs.existsSync(draftsDir)){
            fs.mkdirSync(draftsDir, { recursive: true });
        }

        const filePath = path.join(draftsDir, fileName);
        fs.writeFileSync(filePath, articleContent.trim(), 'utf8');

        console.log(`\n✅ Success! Draft generated successfully.`);
        console.log(`📂 Saved to: ${filePath}`);
        console.log(`\n👨‍💻 HUMAN-IN-THE-LOOP ACTION REQUIRED:`);
        console.log(`1. Open the file and review the tone and content.`);
        console.log(`2. Make your edits.`);
        console.log(`3. When ready, move the file from 'drafts' to 'data/articles/published/'`);
        
    } catch (error) {
        console.error('❌ Generation failed:', error.message);
    }
};

generateArticle();
