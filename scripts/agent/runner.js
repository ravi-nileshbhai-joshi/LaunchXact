const fs = require('fs');
const path = require('path');
const { getNextTool, getNextAngle, getNegativeConstraints, recordPost } = require('./memory');
const { generateDistributionContent } = require('./generator');
const { publishToX } = require('./publishers/x');
const { publishToLinkedIn } = require('./publishers/linkedin');
const { publishToIndieHackers } = require('./publishers/indiehackers');

const PREVIEWS_DIR = path.join(__dirname, '..', '..', 'data', 'agent', 'previews');
if (!fs.existsSync(PREVIEWS_DIR)) {
    fs.mkdirSync(PREVIEWS_DIR, { recursive: true });
}

// Parse CLI flags
const args = process.argv.slice(2);
const hasFlag = (flag) => args.includes(flag);
const getArgValue = (flag) => {
    const found = args.find(a => a.startsWith(`${flag}=`));
    return found ? found.split('=')[1] : null;
};

const isDryRun = hasFlag('--dry-run') || hasFlag('-d');
const targetPlatform = getArgValue('--platform') || 'all'; // 'all', 'x', 'linkedin', 'indiehackers'
const forcedToolId = getArgValue('--tool');
const forcedAngleId = getArgValue('--angle');
const xMode = getArgValue('--mode') || 'single'; // 'single' or 'thread'

