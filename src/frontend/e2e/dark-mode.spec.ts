import { test, expect } from '@playwright/test'
import { createTestRecipe, deleteTestRecipe } from './helpers'

test.use({ storageState: 'e2e/.auth/user.json' })

const TEST_RECIPE = {
    title: 'Dark Mode Test Recipe',
    description: 'Created by dark mode E2E smoke test',
    ingredients: [{ orderIndex: 1, amount: 1, unit: 'cup', name: 'flour' }],
    steps: [{ orderIndex: 1, instruction: 'Mix the ingredients.' }]
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

    test.beforeEach(async ({ page }) => { recipeId = await createTestRecipe(page.context(), TEST_RECIPE) })
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
