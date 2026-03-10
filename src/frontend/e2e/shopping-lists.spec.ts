import { test, expect } from '@playwright/test'
import {
    createTestShoppingList,
    deleteTestShoppingList,
    setFeatureFlag,
} from './helpers'

test.use({ storageState: 'e2e/.auth/user.json' })

const TEST_LIST = {
    title: 'E2E Test Shopping List',
    items: [] as { id: string; label: string; checked: boolean; orderIndex: number }[],
}

const TEST_LIST_WITH_ITEMS = {
    title: 'E2E Test Shopping List',
    items: [
        { id: crypto.randomUUID(), label: 'Milk', checked: false, orderIndex: 1 },
        { id: crypto.randomUUID(), label: 'Bread', checked: false, orderIndex: 2 },
    ],
}

test.describe('Shopping List Nav Link', () => {
    test('shows Shopping Lists link when flag is enabled', async ({ browser, page }) => {
        const ctx = await browser.newContext()
        await setFeatureFlag(ctx, 'SHOPPING_LIST', true)
        await ctx.close()

        try {
            await page.goto('/')
            await expect(page.getByRole('link', { name: 'Shopping Lists' })).toBeVisible()
        } finally {
            const cleanup = await browser.newContext()
            await setFeatureFlag(cleanup, 'SHOPPING_LIST', false)
            await cleanup.close()
        }
    })

    test('hides Shopping Lists link when flag is disabled', async ({ browser, page }) => {
        const ctx = await browser.newContext()
        await setFeatureFlag(ctx, 'SHOPPING_LIST', false)
        await ctx.close()

        await page.goto('/')
        await expect(page.getByRole('link', { name: 'Shopping Lists' })).not.toBeVisible()
    })
})

