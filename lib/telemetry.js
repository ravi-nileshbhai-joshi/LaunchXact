/**
 * Client-side helper to silently log tool runs to /api/tools/telemetry
 */
export function logToolTelemetry(data) {
    if (typeof window === 'undefined') return;
    try {
        fetch('/api/tools/telemetry', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
            // keepalive ensures the request finishes even if user navigates away
            keepalive: true,
        }).catch(() => {
            // Silently ignore telemetry failure on client
        });
    } catch {
        // Silently ignore
    }
}
