import { test, expect } from '@fixtures';
import { buildArticle } from '@data/articleData';
import type { ArticleResponse } from '@app-types/conduit';

/**
 * Hybrid tests: set up or verify data through the API, act through the UI.
 * Faster and more stable than doing every step in the browser.
 */
test.describe('Article lifecycle (API + UI)', () => {
  test('article created via API is shown in the UI', { tag: '@smoke' }, async ({
    articleFactory,
    articlePage,
  }) => {
    const article = await articleFactory.create({ tagList: ['hybrid', 'api-setup'] });

    await articlePage.openBySlug(article.slug);

    await expect(articlePage.title).toHaveText(article.title);
    await expect(articlePage.body).toContainText(article.body);
    await expect(articlePage.tag('hybrid')).toBeVisible();
    await expect(articlePage.tag('api-setup')).toBeVisible();
  });

  test('article published in the UI is returned by the API', async ({
    editorPage,
    articlesApi,
    articleFactory,
    authUser,
  }) => {
    const data = buildArticle();

    await editorPage.goto();
    const slug = await editorPage.publish(data);
    articleFactory.track(slug);

    const response = await articlesApi.getBySlug(slug);
    expect(response.status()).toBe(200);
    const { article } = (await response.json()) as ArticleResponse;
    expect(article).toMatchObject({
      title: data.title,
      description: data.description,
      body: data.body,
    });
    expect(article.author.username).toBe(authUser.username);
  });

  test('article deleted in the UI is removed from the API', async ({
    articleFactory,
    articlePage,
    articlesApi,
  }) => {
    const article = await articleFactory.create();

    await articlePage.openBySlug(article.slug);
    await articlePage.delete();

    const response = await articlesApi.getBySlug(article.slug);
    expect(response.status()).toBe(404);
  });
});
