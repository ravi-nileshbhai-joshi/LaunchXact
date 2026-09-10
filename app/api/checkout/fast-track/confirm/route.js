import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const resend = process.env.RESEND_API_KEY
    ? new Resend(process.env.RESEND_API_KEY)
    : null;

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'LaunchXact <hello@launchxact.com>';

export async function POST(request) {
    try {
        const body = await request.json();
        const { productName, email } = body;

        console.log(`[Fast-Track Confirm] Received payment confirmation for:`, { productName, email });

        if (!email && !productName) {
            return NextResponse.json({ error: 'Missing product or email' }, { status: 400 });
        }

        // 1. Update in waitlist_founders
        if (email) {
            try {
                // Try updating with dedicated columns
                const { error: updateErr } = await supabase
                    .from('waitlist_founders')
                    .update({ 
                        review_tier: 'fast_track',
                        fast_track_paid: true 
                    })
                    .eq('email', email);

                if (updateErr) {
                    console.warn('[Fast-Track Confirm] Updating metadata fallback:', updateErr.message);
                    // Fallback to metadata JSONB if columns not created yet
                    await supabase
                        .from('waitlist_founders')
                        .update({
                            metadata: {
                                review_tier: 'fast_track',
                                fast_track_paid: true,
                                paid_at: new Date().toISOString()
                            }
                        })
                        .eq('email', email);
                }
            } catch (e) {
                console.warn('[Fast-Track Confirm] Supabase update founder warning:', e.message);
            }
        }

        // 2. Also update products table if product exists
        if (productName) {
            try {
                await supabase
                    .from('products')
                    .update({ 
                        review_tier: 'fast_track',
                        fast_track_paid: true 
                    })
                    .ilike('name', productName);
            } catch (e) {
                console.warn('[Fast-Track Confirm] Product table update warning:', e.message);
            }
        }

        // 3. Send Fast-Track Receipt / Confirmation Email via Resend
        if (resend && email) {
            try {
                await resend.emails.send({
                    from: FROM_EMAIL,
                    to: email,
                    subject: `⚡ [CONFIRMED] 48-Hour Fast-Track Review Pass: ${productName}`,
                    html: `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #080c14; color: #f1f5f9; padding: 32px; border-radius: 12px; max-width: 560px; margin: 0 auto;">
    <h2 style="color: #ffffff; margin-bottom: 12px;">Fast-Track Review Pass Activated! ⚡</h2>
    <p style="color: #94a3b8; font-size: 15px; line-height: 1.6;">
        Your $99 Fast-Track Launch Pass for <strong>${productName}</strong> is confirmed.
    </p>
    <div style="background: #0f172a; border: 1px solid rgba(124, 58, 237, 0.3); border-radius: 10px; padding: 18px; margin: 20px 0;">
        <p style="margin: 0 0 8px; color: #a78bfa; font-weight: 700; text-transform: uppercase; font-size: 12px;">SLA Guarantee Active</p>
        <p style="margin: 0; color: #cbd5e1; font-size: 14px;">
            Our team has prioritized your submission at the top of the queue. You will receive your personalized 1-on-1 positioning teardown and editorial review within 48 business hours.
        </p>
    </div>
    <p style="color: #64748b; font-size: 13px; margin-top: 24px;">
        Questions? Reply directly to this email or reach us at hello@launchxact.com.<br/>
        <strong>Ravi Joshi</strong>, Founder — LaunchXact
    </p>
</div>`
                });
            } catch (mailErr) {
                console.warn('[Fast-Track Confirm] Resend send warning:', mailErr.message);
            }
        }

        return NextResponse.json({
            success: true,
            message: `Fast-Track 48-hour review pass confirmed for ${productName}!`
        });

    } catch (err) {
        console.error('[Fast-Track Confirm] Exception:', err);
        return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
    }
}
