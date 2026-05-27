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

test.describe('Inventory CRUD Tests', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('should display inventory list page', async ({ page }) => {
    await page.goto('/inventory');
    
    await expect(page.locator('h1')).toContainText('Inventory Items');
    await expect(page.getByTestId('add-item-button')).toBeVisible();
    await expect(page.getByTestId('search-input')).toBeVisible();
  });

  test('should create a new inventory item', async ({ page }) => {
    await page.goto('/inventory/create');
    
    const timestamp = Date.now();
    await page.getByTestId('name-input').fill(`Test Item ${timestamp}`);
    await page.getByTestId('sku-input').fill(`SKU${timestamp}`);
    await page.getByTestId('description-input').fill('Test description');
    await page.getByTestId('quantity-input').fill('100');
    await page.getByTestId('price-input').fill('29.99');
    
    await page.getByTestId('submit-button').click();

    await expect(page).toHaveURL('/inventory', { timeout: 10000 });
    await expect(page.getByText(`Test Item ${timestamp}`)).toBeVisible();
  });

  test('should display validation errors for empty fields', async ({ page }) => {
    await page.goto('/inventory/create');
    
    await page.getByTestId('submit-button').click();
    
    // HTML5 validation should prevent submission
    const nameInput = page.getByTestId('name-input');
    await expect(nameInput).toHaveAttribute('required', '');
  });

  test('should search inventory items', async ({ page }) => {
    // Create an item first
    await page.goto('/inventory/create');
    const timestamp = Date.now();
    const itemName = `Searchable Item ${timestamp}`;
    
    await page.getByTestId('name-input').fill(itemName);
    await page.getByTestId('sku-input').fill(`SEARCH${timestamp}`);
    await page.getByTestId('description-input').fill('Test');
    await page.getByTestId('quantity-input').fill('50');
    await page.getByTestId('price-input').fill('19.99');
    await page.getByTestId('submit-button').click();

    await page.waitForURL('/inventory');

    // Search for the item
    await page.getByTestId('search-input').fill(itemName);
    await expect(page.getByText(itemName)).toBeVisible();
  });

  test('should edit an inventory item', async ({ page }) => {
    // Create an item first
    await page.goto('/inventory/create');
    const timestamp = Date.now();
    const originalName = `Edit Test ${timestamp}`;
    
    await page.getByTestId('name-input').fill(originalName);
    await page.getByTestId('sku-input').fill(`EDIT${timestamp}`);
    await page.getByTestId('description-input').fill('Original description');
    await page.getByTestId('quantity-input').fill('75');
    await page.getByTestId('price-input').fill('39.99');
    await page.getByTestId('submit-button').click();

    await page.waitForURL('/inventory');

    // Find and click edit button
    const row = page.locator(`text=${originalName}`).locator('..').locator('..');
    await row.locator('button:has-text("Edit")').click();

    // Edit the item
    const updatedName = `${originalName} Updated`;
    await page.getByTestId('name-input').fill(updatedName);
    await page.getByTestId('quantity-input').fill('100');
    await page.getByTestId('submit-button').click();

    await expect(page).toHaveURL('/inventory', { timeout: 10000 });
    await expect(page.getByText(updatedName)).toBeVisible();
  });

  test('should delete an inventory item', async ({ page }) => {
    // Create an item first
    await page.goto('/inventory/create');
    const timestamp = Date.now();
    const itemName = `Delete Test ${timestamp}`;
    
    await page.getByTestId('name-input').fill(itemName);
    await page.getByTestId('sku-input').fill(`DEL${timestamp}`);
    await page.getByTestId('description-input').fill('To be deleted');
    await page.getByTestId('quantity-input').fill('25');
    await page.getByTestId('price-input').fill('9.99');
    await page.getByTestId('submit-button').click();

    await page.waitForURL('/inventory');

    // Delete the item
    page.on('dialog', dialog => dialog.accept());
    const row = page.locator(`text=${itemName}`).locator('..').locator('..');
    await row.locator('button:has-text("Delete")').click();

    // Wait a bit for deletion
    await page.waitForTimeout(1000);
    await expect(page.getByText(itemName)).not.toBeVisible();
  });

  test('should cancel item creation', async ({ page }) => {
    await page.goto('/inventory/create');
    
    await page.getByTestId('name-input').fill('Cancel Test');
    await page.getByRole('button', { name: 'Cancel' }).click();

    await expect(page).toHaveURL('/inventory');
  });

  test('should display item details in edit form', async ({ page }) => {
    // Create an item
    await page.goto('/inventory/create');
    const timestamp = Date.now();
    const itemName = `Detail Test ${timestamp}`;
    const sku = `DET${timestamp}`;
    const description = 'Detail description';
    const quantity = '60';
    const price = '24.99';
    
    await page.getByTestId('name-input').fill(itemName);
    await page.getByTestId('sku-input').fill(sku);
    await page.getByTestId('description-input').fill(description);
    await page.getByTestId('quantity-input').fill(quantity);
    await page.getByTestId('price-input').fill(price);
    await page.getByTestId('submit-button').click();

    await page.waitForURL('/inventory');

    // Navigate to edit
    const row = page.locator(`text=${itemName}`).locator('..').locator('..');
    await row.locator('button:has-text("Edit")').click();

    // Verify all fields are populated
    await expect(page.getByTestId('name-input')).toHaveValue(itemName);
    await expect(page.getByTestId('sku-input')).toHaveValue(sku);
    await expect(page.getByTestId('description-input')).toHaveValue(description);
    await expect(page.getByTestId('quantity-input')).toHaveValue(quantity);
    await expect(page.getByTestId('price-input')).toHaveValue(price);
  });

  test('should show no items message when inventory is empty', async ({ page }) => {
    await page.goto('/inventory');
    
    // Search for something that doesn't exist
    await page.getByTestId('search-input').fill('NONEXISTENT_ITEM_XYZ123');
    
    await expect(page.getByTestId('no-items-message')).toBeVisible();
  });
});
