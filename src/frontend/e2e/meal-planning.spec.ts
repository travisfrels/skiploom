import { test, expect } from '@playwright/test'
import {
    createTestMealPlanEntry,
    deleteTestMealPlanEntry,
    setFeatureFlag,
} from './helpers'

test.use({ storageState: 'e2e/.auth/user.json' })

function getWeekStart(date: Date): Date {
    const result = new Date(date)
    const day = result.getDay()
    const diff = day === 0 ? 6 : day - 1
    result.setDate(result.getDate() - diff)
    result.setHours(0, 0, 0, 0)
    return result
}

function formatDateISO(date: Date): string {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

test.describe('Meal Planning Nav Link', () => {
    test('shows Meal Planning link when flag is enabled', async ({ browser, page }) => {
        const ctx = await browser.newContext()
        await setFeatureFlag(ctx, 'MEAL_PLANNING', true)
        await ctx.close()

        try {
            await page.goto('/')
            await expect(page.getByRole('link', { name: 'Meal Planning' })).toBeVisible()
        } finally {
            const cleanup = await browser.newContext()
            await setFeatureFlag(cleanup, 'MEAL_PLANNING', false)
            await cleanup.close()
        }
    })

    test('hides Meal Planning link when flag is disabled', async ({ browser, page }) => {
        const ctx = await browser.newContext()
        await setFeatureFlag(ctx, 'MEAL_PLANNING', false)
        await ctx.close()

        await page.goto('/')
        await expect(page.getByRole('link', { name: 'Meal Planning' })).not.toBeVisible()
    })
})

test.describe('Meal Planning Calendar', () => {
    test.beforeAll(async ({ browser }) => {
        const context = await browser.newContext()
        await setFeatureFlag(context, 'MEAL_PLANNING', true)
        await context.close()
    })

    test.afterAll(async ({ browser }) => {
        const context = await browser.newContext()
        await setFeatureFlag(context, 'MEAL_PLANNING', false)
        await context.close()
    })

    test('renders calendar structure with day columns and meal type rows', async ({ page }) => {
        await test.step('navigate to meal planning page', async () => {
            await page.goto('/meal-planning')
        })
        await test.step('verify page heading is visible', async () => {
            await expect(page.getByRole('heading', { name: 'Meal Planning' })).toBeVisible()
        })
        await test.step('verify week range header is visible', async () => {
            await expect(page.getByTestId('week-range')).toBeVisible()
        })
        await test.step('verify day column headers are visible', async () => {
            for (const day of ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']) {
                await expect(page.getByText(day, { exact: true })).toBeVisible()
            }
        })
        await test.step('verify meal type row headers are visible', async () => {
            for (const mealType of ['Breakfast', 'Brunch', 'Lunch', 'Dinner', 'Snack']) {
                await expect(page.getByText(mealType, { exact: true })).toBeVisible()
            }
        })
        await test.step('verify navigation buttons are visible', async () => {
            await expect(page.getByRole('button', { name: 'Previous week' })).toBeVisible()
            await expect(page.getByRole('button', { name: 'Today' })).toBeVisible()
            await expect(page.getByRole('button', { name: 'Next week' })).toBeVisible()
        })
    })

    test.describe('Entry Display', () => {
        let entryId: string
        const today = new Date()
        const weekStart = getWeekStart(today)
        const wednesdayDate = new Date(weekStart)
        wednesdayDate.setDate(weekStart.getDate() + 2)
        const wednesdayISO = formatDateISO(wednesdayDate)

        const TEST_ENTRY = {
            date: wednesdayISO,
            mealType: 'LUNCH',
            title: 'E2E Test Lunch',
        }

        test.beforeEach(async ({ page }) => {
            entryId = await createTestMealPlanEntry(page.context(), TEST_ENTRY)
        })

        test.afterEach(async ({ page }) => {
            await deleteTestMealPlanEntry(page.context(), entryId)
        })

        test('displays meal plan entry in the correct cell', async ({ page }) => {
            await test.step('navigate to meal planning page', async () => {
                await page.goto('/meal-planning')
            })
            await test.step('verify the entry appears in the correct cell', async () => {
                const cell = page.getByTestId(`cell-${wednesdayISO}-LUNCH`)
                await expect(cell.getByText('E2E Test Lunch')).toBeVisible()
            })
        })
    })

    test('navigates between weeks', async ({ page }) => {
        await test.step('navigate to meal planning page', async () => {
            await page.goto('/meal-planning')
        })

        const initialRange = await page.getByTestId('week-range').textContent()

        await test.step('click next week and verify range changes', async () => {
            await page.getByRole('button', { name: 'Next week' }).click()
            const nextRange = await page.getByTestId('week-range').textContent()
            expect(nextRange).not.toBe(initialRange)
        })

        await test.step('click previous week to return and verify range matches', async () => {
            await page.getByRole('button', { name: 'Previous week' }).click()
            const backRange = await page.getByTestId('week-range').textContent()
            expect(backRange).toBe(initialRange)
        })
    })
})
