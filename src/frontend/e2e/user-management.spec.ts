import { test, expect } from '@playwright/test'
import { BASE_URL } from './global-setup'

test.use({ storageState: 'e2e/.auth/user.json' })

test.describe('User Management', () => {
    test.afterEach(async ({ page }) => {
        await page.goto('/admin/users')
        const row = page.locator('tr', { hasText: 'e2e-test@skiploom.test' })
        const status = row.locator('td').nth(2)
        if (await status.textContent() === 'Disabled') {
            await row.getByRole('button', { name: 'Enable' }).click()
            await expect(row.locator('td').nth(2)).toHaveText('Enabled')
        }
    })

    test('user management page lists users with information', async ({ page }) => {
        await test.step('navigate to user management page', async () => {
            await page.goto('/admin/users')
        })

        await test.step('verify page heading', async () => {
            await expect(page.getByRole('heading', { name: 'User Management' })).toBeVisible()
        })

        await test.step('verify back to admin link', async () => {
            const link = page.getByRole('link', { name: 'Back to Admin' })
            await expect(link).toBeVisible()
            await expect(link).toHaveAttribute('href', '/admin/')
        })

        await test.step('verify test user is listed with email, display name, and enabled status', async () => {
            const row = page.locator('tr', { hasText: 'e2e-test@skiploom.test' })
            await expect(row).toBeVisible()
            await expect(row.locator('td').nth(0)).toHaveText('e2e-test@skiploom.test')
            await expect(row.locator('td').nth(1)).toHaveText('E2E Test User')
            await expect(row.locator('td').nth(2)).toHaveText('Enabled')
            await expect(row.getByRole('button', { name: 'Disable' })).toBeVisible()
        })
    })

    test('disable user rejects login, re-enable user restores login', async ({ page, context }) => {
        await test.step('navigate to user management page', async () => {
            await page.goto('/admin/users')
        })

        await test.step('disable the test user', async () => {
            const row = page.locator('tr', { hasText: 'e2e-test@skiploom.test' })
            await row.getByRole('button', { name: 'Disable' }).click()
        })

        await test.step('verify user shows as disabled', async () => {
            const row = page.locator('tr', { hasText: 'e2e-test@skiploom.test' })
            await expect(row.locator('td').nth(2)).toHaveText('Disabled')
            await expect(row.getByRole('button', { name: 'Enable' })).toBeVisible()
        })

        await test.step('verify disabled user is rejected on login attempt', async () => {
            const response = await context.request.post(`${BASE_URL}/api/e2e/login`)
            expect(response.status()).toBe(403)
        })

        await test.step('re-enable the test user', async () => {
            const row = page.locator('tr', { hasText: 'e2e-test@skiploom.test' })
            await row.getByRole('button', { name: 'Enable' }).click()
        })

        await test.step('verify user shows as enabled', async () => {
            const row = page.locator('tr', { hasText: 'e2e-test@skiploom.test' })
            await expect(row.locator('td').nth(2)).toHaveText('Enabled')
            await expect(row.getByRole('button', { name: 'Disable' })).toBeVisible()
        })

        await test.step('verify re-enabled user can login', async () => {
            const response = await context.request.post(`${BASE_URL}/api/e2e/login`)
            expect(response.status()).toBe(200)
        })
    })
})
