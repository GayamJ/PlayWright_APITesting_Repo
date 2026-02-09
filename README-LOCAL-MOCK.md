Local mock server (optional)

This repository includes a simple in-memory mock server you can use to test PUT/GET persistence locally.

Run the mock server:

```bash
node mock-server.js
```

By default the server listens on `http://localhost:3000` and supports:
- GET /posts/1  -> returns the initial JSONPlaceholder-like post
- PUT /posts/1  -> accepts JSON body and updates the in-memory post, then returns the updated post

To run your Playwright tests against the local server, change the test URLs from `https://jsonplaceholder.typicode.com/posts/1` to `http://localhost:3000/posts/1` (or set an environment variable and update tests accordingly).

Example (shell):

```bash
# start server in background
node mock-server.js &
# run playwright tests
npx playwright test
```

```note: how the mock server is getting initialized here
```
```
Summary — how the mock server is initialized

File: mock-server.js
Creates server: Uses http.createServer((req, res) => { ... }) to define request handling.
Routes handled: 
GET /posts/1 returns the post object; 
PUT/PATCH /posts/1 reads request body, parses JSON, merges it into post, and returns the updated object; all other requests return 404.
Start listening: 
Calls server.listen(port, ...) with port = process.env.PORT || 3000, logging the URL when ready.
Export: 
Exports the server object via module.exports = server (useful for tests or programmatic shutdown).
```
```
$env:PORT=0; node -e "const s = require('./mock-server'); console.log('mock server loaded on', s.address && s.address().port); setTimeout(()=>{ s.closeAsync().then(()=>console.log('server closed')).catch(e=>{ console.error(e); process.exit(1); }); }, 200);"
```