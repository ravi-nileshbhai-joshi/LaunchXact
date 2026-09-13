import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY
    ? new Resend(process.env.RESEND_API_KEY)
    : null;

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'LaunchXact <hello@launchxact.com>';

// Descriptive tool names for email branding
const TOOL_TITLES = {
    'true-cost-of-payments': 'The True Cost of Payments & Tax Audit',
    'franken-stack-cost-forecaster': 'The Franken-Stack Cloud Forecaster',
    'pre-launch-distribution-architect': 'The Pre-Launch Distribution Roadmap',
    'geo-schema-snippet-generator': 'The GEO & AI Search Schema Blueprint',
    'ai-saas-grader': 'The AI SaaS Viability Dossier',
};

export async function POST(request) {
    try {
        const body = await request.json();
        const {
            email,
            toolId,
            sessionId,
            resultSummary = {},
            joinedWaitlist = false,
            utmSource,
            utmMedium,
            utmCampaign,
            refCode
        } = body;

        const cleanEmail = email?.trim().toLowerCase();
        if (!cleanEmail || !cleanEmail.includes('@')) {
            return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 });
        }

        if (!toolId) {
            return NextResponse.json({ error: 'toolId is required.' }, { status: 400 });
        }

        const toolName = TOOL_TITLES[toolId] || 'Founder Tool Audit';

        // 1. Insert into tool_leads table
        if (supabase) {
            try {
                const leadRecord = {
                    email: cleanEmail,
                    tool_id: toolId,
                    session_id: sessionId || null,
                    utm_source: utmSource || null,
                    utm_medium: utmMedium || null,
                    utm_campaign: utmCampaign || null,
                    ref_code: refCode || null,
                    joined_waitlist: !!joinedWaitlist,
                    result_summary: resultSummary || {},
                    created_at: new Date().toISOString()
                };

                const { error: leadErr } = await supabase
                    .from('tool_leads')
                    .insert([leadRecord]);

                if (leadErr) {
                    console.warn('[Lead Capture] DB write note:', leadErr.message);
                }

                // If user opted into the waitlist, add to waitlist_buyers
                if (joinedWaitlist) {
                    try {
                        await supabase
                            .from('waitlist_buyers')
                            .insert([{
                                email: cleanEmail,
                                interests: `Lead captured via ${toolId}`,
                                utm_source: utmSource || null,
                                utm_medium: utmMedium || null,
                                utm_campaign: utmCampaign || null
                            }]);
                    } catch {
                        // Ignore duplicate waitlist entries
                    }
                }
            } catch (err) {
                console.warn('[Lead Capture] Supabase skip:', err.message);
            }
        }

        // 2. Dispatch acquisition telemetry events
        const eventBase = {
            session_id: sessionId || 'anon',
            tool_id: toolId,
            utm_source: utmSource || null,
            utm_medium: utmMedium || null,
            utm_campaign: utmCampaign || null,
            ref_code: refCode || null,
            created_at: new Date().toISOString()
        };

        // Event: email_submitted
        const emailEvent = {
            ...eventBase,
            event_name: 'email_submitted',
            metadata: { tool_id: toolId, email_domain: cleanEmail.split('@')[1] }
        };
        globalThis.__lx_event_buffer = globalThis.__lx_event_buffer || [];
        globalThis.__lx_event_buffer.push(emailEvent);

        if (supabase) {
            try {
                await supabase.from('acquisition_events').insert([emailEvent]);
            } catch (eventErr) {
                console.warn('[Acquisition Event] Email event insert warning:', eventErr?.message);
            }
        }

        // Event: waitlist_joined (if checked)
        if (joinedWaitlist) {
            const waitlistEvent = {
                ...eventBase,
                event_name: 'waitlist_joined',
                metadata: { source_tool: toolId }
            };
            globalThis.__lx_event_buffer.push(waitlistEvent);
            if (supabase) {
                try {
                    await supabase.from('acquisition_events').insert([waitlistEvent]);
                } catch (eventErr) {
                    console.warn('[Acquisition Event] Waitlist event insert warning:', eventErr?.message);
                }
            }
        }

        // 3. Send Delivery Email via Resend
        if (resend) {
            try {
                const emailSubject = `📊 Your ${toolName} Report — LaunchXact Founder Blueprint`;
                const emailHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#080c14;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#e2e8f0;line-height:1.6;">
  <div style="max-width:560px;margin:30px auto;background:#0f172a;border-radius:16px;border:1px solid #1e293b;overflow:hidden;box-shadow:0 20px 40px rgba(0,0,0,0.5);">
    <div style="height:4px;background:linear-gradient(90deg,#6366f1,#a855f7,#ec4899);"></div>
    <div style="padding:32px;">
      <div style="font-size:20px;font-weight:800;color:#ffffff;margin-bottom:20px;">Launch<span style="color:#6366f1;">Xact</span></div>
      
      <h2 style="margin:0 0 14px;color:#ffffff;font-size:20px;font-weight:800;">Your ${toolName} is Ready 🚀</h2>
      
      <p style="color:#94a3b8;font-size:14.5px;line-height:1.6;margin:0 0 20px;">
        Here are your customized founder metrics and diagnosis calculated on LaunchXact:
      </p>

      <div style="margin:20px 0;padding:20px;background:#090d16;border-radius:12px;border:1px solid #1e293b;">
        <div style="font-size:12px;font-weight:700;color:#818cf8;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:12px;">Summary Highlights</div>
        <pre style="white-space:pre-wrap;font-family:monospace;font-size:13px;color:#cbd5e1;margin:0;">${JSON.stringify(resultSummary, null, 2)}</pre>
      </div>

      <div style="margin:24px 0;padding:20px;background:linear-gradient(135deg,rgba(99,102,241,0.12),rgba(168,85,247,0.08));border-radius:12px;border:1px solid rgba(99,102,241,0.3);">
        <h3 style="margin:0 0 8px;font-size:16px;font-weight:700;color:#ffffff;">Skip the Fragmentation: Join the Genesis Batch</h3>
        <p style="margin:0 0 14px;font-size:13.5px;color:#cbd5e1;line-height:1.5;">
          LaunchXact gives curated founders 0% platform fees for 90 days, native Merchant of Record with automated global tax, and direct distribution to 350k+ tech buyers.
        </p>
        <a href="https://launchxact.com/#founder-form" style="display:inline-block;background:#6366f1;color:#ffffff;text-decoration:none;padding:10px 20px;border-radius:8px;font-weight:700;font-size:13.5px;">Apply for Genesis Batch →</a>
      </div>

      <p style="margin:0;font-size:13.5px;color:#64748b;">
        Keep building,<br/>
        <strong style="color:#cbd5e1;">Ravi Joshi</strong><br/>
        Founder, LaunchXact<br/>
        <a href="https://launchxact.com" style="color:#6366f1;text-decoration:none;">launchxact.com</a>
      </p>
    </div>
  </div>
</body>
</html>`;

                await resend.emails.send({
                    from: FROM_EMAIL,
                    to: cleanEmail,
                    subject: emailSubject,
                    html: emailHtml,
                });
            } catch (mailErr) {
                console.warn('[Lead Capture] Resend email note:', mailErr.message);
            }
        }

        return NextResponse.json({
            success: true,
            message: `Your detailed dossier has been dispatched to ${cleanEmail}.`
        });

    } catch (error) {
        console.error('[Lead Capture Error]:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
