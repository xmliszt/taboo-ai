import { test, expect } from '@playwright/test';

test('test home page', async ({ page }) => {
  await page.goto('/rule');
  await expect(page.getByTestId('heading-rule-title')).toHaveText(
    'How To Play Taboo.AI?'
  );
  await expect(page.locator('#back')).toBeVisible();
  await page.getByTestId('light-dark-toggle-button').click();
});
