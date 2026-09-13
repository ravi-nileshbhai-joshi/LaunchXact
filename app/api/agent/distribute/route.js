import { NextResponse } from 'next/server';
import { getNextTool, getNextAngle, getNegativeConstraints, recordPost } from '@/lib/agent/memory';
import { generateDistributionContent } from '@/lib/agent/generator';
import { publishToX } from '@/lib/agent/publishers/x';
import { publishToLinkedIn } from '@/lib/agent/publishers/linkedin';
import { publishToIndieHackers } from '@/lib/agent/publishers/indiehackers';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Allow sufficient LLM reasoning time on Vercel

export async function GET(request) {
    return handleDistribution(request);
}

export async function POST(request) {
    return handleDistribution(request);
}

async function handleDistribution(request) {
    const { searchParams } = new URL(request.url);
    const cronSecret = process.env.AGENT_CRON_SECRET || process.env.CRON_SECRET;
    
    // Authorization Check: Check Bearer token or query param secret
    const authHeader = request.headers.get('authorization');
    const querySecret = searchParams.get('secret');
    const isLocal = process.env.NODE_ENV === 'development';

    if (cronSecret && !isLocal) {
        const token = authHeader ? authHeader.replace('Bearer ', '').trim() : querySecret;
        if (token !== cronSecret) {
            return NextResponse.json({ error: 'Unauthorized: Invalid distribution secret' }, { status: 401 });
        }
    }

    const isPreview = searchParams.get('preview') === 'true';
    const isDryRun = isPreview || searchParams.get('dryRun') === 'true';
    const targetPlatform = searchParams.get('platform') || 'all';
    const forcedToolId = searchParams.get('tool') || null;
    const forcedAngleId = searchParams.get('angle') || null;
    const xMode = searchParams.get('mode') || 'single';

    try {
        // 1. Tool selection via anti-repetition memory
        const tool = await getNextTool(forcedToolId);
        const angle = await getNextAngle(tool.id, forcedAngleId);
        const negativeConstraints = await getNegativeConstraints(12);

        // 2. Generate content
        const generated = await generateDistributionContent({
            tool,
            angle,
            negativeConstraints,
            author: 'Ravi',
        });

        const results = {
            success: true,
            timestamp: new Date().toISOString(),
            mode: isDryRun ? 'dry_run' : 'live',
            tool: {
                id: tool.id,
                title: tool.title,
                path: tool.path,
            },
            angle: {
                id: angle.id,
                name: angle.name,
            },
            hook: generated.hook,
            platforms: {},
        };

        // 3. Dispatch or simulate
        if (targetPlatform === 'all' || targetPlatform === 'x') {
            const xRes = await publishToX({
                singleTweet: generated.x.single,
                thread: generated.x.thread,
                mode: xMode,
                dryRun: isDryRun,
            });
            results.platforms.x = { ...xRes, preview: xMode === 'thread' ? generated.x.thread : generated.x.single };
            if (!isPreview) {
                await recordPost({
                    platform: 'x',
                    tool_id: tool.id,
                    angle: angle.id,
                    hook: generated.hook,
                    content: xMode === 'single' ? generated.x.single : generated.x.thread[0],
                    thread_items: xMode === 'thread' ? generated.x.thread : [],
                    utm_url: xRes.url || tool.path,
                    status: xRes.simulated ? 'scheduled' : (xRes.success ? 'published' : 'failed'),
                    external_post_id: xRes.id,
                    external_post_url: xRes.url,
                    error_message: xRes.error || null,
                });
            }
        }

        if (targetPlatform === 'all' || targetPlatform === 'linkedin') {
            const liRes = await publishToLinkedIn({
                content: generated.linkedin.content,
                dryRun: isDryRun,
            });
            results.platforms.linkedin = { ...liRes, preview: generated.linkedin.content };
            if (!isPreview) {
                await recordPost({
                    platform: 'linkedin',
                    tool_id: tool.id,
                    angle: angle.id,
                    hook: generated.hook,
                    content: generated.linkedin.content,
                    utm_url: liRes.url || tool.path,
                    status: liRes.simulated ? 'scheduled' : (liRes.success ? 'published' : 'failed'),
                    external_post_id: liRes.id,
                    external_post_url: liRes.url,
                    error_message: liRes.error || null,
                });
            }
        }

        if (targetPlatform === 'all' || targetPlatform === 'indiehackers') {
            const ihRes = await publishToIndieHackers({
                title: generated.indiehackers.title,
                content: generated.indiehackers.content,
                toolId: tool.id,
                dryRun: isDryRun,
            });
            results.platforms.indiehackers = { ...ihRes, preview: generated.indiehackers };
            if (!isPreview) {
                await recordPost({
                    platform: 'indiehackers',
                    tool_id: tool.id,
                    angle: angle.id,
                    hook: generated.indiehackers.title,
                    content: generated.indiehackers.content,
                    utm_url: tool.path,
                    status: ihRes.simulated ? 'scheduled' : (ihRes.success ? 'published' : 'failed'),
                    external_post_id: ihRes.id,
                    external_post_url: ihRes.savedPath,
                    error_message: ihRes.error || null,
                });
            }
        }

        return NextResponse.json(results);
    } catch (err) {
        console.error('Agent distribution API error:', err);
        return NextResponse.json(
            { success: false, error: err.message },
            { status: 500 }
        );
    }
}
