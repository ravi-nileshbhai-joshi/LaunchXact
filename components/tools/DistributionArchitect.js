'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import styles from './DistributionArchitect.module.css';

const CATEGORIES = [
    {
        id: 'devtool',
        name: 'DevTool & Infra',
        icon: '🛠️',
        desc: 'APIs, CLI tools, developer frameworks, backend infra',
    },
    {
        id: 'b2b_saas',
        name: 'B2B & Workflow',
        icon: '💼',
        desc: 'Productivity, CRM, billing, ops & automation',
    },
    {
        id: 'ai_micro',
        name: 'AI & Micro-SaaS',
        icon: '🤖',
        desc: 'AI wrappers, copilot agents, autonomous workflows',
    },
    {
        id: 'creator_consumer',
        name: 'Creator & Consumer',
        icon: '🎨',
        desc: 'Content creation, newsletters, consumer utilities',
    },
];

const STAGES = [
    {
        id: 'ideation',
        name: 'Ideation & Wireframe',
        desc: 'Validating pain point before writing full code',
        timeframe: 'D-30+ Kickoff',
    },
    {
        id: 'building',
        name: 'Building / Alpha',
        desc: 'Core features ready, need initial testers',
        timeframe: 'D-14 Countdown',
    },
    {
        id: 'beta',
        name: 'Public Beta / Launch-Ready',
        desc: 'Polished MVP ready for paying users & public influx',
        timeframe: 'D-7 to Launch Day',
    },
];

