const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const { TOOLS, ANGLES } = require('./config');

const LOCAL_HISTORY_DIR = path.join(__dirname, '..', '..', 'data', 'agent');
const LOCAL_HISTORY_FILE = path.join(LOCAL_HISTORY_DIR, 'distribution_history.json');

// Ensure local history directory exists
if (!fs.existsSync(LOCAL_HISTORY_DIR)) {
    fs.mkdirSync(LOCAL_HISTORY_DIR, { recursive: true });
}

// Ensure default empty history file exists
if (!fs.existsSync(LOCAL_HISTORY_FILE)) {
    fs.writeFileSync(LOCAL_HISTORY_FILE, JSON.stringify([], null, 2));
}

// Initialize Supabase client if available
let supabase = null;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (supabaseUrl && supabaseKey) {
    try {
        supabase = createClient(supabaseUrl, supabaseKey);
    } catch (e) {
        console.warn('⚠️ Supabase client init failed in memory store. Using local fallback.');
    }
}

/**
 * Load all recent distribution posts from Supabase or local JSON
 */
async function loadHistory(limit = 50) {
    let posts = [];

    // Attempt remote fetch from Supabase
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
        } catch (e) {
            // Silently fall back to local store
        }
    }

    // Local file fallback
    try {
        const raw = fs.readFileSync(LOCAL_HISTORY_FILE, 'utf8');
        posts = JSON.parse(raw);
    } catch (e) {
        posts = [];
    }

    return posts;
}

/**
 * Determine which tool to feature next in strict rotation
 */
async function getNextTool(forcedToolId = null) {
    if (forcedToolId) {
        const found = TOOLS.find(t => t.id === forcedToolId);
        if (found) return found;
    }

    const history = await loadHistory(30);

    // Calculate usage count and last used timestamp for each tool
    const toolStats = TOOLS.map(tool => {
        const toolPosts = history.filter(p => p.tool_id === tool.id);
        const lastPost = toolPosts[0]; // history is sorted newest first
        return {
            tool,
            count: toolPosts.length,
            lastUsed: lastPost ? new Date(lastPost.created_at).getTime() : 0,
        };
    });

    // Sort by count ascending, then by lastUsed ascending
    toolStats.sort((a, b) => {
        if (a.count !== b.count) return a.count - b.count;
        return a.lastUsed - b.lastUsed;
    });

    return toolStats[0].tool;
}

/**
 * Determine which narrative angle to use next in rotation for the chosen tool
 */
async function getNextAngle(toolId, forcedAngleId = null) {
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

    // Sort by least used for this tool
    angleStats.sort((a, b) => {
        if (a.count !== b.count) return a.count - b.count;
        return a.lastUsed - b.lastUsed;
    });

    return angleStats[0].angle;
}

/**
 * Extract recent hooks and titles to inject as negative constraints
 */
async function getNegativeConstraints(limit = 15) {
    const history = await loadHistory(limit);
    return history.map(p => ({
        hook: p.hook,
        tool: p.tool_id,
        platform: p.platform,
        angle: p.angle,
    }));
}

/**
 * Save a newly generated or published post to memory (Supabase + Local fallback)
 */
async function recordPost(postData) {
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

    // Save to local file
    try {
        let history = [];
        if (fs.existsSync(LOCAL_HISTORY_FILE)) {
            history = JSON.parse(fs.readFileSync(LOCAL_HISTORY_FILE, 'utf8'));
        }
        history.unshift(record);
        // Keep last 200 posts locally
        if (history.length > 200) history = history.slice(0, 200);
        fs.writeFileSync(LOCAL_HISTORY_FILE, JSON.stringify(history, null, 2));
    } catch (e) {
        console.error('Failed to save to local history:', e.message);
    }

    // Attempt save to Supabase
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
        } catch (e) {
            // Non-critical if offline
        }
    }

    return record;
}

module.exports = {
    loadHistory,
    getNextTool,
    getNextAngle,
    getNegativeConstraints,
    recordPost,
};
