/**
 * LaunchXact Social Distribution Agent - Configuration Matrix
 */

export const BASE_URL = 'https://www.launchxact.com';

export const TOOLS = [
    {
        id: 'saas-readiness-grader',
        title: 'SaaS Launch Readiness Grader',
        path: '/grade',
        category: 'Conversion Optimization & Audit',
        problem: 'Founders spend months building, only to launch with a vague headline, zero trust signals, and confusing pricing. Result: 95%+ bounce rate and wasted launch hype.',
        solution: 'An AI-powered 60-second diagnostic that audits value proposition clarity, objection handling, CTA friction, and social proof, returning a 0-100 score and instant fixes.',
        metrics: 'Evaluates 5 critical conversion pillars: Headline Hook, Problem Framing, Social Proof Density, Pricing Clarity, and Friction Reduction.',
        callToAction: 'Audit your landing page before launching',
        targetAudience: 'Pre-launch founders, solopreneurs, and bootstrappers preparing for launch day.',
    },
    {
        id: 'true-cost-of-payments',
        title: 'The "True Cost of Payments" Simulator',
        path: '/tools/true-cost-of-payments',
        category: 'Fintech & Global Compliance',
        problem: 'Founders believe payment processing is just "2.9% + 30¢". But when selling globally, foreign exchange fees, chargeback penalties, and managing VAT/GST across 40+ countries quietly eats 15-22% of revenue.',
        solution: 'A simulator that models true global payment costs comparing standard payment gateways vs. Merchant of Record (MoR) solutions (like Lemon Squeezy, Paddle, Dodo Payments).',
        metrics: 'Calculates hidden FX spread, manual tax filing hours ($150/hr CPA rate), chargeback dispute fees, and total net margin leak.',
        callToAction: 'Calculate your actual payment processing leakage',
        targetAudience: 'Micro-SaaS founders selling internationally who hate accounting paperwork.',
    },
    {
        id: 'franken-stack-cost-forecaster',
        title: 'The "Franken-Stack" Cost Forecaster',
        path: '/tools/franken-stack-cost-forecaster',
        category: 'Cloud Infrastructure & Architecture',
        problem: 'Modern SaaS is built on a fragmented "Franken-Stack" (Supabase + Clerk + Vercel + PostHog + Resend). Free tiers are deceptive—at 10k-50k MAU, pricing tiers explode unpredictably.',
        solution: 'An interactive forecasting tool that simulates real monthly infrastructure bills as users scale from 500 to 50,000 monthly active users.',
        metrics: 'Projects database row scaling, auth MAU step-ups, edge bandwidth surcharges, and transactional email volume traps.',
        callToAction: 'Forecast your tech stack bill before scaling',
        targetAudience: 'Full-stack builders, Next.js / Supabase developers, and technical founders.',
    },
    {
        id: 'pre-launch-distribution-architect',
        title: 'The Pre-Launch Distribution Architect',
        path: '/tools/pre-launch-distribution-architect',
        category: 'Go-To-Market & Audience Seeding',
        problem: 'Founders build in secret for 6 months, tweet "We are live!" on launch day to 12 followers, and hear crickets. Traditional launch boards give a 24-hour spike that drops to zero.',
        solution: 'A reverse-engineered, day-by-day pre-launch matrix (D-30, D-14, D-7, Launch Day) to seed micro-communities, collect beta waitlists, and engineer day-one traction.',
        metrics: 'Step-by-step channel activation across Reddit, X, Discord, niche newsletters, and specialized launch directories.',
        callToAction: 'Build your customized D-30 launch timeline',
        targetAudience: 'Early-stage founders who know how to code but struggle with marketing.',
    },
    {
        id: 'geo-schema-snippet-generator',
        title: 'GEO & AI Schema Snippet Generator',
        path: '/tools/geo-schema-snippet-generator',
        category: 'Generative Engine Optimization (GEO)',
        problem: 'Traditional Google SEO is shifting to AI answers (ChatGPT Search, Perplexity, Gemini). If your SaaS doesn\'t have structured JSON-LD entity schema, AI search bots will hallucinate or ignore your product entirely.',
        solution: 'Generates verified, rich JSON-LD schema (SoftwareApplication, FAQPage, Organization) engineered specifically to get cited in LLM search overviews.',
        metrics: 'Schema validation for LLM crawlers, semantic entity linking, and rich search snippet eligibility.',
        callToAction: 'Generate your AI-ready schema in 30 seconds',
        targetAudience: 'SaaS founders wanting high-intent citations from Perplexity and ChatGPT Search.',
    },
];

