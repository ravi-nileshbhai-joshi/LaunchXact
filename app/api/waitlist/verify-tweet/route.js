import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(request) {
    try {
        const body = await request.json();
        const { email, productName, tweetUrl } = body;

        let rawUrl = (tweetUrl || '').trim();

        if (!rawUrl) {
            return NextResponse.json({ 
                verified: false, 
                message: 'Please provide a valid 𝕏 post URL.' 
            }, { status: 400 });
        }

        // Validate 𝕏 / Twitter post URL format
        const tweetUrlPattern = /^https?:\/\/(?:www\.)?(?:twitter\.com|x\.com)\/([a-zA-Z0-9_]+)\/status\/([0-9]+)/i;
        const match = rawUrl.match(tweetUrlPattern);

        if (!match) {
            return NextResponse.json({ 
                verified: false, 
                message: 'Invalid 𝕏 post link format. Example: https://x.com/username/status/123456789' 
            }, { status: 400 });
        }

        const authorHandle = match[1];
        const tweetId = match[2];
        const normalizedUrl = `https://x.com/${authorHandle}/status/${tweetId}`;

        console.log(`[Tweet Verifier] Checking post: ${normalizedUrl} for product: ${productName || email}`);

        // Fetch Twitter oEmbed JSON (free, no API key required)
        let oembedData;
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000);

            const oembedRes = await fetch(`https://publish.twitter.com/oembed?url=${encodeURIComponent(normalizedUrl)}`, {
                signal: controller.signal,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (compatible; LaunchXact-Tweet-Validator/1.0; +https://launchxact.com)'
                }
            });

            clearTimeout(timeoutId);

            if (!oembedRes.ok) {
                return NextResponse.json({
                    verified: false,
                    message: `Could not find this post on 𝕏 (Status ${oembedRes.status}). Please make sure the post is live, public, and not deleted.`
                });
            }

            oembedData = await oembedRes.json();
        } catch (fetchErr) {
            console.warn('[Tweet Verifier] oEmbed fetch failed:', fetchErr.message);
            return NextResponse.json({
                verified: false,
                message: `Unable to verify post with 𝕏 right now (${fetchErr.name === 'AbortError' ? 'Timeout' : fetchErr.message}). Please try again in a few moments.`
            });
        }

        // Verify that the tweet mentions LaunchXact
        const tweetHtml = (oembedData.html || '').toLowerCase();
        const mentionsLaunchXact = tweetHtml.includes('launchxact') || tweetHtml.includes('@launchxact');

        if (!mentionsLaunchXact) {
            return NextResponse.json({
                verified: false,
                message: 'Your 𝕏 post was found, but it does not tag @LaunchXact. Please make sure your tweet mentions @LaunchXact to qualify for +2x priority.'
            });
        }

        console.log(`[Tweet Verifier] ✅ Verified post by @${oembedData.author_name} for ${productName || email}!`);

        // Update Supabase records
        if (email) {
            try {
                // Try updating dedicated columns
                const { error: updateErr } = await supabase
                    .from('waitlist_founders')
                    .update({
                        tweet_url: normalizedUrl,
                        x_priority_boost: true
                    })
                    .eq('email', email);

                if (updateErr) {
                    // Fallback to metadata JSONB
                    await supabase
                        .from('waitlist_founders')
                        .update({
                            metadata: {
                                tweet_url: normalizedUrl,
                                x_priority_boost: true,
                                tweeted_at: new Date().toISOString()
                            }
                        })
                        .eq('email', email);
                }
            } catch (dbErr) {
                console.warn('[Tweet Verifier] Founder update warning:', dbErr.message);
            }
        }

        if (productName) {
            try {
                await supabase
                    .from('products')
                    .update({
                        tweet_url: normalizedUrl,
                        x_priority_boost: true
                    })
                    .ilike('name', productName);
            } catch (prodErr) {
                console.warn('[Tweet Verifier] Product update warning:', prodErr.message);
            }
        }

        return NextResponse.json({
            success: true,
            verified: true,
            authorName: oembedData.author_name,
            tweetUrl: normalizedUrl,
            message: '🎉 +2x Priority Boost Activated! Your 𝕏 post has been verified and linked to your application.'
        });

    } catch (err) {
        console.error('[Tweet Verifier] Exception:', err);
        return NextResponse.json({ 
            verified: false, 
            error: err.message || 'Internal verification error' 
        }, { status: 500 });
    }
}
