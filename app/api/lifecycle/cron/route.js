import { NextResponse } from 'next/server';
import { processDueLifecycleEmails } from '@/lib/email-lifecycle';

/**
 * GET or POST /api/lifecycle/cron
 * 
 * Secure endpoint to process scheduled lifecycle drip emails.
 * Triggerable by Vercel Cron, GitHub Actions, or external cron pingers.
 * 
 * Requires Authorization: Bearer <AGENT_CRON_SECRET> or ?secret=<AGENT_CRON_SECRET>
 */
export async function GET(request) {
    return handleCron(request);
}

export async function POST(request) {
    return handleCron(request);
}

async function handleCron(request) {
    try {
        const { searchParams } = new URL(request.url);
        const secretParam = searchParams.get('secret');
        const authHeader = request.headers.get('authorization');
        const bearerSecret = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

        const expectedSecret = process.env.AGENT_CRON_SECRET || process.env.CRON_SECRET;

        // In production, enforce secret if configured
        if (expectedSecret && secretParam !== expectedSecret && bearerSecret !== expectedSecret) {
            return NextResponse.json({ error: 'Unauthorized: Invalid cron secret token.' }, { status: 401 });
        }

        const batchLimit = parseInt(searchParams.get('limit') || '25', 10);
        const result = await processDueLifecycleEmails(batchLimit);

        return NextResponse.json({
            timestamp: new Date().toISOString(),
            ...result
        });
    } catch (error) {
        console.error('[API /lifecycle/cron Error]:', error);
        return NextResponse.json({ error: error.message || 'Cron execution failed' }, { status: 500 });
    }
}
