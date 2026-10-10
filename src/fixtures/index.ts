import { test as base, expect } from '@playwright/test';
import { AuthApi } from '@api/AuthApi';
import { ArticlesApi } from '@api/ArticlesApi';
import { ArticleFactory } from '@data/ArticleFactory';
import { LoginPage } from '@pages/LoginPage';
import { HomePage } from '@pages/HomePage';
import { EditorPage } from '@pages/EditorPage';
import { ArticlePage } from '@pages/ArticlePage';
import type { User } from '@app-types/conduit';
import { ENV } from '@utils/env';

type PageFixtures = {
  loginPage: LoginPage;
  homePage: HomePage;
  editorPage: EditorPage;
  articlePage: ArticlePage;
};

type ApiFixtures = {
  /** Auth API without a token (for login and negative tests). */
  authApi: AuthApi;
  /** Articles API authenticated as the test user. */
  articlesApi: ArticlesApi;
  /** Creates articles via API and deletes them after the test. */
  articleFactory: ArticleFactory;
};

type WorkerFixtures = {
  /** The logged-in test user, fetched once per worker. */
  authUser: User;
};

export const test = base.extend<PageFixtures & ApiFixtures, WorkerFixtures>({
  // ---------- Worker scope: one API login per worker, shared by its tests ----------
  authUser: [
    async ({ playwright }, use) => {
      const context = await playwright.request.newContext();
      const user = await new AuthApi(context).loginAs(ENV.email, ENV.password);
      await context.dispose();
      await use(user);
    },
    { scope: 'worker' },
  ],

  // ---------- Page objects ----------
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  editorPage: async ({ page }, use) => {
    await use(new EditorPage(page));
  },
  articlePage: async ({ page }, use) => {
    await use(new ArticlePage(page));
  },

  // ---------- API clients ----------
  authApi: async ({ request }, use) => {
    await use(new AuthApi(request));
  },
  articlesApi: async ({ request, authUser }, use) => {
    await use(new ArticlesApi(request, authUser.token));
  },
  articleFactory: async ({ articlesApi }, use) => {
    const factory = new ArticleFactory(articlesApi);
    await use(factory);
    await factory.cleanup(); // teardown runs even when the test fails
  },
});

export { expect };
