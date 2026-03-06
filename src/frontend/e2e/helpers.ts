import { type BrowserContext } from '@playwright/test'
import { BASE_URL } from './global-setup'

export interface TestRecipe {
    title: string
    description: string
    ingredients: { orderIndex: number; amount: number; unit: string; name: string }[]
    steps: { orderIndex: number; instruction: string }[]
}

// CookieCsrfTokenRepository only writes XSRF-TOKEN when a request triggers
// CsrfTokenMaterializingFilter. A GET to any API endpoint materializes the
// cookie so the token is available for the subsequent mutating request.
export async function apiPost<T>(
    context: BrowserContext,
    path: string,
    body: unknown,
    extraHeaders?: Record<string, string>
): Promise<T> {
    await context.request.get(`${BASE_URL}/api/queries/fetch_all_recipes`)
    const cookies = await context.cookies()
    const csrfCookie = cookies.find(c => c.name === 'XSRF-TOKEN')
    const csrfToken = csrfCookie ? decodeURIComponent(csrfCookie.value) : ''
    const response = await context.request.post(`${BASE_URL}/api${path}`, {
        headers: {
            'Content-Type': 'application/json',
            'X-XSRF-TOKEN': csrfToken,
            ...extraHeaders,
        },
        data: body,
    })
    if (!response.ok()) throw new Error(`API ${path} failed: ${response.status()}`)
    return response.json()
}

export async function fetchAllRecipes(
    context: BrowserContext
): Promise<{ recipes: { id: string; title: string }[] }> {
    const response = await context.request.get(`${BASE_URL}/api/queries/fetch_all_recipes`)
    if (!response.ok()) throw new Error(`fetch_all_recipes failed: ${response.status()}`)
    return response.json()
}

export async function createTestRecipe(context: BrowserContext, recipe: TestRecipe): Promise<string> {
    const result = await apiPost<{ recipe: { id: string } }>(
        context, '/commands/create_recipe', { recipe: { ...recipe, id: '' } }
    )
    return result.recipe.id
}

export async function deleteTestRecipe(context: BrowserContext, id: string): Promise<void> {
    await apiPost(context, '/commands/delete_recipe', { id })
}

// /api/e2e/** endpoints bypass CSRF and authentication (E2eSecurityConfig),
// so no XSRF token handling is needed here.
export async function setFeatureFlag(
    context: BrowserContext,
    featureName: string,
    enabled: boolean
): Promise<void> {
    const response = await context.request.post(
        `${BASE_URL}/api/e2e/feature-flags/${featureName}`,
        {
            headers: { 'Content-Type': 'application/json' },
            data: { enabled },
        }
    )
    if (!response.ok()) {
        throw new Error(`Set feature flag ${featureName} failed: ${response.status()}`)
    }
}
