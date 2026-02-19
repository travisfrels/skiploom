import { defineConfig, devices } from '@playwright/test'
import { BASE_URL } from './e2e/global-setup'

export default defineConfig({
  testDir: 'e2e',
  globalSetup: './e2e/global-setup.ts',
  reporter: process.env.CI
    ? [['dot'], ['html', { open: 'never' }]]
    : [['list']],
  use: {
    baseURL: BASE_URL,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
