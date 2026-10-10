import path from 'node:path';
import dotenv from 'dotenv';

// Load .env from the project root. Values already set in the shell (e.g. CI secrets) win.
dotenv.config({ path: path.resolve(__dirname, '../../.env'), quiet: true });

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing environment variable "${name}". Copy .env.example to .env and fill it in.`,
    );
  }
  return value;
}

/**
 * Single source of truth for environment config.
 * Getters are lazy, so listing tests works even before .env exists.
 */
export const ENV = {
  get baseUrl(): string {
    return process.env.BASE_URL ?? 'https://conduit.bondaracademy.com';
  },
  get apiUrl(): string {
    return process.env.API_URL ?? 'https://conduit-api.bondaracademy.com/api';
  },
  get email(): string {
    return required('CONDUIT_EMAIL');
  },
  get password(): string {
    return required('CONDUIT_PASSWORD');
  },
  get isCI(): boolean {
    return !!process.env.CI;
  },
};

/** Where the logged-in browser state is saved by the setup project. */
export const STORAGE_STATE = path.resolve(__dirname, '../../.auth/user.json');
