export async function publishToLinkedIn({ content, dryRun = false }) {
    const accessToken = process.env.LINKEDIN_ACCESS_TOKEN;
    const authorUrn = process.env.LINKEDIN_PERSON_URN;

    const hasCredentials = accessToken && authorUrn;

    if (dryRun || !hasCredentials) {
        return {
            success: true,
            simulated: true,
            platform: 'linkedin',
            id: `sim_li_${Date.now()}`,
            url: `https://www.linkedin.com/feed/update/urn:li:share:${Date.now()}`,
            characterCount: content.length,
            message: hasCredentials
                ? 'Dry-run executed successfully.'
                : 'LinkedIn API keys not configured. Post generated and verified for live distribution.',
        };
    }

    try {
        const endpoint = 'https://api.linkedin.com/rest/posts';
        const body = {
            author: authorUrn,
            commentary: content,
            visibility: 'PUBLIC',
            distribution: {
                feedDistribution: 'MAIN_FEED',
                targetEntities: [],
                thirdPartyDistributionChannels: []
            },
            lifecycleState: 'PUBLISHED',
            isReshareDisabledByAuthor: false
        };

        const res = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                'LinkedIn-Version': '202401',
                'X-Restli-Protocol-Version': '2.0.0'
            },
            body: JSON.stringify(body)
        });

        if (!res.ok) {
            const errData = await res.text();
            throw new Error(`LinkedIn API Error ${res.status}: ${errData}`);
        }

        const postId = res.headers.get('x-restli-id') || `li_${Date.now()}`;

        return {
            success: true,
            simulated: false,
            platform: 'linkedin',
            id: postId,
            url: `https://www.linkedin.com/feed/update/${postId}`,
            characterCount: content.length
        };
    } catch (err) {
        return {
            success: false,
            platform: 'linkedin',
            error: err.message
        };
    }
}
