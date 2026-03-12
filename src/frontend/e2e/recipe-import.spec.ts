import { test, expect } from '@playwright/test'
import { deleteTestRecipe, setFeatureFlag } from './helpers'

test.use({ storageState: 'e2e/.auth/user.json' })

function encodeRecipeData(recipe: unknown): string {
    const json = JSON.stringify(recipe)
    const utf8 = new TextEncoder().encode(json)
    const binary = String.fromCharCode(...utf8)
    return btoa(binary)
}

const IMPORT_RECIPE = {
    title: 'E2E Import Test Recipe',
    description: 'Imported by automated E2E tests',
    category: 'DESSERT',
    ingredients: [
        { orderIndex: 1, amount: 2, unit: 'cups', name: 'flour' },
        { orderIndex: 2, amount: 0.5, unit: 'cup', name: 'sugar' },
    ],
    steps: [
        { orderIndex: 1, instruction: 'Preheat oven to 350°F.' },
        { orderIndex: 2, instruction: 'Mix dry ingredients together.' },
    ],
}

test.describe('Recipe Import', () => {
    test.beforeAll(async ({ browser }) => {
        const context = await browser.newContext()
        await setFeatureFlag(context, 'RECIPE_IMPORT', true)
        await context.close()
    })

    test.afterAll(async ({ browser }) => {
        const context = await browser.newContext()
        await setFeatureFlag(context, 'RECIPE_IMPORT', false)
        await context.close()
    })

    test.describe('Import from URL fragment', () => {
        let createdId: string

        test.afterEach(async ({ page }) => {
            if (createdId) {
                await deleteTestRecipe(page.context(), createdId)
            }
        })

        test('populates form from URL fragment and creates recipe', async ({ page }) => {
            const encoded = encodeRecipeData(IMPORT_RECIPE)

            await test.step('navigate to the import page with encoded recipe data', async () => {
                await page.goto(`/recipes/import#data=${encoded}`)
            })
            await test.step('verify the form heading shows Import Recipe', async () => {
                await expect(page.getByText('Import Recipe')).toBeVisible()
            })
            await test.step('verify the title field is populated', async () => {
                await expect(page.getByLabel('Title')).toHaveValue(IMPORT_RECIPE.title)
            })
            await test.step('verify the description field is populated', async () => {
                await expect(page.getByLabel('Description')).toHaveValue(IMPORT_RECIPE.description)
            })
            await test.step('verify the category is selected', async () => {
                await expect(page.getByLabel('Category')).toHaveValue('DESSERT')
            })
            await test.step('verify ingredient fields are populated', async () => {
                const amtInputs = page.getByPlaceholder('Amt')
                const unitInputs = page.getByPlaceholder('Unit')
                const nameInputs = page.getByPlaceholder('Ingredient name')
                await expect(amtInputs.nth(0)).toHaveValue(/^2$/)
                await expect(unitInputs.nth(0)).toHaveValue('cups')
                await expect(nameInputs.nth(0)).toHaveValue('flour')
                // Amount may display as '0.5' or '1/2' depending on FRACTION_AMOUNTS flag
                await expect(amtInputs.nth(1)).toHaveValue(/^(0\.5|1\/2)$/)
                await expect(unitInputs.nth(1)).toHaveValue('cup')
                await expect(nameInputs.nth(1)).toHaveValue('sugar')
            })
            await test.step('verify step fields are populated', async () => {
                const stepInputs = page.getByPlaceholder('Describe this step')
                await expect(stepInputs.nth(0)).toHaveValue(IMPORT_RECIPE.steps[0].instruction)
                await expect(stepInputs.nth(1)).toHaveValue(IMPORT_RECIPE.steps[1].instruction)
            })
            await test.step('submit the import form', async () => {
                await page.getByRole('button', { name: 'Import' }).click()
                await page.waitForURL(/\/recipes\/[0-9a-f-]+$/)
                createdId = page.url().split('/').pop()!
            })
            await test.step('verify the recipe detail page shows correct data', async () => {
                await expect(page.getByText(IMPORT_RECIPE.title)).toBeVisible()
                await expect(page.getByText('Dessert')).toBeVisible()
            })
        })
    })

    test.describe('Error states', () => {
        test('shows error for missing fragment data', async ({ page }) => {
            await test.step('navigate to import page without hash', async () => {
                await page.goto('/recipes/import')
            })
            await test.step('verify error message is displayed', async () => {
                await expect(page.getByText('No recipe data found in URL.')).toBeVisible()
            })
        })

        test('shows error for malformed fragment data', async ({ page }) => {
            await test.step('navigate to import page with invalid data', async () => {
                await page.goto('/recipes/import#data=!!!invalid!!!')
            })
            await test.step('verify error message is displayed', async () => {
                await expect(page.getByText('Unable to decode recipe data.')).toBeVisible()
            })
        })
    })
})

test.describe('Recipe Import - Flag Disabled', () => {
    test.beforeAll(async ({ browser }) => {
        const context = await browser.newContext()
        await setFeatureFlag(context, 'RECIPE_IMPORT', false)
        await context.close()
    })

    test('route is not accessible when feature flag is disabled', async ({ page }) => {
        const encoded = encodeRecipeData(IMPORT_RECIPE)

        await test.step('navigate to import page with valid data', async () => {
            await page.goto(`/recipes/import#data=${encoded}`)
        })
        await test.step('verify import form is not shown', async () => {
            await expect(page.getByText('Import Recipe')).not.toBeVisible()
        })
    })
})
