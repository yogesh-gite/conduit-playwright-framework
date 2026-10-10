import type { Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import type { NewArticle } from '@app-types/conduit';

export class EditorPage extends BasePage {
  protected readonly path = '/editor';

  readonly titleInput = this.page.getByPlaceholder('Article Title');
  readonly descriptionInput = this.page.getByPlaceholder("What's this article about?");
  readonly bodyInput = this.page.getByPlaceholder('Write your article (in markdown)');
  readonly tagsInput = this.page.getByPlaceholder('Enter tags');
  readonly publishButton = this.page.getByRole('button', { name: 'Publish Article' });
  readonly tagPills = this.page.locator('.editor-page .tag-list .tag-pill');

  tagPill(name: string): Locator {
    return this.tagPills.filter({ hasText: name });
  }

  async addTag(name: string): Promise<void> {
    await this.tagsInput.fill(name);
    await this.tagsInput.press('Enter');
  }

  async removeTag(name: string): Promise<void> {
    await this.tagPill(name).locator('.ion-close-round').click();
  }

  async fillArticle(article: NewArticle): Promise<void> {
    await this.titleInput.fill(article.title);
    await this.descriptionInput.fill(article.description);
    await this.bodyInput.fill(article.body);
    for (const tag of article.tagList) {
      await this.addTag(tag);
    }
  }

  /** Fills the form, publishes, and returns the new article's slug from the URL. */
  async publish(article: NewArticle): Promise<string> {
    await this.fillArticle(article);
    await this.publishButton.click();
    await this.page.waitForURL(/\/article\/.+/);
    const slug = new URL(this.page.url()).pathname.split('/').pop();
    if (!slug) {
      throw new Error(`Could not read the article slug from ${this.page.url()}`);
    }
    return decodeURIComponent(slug);
  }
}
