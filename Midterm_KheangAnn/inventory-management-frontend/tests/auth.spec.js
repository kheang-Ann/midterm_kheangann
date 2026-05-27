import { test, expect } from '@playwright/test';

test.describe('Authentication Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display login page', async ({ page }) => {
    await expect(page).toHaveURL('/login');
    await expect(page.locator('h2')).toContainText('Login');
    await expect(page.getByTestId('email-input')).toBeVisible();
    await expect(page.getByTestId('password-input')).toBeVisible();
    await expect(page.getByTestId('login-button')).toBeVisible();
  });

  test('should show error message for invalid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.getByTestId('email-input').fill('invalid@example.com');
    await page.getByTestId('password-input').fill('wrongpassword');
    await page.getByTestId('login-button').click();

    await expect(page.getByTestId('error-message')).toBeVisible();
  });

  test('should navigate to register page', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('link', { name: 'Register here' }).click();
    
    await expect(page).toHaveURL('/register');
    await expect(page.locator('h2')).toContainText('Register');
  });

  test('should display register form', async ({ page }) => {
    await page.goto('/register');
    
    await expect(page.getByTestId('username-input')).toBeVisible();
    await expect(page.getByTestId('email-input')).toBeVisible();
    await expect(page.getByTestId('password-input')).toBeVisible();
    await expect(page.getByTestId('confirm-password-input')).toBeVisible();
    await expect(page.getByTestId('register-button')).toBeVisible();
  });

  test('should show error for password mismatch', async ({ page }) => {
    await page.goto('/register');
    
    await page.getByTestId('username-input').fill('testuser');
    await page.getByTestId('email-input').fill('test@example.com');
    await page.getByTestId('password-input').fill('password123');
    await page.getByTestId('confirm-password-input').fill('password456');
    await page.getByTestId('register-button').click();

    await expect(page.getByTestId('error-message')).toContainText('Passwords do not match');
  });

  test('should show error for short password', async ({ page }) => {
    await page.goto('/register');
    
    await page.getByTestId('username-input').fill('testuser');
    await page.getByTestId('email-input').fill('test@example.com');
    await page.getByTestId('password-input').fill('12345');
    await page.getByTestId('confirm-password-input').fill('12345');
    await page.getByTestId('register-button').click();

    await expect(page.getByTestId('error-message')).toContainText('at least 6 characters');
  });

  test('should register successfully and redirect to login', async ({ page }) => {
    const timestamp = Date.now();
    await page.goto('/register');
    
    await page.getByTestId('username-input').fill(`user${timestamp}`);
    await page.getByTestId('email-input').fill(`user${timestamp}@example.com`);
    await page.getByTestId('password-input').fill('password123');
    await page.getByTestId('confirm-password-input').fill('password123');
    await page.getByTestId('register-button').click();

    await expect(page).toHaveURL('/login', { timeout: 10000 });
  });

  test('should login successfully and redirect to dashboard', async ({ page }) => {
    // First register a user
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

    // Now login
    await page.getByTestId('email-input').fill(email);
    await page.getByTestId('password-input').fill(password);
    await page.getByTestId('login-button').click();

    await expect(page).toHaveURL('/dashboard', { timeout: 10000 });
    await expect(page.locator('.navbar')).toBeVisible();
  });

  test('should logout successfully', async ({ page }) => {
    // Register and login first
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

    // Logout
    await page.getByRole('button', { name: 'Logout' }).click();
    await expect(page).toHaveURL('/login');
  });

  test('should protect routes when not authenticated', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL('/login');

    await page.goto('/inventory');
    await expect(page).toHaveURL('/login');

    await page.goto('/inventory/create');
    await expect(page).toHaveURL('/login');
  });
});
