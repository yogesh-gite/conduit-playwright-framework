import type { Page } from '@playwright/test';
import { NavBar } from './components/NavBar';

export abstract class BasePage {
  readonly nav: NavBar;
  protected abstract readonly path: string;

  constructor(protected readonly page: Page) {
    this.nav = new NavBar(page);
  }

  /** Opens this page using the baseURL from playwright.config.ts. */
  async goto(): Promise<void> {
    await this.page.goto(this.path);
  }
}
