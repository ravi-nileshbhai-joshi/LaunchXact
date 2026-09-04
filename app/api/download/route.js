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
        const fileKey = searchParams.get('file'); // 'quick-wins-guide' or 'founder-story'

        if (!fileKey || !['quick-wins-guide', 'founder-story'].includes(fileKey)) {
            return NextResponse.json({ error: 'Invalid file requested' }, { status: 400 });
        }

        const isAuthorized = await verifySession(sessionId);
        if (!isAuthorized) {
            return NextResponse.json({ error: 'Unauthorized: Invalid purchase session' }, { status: 403 });
        }

        // Map key to private filename
        const filename = `${fileKey}.pdf`;
        const filePath = path.join(process.cwd(), 'private-assets', 'startup-visibility-os', filename);

        if (!fs.existsSync(filePath)) {
            console.error(`Requested file not found in filesystem: ${filePath}`);
            return NextResponse.json({ error: 'File not found' }, { status: 404 });
        }

        // Read file binary
        const fileBuffer = fs.readFileSync(filePath);

        return new Response(fileBuffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="${filename}"`
            }
        });

    } catch (e) {
        console.error('Download API Exception:', e);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
