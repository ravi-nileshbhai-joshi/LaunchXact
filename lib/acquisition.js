/**
 * LaunchXact Acquisition & Attribution Engine
 * 
 * Manages visitor sessions, persistent UTM attribution (first-touch & last-touch),
 * dynamic referral link generation, and 8-stage funnel telemetry dispatch.
 */

// Supported 8-Stage Funnel Events
export const ACQUISITION_EVENTS = {
    LANDING_PAGE_VIEW: 'landing_page_view',
    TOOL_STARTED: 'tool_started',
    TOOL_COMPLETED: 'tool_completed',
    RESULT_VIEWED: 'result_viewed',
    RESULT_SHARED: 'result_shared',
    EMAIL_SUBMITTED: 'email_submitted',
    WAITLIST_JOINED: 'waitlist_joined',
    GENESIS_APPLICATION: 'genesis_application',
};

/**
 * Get or create a persistent anonymous session ID.
 */
export function getSessionId() {
    if (typeof window === 'undefined') return 'server_session';
    try {
        let sid = localStorage.getItem('lx_session_id');
        if (!sid) {
            sid = 'lx_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
            localStorage.setItem('lx_session_id', sid);
            // Also store in cookie for cross-subdomain / server compatibility
            document.cookie = `lx_sid=${sid};path=/;max-age=${60 * 60 * 24 * 365};SameSite=Lax`;
        }
        return sid;
    } catch {
        return 'fallback_session';
    }
}

/**
 * Get or generate a personalized referral code for the visitor.
 */
export function getReferralCode() {
    if (typeof window === 'undefined') return 'founder';
    try {
        let ref = localStorage.getItem('lx_my_ref_code');
        if (!ref) {
            ref = 'lx' + Math.random().toString(36).substring(2, 8);
            localStorage.setItem('lx_my_ref_code', ref);
        }
        return ref;
    } catch {
        return 'founder';
    }
}

/**
 * Parse current URL query and capture UTM parameters and referral codes.
 * Implements 30-day attribution with first-touch and last-touch preservation.
 */
export function captureAttribution() {
    if (typeof window === 'undefined') return {};
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const utmSource = urlParams.get('utm_source');
        const utmMedium = urlParams.get('utm_medium');
        const utmCampaign = urlParams.get('utm_campaign');
        const utmContent = urlParams.get('utm_content');
        const utmTerm = urlParams.get('utm_term');
        const refCode = urlParams.get('ref');

        const currentAttribution = {
            utm_source: utmSource || null,
            utm_medium: utmMedium || null,
            utm_campaign: utmCampaign || null,
            utm_content: utmContent || null,
            utm_term: utmTerm || null,
            ref_code: refCode || null,
            referrer: document.referrer || null,
            captured_at: new Date().toISOString()
        };

        // If any parameter is present in current URL, save as last-touch
        if (utmSource || utmCampaign || refCode) {
            localStorage.setItem('lx_attribution_last', JSON.stringify(currentAttribution));
        }

        // If first-touch does not exist, initialize it
        if (!localStorage.getItem('lx_attribution_first')) {
            localStorage.setItem('lx_attribution_first', JSON.stringify(currentAttribution));
        }

        return currentAttribution;
    } catch {
        return {};
    }
}

/**
 * Retrieve the active attribution profile (last-touch preferred, falling back to first-touch).
 */
export function getActiveAttribution() {
    if (typeof window === 'undefined') return {};
    try {
        // Ensure fresh query parameters are captured
        captureAttribution();

        const last = localStorage.getItem('lx_attribution_last');
        if (last) {
            const parsed = JSON.parse(last);
            if (parsed.utm_source || parsed.ref_code) return parsed;
        }

        const first = localStorage.getItem('lx_attribution_first');
        if (first) {
            return JSON.parse(first);
        }
    } catch {
        // Fall back gracefully
    }
    return {};
}

/**
 * Generate a viral referral URL with the visitor's unique referral tag and tracking params.
 * 
 * @param {string} baseUrl - e.g. "https://www.launchxact.com/tools/true-cost-of-payments"
 * @param {string} platform - e.g. "x", "reddit", "linkedin", "copy"
 */
export function buildReferralUrl(baseUrl, platform = 'share') {
    const cleanUrl = baseUrl.split('?')[0];
    const myRef = getReferralCode();
    return `${cleanUrl}?ref=${myRef}&utm_source=${encodeURIComponent(platform)}&utm_medium=viral_share&utm_campaign=tool_referral`;
}

// In-memory set to prevent duplicate event spam within the same page session
const dispatchedEvents = new Set();

/**
 * Dispatches an acquisition telemetry event to /api/analytics/track.
 * Uses navigator.sendBeacon with fetch keepalive fallback.
 * 
 * @param {string} eventName - One of ACQUISITION_EVENTS
 * @param {object} options - { toolId: string, metadata?: object, once?: boolean }
 */
export function trackAcquisitionEvent(eventName, { toolId, metadata = {}, once = false } = {}) {
    if (typeof window === 'undefined') return;
    if (!toolId) {
        console.warn('[Acquisition Telemetry] Missing toolId for event:', eventName);
        return;
    }

    const eventKey = `${toolId}_${eventName}`;
    if (once && dispatchedEvents.has(eventKey)) {
        return; // Prevent multiple dispatches (e.g. repeated scroll triggers)
    }

    try {
        const sessionId = getSessionId();
        const attribution = getActiveAttribution();

        const payload = {
            sessionId,
            toolId,
            eventName,
            utmSource: attribution.utm_source || null,
            utmMedium: attribution.utm_medium || null,
            utmCampaign: attribution.utm_campaign || null,
            utmContent: attribution.utm_content || null,
            utmTerm: attribution.utm_term || null,
            refCode: attribution.ref_code || null,
            referrer: attribution.referrer || (typeof document !== 'undefined' ? document.referrer : null),
            metadata: metadata || {},
            timestamp: new Date().toISOString()
        };

        dispatchedEvents.add(eventKey);

        const url = '/api/analytics/track';
        const body = JSON.stringify(payload);

        // Prefer sendBeacon for non-blocking reliability on navigation
        if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
            const blob = new Blob([body], { type: 'application/json' });
            const success = navigator.sendBeacon(url, blob);
            if (success) return;
        }

        // Fallback to fetch with keepalive
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body,
            keepalive: true,
        }).catch(() => {
            // Silently handle offline/failure on client
        });
    } catch (err) {
        console.warn('[Acquisition Telemetry Warning]:', err.message);
    }
}
