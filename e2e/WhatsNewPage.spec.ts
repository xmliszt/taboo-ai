import { test, expect } from '@playwright/test';

test('test whats new page', async ({ page }) => {
  await page.goto('/whatsnew');
  await page.getByTestId('content-article').waitFor();
  await expect(page.getByTestId('content-article')).toContainText(/What's New/);
});
