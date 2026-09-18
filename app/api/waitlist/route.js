import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Initialize Resend
const resend = process.env.RESEND_API_KEY
    ? new Resend(process.env.RESEND_API_KEY)
    : null;

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'LaunchXact <hello@launchxact.com>';

// Live Badge Validator: checks if website HTML contains LaunchXact backlink or badge asset
async function verifyBadgeOnWebsite(websiteUrl) {
    if (!websiteUrl) return false;
    let url = websiteUrl.trim();
    if (!/^https?:\/\//i.test(url)) url = `https://${url}`;
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);
        const res = await fetch(url, {
            signal: controller.signal,
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; LaunchXact-Badge-Validator/1.0; +https://launchxact.com)',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
            },
            redirect: 'follow'
        });
        clearTimeout(timeoutId);
        if (!res.ok) return false;
        const html = await res.text();
        const hasBacklink = /<a[^>]+href=["']https?:\/\/(?:www\.)?launchxact\.com[^\s"'>]*["'][^>]*>/i.test(html);
        const hasBadgeImg = /src=["'][^"']*(?:launchxact-badge\.svg|selected-genesis\.svg|launchxact\.com\/badges)[^"']*["']/i.test(html);
        const mentionsLaunchXact = /https?:\/\/(?:www\.)?launchxact\.com/i.test(html);
        return hasBacklink || hasBadgeImg || mentionsLaunchXact;
    } catch (e) {
        console.warn(`[Waitlist Badge Check] Exception for ${url}:`, e.message);
        return false;
    }
}

// Helper to generate a clean URL-friendly slug
function generateSlug(name) {
    if (!name) return `saas-${Math.random().toString(36).substring(2, 8)}`;
    const base = name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
    const hash = Math.random().toString(36).substring(2, 7);
    return `${base}-${hash}`;
}

