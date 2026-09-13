import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { TOOLS, ANGLES } from './config';

const LOCAL_HISTORY_DIR = path.join(process.cwd(), 'data', 'agent');
const LOCAL_HISTORY_FILE = path.join(LOCAL_HISTORY_DIR, 'distribution_history.json');

function ensureLocalDir() {
    try {
        if (!fs.existsSync(LOCAL_HISTORY_DIR)) {
            fs.mkdirSync(LOCAL_HISTORY_DIR, { recursive: true });
        }
        if (!fs.existsSync(LOCAL_HISTORY_FILE)) {
            fs.writeFileSync(LOCAL_HISTORY_FILE, JSON.stringify([], null, 2));
        }
    } catch {
        // May be in read-only environment like Vercel Lambda, fail gracefully
    }
}

let supabase = null;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (supabaseUrl && supabaseKey) {
    try {
        supabase = createClient(supabaseUrl, supabaseKey);
    } catch (e) {
        console.warn('Supabase client init failed in memory store. Using local fallback.');
    }
}

export async function loadHistory(limit = 50) {
    if (supabase) {
        try {
            const { data, error } = await supabase
                .from('agent_distribution_posts')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(limit);

            if (!error && data && data.length > 0) {
                return data;
            }
        } catch {
            // Fallback to local
        }
    }

    try {
        ensureLocalDir();
        if (fs.existsSync(LOCAL_HISTORY_FILE)) {
            const raw = fs.readFileSync(LOCAL_HISTORY_FILE, 'utf8');
            return JSON.parse(raw);
        }
    } catch {
        return [];
    }

    return [];
}

export async function getNextTool(forcedToolId = null) {
    if (forcedToolId) {
        const found = TOOLS.find(t => t.id === forcedToolId);
        if (found) return found;
    }

    const history = await loadHistory(30);

    const toolStats = TOOLS.map(tool => {
        const toolPosts = history.filter(p => p.tool_id === tool.id);
        const lastPost = toolPosts[0];
        return {
            tool,
            count: toolPosts.length,
            lastUsed: lastPost ? new Date(lastPost.created_at).getTime() : 0,
        };
    });

    toolStats.sort((a, b) => {
        if (a.count !== b.count) return a.count - b.count;
        return a.lastUsed - b.lastUsed;
    });

    return toolStats[0].tool;
}

export async function getNextAngle(toolId, forcedAngleId = null) {
    if (forcedAngleId) {
        const found = ANGLES.find(a => a.id === forcedAngleId);
        if (found) return found;
    }

    const history = await loadHistory(30);
    const recentPostsForTool = history.filter(p => p.tool_id === toolId);

    const angleStats = ANGLES.map(angle => {
        const matching = recentPostsForTool.filter(p => p.angle === angle.id);
        const lastPost = matching[0];
        return {
            angle,
            count: matching.length,
            lastUsed: lastPost ? new Date(lastPost.created_at).getTime() : 0,
        };
    });

    angleStats.sort((a, b) => {
        if (a.count !== b.count) return a.count - b.count;
        return a.lastUsed - b.lastUsed;
    });

    return angleStats[0].angle;
}

export async function getNegativeConstraints(limit = 15) {
    const history = await loadHistory(limit);
    return history.map(p => ({
        hook: p.hook,
        tool: p.tool_id,
        platform: p.platform,
        angle: p.angle,
    }));
}

export async function recordPost(postData) {
    const record = {
        id: postData.id || `post_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        platform: postData.platform,
        tool_id: postData.tool_id,
        angle: postData.angle,
        hook: postData.hook,
        content: postData.content,
        thread_items: postData.thread_items || [],
        utm_url: postData.utm_url,
        status: postData.status || 'draft',
        external_post_id: postData.external_post_id || null,
        external_post_url: postData.external_post_url || null,
        error_message: postData.error_message || null,
        metrics: postData.metrics || {},
        created_at: new Date().toISOString(),
        published_at: postData.status === 'published' ? new Date().toISOString() : null,
    };

    try {
        ensureLocalDir();
        if (fs.existsSync(LOCAL_HISTORY_FILE)) {
            let history = JSON.parse(fs.readFileSync(LOCAL_HISTORY_FILE, 'utf8'));
            history.unshift(record);
            if (history.length > 200) history = history.slice(0, 200);
            fs.writeFileSync(LOCAL_HISTORY_FILE, JSON.stringify(history, null, 2));
        }
    } catch (e) {
        // Graceful fallback
    }

    if (supabase) {
        try {
            await supabase.from('agent_distribution_posts').insert([{
                platform: record.platform,
                tool_id: record.tool_id,
                angle: record.angle,
                hook: record.hook,
                content: record.content,
                thread_items: record.thread_items,
                utm_url: record.utm_url,
                status: record.status,
                external_post_id: record.external_post_id,
                external_post_url: record.external_post_url,
                error_message: record.error_message,
                metrics: record.metrics,
                published_at: record.published_at,
            }]);
        } catch {
            // Graceful fallback
        }
    }

    return record;
}
