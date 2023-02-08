import { test, expect } from '@playwright/test';

test('test home page', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('rule-icon')).toBeVisible();
  await expect(page).toHaveTitle(/Taboo.AI/);
  const heading = page.getByTestId('heading-title');
  await expect(heading).toHaveText(/Taboo.AI/);
  const startButton = page.getByTestId('link-start');
  await expect(startButton).toHaveText(/Choose Topics/);
  await expect(startButton).toHaveAttribute('href', '/levels');
  const lightDarkThemeButton = page.getByTestId('light-dark-toggle-button');
  await expect(lightDarkThemeButton).toBeEnabled();
  await lightDarkThemeButton.click();
  await expect(page.locator('a').first()).toHaveAttribute('href', '/rule');
});