async function runSocialDistributionAgent() {
    console.log('\n======================================================');
    console.log('🤖 LaunchXact Autonomous AI Distribution Agent');
    console.log('======================================================');
    console.log(`⏱️  Timestamp: ${new Date().toISOString()}`);
    console.log(`🎯 Platform Target: ${targetPlatform.toUpperCase()}`);
    console.log(`🛡️  Execution Mode: ${isDryRun ? 'DRY RUN (Preview Only)' : 'LIVE EXECUTION'}`);

    try {
        // 1. Select tool via intelligent rotation
        const tool = await getNextTool(forcedToolId);
        console.log(`\n📌 Selected Tool: "${tool.title}" (${tool.path})`);
        console.log(`💡 Problem: ${tool.problem.slice(0, 90)}...`);

        // 2. Select narrative angle via rotation
        const angle = await getNextAngle(tool.id, forcedAngleId);
        console.log(`🎭 Narrative Angle: "${angle.name}"`);

        // 3. Retrieve historical constraints to prevent repetition
        const negativeConstraints = await getNegativeConstraints(12);
        console.log(`🧠 Historical Ledger: Injected ${negativeConstraints.length} previous hooks as negative constraints.`);

        // 4. Generate high-converting, platform-specific content
        console.log('\n⏳ Generating high-converting copywriting with Groq / Qwen...');
        const generated = await generateDistributionContent({
            tool,
            angle,
            negativeConstraints,
            author: 'Ravi',
        });

        console.log(`\n✨ Hook Generated: "${generated.hook}"`);

        const results = {
            timestamp: new Date().toISOString(),
            tool: tool.id,
            angle: angle.id,
            hook: generated.hook,
            platforms: {},
        };

        // 5. Dispatch to X (Twitter)
        if (targetPlatform === 'all' || targetPlatform === 'x') {
            console.log('\n------------------------------------------------------');
            console.log(`🐦 Processing X (Twitter) [Mode: ${xMode.toUpperCase()}]...`);
            
            const xResult = await publishToX({
                singleTweet: generated.x.single,
                thread: generated.x.thread,
                mode: xMode,
                dryRun: isDryRun,
            });

            results.platforms.x = { ...xResult, preview: xMode === 'thread' ? generated.x.thread : generated.x.single };
            console.log(`   Status: ${xResult.success ? '✅ SUCCESS' : '❌ FAILED'}`);
            if (xResult.url) console.log(`   URL: ${xResult.url}`);
            if (xMode === 'single') {
                console.log(`   Post (${generated.x.single.length} chars):\n"${generated.x.single}"`);
            } else {
                console.log(`   Thread (${generated.x.thread.length} tweets):`);
                generated.x.thread.forEach((t, i) => console.log(`     [${i + 1}/${generated.x.thread.length}] ${t.slice(0, 80)}...`));
            }

            // Save to memory
            await recordPost({
                platform: 'x',
                tool_id: tool.id,
                angle: angle.id,
                hook: generated.hook,
                content: xMode === 'single' ? generated.x.single : generated.x.thread[0],
                thread_items: xMode === 'thread' ? generated.x.thread : [],
                utm_url: xResult.url || tool.path,
                status: xResult.simulated ? 'scheduled' : (xResult.success ? 'published' : 'failed'),
                external_post_id: xResult.id,
                external_post_url: xResult.url,
                error_message: xResult.error || null,
            });
        }

        // 6. Dispatch to LinkedIn
        if (targetPlatform === 'all' || targetPlatform === 'linkedin') {
            console.log('\n------------------------------------------------------');
            console.log('💼 Processing LinkedIn...');

            const liResult = await publishToLinkedIn({
                content: generated.linkedin.content,
                dryRun: isDryRun,
            });

            results.platforms.linkedin = { ...liResult, preview: generated.linkedin.content };
            console.log(`   Status: ${liResult.success ? '✅ SUCCESS' : '❌ FAILED'}`);
            if (liResult.url) console.log(`   URL: ${liResult.url}`);
            console.log(`   Length: ${generated.linkedin.content.length} characters`);
            console.log(`   Preview:\n${generated.linkedin.content.slice(0, 200)}...\n`);

            // Save to memory
            await recordPost({
                platform: 'linkedin',
                tool_id: tool.id,
                angle: angle.id,
                hook: generated.hook,
                content: generated.linkedin.content,
                utm_url: liResult.url || tool.path,
                status: liResult.simulated ? 'scheduled' : (liResult.success ? 'published' : 'failed'),
                external_post_id: liResult.id,
                external_post_url: liResult.url,
                error_message: liResult.error || null,
            });
        }

        // 7. Dispatch to Indie Hackers
        if (targetPlatform === 'all' || targetPlatform === 'indiehackers') {
            console.log('\n------------------------------------------------------');
            console.log('🚀 Processing Indie Hackers...');

            const ihResult = await publishToIndieHackers({
                title: generated.indiehackers.title,
                content: generated.indiehackers.content,
                toolId: tool.id,
                dryRun: isDryRun,
            });

            results.platforms.indiehackers = { ...ihResult, preview: generated.indiehackers };
            console.log(`   Status: ${ihResult.success ? '✅ SUCCESS' : '❌ FAILED'}`);
            console.log(`   Title: "${generated.indiehackers.title}"`);
            console.log(`   Article Length: ${generated.indiehackers.content.length} characters`);
            console.log(`   Preview:\n${generated.indiehackers.content.slice(0, 260)}...\n`);
            if (ihResult.savedPath) console.log(`   Saved Article: ${ihResult.savedPath}`);

            // Save to memory
            await recordPost({
                platform: 'indiehackers',
                tool_id: tool.id,
                angle: angle.id,
                hook: generated.indiehackers.title,
                content: generated.indiehackers.content,
                utm_url: tool.path,
                status: ihResult.simulated ? 'scheduled' : (ihResult.success ? 'published' : 'failed'),
                external_post_id: ihResult.id,
                external_post_url: ihResult.savedPath,
                error_message: ihResult.error || null,
            });
        }

        // Save latest run output
        const previewFilePath = path.join(PREVIEWS_DIR, 'latest_run.json');
        fs.writeFileSync(previewFilePath, JSON.stringify(results, null, 2));

        console.log('\n======================================================');
        console.log('🎉 Distribution Cycle Complete!');
        console.log(`📁 Preview & Output Saved: ${previewFilePath}`);
        console.log('======================================================\n');

        return results;
    } catch (err) {
        console.error('\n❌ Fatal Agent Error:', err.message);
        if (err.stack) console.error(err.stack);
        process.exit(1);
    }
}

// Execute if run directly from CLI
if (require.main === module) {
    runSocialDistributionAgent();
}

module.exports = {
    runSocialDistributionAgent,
};
