Project overview

- This repository contains Playwright API tests (`tests/*.spec.js`) and a small in-memory mock server (`mock-server.js`) used to exercise PUT/GET persistence locally.
- Key runner script: `scripts/run-mock-tests.js` starts the mock server, runs `npx playwright test`, and shuts the server down.

How to run locally

- Install dependencies:

  ```bash
  npm install
  ```

- Run Playwright tests:

  ```bash
  npx playwright test
  ```

- Start the mock server (optional, runs on `http://localhost:3000`):

  ```bash
  npm run mock:start
  # or
  node mock-server.js
  ```

- Run tests against the mock server (recommended flow):

  ```bash
  # in one terminal
  npm run mock:start
  # in another
  npx playwright test
  ```

Project-specific patterns and conventions

- Tests use Playwright Test fixtures and the `request` API: `test('...', async ({ request }) => { ... })` (see `tests/test_basic_api_requests.spec.js`).
- Tests currently import with ESM-style `import { test, expect } from '@playwright/test'` while `package.json` currently sets `type: "commonjs"`. Align these by either changing `package.json` to `"type":"module"` or converting tests to CommonJS `require()`.
- The mock server exposes `GET /posts/1` and `PUT|PATCH /posts/1`. The server exports the Node `server` object and includes `server.closeAsync()` to help programmatic shutdown in `scripts/run-mock-tests.js`.
- `scripts/run-mock-tests.js` spawns `node mock-server.js`, waits for stdout containing `Mock server listening`, then runs `npx playwright test`. This pattern is the canonical way to run integration tests against the local mock in CI or locally.

Common pitfalls (documented fixes)

- MODULE_NOT_FOUND: ensure `npm install` before running `npx playwright test`. Also check relative import paths in tests (`./` vs no prefix).
- ESM/CommonJS mismatch: if tests use `import`, set `type` to `module` in `package.json` or change tests to `const { test, expect } = require('@playwright/test')`.
- Assertion on nested response bodies: some endpoints return `{ bookingid, booking: { firstname, ... } }` — don't assert `body.firstname`; use `expect(body).toHaveProperty('booking.firstname','Mary')` or `expect(body.booking.firstname).toBe('Mary')` (see `tests/postcall_body.spec.js`).
- package.json script typo: `dev` currently contains `echpo` (typo) — fix to `echo` if that script is used.

Files to inspect for patterns

- `mock-server.js` — server routes, port (`process.env.PORT || 3000`), exported `server.closeAsync()` helper.
- `scripts/run-mock-tests.js` — spawn-based start/wait/run pattern; useful example for CI wrappers.
- `tests/*.spec.js` — Playwright `request` usage, examples of GET/POST/PUT assertions and expected response shapes.
- `package.json` — run scripts and `devDependencies` (`@playwright/test`).
- `.github/workflows/playwright.yml` — CI setup: run this to mirror CI behavior locally.

What the AI agent should do first when contributing

1. Run `npm install` and `npx playwright test` to reproduce failures.
2. If working on tests that interact with persistence, run the mock server via `npm run mock:start` or use `scripts/run-mock-tests.js`.
3. When editing assertions, inspect response JSON shape in the test file's console logs (tests frequently log the response body) and assert the correct nested path.

If anything here is unclear or you want additional examples (CI job details, more test snippets, or converting project to ESM), say which area to expand.