export const ANGLES = [
    {
        id: 'contrarian_take',
        name: 'The Contrarian Hot Take',
        theme: 'Why conventional founder advice is broken in 2026, and the counter-intuitive approach that actually delivers results.',
        tone: 'Bold, provocative, eye-opening, backed by real observations.',
    },
    {
        id: 'hard_math_teardown',
        name: 'The Hard Math / Data Teardown',
        theme: 'Breaking down the hidden numbers most founders overlook until it hurts their bank balance.',
        tone: 'Analytical, transparent, eye-opening, data-driven.',
    },
    {
        id: 'build_in_public_milestone',
        name: 'Build in Public & Traffic Case Study',
        theme: 'How we built this specific tool in 48 hours to generate high-intent traffic for LaunchXact without spending on paid ads.',
        tone: 'Candid, authentic, transparent, sharing real metrics and lessons learned.',
    },
    {
        id: 'tactical_playbook',
        name: 'The 4-Step Tactical Playbook',
        theme: 'A concrete step-by-step framework founders can read, bookmark, and execute within 30 minutes.',
        tone: 'Practical, actionable, high-utility, zero fluff.',
    },
    {
        id: 'problem_agitate_solve',
        name: 'The Hidden Trap & The Escape Hatch',
        theme: 'The exact mistake 90% of indie hackers make right before launch, why it hurts so badly, and how to fix it.',
        tone: 'Empathetic, cautionary, solution-oriented, urgent.',
    },
    {
        id: 'engineering_as_marketing',
        name: 'Engineering-as-Marketing Philosophy',
        theme: 'Why building a 60-second free tool beats cold DMs, spamming Reddit, and $2,000 ad campaigns every single time.',
        tone: 'Strategic, inspiring, founder-to-founder, high ROI focus.',
    },
];

export const PLATFORM_CONFIGS = {
    x: {
        name: 'X (Twitter)',
        characterLimit: 280,
        threadSupported: true,
        utmSource: 'twitter',
        utmMedium: 'social',
        utmCampaign: 'ai_agent_distrib',
    },
    linkedin: {
        name: 'LinkedIn',
        characterLimit: 3000,
        optimalLength: 1400,
        utmSource: 'linkedin',
        utmMedium: 'social',
        utmCampaign: 'ai_agent_distrib',
    },
    indiehackers: {
        name: 'Indie Hackers',
        format: 'markdown_article',
        utmSource: 'indiehackers',
        utmMedium: 'community',
        utmCampaign: 'ai_agent_distrib',
    },
};

export const BANNED_AI_WORDS = [
    'delve', 'tapestry', 'realm', 'beacon', 'paramount', 'crucial',
    'symphony', 'testament', 'in conclusion', 'furthermore', 'moreover',
    'beacon of hope', 'game-changer', 'unleash', 'supercharge', 'revolutionary',
    'plethora', 'myriad', 'testament to'
];

export function buildUtmUrl(tool, platform, angleId) {
    const config = PLATFORM_CONFIGS[platform] || PLATFORM_CONFIGS.x;
    const url = new URL(`${BASE_URL}${tool.path}`);
    url.searchParams.set('utm_source', config.utmSource);
    url.searchParams.set('utm_medium', config.utmMedium);
    url.searchParams.set('utm_campaign', config.utmCampaign);
    url.searchParams.set('utm_content', `${tool.id}_${angleId}`);
    return url.toString();
}
