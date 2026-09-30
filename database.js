const { Pool } = require('pg');

const pool = new Pool({
  connectionTimeoutMillis: 5000,
  statement_timeout: 10000,
});

pool.on('error', error => console.error('Idle database connection failed:', error.code));

module.exports = pool;
