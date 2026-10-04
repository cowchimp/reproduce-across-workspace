# Agent notes

- Plain Node `http` server (no framework) rendering server-side HTML; PostgreSQL via `pg` configured purely by standard `PG*` env vars (no DATABASE_URL).
- `init.sql` has no `IF NOT EXISTS`; it runs only on first init of the `db-data` volume (mounted into `/docker-entrypoint-initdb.d`). Schema changes need a manual migration or a fresh volume.
- Dev loop: `node --watch server.js` restarts on file changes; it serves no live reload, so refresh the preview after edits.
- `GET /health` runs `SELECT 1` — use it to verify app + DB.
- POST routes require `Content-Type: application/x-www-form-urlencoded` and reject `Sec-Fetch-Site: cross-site`. Smoke test: `curl -X POST -d "title=x" localhost:3000/todos` → 303.
- No tests in the repo. No external secrets.
