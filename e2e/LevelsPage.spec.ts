import { test, expect } from '@playwright/test';

test('test levels page', async ({ page }) => {
  await page.goto('/levels');
  await page.getByTestId('levels-heading-title').waitFor();
  await expect(page.getByTestId('levels-heading-title')).toHaveText(
    'Choose A Category'
  );
  await expect(page.getByTestId(/level-link-.*/)).toHaveCount(14);
  await expect(page.locator('#ai-mode')).toHaveCount(1);
});
