import { chromium } from '@playwright/test'
import path from 'path'

export const AUTH_STATE_PATH = path.join('e2e', '.auth', 'user.json')

export default async function globalSetup() {
    const browser = await chromium.launch()
    const context = await browser.newContext()
    const response = await context.request.post('http://localhost:5174/api/e2e/login')
    if (!response.ok()) throw new Error(`E2E login failed: ${response.status()}`)
    await context.storageState({ path: AUTH_STATE_PATH })
    await browser.close()
}
