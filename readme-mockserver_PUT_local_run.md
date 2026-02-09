# Mock Server PUT — Local Run

This document explains how to run the provided in-memory mock server and execute the PUT test locally so you can verify that a PUT persists in the mock server (JSONPlaceholder does not persist changes).

Files to know:
- `mock-server.js` — simple in-memory HTTP server (GET/PUT/PATCH for `/posts/1`).
- `tests/putPayload.json` — JSON payload used by the PUT test.
- `tests/mockserver_test_Put and Patch_operations.spec.js` — Playwright test that reads `putPayload.json` and sends it as the PUT body. The test uses the `API_BASE` environment variable.

Steps (Windows cmd):

1. Start mock server in a separate terminal:

```bash
npm run mock:start
```

2. Set `API_BASE` and run the PUT test (cmd):

```bash
set API_BASE=http://localhost:3000
npx playwright test -g "Test2: Put Request test"
```

Steps (PowerShell):

```powershell
# Start server in one PowerShell session:
npm run mock:start

# In the same (or a new) PowerShell session set environment variable and run tests:
$env:API_BASE = 'http://localhost:3000'
npx playwright test -g "Test2: Put Request test"
```

Notes:
- The test reads the payload file `tests/putPayload.json` and sends it using Playwright's `request.put()`.
- The mock server will update its in-memory post and return the updated JSON; subsequent GETs to `/posts/1` will reflect that change while the server process is running.
- If you point `API_BASE` to `https://jsonplaceholder.typicode.com`, the PUT will succeed but the change will not persist — the GET will still return the original data.

Advanced (automate start/run/stop):
- You can implement a short script to start `mock-server.js` in the background, run tests, then kill it. For CI, prefer a process manager or separate test container.

If you want, I can add a `test:mock-run` script that starts the server, runs the tests, and shuts down the server automatically.
