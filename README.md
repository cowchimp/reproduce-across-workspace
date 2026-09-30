# Todo database fixture

Plain HTML forms and a table, served by Node.js with a PostgreSQL database.
No CSS, browser JavaScript, authentication, or seeded data.
The server uses [node-postgres (`pg`)](https://node-postgres.com/features/pooling)
with a shared connection pool and parameterized queries. Connections use the
`PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, and `PGPASSWORD` environment variables.
Docker installs dependencies from `pnpm-lock.yaml`; use
`pnpm install --frozen-lockfile` for a local dependency install.

## Run locally

```sh
docker compose -f docker-compose.base44.yml up -d --build --wait
```

Open http://localhost:3000. Add a todo, change its checkbox and press Save,
or press Delete. Every change is stored in the database.

If port 3000 is occupied, prefix the command with `APP_PORT=3001`.
The web port defaults to loopback. To expose it on a sandbox's interfaces,
prefix the command with `APP_BIND=0.0.0.0`.

On networks with an HTTPS inspection proxy, supply your trusted CA bundle
using Docker's optional `npm_ca` build secret:

```sh
docker build --secret id=npm_ca,src=/path/to/trusted-ca.pem -t reproduce-across-workspace-app .
docker compose -f docker-compose.base44.yml up -d --no-build --wait
```

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

`GET /health` checks connectivity to Postgres. Source is bind-mounted; after
editing it, restart the app with `docker compose -f docker-compose.base44.yml restart app`.
