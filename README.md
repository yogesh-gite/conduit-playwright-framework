# Conduit Playwright Framework

A Playwright + TypeScript test automation framework covering **UI**, **API** and **hybrid (API + UI)** tests for [Conduit](https://conduit.bondaracademy.com), a Medium-style demo app built on the RealWorld spec.

## What it shows

| Area | How |
|---|---|
| Page Object Model | `src/pages/` — one class per page, plus a shared `NavBar` component |
| API layer | `src/api/` — a base `ApiClient` (URLs, auth header) and one client per resource |
| Custom fixtures | `src/fixtures/index.ts` — page objects, API clients, the logged-in user and a data factory, all injected into tests |
| Fast login | `tests/setup/auth.setup.ts` logs in via API once and saves `storageState`, so UI tests start logged in |
| Test data | `@faker-js/faker` builds unique data; `ArticleFactory` deletes everything a test created, even when it fails |
| Hybrid tests | Create data via API → verify in UI, or act in UI → verify via API |
| Config | `.env` for credentials, separate projects for `setup`, `api`, `chromium`, `firefox` |
| Reporting | HTML report, plus trace, screenshot and video on failure |
| CI | GitHub Actions workflow with the report uploaded as an artifact |

## Folder structure

```
├── .github/workflows/playwright.yml   CI pipeline
├── playwright.config.ts               projects, retries, reporters, baseURL
├── src/
│   ├── api/                           ApiClient, AuthApi, ArticlesApi
│   ├── data/                          articleData (faker), ArticleFactory (create + cleanup)
│   ├── fixtures/index.ts              custom `test` with all fixtures
│   ├── pages/                         BasePage, LoginPage, HomePage, EditorPage, ArticlePage
│   │   └── components/NavBar.ts
│   ├── types/conduit.ts               API request/response interfaces
│   └── utils/env.ts                   env config + storage state path
└── tests/
    ├── setup/auth.setup.ts            API login → saved browser state
    ├── api/                           pure API tests (no browser)
    ├── ui/                            UI tests
    └── hybrid/                        API + UI tests
```

## Getting started

1. **Install Node.js 20 or newer** (22 LTS recommended).
2. **Create a test account** at https://conduit.bondaracademy.com/register.
3. **Install dependencies and browsers:**
   ```bash
   npm install
   npx playwright install
   ```
4. **Add your credentials:** copy `.env.example` to `.env` and fill in `CONDUIT_EMAIL` and `CONDUIT_PASSWORD`.
5. **Run the tests:**
   ```bash
   npm test            # API + Chromium UI/hybrid tests
   npm run report      # open the HTML report
   ```

## Useful commands

| Command | What it does |
|---|---|
| `npm test` | API tests + UI/hybrid tests in Chromium |
| `npm run test:api` | API tests only |
| `npm run test:ui` | UI + hybrid tests in Chromium |
| `npm run test:cross-browser` | UI + hybrid tests in Chromium and Firefox |
| `npm run test:smoke` | Only tests tagged `@smoke` |
| `npm run test:headed` | Watch the browser while tests run |
| `npm run test:debug` | Step through tests with the Playwright Inspector |
| `npx playwright test --ui` | Interactive UI mode (great for learning and debugging) |
| `npm run codegen` | Record actions and generate locators |
| `npm run typecheck` | TypeScript type-check |

## Running in GitHub Actions

Push the repo to GitHub, then add two repository secrets under **Settings → Secrets and variables → Actions**: `CONDUIT_EMAIL` and `CONDUIT_PASSWORD`. The workflow runs on every push and pull request to `main` and uploads the HTML report.

## Design notes

- **Why API login?** Logging in through the UI before every test is slow and flaky. The setup project calls `POST /users/login`, stores the JWT in `localStorage` (where the Conduit app reads it), confirms the UI shows the user as logged in, and saves the state once.
- **Why a worker-scoped `authUser`?** API tests need a token too. Each worker logs in once and shares the token across its tests.
- **Why return raw `APIResponse` from clients?** Tests can assert on status codes (including negative cases), while helpers like `loginAs()` and `ArticleFactory.create()` handle the happy path.
- **Cleanup:** anything created through `articleFactory` (or registered with `articleFactory.track(slug)`) is deleted in fixture teardown, so the shared demo site stays clean.
- **Shared demo site:** other people use it too, so tests never depend on data they didn't create, and parallelism is kept low.

## Ideas to extend it

- Add ESLint + Prettier and a pre-commit hook
- Schema validation of API responses (e.g. with `zod`)
- Comments, favorites, follow and settings page objects
- Visual comparisons with `toHaveScreenshot()`
- Allure reporting
- Run against a self-hosted Conduit in Docker for fully stable CI