const TIMELINE_DATA = {
    devtool: {
        d30: {
            title: 'Shadow Community Seeding & Developer Pain Mining',
            timeEstimate: '4-6 hrs/week',
            channels: [
                {
                    name: 'Target Reddit Nodes',
                    icon: '👾',
                    target: 'Identify top recurring complaints about current tooling',
                    tags: ['r/webdev', 'r/selfhosted', 'r/devops', 'r/golang', 'r/reactjs']
                },
                {
                    name: 'GitHub Issue Infiltration',
                    icon: '🐙',
                    target: 'Find unmerged feature requests & pain points in open-source competitor repos',
                    tags: ['Closed issues', 'Feature requests', 'Discussions']
                },
                {
                    name: 'Niche Developer Discords',
                    icon: '💬',
                    target: 'Join builder-heavy developer servers without pitching upfront',
                    tags: ['Next.js Discord', 'Supabase Server', 'ThePrimeagen Discord']
                }
            ],
            tasks: [
                { id: 'd30_1', title: 'Bookmark 10 unresolved GitHub issues complaining about existing competitor limitations.' },
                { id: 'd30_2', title: 'Engage constructively in 5 Reddit threads answering debugging questions without dropping any links.' },
                { id: 'd30_3', title: 'Set up an unlisted Loom demo showing the 10-second "Aha!" moment solving the exact pain.' }
            ],
            hook: `Anyone else frustrated by [Competitor]'s recent API rate limits?

I spent the weekend analyzing why their latency spikes during high traffic. Here is the benchmark breakdown:

[Include 1 diagram/code snippet]

Working on an open alternative that caches queries at the edge. If you want early CLI access, drop your stack below.`
        },
        d14: {
            title: 'Build-in-Public Hook Drops & Alpha Waitlist',
            timeEstimate: '6-8 hrs/week',
            channels: [
                {
                    name: 'X / Tech Twitter',
                    icon: '🐦',
                    target: 'Share raw benchmark comparisons, architecture diagrams, and CLI terminal GIFs',
                    tags: ['#buildinpublic', '#devs', '#indiehackers']
                },
                {
                    name: 'Lobste.rs & Hacker News',
                    icon: '⚡',
                    target: 'Publish technical deep-dives or post-mortems on engineering architecture',
                    tags: ['Show HN preview', 'Engineering blogs']
                }
            ],
            tasks: [
                { id: 'd14_1', title: 'Publish high-contrast terminal demo GIF on X showing 1-command installation.' },
                { id: 'd14_2', title: 'Launch minimalist waitlist landing page with developer-friendly docs and quick start guide.' },
                { id: 'd14_3', title: 'Personally invite 15 engineers who complained in original Reddit threads to test alpha.' }
            ],
            hook: `Most developers spend 4 hours configuring [X] every time they start a project.

Here is how we reduced setup time to a single CLI command:

$ npx create-[tool]-app@latest

No config files. No nested YAML. Zero bloated dependencies.
Early alpha waitlist is now live for first 50 developers.`
        },
        d7: {
            title: 'VIP Beta Activation & Warm Launch Prep',
            timeEstimate: '8-10 hrs/week',
            channels: [
                {
                    name: 'Direct 1-on-1 DM Outreach',
                    icon: '✉️',
                    target: 'Direct messages to developers who liked or commented on your alpha posts',
                    tags: ['Personalized Loom', 'Direct Slack/Discord']
                },
                {
                    name: 'Launch Board Assets',
                    icon: '📦',
                    target: 'Prep Show HN title, GitHub README badges, and LaunchXact submission profile',
                    tags: ['Show HN checklist', 'GitHub Release']
                }
            ],
            tasks: [
                { id: 'd7_1', title: 'Send 25 personalized Loom recordings (under 60s) to high-intent engineers.' },
                { id: 'd7_2', title: 'Draft Show HN submission using strictly factual, no-marketing technical prose.' },
                { id: 'd7_3', title: 'Audit README for instant copy-pasteable curl command and zero prerequisite friction.' }
            ],
            hook: `Show HN: [Tool Name] – Open-source [functionality] built in Rust with zero runtime dependencies

Hey HN, we got tired of [Pain Point] when deploying microservices. Existing tools required [Overhead].

We built this lightweight engine:
- Benchmarks: 4x faster throughput
- Self-hostable via Docker Compose in 30 seconds
- MIT licensed

Live demo and repo link below. Would love harsh feedback on our caching strategy.`
        },
        launch: {
            title: 'Launch Day: Multi-Channel Coordinated Surge',
            timeEstimate: 'Full Day (8-12 hrs)',
            channels: [
                {
                    name: 'Hacker News (Show HN)',
                    icon: '🟠',
                    target: 'Post at 06:30 AM PST / 09:30 AM EST for peak weekday developer volume',
                    tags: ['Show HN', 'Real-time comment answers']
                },
                {
                    name: 'LaunchXact Curated SaaS Hub',
                    icon: '🚀',
                    target: 'Showcase verified tool listing for sustained enterprise buyer traction',
                    tags: ['Batch Launch', 'The Vault']
                },
                {
                    name: 'Subreddit Showcases',
                    icon: '👾',
                    target: 'Post transparent developer stories to r/SideProject and r/webdev',
                    tags: ['Technical architecture', 'No marketing fluff']
                }
            ],
            tasks: [
                { id: 'dl_1', title: 'Post Show HN prompt and stay in the comment thread for 6 consecutive hours answering technical questions.' },
                { id: 'dl_2', title: 'Publish detailed X launch thread with 5-part breakdown of architecture & benchmark graphs.' },
                { id: 'dl_3', title: 'Submit release to LaunchXact curated batch for long-term SEO/AEO indexation.' }
            ],
            hook: `Today we are publicly launching [Tool Name] 🚀

We spent 6 months rebuilding [Architecture] from scratch.
Here is the raw data, the biggest mistakes we made, and why we made it free for individual developers:

[Link to Live Product]

Thread on what we learned below 👇`
        },
        dplus7: {
            title: 'Sustained Flywheel & SEO Indexation',
            timeEstimate: '3-5 hrs/week',
            channels: [
                {
                    name: 'GitHub Trending & Awesome Lists',
                    icon: '⭐',
                    target: 'Submit PRs to relevant awesome-lists and encourage GitHub stars',
                    tags: ['awesome-dev', 'PR submission']
                },
                {
                    name: 'Technical Case Studies',
                    icon: '📝',
                    target: 'Turn initial user migration stories into high-ranking technical articles',
                    tags: ['AEO Optimization', 'Blog Guides']
                }
            ],
            tasks: [
                { id: 'dp_1', title: 'Collect feedback testimonials from first 10 active production users.' },
                { id: 'dp_2', title: 'Submit PRs to 3 curated "Awesome-[Tech]" GitHub repositories.' },
                { id: 'dp_3', title: 'Publish technical benchmark teardown article targeting long-tail comparison queries.' }
            ],
            hook: `1 week after launching our open-source devtool:

- 1,420 GitHub stars
- 4,800 CLI downloads
- 12 critical bug reports fixed

The #1 feature requested by the community surprised us: [Feature].
Here is how we implemented it in 48 hours without breaking backward compatibility:`
        }
    },
    b2b_saas: {
        d30: {
            title: 'Workflow Pain Mining & Founder Shadow Listening',
            timeEstimate: '4-6 hrs/week',
            channels: [
                {
                    name: 'B2B Subreddits',
                    icon: '💼',
                    target: 'Identify operational headaches costing companies real billable hours',
                    tags: ['r/SaaS', 'r/Entrepreneur', 'r/smallbusiness', 'r/sales']
                },
                {
                    name: 'LinkedIn Operator Posts',
                    icon: '👔',
                    target: 'Search for posts complaining about existing enterprise SaaS platforms',
                    tags: ['SaaS renewal complaints', 'Workflow friction']
                },
                {
                    name: 'Private Slack Communities',
                    icon: '💬',
                    target: 'Join founder and operator Slack groups to observe daily challenges',
                    tags: ['MicroConf', 'RevGenius', 'Indie Worldwide']
                }
            ],
            tasks: [
                { id: 'd30_1', title: 'Audit 5 competitor reviews on G2/Capterra looking specifically for 2-star complaints.' },
                { id: 'd30_2', title: 'Reach out to 10 operations leads on LinkedIn offering a free audit of their current workflow.' },
                { id: 'd30_3', title: 'Calculate exact ROI formula (hours saved * hourly billing rate) for your solution.' }
            ],
            hook: `Most B2B teams are spending $400/mo on [Tool] just to use 5% of its features.

I audited 15 small business workflows this week.
The single biggest time sink wasn't lack of software—it was [Bottleneck].

Building a lightweight alternative focused exclusively on [Core Workflow].
If you want to test our prototype before it launches, leave a comment.`
        },
        d14: {
            title: 'ROI Teardowns & Pilot Waitlist Funnel',
            timeEstimate: '6-8 hrs/week',
            channels: [
                {
                    name: 'LinkedIn Founder Thought Leadership',
                    icon: '📊',
                    target: 'Share visual workflow teardowns comparing the legacy 8-step process vs. 2-step automation',
                    tags: ['ROI comparison', 'B2B workflows']
                },
                {
                    name: 'Indie Hackers & Growth Communities',
                    icon: '🌱',
                    target: 'Document revenue assumptions, customer interview feedback, and beta progress',
                    tags: ['Indie Hackers', 'GrowthHackers']
                }
            ],
            tasks: [
                { id: 'd14_1', title: 'Create a 1-page PDF/Notion calculator demonstrating concrete dollar savings.' },
                { id: 'd14_2', title: 'Publish a LinkedIn carousel breaking down the hidden costs of legacy software.' },
                { id: 'd14_3', title: 'Secure 5 design-partner commitments for free beta onboarding.' }
            ],
            hook: `How a 12-person agency was losing $1,800/month on [Manual Task]:

Before:
- Step 1: Copy from CRM (30 mins)
- Step 2: Format in Sheets (45 mins)
- Step 3: Manual email sending (1 hr)

After our automated workflow:
- 1-click sync in under 4 seconds.

We are opening 20 beta slots for operations leaders this week.`
        },
        d7: {
            title: 'Design Partner Onboarding & Pilot Case Studies',
            timeEstimate: '8-10 hrs/week',
            channels: [
                {
                    name: 'Warm Email Sequences',
                    icon: '✉️',
                    target: 'Personalized invitations to waitlist subscribers with founder direct access',
                    tags: ['VIP onboarding', 'Direct founder call']
                },
                {
                    name: 'Launch Directory Prep',
                    icon: '📋',
                    target: 'Finalize pricing tiers, ROI guarantee, and LaunchXact marketplace listing',
                    tags: ['LaunchXact Submission', 'Product Hunt draft']
                }
            ],
            tasks: [
                { id: 'd7_1', title: 'Record personalized 2-minute Loom onboarding video for each registered beta lead.' },
                { id: 'd7_2', title: 'Write up a 3-bullet proof statement quoting your first design partner.' },
                { id: 'd7_3', title: 'Verify Stripe / MoR checkout with test purchase and automatic invoice generation.' }
            ],
            hook: `We gave [Tool Name] to 5 agency owners last Tuesday.
Here is what happened to their average turnaround time:

- Client A: Reduced weekly admin from 9 hours to 45 minutes
- Client B: Saved $650 in redundant Zapier tasks

Public launch happens next Monday.
Genesis batch pricing will be locked in for life for the first 30 signups.`
        },
        launch: {
            title: 'Launch Day: B2B Multi-Vendor Coordinated Blast',
            timeEstimate: 'Full Day (8-10 hrs)',
            channels: [
                {
                    name: 'LaunchXact B2B Marketplace',
                    icon: '🚀',
                    target: 'List product for vetted business buyers seeking productivity software',
                    tags: ['Genesis Batch', 'Vetted Directory']
                },
                {
                    name: 'LinkedIn Announcement Blast',
                    icon: '👔',
                    target: 'Publish multi-contributor founder launch post with partner tags',
                    tags: ['Founder story', 'Customer tags']
                },
                {
                    name: 'Product Hunt & SaaS Boards',
                    icon: '😸',
                    target: 'Coordinate upvote push with customer community and early beta adopters',
                    tags: ['Top Product Hunt', 'Live Q&A']
                }
            ],
            tasks: [
                { id: 'dl_1', title: 'Send coordinated launch day broadcast email to all waitlist subscribers with direct login link.' },
                { id: 'dl_2', title: 'Publish LinkedIn announcement tagging early design partners and advisors.' },
                { id: 'dl_3', title: 'Offer 15-minute live onboarding calls to any paid signups arriving during the first 24 hours.' }
            ],
            hook: `After 14 weeks of private beta with 32 businesses, [Tool Name] is officially LIVE 🎉

If your team spends more than 3 hours a week managing [Pain Point], this was built for you:

✨ Features:
- Native 2-way sync
- Zero-bloat dashboard
- Flat pricing with no per-seat penalties

To celebrate launch week, early founders get 30% off forever:`
        },
        dplus7: {
            title: 'Customer Retention & Review Flywheel',
            timeEstimate: '4-6 hrs/week',
            channels: [
                {
                    name: 'Review Platforms',
                    icon: '⭐',
                    target: 'Incentivize honest reviews on Trustpilot, G2, and LaunchXact',
                    tags: ['User reviews', 'Social proof']
                },
                {
                    name: 'Customer Success Retrospectives',
                    icon: '📈',
                    target: 'Interview first paid users for full case study blog articles',
                    tags: ['Case studies', 'AEO content']
                }
            ],
            tasks: [
                { id: 'dp_1', title: 'Schedule 15-minute check-in call with every customer who upgraded to a paid plan.' },
                { id: 'dp_2', title: 'Publish your first verified customer ROI case study on the company blog.' },
                { id: 'dp_3', title: 'Set up an automated in-app NPS prompt triggering after 7 active days.' }
            ],
            hook: `The honest numbers from our first 7 days of launching [B2B SaaS]:

- 1,840 site visitors
- 218 trial signups
- 19 paid subscriptions ($1,480 MRR)
- 3 users cancelled (and here is the brutal feedback they gave us):

Building in public means sharing the messy parts too.
Here is what we are fixing this sprint:`
        }
    },
    ai_micro: {
        d30: {
            title: 'AI Use-Case Demonstration & Prompt Benchmark Seeding',
            timeEstimate: '4-6 hrs/week',
            channels: [
                {
                    name: 'AI Subreddits',
                    icon: '🤖',
                    target: 'Demonstrate actionable side-by-side prompt output comparisons',
                    tags: ['r/ArtificialIntelligence', 'r/ChatGPTCoding', 'r/LocalLLaMA']
                },
                {
                    name: 'AI Twitter / X Creators',
                    icon: '⚡',
                    target: 'Engage with AI newsletters and creators curating new tool lists',
                    tags: ['#AItools', '#buildinpublic', '#LLM']
                },
                {
                    name: 'AI Directories Research',
                    icon: '📑',
                    target: 'Compile list of 30+ AI curation platforms for launch syndication',
                    tags: ['FutureTools', 'There\'s An AI For That', 'Toolify']
                }
            ],
            tasks: [
                { id: 'd30_1', title: 'Record an unfiltered screen recording showing real AI generation speed vs standard ChatGPT.' },
                { id: 'd30_2', title: 'Publish a side-by-side benchmark comparing accuracy against raw LLM completions.' },
                { id: 'd30_3', title: 'Bookmark 25 prominent AI newsletter curators on X/LinkedIn for outreach.' }
            ],
            hook: `ChatGPT is great, but for [Specific Use Case], it produces generic garbage.

I spent 2 weeks fine-tuning an agent specifically to solve [Problem].
Here is an unedited prompt comparison:

Standard GPT-4: [Hallucinated/Vague Output]
Our Agent: [Precise, Production-Ready Output in 2.1s]

Building a dedicated web app for this. Drop a comment for early access link.`
        },
        d14: {
            title: 'Viral Video Loops & Free Micro-Tool Magnet',
            timeEstimate: '6-8 hrs/week',
            channels: [
                {
                    name: 'Short-Form Video (X / TikTok / Reels)',
                    icon: '🎬',
                    target: 'Create 15-second fast-paced demo videos showing "Input -> AI Magic -> Output"',
                    tags: ['Viral demos', 'Product GIF']
                },
                {
                    name: 'Free Teaser Tool on Subdomain',
                    icon: '🧲',
                    target: 'Deploy a no-login free micro-generator to capture high-intent emails',
                    tags: ['Free tool magnet', 'Viral loop']
                }
            ],
            tasks: [
                { id: 'd14_1', title: 'Deploy a free 1-click preview tool requiring no signup to experience the output.' },
                { id: 'd14_2', title: 'Publish 3 video demos showcasing unexpected edge cases solved seamlessly.' },
                { id: 'd14_3', title: 'Collect 100 waitlist emails by offering free bonus generations on launch day.' }
            ],
            hook: `Stop paying $50/mo for bloated AI tools.

We built a micro-tool that does ONE thing 10x better: [Specific Task].

1. Paste your raw text
2. Click generate
3. Export directly to Notion/CSV

Try the free generator (no signup required): [Link]`
        },
        d7: {
            title: 'AI Directory Submission & Influencer Seed Demos',
            timeEstimate: '8-10 hrs/week',
            channels: [
                {
                    name: 'AI Newsletters & Influencers',
                    icon: '📨',
                    target: 'Pitch free VIP accounts to curators of top AI newsletters',
                    tags: ['Ben\'s Bites', 'Superhuman', 'The Rundown']
                },
                {
                    name: '30+ AI Directory Submissions',
                    icon: '📋',
                    target: 'Submit tool profiles across all major automated AI directories',
                    tags: ['Futurepedia', 'TopAI.tools', 'FutureTools']
                }
            ],
            tasks: [
                { id: 'd7_1', title: 'Submit product listing across 20 verified AI tool directories.' },
                { id: 'd7_2', title: 'Send tailored email pitches with lifetime VIP access to 10 AI newsletter curators.' },
                { id: 'd7_3', title: 'Set up rate limits and fraud prevention so free-tier API costs don\'t spike on launch day.' }
            ],
            hook: `Hey [Curator Name], loved your recent breakdown of autonomous agents.

We noticed most existing tools fail when [Specific Edge Case].
We just built [Tool Name]—a specialized copilot that [Key Outcome] in under 5 seconds.

Created a lifetime pro account for you to test out:
Login: [Email]
Password: [TempPass]

Would love to know if this fits your next weekly roundup!`
        },
        launch: {
            title: 'Launch Day: Viral AI Showcase Blast',
            timeEstimate: 'Full Day (8-12 hrs)',
            channels: [
                {
                    name: 'Product Hunt AI Category',
                    icon: '😸',
                    target: 'Target #1 AI Product of the Day with high-energy animated GIF demo',
                    tags: ['#1 AI Product', 'Product Hunt']
                },
                {
                    name: 'LaunchXact Genesis Batch',
                    icon: '🚀',
                    target: 'Secure curated listing to reach enterprise buyers instead of transient tire-kickers',
                    tags: ['LaunchXact Batch', 'The Vault']
                },
                {
                    name: 'Reddit AI Communities',
                    icon: '👾',
                    target: 'Share transparent building story on r/SideProject and r/ArtificialIntelligence',
                    tags: ['Show & Tell', 'Free credits']
                }
            ],
            tasks: [
                { id: 'dl_1', title: 'Launch on Product Hunt and coordinate early supporters in Discord/Slack.' },
                { id: 'dl_2', title: 'Post live screen recording thread on X offering 50 free credits to anyone who retweets.' },
                { id: 'dl_3', title: 'Monitor serverless GPU/LLM latency and error rates in real time.' }
            ],
            hook: `Today we are launching [AI Tool Name] on Product Hunt! 🚀

The problem: Most AI tools require 45 minutes of prompt engineering to get decent results.
Our solution: 1-click tailored outputs trained specifically on high-performing datasets.

Give it a spin today and get 100 free launch credits:
[Product Hunt Link]

Let us know what you generate in the comments! 👇`
        },
        dplus7: {
            title: 'Prompt Templates Library & SEO Organic Indexing',
            timeEstimate: '4-6 hrs/week',
            channels: [
                {
                    name: 'Programmatic SEO Pages',
                    icon: '🔍',
                    target: 'Generate templated landing pages for top 50 use-cases',
                    tags: ['Programmatic SEO', 'AEO queries']
                },
                {
                    name: 'Community Template Gallery',
                    icon: '📚',
                    target: 'Allow users to share and remix prompts generated inside your app',
                    tags: ['User generated content', 'Social sharing']
                }
            ],
            tasks: [
                { id: 'dp_1', title: 'Build a public "Explore" gallery showcasing the coolest generations made by users.' },
                { id: 'dp_2', title: 'Launch 10 programmatic comparison pages (e.g. "[Tool] vs ChatGPT for [Use Case]").' },
                { id: 'dp_3', title: 'Incorporate user referral loop granting 25 free credits per referred signup.' }
            ],
            hook: `The craziest generation our AI tool produced this week:

A solo founder used our app to generate [Unbelievable Result] in 12 seconds.
They just closed a $3,500 contract using the output.

Check out the interactive prompt breakdown in our public community gallery:`
        }
    },
    creator_consumer: {
        d30: {
            title: 'Creator Listening & Community Problem Mapping',
            timeEstimate: '4-6 hrs/week',
            channels: [
                {
                    name: 'Creator Communities',
                    icon: '🎨',
                    target: 'Observe common frustrations around content editing, monetization, and newsletters',
                    tags: ['r/CreatorEconomy', 'r/NewTubers', 'r/Blogging']
                },
                {
                    name: 'X & Threads Conversations',
                    icon: '🧵',
                    target: 'Look for creators asking "What tool do you use to [Task]?"',
                    tags: ['Creator tech', 'Content tools']
                }
            ],
            tasks: [
                { id: 'd30_1', title: 'Identify 10 micro-creators (2k-10k followers) who frequently review new tools.' },
                { id: 'd30_2', title: 'Leave thoughtful feedback on 15 creator posts without pitching.' },
                { id: 'd30_3', title: 'Create interactive prototype demonstrating the 3-second workflow magic.' }
            ],
            hook: `Why do most creator tools charge $30/mo and still take 20 minutes to export?

I\'m building a zero-fluff utility designed to do one thing in 3 clicks:
[Key Outcome].

No watermark. No complex timeline editor. No subscription traps.
Who wants to test the early beta?`
        },
        d14: {
            title: 'Behind-The-Scenes Video & Aesthetic Teasers',
            timeEstimate: '6-8 hrs/week',
            channels: [
                {
                    name: 'TikTok & IG Reels',
                    icon: '📱',
                    target: 'Post aesthetic "day in the life of an indie creator app builder" videos',
                    tags: ['#buildinpublic', '#creatortools', '#indieapp']
                },
                {
                    name: 'Beta Invite Landing Page',
                    icon: '✨',
                    target: 'Design slick, minimalist waitlist page with animated UI previews',
                    tags: ['Aesthetic UI', 'Instant preview']
                }
            ],
            tasks: [
                { id: 'd14_1', title: 'Post 3 aesthetic screen recording reels showing the satisfying UI animations.' },
                { id: 'd14_2', title: 'Offer early supporters a "Founding Creator" badge with lifetime perks.' },
                { id: 'd14_3', title: 'Onboard 10 creators personally via screen-share to watch their live reactions.' }
            ],
            hook: `I got tired of ugly software, so I spent 30 days designing the cleanest [Tool Type] on the internet.

✨ Dark mode default
⚡ Instant keyboard shortcuts
📦 1-click export

Watch the 10-second demo.
First 100 creators get lifetime pro access for free.`
        },
        d7: {
            title: 'Micro-Influencer Seeding & Exclusive Pre-Access',
            timeEstimate: '8-10 hrs/week',
            channels: [
                {
                    name: 'Micro-Creator Collaborations',
                    icon: '🤝',
                    target: 'Gift free VIP accounts to micro-creators in exchange for authentic honest feedback',
                    tags: ['Creator seeding', 'Authentic feedback']
                },
                {
                    name: 'Launch Countdown Story Posts',
                    icon: '⏳',
                    target: 'Build anticipation with a 7-day countdown and feature sneak peeks',
                    tags: ['Countdown', 'VIP access']
                }
            ],
            tasks: [
                { id: 'd7_1', title: 'Send 20 personalized DMs to creators whose workflows directly benefit.' },
                { id: 'd7_2', title: 'Prepare shareable launch assets (custom graphic templates, story stickers).' },
                { id: 'd7_3', title: 'Set up seamless social sharing prompts right after user creates something cool.' }
            ],
            hook: `Hey [Creator Name]! Big fan of your content on [Topic].

Noticed you mentioned spending hours on [Pain Point] last week.
I built a minimalist tool that automates that exact step in 2 clicks.

Sent you a free lifetime VIP link in your DMs—no strings attached, just hope it saves you some hours this week!`
        },
        launch: {
            title: 'Launch Day: Multi-Platform Community Celebration',
            timeEstimate: 'Full Day (8-10 hrs)',
            channels: [
                {
                    name: 'Product Hunt & BetaList',
                    icon: '🌟',
                    target: 'Launch with vibrant visual assets and friendly founder story video',
                    tags: ['Product Hunt', 'BetaList']
                },
                {
                    name: 'LaunchXact Curated Hub',
                    icon: '🚀',
                    target: 'List product for serious adopters and software buyers',
                    tags: ['Genesis Batch', 'Curated Launch']
                },
                {
                    name: 'Social Launch Blitz',
                    icon: '📢',
                    target: 'Post celebratory launch thread with customer reaction montage',
                    tags: ['Launch video', 'Community giveaway']
                }
            ],
            tasks: [
                { id: 'dl_1', title: 'Send celebratory launch email to your early access waitlist.' },
                { id: 'dl_2', title: 'Engage in every comment and reaction across Product Hunt and social channels.' },
                { id: 'dl_3', title: 'Highlight early user creations in real-time on your social feeds.' }
            ],
            hook: `[Tool Name] is finally out in the wild! 🎉

Built for creators who value speed, simplicity, and beautiful craft.
No more clunky enterprise menus or 15-step export settings.

Try it today and make something awesome:
[Link]

Leave a comment with what you created and we will feature your work on our homepage!`
        },
        dplus7: {
            title: 'User-Generated Content Loop & Referral Flywheel',
            timeEstimate: '3-5 hrs/week',
            channels: [
                {
                    name: 'Creator Spotlight Series',
                    icon: '🔦',
                    target: 'Feature your most active users on social channels and weekly newsletter',
                    tags: ['Customer spotlight', 'Community love']
                },
                {
                    name: 'Watermark Viral Attribution',
                    icon: '🏷️',
                    target: 'Add subtle "Created with [Tool]" attribution on free-tier exports',
                    tags: ['Viral loop', 'Organic growth']
                }
            ],
            tasks: [
                { id: 'dp_1', title: 'Interview top creator for a 60-second video testimonial.' },
                { id: 'dp_2', title: 'Implement a referral unlock mechanism (invite 2 friends to unlock Pro feature).' },
                { id: 'dp_3', title: 'Review churn and exit surveys to identify the #1 friction point.' }
            ],
            hook: `How [Creator Name] went from spending 3 hours on [Task] to doing it in 5 minutes:

"I didn't believe it until I exported my first batch. This tool paid for itself in day one."

Read the full breakdown and steal their exact workflow template below:`
        }
    }
};

