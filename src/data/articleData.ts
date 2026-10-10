import { faker } from '@faker-js/faker';
import type { NewArticle } from '@app-types/conduit';

/**
 * Builds unique, realistic article data.
 * The title includes a timestamp so slugs never clash on the shared demo site.
 */
export function buildArticle(overrides: Partial<NewArticle> = {}): NewArticle {
  return {
    title: `PW ${faker.lorem.words(3)} ${Date.now()}`,
    description: faker.lorem.sentence(),
    body: faker.lorem.paragraph(),
    tagList: ['playwright', faker.word.noun().toLowerCase()],
    ...overrides,
  };
}
