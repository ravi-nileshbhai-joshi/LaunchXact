export const tools = [
    {
        id: '1',
        name: 'DevFlow',
        tagline: 'Automate your entire development workflow with AI.',
        category: 'Developer Tools',
        description: 'DevFlow helps you streamline your coding process by integrating AI directly into your IDE. Detect bugs, refactor code, and generate documentation on the fly.',
        price: '$19/mo',
        website: 'https://example.com/devflow',
        logoColor: '#6366f1'
    },
    {
        id: '2',
        name: 'Analytix',
        tagline: 'Privacy-focused analytics for modern SaaS.',
        category: 'Analytics',
        description: 'Simple, privacy-friendly analytics that gives you the insights you need without tracking your users personal data.',
        price: '$12/mo',
        website: 'https://example.com/analytix',
        logoColor: '#ec4899'
    },
    {
        id: '3',
        name: 'MailWiz',
        tagline: 'Beautiful email newsletters in minutes.',
        category: 'Marketing',
        description: 'Create stunning newsletters with our drag-and-drop editor. No coding required.',
        price: '$29/mo',
        website: 'https://example.com/mailwiz',
        logoColor: '#10b981'
    },
    {
        id: '4',
        name: 'TaskMastr',
        tagline: 'Project management for chaotic teams.',
        category: 'Productivity',
        description: 'Tame the chaos with TaskMastr. A new take on project management that adapts to how you work.',
        price: '$9/mo',
        website: 'https://example.com/taskmastr',
        logoColor: '#f59e0b'
    },
    {
        id: '5',
        name: 'DesignKit',
        tagline: 'Unlimited design assets for one flat fee.',
        category: 'Design',
        description: 'Access thousands of premium design assets including icons, illustrations, and templates.',
        price: '$49/mo',
        website: 'https://example.com/designkit',
        logoColor: '#8b5cf6'
    },
    {
        id: '6',
        name: 'Hostify',
        tagline: 'One-click deployment for static sites.',
        category: 'Hosting',
        description: 'Deploy your static sites in seconds with global CDN distribution.',
        price: 'Free',
        website: 'https://example.com/hostify',
        logoColor: '#3b82f6'
    }
];

export function getFeaturedTools() {
    return tools.slice(0, 3);
}

export function getNewLaunches() {
    return tools.slice(0, 6);
}

export function getAllTools() {
    return tools;
}

export function getToolById(id) {
    return tools.find(t => t.id === id);
}