export default function DistributionArchitect() {
    const [selectedCategory, setSelectedCategory] = useState('devtool');
    const [selectedStage, setSelectedStage] = useState('ideation');
    const [activeTab, setActiveTab] = useState('all');
    const [completedTasks, setCompletedTasks] = useState({});
    const [copiedHook, setCopiedHook] = useState(false);
    const [copiedRoadmap, setCopiedRoadmap] = useState(false);

    const activeTimeline = useMemo(() => {
        return TIMELINE_DATA[selectedCategory] || TIMELINE_DATA.devtool;
    }, [selectedCategory]);

    const allTasks = useMemo(() => {
        const tasks = [];
        ['d30', 'd14', 'd7', 'launch', 'dplus7'].forEach((phaseKey) => {
            if (activeTimeline[phaseKey]?.tasks) {
                activeTimeline[phaseKey].tasks.forEach((t) => {
                    tasks.push({ ...t, phaseKey });
                });
            }
        });
        return tasks;
    }, [activeTimeline]);

    const totalTaskCount = allTasks.length;
    const completedCount = useMemo(() => {
        return allTasks.filter((t) => completedTasks[t.id]).length;
    }, [allTasks, completedTasks]);

    const momentumScore = useMemo(() => {
        if (totalTaskCount === 0) return 0;
        return Math.round((completedCount / totalTaskCount) * 100);
    }, [completedCount, totalTaskCount]);

    const toggleTask = (taskId) => {
        setCompletedTasks((prev) => ({
            ...prev,
            [taskId]: !prev[taskId],
        }));
    };

    const handleCopyHook = (hookText) => {
        navigator.clipboard.writeText(hookText);
        setCopiedHook(true);
        setTimeout(() => setCopiedHook(false), 2000);
    };

    const handleCopyRoadmap = () => {
        const categoryObj = CATEGORIES.find((c) => c.id === selectedCategory);
        const stageObj = STAGES.find((s) => s.id === selectedStage);

        let markdown = `# LaunchXact Distribution Roadmap: ${categoryObj?.name}\n`;
        markdown += `Current Stage: ${stageObj?.name} | Readiness Momentum: ${momentumScore}%\n\n`;

        const phases = [
            { key: 'd30', label: 'D-30: Shadow Seeding & Pain Mining' },
            { key: 'd14', label: 'D-14: Build-in-Public & Waitlist' },
            { key: 'd7', label: 'D-7: Beta Activation & Launch Prep' },
            { key: 'launch', label: 'Launch Day: Multi-Channel Surge' },
            { key: 'dplus7', label: 'D+7: Sustained Flywheel & SEO' },
        ];

        phases.forEach(({ key, label }) => {
            const phase = activeTimeline[key];
            if (phase) {
                markdown += `## ${label} (${phase.timeEstimate})\n`;
                markdown += `### Key Channels:\n`;
                phase.channels.forEach((c) => {
                    markdown += `- ${c.name}: ${c.target} [${c.tags.join(', ')}]\n`;
                });
                markdown += `\n### Tactical Action Items:\n`;
                phase.tasks.forEach((t) => {
                    const status = completedTasks[t.id] ? '[x]' : '[ ]';
                    markdown += `- ${status} ${t.title}\n`;
                });
                markdown += `\n### Viral Copy Hook:\n\`\`\`\n${phase.hook}\n\`\`\`\n\n`;
            }
        });

        markdown += `---\nGenerated by LaunchXact Pre-Launch Distribution Architect (https://www.launchxact.com/tools/pre-launch-distribution-architect)\n`;

        navigator.clipboard.writeText(markdown);
        setCopiedRoadmap(true);
        setTimeout(() => setCopiedRoadmap(false), 2500);
    };

    const phasesToRender = useMemo(() => {
        const list = [
            { key: 'd30', pill: 'D-30', data: activeTimeline.d30 },
            { key: 'd14', pill: 'D-14', data: activeTimeline.d14 },
            { key: 'd7', pill: 'D-7', data: activeTimeline.d7 },
            { key: 'launch', pill: 'LAUNCH DAY', data: activeTimeline.launch },
            { key: 'dplus7', pill: 'D+7', data: activeTimeline.dplus7 },
        ];

        if (activeTab === 'all') return list;
        return list.filter((p) => p.key === activeTab);
    }, [activeTab, activeTimeline]);

    return (
        <div className={styles.container}>
            {/* Header */}
            <header className={styles.toolHeader}>
                <div className={styles.toolBadge}>
                    <span>✦ Interactive Launch Strategy Engine</span>
                </div>
                <h1 className={styles.toolTitle}>
                    The Pre-Launch <span className={styles.gradientAccent}>Distribution Architect</span>
                </h1>
                <p className={styles.toolSubtitle}>
                    Never launch to crickets. Reverse-engineer a tactical, day-by-day distribution timeline with curated communities, viral post hooks, and community playbooks.
                </p>
            </header>

            {/* Selectors */}
            <div className={styles.selectorCard}>
                <div className={styles.sectionTitle}>
                    <span>1. Select Your Product Category</span>
                </div>
                <div className={styles.selectorGrid}>
                    {CATEGORIES.map((c) => (
                        <button
                            key={c.id}
                            type="button"
                            onClick={() => setSelectedCategory(c.id)}
                            className={`${styles.selectorButton} ${selectedCategory === c.id ? styles.selectorButtonActive : ''}`}
                        >
                            <span className={styles.selectorIcon}>{c.icon}</span>
                            <div>
                                <span className={styles.selectorTextTitle}>{c.name}</span>
                                <span className={styles.selectorTextDesc}>{c.desc}</span>
                            </div>
                        </button>
                    ))}
                </div>

                <div className={styles.sectionTitle}>
                    <span>2. Select Your Current Launch Stage</span>
                </div>
                <div className={styles.selectorGrid}>
                    {STAGES.map((s) => (
                        <button
                            key={s.id}
                            type="button"
                            onClick={() => setSelectedStage(s.id)}
                            className={`${styles.selectorButton} ${selectedStage === s.id ? styles.selectorButtonActive : ''}`}
                        >
                            <span className={styles.selectorIcon}>📍</span>
                            <div>
                                <span className={styles.selectorTextTitle}>{s.name}</span>
                                <span className={styles.selectorTextDesc}>{s.timeframe}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Momentum Score HUD */}
            <div className={styles.momentumCard}>
                <div className={styles.momentumInfo}>
                    <span className={styles.momentumBadge}>Live Launch Momentum</span>
                    <h2 className={styles.momentumTitle}>
                        {momentumScore === 100
                            ? '🚀 Ready for Genesis Batch Launch!'
                            : momentumScore >= 50
                            ? '⚡ High Traction Velocity'
                            : '🌱 Initial Seeding Phase'}
                    </h2>
                    <p className={styles.momentumDesc}>
                        Check off completed distribution milestones below to track your pre-launch traction score.
                    </p>
                </div>
                <div className={styles.momentumScoreWrap}>
                    <div className={styles.scoreCircle}>
                        <span className={styles.scoreNumber}>{momentumScore}%</span>
                        <span className={styles.scoreLabel}>Score</span>
                    </div>
                    <button onClick={handleCopyRoadmap} className={styles.btnSecondary} style={{ background: '#7c3aed', color: '#ffffff' }}>
                        {copiedRoadmap ? '✓ Copied Markdown!' : '📋 Export Roadmap'}
                    </button>
                </div>
            </div>

            {/* Timeline Filter Tabs */}
            <div className={styles.timelineTabs}>
                <button
                    type="button"
                    onClick={() => setActiveTab('all')}
                    className={`${styles.tabButton} ${activeTab === 'all' ? styles.tabButtonActive : ''}`}
                >
                    View All Phases <span className={styles.tabBadge}>5</span>
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('d30')}
                    className={`${styles.tabButton} ${activeTab === 'd30' ? styles.tabButtonActive : ''}`}
                >
                    D-30: Problem Mining
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('d14')}
                    className={`${styles.tabButton} ${activeTab === 'd14' ? styles.tabButtonActive : ''}`}
                >
                    D-14: Build in Public
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('d7')}
                    className={`${styles.tabButton} ${activeTab === 'd7' ? styles.tabButtonActive : ''}`}
                >
                    D-7: Beta Activation
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('launch')}
                    className={`${styles.tabButton} ${activeTab === 'launch' ? styles.tabButtonActive : ''}`}
                >
                    🚀 Launch Day
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('dplus7')}
                    className={`${styles.tabButton} ${activeTab === 'dplus7' ? styles.tabButtonActive : ''}`}
                >
                    D+7: Flywheel
                </button>
            </div>

            {/* Timeline Stream */}
            <div className={styles.timelineStream}>
                {phasesToRender.map((phase) => (
                    <section key={phase.key} className={styles.phaseBlock}>
                        <div className={styles.phaseHeader}>
                            <div className={styles.phaseTagWrap}>
                                <span className={styles.phasePill}>{phase.pill}</span>
                                <h3 className={styles.phaseTitle}>{phase.data.title}</h3>
                            </div>
                            <span className={styles.phaseTimeEstimate}>⏱️ {phase.data.timeEstimate}</span>
                        </div>

                        {/* Channels */}
                        <div className={styles.taskSectionTitle}>Curated Distribution Nodes</div>
                        <div className={styles.channelGrid}>
                            {phase.data.channels.map((ch, idx) => (
                                <div key={idx} className={styles.channelCard}>
                                    <div className={styles.channelHeader}>
                                        <span className={styles.channelIcon}>{ch.icon}</span>
                                        <span className={styles.channelName}>{ch.name}</span>
                                    </div>
                                    <p className={styles.channelTarget}>{ch.target}</p>
                                    <div className={styles.channelTags}>
                                        {ch.tags.map((t, tidx) => (
                                            <span key={tidx} className={styles.channelTag}>
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Action Checklist */}
                        <div className={styles.taskSectionTitle}>Tactical Action Checklist</div>
                        <div className={styles.taskList}>
                            {phase.data.tasks.map((task) => {
                                const isChecked = !!completedTasks[task.id];
                                return (
                                    <label
                                        key={task.id}
                                        className={`${styles.taskItem} ${isChecked ? styles.taskItemCompleted : ''}`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={() => toggleTask(task.id)}
                                            className={styles.taskCheckbox}
                                        />
                                        <div className={styles.taskContent}>
                                            <div className={styles.taskTitle}>{task.title}</div>
                                            <div className={styles.taskSub}>
                                                {isChecked ? '✓ Milestone Completed' : 'Click to mark as done'}
                                            </div>
                                        </div>
                                    </label>
                                );
                            })}
                        </div>

                        {/* Viral Post Hook Snippet */}
                        <div className={styles.hookBox}>
                            <div className={styles.hookHeader}>
                                <span className={styles.hookTitle}>
                                    <span>🎯 Steal This Post Hook</span>
                                </span>
                                <button
                                    type="button"
                                    onClick={() => handleCopyHook(phase.data.hook)}
                                    className={styles.copyHookBtn}
                                >
                                    {copiedHook ? '✓ Copied Hook!' : 'Copy Post Hook'}
                                </button>
                            </div>
                            <pre className={styles.hookContent}>{phase.data.hook}</pre>
                        </div>
                    </section>
                ))}
            </div>

            {/* Conversion Handoff Card */}
            <section className={styles.handoffCard}>
                <div className={styles.handoffGlow} />
                <h3 className={styles.handoffHeadline}>
                    Skip the 30-day manual outreach grind.
                </h3>
                <p className={styles.handoffDesc}>
                    Want guaranteed day-one distribution to 350,000+ targeted software adopters instead of sending 200 cold DMs across Reddit and Twitter? Apply for the curated LaunchXact Genesis Batch.
                </p>
                <div className={styles.handoffActions}>
                    <Link href="/#founder-form" className={styles.btnPrimary}>
                        Apply to Genesis Batch for Instant Traction &rarr;
                    </Link>
                    <button onClick={handleCopyRoadmap} className={styles.btnSecondary}>
                        {copiedRoadmap ? '✓ Copied Markdown!' : 'Export Distribution Plan'}
                    </button>
                </div>
            </section>

            {/* FAQ / Educational Section for SEO & AEO */}
            <section className={styles.faqSection}>
                <h2 className={styles.faqTitle}>Frequently Asked Questions About SaaS Distribution</h2>
                <div className={styles.faqGrid}>
                    <div className={styles.faqCard}>
                        <h3 className={styles.faqQ}>Why do most SaaS launches fail to gain initial traction?</h3>
                        <p className={styles.faqA}>
                            Most SaaS founders spend 95% of their energy coding features in isolation and wait until "launch day" to tell the world. Without 30 days of pre-launch shadow seeding, pain mining, and waitlist anticipation, launch day traffic evaporates within 24 hours. The Pre-Launch Distribution Architect provides a structured day-by-day roadmap to guarantee day-one adopters.
                        </p>
                    </div>
                    <div className={styles.faqCard}>
                        <h3 className={styles.faqQ}>What is the D-30 to D-7 pre-launch framework?</h3>
                        <p className={styles.faqA}>
                            The D-30 to D-7 framework divides distribution into actionable stages: D-30 is dedicated to pain mining in relevant subreddits and forums without pitching; D-14 focuses on build-in-public hooks and gathering waitlist leads; D-7 activates VIP testers with personalized demos; and Launch Day coordinates multi-channel surges across hacker forums, Product Hunt, and LaunchXact.
                        </p>
                    </div>
                    <div className={styles.faqCard}>
                        <h3 className={styles.faqQ}>How does LaunchXact solve distribution for indie developers?</h3>
                        <p className={styles.faqA}>
                            LaunchXact functions as a curated multi-vendor marketplace connecting qualified SaaS products directly with serious software adopters and enterprise buyers. Instead of relying solely on viral 24-hour launch spikes, LaunchXact products gain permanent visibility in The Vault and indexed discoverability through AI semantic search.
                        </p>
                    </div>
                    <div className={styles.faqCard}>
                        <h3 className={styles.faqQ}>How do I use the exported markdown launch roadmap?</h3>
                        <p className={styles.faqA}>
                            Click the "Export Roadmap" button to copy a complete, structured Markdown document with all phases, curated channels, tactical checklists, and copy hooks. You can paste it directly into Notion, Obsidian, Linear, or GitHub issues to manage your launch sprint.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
