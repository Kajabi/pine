import { devices, expect, PlaywrightTestConfig, PlaywrightTestOptions, PlaywrightWorkerOptions, Project } from '@playwright/test';

import {matchers } from '@stencil/playwright';

expect.extend(matchers);

/* Configure projects for major browsers */
const projects: Project<PlaywrightTestOptions, PlaywrightWorkerOptions>[] = [
  {
          name: 'chromium',
          use: { ...devices['Desktop Chrome'] },
        },

        {
          name: 'firefox',
          use: { ...devices['Desktop Firefox'] },
        },

        {
          name: 'webkit',
          use: { ...devices['Desktop Safari'] },
        },

        /* Test against mobile viewports. */
        {
          name: 'Mobile Chrome',
          use: { ...devices['Pixel 5'] },
        },
        {
          name: 'Mobile Safari',
          use: { ...devices['iPhone 12'] },
        },

        /* Test against branded browsers. */
        {
          name: 'Microsoft Edge',
          use: { ...devices['Desktop Edge'], channel: 'msedge' },
        },
        {
          name: 'Google Chrome',
          use: { ...devices['Desktop Chrome'], channel: 'chrome' },
        },
];

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const config: PlaywrightTestConfig = {

  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Run tests in files in parallel */
  fullyParallel: true,
  projects,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html', { open: 'never' }],
    [process.env.CI ? 'github' : 'list'],
  ],
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  testDir: './src/components',
  testMatch: '*.e2e.playwright.ts',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
    actionTimeout: 0,
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:7334',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },
  /* Run your local dev server before starting the tests */
    // webServer: {
    //     command: 'npm run start.stencil',
    //     url: 'http://localhost:3333/',
    //     reuseExistingServer: true,
    //     timeout: 90000,
    // },
    webServer: {
      command: 'serve -p 7334',
      port: 7334,
      reuseExistingServer: !process.env.CI,
  },
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
};

export default config;
