import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { renderLifecycleEmailHtml, LIFECYCLE_STEPS } from '@/lib/email-lifecycle';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'LaunchXact <hello@launchxact.com>';

const SAMPLE_PERSONAS = {
    sqlninja: {
        idea_name: 'SQLNinja AI',
        overall_score: 64,
        founder_archetype: 'The Stealth Builder',
        weakest_pillar: 'distribution',
        weakest_pillar_name: 'Distribution Strategy',
        weakest_score: 38,
        pillar_scores: {
            market_potential: 76,
            problem_severity: 70,
            competition_moat: 58,
            distribution: 38,
            monetization: 72,
            ai_defensibility: 62
        },
        weakness_diagnosis: 'Distribution Strategy is your fatal bottleneck (38/100). Relying on passive launch spikes will bleed momentum before reaching sustainable B2B revenue.',
        unsubscribe_token: 'preview-token-sqlninja'
    },
    chargeshield: {
        idea_name: 'ChargeShield AI',
        overall_score: 74,
        founder_archetype: 'The Niche Dominator',
        weakest_pillar: 'competition_moat',
        weakest_pillar_name: 'Competition & Moat',
        weakest_score: 48,
        pillar_scores: {
            market_potential: 82,
            problem_severity: 88,
            competition_moat: 48,
            distribution: 74,
            monetization: 85,
            ai_defensibility: 64
        },
        weakness_diagnosis: 'Competition & Moat is your primary vulnerability (48/100). Incumbents like Chargeflow or Stripe native dispute workflows could squeeze your margins.',
        unsubscribe_token: 'preview-token-chargeshield'
    },
    polyglot: {
        idea_name: 'PolyglotStudio AI',
        overall_score: 59,
        founder_archetype: 'The Wrapper Hustler',
        weakest_pillar: 'ai_defensibility',
        weakest_pillar_name: 'AI Defensibility',
        weakest_score: 36,
        pillar_scores: {
            market_potential: 68,
            problem_severity: 64,
            competition_moat: 52,
            distribution: 65,
            monetization: 58,
            ai_defensibility: 36
        },
        weakness_diagnosis: 'AI Defensibility is your existential bottleneck (36/100). High risk of being commoditized by native ElevenLabs or OpenAI video dubbing features.',
        unsubscribe_token: 'preview-token-polyglot'
    }
};

/**
 * GET: Return rendered HTML and metadata for a specific step
 */
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const step = parseInt(searchParams.get('step') || '1', 10);
        const personaKey = searchParams.get('persona') || 'sqlninja';
        const format = searchParams.get('format') || 'json'; // json or html

        const personaData = SAMPLE_PERSONAS[personaKey] || SAMPLE_PERSONAS.sqlninja;
        const stepConfig = LIFECYCLE_STEPS.find(s => s.step === step) || LIFECYCLE_STEPS[0];

        const renderedHtml = renderLifecycleEmailHtml(step, personaData);

        if (format === 'html') {
            return new Response(renderedHtml, {
                status: 200,
                headers: { 'Content-Type': 'text/html; charset=utf-8' }
            });
        }

        return NextResponse.json({
            step,
            personaKey,
            dayLabel: stepConfig.dayLabel,
            delayDays: stepConfig.delayDays,
            objective: stepConfig.objective,
            subject: stepConfig.subject(personaData),
            preheader: stepConfig.preheader(personaData),
            html: renderedHtml,
            persona: personaData
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

/**
 * POST: Send a test email for any step to a destination address
 */
export async function POST(request) {
    try {
        const body = await request.json();
        const { email, step = 1, personaKey = 'sqlninja', customData = null } = body;

        const cleanEmail = email?.trim().toLowerCase();
        if (!cleanEmail || !cleanEmail.includes('@')) {
            return NextResponse.json({ error: 'Valid email address is required.' }, { status: 400 });
        }

        const dataToRender = customData || SAMPLE_PERSONAS[personaKey] || SAMPLE_PERSONAS.sqlninja;
        const stepNumber = parseInt(step, 10);
        const stepConfig = LIFECYCLE_STEPS.find(s => s.step === stepNumber) || LIFECYCLE_STEPS[0];

        const html = renderLifecycleEmailHtml(stepNumber, dataToRender);
        const subject = `[TEST ${stepConfig.dayLabel}] ${stepConfig.subject(dataToRender)}`;

        if (!resend) {
            return NextResponse.json({
                success: true,
                mock: true,
                message: `[MOCK MODE] Step #${stepNumber} rendered successfully. In production with RESEND_API_KEY, this would dispatch to ${cleanEmail}.`,
                subject,
                step: stepNumber
            });
        }

        const sendRes = await resend.emails.send({
            from: FROM_EMAIL,
            to: cleanEmail,
            subject,
            html
        });

        return NextResponse.json({
            success: true,
            message: `Test Email for Step #${stepNumber} dispatched to ${cleanEmail}!`,
            resendId: sendRes.id || null,
            subject
        });

    } catch (error) {
        console.error('[API /lifecycle/preview POST Error]:', error);
        return NextResponse.json({ error: error.message || 'Failed to dispatch test email.' }, { status: 500 });
    }
}
