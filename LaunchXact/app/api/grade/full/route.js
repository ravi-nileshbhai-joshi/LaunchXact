import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import Groq from 'groq-sdk';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const AUDIT_SYSTEM_PROMPT = `You are the "LaunchXact Master Auditor." You are a world-class Conversion Rate Optimizer (CRO) and SaaS Growth Engineer.
Your task is to provide a "Deep-Dive Distribution Audit" for a SaaS product. 

You must be ruthless, analytical, and highly specific. Do not use generic advice like "make buttons bigger." Focus on positioning, psychological triggers, and technical distribution.

Structure your audit in exactly these 5 Markdown sections (use ### for headers):

### 1. The Hook & Positioning Breakdown
Analyze their core value prop. Is it a "Vitamin" or a "Painkiller"? Critique their H1 and Subheadline. Provide 2 alternative high-conversion headlines.

### 2. The Trust & Proof Infrastructure
Check for "Trust Gaps." Are they anonymous? Do they have real testimonials? Is there technical proof (GitHub, live demo, case studies)? Tell them exactly what proof is missing to close the sale.

### 3. Friction & Path-to-Value
Analyze the user journey from landing to "AHA moment." Is the sign-up flow too long? Is pricing clear? Point out "Wall of Text" issues or confusing navigation.

### 4. Ecosystem Fit & Shareability
How does this fit into the current SaaS market? Is it "Launch-Ready"? Suggest 3 specific communities (Reddit, Slack, Discord) where this would thrive and why.

### 5. The "Genesis" Growth Lever
Give them one "Growth Hack" specific to their product. Something they can implement in 48 hours to get their first 50 users or 10 paying customers.

TONE: Use "Founder Wit." Direct, conversational, and constructive. Think "Senior Partner Audit."

You MUST return the content in Markdown format.`;

// Improved Text Extraction for Deep Audit
function htmlToTextDeep(html) {
    let text = html;
    text = text.replace(/<script[\s\S]*?<\/script>/gi, '');
    text = text.replace(/<style[\s\S]*?<\/style>/gi, '');

    // Extract key metadata
    const titleMatch = text.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : 'No Title';

    // Extract H1-H3
    const headings = [];
    const headingRegex = /<(h[1-3])[^>]*>([\s\S]*?)<\/\1>/gi;
    let match;
    while ((match = headingRegex.exec(text)) !== null) {
        headings.push(`${match[1].toUpperCase()}: ${match[2].replace(/<[^>]+>/g, '').trim()}`);
    }

    // Extract all button/link text
    const callsToAction = [];
    const ctaRegex = /<(button|a)[^>]*>([\s\S]*?)<\/\1>/gi;
    while ((match = ctaRegex.exec(text)) !== null) {
        const ctaText = match[2].replace(/<[^>]+>/g, '').trim();
        if (ctaText.length > 2 && ctaText.length < 100) callsToAction.push(ctaText);
    }

    // Strip tags and cleanup
    text = text.replace(/<[^>]+>/g, ' ');
    text = text.replace(/\s+/g, ' ').trim();

    return `
TITLE: ${title}
HEADINGS: ${headings.join(' | ')}
CTAs: ${callsToAction.slice(0, 30).join(' | ')}
BODY (truncated): ${text.substring(0, 5000)}
    `;
}

// In-memory rate limiting for deep audits (Stricter: 1 per hour per IP)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000;
const MAX_REQUESTS = 1;

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

