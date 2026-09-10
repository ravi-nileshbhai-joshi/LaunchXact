import { NextResponse } from 'next/server';

// Server-side badge verification scanner
export async function POST(request) {
    try {
        const body = await request.json();
        let website = (body.website || '').trim();

        if (!website) {
            return NextResponse.json({ 
                verified: false, 
                message: 'Please provide a valid website URL to verify.' 
            }, { status: 400 });
        }

        if (!/^https?:\/\//i.test(website)) {
            website = `https://${website}`;
        }

        let targetUrl;
        try {
            targetUrl = new URL(website);
        } catch {
            return NextResponse.json({ 
                verified: false, 
                message: 'Invalid website URL format.' 
            }, { status: 400 });
        }

        console.log(`[Badge Verifier] Scanning ${targetUrl.href} for LaunchXact backlink/badge...`);

        // Fetch the live landing page HTML
        let html = '';
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 9000);

            const res = await fetch(targetUrl.href, {
                signal: controller.signal,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (compatible; LaunchXact-Badge-Validator/1.0; +https://launchxact.com)',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
                },
                redirect: 'follow'
            });

            clearTimeout(timeoutId);

            if (!res.ok) {
                return NextResponse.json({
                    verified: false,
                    message: `Could not verify badge: Server returned HTTP ${res.status} (${res.statusText}). Please check that your website is online.`
                });
            }

            html = await res.text();
        } catch (fetchErr) {
            console.warn(`[Badge Verifier] Fetch failed for ${targetUrl.href}:`, fetchErr.message);
            return NextResponse.json({
                verified: false,
                message: `Could not reach ${targetUrl.hostname} (${fetchErr.name === 'AbortError' ? 'Connection timed out' : fetchErr.message}). Ensure your website is live and accessible.`
            });
        }

        // Verification criteria:
        // 1. Anchor link pointing to launchxact.com (e.g. href="https://launchxact.com" or "https://www.launchxact.com")
        // 2. Or LaunchXact badge image reference (launchxact-badge.svg or selected-genesis.svg)
        const hasBacklink = /<a[^>]+href=["']https?:\/\/(?:www\.)?launchxact\.com[^\s"'>]*["'][^>]*>/i.test(html);
        const hasBadgeImg = /src=["'][^"']*(?:launchxact-badge\.svg|selected-genesis\.svg|launchxact\.com\/badges)[^"']*["']/i.test(html);
        const mentionsLaunchXactLink = /https?:\/\/(?:www\.)?launchxact\.com/i.test(html);

        const isVerified = hasBacklink || hasBadgeImg || mentionsLaunchXactLink;

        if (isVerified) {
            console.log(`[Badge Verifier] ✅ Verified LaunchXact badge on ${targetUrl.href}!`);
            return NextResponse.json({
                verified: true,
                message: 'LaunchXact Genesis badge verified successfully on your website!',
                details: {
                    hasBacklink,
                    hasBadgeImg,
                    url: targetUrl.href
                }
            });
        } else {
            console.log(`[Badge Verifier] ❌ No LaunchXact badge detected on ${targetUrl.href}`);
            return NextResponse.json({
                verified: false,
                message: 'LaunchXact badge was not detected on your website footer. Please paste the embed snippet and try again, or upgrade to 48h Fast-Track ($99).'
            });
        }

    } catch (err) {
        console.error('[Badge Verifier] Unhandled Exception:', err);
        return NextResponse.json({ 
            verified: false, 
            error: err.message || 'Internal verification error' 
        }, { status: 500 });
    }
}
