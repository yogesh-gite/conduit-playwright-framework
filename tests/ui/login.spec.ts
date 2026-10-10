import { test, expect } from '@fixtures';
import { ENV } from '@utils/env';

// These tests need a logged-out browser, so drop the saved storage state.
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Login (UI)', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
    await expect(loginPage.heading).toBeVisible();
  });

  test('user can sign in with valid credentials', { tag: '@smoke' }, async ({ loginPage, authUser }) => {
    await loginPage.login(ENV.email, ENV.password);

    await expect(loginPage.nav.userLink(authUser.username)).toBeVisible();
    await expect(loginPage.nav.signInLink).toBeHidden();
  });

  test('shows an error for a wrong password', async ({ loginPage, page }) => {
    await loginPage.login(ENV.email, 'wrong-password-123');

    await expect(loginPage.errorMessages).toBeVisible();
    await expect(loginPage.errorMessages).toContainText(/invalid/i);
    await expect(page).toHaveURL(/\/login$/);
  });

  test('sign in button stays disabled until the form is filled', async ({ loginPage }) => {
    await expect(loginPage.signInButton).toBeDisabled();

    await loginPage.emailInput.fill(ENV.email);
    await expect(loginPage.signInButton).toBeDisabled();

    await loginPage.passwordInput.fill('any-password');
    await expect(loginPage.signInButton).toBeEnabled();
  });
});
