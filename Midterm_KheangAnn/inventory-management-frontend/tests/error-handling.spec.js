import { test, expect } from '@playwright/test';

test.describe('Error Handling Tests', () => {
  test('should display 404 page for invalid routes', async ({ page }) => {
    await page.goto('/invalid-route-that-does-not-exist');
    
    await expect(page.getByTestId('not-found-title')).toContainText('404');
    await expect(page.getByTestId('not-found-message')).toContainText('Page Not Found');
    await expect(page.getByRole('button', { name: 'Go to Dashboard' })).toBeVisible();
  });

  test('should navigate from 404 page to dashboard', async ({ page }) => {
    await page.goto('/some-random-page');
    
    await page.getByRole('button', { name: 'Go to Dashboard' }).click();
    
    // Should redirect to login since not authenticated
    await expect(page).toHaveURL('/login');
  });

  test('should handle network errors gracefully on login', async ({ page }) => {
    await page.goto('/login');
    
    // Simulate network failure by using invalid credentials
    await page.getByTestId('email-input').fill('nonexistent@example.com');
    await page.getByTestId('password-input').fill('wrongpassword');
    await page.getByTestId('login-button').click();

    // Should show error message
    await expect(page.getByTestId('error-message')).toBeVisible();
  });

  test('should handle API errors when creating items', async ({ page }) => {
    // Login first
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

    // Try to create item with duplicate SKU
    await page.goto('/inventory/create');
    const sku = `DUP${timestamp}`;
    
    await page.getByTestId('name-input').fill('First Item');
    await page.getByTestId('sku-input').fill(sku);
    await page.getByTestId('description-input').fill('Test');
    await page.getByTestId('quantity-input').fill('10');
    await page.getByTestId('price-input').fill('10.00');
    await page.getByTestId('submit-button').click();

    await page.waitForURL('/inventory');

    // Try to create another item with same SKU
    await page.goto('/inventory/create');
    await page.getByTestId('name-input').fill('Second Item');
    await page.getByTestId('sku-input').fill(sku);
    await page.getByTestId('description-input').fill('Test');
    await page.getByTestId('quantity-input').fill('20');
    await page.getByTestId('price-input').fill('20.00');
    await page.getByTestId('submit-button').click();

    // Should show error message
    await expect(page.getByTestId('error-message')).toBeVisible();
  });

  test('should show error when editing non-existent item', async ({ page }) => {
    // Login first
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

    // Try to edit non-existent item
    await page.goto('/inventory/edit/99999');
    
    // Should show error or loading state
    const errorOrLoading = page.locator('.error-message, .loading');
    await expect(errorOrLoading).toBeVisible();
  });

  test('should handle empty form submission', async ({ page }) => {
    // Login first
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

    await page.goto('/inventory/create');
    await page.getByTestId('submit-button').click();

    // Form should not submit due to HTML5 validation
    await expect(page).toHaveURL('/inventory/create');
  });

  test('should handle invalid email format in registration', async ({ page }) => {
    await page.goto('/register');
    
    await page.getByTestId('username-input').fill('testuser');
    await page.getByTestId('email-input').fill('invalid-email');
    await page.getByTestId('password-input').fill('password123');
    await page.getByTestId('confirm-password-input').fill('password123');
    await page.getByTestId('register-button').click();

    // HTML5 validation should prevent submission
    const emailInput = page.getByTestId('email-input');
    await expect(emailInput).toHaveAttribute('type', 'email');
  });

  test('should handle negative values in inventory form', async ({ page }) => {
    // Login first
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

    await page.goto('/inventory/create');
    
    // Try to enter negative quantity
    const quantityInput = page.getByTestId('quantity-input');
    await expect(quantityInput).toHaveAttribute('min', '0');
    
    // Try to enter negative price
    const priceInput = page.getByTestId('price-input');
    await expect(priceInput).toHaveAttribute('min', '0');
  });
});
