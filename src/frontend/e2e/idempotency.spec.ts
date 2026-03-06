import { test, expect } from '@playwright/test'
import { apiPost, deleteTestRecipe, fetchAllRecipes } from './helpers'

test.use({ storageState: 'e2e/.auth/user.json' })

const TEST_RECIPE = {
    title: 'E2E Idempotency Test Recipe',
    description: 'Created by idempotency E2E tests',
    ingredients: [{ orderIndex: 1, amount: 1, unit: 'cup', name: 'flour' }],
    steps: [{ orderIndex: 1, instruction: 'Mix the ingredients.' }]
}

test.describe('Recipe Create Idempotency', () => {
    test.describe('UI Creation', () => {
        let createdId: string

        test.afterEach(async ({ page }) => {
            if (createdId) {
                await deleteTestRecipe(page.context(), createdId)
            }
        })

        test('creates exactly one recipe via the UI', async ({ page }) => {
            await test.step('navigate to the new recipe form', async () => {
                await page.goto('/recipes/new')
            })
            await test.step('fill in recipe details', async () => {
                await page.getByLabel('Title').fill(TEST_RECIPE.title)
                await page.getByLabel('Description').fill(TEST_RECIPE.description)
                await page.getByPlaceholder('Amt').fill(String(TEST_RECIPE.ingredients[0].amount))
                await page.getByPlaceholder('Unit').fill(TEST_RECIPE.ingredients[0].unit)
                await page.getByPlaceholder('Ingredient name').fill(TEST_RECIPE.ingredients[0].name)
                await page.getByPlaceholder('Describe this step').fill(TEST_RECIPE.steps[0].instruction)
            })
            await test.step('submit the form', async () => {
                await page.getByRole('button', { name: 'Create Recipe' }).click()
                await page.waitForURL(/\/recipes\/[0-9a-f-]+$/)
                createdId = page.url().split('/').pop()!
            })
            await test.step('verify exactly one recipe exists with this title', async () => {
                const { recipes } = await fetchAllRecipes(page.context())
                const matches = recipes.filter(r => r.title === TEST_RECIPE.title)
                expect(matches).toHaveLength(1)
            })
        })
    })

    test.describe('Duplicate API Request', () => {
        let createdId: string

        test.afterEach(async ({ page }) => {
            if (createdId) {
                await deleteTestRecipe(page.context(), createdId)
            }
        })

        test('sends two API POSTs with the same Idempotency-Key and creates only one recipe', async ({ page }) => {
            const idempotencyKey = crypto.randomUUID()

            const result1 = await test.step('send first create request', async () => {
                return await apiPost<{ recipe: { id: string } }>(
                    page.context(),
                    '/commands/create_recipe',
                    { recipe: { ...TEST_RECIPE, id: '' } },
                    { 'Idempotency-Key': idempotencyKey }
                )
            })
            createdId = result1.recipe.id

            const result2 = await test.step('send second create request with same key', async () => {
                return await apiPost<{ recipe: { id: string } }>(
                    page.context(),
                    '/commands/create_recipe',
                    { recipe: { ...TEST_RECIPE, id: '' } },
                    { 'Idempotency-Key': idempotencyKey }
                )
            })

            await test.step('verify both responses return the same recipe ID', async () => {
                expect(result2.recipe.id).toBe(result1.recipe.id)
            })

            await test.step('verify exactly one recipe exists with this title', async () => {
                const { recipes } = await fetchAllRecipes(page.context())
                const matches = recipes.filter(r => r.title === TEST_RECIPE.title)
                expect(matches).toHaveLength(1)
            })
        })
    })
})
