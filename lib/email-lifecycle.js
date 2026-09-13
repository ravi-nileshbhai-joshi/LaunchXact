import { Resend } from 'resend';
import { supabase } from './supabase.js';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'LaunchXact <hello@launchxact.com>';
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://launchxact.com';

/**
 * Step timing definitions (in days from previous step)
 * Step 1: Immediately (0 days)
 * Step 2: 2 days after Step 1 (+2 days = Day 2)
 * Step 3: 3 days after Step 2 (+3 days = Day 5)
 * Step 4: 4 days after Step 3 (+4 days = Day 9)
 * Step 5: 5 days after Step 4 (+5 days = Day 14)
 */
export const LIFECYCLE_STEPS = [
    {
        step: 1,
        dayLabel: 'Day 0 (Immediately)',
        delayDays: 0,
        objective: 'Deliver the result. Build trust with a ruthless, objective 6-pillar viability audit.',
        subject: (data) => `📊 Your AI SaaS Viability Score: ${data.overall_score || 0}/100 (${data.idea_name || 'Your SaaS'})`,
        preheader: (data) => `Your 6-pillar viability audit for ${data.idea_name || 'your idea'} is inside. See your score, archetype, and fatal bottleneck.`
    },
    {
        step: 2,
        dayLabel: 'Day 2 (+48 hours)',
        delayDays: 2,
        objective: 'The biggest weakness we found. Teach them something tactical and high-value.',
        subject: (data) => `⚠️ The #1 weakness we found in ${data.idea_name || 'your SaaS'}: ${data.weakest_pillar_name || 'Distribution'}`,
        preheader: (data) => `${data.weakest_pillar_name || 'Distribution'} is your existential bottleneck (${data.weakest_score ?? 38}/100). Here is the playbook to fix it.`
    },
    {
        step: 3,
        dayLabel: 'Day 5 (+72 hours)',
        delayDays: 3,
        objective: 'Why founders struggle after launch. Introduce LaunchXact as the unified launchpad.',
        subject: (data) => `Why 92% of AI SaaS founders stall out within 60 days of launch`,
        preheader: (data) => `The post-launch desert is real. Building the product was the easy part. Here is how to survive distribution & plumbing.`
    },
    {
        step: 4,
        dayLabel: 'Day 9 (+96 hours)',
        delayDays: 4,
        objective: 'We\'re building LaunchXact with our Genesis founders. Show the vision.',
        subject: (data) => `Inside Genesis: How we're building LaunchXact alongside our first founders`,
        preheader: (data) => `A behind-the-scenes look at our private cohort, peer launch flywheels, and the future of AI SaaS distribution.`
    },
    {
        step: 5,
        dayLabel: 'Day 14 (+120 hours)',
        delayDays: 5,
        objective: 'Genesis Batch applications are opening. The automated qualification CTA.',
        subject: (data) => `🚀 Genesis Batch applications are open — claim your founder spot for ${data.idea_name || 'your tool'}`,
        preheader: (data) => `0% fees for 90 days, 350k buyer distribution, and unified MoR billing. Only 25 vetted spots.`
    }
];

/**
 * Educational teardowns customized by weakest pillar for Email #2
 */
