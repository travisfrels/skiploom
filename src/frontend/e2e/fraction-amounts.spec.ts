import { test, expect } from '@playwright/test'
import { deleteTestRecipe, setFeatureFlag } from './helpers'

test.use({ storageState: 'e2e/.auth/user.json' })

test.describe('Fraction Amounts', () => {
    test.beforeAll(async ({ browser }) => {
        const context = await browser.newContext()
        await setFeatureFlag(context, 'FRACTION_AMOUNTS', true)
        await context.close()
    })

    test.afterAll(async ({ browser }) => {
        const context = await browser.newContext()
        await setFeatureFlag(context, 'FRACTION_AMOUNTS', false)
        await context.close()
    })

    test.describe('Recipe with fraction input', () => {
        let createdId: string

        test.afterEach(async ({ page }) => {
            if (createdId) {
                await deleteTestRecipe(page.context(), createdId)
            }
        })

        test('creates recipe with fraction amount, displays as fraction, and pre-populates edit form', async ({ page }) => {
            await test.step('navigate to the new recipe form', async () => {
                await page.goto('/recipes/new')
            })
            await test.step('fill in recipe details with fraction amount', async () => {
                await page.getByLabel('Title').fill('Fraction Amounts Test')
                await page.getByLabel('Description').fill('Created by fraction amounts E2E test')
                await page.getByPlaceholder('Amt').clear()
                await page.getByPlaceholder('Amt').fill('1/2')
                await page.getByPlaceholder('Unit').fill('cup')
                await page.getByPlaceholder('Ingredient name').fill('sugar')
                await page.getByPlaceholder('Describe this step').fill('Mix the ingredients.')
            })
            await test.step('submit the form', async () => {
                await page.getByRole('button', { name: 'Create Recipe' }).click()
                await page.waitForURL(/\/recipes\/[0-9a-f-]+$/)
                createdId = page.url().split('/').pop()!
            })
            await test.step('verify the amount displays as a fraction on the detail page', async () => {
                await expect(page.getByText('1/2 cup')).toBeVisible()
                await expect(page.getByText('sugar')).toBeVisible()
            })
            await test.step('navigate to edit form and verify fraction pre-population', async () => {
                await page.goto(`/recipes/${createdId}/edit`)
                await expect(page.getByPlaceholder('Amt')).toHaveValue('1/2')
            })
        })
    })
})
