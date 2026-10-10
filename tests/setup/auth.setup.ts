import { test as setup, expect } from '@playwright/test';
import { AuthApi } from '@api/AuthApi';
import { NavBar } from '@pages/components/NavBar';
import { ENV, STORAGE_STATE } from '@utils/env';

/**
 * Runs once before the UI projects.
 * Logs in through the API (fast, no UI clicks), puts the JWT where the
 * Conduit front end expects it, checks the UI sees us as logged in,
 * then saves the browser state for every UI test to reuse.
 */
setup('authenticate via API and save storage state', async ({ page, request }) => {
  const user = await new AuthApi(request).loginAs(ENV.email, ENV.password);

  await page.goto('/');
  // The Conduit Angular app keeps the token in localStorage under "jwtToken".
  await page.evaluate((token) => window.localStorage.setItem('jwtToken', token), user.token);
  await page.reload();

  await expect(new NavBar(page).userLink(user.username)).toBeVisible();
  await page.context().storageState({ path: STORAGE_STATE });
});
