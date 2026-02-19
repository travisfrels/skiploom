import { test, expect, type BrowserContext } from '@playwright/test'
import { BASE_URL } from './global-setup'

test.use({ storageState: 'e2e/.auth/user.json' })

const TEST_RECIPE = {
    title: 'E2E Test Recipe',
    description: 'Created by automated E2E tests',
    ingredients: [{ orderIndex: 1, amount: 1, unit: 'cup', name: 'flour' }],
    steps: [{ orderIndex: 1, instruction: 'Mix the ingredients.' }]
}

async function apiPost<T>(context: BrowserContext, path: string, body: unknown): Promise<T> {
    // CookieCsrfTokenRepository only writes XSRF-TOKEN when a request triggers
    // CsrfTokenMaterializingFilter. A GET to any API endpoint materializes the
    // cookie so the token is available for the subsequent mutating request.
    await context.request.get(`${BASE_URL}/api/queries/fetch_all_recipes`)
    const cookies = await context.cookies()
    const csrfCookie = cookies.find(c => c.name === 'XSRF-TOKEN')
    const csrfToken = csrfCookie ? decodeURIComponent(csrfCookie.value) : ''
    const response = await context.request.post(`${BASE_URL}/api${path}`, {
        headers: {
            'Content-Type': 'application/json',
            'X-XSRF-TOKEN': csrfToken,
        },
        data: body,
    })
    if (!response.ok()) throw new Error(`API ${path} failed: ${response.status()}`)
    return response.json()
}

async function createTestRecipe(context: BrowserContext): Promise<string> {
    const result = await apiPost<{ recipe: { id: string } }>(
        context, '/commands/create_recipe', { recipe: { ...TEST_RECIPE, id: '' } }
    )
    return result.recipe.id
}

async function deleteTestRecipe(context: BrowserContext, id: string): Promise<void> {
    await apiPost(context, '/commands/delete_recipe', { id })
}

test.describe('Recipe List', () => {
    let recipeId: string

    test.beforeEach(async ({ page }) => { recipeId = await createTestRecipe(page.context()) })
    test.afterEach(async ({ page }) => { await deleteTestRecipe(page.context(), recipeId) })

    test('shows created recipe in the list', async ({ page }) => {
        await test.step('navigate to the recipe list', async () => {
            await page.goto('/recipes')
        })
        await test.step('verify the recipe appears in the list', async () => {
            await expect(page.getByText(TEST_RECIPE.title)).toBeVisible()
        })
    })
})

test.describe('Recipe Detail', () => {
    let recipeId: string

    test.beforeEach(async ({ page }) => { recipeId = await createTestRecipe(page.context()) })
    test.afterEach(async ({ page }) => { await deleteTestRecipe(page.context(), recipeId) })

    test('shows recipe title and description on detail page', async ({ page }) => {
        await test.step('navigate to the recipe detail page', async () => {
            await page.goto(`/recipes/${recipeId}`)
        })
        await test.step('verify the recipe title is visible', async () => {
            await expect(page.getByText(TEST_RECIPE.title)).toBeVisible()
        })
        await test.step('verify the recipe description is visible', async () => {
            await expect(page.getByText(TEST_RECIPE.description)).toBeVisible()
        })
    })
})

test.describe('Recipe Create', () => {
    let createdId: string

    test.afterEach(async ({ page }) => {
        if (createdId) {
            await apiPost(page.context(), '/commands/delete_recipe', { id: createdId })
        }
    })

    test('creates a recipe via form and redirects to detail page', async ({ page }) => {
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
        await test.step('verify the recipe detail page is shown', async () => {
            await expect(page.getByText(TEST_RECIPE.title)).toBeVisible()
        })
    })
})

test.describe('Recipe Update', () => {
    let recipeId: string

    test.beforeEach(async ({ page }) => { recipeId = await createTestRecipe(page.context()) })
    test.afterEach(async ({ page }) => { await deleteTestRecipe(page.context(), recipeId) })

    test('updates recipe title via form and shows updated title on detail page', async ({ page }) => {
        await test.step('navigate to the edit form', async () => {
            await page.goto(`/recipes/${recipeId}/edit`)
        })
        await test.step('update the recipe title', async () => {
            await page.getByLabel('Title').clear()
            await page.getByLabel('Title').fill('Updated E2E Recipe')
        })
        await test.step('submit the form', async () => {
            await page.getByRole('button', { name: 'Save Changes' }).click()
            await page.waitForURL(new RegExp(`/recipes/${recipeId}$`))
        })
        await test.step('verify the updated title is shown on the detail page', async () => {
            await expect(page.getByText('Updated E2E Recipe')).toBeVisible()
        })
    })
})

test.describe('Recipe Delete', () => {
    let recipeId: string

    test.beforeEach(async ({ page }) => { recipeId = await createTestRecipe(page.context()) })
    test.afterEach(async ({ page }) => {
        try {
            await deleteTestRecipe(page.context(), recipeId)
        } catch {
            // Recipe was already deleted by the test — no cleanup needed
        }
    })

    test('deletes a recipe via detail page and redirects to list', async ({ page }) => {
        await test.step('navigate to the recipe detail page', async () => {
            await page.goto(`/recipes/${recipeId}`)
        })
        await test.step('click delete and accept the confirmation dialog', async () => {
            page.on('dialog', dialog => dialog.accept())
            await page.getByRole('button', { name: 'Delete' }).click()
        })
        await test.step('verify redirect to the recipe list', async () => {
            await page.waitForURL('**/recipes')
            await expect(page.getByText(TEST_RECIPE.title)).not.toBeVisible()
        })
    })
})