// GET: Fetch recent waitlist products for homepage showcase
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '8', 10);

        const { data: products, error } = await supabase
            .from('products')
            .select('id, name, tagline, description, category, slug, status, batch_id, created_at, aeo_content')
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) {
            console.warn('Supabase products fetch error:', error.message);
            return NextResponse.json({ products: [] });
        }

        return NextResponse.json({ products: products || [] });
    } catch (err) {
        console.error('GET /api/waitlist error:', err);
        return NextResponse.json({ products: [] });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { type, data } = body; // type: 'founder' | 'buyer'

        console.log(`Received ${type} submission:`, data?.productName || data?.email);

        if (type === 'buyer') {
            const { error: buyerErr } = await supabase.from('waitlist_buyers').insert([{
                email: data.email,
                interests: data.interests || null
            }]);

            if (buyerErr) {
                if (buyerErr.code === '23505') {
                    return NextResponse.json({ error: 'This email is already on the early adopter list!' }, { status: 409 });
                }
                throw buyerErr;
            }

            // Send buyer confirmation
            if (resend) {
                try {
                    const buyerSubject = "You’re on the LaunchXact early user list 🎉";
                    const buyerText = `Hi there,\n\nYou’re now on the LaunchXact early adopter waitlist.\n\nLaunchXact is a curated space where you’ll discover new SaaS tools built by real founders before they go mainstream.\n\nThanks for joining early!\n\n— Ravi Joshi\nFounder, LaunchXact\nhello@launchxact.com\nhttps://launchxact.com`;
                    const buyerHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#080c14;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#e2e8f0;line-height:1.6;">
  <div style="max-width:540px;margin:30px auto;background:#0f172a;border-radius:16px;border:1px solid #1e293b;overflow:hidden;box-shadow:0 20px 40px rgba(0,0,0,0.4);">
    <div style="height:4px;background:linear-gradient(90deg,#6366f1,#a855f7);"></div>
    <div style="padding:32px;">
      <div style="font-size:20px;font-weight:800;color:#ffffff;margin-bottom:20px;">Launch<span style="color:#6366f1;">Xact</span></div>
      <h2 style="margin:0 0 14px;color:#ffffff;font-size:20px;font-weight:800;">You're on the early user list! 🎉</h2>
      <p style="color:#94a3b8;font-size:14.5px;line-height:1.6;margin:0 0 20px;">You’re officially on the LaunchXact early adopter list. You'll get exclusive first-look access to vetted SaaS products built by independent founders before they launch publicly.</p>
      <div style="margin:24px 0;padding:20px;background:#090d16;border-radius:12px;border:1px solid #1e293b;">
        <p style="margin:0 0 12px;font-size:13.5px;color:#cbd5e1;">In the meantime, test your own SaaS ideas with our free founder intelligence tools:</p>
        <a href="https://launchxact.com/grade" style="display:inline-block;background:#6366f1;color:#ffffff;text-decoration:none;padding:10px 20px;border-radius:8px;font-weight:700;font-size:13.5px;">Try AI SaaS Grader →</a>
      </div>
      <p style="margin:0;font-size:13.5px;color:#64748b;">Keep building,<br/><strong style="color:#cbd5e1;">Ravi Joshi</strong><br/>Founder, LaunchXact<br/>hello@launchxact.com</p>
    </div>
  </div>
</body>
</html>`;

                    const resendBuyerResult = await resend.emails.send({
                        from: FROM_EMAIL,
                        to: data.email,
                        subject: buyerSubject,
                        text: buyerText,
                        html: buyerHtml,
                    });

                    if (resendBuyerResult.error) {
                        console.error('❌ Resend buyer confirmation error:', resendBuyerResult.error);
                    } else {
                        console.log('✅ Buyer confirmation email sent! ID:', resendBuyerResult.data?.id);
                    }
                } catch (e) {
                    console.warn('Buyer resend error:', e.message);
                }
            }

            return NextResponse.json({ success: true });
        }

        // =========================================================================
        // FOUNDER SUBMISSION: Rich Founder Profile & Automated Dedicated Product Page
        // =========================================================================
        const productName = data.productName?.trim() || 'Untitled SaaS';
        const founderName = data.founderName?.trim() || 'Founder';
        const email = data.email?.trim();
        const website = data.website?.trim() || '';
        const description = data.description?.trim() || '';
        const stage = data.stage?.trim() || 'MVP';
        const monthlyRevenue = data.monthlyRevenue?.trim() || 'Pre-revenue ($0)';
        const biggestProblem = data.biggestProblem?.trim() || 'Distribution';
        const category = data.category?.trim() || 'B2B SaaS';
        const social = data.social?.trim() || '';
        const logoUrl = data.logoUrl?.trim() || data.logo?.trim() || '';
        const reviewTier = data.reviewTier === 'fast_track' || data.fastTrack ? 'fast_track' : 'standard';

        // Rich Metadata gathered from 3-Step Wizard & AI Autofill
        const useCases = data.useCases?.trim() || '';
        const targetCustomer = data.targetCustomer?.trim() || '';
        const pricing = data.pricing?.trim() || '';
        const keyFeatures = data.keyFeatures?.trim() || '';
        const founderStory = data.founderStory?.trim() || '';
        const source = data.source?.trim() || data.utmSource?.trim() || data.utm_source?.trim() || 'direct';

        if (!email) {
            return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
        }

        // =========================================================================
        // BADGE VERIFICATION CHECK (OPTIONAL / NON-BLOCKING)
        // Founding 50 has: No listing fee. No recurring fee. No mandatory backlink.
        // If a badge is detected on their site, we record badge_verified = true.
        // =========================================================================
        let badgeVerified = false;
        if (website) {
            try {
                badgeVerified = await verifyBadgeOnWebsite(website);
                if (badgeVerified) {
                    console.log(`[Waitlist API] ✅ Verified badge on ${website} for ${productName}!`);
                }
            } catch (bErr) {
                console.warn('[Waitlist API] Badge check skipped:', bErr.message);
            }
        }

        const slug = generateSlug(productName);

        // Synthesize rich AEO / showcase metadata
        const aeoContent = {
            tagline: description.length > 0 ? description.substring(0, 140) : `${productName} — modern SaaS built for ${category}`,
            description: description,
            problem_solved: founderStory || `${productName} tackles ${biggestProblem.toLowerCase()} challenges for modern teams by streamlining core workflows.`,
            target_audience: targetCustomer || `${category} teams, technical founders, and operators looking for high-efficiency tooling.`,
            stage: stage,
            monthly_revenue: monthlyRevenue,
            biggest_problem: biggestProblem,
            pricing_model: pricing || 'Free tier / freemium',
            founder_name: founderName,
            social_profile: social,
            website_url: website,
            logo_url: logoUrl,
            review_tier: reviewTier,
            badge_verified: badgeVerified,
            funnel_source: source,
            use_cases: useCases ? useCases.split(',').map(s => s.trim()).filter(Boolean) : [
                `Workflow automation for ${category}`,
                'High-performance productivity and efficiency'
            ],
            key_features: keyFeatures ? keyFeatures.split(',').map(s => s.trim()).filter(Boolean) : [
                `Built for ${category} workflows`,
                `Verified member of the LaunchXact Founding 50`,
                `Direct founder support and fast iteration cycles`
            ],
            founder_story: founderStory || '',
            faq: [
                {
                    q: `What is ${productName}?`,
                    a: description || `${productName} is an emerging ${category} product currently in the ${stage} stage.`
                },
                {
                    q: `Who is building ${productName}?`,
                    a: `Built by ${founderName} and submitted to the LaunchXact Founding 50.`
                },
                {
                    q: `Who is the ideal user for ${productName}?`,
                    a: targetCustomer || `Designed for technical operators, founders, and software teams.`
                },
                {
                    q: `What are the core use cases for ${productName}?`,
                    a: useCases || `Designed to streamline key ${category} workflows.`
                },
                {
                    q: `How is ${productName} priced?`,
                    a: pricing || `Free tier or flexible subscription plans available.`
                }
            ]
        };

        // 1. Insert into waitlist_founders
        let founderRowId = null;

        // Try inserting with new intelligence & monetization columns
        const fullFounderPayload = {
            founder_name: founderName,
            product_name: productName,
            website_url: website,
            logo_url: logoUrl || null,
            description: description,
            category: category,
            email: email,
            social_profile: social,
            stage: stage,
            monthly_revenue: monthlyRevenue,
            biggest_problem: biggestProblem,
            review_tier: reviewTier,
            badge_verified: badgeVerified,
            slug: slug,
            metadata: {
                stage,
                monthly_revenue: monthlyRevenue,
                biggest_problem: biggestProblem,
                logo_url: logoUrl,
                review_tier: reviewTier,
                badge_verified: badgeVerified,
                use_cases: useCases,
                target_customer: targetCustomer,
                pricing: pricing,
                key_features: keyFeatures,
                founder_story: founderStory,
                source: source,
                aeo: aeoContent
            },
            utm_source: source !== 'direct' ? source : (data.utmSource || null),
            utm_medium: data.utmMedium || null,
            utm_campaign: data.utmCampaign || null,
        };

        const { data: insertedFounder, error: fullInsertErr } = await supabase
            .from('waitlist_founders')
            .insert([fullFounderPayload])
            .select('id')
            .single();

        if (fullInsertErr) {
            console.warn('Extended columns insert warning (schema pending):', fullInsertErr.message);

            if (fullInsertErr.code === '23505') { // Unique violation
                return NextResponse.json({ error: 'This email is already registered on our founder waitlist!' }, { status: 409 });
            }

            // Fallback to baseline columns if table doesn't have the new columns yet
            const baselinePayload = {
                founder_name: founderName,
                product_name: productName,
                website_url: website,
                description: `[Stage: ${stage} | MRR: ${monthlyRevenue} | Bottleneck: ${biggestProblem} | Pricing: ${pricing || 'N/A'} | Target: ${targetCustomer || 'N/A'} | Source: ${source}] ${description}`,
                category: category,
                email: email,
                social_profile: social,
                utm_source: source !== 'direct' ? source : (data.utmSource || null),
                utm_medium: data.utmMedium || null,
                utm_campaign: data.utmCampaign || null,
            };

            const { data: baselineFounder, error: baseErr } = await supabase
                .from('waitlist_founders')
                .insert([baselinePayload])
                .select('id')
                .single();

            if (baseErr) {
                console.error('Base founder insert error:', baseErr);
                if (baseErr.code === '23505') {
                    return NextResponse.json({ error: 'This email is already on the list!' }, { status: 409 });
                }
                throw baseErr;
            }

            founderRowId = baselineFounder?.id;
        } else {
            founderRowId = insertedFounder?.id;
        }

        // Also stage/update in products table so the founder is ready for marketplace launch
        try {
            await supabase.from('products').upsert([{
                name: productName,
                website_url: website,
                logo_url: logoUrl || null,
                description: description,
                category: category,
                slug: slug,
                status: 'genesis_candidate',
                review_tier: reviewTier,
                badge_verified: badgeVerified,
                aeo_content: aeoContent
            }], { onConflict: 'slug', ignoreDuplicates: true });
        } catch (prodErr) {
            console.warn('Products upsert warning:', prodErr.message);
        }

        // 2. Send Application Confirmation Email via Resend
        let emailSent = false;
        let emailMessageId = null;

        if (resend) {
            try {
                const isFastTrack = reviewTier === 'fast_track';
                const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Just applied to the @LaunchXact Founding 50 with ${productName}! Excited to get a permanent place to be discovered. 🚀 https://launchxact.com`)}`;
                const emailSubject = `🚀 Application Received: ${productName} — LaunchXact Founding 50`;
                const emailBody = `Hi ${founderName},

Thanks for applying to the LaunchXact Founding 50 with ${productName}!

We're selecting the first 50 products for LaunchXact's founding collection. Every accepted product receives a free permanent listing, founder profile, category and use-case placement, and eligibility for future comparisons and discovery features.

No listing fee. No recurring fee. No mandatory backlink.

Application Summary:
- Product: ${productName}
- Stage: ${stage}
- Category: ${category}
${website ? `- Website: ${website}\n` : ''}
What happens next?
1. We review — A real person checks the product.
2. We prepare your listing — We turn your website information into a structured LaunchXact product page.
3. You approve it — You'll receive a preview before it goes live.
4. Your listing stays — Accepted products receive a permanent LaunchXact listing.

Founding 50 benefits:
✓ Free permanent listing
✓ Free editorial setup
✓ Founder profile
✓ Category placement
✓ Use-case placement
✓ Comparison eligibility
✓ Launch announcement
✓ LaunchXact analytics
✓ Founding-product badge

I'll personally review your submission and follow up with you.

Keep building,

Ravi Joshi
Founder, LaunchXact
hello@launchxact.com
https://launchxact.com`;

                const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${emailSubject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #080c14; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #e2e8f0; line-height: 1.6;">
  <div style="max-width: 600px; margin: 30px auto; background: #0f172a; border-radius: 16px; border: 1px solid #1e293b; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
    
    <!-- Top Accent Bar -->
    <div style="height: 4px; background: linear-gradient(90deg, #6366f1, #a855f7, #ec4899);"></div>

    <!-- Header -->
    <div style="padding: 32px 32px 24px; border-bottom: 1px solid #1e293b;">
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <span style="font-size: 20px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">Launch<span style="color: #6366f1;">Xact</span></span>
        <span style="background: rgba(99, 102, 241, 0.15); color: #818cf8; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 9999px; border: 1px solid rgba(99, 102, 241, 0.3); text-transform: uppercase; letter-spacing: 0.5px;">Founding 50</span>
      </div>
    </div>

    <!-- Body Content -->
    <div style="padding: 32px;">
      <h2 style="margin: 0 0 16px; font-size: 22px; font-weight: 800; color: #ffffff; line-height: 1.3;">
        Application Received, ${founderName}! 🚀
      </h2>
      <p style="margin: 0 0 24px; color: #94a3b8; font-size: 15px;">
        Thanks for submitting <strong style="color: #ffffff;">${productName}</strong>. Your application has been logged into our founder review queue.
      </p>

      <!-- Review Queue Status Banner -->
      <div style="background: linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(168, 85, 247, 0.08)); border: 1px solid rgba(99, 102, 241, 0.3); border-radius: 12px; padding: 18px 20px; margin-bottom: 26px;">
        <div style="font-size: 12px; font-weight: 700; color: #818cf8; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Status: In Curation Queue</div>
        <p style="margin: 0; font-size: 14px; color: #cbd5e1; line-height: 1.5;">
          Our team manually reviews every candidate for real utility, technical stability, and founder authenticity. Only 50 products will debut in the official Founding 50 cohort.
        </p>
      </div>

      <!-- Founder Profile Summary Card -->
      <div style="background: #090d16; border: 1px solid #1e293b; border-radius: 12px; padding: 18px 20px; margin-bottom: 28px;">
        <div style="font-size: 12px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px;">Submitted Application Details</div>
        <table style="width: 100%; border-collapse: collapse; font-size: 13.5px;">
          <tr>
            <td style="padding: 6px 0; color: #64748b; width: 40%;">Product:</td>
            <td style="padding: 6px 0; color: #f1f5f9; font-weight: 600;">${productName}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;">Stage:</td>
            <td style="padding: 6px 0; color: #f1f5f9; font-weight: 600;">${stage}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;">Monthly Revenue:</td>
            <td style="padding: 6px 0; color: #f1f5f9; font-weight: 600;">${monthlyRevenue}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;">Current Bottleneck:</td>
            <td style="padding: 6px 0; color: #f1f5f9; font-weight: 600;">${biggestProblem}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;">Category:</td>
            <td style="padding: 6px 0; color: #f1f5f9; font-weight: 600;">${category}</td>
          </tr>
          ${website ? `<tr><td style="padding: 6px 0; color: #64748b;">Website:</td><td style="padding: 6px 0; color: #f1f5f9; font-weight: 600;"><a href="${website}" style="color: #818cf8; text-decoration: none;">${website}</a></td></tr>` : ''}
        </table>
      </div>

      <!-- What to Expect -->
      <h3 style="margin: 0 0 12px; font-size: 16px; font-weight: 700; color: #ffffff;">What to expect next</h3>
      <p style="margin: 0 0 14px; font-size: 14px; color: #94a3b8;">
        We are hand-curating the initial cohort of 50 breakout SaaS products for the Founding 50 Launch. Selected builders receive:
      </p>
      <ul style="margin: 0 0 28px; padding-left: 20px; font-size: 14px; color: #cbd5e1; line-height: 1.8;">
        <li><strong style="color: #ffffff;">Priority Placement:</strong> Featured debut spot with permanent high-authority DoFollow backlink in The Vault.</li>
        <li><strong style="color: #ffffff;">100% Free Listing:</strong> We never charge founders to list products. Keep 100% of your revenue.</li>
        <li><strong style="color: #ffffff;">Hand-Curated Vetting:</strong> Every product is manually tested for market gap, alternatives, and real utility.</li>
        <li><strong style="color: #ffffff;">Early Adopter Discovery:</strong> Direct discoverability from active builders and high-intent software buyers.</li>
      </ul>

      <!-- Boost Selection Box -->
      <div style="background: rgba(30, 41, 59, 0.5); border: 1px dashed #334155; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 30px;">
        <div style="font-size: 14px; font-weight: 700; color: #ffffff; margin-bottom: 6px;">Want to move to the top of our review queue?</div>
        <p style="margin: 0 0 14px; font-size: 13px; color: #94a3b8;">
          Founders who share their Founding 50 status get prioritized fast-track review.
        </p>
        <a href="${tweetUrl}" target="_blank" style="display: inline-block; background: #1da1f2; color: #ffffff; text-decoration: none; padding: 9px 18px; border-radius: 8px; font-weight: 700; font-size: 13px;">
          Share on 𝕏 (+2x Priority Review) →
        </a>
      </div>

      <p style="margin: 0 0 6px; font-size: 14px; color: #94a3b8;">
        I'll personally review your application and follow up shortly.
      </p>
      <p style="margin: 0; font-size: 14px; color: #cbd5e1; font-weight: 600;">
        Keep building,<br/>
        <strong style="color: #ffffff;">Ravi Joshi</strong><br/>
        <span style="font-size: 13px; color: #64748b; font-weight: 400;">Founder, LaunchXact</span>
      </p>
    </div>

    <!-- Footer -->
    <div style="padding: 20px 32px; background: #090d16; border-top: 1px solid #1e293b; text-align: center; font-size: 12px; color: #64748b;">
      <p style="margin: 0 0 6px;">LaunchXact • The Curated Multi-Vendor SaaS Marketplace</p>
      <a href="https://launchxact.com" style="color: #6366f1; text-decoration: none; margin-right: 12px;">launchxact.com</a>
      <a href="https://x.com/Ravi_Nileshbhai" style="color: #6366f1; text-decoration: none;">@Ravi_Nileshbhai</a>
    </div>

  </div>
</body>
</html>
`;

                const resendResult = await resend.emails.send({
                    from: FROM_EMAIL,
                    to: email,
                    subject: emailSubject,
                    text: emailBody,
                    html: emailHtml,
                });

                if (resendResult.error) {
                    console.error('❌ Resend confirmation email error:', resendResult.error);
                } else {
                    emailSent = true;
                    emailMessageId = resendResult.data?.id;
                    console.log('✅ Resend confirmation email delivered! Message ID:', emailMessageId);
                }

                // =========================================================================
                // Admin Notification: Complete Founder & Product Dossier for Curation
                // =========================================================================
                try {
                    const adminRecipient = process.env.ADMIN_EMAIL || 'hello@launchxact.com';
                    const adminSubject = `🚨 New Founding 50 Application: ${productName} (${founderName})`;
                    const adminHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:24px;background:#080c14;color:#e2e8f0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:640px;margin:0 auto;background:#0f172a;border-radius:12px;border:1px solid #1e293b;padding:28px;">
    <div style="border-bottom:1px solid #1e293b;padding-bottom:14px;margin-bottom:20px;">
      <span style="font-size:20px;font-weight:800;color:#ffffff;">Launch<span style="color:#6366f1;">Xact</span> Curation Queue</span>
      <div style="display:inline-block;margin-left:12px;background:rgba(99,102,241,0.2);color:#818cf8;font-size:11px;font-weight:700;padding:3px 10px;border-radius:9999px;">NEW APPLICATION</div>
    </div>

    <h2 style="margin:0 0 16px;color:#ffffff;font-size:22px;font-weight:800;">${productName}</h2>
    
    <table style="width:100%;border-collapse:collapse;font-size:13.5px;line-height:1.6;margin-bottom:20px;">
      <tr><td style="padding:6px 0;color:#94a3b8;width:35%;"><strong>Founder Name:</strong></td><td style="padding:6px 0;color:#f8fafc;font-weight:600;">${founderName}</td></tr>
      <tr><td style="padding:6px 0;color:#94a3b8;"><strong>Founder Email:</strong></td><td style="padding:6px 0;"><a href="mailto:${email}" style="color:#818cf8;text-decoration:none;">${email}</a></td></tr>
      <tr><td style="padding:6px 0;color:#94a3b8;"><strong>Website:</strong></td><td style="padding:6px 0;"><a href="${website}" style="color:#818cf8;text-decoration:none;" target="_blank">${website}</a></td></tr>
      <tr><td style="padding:6px 0;color:#94a3b8;"><strong>Social / 𝕏:</strong></td><td style="padding:6px 0;color:#f8fafc;">${social || 'Not provided'}</td></tr>
      <tr><td style="padding:6px 0;color:#94a3b8;"><strong>Category:</strong></td><td style="padding:6px 0;color:#f8fafc;">${category}</td></tr>
      <tr><td style="padding:6px 0;color:#94a3b8;"><strong>Product Stage:</strong></td><td style="padding:6px 0;color:#f8fafc;">${stage}</td></tr>
      <tr><td style="padding:6px 0;color:#94a3b8;"><strong>Monthly Revenue:</strong></td><td style="padding:6px 0;color:#f8fafc;">${monthlyRevenue}</td></tr>
      <tr><td style="padding:6px 0;color:#94a3b8;"><strong>Current Bottleneck:</strong></td><td style="padding:6px 0;color:#f8fafc;">${biggestProblem}</td></tr>
      <tr><td style="padding:6px 0;color:#94a3b8;"><strong>Target Customer:</strong></td><td style="padding:6px 0;color:#f8fafc;">${targetCustomer || 'Not specified'}</td></tr>
      <tr><td style="padding:6px 0;color:#94a3b8;"><strong>Use Cases:</strong></td><td style="padding:6px 0;color:#f8fafc;">${useCases || 'Not specified'}</td></tr>
      <tr><td style="padding:6px 0;color:#94a3b8;"><strong>Key Features:</strong></td><td style="padding:6px 0;color:#f8fafc;">${keyFeatures || 'Not specified'}</td></tr>
      <tr><td style="padding:6px 0;color:#94a3b8;"><strong>Pricing Model:</strong></td><td style="padding:6px 0;color:#f8fafc;">${pricing || 'Not specified'}</td></tr>
      <tr><td style="padding:6px 0;color:#94a3b8;"><strong>Funnel Source:</strong></td><td style="padding:6px 0;color:#34d399;font-weight:700;">${source}</td></tr>
      <tr><td style="padding:6px 0;color:#94a3b8;"><strong>Badge Verified:</strong></td><td style="padding:6px 0;color:#f8fafc;">${badgeVerified ? '✅ Yes' : '❌ No'}</td></tr>
      <tr><td style="padding:6px 0;color:#94a3b8;"><strong>Generated Slug:</strong></td><td style="padding:6px 0;color:#94a3b8;">/products/${slug}</td></tr>
    </table>

    <div style="background:#090d16;border:1px solid #1e293b;border-radius:8px;padding:14px;margin-bottom:14px;">
      <div style="font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;margin-bottom:6px;">Product Description</div>
      <p style="margin:0;font-size:13.5px;color:#cbd5e1;line-height:1.5;">${description}</p>
    </div>

    ${founderStory ? `
    <div style="background:#090d16;border:1px solid #1e293b;border-radius:8px;padding:14px;margin-bottom:14px;">
      <div style="font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;margin-bottom:6px;">Founder Story / Why They Built It</div>
      <p style="margin:0;font-size:13.5px;color:#cbd5e1;line-height:1.5;">${founderStory}</p>
    </div>` : ''}

    <div style="margin-top:20px;text-align:center;">
      <a href="${website}" target="_blank" style="display:inline-block;background:#6366f1;color:#ffffff;text-decoration:none;padding:9px 18px;border-radius:8px;font-weight:700;font-size:13px;margin-right:10px;">Visit Founder Website →</a>
      <a href="mailto:${email}?subject=${encodeURIComponent(`Your LaunchXact Founding 50 Application: ${productName}`)}" style="display:inline-block;background:#1e293b;color:#ffffff;text-decoration:none;padding:9px 18px;border-radius:8px;font-weight:700;font-size:13px;">Reply to Founder</a>
    </div>
  </div>
</body>
</html>`;

                    await resend.emails.send({
                        from: FROM_EMAIL,
                        to: adminRecipient,
                        subject: adminSubject,
                        html: adminHtml,
                    });
                    console.log(`✅ Admin dossier email dispatched to: ${adminRecipient}`);
                } catch (adminErr) {
                    console.warn('⚠️ Admin notification email exception:', adminErr.message);
                }
            } catch (emailErr) {
                console.error('❌ Resend send exception:', emailErr.message);
            }
        }

        return NextResponse.json({
            success: true,
            message: `Successfully submitted ${productName} to the Founding 50 curation queue!`
        });

    } catch (error) {
        console.error('Waitlist API Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
