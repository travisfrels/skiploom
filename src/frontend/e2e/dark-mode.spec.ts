import { test, expect, type BrowserContext } from '@playwright/test'
import { BASE_URL } from './global-setup'

test.use({ storageState: 'e2e/.auth/user.json' })

const TEST_RECIPE = {
    title: 'Dark Mode Test Recipe',
    description: 'Created by dark mode E2E smoke test',
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

// Tailwind v4 uses oklch internally and modern Chromium preserves oklch in
// computed styles. oklch lightness ranges from 0 (black) to 1 (white).
function isDarkBackground(bgColor: string, lightnessThreshold = 0.3): boolean {
    const oklchMatch = bgColor.match(/oklch\(([\d.]+)/)
    if (oklchMatch) return Number(oklchMatch[1]) < lightnessThreshold

    const rgbMatch = bgColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
    if (rgbMatch) {
        const threshold = 50
        return Number(rgbMatch[1]) < threshold && Number(rgbMatch[2]) < threshold && Number(rgbMatch[3]) < threshold
    }

    return false
}

test.describe('Dark Mode', () => {
    let recipeId: string

    test.beforeEach(async ({ page }) => { recipeId = await createTestRecipe(page.context()) })
    test.afterEach(async ({ page }) => { await deleteTestRecipe(page.context(), recipeId) })

    test('renders dark backgrounds when dark color scheme is active', async ({ page }) => {
        await test.step('activate dark color scheme', async () => {
            await page.emulateMedia({ colorScheme: 'dark' })
        })

        await test.step('navigate to the recipe list', async () => {
            await page.goto('/recipes')
        })

        await test.step('verify the page background is dark', async () => {
            const bgColor = await page.locator('div.min-h-screen').evaluate(
                el => getComputedStyle(el).backgroundColor
            )
            expect(isDarkBackground(bgColor)).toBe(true)
        })

        await test.step('verify a recipe card background is dark', async () => {
            const cardBgColor = await page.locator('a').filter({ hasText: TEST_RECIPE.title }).evaluate(
                el => getComputedStyle(el).backgroundColor
            )
            expect(isDarkBackground(cardBgColor)).toBe(true)
        })
    })
})
