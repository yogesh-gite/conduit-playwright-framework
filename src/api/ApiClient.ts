import type { APIRequestContext, APIResponse } from '@playwright/test';
import { ENV } from '@utils/env';

export type QueryParams = Record<string, string | number | boolean | undefined>;

/**
 * Base class for every API client.
 * Builds full URLs, adds the Conduit auth header ("Token <jwt>") when a token is given,
 * and returns the raw APIResponse so tests can assert on status codes.
 */
export abstract class ApiClient {
  constructor(
    protected readonly request: APIRequestContext,
    protected readonly token?: string,
  ) {}

  private url(endpoint: string): string {
    return `${ENV.apiUrl}${endpoint}`;
  }

  private get headers(): Record<string, string> {
    return this.token ? { Authorization: `Token ${this.token}` } : {};
  }

  private clean(params: QueryParams = {}): Record<string, string | number | boolean> {
    return Object.fromEntries(
      Object.entries(params).filter(([, value]) => value !== undefined),
    ) as Record<string, string | number | boolean>;
  }

  protected get(endpoint: string, params?: QueryParams): Promise<APIResponse> {
    return this.request.get(this.url(endpoint), {
      headers: this.headers,
      params: this.clean(params),
    });
  }

  protected post(endpoint: string, data: unknown): Promise<APIResponse> {
    return this.request.post(this.url(endpoint), { headers: this.headers, data });
  }

  protected put(endpoint: string, data: unknown): Promise<APIResponse> {
    return this.request.put(this.url(endpoint), { headers: this.headers, data });
  }

  protected delete(endpoint: string): Promise<APIResponse> {
    return this.request.delete(this.url(endpoint), { headers: this.headers });
  }
}
