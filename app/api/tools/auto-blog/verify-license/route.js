import { NextResponse } from 'next/server';
import { verifyDodoLicenseKey, DODO_CHECKOUT_URL, DODO_PRODUCT_ID } from '@/lib/dodo';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export async function POST(request) {
    try {
        const body = await request.json();
        const { licenseKey, email = '', domain = '' } = body;

        if (!licenseKey || typeof licenseKey !== 'string') {
            return NextResponse.json({
                success: false,
                valid: false,
                error: 'Please enter your Dodo Payments Pro license key.'
            }, { status: 400 });
        }

        const verification = await verifyDodoLicenseKey(licenseKey, { email, domain });

        if (!verification.valid) {
            return NextResponse.json({
                success: false,
                valid: false,
                error: verification.error || 'Invalid license key. Only paid founders can unlock Pro Tier.',
                checkoutUrl: DODO_CHECKOUT_URL
            }, { status: 400 });
        }

        // License is valid! Persist to Supabase if configured
        const cleanEmail = email ? email.trim().toLowerCase() : `founder_${licenseKey.trim().slice(-6)}@dodo.user`;
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + (verification.daysRemaining || 365));

        if (supabase) {
            try {
                await supabase
                    .from('auto_blog_subscriptions')
                    .upsert([{
                        email: cleanEmail,
                        website_url: domain || null,
                        status: 'active',
                        plan: 'pro_license',
                        expires_at: expiresAt.toISOString(),
                        updated_at: new Date().toISOString()
                    }], { onConflict: 'email' });
            } catch (dbErr) {
                console.warn('Could not persist license to Supabase (non-fatal):', dbErr.message);
            }
        }

        return NextResponse.json({
            success: true,
            valid: true,
            plan: 'pro_license',
            licenseKey: verification.licenseKey,
            environment: verification.environment,
            productId: DODO_PRODUCT_ID,
            daysRemaining: verification.daysRemaining || 365,
            message: '🎉 Dodo Payments Pro License verified! Unlimited generation and direct publishing are now unlocked.'
        });

    } catch (err) {
        console.error('License verification route error:', err);
        return NextResponse.json({
            success: false,
            valid: false,
            error: 'Server error while verifying license key. Please try again.'
        }, { status: 500 });
    }
}
