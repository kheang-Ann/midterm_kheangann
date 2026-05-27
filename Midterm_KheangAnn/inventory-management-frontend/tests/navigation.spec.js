import { test, expect } from '@playwright/test';

// Helper function to login
async function login(page) {
  const timestamp = Date.now();
  const email = `user${timestamp}@example.com`;
  const password = 'password123';

  await page.goto('/register');
  await page.getByTestId('username-input').fill(`user${timestamp}`);
  await page.getByTestId('email-input').fill(email);
  await page.getByTestId('password-input').fill(password);
  await page.getByTestId('confirm-password-input').fill(password);
  await page.getByTestId('register-button').click();

  await page.waitForURL('/login');
  await page.getByTestId('email-input').fill(email);
  await page.getByTestId('password-input').fill(password);
  await page.getByTestId('login-button').click();

  await page.waitForURL('/dashboard');
}

test.describe('Navigation Tests', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('should navigate from dashboard to inventory', async ({ page }) => {
    await page.goto('/dashboard');
    await page.getByRole('link', { name: 'Inventory' }).click();
    await expect(page).toHaveURL('/inventory');
  });

  test('should navigate from inventory to create page', async ({ page }) => {
    await page.goto('/inventory');
    await page.getByTestId('add-item-button').click();
    await expect(page).toHaveURL('/inventory/create');
  });

  test('should navigate back from create page', async ({ page }) => {
    await page.goto('/inventory/create');
    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page).toHaveURL('/inventory');
  });

  test('should navigate using browser back button', async ({ page }) => {
    await page.goto('/dashboard');
    await page.goto('/inventory');
    await page.goBack();
    await expect(page).toHaveURL('/dashboard');
  });
});
