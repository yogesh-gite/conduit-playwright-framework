import type { APIResponse } from '@playwright/test';
import { ApiClient } from './ApiClient';
import type { User, UserResponse } from '@app-types/conduit';

export class AuthApi extends ApiClient {
  /** POST /users/login */
  login(email: string, password: string): Promise<APIResponse> {
    return this.post('/users/login', { user: { email, password } });
  }

  /** Logs in and returns the user (with token), or throws with the API's reason. */
  async loginAs(email: string, password: string): Promise<User> {
    const response = await this.login(email, password);
    if (!response.ok()) {
      throw new Error(`API login failed (${response.status()}): ${await response.text()}`);
    }
    const body = (await response.json()) as UserResponse;
    return body.user;
  }

  /** GET /user (needs a token) */
  getCurrentUser(): Promise<APIResponse> {
    return this.get('/user');
  }
}
