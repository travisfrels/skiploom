import { test, expect } from '@playwright/test'

test.use({ storageState: 'e2e/.auth/user.json' })

test.describe('Admin', () => {
    test('admin landing page is accessible with navigation links', async ({ page }) => {
        await test.step('navigate to admin landing page', async () => {
            await page.goto('/admin/')
        })

        await test.step('verify page heading', async () => {
            await expect(page.getByRole('heading', { name: 'Skiploom Admin' })).toBeVisible()
        })

        await test.step('verify feature flags link', async () => {
            const link = page.getByRole('link', { name: 'Feature Flags' })
            await expect(link).toBeVisible()
            await expect(link).toHaveAttribute('href', '/togglz-console/')
        })

        await test.step('verify user management link', async () => {
            const link = page.getByRole('link', { name: 'User Management' })
            await expect(link).toBeVisible()
            await expect(link).toHaveAttribute('href', '/admin/users')
        })
    })

    test('togglz console is accessible with working flag toggles', async ({ page }) => {
        await test.step('navigate to togglz console', async () => {
            await page.goto('/togglz-console/')
        })

        await test.step('verify togglz console loaded', async () => {
            await expect(page.locator('body')).toContainText('Togglz')
        })

        await test.step('toggle a feature flag and restore', async () => {
            const editLink = page.locator('a[href*="edit"]').first()
            await editLink.click()

            const enableCheckbox = page.locator('input[name="enabled"]')
            const wasChecked = await enableCheckbox.isChecked()

            if (wasChecked) {
                await enableCheckbox.uncheck()
            } else {
                await enableCheckbox.check()
            }
            await page.locator('input[type="submit"]').click()

            await expect(page.locator('body')).toContainText('Togglz')

            // Restore original state
            const restoreLink = page.locator('a[href*="edit"]').first()
            await restoreLink.click()

            const restoreCheckbox = page.locator('input[name="enabled"]')
            if (wasChecked) {
                await restoreCheckbox.check()
            } else {
                await restoreCheckbox.uncheck()
            }
            await page.locator('input[type="submit"]').click()
        })
    })
})