const WEAKNESS_MASTERCLASSES = {
    distribution: {
        title: 'The Fatal Myth of "Just Launching on Product Hunt"',
        subtitle: 'Why customer acquisition cost (CAC) kills early AI SaaS before $10k MRR — and the 3-channel alternative.',
        whyItHurts: 'Most founders treat distribution as an afterthought: build for 4 months, post on X, launch on Product Hunt, and pray. You get a 24-hour dopamine spike of 120 visitors, zero conversions, and then absolute silence. Relying on paid ads before achieving product-market fit burns cash at a 3:1 CAC-to-LTV ratio.',
        frameworkTitle: 'The 3-Channel Organic Acquisition Engine:',
        points: [
            '<strong>1. Generative Engine Optimization (GEO):</strong> AI search engines (Perplexity, ChatGPT Search, Gemini) cite sources that format direct, structured answers. Implement FAQ JSON-LD schemas targeting "[problem] software alternative" queries.',
            '<strong>2. Subreddit "Value-First" Engineering:</strong> Search Reddit for high-intent pain point queries. Answer comprehensively with actionable advice, and mention your tool as a specialized utility at the bottom with full transparency.',
            '<strong>3. Strategic Directory Syndication:</strong> Build high-authority backlink profiles across curated B2B directories to passively generate qualified inbound traffic without paying for search ads.'
        ],
        actionPrompt: 'Pick ONE specific community where your exact buyer complains about this problem weekly, and spend 15 minutes delivering actionable solutions.'
    },
    ai_defensibility: {
        title: 'The OpenAI Keynote Threat: Escaping the Thin Wrapper Trap',
        subtitle: 'How to build proprietary switching costs so an LLM API update doesn\'t destroy your business in an afternoon.',
        whyItHurts: 'If your entire product is a simple prompt wrapper around gpt-4o or Claude 3.5 Sonnet, an incumbent like Zendesk, Notion, or Shopify will replicate it in a two-week sprint, or OpenAI will ship it natively during their next keynote.',
        frameworkTitle: 'The 3 Layers of AI Defensibility:',
        points: [
            '<strong>1. Embedded Workflow Lock-In:</strong> Don\'t just generate text; integrate directly into the user\'s daily workflow (e.g. bi-directional syncing with Stripe, Postgres, HubSpot, or GitHub).',
            '<strong>2. Proprietary Deterministic Logic:</strong> 80% of your value should come from deterministic business logic, validation rules, and specialized data pipelines that LLMs struggle with alone.',
            '<strong>3. Accumulating User State:</strong> As customers use your product, their unique historical data, custom presets, and learned preferences should make leaving increasingly painful.'
        ],
        actionPrompt: 'Identify the single database entity or workflow step your user would dread losing if they cancelled their subscription.'
    },
    competition_moat: {
        title: 'Surviving Incumbent Feature Sprints & Clones',
        subtitle: 'How to position as a razor-sharp wedge against established category leaders.',
        whyItHurts: 'Trying to compete broadly against established giants (Salesforce, Zendesk, Canva) will drain your resources. They have millions in cash, enterprise distribution, and thousands of engineers.',
        frameworkTitle: 'The Micro-Wedge Strategy:',
        points: [
            '<strong>1. The 10x Niche Wedge:</strong> Narrow your audience down by 80%. Instead of "AI Customer Support", build "AI Chargeback Dispute Evidence Generator for High-Volume Shopify Merchants".',
            '<strong>2. Speed of Execution:</strong> Incumbents take 9 months to clear compliance and feature committee reviews. You can ship customer-requested features in 48 hours.',
            '<strong>3. Unbundled Value:</strong> Customers hate paying $300/mo for a bloated suite when they only use one specific feature. Unbundle that single feature, make it 10x faster, and charge $49/mo.'
        ],
        actionPrompt: 'Rewrite your value proposition to explicitly name the single incumbent you unbundle and why your workflow is 5x faster.'
    },
    monetization: {
        title: 'The AI Token Margin Trap: Moving Beyond $9/Month',
        subtitle: 'Why low pricing destroys AI unit economics — and how to transition to value-metric pricing.',
        whyItHurts: 'Charging $9 to $19/mo for an AI tool while paying variable LLM inference token fees on every user action is a recipe for negative gross margins. Heavy power users will quickly cost you more in API calls than they pay in subscription fees.',
        frameworkTitle: 'The Value-Metric Pricing Pivot:',
        points: [
            '<strong>1. Enforce Usage Boundaries:</strong> Never offer "unlimited" AI generation. Tie tiers to quantifiable output units (e.g. 50 audits/mo, 100 queries, 20 export runs).',
            '<strong>2. Target High-Intent B2B Tiers:</strong> For commercial B2B tools, your minimum plan should be $79/mo to $199/mo. Serious businesses do not take $12/mo software seriously.',
            '<strong>3. Value-Anchored Pricing:</strong> If your tool saves an operations manager 10 hours a week or recovers $2,000 in disputes, a $199/mo price tag is an instant 10x ROI.'
        ],
        actionPrompt: 'Calculate your average token inference cost per heavy user and set tier limits that guarantee a minimum 75% gross margin.'
    },
    problem_severity: {
        title: 'From "Vitamin" to "Bleeding-Neck Painkiller"',
        subtitle: 'How to position your product so corporate buyers pull out credit cards without hesitation.',
        whyItHurts: 'Vitamins ("this makes your workflow a little nicer") get cancelled during the first quarterly budget review. Painkillers ("without this, we lose $50k in revenue or fail our compliance audit") are non-negotiable line items.',
        frameworkTitle: 'The Painkiller Transformation Matrix:',
        points: [
            '<strong>1. Direct Economic Impact:</strong> Position your product directly against either Making Money (increasing conversion) or Saving Hard Money (reducing payroll or churn).',
            '<strong>2. Find the Budget Holder:</strong> Sell to the person whose annual bonus or promotion depends on solving this bottleneck.',
            '<strong>3. Urgent Time-to-Value:</strong> The user should experience their first quantifiable "aha" moment in under 3 minutes without requiring a 30-day onboarding sprint.'
        ],
        actionPrompt: 'Reframe your marketing headline from what your product does to the exact dollar amount of waste it prevents.'
    },
    market_potential: {
        title: 'Escaping the Crowded Graveyard',
        subtitle: 'How to expand TAM by capturing underserved B2B sub-verticals.',
        whyItHurts: 'Building in a saturated, low-margin hobbyist market forces you to compete purely on price in a race to the bottom.',
        frameworkTitle: 'Vertical B2B Expansion:',
        points: [
            '<strong>1. High-Willingness-to-Pay Verticals:</strong> Pivot your core capability to legal, healthcare, real estate, or B2B fintech where transactions carry high value.',
            '<strong>2. Enterprise Compliance Ready:</strong> Add SOC2/GDPR compliance, team permissions, and audit logs to unlock annual contracts.',
            '<strong>3. Land-and-Expand:</strong> Enter through a single operator and design features that naturally pull in their colleagues.'
        ],
        actionPrompt: 'List 3 specialized industry verticals that currently use messy spreadsheets to do what your software automates.'
    }
};

/**
 * Standard Email Shell Wrapper
 */
