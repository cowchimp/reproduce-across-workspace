function escape(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]);
}

function renderPage(todos) {
  const rows = todos.map(todo => `
      <tr>
        <td>${todo.id}</td>
        <td>${escape(todo.title)}</td>
        <td>
          <form action="/todos/${todo.id}/done" method="post">
            <input type="checkbox" name="done" value="1" aria-label="Done: ${escape(todo.title)}"${todo.done ? ' checked' : ''}>
            <button type="submit">Save</button>
          </form>
        </td>
        <td>
          <form action="/todos/${todo.id}/delete" method="post">
            <button type="submit" aria-label="Delete: ${escape(todo.title)}">Delete</button>
          </form>
        </td>
      </tr>`).join('');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>My Todos</title>
</head>
<body>
  <h1>Generic Railway — feature branch</h1>
  <form action="/todos" method="post">
    <label for="title">New todo:</label>
    <input id="title" name="title" type="text" maxlength="200" required>
    <button type="submit">Add</button>
  </form>
  <p>${todos.length} todo(s). Check or uncheck Done, then press Save.</p>
  <table border="1" cellpadding="5">
    <thead>
      <tr><th scope="col">ID</th><th scope="col">Todo</th><th scope="col">Done</th><th scope="col">Delete</th></tr>
    </thead>
    <tbody>${rows || '\n      <tr><td colspan="4">No todos yet.</td></tr>'}
    </tbody>
  </table>
</body>
</html>\n`;
}

module.exports = { renderPage };
