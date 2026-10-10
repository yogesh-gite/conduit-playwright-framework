import type { APIResponse } from '@playwright/test';
import { ApiClient } from './ApiClient';
import type { NewArticle } from '@app-types/conduit';

export interface ListArticlesParams {
  limit?: number;
  offset?: number;
  tag?: string;
  author?: string;
  favorited?: string;
}

export class ArticlesApi extends ApiClient {
  /** GET /articles */
  list(params: ListArticlesParams = {}): Promise<APIResponse> {
    return this.get('/articles', { ...params });
  }

  /** GET /articles/:slug */
  getBySlug(slug: string): Promise<APIResponse> {
    return this.get(`/articles/${slug}`);
  }

  /** POST /articles (needs a token) */
  create(article: NewArticle): Promise<APIResponse> {
    return this.post('/articles', { article });
  }

  /** PUT /articles/:slug (needs a token) */
  update(slug: string, changes: Partial<NewArticle>): Promise<APIResponse> {
    return this.put(`/articles/${slug}`, { article: changes });
  }

  /** DELETE /articles/:slug (needs a token) */
  remove(slug: string): Promise<APIResponse> {
    return this.delete(`/articles/${slug}`);
  }

  /** GET /tags */
  getTags(): Promise<APIResponse> {
    return this.get('/tags');
  }
}
