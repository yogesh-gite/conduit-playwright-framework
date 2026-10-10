import type { Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ArticlePage extends BasePage {
  protected readonly path = '/article';

  readonly title = this.page.locator('.banner h1');
  readonly body = this.page.locator('.article-content');
  readonly tags = this.page.locator('.article-content .tag-list li');
  // Edit/Delete buttons are rendered twice (banner and footer), so take the first.
  readonly editButton = this.page.getByRole('link', { name: 'Edit Article' }).first();
  readonly deleteButton = this.page.getByRole('button', { name: 'Delete Article' }).first();

  async openBySlug(slug: string): Promise<void> {
    await this.page.goto(`${this.path}/${slug}`);
  }

  tag(name: string): Locator {
    return this.tags.getByText(name, { exact: true });
  }

  /** Deletes the article and waits for the redirect to the home page. */
  async delete(): Promise<void> {
    await this.deleteButton.click();
    await this.page.waitForURL((url) => url.pathname === '/');
  }
}
