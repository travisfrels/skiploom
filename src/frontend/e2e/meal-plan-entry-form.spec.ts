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

const today = new Date()
const weekStart = getWeekStart(today)
const wednesdayDate = new Date(weekStart)
wednesdayDate.setDate(weekStart.getDate() + 2)
const wednesdayISO = formatDateISO(wednesdayDate)

test.describe('Meal Plan Entry Form', () => {
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

    test.describe('Create Entry', () => {
        let createdEntryId: string

        test.afterEach(async ({ page }) => {
            if (createdEntryId) {
                try {
                    await deleteTestMealPlanEntry(page.context(), createdEntryId)
                } catch {
                    // Entry may not have been created if test failed early
                }
            }
        })

        test('creates an ad-hoc meal plan entry via form and redirects to calendar', async ({ page }) => {
            await test.step('navigate to the new entry form with query params', async () => {
                await page.goto(`/meal-planning/new?date=${wednesdayISO}&mealType=LUNCH`)
            })
            await test.step('verify date and meal type are pre-filled', async () => {
                await expect(page.getByLabel('Date *')).toHaveValue(wednesdayISO)
                await expect(page.getByLabel('Meal Type *')).toHaveValue('LUNCH')
            })
            await test.step('fill in the title', async () => {
                await page.getByLabel('Title *').fill('E2E Ad-hoc Lunch')
            })
            await test.step('submit the form', async () => {
                await page.getByRole('button', { name: 'Create Entry' }).click()
                await page.waitForURL('**/meal-planning')
            })
            await test.step('verify the entry appears on the calendar', async () => {
                const cell = page.getByTestId(`cell-${wednesdayISO}-LUNCH`)
                await expect(cell.getByText('E2E Ad-hoc Lunch')).toBeVisible()
            })
            await test.step('capture entry id for cleanup', async () => {
                const cell = page.getByTestId(`cell-${wednesdayISO}-LUNCH`)
                const entryButton = cell.getByText('E2E Ad-hoc Lunch')
                const testId = await entryButton.getAttribute('data-testid')
                createdEntryId = testId?.replace('entry-', '') ?? ''
            })
        })
    })

    test.describe('Update Entry', () => {
        let entryId: string

        test.beforeEach(async ({ page }) => {
            entryId = await createTestMealPlanEntry(page.context(), {
                date: wednesdayISO,
                mealType: 'DINNER',
                title: 'E2E Original Dinner',
            })
        })

        test.afterEach(async ({ page }) => {
            await deleteTestMealPlanEntry(page.context(), entryId)
        })

        test('updates entry title via form and shows updated title on calendar', async ({ page }) => {
            await test.step('navigate to the edit form', async () => {
                await page.goto(`/meal-planning/${entryId}/edit`)
            })
            await test.step('verify fields are pre-populated', async () => {
                await expect(page.getByLabel('Date *')).toHaveValue(wednesdayISO)
                await expect(page.getByLabel('Meal Type *')).toHaveValue('DINNER')
                await expect(page.getByLabel('Title *')).toHaveValue('E2E Original Dinner')
            })
            await test.step('update the title', async () => {
                await page.getByLabel('Title *').clear()
                await page.getByLabel('Title *').fill('E2E Updated Dinner')
            })
            await test.step('submit the form', async () => {
                await page.getByRole('button', { name: 'Save Changes' }).click()
                await page.waitForURL('**/meal-planning')
            })
            await test.step('verify the updated title appears on the calendar', async () => {
                const cell = page.getByTestId(`cell-${wednesdayISO}-DINNER`)
                await expect(cell.getByText('E2E Updated Dinner')).toBeVisible()
            })
        })
    })

    test.describe('Delete Entry', () => {
        let entryId: string

        test.beforeEach(async ({ page }) => {
            entryId = await createTestMealPlanEntry(page.context(), {
                date: wednesdayISO,
                mealType: 'BREAKFAST',
                title: 'E2E Delete Breakfast',
            })
        })

        test.afterEach(async ({ page }) => {
            try {
                await deleteTestMealPlanEntry(page.context(), entryId)
            } catch {
                // Entry was already deleted by the test — no cleanup needed
            }
        })

        test('deletes entry via edit form and redirects to calendar', async ({ page }) => {
            await test.step('navigate to the edit form', async () => {
                await page.goto(`/meal-planning/${entryId}/edit`)
                await expect(page.getByRole('heading', { name: 'Edit Meal Plan Entry' })).toBeVisible()
            })
            await test.step('click delete and accept the confirmation dialog', async () => {
                page.on('dialog', dialog => dialog.accept())
                await page.getByRole('button', { name: 'Delete' }).click()
            })
            await test.step('verify redirect to the calendar', async () => {
                await page.waitForURL('**/meal-planning')
                const cell = page.getByTestId(`cell-${wednesdayISO}-BREAKFAST`)
                await expect(cell.getByText('E2E Delete Breakfast')).not.toBeVisible()
            })
        })
    })
})
