import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Initialize Resend (will be null if API key is missing)
const resend = process.env.RESEND_API_KEY
    ? new Resend(process.env.RESEND_API_KEY)
    : null;

export async function POST(request) {
    try {
        const body = await request.json();
        const { type, data } = body; // type: 'founder' | 'buyer'

        console.log(`Received ${type} submission:`, data);

        let dbError;
        let table;

        // 1. Insert into Supabase
        if (type === 'founder') {
            table = 'waitlist_founders';
            const { error } = await supabase.from(table).insert([{
                // Map frontend fields to DB columns
                founder_name: data.founderName || 'Founder', // Default if missing
                product_name: data.productName,
                website_url: data.website,
                description: data.description,
                category: data.category,
                email: data.email,
                social_profile: data.social,
                utm_source: data.utmSource || null,
                utm_medium: data.utmMedium || null,
                utm_campaign: data.utmCampaign || null,
            }]);
            dbError = error;
        } else {
            table = 'waitlist_buyers';
            const { error } = await supabase.from(table).insert([{
                email: data.email,
                interests: data.interests
            }]);
            dbError = error;
        }

        if (dbError) {
            console.error('Supabase Error:', dbError);
            if (dbError.code === '23505') { // Unique violation
                return NextResponse.json({ error: 'This email is already on the list!' }, { status: 409 });
            }
            throw dbError;
        }

        // 2. Send Email via Resend
        if (resend) {
            try {
                const emailSubject = type === 'founder'
                    ? `Next steps for ${data.productName} on LaunchXact`
                    : "You’re on the LaunchXact early user list";

                const emailBody = type === 'founder'
                    ? `Hi ${data.founderName || 'Founder'},

Thanks for submitting ${data.productName} to the LaunchXact founder waitlist.

We are hand-picking a limited "Genesis Batch" of 40 high-quality SaaS tools for our official debut. Your product has successfully entered our review queue.

If selected, your product will receive:

Priority Placement: A featured spot in our launch-day collection.

Massive Distribution: Exposure to our 350k+ reach network across LinkedIn, X, and Reddit.

Early Adopter Traffic: Direct visibility to our growing waitlist of SaaS enthusiasts.

Want to boost your selection chances?
Founders who show early community interest move to the top of our review list. You can share your "Genesis" status here:

[Tweet this]: Just submitted ${data.productName} to the @LaunchXact Genesis Batch. Excited to be part of the first 40 curated SaaS tools launching soon! 🚀
(Or copy and paste text to share)

I’ll personally reach out once your product is approved and give you the specific date for your feature.

Keep building,

Ravi
Founder, LaunchXact
https://launchxact.com`
                    : `Hi there,

You’re now on the LaunchXact early adopter waitlist.

LaunchXact is a curated platform where you’ll be able to:
- Discover new SaaS tools
- Explore products built by real founders
- Get early access to useful software

We’re currently preparing the first launch collection, and you’ll be among the first to see it when we go live.

Thanks for joining early.

—
Ravi
Founder, LaunchXact
hello@launchxact.com`;

                // USING "onboarding@resend.dev" to ensure delivery if domain is not verified
                const { data: emailData, error: emailError } = await resend.emails.send({
                    from: 'LaunchXact <onboarding@resend.dev>',
                    to: data.email,
                    subject: emailSubject,
                    text: emailBody,
                });

                if (emailError) {
                    console.error('Resend Error:', emailError);
                } else {
                    console.log('Email sent successfully:', emailData);
                }
            } catch (emailError) {
                console.error('Resend Exception:', emailError);
            }
        } else {
            console.log('Resend API Key missing. Skipping email.');
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
