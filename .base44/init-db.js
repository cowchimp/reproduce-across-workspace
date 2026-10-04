// Applies init.sql once, only when the todos table is missing.
// Safe for concurrent branches: runs in a transaction behind a fixed advisory lock.
const fs = require('node:fs');
const path = require('node:path');
const { Client } = require('pg');

const sql = fs.readFileSync(path.join(__dirname, '..', 'init.sql'), 'utf8');
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function connect() {
  for (let attempt = 1; attempt <= 30; attempt++) {
    const client = new Client({ connectionTimeoutMillis: 5000 });
    try {
      await client.connect();
      return client;
    } catch (error) {
      console.log(`Database not ready (attempt ${attempt}/30): ${error.code || 'connect failed'}`);
      await client.end().catch(() => {});
      await sleep(5000);
    }
  }
  throw new Error('Database never became reachable.');
}

(async () => {
  const client = await connect();
  try {
    await client.query('BEGIN');
    await client.query('SELECT pg_advisory_xact_lock(4451200001)');
    const { rows } = await client.query("SELECT to_regclass('public.todos') AS t");
    if (rows[0].t) {
      console.log('Schema already present; skipping init.sql.');
    } else {
      await client.query(sql);
      console.log('Applied init.sql.');
    }
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {});
    console.error('Schema initialization failed:', error.code || error.message);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
})();
