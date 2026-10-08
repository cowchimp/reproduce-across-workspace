# PostgreSQL todos

A small Node.js HTTP app with server-rendered HTML and PostgreSQL storage.

## Run

1. Start or obtain a PostgreSQL server.
2. Install dependencies with `npm ci`.
3. Set `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, and `PGPASSWORD`.
4. Apply `init.sql` to an empty database using `psql`.
5. Run `npm start` and open http://localhost:3000.

Add, mark done/undone, and delete todos through the browser. `GET /health` checks database connectivity. The initialization script creates an empty table without resetting existing data or seeding records. Keep real credentials out of Git.
