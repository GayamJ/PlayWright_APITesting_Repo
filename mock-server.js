const http = require('http');
const currentDate = new Date();

let post = {
  userId: 1,
  Updatedate: "2026-02-07T19:50:00.000Z",
  id: 1,
  title: 'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
  body: 'quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto'
};

const server = http.createServer((req, res) => {
  if (req.url === '/posts/1' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(post));
    return;
  }

  if (req.url === '/posts/1' && (req.method === 'PUT' || req.method === 'PATCH')) {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const data = JSON.parse(body || '{}');
        // merge incoming fields to simulate persistence
        post = Object.assign({}, post, data);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(post));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'invalid json' }));
      }
    });
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'not found' }));
});

const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`Mock server listening on http://localhost:${port}`));

// Promise-based close helper for tests and programmatic shutdown
server.closeAsync = () => new Promise((resolve, reject) => {
  server.close(err => err ? reject(err) : resolve());
});

// Graceful shutdown on signals
const shutdown = (signal) => {
  console.log(`Received ${signal}. Shutting down mock server...`);
  server.close(err => {
    if (err) {
      console.error('Error while closing server:', err);
      process.exit(1);
    }
    process.exit(0);
  });
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

module.exports = server;
