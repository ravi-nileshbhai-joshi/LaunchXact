export const metadata = {
    title: 'Acquisition Telemetry & Funnel Drop-off Breakdown | LaunchXact',
    description: 'Real-time telemetry and conversion drop-off analytics for LaunchXact founder tools. Track landing page views, tool completions, email captures, and Genesis applications.',
    robots: {
        index: false, // Internal analytics dashboard
        follow: false,
    },
};

export default function AnalyticsLayout({ children }) {
    return children;
}
