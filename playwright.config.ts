import { defineConfig, devices } from '@playwright/test';
import { ENV, STORAGE_STATE } from './src/utils/env';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: ENV.isCI,
  // Public demo sites can be slow, so retry in CI and keep parallelism modest.
  retries: ENV.isCI ? 2 : 0,
  workers: ENV.isCI ? 2 : 3,
  timeout: 45_000,
  expect: { timeout: 10_000 },

  reporter: [['list'], ['html', { open: 'never' }]],

  use: {
    baseURL: ENV.baseUrl,
    actionTimeout: 15_000,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    // 1. Logs in once via API and saves the browser state for UI tests.
    {
      name: 'setup',
      testMatch: /setup\/.*\.setup\.ts/,
    },

    // 2. Pure API tests: no browser is launched.
    {
      name: 'api',
      testMatch: /api\/.*\.spec\.ts/,
    },

    // 3. UI + hybrid tests, already logged in through the saved storage state.
    {
      name: 'chromium',
      testMatch: /(ui|hybrid)\/.*\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], storageState: STORAGE_STATE },
      dependencies: ['setup'],
    },
    {
      name: 'firefox',
      testMatch: /(ui|hybrid)\/.*\.spec\.ts/,
      use: { ...devices['Desktop Firefox'], storageState: STORAGE_STATE },
      dependencies: ['setup'],
    },
  ],
});
