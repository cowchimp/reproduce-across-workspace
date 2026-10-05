const http = require('node:http');
const database = require('./database');
const { renderPage } = require('./page');

function fail(status, message) {
  return Object.assign(new Error(message), { status });
}

async function readForm(request) {
  if (request.headers['sec-fetch-site'] === 'cross-site') {
    throw fail(403, 'Cross-site form submissions are not allowed.');
  }
  if (request.headers['content-type']?.split(';')[0] !== 'application/x-www-form-urlencoded') {
    throw fail(415, 'Submit a URL-encoded form.');
  }
  let size = 0;
  const chunks = [];
  for await (const chunk of request) {
    size += chunk.length;
    if (size > 16384) throw fail(413, 'Form is too large.');
    chunks.push(chunk);
  }
  return new URLSearchParams(Buffer.concat(chunks).toString('utf8'));
}

async function handle(request, response) {
  const path = new URL(request.url, 'http://localhost').pathname;

  if (request.method === 'GET' && path === '/health') {
    await database.ping();
    response.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    return response.end('ok\n');
  }

  if (request.method === 'GET' && path === '/') {
    const todos = await database.list();
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    return response.end(renderPage(todos));
  }

  const action = path.match(/^\/todos\/([a-f0-9]{24})\/(done|delete)$/);
  if (request.method !== 'POST' || (path !== '/todos' && !action)) {
    throw fail(404, 'Not found.');
  }

  const form = await readForm(request);
  if (path === '/todos') {
    const title = (form.get('title') || '').trim();
    if (!title || [...title].length > 200 || title.includes('\0')) {
      throw fail(400, 'Enter a todo between 1 and 200 characters.');
    }
    await database.add(title);
  } else {
    const id = action[1];
    const result = action[2] === 'delete'
      ? await database.remove(id)
      : await database.setDone(id, form.get('done') === '1');
    if (!(result.deletedCount ?? result.matchedCount)) throw fail(404, 'Todo not found.');
  }

  response.writeHead(303, { Location: '/' });
  response.end();
}

const server = http.createServer((request, response) => {
  response.setHeader('Cache-Control', 'no-store');
  response.setHeader('Content-Security-Policy', "default-src 'none'; form-action 'self'; base-uri 'none'");
  response.setHeader('X-Content-Type-Options', 'nosniff');
  handle(request, response).catch(error => {
    if (!error.status) console.error('Database request failed:', error.code);
    response.writeHead(error.status || 503, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end(`${error.status ? error.message : 'Database unavailable.'}\n`);
  });
});

const port = process.env.PORT || 3000;
server.listen(port, '0.0.0.0', () => console.log(`Server listening on port ${port}`));

function shutdown() {
  server.close(() => database.close().catch(error => {
    console.error('Database shutdown failed:', error.code);
    process.exitCode = 1;
  }));
}

process.once('SIGTERM', shutdown);
process.once('SIGINT', shutdown);
