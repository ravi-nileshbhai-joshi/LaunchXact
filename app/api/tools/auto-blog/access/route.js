import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { DODO_CHECKOUT_URL, verifyDodoLicenseKey } from '@/lib/dodo';

export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const licenseKey = searchParams.get('licenseKey') || searchParams.get('key');
    return checkAccess({ email, licenseKey });
}

export async function POST(request) {
    try {
        const body = await request.json();
        return checkAccess({ email: body.email, licenseKey: body.licenseKey || body.key });
    } catch {
        return NextResponse.json({ success: false, error: 'Invalid JSON' }, { status: 400 });
    }
}

async function checkAccess({ email, licenseKey }) {
    const dodoCheckoutUrl = process.env.NEXT_PUBLIC_CHECKOUT_URL_AUTO_BLOG || DODO_CHECKOUT_URL;

    // 1. Direct License Key verification if provided
    if (licenseKey && typeof licenseKey === 'string' && licenseKey.trim().length > 4) {
        const keyResult = await verifyDodoLicenseKey(licenseKey);
        if (keyResult.valid) {
            return NextResponse.json({
                success: true,
                entitled: true,
                plan: 'pro_license',
                status: 'active',
                daysRemaining: keyResult.daysRemaining || 365,
                licenseKey: keyResult.licenseKey,
                message: 'Active Dodo Payments Pro License validated.'
            });
        }
    }

    if (!email || !email.includes('@')) {
        return NextResponse.json({
            success: true,
            entitled: false,
            reason: 'no_email_or_license_provided',
            allowDemo: true,
            checkoutUrl: dodoCheckoutUrl,
        });
    }

    const cleanEmail = email.trim().toLowerCase();

    if (!supabase) {
        // Local simulation fallback
        return NextResponse.json({
            success: true,
            entitled: true,
            simulated: true,
            plan: 'fast_track_bonus',
            daysRemaining: 60,
            message: 'Local development mode: Full Fast-Track 2-month access unlocked.',
        });
    }

    try {
        // 1. Check existing active subscription in auto_blog_subscriptions
        const { data: subData } = await supabase
            .from('auto_blog_subscriptions')
            .select('*')
            .eq('email', cleanEmail)
            .maybeSingle();

        if (subData && (subData.status === 'active' || subData.status === 'fast_track_free')) {
            const expiresAt = new Date(subData.expires_at);
            const now = new Date();
            const daysRemaining = Math.max(0, Math.ceil((expiresAt - now) / (1000 * 60 * 60 * 24)));

            if (daysRemaining > 0) {
                return NextResponse.json({
                    success: true,
                    entitled: true,
                    plan: subData.plan,
                    status: subData.status,
                    expiresAt: subData.expires_at,
                    daysRemaining,
                    isFastTrackBonus: subData.plan === 'fast_track_bonus',
                    message: subData.plan === 'fast_track_bonus'
                        ? `Fast-Track VIP Access: ${daysRemaining} days remaining in your 2-month free grant.`
                        : `Active Subscription: ${daysRemaining} days remaining in current billing cycle.`
                });
            }
        }

        // 2. Check if founder paid for Fast-Track in waitlist_founders or products
        const { data: waitlistMatch } = await supabase
            .from('waitlist_founders')
            .select('email, fast_track_paid')
            .eq('email', cleanEmail)
            .eq('fast_track_paid', true)
            .maybeSingle();

        const { data: productMatch } = await supabase
            .from('products')
            .select('contact_email, fast_track_paid')
            .eq('contact_email', cleanEmail)
            .eq('fast_track_paid', true)
            .maybeSingle();

        const isFastTrackVerified = Boolean(waitlistMatch || productMatch);

        if (isFastTrackVerified) {
            // Activate 60-day promotional grant
            const grantExpiresAt = new Date();
            grantExpiresAt.setDate(grantExpiresAt.getDate() + 60);

            await supabase
                .from('auto_blog_subscriptions')
                .upsert([{
                    email: cleanEmail,
                    status: 'fast_track_free',
                    plan: 'fast_track_bonus',
                    fast_track_claimed_at: new Date().toISOString(),
                    expires_at: grantExpiresAt.toISOString(),
                }], { onConflict: 'email' });

            return NextResponse.json({
                success: true,
                entitled: true,
                plan: 'fast_track_bonus',
                status: 'fast_track_free',
                isFastTrackBonus: true,
                daysRemaining: 60,
                message: '🎉 Congratulations! Your Fast-Track Launch Pass qualifies you for 2 Months of Free Access ($158 Value). Unlocked!'
            });
        }

        // 3. Founder does not have active subscription or Fast-Track pass
        return NextResponse.json({
            success: true,
            entitled: false,
            plan: 'free_trial',
            allowDemo: true,
            checkoutUrl: dodoCheckoutUrl,
            message: 'You have 1 free trial generation remaining. Subscribe for $79/mo or get 2 months free with a Fast-Track Launch Pass!'
        });

    } catch (err) {
        console.error('Access check error:', err);
        return NextResponse.json({
            success: true,
            entitled: true, // Fail open so founders can test
            plan: 'trial',
            allowDemo: true,
            daysRemaining: 30
        });
    }
}
