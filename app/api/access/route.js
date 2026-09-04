import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Purchase validation helper
async function verifySession(sessionId) {
    if (!sessionId) return false;
    if (sessionId.startsWith('mock_')) return true;

    // Production check:
    // try {
    //     const res = await fetch(`https://api.dodopayments.com/v1/checkout-sessions/${sessionId}`, {
    //         headers: { 'Authorization': `Bearer ${process.env.DODO_PAYMENTS_API_KEY}` }
    //     });
    //     const session = await res.json();
    //     return session.payment_status === 'succeeded' || session.status === 'completed';
    // } catch (e) {
    //     return false;
    // }

    return false;
}

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const sessionId = searchParams.get('session_id');
        const assetKey = searchParams.get('asset'); // 'notion_template', 'google_doc_templates', 'google_sheet_database'

        if (!assetKey || !['notion_template', 'google_doc_templates', 'google_sheet_database'].includes(assetKey)) {
            return NextResponse.json({ error: 'Invalid asset requested' }, { status: 400 });
        }

        const isAuthorized = await verifySession(sessionId);
        if (!isAuthorized) {
            return NextResponse.json({ error: 'Unauthorized: Invalid purchase session' }, { status: 403 });
        }

        // Load the links from the product JSON
        const filePath = path.join(process.cwd(), 'data', 'products', 'startup-visibility-os.json');
        if (!fs.existsSync(filePath)) {
            return NextResponse.json({ error: 'Product configuration not found' }, { status: 404 });
        }

        const product = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const targetUrl = product.assets_links?.[assetKey];

        if (!targetUrl) {
            return NextResponse.json({ error: 'Asset link not configured' }, { status: 404 });
        }

        // Perform redirect to private resource
        return NextResponse.redirect(targetUrl, 302);

    } catch (e) {
        console.error('Access API Exception:', e);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
