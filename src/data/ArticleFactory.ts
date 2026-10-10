import type { ArticlesApi } from '@api/ArticlesApi';
import type { Article, ArticleResponse, NewArticle } from '@app-types/conduit';
import { buildArticle } from './articleData';

/**
 * Creates test articles through the API and remembers them,
 * so the fixture can delete everything after each test (pass or fail).
 */
export class ArticleFactory {
  private readonly slugs = new Set<string>();

  constructor(private readonly api: ArticlesApi) {}

  async create(overrides: Partial<NewArticle> = {}): Promise<Article> {
    const response = await this.api.create(buildArticle(overrides));
    if (!response.ok()) {
      throw new Error(`Could not create article (${response.status()}): ${await response.text()}`);
    }
    const { article } = (await response.json()) as ArticleResponse;
    this.slugs.add(article.slug);
    return article;
  }

  /** Register an article created some other way (e.g. through the UI) for cleanup. */
  track(slug: string): void {
    this.slugs.add(slug);
  }

  async cleanup(): Promise<void> {
    for (const slug of this.slugs) {
      // A 404 just means the test already deleted it.
      await this.api.remove(slug);
    }
    this.slugs.clear();
  }
}
