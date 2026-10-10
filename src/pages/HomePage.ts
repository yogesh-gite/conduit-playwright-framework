import type { Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  protected readonly path = '/';

  readonly yourFeedTab = this.page.getByText('Your Feed', { exact: true });
  readonly globalFeedTab = this.page.getByText('Global Feed', { exact: true });
  readonly popularTags = this.page.locator('.sidebar .tag-list a');

  // Real article cards only (the list also uses .article-preview for "Loading..." text).
  readonly articlePreviews = this.page
    .locator('.article-preview')
    .filter({ has: this.page.locator('.preview-link') });

  async openGlobalFeed(): Promise<void> {
    await this.globalFeedTab.click();
  }

  previewByTitle(title: string): Locator {
    return this.articlePreviews.filter({
      has: this.page.getByRole('heading', { name: title, exact: true }),
    });
  }
}
