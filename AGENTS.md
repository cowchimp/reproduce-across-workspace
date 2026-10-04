# Agent notes

- Plain Node 22 HTTP server (`server.js`), no framework; HTML rendered in `page.js`. `node --watch` reloads on edits.
- DB connection comes entirely from `PG*` env vars (node-postgres `new Pool()` defaults) via `/run/base44/app.env` — a shared remote Postgres, same data for all branches. Never drop/reseed it.
- Schema: `init.sql` has no migration framework. `.base44/init-db.js` (the `db-init` compose service) applies it only if `public.todos` is missing, inside a transaction holding an advisory lock. Future schema changes need their own idempotent step — re-running init.sql will fail on an existing table.
- Verify: `curl localhost:3000/health` → `ok`; `curl -X POST -H 'Content-Type: application/x-www-form-urlencoded' -d title=x localhost:3000/todos` → 303.
- No test suite.
