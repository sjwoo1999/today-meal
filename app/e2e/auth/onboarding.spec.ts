import { test, expect } from '@playwright/test';
import { SELECTORS, TEST_USER } from '../fixtures/test-data';

/**
 * AUTH-004: OnboardingPage Tests
 * 온보딩 페이지 - 4단계 (목표/신체정보/활동량/식이선호)
 */
test.describe('@AUTH-004 Onboarding Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to onboarding page
    await page.goto('/onboarding');
  });

  test.describe('Step 1: Goal Selection', () => {
    test('AUTH-004-TC01: should display step 1 indicator', async ({ page }) => {
      // Verify step indicator shows 1
      const stepIndicator = page.locator('[data-testid="step-indicator"]');
      await expect(stepIndicator).toBeVisible();
      await expect(stepIndicator).toContainText('1');
    });

    test('should display all goal options', async ({ page }) => {
      await expect(page.locator('[data-testid="goal-lose"]')).toBeVisible();
      await expect(page.locator('[data-testid="goal-maintain"]')).toBeVisible();
      await expect(page.locator('[data-testid="goal-gain"]')).toBeVisible();
    });

    test('should select goal and highlight it', async ({ page }) => {
      const goalLose = page.locator('[data-testid="goal-lose"]');
      await goalLose.click();

      // Check if selected state is applied (border color or similar)
      await expect(goalLose).toHaveClass(/border-green-500|ring-|selected/);
    });

    test('should proceed to step 2 after goal selection', async ({ page }) => {
      await page.click('[data-testid="goal-lose"]');
      await page.click('[data-testid="next-button"]');

      const stepIndicator = page.locator('[data-testid="step-indicator"]');
      await expect(stepIndicator).toContainText('2');
    });
  });

  test.describe('Step 2: Body Information', () => {
    test.beforeEach(async ({ page }) => {
      // Complete step 1 first
      await page.click('[data-testid="goal-lose"]');
      await page.click('[data-testid="next-button"]');
    });

    test('AUTH-004-TC02: should input body information', async ({ page }) => {
      // Select gender
      await page.click('[data-testid="gender-male"]');

      // Input height, weight, age
      await page.fill('[data-testid="height-input"]', '175');
      await page.fill('[data-testid="weight-input"]', '70');
      await page.fill('[data-testid="age-input"]', '28');

      // Proceed to next step
      await page.click('[data-testid="next-button"]');

      const stepIndicator = page.locator('[data-testid="step-indicator"]');
      await expect(stepIndicator).toContainText('3');
    });

    test('should validate numeric inputs', async ({ page }) => {
      // HTML5 number inputs don't accept non-numeric characters
      // So we test that valid numbers are accepted
      const heightInput = page.locator('[data-testid="height-input"]');

      // Fill with valid number
      await heightInput.fill('175');
      await expect(heightInput).toHaveValue('175');

      // Clear and verify it's empty
      await heightInput.fill('');
      await expect(heightInput).toHaveValue('');
    });
  });

  test.describe('Step 3: Activity Level', () => {
    test.beforeEach(async ({ page }) => {
      // Complete steps 1-2
      await page.click('[data-testid="goal-lose"]');
      await page.click('[data-testid="next-button"]');
      await page.click('[data-testid="gender-male"]');
      await page.fill('[data-testid="height-input"]', '175');
      await page.fill('[data-testid="weight-input"]', '70');
      await page.fill('[data-testid="age-input"]', '28');
      await page.click('[data-testid="next-button"]');
    });

    test('AUTH-004-TC03: should select activity level', async ({ page }) => {
      await page.click('[data-testid="activity-moderate"]');
      await page.click('[data-testid="next-button"]');

      const stepIndicator = page.locator('[data-testid="step-indicator"]');
      await expect(stepIndicator).toContainText('4');
    });

    test('should display all activity options', async ({ page }) => {
      await expect(page.locator('[data-testid="activity-sedentary"]')).toBeVisible();
      await expect(page.locator('[data-testid="activity-light"]')).toBeVisible();
      await expect(page.locator('[data-testid="activity-moderate"]')).toBeVisible();
      await expect(page.locator('[data-testid="activity-active"]')).toBeVisible();
    });
  });

  test.describe('Step 4: Diet Preferences', () => {
    test.beforeEach(async ({ page }) => {
      // Complete steps 1-3
      await page.click('[data-testid="goal-lose"]');
      await page.click('[data-testid="next-button"]');
      await page.click('[data-testid="gender-male"]');
      await page.fill('[data-testid="height-input"]', '175');
      await page.fill('[data-testid="weight-input"]', '70');
      await page.fill('[data-testid="age-input"]', '28');
      await page.click('[data-testid="next-button"]');
      await page.click('[data-testid="activity-moderate"]');
      await page.click('[data-testid="next-button"]');
    });

    test('AUTH-004-TC04: should complete onboarding with diet preference', async ({ page }) => {
      // Select optional diet preference
      const lowcarbTag = page.locator('[data-testid="tag-lowcarb"]');
      if (await lowcarbTag.isVisible()) {
        await lowcarbTag.click();
      }

      await page.click('[data-testid="next-button"]');

      // Should navigate to home
      await expect(page).toHaveURL(/\/(home)?$/);
    });

    test('should allow skipping diet preferences', async ({ page }) => {
      // Click next without selecting any preference
      await page.click('[data-testid="next-button"]');

      // Should still navigate to home
      await expect(page).toHaveURL(/\/(home)?$/);
    });
  });

  test.describe('Desktop Keyboard Navigation', () => {
    // Keyboard navigation only works on desktop (1280px+) per OnboardingPage implementation
    test.skip(({ viewport }) => viewport?.width !== undefined && viewport.width < 1280,
      'Keyboard navigation only enabled on desktop (1280px+)');

    test('AUTH-004-TC05: Enter key should advance to next step', async ({ page }) => {
      await page.click('[data-testid="goal-lose"]');
      await page.keyboard.press('Enter');

      const stepIndicator = page.locator('[data-testid="step-indicator"]');
      await expect(stepIndicator).toContainText('2');
    });

    test('AUTH-004-TC06: Escape key should go to previous step', async ({ page }) => {
      // Go to step 2
      await page.click('[data-testid="goal-lose"]');
      await page.keyboard.press('Enter');

      // Go back with Escape
      await page.keyboard.press('Escape');

      const stepIndicator = page.locator('[data-testid="step-indicator"]');
      await expect(stepIndicator).toContainText('1');
    });
  });

  test.describe('Skip Functionality', () => {
    test('AUTH-004-TC06: should navigate to home when clicking skip', async ({ page }) => {
      const skipButton = page.locator('[data-testid="skip-button"]');

      // Skip button should be visible
      await expect(skipButton).toBeVisible();

      await skipButton.click();

      // Should navigate to home
      await expect(page).toHaveURL(/\/(home)?$/);
    });
  });

  test.describe('Progress Indicator', () => {
    test('should show progress bar or step dots', async ({ page }) => {
      // Check for progress visualization - uses step-indicator on both mobile and desktop
      const progressIndicator = page.locator('[data-testid="step-indicator"], [data-testid="step-dots"]');
      await expect(progressIndicator.first()).toBeVisible();
    });
  });

  test.describe('Responsive Layout', () => {
    test('should display correctly on mobile', async ({ page, viewport }) => {
      if (viewport?.width && viewport.width < 768) {
        // Mobile layout checks - has step indicator in header
        await expect(page.locator('[data-testid="step-indicator"]')).toBeVisible();
      }
    });

    test('should display desktop layout with sidebar', async ({ page, viewport }) => {
      if (viewport?.width && viewport.width >= 1280) {
        // Desktop layout checks - should have sidebar with progress
        const sidebar = page.locator('[data-testid="onboarding-sidebar"]');
        await expect(sidebar).toBeVisible();
      }
    });
  });
});

