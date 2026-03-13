import asyncio
from playwright.async_api import async_playwright
import os

async def record_grading_demo(base_url, target_saas="https://launchxact.com", output_folder="videos"):
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    async with async_playwright() as p:
        # Launch browser - using a specific window size for a "Premium" look
        browser = await p.chromium.launch(headless=True)
        
        # We record in high quality to ensure the AI-rewritten text is legible
        context = await browser.new_context(
            record_video_dir=output_folder,
            record_video_size={"width": 1280, "height": 720},
            viewport={"width": 1280, "height": 720}
        )

        page = await context.new_page()
        
        # 1. Start at the Grader page
        grader_url = f"{base_url}/grade"
        print(f"🎬 Recording Grader Demo at: {grader_url}")
        await page.goto(grader_url, wait_until="networkidle")
        await asyncio.sleep(2) # Dramatic pause

        # 2. Simulate the Founder Typing
        input_selector = '#grade-url-input'
        await page.wait_for_selector(input_selector)
        
        print(f"⌨️ Typing target URL: {target_saas}")
        await page.click(input_selector)
        await page.type(input_selector, target_saas, delay=120) # Realistic typing speed
        await asyncio.sleep(1)

        # 3. Trigger the Audit
        submit_button = '#grade-submit-btn'
        print("🚀 Triggering the AI Audit...")
        await page.click(submit_button)

        # 4. Wait for the Result
        # We wait for the score ring or result section to appear
        try:
            # Adjust timeout based on how long your LLM takes to respond
            # Waiting for the score results container
            await page.wait_for_selector('div[class*="scoreSection"]', timeout=30000)
            print("✨ Audit results received!")
        except Exception as e:
            print(f"⚠️ Timeout waiting for results or error: {e}")

        # 5. Show off the Results
        # Slow scroll through the audit summary
        await asyncio.sleep(3)
        print("🖱️ Scrolling through results...")
        
        # Scroll to Roast summary
        await page.evaluate("window.scrollBy({ top: 500, behavior: 'smooth' });")
        await asyncio.sleep(3)
        
        # Scroll to Pillars
        await page.evaluate("window.scrollBy({ top: 500, behavior: 'smooth' });")
        await asyncio.sleep(3)

        # Scroll to Headline Rewrite
        await page.evaluate("window.scrollBy({ top: 600, behavior: 'smooth' });")
        await asyncio.sleep(4)
        
        # Scroll to top-3 fixes
        await page.evaluate("window.scrollBy({ top: 600, behavior: 'smooth' });")
        await asyncio.sleep(4)

        # Final hold on the bridge CTA
        await page.evaluate("window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });")
        await asyncio.sleep(5)

        # Close to save video
        await context.close()
        await browser.close()
        
        print(f"✅ Demo recording finished. Video saved in '{output_folder}'.")

if __name__ == "__main__":
    # Ensure you have playwright installed: pip install playwright && playwright install
    # For local testing, use http://localhost:3000
    # For production, use https://launchxact.com
    LOCAL_URL = "http://localhost:3000"
    PROD_URL = "https://launchxact.com"
    
    # You can change this to either LOCAL or PROD
    asyncio.run(record_grading_demo(PROD_URL))