function wrapInEmailShell({ title, preheader, content, unsubscribeUrl, ideaName }) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { margin: 0; padding: 0; background-color: #080c14; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }
    table { border-collapse: separate; }
    a { color: #818cf8; text-decoration: none; }
    a:hover { text-decoration: underline; }
    @media only screen and (max-width: 600px) {
      .container { width: 100% !important; padding: 16px !important; }
      .pillar-box { padding: 12px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 24px 12px; background-color: #080c14; color: #e2e8f0;">
  <!-- Preheader text for inbox preview -->
  <div style="display: none; max-height: 0px; overflow: hidden; mso-hide: all; font-size: 1px; line-height: 1px; color: #080c14;">
    ${preheader}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
  </div>

  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 580px; background-color: #0f172a; border-radius: 16px; border: 1px solid #1e293b; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);">
          <!-- Top Gradient Accent Bar -->
          <tr>
            <td style="height: 4px; background: linear-gradient(90deg, #6366f1 0%, #a855f7 50%, #ec4899 100%);"></td>
          </tr>

          <!-- Header -->
          <tr>
            <td style="padding: 28px 32px 20px; border-bottom: 1px solid #1e293b;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td>
                    <div style="font-size: 20px; font-weight: 800; color: #ffffff; letter-spacing: -0.02em;">
                      Launch<span style="color: #6366f1;">Xact</span>
                      <span style="font-size: 11px; font-weight: 600; color: #94a3b8; background: #1e293b; padding: 3px 8px; border-radius: 999px; margin-left: 8px; text-transform: uppercase; letter-spacing: 0.05em;">Genesis Lifecycle</span>
                    </div>
                  </td>
                  <td align="right">
                    <span style="font-size: 12px; font-weight: 600; color: #818cf8; background: rgba(99, 102, 241, 0.1); border: 1px solid rgba(99, 102, 241, 0.3); padding: 4px 10px; border-radius: 999px;">
                      ${ideaName || 'Founder Dossier'}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 32px 32px 24px; color: #cbd5e1; font-size: 14.5px; line-height: 1.65;">
              ${content}
            </td>
          </tr>

          <!-- Founder Signature -->
          <tr>
            <td style="padding: 0 32px 32px;">
              <div style="border-top: 1px solid #1e293b; padding-top: 20px; color: #94a3b8; font-size: 13.5px; line-height: 1.5;">
                <p style="margin: 0 0 4px; color: #cbd5e1; font-weight: 700;">Ravi Joshi</p>
                <p style="margin: 0 0 2px;">Founder, LaunchXact</p>
                <p style="margin: 0;"><a href="https://launchxact.com" style="color: #818cf8;">launchxact.com</a> · Helping AI SaaS founders get distribution</p>
              </div>
            </td>
          </tr>

          <!-- Footer & Unsubscribe -->
          <tr>
            <td style="background-color: #090d16; padding: 20px 32px; border-top: 1px solid #1e293b; text-align: center; color: #64748b; font-size: 12px; line-height: 1.5;">
              <p style="margin: 0 0 6px;">
                You received this because you audited <strong>${ideaName || 'your AI SaaS'}</strong> on LaunchXact.
              </p>
              <p style="margin: 0;">
                <a href="${unsubscribeUrl}" style="color: #64748b; text-decoration: underline;">1-Click Unsubscribe</a> ·
                <a href="https://launchxact.com/privacy" style="color: #64748b; text-decoration: underline;">Privacy Policy</a> ·
                <a href="https://launchxact.com/terms" style="color: #64748b; text-decoration: underline;">Terms</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Render HTML for any step given subscriber data
 */
export function renderLifecycleEmailHtml(step, data = {}) {
    const unsubUrl = `${BASE_URL}/api/lifecycle/unsubscribe?token=${data.unsubscribe_token || 'demo-token'}`;
    const ideaName = data.idea_name || 'Your AI SaaS';
    const score = data.overall_score || 64;
    const weakestKey = data.weakest_pillar || 'distribution';
    const weakestName = data.weakest_pillar_name || 'Distribution Strategy';
    const weakestScore = data.pillar_scores?.[weakestKey] ?? (weakestKey === 'distribution' ? 38 : 44);
    const archetype = data.founder_archetype || 'The Stealth Builder';

    let contentHtml = '';
    const stepConfig = LIFECYCLE_STEPS.find(s => s.step === step) || LIFECYCLE_STEPS[0];
    const emailTitle = stepConfig.subject(data);
    const emailPreheader = stepConfig.preheader(data);

    switch (step) {
        case 1:
            // EMAIL #1 — IMMEDIATELY: Here's your AI SaaS score. Deliver the result.
            contentHtml = `
              <div style="margin-bottom: 24px;">
                <span style="background: rgba(99, 102, 241, 0.15); color: #a5b4fc; border: 1px solid rgba(99, 102, 241, 0.3); font-size: 12px; font-weight: 700; padding: 4px 12px; border-radius: 999px; text-transform: uppercase;">
                  Step 1 of 5 · Immediate Audit Delivery
                </span>
                <h1 style="color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: -0.02em; margin: 16px 0 8px;">
                  Here is your AI SaaS Viability Score:
                </h1>
                <p style="color: #94a3b8; font-size: 14.5px; margin: 0;">
                  We audited <strong>${ideaName}</strong> across our 6 core pillars. Here is your unvarnished diagnostic report:
                </p>
              </div>

              <!-- Score Card Banner -->
              <div style="background: linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.8)); border: 1px solid rgba(99, 102, 241, 0.3); border-radius: 14px; padding: 24px; margin: 24px 0; text-align: center;">
                <div style="font-size: 12px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 6px;">
                  Overall Viability Score
                </div>
                <div style="font-size: 56px; font-weight: 900; color: ${score >= 70 ? '#34d399' : (score >= 50 ? '#fbbf24' : '#f87171')}; line-height: 1; margin-bottom: 8px;">
                  ${score}<span style="font-size: 22px; color: #64748b; font-weight: 600;">/100</span>
                </div>
                <div style="display: inline-block; background: rgba(168, 85, 247, 0.15); border: 1px solid rgba(168, 85, 247, 0.3); color: #c084fc; font-size: 13px; font-weight: 700; padding: 4px 14px; border-radius: 999px;">
                  Archetype: ${archetype}
                </div>
              </div>

              <!-- Pillar Breakdown Grid -->
              <div style="margin: 24px 0;">
                <h3 style="color: #ffffff; font-size: 16px; font-weight: 700; margin: 0 0 12px;">
                  6-Pillar Viability Breakdown:
                </h3>
                <div style="background: #090d16; border: 1px solid #1e293b; border-radius: 12px; overflow: hidden;">
                  <table role="presentation" width="100%" cellpadding="10" cellspacing="0" style="font-size: 13.5px; border-collapse: collapse;">
                    <tr style="border-bottom: 1px solid #1e293b;">
                      <td style="color: #94a3b8; padding: 10px 14px;">Market Potential</td>
                      <td align="right" style="font-weight: 700; color: #e2e8f0; padding: 10px 14px;">${data.pillar_scores?.market_potential ?? 74}/100</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #1e293b;">
                      <td style="color: #94a3b8; padding: 10px 14px;">Problem Severity</td>
                      <td align="right" style="font-weight: 700; color: #e2e8f0; padding: 10px 14px;">${data.pillar_scores?.problem_severity ?? 68}/100</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #1e293b;">
                      <td style="color: #94a3b8; padding: 10px 14px;">Competition & Moat</td>
                      <td align="right" style="font-weight: 700; color: #e2e8f0; padding: 10px 14px;">${data.pillar_scores?.competition_moat ?? 58}/100</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #1e293b; background: rgba(239, 68, 68, 0.08);">
                      <td style="color: #f87171; font-weight: 700; padding: 10px 14px;">⚡ ${weakestName} (Bottleneck)</td>
                      <td align="right" style="font-weight: 800; color: #f87171; padding: 10px 14px;">${weakestScore}/100</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #1e293b;">
                      <td style="color: #94a3b8; padding: 10px 14px;">Monetization Power</td>
                      <td align="right" style="font-weight: 700; color: #e2e8f0; padding: 10px 14px;">${data.pillar_scores?.monetization ?? 66}/100</td>
                    </tr>
                    <tr>
                      <td style="color: #94a3b8; padding: 10px 14px;">AI Defensibility</td>
                      <td align="right" style="font-weight: 700; color: #e2e8f0; padding: 10px 14px;">${data.pillar_scores?.ai_defensibility ?? 60}/100</td>
                    </tr>
                  </table>
                </div>
              </div>

              <!-- Bottleneck Highlight -->
              <div style="background: rgba(239, 68, 68, 0.1); border-left: 4px solid #ef4444; padding: 16px; border-radius: 0 8px 8px 0; margin: 24px 0;">
                <div style="font-weight: 700; color: #fca5a5; font-size: 14px; margin-bottom: 4px;">
                  ⚠️ Your Primary Point of Failure: ${weakestName}
                </div>
                <p style="margin: 0; color: #cbd5e1; font-size: 13.5px; line-height: 1.5;">
                  ${data.weakness_diagnosis || `${weakestName} scored ${weakestScore}/100. Without solving this, your idea risks stalling before reaching sustainable recurring revenue.`}
                </p>
              </div>

              <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">
                <strong>What's next?</strong> In exactly 2 days, I'm going to send you a tactical teardown specifically addressing how to fix your <strong>${weakestName}</strong> bottleneck before writing more code.
              </p>

              <div style="text-align: center; margin: 32px 0 16px;">
                <a href="${BASE_URL}/grade" style="display: inline-block; background: linear-gradient(135deg, #6366f1, #7c3aed); color: #ffffff; font-weight: 700; font-size: 14px; padding: 12px 28px; border-radius: 8px; text-decoration: none; box-shadow: 0 4px 14px rgba(99, 102, 241, 0.4);">
                  View Interactive Grader Dashboard →
                </a>
              </div>
            `;
            break;

        case 2:
            // EMAIL #2 — 2 DAYS LATER: The biggest weakness we found. Teach them something.
            const masterclass = WEAKNESS_MASTERCLASSES[weakestKey] || WEAKNESS_MASTERCLASSES.distribution;
            contentHtml = `
              <div style="margin-bottom: 24px;">
                <span style="background: rgba(239, 68, 68, 0.15); color: #fca5a5; border: 1px solid rgba(239, 68, 68, 0.3); font-size: 12px; font-weight: 700; padding: 4px 12px; border-radius: 999px; text-transform: uppercase;">
                  Step 2 of 5 · Deep-Dive Teardown
                </span>
                <h1 style="color: #ffffff; font-size: 23px; font-weight: 800; letter-spacing: -0.02em; margin: 16px 0 8px;">
                  The biggest weakness we found in ${ideaName}:
                </h1>
                <p style="color: #f87171; font-size: 16px; font-weight: 700; margin: 0 0 12px;">
                  ${weakestName} (${weakestScore}/100) — ${masterclass.title}
                </p>
              </div>

              <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">
                When we graded <strong>${ideaName}</strong>, your score of <strong>${score}/100</strong> had one major alarm bell: your <strong>${weakestName}</strong>.
              </p>

              <p style="color: #94a3b8; font-size: 14px; line-height: 1.6;">
                ${masterclass.whyItHurts}
              </p>

              <!-- Educational Box -->
              <div style="background: #090d16; border: 1px solid #1e293b; border-radius: 12px; padding: 22px; margin: 24px 0;">
                <div style="font-size: 15px; font-weight: 800; color: #a5b4fc; margin-bottom: 14px;">
                  🛠️ ${masterclass.frameworkTitle}
                </div>
                <div style="color: #cbd5e1; font-size: 13.5px; line-height: 1.65;">
                  ${masterclass.points.map(pt => `<div style="margin-bottom: 12px; padding-left: 8px; border-left: 2px solid #6366f1;">${pt}</div>`).join('')}
                </div>
              </div>

              <!-- Actionable Challenge -->
              <div style="background: rgba(99, 102, 241, 0.08); border: 1px solid rgba(99, 102, 241, 0.25); border-radius: 10px; padding: 18px; margin: 24px 0;">
                <div style="font-size: 13px; font-weight: 700; color: #818cf8; text-transform: uppercase; margin-bottom: 6px;">
                  ⚡ Your 48-Hour Action Sprint:
                </div>
                <p style="margin: 0; color: #e2e8f0; font-size: 14px; line-height: 1.5;">
                  ${masterclass.actionPrompt}
                </p>
              </div>

              <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">
                Fixing this bottleneck now will save you 4 months of wasted development. In a few days, I'll show you the exact distribution stack top founders use post-launch.
              </p>

              <div style="text-align: center; margin: 28px 0 12px;">
                <a href="${BASE_URL}/tools" style="display: inline-block; background: #1e293b; border: 1px solid #334155; color: #ffffff; font-weight: 700; font-size: 13.5px; padding: 10px 24px; border-radius: 8px; text-decoration: none;">
                  Explore Free Founder Calculators & Tools →
                </a>
              </div>
            `;
            break;

        case 3:
            // EMAIL #3 — DAY 5: Why founders struggle after launch. Introduce LaunchXact.
            contentHtml = `
              <div style="margin-bottom: 24px;">
                <span style="background: rgba(168, 85, 247, 0.15); color: #c084fc; border: 1px solid rgba(168, 85, 247, 0.3); font-size: 12px; font-weight: 700; padding: 4px 12px; border-radius: 999px; text-transform: uppercase;">
                  Step 3 of 5 · Founder Reality Check
                </span>
                <h1 style="color: #ffffff; font-size: 23px; font-weight: 800; letter-spacing: -0.02em; margin: 16px 0 8px;">
                  Why 92% of AI founders stall out within 60 days of launch
                </h1>
                <p style="color: #94a3b8; font-size: 14.5px; margin: 0;">
                  Here is the painful truth about the "post-launch desert" nobody talks about on Twitter.
                </p>
              </div>

              <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">
                Most technical founders believe this lie: <em>"If I build a sufficiently impressive AI tool, the customers will naturally arrive."</em>
              </p>

              <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">
                Then reality hits on Day 14. You've launched. You got 15 upvotes from friends. And suddenly, your calendar is empty, your Stripe balance is $0, and you are staring at an overwhelming laundry list of non-core plumbing:
              </p>

              <!-- Friction List -->
              <div style="background: #090d16; border: 1px solid #1e293b; border-radius: 12px; padding: 20px; margin: 20px 0;">
                <ul style="margin: 0; padding-left: 20px; color: #cbd5e1; font-size: 13.5px; line-height: 1.7;">
                  <li><strong>The Frankenstein Billing Stack:</strong> Struggling with global VAT, EU sales tax, Merchant of Record compliance, and invoice reconciliation.</li>
                  <li><strong>The Cold Distribution Desert:</strong> Screaming into the void on LinkedIn and X with zero reach, or wasting $1,500 on uncalibrated Google Ads.</li>
                  <li><strong>The LLM Inference Squeeze:</strong> API costs silently eating away at your margins while users abuse prompt generations.</li>
                  <li><strong>The Isolation Trap:</strong> Building alone in a silo without feedback from serious B2B software buyers.</li>
                </ul>
              </div>

              <h2 style="color: #ffffff; font-size: 18px; font-weight: 800; margin: 28px 0 10px;">
                This is why we built LaunchXact.
              </h2>

              <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">
                LaunchXact isn't just another passive software directory. It is an end-to-end <strong>launch acceleration ecosystem</strong> designed specifically for AI SaaS builders:
              </p>

              <div style="background: linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(168, 85, 247, 0.08)); border: 1px solid rgba(99, 102, 241, 0.3); border-radius: 12px; padding: 20px; margin: 22px 0;">
                <div style="margin-bottom: 12px;">
                  <strong style="color: #ffffff;">🚀 Curated B2B Distribution:</strong>
                  <span style="color: #94a3b8; font-size: 13px;"> Direct access to over 350,000 tech buyers, builders, and early adopters actively looking for specialized AI workflows.</span>
                </div>
                <div style="margin-bottom: 12px;">
                  <strong style="color: #ffffff;">💳 Zero-Fee Merchant of Record:</strong>
                  <span style="color: #94a3b8; font-size: 13px;"> Multi-region compliance, automated global sales tax handling, and instant checkout with 0% platform fees for initial cohort founders.</span>
                </div>
                <div>
                  <strong style="color: #ffffff;">🎯 Automated GEO Indexing:</strong>
                  <span style="color: #94a3b8; font-size: 13px;"> Pre-built schema generation and AI-crawler indexing to ensure Perplexity, ChatGPT, and Gemini cite your tool.</span>
                </div>
              </div>

              <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">
                You should be spending 90% of your time writing code and talking to users — not wrestling with global tax treaties and cold outbound spreadsheets.
              </p>

              <div style="text-align: center; margin: 28px 0 12px;">
                <a href="${BASE_URL}/saas-marketplace-guide" style="display: inline-block; background: #6366f1; color: #ffffff; font-weight: 700; font-size: 13.5px; padding: 11px 26px; border-radius: 8px; text-decoration: none;">
                  Read the 2026 SaaS Distribution Blueprint →
                </a>
              </div>
            `;
            break;

        case 4:
            // EMAIL #4 — DAY 9: We're building LaunchXact with our Genesis founders. Show the vision.
            contentHtml = `
              <div style="margin-bottom: 24px;">
                <span style="background: rgba(56, 189, 248, 0.15); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3); font-size: 12px; font-weight: 700; padding: 4px 12px; border-radius: 999px; text-transform: uppercase;">
                  Step 4 of 5 · Behind the Scenes
                </span>
                <h1 style="color: #ffffff; font-size: 23px; font-weight: 800; letter-spacing: -0.02em; margin: 16px 0 8px;">
                  Inside Genesis: How we're building LaunchXact with our founders
                </h1>
                <p style="color: #94a3b8; font-size: 14.5px; margin: 0;">
                  A transparent look into what we are building together and why the launch game has permanently changed.
                </p>
              </div>

              <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">
                Over the last few weeks, we quietly invited a small group of verified AI SaaS founders into our private <strong>Genesis Batch</strong>.
              </p>

              <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">
                Instead of building LaunchXact in an ivory tower, we are co-building every feature directly alongside founders who are actively launching products like <em>${ideaName}</em>.
              </p>

              <!-- Insider Highlights -->
              <div style="background: #090d16; border: 1px solid #1e293b; border-radius: 12px; padding: 22px; margin: 24px 0;">
                <div style="font-size: 14px; font-weight: 800; color: #38bdf8; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 14px;">
                  What's happening inside the cohort right now:
                </div>
                
                <div style="margin-bottom: 16px;">
                  <div style="color: #ffffff; font-weight: 700; font-size: 14px;">1. Live Product & Positioning Teardowns</div>
                  <div style="color: #94a3b8; font-size: 13px; margin-top: 4px;">
                    We audit each tool's value proposition, remove conversion friction, and tighten pricing before a single public dollar is spent.
                  </div>
                </div>

                <div style="margin-bottom: 16px;">
                  <div style="color: #ffffff; font-weight: 700; font-size: 14px;">2. The Cross-Founder Distribution Flywheel</div>
                  <div style="color: #94a3b8; font-size: 13px; margin-top: 4px;">
                    When one founder launches on LaunchXact, all cohort founders benefit from shared buyer traffic, bundled cross-promotions, and co-marketing spikes.
                  </div>
                </div>

                <div>
                  <div style="color: #ffffff; font-weight: 700; font-size: 14px;">3. Direct Matching with Vetted B2B Buyers</div>
                  <div style="color: #94a3b8; font-size: 13px; margin-top: 4px;">
                    We match high-performing AI workflows directly with businesses and agencies seeking automated solutions, bypassing cold outbound entirely.
                  </div>
                </div>
              </div>

              <!-- The Vision Quote -->
              <div style="border-left: 3px solid #38bdf8; padding: 12px 18px; margin: 24px 0; background: rgba(56, 189, 248, 0.05);">
                <p style="margin: 0; color: #e2e8f0; font-style: italic; font-size: 14px; line-height: 1.6;">
                  "The future of software discovery is not upvote circles or spammy directory dumps. It is curated, high-trust platforms where enterprise buyers find verified solutions with transparent pricing and instant checkout."
                </p>
              </div>

              <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">
                In 5 days, we are officially opening applications for the next Genesis Batch cohort. We keep each cohort strictly capped at 25-50 founders to maintain individual attention.
              </p>

              <div style="text-align: center; margin: 28px 0 12px;">
                <a href="${BASE_URL}/#founder-form" style="display: inline-block; background: #1e293b; border: 1px solid #38bdf8; color: #38bdf8; font-weight: 700; font-size: 13.5px; padding: 10px 24px; border-radius: 8px; text-decoration: none;">
                  Preview the Genesis Cohort Specs →
                </a>
              </div>
            `;
            break;

        case 5:
            // EMAIL #5 — DAY 14: Genesis Batch applications are opening. CTA.
            contentHtml = `
              <div style="margin-bottom: 24px;">
                <span style="background: linear-gradient(90deg, #6366f1, #a855f7); color: #ffffff; font-size: 12px; font-weight: 800; padding: 5px 14px; border-radius: 999px; text-transform: uppercase; letter-spacing: 0.05em;">
                  Final Step 5 of 5 · Official Invitation
                </span>
                <h1 style="color: #ffffff; font-size: 25px; font-weight: 900; letter-spacing: -0.02em; margin: 18px 0 8px;">
                  Genesis Batch applications are officially open 🚀
                </h1>
                <p style="color: #94a3b8; font-size: 14.5px; margin: 0;">
                  Over the past 14 days, you diagnosed <strong>${ideaName}</strong>. Now it's time to launch with an unfair advantage.
                </p>
              </div>

              <!-- Qualification Status Banner -->
              <div style="background: rgba(99, 102, 241, 0.1); border: 1px solid rgba(99, 102, 241, 0.3); border-radius: 12px; padding: 18px; margin: 22px 0;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td>
                      <div style="font-size: 12px; color: #818cf8; font-weight: 700; text-transform: uppercase;">
                        Automated Qualification Status:
                      </div>
                      <div style="font-size: 16px; font-weight: 800; color: #ffffff; margin-top: 4px;">
                        ${ideaName} · Pre-Qualified Candidate
                      </div>
                      <div style="font-size: 13px; color: #94a3b8; margin-top: 2px;">
                        Overall Viability: <strong>${score}/100</strong> · Weakest Link Target: <strong style="color: #f87171;">${weakestName}</strong>
                      </div>
                    </td>
                    <td align="right" style="vertical-align: middle;">
                      <span style="background: #10b981; color: #022c22; font-size: 12px; font-weight: 800; padding: 6px 12px; border-radius: 999px; text-transform: uppercase;">
                        Eligible ✓
                      </span>
                    </td>
                  </tr>
                </table>
              </div>

              <p style="color: #cbd5e1; font-size: 14.5px; line-height: 1.65;">
                We are opening doors for the next curated <strong>Genesis Batch</strong>. This is not a passive forum or an expensive agency. It is an end-to-end launchpad built to give you the distribution and infrastructure you need to reach your first $10,000 MRR.
              </p>

              <!-- Cohort Perks -->
              <div style="background: #090d16; border: 1px solid #1e293b; border-radius: 14px; padding: 24px; margin: 24px 0;">
                <div style="font-size: 15px; font-weight: 800; color: #ffffff; margin-bottom: 16px;">
                  What Genesis Batch Founders Receive:
                </div>

                <div style="margin-bottom: 14px; padding-left: 10px; border-left: 3px solid #10b981;">
                  <strong style="color: #34d399; font-size: 14px;">1. 0% Platform Fees for 90 Days:</strong>
                  <div style="color: #cbd5e1; font-size: 13px; margin-top: 3px;">Keep 100% of your earnings. We don't take a dime until you are generating consistent revenue.</div>
                </div>

                <div style="margin-bottom: 14px; padding-left: 10px; border-left: 3px solid #6366f1;">
                  <strong style="color: #818cf8; font-size: 14px;">2. Direct Pipeline to 350,000+ Tech Buyers:</strong>
                  <div style="color: #cbd5e1; font-size: 13px; margin-top: 3px;">Featured placement across our curated marketplace, newsletter spotlights, and buyer syndication networks.</div>
                </div>

                <div style="margin-bottom: 14px; padding-left: 10px; border-left: 3px solid #a855f7;">
                  <strong style="color: #c084fc; font-size: 14px;">3. Turnkey Merchant of Record & Global Tax:</strong>
                  <div style="color: #cbd5e1; font-size: 13px; margin-top: 3px;">Accept payments in 130+ countries with automatic sales tax handling, EU VAT remittance, and fraud protection.</div>
                </div>

                <div style="margin-bottom: 14px; padding-left: 10px; border-left: 3px solid #38bdf8;">
                  <strong style="color: #38bdf8; font-size: 14px;">4. Weekly Advisory Office Hours with Ravi Joshi:</strong>
                  <div style="color: #cbd5e1; font-size: 13px; margin-top: 3px;">Direct architectural, pricing, and distribution reviews to ruthlessly eliminate launch bottlenecks.</div>
                </div>

                <div style="padding-left: 10px; border-left: 3px solid #f59e0b;">
                  <strong style="color: #fbbf24; font-size: 14px;">5. Genesis Verified Trust Badge:</strong>
                  <div style="color: #cbd5e1; font-size: 13px; margin-top: 3px;">A verified credibility badge embedded on your landing page to double checkout conversion rates.</div>
                </div>
              </div>

              <div style="background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 8px; padding: 14px; margin: 20px 0; color: #fde68a; font-size: 13px; line-height: 1.5;">
                ⏰ <strong>Cohort Capped:</strong> To ensure high buyer attention and hands-on advisory, we only accept 25 products per batch. Applications are reviewed in the order received.
              </div>

              <!-- High-Contrast CTA -->
              <div style="text-align: center; margin: 36px 0 20px;">
                <a href="${BASE_URL}/#founder-form" style="display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%); color: #ffffff; font-weight: 800; font-size: 15px; padding: 14px 34px; border-radius: 10px; text-decoration: none; box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.5); letter-spacing: -0.01em;">
                  Apply for the Genesis Batch Now →
                </a>
                <div style="color: #64748b; font-size: 12px; margin-top: 10px;">
                  Takes 3 minutes · 100% free to apply · No credit card required
                </div>
              </div>
            `;
            break;
    }

    return wrapInEmailShell({
        title: emailTitle,
        preheader: emailPreheader,
        content: contentHtml,
        unsubscribeUrl: unsubUrl,
        ideaName
    });
}

/**
 * Enroll a founder into the 5-email lifecycle sequence.
 * Dispatches Email #1 immediately and sets next_send_at for Step 2 (+48 hours).
 */
export async function enrollInLifecycle({
    email,
    ideaName = 'Your AI SaaS',
    auditResult = {},
    toolId = 'ai-saas-grader',
    utmSource = null,
    utmMedium = null,
    utmCampaign = null,
    refCode = null
}) {
    const cleanEmail = email?.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
        throw new Error('Valid email is required to enroll in lifecycle');
    }

    const overallScore = auditResult.overall_score || auditResult.total_score || 64;
    const weakestPillar = auditResult.weakest_pillar || 'distribution';
    const weakestPillarName = auditResult.weakest_pillar_name || 'Distribution Strategy';
    const founderArchetype = auditResult.founder_archetype || 'The Stealth Builder';
    const pillarScores = auditResult.pillar_scores || {};
    const actionItems = auditResult.action_items || [];

    // Calculate Step 2 send time: 2 days (48 hours) from now
    const now = new Date();
    const nextSendAt = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString();

    let subscriberRecord = {
        email: cleanEmail,
        idea_name: ideaName,
        overall_score: overallScore,
        founder_archetype: founderArchetype,
        weakest_pillar: weakestPillar,
        weakest_pillar_name: weakestPillarName,
        pillar_scores: pillarScores,
        action_items: actionItems,
        tool_id: toolId,
        current_step: 1,
        status: 'active',
        enrolled_at: now.toISOString(),
        last_sent_at: now.toISOString(),
        step_1_sent_at: now.toISOString(),
        next_send_at: nextSendAt,
        utm_source: utmSource,
        utm_medium: utmMedium,
        utm_campaign: utmCampaign,
        ref_code: refCode,
        metadata: {
            weakness_diagnosis: auditResult.weakness_diagnosis || null,
            verdict_headline: auditResult.verdict_headline || null
        }
    };

    // 1. Upsert subscriber in Supabase
    if (supabase) {
        try {
            // Check if already enrolled
            const { data: existing } = await supabase
                .from('email_lifecycle_subscribers')
                .select('id, current_step, status, unsubscribe_token')
                .eq('email', cleanEmail)
                .maybeSingle();

            if (existing) {
                // If previously unsubscribed, keep status unless forced
                if (existing.status !== 'unsubscribed') {
                    const { data: updated, error: updateErr } = await supabase
                        .from('email_lifecycle_subscribers')
                        .update({
                            idea_name: ideaName,
                            overall_score: overallScore,
                            founder_archetype: founderArchetype,
                            weakest_pillar: weakestPillar,
                            weakest_pillar_name: weakestPillarName,
                            pillar_scores: pillarScores,
                            action_items: actionItems,
                            current_step: 1,
                            status: 'active',
                            last_sent_at: now.toISOString(),
                            step_1_sent_at: now.toISOString(),
                            next_send_at: nextSendAt,
                            updated_at: now.toISOString()
                        })
                        .eq('id', existing.id)
                        .select()
                        .single();

                    if (!updateErr && updated) {
                        subscriberRecord = updated;
                    }
                } else {
                    subscriberRecord = existing;
                }
            } else {
                const { data: inserted, error: insertErr } = await supabase
                    .from('email_lifecycle_subscribers')
                    .insert([subscriberRecord])
                    .select()
                    .single();

                if (!insertErr && inserted) {
                    subscriberRecord = inserted;
                }
            }
        } catch (dbErr) {
            console.warn('[Lifecycle Engine] DB write skipped (schema pending):', dbErr.message);
        }
    }

    // 2. Dispatch Step 1 Email immediately
    const emailHtml = renderLifecycleEmailHtml(1, subscriberRecord);
    const stepConfig = LIFECYCLE_STEPS[0];
    const subject = stepConfig.subject(subscriberRecord);

    if (resend) {
        try {
            await resend.emails.send({
                from: FROM_EMAIL,
                to: cleanEmail,
                subject,
                html: emailHtml
            });
            console.log(`[Lifecycle Engine] Step 1 dispatched to ${cleanEmail}`);
        } catch (mailErr) {
            console.warn('[Lifecycle Engine] Resend Step 1 delivery warning:', mailErr.message);
        }
    } else {
        console.log(`[Lifecycle Engine] (Mock) Step 1 ready for ${cleanEmail}: "${subject}"`);
    }

    return {
        success: true,
        enrolled: true,
        subscriber: subscriberRecord
    };
}

/**
 * Sends a specific lifecycle step to an existing subscriber record.
 */
export async function sendLifecycleStep(subscriber, step) {
    if (!subscriber || !subscriber.email) {
        throw new Error('Valid subscriber record is required');
    }

    const stepConfig = LIFECYCLE_STEPS.find(s => s.step === step);
    if (!stepConfig) {
        throw new Error(`Invalid lifecycle step: ${step}`);
    }

    const emailHtml = renderLifecycleEmailHtml(step, subscriber);
    const subject = stepConfig.subject(subscriber);

    if (resend) {
        await resend.emails.send({
            from: FROM_EMAIL,
            to: subscriber.email,
            subject,
            html: emailHtml
        });
    }

    // Determine next send time:
    // Step 2 -> Step 3: +3 days (Day 5)
    // Step 3 -> Step 4: +4 days (Day 9)
    // Step 4 -> Step 5: +5 days (Day 14)
    // Step 5 -> Complete
    const now = new Date();
    let nextStep = step + 1;
    let nextSendAt = null;
    let status = 'active';

    if (nextStep === 3) {
        nextSendAt = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString();
    } else if (nextStep === 4) {
        nextSendAt = new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000).toISOString();
    } else if (nextStep === 5) {
        nextSendAt = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString();
    } else {
        // Step 5 completed the sequence!
        status = 'completed';
        nextSendAt = null;
    }

    const updateFields = {
        current_step: status === 'completed' ? 5 : nextStep,
        status,
        last_sent_at: now.toISOString(),
        next_send_at: nextSendAt,
        [`step_${step}_sent_at`]: now.toISOString(),
        updated_at: now.toISOString()
    };

    if (supabase && subscriber.id) {
        try {
            await supabase
                .from('email_lifecycle_subscribers')
                .update(updateFields)
                .eq('id', subscriber.id);
        } catch (dbErr) {
            console.warn(`[Lifecycle Engine] DB update failed for step ${step}:`, dbErr.message);
        }
    }

    return {
        success: true,
        step,
        nextStep: status === 'completed' ? null : nextStep,
        nextSendAt
    };
}

/**
 * Cron dispatcher: queries due subscribers and dispatches next step.
 */
export async function processDueLifecycleEmails(batchSize = 25) {
    if (!supabase) {
        return { success: false, message: 'Supabase client not initialized' };
    }

    const nowIso = new Date().toISOString();

    try {
        // Query active subscribers whose next_send_at has arrived
        const { data: dueSubscribers, error } = await supabase
            .from('email_lifecycle_subscribers')
            .select('*')
            .eq('status', 'active')
            .lte('next_send_at', nowIso)
            .order('next_send_at', { ascending: true })
            .limit(batchSize);

        if (error) {
            return { success: false, error: error.message };
        }

        if (!dueSubscribers || dueSubscribers.length === 0) {
            return { success: true, processedCount: 0, message: 'No emails due for dispatch' };
        }

        const results = [];

        for (const sub of dueSubscribers) {
            try {
                // Next step is current_step (or current_step + 1 if step 1 was already sent)
                let stepToSend = sub.current_step;
                if (sub.step_1_sent_at && stepToSend === 1) {
                    stepToSend = 2;
                }

                if (stepToSend > 5) {
                    await supabase
                        .from('email_lifecycle_subscribers')
                        .update({ status: 'completed', next_send_at: null })
                        .eq('id', sub.id);
                    continue;
                }

                const res = await sendLifecycleStep(sub, stepToSend);
                results.push({ email: sub.email, step: stepToSend, success: true });
            } catch (err) {
                console.error(`[Lifecycle Cron Error] Failed sending to ${sub.email}:`, err.message);
                results.push({ email: sub.email, error: err.message, success: false });
            }
        }

        return {
            success: true,
            processedCount: results.length,
            details: results
        };

    } catch (err) {
        console.error('[Lifecycle Cron System Error]:', err);
        return { success: false, error: err.message };
    }
}

/**
 * Handle unsubscribe by token
 */
export async function unsubscribeSubscriber(token) {
    if (!token) return { success: false, error: 'Missing unsubscribe token' };

    if (supabase) {
        try {
            const { data, error } = await supabase
                .from('email_lifecycle_subscribers')
                .update({ status: 'unsubscribed', updated_at: new Date().toISOString() })
                .eq('unsubscribe_token', token)
                .select()
                .single();

            if (error) return { success: false, error: error.message };
            return { success: true, subscriber: data };
        } catch (err) {
            return { success: false, error: err.message };
        }
    }

    return { success: true, mock: true };
}
