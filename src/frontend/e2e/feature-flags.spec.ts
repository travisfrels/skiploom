import { test, expect } from '@playwright/test'

test.use({ storageState: 'e2e/.auth/user.json' })

test.describe('Feature Flags', () => {
    test('loads feature flags on application startup', async ({ page }) => {
        const featureFlagResponse = page.waitForResponse(
            response => response.url().includes('/api/queries/fetch_feature_flags') && response.status() === 200
        );

        await page.goto('/');

        const response = await featureFlagResponse;
        const body = await response.json();

        expect(body).toHaveProperty('featureFlags');
        expect(body).toHaveProperty('message');
        expect(typeof body.featureFlags).toBe('object');
    });
});
