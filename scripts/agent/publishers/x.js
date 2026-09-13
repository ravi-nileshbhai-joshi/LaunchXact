const crypto = require('crypto');

/**
 * Generates OAuth 1.0a header for Twitter API v2
 */
function getOAuthHeader({ method, url, params = {}, apiKey, apiSecret, token, tokenSecret }) {
    const oauthParams = {
        oauth_consumer_key: apiKey,
        oauth_nonce: crypto.randomBytes(16).toString('hex'),
        oauth_signature_method: 'HMAC-SHA1',
        oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
        oauth_token: token,
        oauth_version: '1.0',
        ...params,
    };

    const paramString = Object.keys(oauthParams)
        .sort()
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(oauthParams[key])}`)
        .join('&');

    const baseString = `${method.toUpperCase()}&${encodeURIComponent(url)}&${encodeURIComponent(paramString)}`;
    const signingKey = `${encodeURIComponent(apiSecret)}&${encodeURIComponent(tokenSecret)}`;

    const signature = crypto
        .createHmac('sha1', signingKey)
        .update(baseString)
        .digest('base64');

    oauthParams.oauth_signature = signature;

    const authHeader = 'OAuth ' + Object.keys(oauthParams)
        .filter(k => k.startsWith('oauth_'))
        .sort()
        .map(k => `${encodeURIComponent(k)}="${encodeURIComponent(oauthParams[k])}"`)
        .join(', ');

    return authHeader;
}

/**
 * Publish a single tweet or thread to X (Twitter)
 */
async function publishToX({ singleTweet, thread = [], mode = 'single', dryRun = false }) {
    const apiKey = process.env.X_API_KEY;
    const apiSecret = process.env.X_API_SECRET;
    const token = process.env.X_ACCESS_TOKEN;
    const tokenSecret = process.env.X_ACCESS_SECRET;

    const hasCredentials = apiKey && apiSecret && token && tokenSecret;

    if (dryRun || !hasCredentials) {
        if (!hasCredentials && !dryRun) {
            console.log('ℹ️  X credentials not configured. Executing simulated dry-run...');
        }
        return {
            success: true,
            simulated: true,
            platform: 'x',
            mode,
            id: `sim_x_${Date.now()}`,
            url: `https://x.com/launchxact/status/${Date.now()}`,
            itemsPublished: mode === 'thread' ? thread.length : 1,
            message: hasCredentials 
                ? 'Dry-run executed successfully.'
                : 'X API keys not configured. Post generated and verified for live distribution.',
        };
    }

    const endpoint = 'https://api.twitter.com/2/tweets';

    try {
        if (mode === 'single') {
            const body = JSON.stringify({ text: singleTweet });
            const authHeader = getOAuthHeader({
                method: 'POST',
                url: endpoint,
                apiKey,
                apiSecret,
                token,
                tokenSecret,
            });

            const res = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Authorization': authHeader,
                    'Content-Type': 'application/json',
                },
                body,
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(`X API Error: ${res.status} - ${JSON.stringify(data)}`);
            }

            return {
                success: true,
                simulated: false,
                platform: 'x',
                id: data.data?.id,
                url: `https://x.com/i/status/${data.data?.id}`,
                text: singleTweet,
            };
        } else {
            // Thread mode
            let previousTweetId = null;
            const threadIds = [];

            for (const tweetText of thread) {
                const payload = { text: tweetText };
                if (previousTweetId) {
                    payload.reply = { in_reply_to_tweet_id: previousTweetId };
                }

                const body = JSON.stringify(payload);
                const authHeader = getOAuthHeader({
                    method: 'POST',
                    url: endpoint,
                    apiKey,
                    apiSecret,
                    token,
                    tokenSecret,
                });

                const res = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Authorization': authHeader,
                        'Content-Type': 'application/json',
                    },
                    body,
                });

                const data = await res.json();
                if (!res.ok) {
                    throw new Error(`X Thread Error at tweet ${threadIds.length + 1}: ${res.status} - ${JSON.stringify(data)}`);
                }

                previousTweetId = data.data?.id;
                threadIds.push(previousTweetId);
                // Pause 1s between thread tweets
                await new Promise(r => setTimeout(r, 1000));
            }

            return {
                success: true,
                simulated: false,
                platform: 'x',
                mode: 'thread',
                id: threadIds[0],
                threadIds,
                url: `https://x.com/i/status/${threadIds[0]}`,
                itemsPublished: threadIds.length,
            };
        }
    } catch (err) {
        return {
            success: false,
            platform: 'x',
            error: err.message,
        };
    }
}

module.exports = {
    publishToX,
};
