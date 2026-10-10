import { test, expect } from '@fixtures';
import { ArticlesApi } from '@api/ArticlesApi';
import { buildArticle } from '@data/articleData';
import type { ArticleResponse, ArticlesResponse, TagsResponse } from '@app-types/conduit';

test.describe('Articles API', () => {
  test('GET /articles returns a paginated list', { tag: '@smoke' }, async ({ articlesApi }) => {
    const response = await articlesApi.list({ limit: 5, offset: 0 });

    expect(response.status()).toBe(200);
    const body = (await response.json()) as ArticlesResponse;
    expect(body.articles.length).toBeLessThanOrEqual(5);
    expect(body.articlesCount).toEqual(expect.any(Number));
  });

  test('GET /tags returns a list of tags', async ({ articlesApi }) => {
    const response = await articlesApi.getTags();

    expect(response.status()).toBe(200);
    const { tags } = (await response.json()) as TagsResponse;
    expect(Array.isArray(tags)).toBe(true);
  });

  test('article CRUD lifecycle', async ({ articlesApi, articleFactory }) => {
    const data = buildArticle();

    const slug = await test.step('create', async () => {
      const response = await articlesApi.create(data);
      await expect(response).toBeOK();
      const { article } = (await response.json()) as ArticleResponse;
      expect(article).toMatchObject({
        title: data.title,
        description: data.description,
        body: data.body,
      });
      expect([...article.tagList].sort()).toEqual([...data.tagList].sort());
      articleFactory.track(article.slug); // safety net if a later step fails
      return article.slug;
    });

    await test.step('read', async () => {
      const response = await articlesApi.getBySlug(slug);
      expect(response.status()).toBe(200);
      const { article } = (await response.json()) as ArticleResponse;
      expect(article.title).toBe(data.title);
    });

    await test.step('update', async () => {
      const response = await articlesApi.update(slug, { description: 'Updated by Playwright' });
      await expect(response).toBeOK();
      const { article } = (await response.json()) as ArticleResponse;
      expect(article.description).toBe('Updated by Playwright');
    });

    await test.step('delete', async () => {
      const response = await articlesApi.remove(slug);
      await expect(response).toBeOK();
    });

    await test.step('verify it is gone', async () => {
      const response = await articlesApi.getBySlug(slug);
      expect(response.status()).toBe(404);
    });
  });

  test('POST /articles is rejected without a token', async ({ request }) => {
    const response = await new ArticlesApi(request).create(buildArticle());

    expect(response.status()).toBe(401);
  });
});
