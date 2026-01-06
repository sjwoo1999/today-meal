import { defineConfig, devices } from '@playwright/test';

/**
 * OneMealToday E2E Test Configuration
 * Based on prompts/page_simulation_test.json specification
 *
 * Breakpoints:
 * - mobile: 375x812 (iPhone 14)
 * - tablet: 768x1024 (iPad)
 * - desktop: 1440x900
 */

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['list', { printSteps: true }],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
  ],
  timeout: 30000,
  expect: {
    timeout: 5000,
  },
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
    actionTimeout: 10000,
    navigationTimeout: 15000,
  },
  projects: [
    // Mobile viewport - iPhone 14
    {
      name: 'mobile',
      use: {
        ...devices['iPhone 14'],
        viewport: { width: 375, height: 812 },
        hasTouch: true,
        isMobile: true,
      },
    },
    // Tablet viewport - iPad
    {
      name: 'tablet',
      use: {
        ...devices['iPad'],
        viewport: { width: 768, height: 1024 },
        hasTouch: true,
        isMobile: false,
      },
    },
    // Desktop viewport
    {
      name: 'desktop',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 },
        hasTouch: false,
        isMobile: false,
      },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
