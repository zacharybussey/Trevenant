// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { open: 'never' }],
    ['list']
  ],
  use: {
    baseURL: 'http://localhost:1234',

    // Capture screenshot on failure
    screenshot: 'only-on-failure',

    // Record video on failure
    video: 'retain-on-failure',

    // Capture trace on first retry
    trace: 'on-first-retry',

    // Action timeout - app is snappy, no network requests
    actionTimeout: 3000,

    // Navigation timeout
    navigationTimeout: 5000,
  },

  // Global timeout per test - keep reasonable but not excessive
  timeout: 15000,

  // Expect timeout
  expect: {
    timeout: 3000,
  },

  projects: [
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
  ],

  /* Run local dev server before starting the tests */
  webServer: {
    command: 'npm start',
    url: 'http://localhost:1234',
    reuseExistingServer: !process.env.CI,
    timeout: 60000,  // Server startup can take a moment
  },
});
