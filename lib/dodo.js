/**
 * Dodo Payments Integration for Autonomous Blog Generator
 * Product: Autonomous Auto Blog generator (pdt_0NnNR9SDx6pIDWEid6EOK)
 * Checkout URL: https://checkout.dodopayments.com/buy/pdt_0NnNR9SDx6pIDWEid6EOK?quantity=1
 */

export const DODO_PRODUCT_ID = 'pdt_0NnNR9SDx6pIDWEid6EOK';
export const DODO_CHECKOUT_URL = 'https://checkout.dodopayments.com/buy/pdt_0NnNR9SDx6pIDWEid6EOK?quantity=1';

const DODO_LIVE_VALIDATE_URL = 'https://live.dodopayments.com/licenses/validate';
const DODO_TEST_VALIDATE_URL = 'https://test.dodopayments.com/licenses/validate';

/**
 * Scan and verify a Dodo Payments Pro license key against live and test endpoints.
 * @param {string} rawKey - The raw license key provided by founder.
 * @param {object} options - Optional metadata (email, domain).
 * @returns {Promise<{ valid: boolean, licenseKey?: string, environment?: string, error?: string, raw?: any }>}
 */
export async function verifyDodoLicenseKey(rawKey, options = {}) {
    if (!rawKey || typeof rawKey !== 'string') {
        return { valid: false, error: 'License key is required.' };
    }

    const cleanKey = rawKey.trim();

    if (cleanKey.length < 5) {
        return { valid: false, error: 'Invalid license key format. Please verify the key from your Dodo Payments confirmation email.' };
    }

    // Special test key for local automated tests / developer validation
    if (process.env.NODE_ENV !== 'production' && (cleanKey === 'DODO-TEST-PRO-KEY-DEV' || cleanKey.startsWith('DEV_PRO_LICENSE_'))) {
        return {
            valid: true,
            licenseKey: cleanKey,
            environment: 'development_sandbox',
            productId: DODO_PRODUCT_ID,
            plan: 'pro_license',
            daysRemaining: 365,
            message: 'Local development mock license validated.'
        };
    }

    try {
        // 1. Primary: Verify against Dodo Payments Live API
        const liveResponse = await fetch(DODO_LIVE_VALIDATE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ license_key: cleanKey }),
            cache: 'no-store'
        });

        if (liveResponse.ok) {
            const data = await liveResponse.json();
            if (data && data.valid === true) {
                return {
                    valid: true,
                    licenseKey: cleanKey,
                    environment: 'live',
                    productId: DODO_PRODUCT_ID,
                    plan: 'pro_license',
                    daysRemaining: 365,
                    raw: data
                };
            }
        }

        // 2. Secondary: Verify against Dodo Payments Test / Sandbox API
        const testResponse = await fetch(DODO_TEST_VALIDATE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ license_key: cleanKey }),
            cache: 'no-store'
        });

        if (testResponse.ok) {
            const testData = await testResponse.json();
            if (testData && testData.valid === true) {
                return {
                    valid: true,
                    licenseKey: cleanKey,
                    environment: 'test',
                    productId: DODO_PRODUCT_ID,
                    plan: 'pro_license',
                    daysRemaining: 365,
                    raw: testData
                };
            }
        }

        return {
            valid: false,
            licenseKey: cleanKey,
            error: 'The license key entered is not valid or active in Dodo Payments. Please double-check the key sent to your email after checkout.'
        };

    } catch (err) {
        console.error('Dodo Payments license validation error:', err);
        return {
            valid: false,
            licenseKey: cleanKey,
            error: 'Network timeout connecting to Dodo Payments license server. Please try again in a moment.'
        };
    }
}
