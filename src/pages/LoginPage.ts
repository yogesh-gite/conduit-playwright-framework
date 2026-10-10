import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  protected readonly path = '/login';

  readonly heading = this.page.getByRole('heading', { name: 'Sign in' });
  readonly emailInput = this.page.getByPlaceholder('Email');
  readonly passwordInput = this.page.getByPlaceholder('Password');
  readonly signInButton = this.page.getByRole('button', { name: 'Sign in' });
  readonly errorMessages = this.page.locator('.error-messages');

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }
}
