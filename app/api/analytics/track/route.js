import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// In-memory telemetry buffer to ensure realtime stats even before Supabase table migration
globalThis.__lx_event_buffer = globalThis.__lx_event_buffer || [];

export async function POST(request) {
    try {
        const body = await request.json();
        const eventName = body.eventName || body.event;
        const {
            sessionId,
            toolId,
            utmSource,
            utmMedium,
            utmCampaign,
            utmContent,
            utmTerm,
            refCode,
            referrer,
            metadata = {}
        } = body;

        if (!toolId || !eventName) {
            return NextResponse.json({ error: 'toolId and eventName are required' }, { status: 400 });
        }

        const eventRecord = {
            session_id: sessionId || 'anon',
            tool_id: toolId,
            event_name: eventName,
            utm_source: utmSource || null,
            utm_medium: utmMedium || null,
            utm_campaign: utmCampaign || null,
            utm_content: utmContent || null,
            utm_term: utmTerm || null,
            ref_code: refCode || null,
            referrer: referrer || null,
            metadata: metadata || {},
            created_at: new Date().toISOString()
        };

        // 1. Maintain in-memory ring buffer (max 1000 items)
        if (globalThis.__lx_event_buffer.length >= 1000) {
            globalThis.__lx_event_buffer.shift();
        }
        globalThis.__lx_event_buffer.push(eventRecord);

        // 2. Attempt insert into Supabase acquisition_events table
        if (supabase) {
            try {
                const { error } = await supabase
                    .from('acquisition_events')
                    .insert([eventRecord]);

                if (error) {
                    console.warn('[Acquisition API] Supabase insert note:', error.message);
                }
            } catch (dbErr) {
                console.warn('[Acquisition API] DB write skipped:', dbErr.message);
            }
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[Acquisition API Error]:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
