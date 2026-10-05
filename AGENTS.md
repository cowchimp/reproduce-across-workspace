# Base44 notes

- Data lives in the shared Base44 database dependency named `mongodb` (image `mongo:8.0`). Reuse it by name; never add a local Mongo service. The platform delivers `MONGODB_URI` to `/run/base44/app.env`.
- No migrations or seed: the `todos` collection is created on first insert.
- `server.js` throws at startup if `MONGODB_URI` is unset (the Mongo client is created at import time).
- Dev server: `node --watch server.js` in `node:22`, repo bind-mounted, `node_modules` in a named volume.
- Verify: `curl localhost:3000/health` returns `ok` (pings MongoDB); then add/toggle/delete a todo on `/`.
