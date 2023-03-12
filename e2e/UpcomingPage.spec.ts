import { test, expect } from '@playwright/test';

test('test whats new page', async ({ page }) => {
  await page.goto('/upcoming');
  await page.getByTestId('content-article').waitFor();
  await expect(page.getByTestId('content-article')).toContainText(
    /Upcoming Features/
  );
});
