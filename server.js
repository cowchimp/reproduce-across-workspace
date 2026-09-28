const http = require('node:http');

const port = process.env.PORT || 3000;

const server = http.createServer((request, response) => {
  const renderedAt = new Date().toISOString();

  response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  response.end(`<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Hello Tiny Server</title>
  </head>
  <body>
    <main>
      <h1>Hello World</h1>
      <p>Rendered at <time datetime="${renderedAt}">${renderedAt}</time></p>
    </main>
  </body>
</html>
`);
});

server.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
