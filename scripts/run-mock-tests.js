const { spawn } = require('child_process');

function startServer() {
  return new Promise((resolve, reject) => {
    const server = spawn(process.execPath, ['mock-server.js'], {
      cwd: process.cwd(),
      env: process.env,
      stdio: ['ignore', 'pipe', 'pipe']
    });

    let settled = false;
    const timeout = setTimeout(() => {
      if (!settled) {
        settled = true;
        server.kill();
        reject(new Error('Timed out waiting for mock server to start'));
      }
    }, 10000);

    server.stdout.on('data', (chunk) => {
      process.stdout.write(`[mock] ${chunk}`);
      if (!settled && chunk.toString().includes('Mock server listening')) {
        settled = true;
        clearTimeout(timeout);
        resolve(server);
      }
    });

    server.stderr.on('data', (chunk) => process.stderr.write(`[mock-err] ${chunk}`));

    server.on('error', (err) => {
      if (!settled) {
        settled = true;
        clearTimeout(timeout);
        reject(err);
      }
    });
  });
}

function runTests(pattern) {
  return new Promise((resolve) => {
    const args = ['playwright', 'test'];
    if (pattern) {
      args.push('-g', pattern);
    }

    const cmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
    const child = spawn(cmd, args, { stdio: 'inherit' });

    child.on('close', (code) => resolve(code));
  });
}

async function main() {
  const pattern = process.env.TEST_PATTERN || 'Put Request test';
  let server;
  try {
    server = await startServer();
  } catch (e) {
    console.error('Failed to start mock server:', e);
    process.exit(1);
  }

  const code = await runTests(pattern);

  try {
    server.kill();
  } catch (e) {
    // ignore
  }

  process.exit(code);
}

process.on('SIGINT', () => process.exit(130));
process.on('SIGTERM', () => process.exit(143));

main();
