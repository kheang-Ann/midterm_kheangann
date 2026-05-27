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

test.describe('Dashboard Tests', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('should display dashboard with statistics', async ({ page }) => {
    await page.goto('/dashboard');
    
    await expect(page.locator('h1')).toContainText('Dashboard');
    await expect(page.getByTestId('total-items')).toBeVisible();
    await expect(page.getByTestId('low-stock-items')).toBeVisible();
    await expect(page.getByTestId('total-value')).toBeVisible();
  });

  test('should show correct statistics after adding items', async ({ page }) => {
    // Add a new item
    await page.goto('/inventory/create');
    const timestamp = Date.now();
    
    await page.getByTestId('name-input').fill(`Dashboard Item ${timestamp}`);
    await page.getByTestId('sku-input').fill(`DASH${timestamp}`);
    await page.getByTestId('description-input').fill('Test');
    await page.getByTestId('quantity-input').fill('5'); // Low stock
    await page.getByTestId('price-input').fill('50.00');
    await page.getByTestId('submit-button').click();

    await page.waitForURL('/inventory');

    // Go to dashboard
    await page.goto('/dashboard');
    
    // Check that statistics are updated
    const totalItems = await page.getByTestId('total-items').textContent();
    const lowStockItems = await page.getByTestId('low-stock-items').textContent();
    
    expect(parseInt(totalItems)).toBeGreaterThan(0);
    expect(parseInt(lowStockItems)).toBeGreaterThan(0);
  });

  test('should navigate to create item from dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    
    await page.getByRole('button', { name: 'Add New Item' }).click();
    await expect(page).toHaveURL('/inventory/create');
  });

  test('should display recent items table', async ({ page }) => {
    // Add an item first
    await page.goto('/inventory/create');
    const timestamp = Date.now();
    const itemName = `Recent Item ${timestamp}`;
    
    await page.getByTestId('name-input').fill(itemName);
    await page.getByTestId('sku-input').fill(`REC${timestamp}`);
    await page.getByTestId('description-input').fill('Recent test');
    await page.getByTestId('quantity-input').fill('30');
    await page.getByTestId('price-input').fill('15.99');
    await page.getByTestId('submit-button').click();

    await page.waitForURL('/inventory');

    // Go to dashboard
    await page.goto('/dashboard');
    
    // Check if the item appears in recent items
    await expect(page.locator('table')).toBeVisible();
    await expect(page.getByText(itemName)).toBeVisible();
  });

  test('should navigate between pages using navbar', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Navigate to inventory
    await page.getByRole('link', { name: 'Inventory' }).click();
    await expect(page).toHaveURL('/inventory');
    
    // Navigate back to dashboard
    await page.getByRole('link', { name: 'Dashboard' }).click();
    await expect(page).toHaveURL('/dashboard');
  });

  test('should display user information in navbar', async ({ page }) => {
    await page.goto('/dashboard');
    
    await expect(page.locator('.navbar')).toContainText('Welcome');
  });
});
