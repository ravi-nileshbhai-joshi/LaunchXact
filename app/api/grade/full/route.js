import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import Groq from 'groq-sdk';
import { supabase } from '@/lib/supabase';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM_AUDIT_EMAIL = process.env.RESEND_FROM_EMAIL || 'LaunchXact Deep Audit <hello@launchxact.com>';

const AUDIT_SYSTEM_PROMPT = `You are the "LaunchXact Master Auditor." You are a world-class Conversion Rate Optimizer (CRO), SaaS Growth Engineer, and angel investor.
Your task is to provide a "Deep-Dive Viability & Distribution Blueprint" for a SaaS product or idea.

You must be ruthless, analytical, and highly specific. Do not use generic advice like "make buttons bigger." Focus on market dynamics, psychological triggers, and customer acquisition engines.

Structure your audit in exactly these 5 Markdown sections (use ### for headers):

### 1. Market Positioning & The Value Proposition
Analyze their core problem and customer segment. Is it a "Vitamin" or a "Painkiller"? Critique their positioning against incumbents. Provide 2 alternative high-conversion positioning angles that command 2x higher pricing.

### 2. The Defensibility Moat & Architecture
Check for fatal architectural flaws. Could OpenAI, Anthropic, or an incumbent build this in a single sprint? Provide 2 specific proprietary data or workflow locks they must implement to prevent commoditization.

### 3. Friction, Unit Economics & Pricing Power
Analyze their pricing model and customer acquisition cost (CAC) risks. How can they structure pricing to eliminate inference margin erosion and close annual prepaid contracts?

### 4. Zero-to-One Distribution Engine
Suggest 3 specific, non-obvious acquisition channels (specific subreddits, communities, cold outbound angles, or directory wedges) where this product can acquire its first 100 paying customers without paid ads.

### 5. The Genesis Batch 30-Day Execution Sprints
Give them a tactical 30-day checklist. Specific milestones to validate demand, launch to initial buyers, and reach launch-readiness for the LaunchXact Genesis Batch.

TONE: Senior technical partner code review energy. Direct, candid, constructive. Return content in Markdown format.`;

