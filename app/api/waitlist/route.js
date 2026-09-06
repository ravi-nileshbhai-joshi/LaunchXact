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

        if (!email) {
            return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
        }

        const slug = generateSlug(productName);

        // Synthesize rich AEO / showcase metadata
        const aeoContent = {
            tagline: description.length > 0 ? description.substring(0, 140) : `${productName} — modern SaaS built for ${category}`,
            problem_solved: `${productName} tackles ${biggestProblem.toLowerCase()} challenges for modern teams by streamlining core workflows.`,
            target_audience: `${category} teams, technical founders, and operators looking for high-efficiency tooling.`,
            stage: stage,
            monthly_revenue: monthlyRevenue,
            biggest_problem: biggestProblem,
            founder_name: founderName,
            social_profile: social,
            website_url: website,
            key_features: [
                `Built for ${category} workflows`,
                `Verified member of the LaunchXact Genesis Batch`,
                `Direct founder support and fast iteration cycles`
            ],
            faq: [
                {
                    q: `What is ${productName}?`,
                    a: `${productName} is an emerging ${category} product currently in the ${stage} stage.`
                },
                {
                    q: `Who is building ${productName}?`,
                    a: `Built by ${founderName} and submitted to the LaunchXact Genesis Batch.`
                }
            ]
        };

        // 1. Insert into waitlist_founders
        let founderRowId = null;

        // Try inserting with new intelligence columns
        const fullFounderPayload = {
            founder_name: founderName,
            product_name: productName,
            website_url: website,
            description: description,
            category: category,
            email: email,
            social_profile: social,
            stage: stage,
            monthly_revenue: monthlyRevenue,
            biggest_problem: biggestProblem,
            slug: slug,
            metadata: {
                stage,
                monthly_revenue: monthlyRevenue,
                biggest_problem: biggestProblem,
                aeo: aeoContent
            },
            utm_source: data.utmSource || null,
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
                description: `[Stage: ${stage} | MRR: ${monthlyRevenue} | Bottleneck: ${biggestProblem}] ${description}`,
                category: category,
                email: email,
                social_profile: social,
                utm_source: data.utmSource || null,
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

        // 2. Send Application Confirmation Email via Resend
        let emailSent = false;
        let emailMessageId = null;

        if (resend) {
            try {
                const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Just applied to the @LaunchXact Genesis Batch with ${productName}! Excited to launch in a curated SaaS marketplace. 🚀 https://launchxact.com`)}`;
                const emailSubject = `🚀 Application Received: ${productName} — LaunchXact Genesis Batch`;
                const emailBody = `Hi ${founderName},

Thanks for submitting ${productName} to the LaunchXact Genesis Batch!

Your application has been logged into our founder review queue.

Application Summary:
- Product: ${productName}
- Stage: ${stage}
- Monthly Revenue: ${monthlyRevenue}
- Core Bottleneck: ${biggestProblem}
- Category: ${category}
${website ? `- Website: ${website}\n` : ''}
How Our Curation Review Works:
We are hand-curating an initial cohort of 40 breakout SaaS products for our official launch batch. To protect buyers and ensure high value, every submission is reviewed for technical stability, problem clarity, and founder authenticity.

If selected for the Genesis cohort, your product will receive:
1. Priority Placement: Featured spot on launch day with permanent high-authority DoFollow backlink.
2. 0% Platform Fees: 90 days of zero commission on all marketplace transactions.
3. Direct Distribution: Push to our 350k+ founder network across LinkedIn, X, and Reddit.
4. Early Adopter Feedback: Direct visibility and user testing from active tech buyers.

Want to boost your review ranking?
Founders who share their Genesis application move to the top of our review queue:

Share on 𝕏 (+2x Priority Review):
${tweetUrl}

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
        <span style="background: rgba(99, 102, 241, 0.15); color: #818cf8; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 9999px; border: 1px solid rgba(99, 102, 241, 0.3); text-transform: uppercase; letter-spacing: 0.5px;">Genesis Batch</span>
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
          Our team manually reviews every candidate for real utility, technical stability, and founder authenticity. Only 40 products will debut in the official Genesis cohort.
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
        We are hand-curating the initial cohort of 40 breakout SaaS products for the Genesis Launch. Selected builders receive:
      </p>
      <ul style="margin: 0 0 28px; padding-left: 20px; font-size: 14px; color: #cbd5e1; line-height: 1.8;">
        <li><strong style="color: #ffffff;">Priority Placement:</strong> Featured debut spot with permanent high-authority DoFollow backlink.</li>
        <li><strong style="color: #ffffff;">0% Platform Fees:</strong> 90 days zero-fee transactions on the marketplace.</li>
        <li><strong style="color: #ffffff;">Distribution Push:</strong> Exposure across our 350k+ founder network on LinkedIn, 𝕏, and Reddit.</li>
        <li><strong style="color: #ffffff;">Early Adopter Influx:</strong> Immediate feedback from high-intent tech buyers.</li>
      </ul>

      <!-- Boost Selection Box -->
      <div style="background: rgba(30, 41, 59, 0.5); border: 1px dashed #334155; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 30px;">
        <div style="font-size: 14px; font-weight: 700; color: #ffffff; margin-bottom: 6px;">Want to move to the top of our review queue?</div>
        <p style="margin: 0 0 14px; font-size: 13px; color: #94a3b8;">
          Founders who share their Genesis status get prioritized fast-track review.
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
            } catch (emailErr) {
                console.error('❌ Resend send exception:', emailErr.message);
            }
        }

        return NextResponse.json({
            success: true,
            message: `Successfully submitted ${productName} to the Genesis Batch review queue!`
        });

    } catch (error) {
        console.error('Waitlist API Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