test.describe('Shopping List CRUD', () => {
    test.beforeAll(async ({ browser }) => {
        const context = await browser.newContext()
        await setFeatureFlag(context, 'SHOPPING_LIST', true)
        await context.close()
    })

    test.afterAll(async ({ browser }) => {
        const context = await browser.newContext()
        await setFeatureFlag(context, 'SHOPPING_LIST', false)
        await context.close()
    })

    test.describe('List Display', () => {
        let listId: string

        test.beforeEach(async ({ page }) => { listId = await createTestShoppingList(page.context(), TEST_LIST) })
        test.afterEach(async ({ page }) => { await deleteTestShoppingList(page.context(), listId) })

        test('shows created shopping list in the list page', async ({ page }) => {
            await test.step('navigate to the shopping lists page', async () => {
                await page.goto('/shopping-lists')
            })
            await test.step('verify the shopping list appears', async () => {
                await expect(page.getByText(TEST_LIST.title)).toBeVisible()
            })
        })
    })

    test.describe('Create', () => {
        let createdId: string

        test.afterEach(async ({ page }) => {
            if (createdId) {
                await deleteTestShoppingList(page.context(), createdId)
            }
        })

        test('creates a shopping list via form and redirects to detail page', async ({ page }) => {
            await test.step('navigate to the new shopping list form', async () => {
                await page.goto('/shopping-lists/new')
            })
            await test.step('fill in the title', async () => {
                await page.getByLabel('Title').fill(TEST_LIST.title)
            })
            await test.step('submit the form', async () => {
                await page.getByRole('button', { name: 'Create Shopping List' }).click()
                await page.waitForURL(/\/shopping-lists\/[0-9a-f-]+$/)
                createdId = page.url().split('/').pop()!
            })
            await test.step('verify the detail page shows the list title', async () => {
                await expect(page.getByText(TEST_LIST.title)).toBeVisible()
            })
        })
    })

    test.describe('Add Items', () => {
        let listId: string

        test.beforeEach(async ({ page }) => { listId = await createTestShoppingList(page.context(), TEST_LIST) })
        test.afterEach(async ({ page }) => { await deleteTestShoppingList(page.context(), listId) })

        test('adds items inline on the detail page', async ({ page }) => {
            await test.step('navigate to the shopping list detail page', async () => {
                await page.goto(`/shopping-lists/${listId}`)
            })
            await test.step('add a new item', async () => {
                await page.getByPlaceholder('Add new item...').fill('Eggs')
                await page.getByRole('button', { name: 'Add' }).click()
            })
            await test.step('verify the item appears', async () => {
                await expect(page.getByText('Eggs')).toBeVisible()
            })
        })
    })

    test.describe('Check and Uncheck Items', () => {
        let listId: string

        test.beforeEach(async ({ page }) => { listId = await createTestShoppingList(page.context(), TEST_LIST_WITH_ITEMS) })
        test.afterEach(async ({ page }) => { await deleteTestShoppingList(page.context(), listId) })

        test('checks an item and verifies persistence after reload', async ({ page }) => {
            await test.step('navigate to the shopping list detail page', async () => {
                await page.goto(`/shopping-lists/${listId}`)
            })
            await test.step('verify the item checkbox is unchecked', async () => {
                const checkbox = page.locator('li').filter({ hasText: 'Milk' }).getByRole('checkbox')
                await expect(checkbox).not.toBeChecked()
            })
            await test.step('check the item', async () => {
                const checkbox = page.locator('li').filter({ hasText: 'Milk' }).getByRole('checkbox')
                await checkbox.click()
                await expect(checkbox).toBeChecked()
            })
            await test.step('reload the page and verify the checked state persists', async () => {
                await page.reload()
                const checkbox = page.locator('li').filter({ hasText: 'Milk' }).getByRole('checkbox')
                await expect(checkbox).toBeChecked()
            })
        })

        test('unchecks a checked item and verifies persistence after reload', async ({ page }) => {
            await test.step('navigate to the shopping list detail page', async () => {
                await page.goto(`/shopping-lists/${listId}`)
            })
            await test.step('check the item', async () => {
                const checkbox = page.locator('li').filter({ hasText: 'Milk' }).getByRole('checkbox')
                await checkbox.click()
                await expect(checkbox).toBeChecked()
            })
            await test.step('uncheck the item', async () => {
                const checkbox = page.locator('li').filter({ hasText: 'Milk' }).getByRole('checkbox')
                await checkbox.click()
                await expect(checkbox).not.toBeChecked()
            })
            await test.step('reload the page and verify the unchecked state persists', async () => {
                await page.reload()
                const checkbox = page.locator('li').filter({ hasText: 'Milk' }).getByRole('checkbox')
                await expect(checkbox).not.toBeChecked()
            })
        })
    })

    test.describe('Edit', () => {
        let listId: string

        test.beforeEach(async ({ page }) => { listId = await createTestShoppingList(page.context(), TEST_LIST) })
        test.afterEach(async ({ page }) => { await deleteTestShoppingList(page.context(), listId) })

        test('updates shopping list title via edit form', async ({ page }) => {
            await test.step('navigate to the edit form', async () => {
                await page.goto(`/shopping-lists/${listId}/edit`)
            })
            await test.step('update the title', async () => {
                await page.getByLabel('Title').clear()
                await page.getByLabel('Title').fill('Updated E2E Shopping List')
            })
            await test.step('submit the form', async () => {
                await page.getByRole('button', { name: 'Save Changes' }).click()
                await page.waitForURL(new RegExp(`/shopping-lists/${listId}$`))
            })
            await test.step('verify the updated title is shown on the detail page', async () => {
                await expect(page.getByText('Updated E2E Shopping List')).toBeVisible()
            })
        })
    })

    test.describe('Delete', () => {
        let listId: string

        test.beforeEach(async ({ page }) => { listId = await createTestShoppingList(page.context(), TEST_LIST) })
        test.afterEach(async ({ page }) => {
            try {
                await deleteTestShoppingList(page.context(), listId)
            } catch {
                // Shopping list was already deleted by the test — no cleanup needed
            }
        })

        test('deletes a shopping list via detail page and redirects to list', async ({ page }) => {
            await test.step('navigate to the shopping list detail page', async () => {
                await page.goto(`/shopping-lists/${listId}`)
            })
            await test.step('click delete and accept the confirmation dialog', async () => {
                page.on('dialog', dialog => dialog.accept())
                await page.getByRole('button', { name: 'Delete' }).click()
            })
            await test.step('verify redirect to the shopping lists page', async () => {
                await page.waitForURL('**/shopping-lists')
                await expect(page.getByText(TEST_LIST.title)).not.toBeVisible()
            })
        })
    })
})
