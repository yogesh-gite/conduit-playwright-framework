import { test, expect } from '@fixtures';
import { buildArticle } from '@data/articleData';

test.describe('Articles (UI)', () => {
  test('global feed shows articles', { tag: '@smoke' }, async ({ homePage }) => {
    await homePage.goto();
    await homePage.openGlobalFeed();

    await expect(homePage.articlePreviews.first()).toBeVisible();
  });

  test('user can publish a new article', { tag: '@smoke' }, async ({
    homePage,
    editorPage,
    articlePage,
    articleFactory,
  }) => {
    const article = buildArticle();

    await homePage.goto();
    await homePage.nav.newArticleLink.click();
    const slug = await editorPage.publish(article);
    articleFactory.track(slug); // deleted via API after the test

    await expect(articlePage.title).toHaveText(article.title);
    await expect(articlePage.body).toContainText(article.body);
    for (const tag of article.tagList) {
      await expect(articlePage.tag(tag)).toBeVisible();
    }
  });

  test('tags can be added and removed before publishing', async ({ editorPage }) => {
    await editorPage.goto();

    await editorPage.addTag('playwright');
    await editorPage.addTag('typescript');
    await expect(editorPage.tagPills).toHaveCount(2);

    await editorPage.removeTag('playwright');
    await expect(editorPage.tagPill('playwright')).toHaveCount(0);
    await expect(editorPage.tagPill('typescript')).toBeVisible();
  });
});