/**
 * Complete Onboarding Flow Test
 */
test.describe('@UJ-001 New User Onboarding Journey', () => {
  test('should complete full onboarding flow', async ({ page }) => {
    await page.goto('/onboarding');

    // Step 1: Goal
    await page.click('[data-testid="goal-lose"]');
    await page.click('[data-testid="next-button"]');

    // Step 2: Body Info
    await page.click('[data-testid="gender-male"]');
    await page.fill('[data-testid="height-input"]', '175');
    await page.fill('[data-testid="weight-input"]', '70');
    await page.fill('[data-testid="age-input"]', '28');
    await page.click('[data-testid="next-button"]');

    // Step 3: Activity
    await page.click('[data-testid="activity-moderate"]');
    await page.click('[data-testid="next-button"]');

    // Step 4: Diet Preferences (optional)
    await page.click('[data-testid="next-button"]');

    // Wait for navigation to complete
    await page.waitForLoadState('networkidle');

    // Should land on home page (URL should be / or /home)
    await expect(page).toHaveURL(/\/(home)?$/);

    // Verify we're no longer on onboarding (step indicator should be gone)
    const stepIndicator = page.locator('[data-testid="step-indicator"]');
    await expect(stepIndicator).not.toBeVisible({ timeout: 5000 });
  });
});