export async function POST(request) {
    try {
        const { url, email, summaryResult } = await request.json();

        // 0. Rate Limiting Check
        const ip = request.headers.get('x-forwarded-for') || 'anonymous';
        if (isRateLimited(ip)) {
            return NextResponse.json(
                { error: 'Deep audits are limited to 1 per hour to prevent AI abuse. Please try again later.' },
                { status: 429 }
            );
        }

        if (!url || !email) {
            return NextResponse.json({ error: 'URL and Email are required' }, { status: 400 });
        }

        if (!process.env.GROQ_API_KEY || !resend) {
            return NextResponse.json({ error: 'Audit engine or email service not configured. Contact admin.' }, { status: 500 });
        }

        // 1. Re-fetch and scrape for deeper context
        let html;
        let parsedUrl;
        try {
            parsedUrl = new URL(url.startsWith('http') ? url : `https://${url}`);
        } catch {
            return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
        }

        try {
            const response = await fetch(parsedUrl.toString(), {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (compatible; LaunchXactBot/1.0; +https://launchxact.com)',
                    'Accept': 'text/html,application/xhtml+xml',
                },
                signal: AbortSignal.timeout(15000),
            });

            if (!response.ok) {
                let errorMsg = `HTTP ${response.status}`;
                if (response.status === 403) errorMsg = "Firewall protected";
                if (response.status === 404) errorMsg = "Page not found";
                throw new Error(errorMsg);
            }

            html = await response.text();
        } catch (err) {
            console.error('Fetch error in deep audit:', err);
            return NextResponse.json({
                error: `Could not reach that URL for the deep audit: ${err.message}. Make sure the site is publicly accessible.`
            }, { status: 422 });
        }

        const deepText = htmlToTextDeep(html);
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

        // 2. Generate Deep Audit
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: AUDIT_SYSTEM_PROMPT },
                {
                    role: 'user',
                    content: `Generate a full deep-dive audit for: ${url}\n\nInitial Score: ${summaryResult?.total_score || 'N/A'}\nArchetype: ${summaryResult?.founder_archetype || 'N/A'}\n\nPage Content:\n${deepText}`
                }
            ],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.6,
        });

        const auditMarkdown = chatCompletion.choices[0]?.message?.content;

        if (!auditMarkdown) {
            throw new Error('AI failed to generate audit content');
        }

        // 3. Send via Resend
        const { data, error } = await resend.emails.send({
            from: 'LaunchXact Deep Audit <onboarding@resend.dev>',
            to: email,
            subject: `🔥 Your Full AI Audit for ${parsedUrl.hostname}`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #ffffff; padding: 40px; border-radius: 20px; border: 1px solid #333;">
                    <h1 style="color: #6366f1; margin-bottom: 5px;">LaunchXact Deep Audit</h1>
                    <p style="color: #94a3b8; font-size: 14px; margin-top: 0;">Analyzed: ${url}</p>
                    
                    <div style="background: rgba(99, 102, 241, 0.1); border: 1px solid rgba(99, 102, 241, 0.3); padding: 20px; border-radius: 12px; margin: 20px 0;">
                        <h2 style="margin: 0; font-size: 24px;">Score: ${summaryResult?.total_score || 'Calculating...'}</h2>
                        <p style="margin: 5px 0 0; color: #a5b4fc;">Archetype: ${summaryResult?.founder_archetype || 'The Stealth Builder'}</p>
                    </div>

                    <div style="line-height: 1.6; color: #cbd5e1;">
                        ${auditMarkdown.replace(/### (.*)/g, '<h3 style="color: #6366f1; border-bottom: 1px solid #333; padding-bottom: 10px; margin-top: 30px;">$1</h3>').replace(/\n/g, '<br/>')}
                    </div>

                    <hr style="border: 0; border-top: 1px solid #333; margin: 40px 0;" />
                    
                    <p style="font-size: 14px; color: #64748b; text-align: center;">
                        Ready to join the Genesis Batch? <br/>
                        <a href="https://launchxact.com/#founder-form" style="color: #6366f1; text-decoration: none; font-weight: bold;">Finalize your submission here →</a>
                    </p>
                </div>
            `
        });

        if (error) {
            console.error('Resend Error in Audit:', error);
            return NextResponse.json({ error: 'Audit generated but email failed to send.' }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: 'Deep audit sent to your inbox!' });

    } catch (error) {
        console.error('Deep Audit API Error:', error);
        return NextResponse.json({ error: 'Failed to generate deep audit. Please try again.' }, { status: 500 });
    }
}