// In-memory rate limiting for deep audits (1 per hour per IP)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000;
const MAX_REQUESTS = 2;

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
        const body = await request.json();
        const {
            email,
            url = '',
            ideaName = '',
            targetCustomer = '',
            pricing = '',
            description = '',
            competitors = '',
            distribution = '',
            summaryResult = null
        } = body;

        // 0. Rate Limiting Check
        const ip = request.headers.get('x-forwarded-for') || 'anonymous';
        if (isRateLimited(ip)) {
            return NextResponse.json(
                { error: 'Deep audits are limited to 2 per hour to prevent AI abuse. Please try again later.' },
                { status: 429 }
            );
        }

        if (!email) {
            return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
        }

        const subjectName = ideaName || summaryResult?.idea_name || (url ? new URL(url.startsWith('http') ? url : `https://${url}`).hostname : 'Your SaaS Idea');

        // Context composition
        const userPrompt = `Generate a full deep-dive viability blueprint for: ${subjectName}

Target Customer: ${targetCustomer || 'N/A'}
Pricing: ${pricing || 'N/A'}
Description: ${description || 'N/A'}
Competitors: ${competitors || 'N/A'}
Distribution Strategy: ${distribution || 'N/A'}
URL: ${url || 'Pre-launch'}

Initial Audit Score: ${summaryResult?.overall_score || summaryResult?.total_score || 'N/A'}/100
Weakest Pillar: ${summaryResult?.weakest_pillar_name || summaryResult?.weakest_pillar || 'Distribution'}
Founder Archetype: ${summaryResult?.founder_archetype || 'The Stealth Builder'}
Verdict: ${summaryResult?.verdict_headline || summaryResult?.roast_summary || 'Needs Distribution Overhaul'}`;

        let auditMarkdown = '';

        if (process.env.GROQ_API_KEY) {
            const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
            try {
                const chatCompletion = await groq.chat.completions.create({
                    messages: [
                        { role: 'system', content: AUDIT_SYSTEM_PROMPT },
                        { role: 'user', content: userPrompt }
                    ],
                    model: 'openai/gpt-oss-120b',
                    temperature: 0.6,
                });
                auditMarkdown = chatCompletion.choices[0]?.message?.content || '';
            } catch (modelErr) {
                console.warn('Groq 120b failed in deep audit, trying 20b fallback:', modelErr.message);
                const fallback = await groq.chat.completions.create({
                    messages: [
                        { role: 'system', content: AUDIT_SYSTEM_PROMPT },
                        { role: 'user', content: userPrompt }
                    ],
                    model: 'openai/gpt-oss-20b',
                    temperature: 0.6,
                });
                auditMarkdown = fallback.choices[0]?.message?.content || '';
            }
        }

        if (!auditMarkdown) {
            auditMarkdown = `### 1. Market Positioning & The Value Proposition\nTargeting ${targetCustomer || 'your chosen audience'} requires razor-sharp specificity. Shift from broad productivity claims to guaranteed time-to-value.\n\n### 2. The Defensibility Moat & Architecture\nBuild proprietary deterministic logic around user workflows. Don't rely solely on LLM wrappers.\n\n### 3. Friction, Unit Economics & Pricing Power\nStructure pricing around high-intent business tiers ($99/mo to $299/mo) rather than $9 hobbyist plans.\n\n### 4. Zero-to-One Distribution Engine\nPartner with niche agencies and build targeted distribution loops before expanding paid ad spend.\n\n### 5. The Genesis Batch 30-Day Execution Sprints\nFocus on securing 5 design partner letters of intent and submit your verified prototype to LaunchXact.`;
        }

        // Send via Resend if available
        if (resend) {
            try {
                await resend.emails.send({
                    from: FROM_AUDIT_EMAIL,
                    to: email,
                    subject: `🔥 LaunchXact Deep Viability Audit: ${subjectName}`,
                    html: `
                        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 620px; margin: 0 auto; background: #0b0f19; color: #ffffff; padding: 40px; border-radius: 16px; border: 1px solid #1e293b;">
                            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px;">
                                <h1 style="color: #a855f7; margin: 0; font-size: 22px; font-weight: 800;">LaunchXact Genesis Blueprint</h1>
                            </div>
                            <p style="color: #94a3b8; font-size: 14px; margin-top: 0;">Analyzed: <strong>${subjectName}</strong></p>
                            
                            <div style="background: rgba(168, 85, 247, 0.1); border: 1px solid rgba(168, 85, 247, 0.3); padding: 20px; border-radius: 12px; margin: 20px 0;">
                                <div style="font-size: 28px; font-weight: 800; color: #ffffff;">Overall Score: ${summaryResult?.overall_score || summaryResult?.total_score || 'N/A'}/100</div>
                                <div style="margin-top: 6px; color: #c084fc; font-size: 14px; font-weight: 600;">Archetype: ${summaryResult?.founder_archetype || 'The Stealth Builder'}</div>
                                <div style="margin-top: 4px; color: #e2e8f0; font-size: 13px;">Weakest Pillar: <strong style="color: #f87171;">${summaryResult?.weakest_pillar_name || 'Distribution'}</strong></div>
                            </div>

                            <div style="line-height: 1.65; color: #cbd5e1; font-size: 14.5px;">
                                ${auditMarkdown.replace(/### (.*)/g, '<h3 style="color: #a855f7; border-bottom: 1px solid #334155; padding-bottom: 8px; margin-top: 28px; font-size: 17px;">$1</h3>').replace(/\n/g, '<br/>')}
                            </div>

                            <hr style="border: 0; border-top: 1px solid #1e293b; margin: 36px 0;" />
                            
                            <div style="text-align: center;">
                                <p style="font-size: 15px; color: #e2e8f0; font-weight: 600; margin-bottom: 14px;">Ready to fix the weaknesses and launch?</p>
                                <a href="https://launchxact.com/#founder-form" style="display: inline-block; background: #7c3aed; color: #ffffff; padding: 12px 24px; border-radius: 9999px; text-decoration: none; font-weight: 700; font-size: 14px;">Apply for Genesis Batch →</a>
                            </div>
                        </div>
                    `
                });
            } catch (emailErr) {
                console.warn('Resend send error:', emailErr.message);
            }
        }

        // Try updating founder_email in saas_idea_audits
        try {
            if (ideaName || subjectName) {
                await supabase
                    .from('saas_idea_audits')
                    .update({ founder_email: email })
                    .ilike('idea_name', subjectName);
            }
        } catch (dbErr) {
            console.warn('Email update in saas_idea_audits skipped:', dbErr.message);
        }

        return NextResponse.json({
            success: true,
            message: 'Deep viability audit sent to your inbox!'
        });

    } catch (error) {
        console.error('Deep Audit API Error:', error);
        return NextResponse.json({ error: 'Failed to generate deep audit. Please try again.' }, { status: 500 });
    }
}
