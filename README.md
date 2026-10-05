# MongoDB todos

A small Node.js 22+ HTTP app with server-rendered HTML and MongoDB storage.

## Run

1. Start or obtain a MongoDB server (MongoDB 7 or 8).
2. Install dependencies with `npm ci`.
3. Set `MONGODB_URI` to a MongoDB connection string including the database name, then run `npm start`.

For example, for a local server without authentication:

```sh
MONGODB_URI=mongodb://127.0.0.1:27017/todos PORT=3000 npm start
```

For authenticated servers, include credentials and the appropriate `authSource` in the URI. Keep credentials out of Git. The `todos` collection is created on the first insert; no schema initialization or seed data is required.

Open http://localhost:3000 to add, mark done/undone, and delete todos. `GET /health` pings MongoDB. Todos use MongoDB ObjectIds and are shared by every app process using the same database.
