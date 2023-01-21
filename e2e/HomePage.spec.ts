import { test, expect } from '@playwright/test';

test('test home page', async ({ page }) => {
  await page.goto('/');
  expect(page).toHaveTitle(/Taboo.AI/);
  const heading = page.getByTestId('heading-title');
  expect(heading).toHaveText(/Taboo.AI BETA/);
  const startButton = page.getByTestId('link-start');
  expect(startButton).toHaveText(/START/);
  expect(startButton).toHaveAttribute('href', '/levels');
  const lightDarkThemeButton = page.getByTestId('light-dark-toggle-button');
  expect(lightDarkThemeButton).toBeEnabled();
  await lightDarkThemeButton.click();
  const ruleButton = page.getByTestId(/link-rule/);
  expect(ruleButton).toHaveAttribute('href', '/rule');
});
