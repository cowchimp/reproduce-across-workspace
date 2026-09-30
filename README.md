# Todo database fixture

Plain HTML forms and a table, served by Node.js with a PostgreSQL database.
No CSS, browser JavaScript, authentication, or seeded data.
The server uses [node-postgres (`pg`)](https://node-postgres.com/features/pooling)
with a shared connection pool and parameterized queries. Connections use the
`PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, and `PGPASSWORD` environment variables.
Compose uses the standard Node image and installs dependencies from
`package-lock.json` with `npm ci` each time the app starts. No Dockerfile or
build step is needed. Use `npm ci` for a local dependency install.

## Run locally

```sh
docker compose -f docker-compose.base44.yml up -d --wait
```

Open http://localhost:3000. Add a todo, change its checkbox and press Save,
or press Delete. Every change is stored in the database.

If port 3000 is occupied, prefix the command with `APP_PORT=3001`.
The web port defaults to `0.0.0.0` so Base Code can reach the sandbox preview.
For localhost-only use, prefix the command with `APP_BIND=127.0.0.1`.

Dependencies and the npm cache live in the `app-dependencies`
volume, separate from the read-only source mount and the database. Startup
can reuse cached package downloads; the lockfile pins the installed versions.

On networks with an HTTPS inspection proxy, create an ignored
`docker-compose.local.yml` with your trusted CA bundle:

```yaml
services:
  app:
    ports: !override
      - "127.0.0.1:${APP_PORT:-3000}:3000"
    volumes:
      - /absolute/path/to/trusted-ca.pem:/run/certs/npm-ca.pem:ro
    environment:
      NODE_EXTRA_CA_CERTS: /run/certs/npm-ca.pem
      npm_config_cafile: /run/certs/npm-ca.pem
```

Then include that file whenever starting or recreating the app:

```sh
docker compose -f docker-compose.base44.yml -f docker-compose.local.yml up -d --wait
```

This local override requires Compose 2.24.4 or later. It is ignored by Git;
Base Code starts only `docker-compose.base44.yml`, without local certificate settings.

## Database persistence

Postgres stores its data in the Compose `todo-data` named volume.
`init.sql` creates one empty `todos` table when a new database is initialized.
It does not reset an existing database or insert dummy records.

Recreating containers keeps the data:

```sh
docker compose -f docker-compose.base44.yml up -d --force-recreate --wait
```

Stopping the app also keeps the data:

```sh
docker compose -f docker-compose.base44.yml down
```

Adding `--volumes` to `down` deletes the database data. Use that only when
intentionally resetting this fixture.

## Inspect and export

```sh
docker compose -f docker-compose.base44.yml exec -T db psql -U todos -d todos -c 'TABLE todos;'
docker compose -f docker-compose.base44.yml exec -T db pg_dump -U todos -d todos -Fc > todos.dump
```

`GET /health` checks connectivity to Postgres. Source is bind-mounted and
Node's watch mode restarts the server when its JavaScript files change.
If your local Docker mount does not forward file-change events, restart the app
with `docker compose -f docker-compose.base44.yml -f docker-compose.local.yml restart app`.
