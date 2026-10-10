import { test, expect } from '@fixtures';
import { AuthApi } from '@api/AuthApi';
import type { ErrorResponse, UserResponse } from '@app-types/conduit';
import { ENV } from '@utils/env';

test.describe('Auth API', () => {
  test('POST /users/login returns a token for valid credentials', { tag: '@smoke' }, async ({ authApi }) => {
    const response = await authApi.login(ENV.email, ENV.password);

    expect(response.status()).toBe(200);
    const { user } = (await response.json()) as UserResponse;
    expect(user.email.toLowerCase()).toBe(ENV.email.toLowerCase());
    expect(user.token).toEqual(expect.any(String));
    expect(user.username).toEqual(expect.any(String));
  });

  test('POST /users/login rejects a wrong password', async ({ authApi }) => {
    const response = await authApi.login(ENV.email, 'wrong-password-123');

    expect(response.ok()).toBeFalsy();
    expect([401, 403, 422]).toContain(response.status());
    const body = (await response.json()) as ErrorResponse;
    expect(body.errors).toBeDefined();
  });

  test('GET /user is rejected without a token', async ({ authApi }) => {
    const response = await authApi.getCurrentUser();

    expect(response.status()).toBe(401);
  });

  test('GET /user returns the logged-in user', async ({ request, authUser }) => {
    const response = await new AuthApi(request, authUser.token).getCurrentUser();

    expect(response.status()).toBe(200);
    const { user } = (await response.json()) as UserResponse;
    expect(user.username).toBe(authUser.username);
  });
});
