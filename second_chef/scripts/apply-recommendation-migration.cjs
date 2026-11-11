// Existing database was created from sqlDump.sql, not from Prisma's old User migration.
// Apply only this additive migration; never reset or replay the unrelated migration.
const fs = require('node:fs');
const path = require('node:path');
const { Client } = require('pg');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local', quiet: true });
dotenv.config({ path: '.env', quiet: true });

async function main() {
  const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
  if (!connectionString) throw new Error('DATABASE_URL or DIRECT_URL is required');
  const client = new Client({ connectionString, connectionTimeoutMillis: 15000 });
  try {
    await client.connect();
    await client.query('BEGIN');
    await client.query("SELECT pg_advisory_xact_lock(20261111, 1)");
    const expected = { fiok: { makrocelok: 'json' }, huto: { mennyiseg: 'double precision', egyseg: 'character varying', kategoria: 'character varying' } };
    const rows = (await client.query(`SELECT table_name, column_name, data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name IN ('fiok', 'huto')`)).rows;
    const columns = Object.entries(expected).flatMap(([table, fields]) => Object.entries(fields).map(([name, type]) => ({ table, name, type })));
    const found = columns.filter(column => rows.some(row => row.table_name === column.table && row.column_name === column.name));
    if (!found.length) {
      const sql = fs.readFileSync(path.join(__dirname, '../prisma/migrations/20261111090000_recommendation_settings/migration.sql'), 'utf8');
      await client.query(sql);
      console.log('Recommendation settings migration applied; existing data retained.');
    } else if (found.length !== columns.length || columns.some(column => !rows.some(row => row.table_name === column.table && row.column_name === column.name && row.data_type === column.type))) {
      throw new Error('Partial or incompatible schema: inspect columns before continuing');
    } else console.log('Recommendation settings schema already up to date.');
    await client.query('COMMIT');
  } catch (error) { await client.query('ROLLBACK').catch(() => {}); throw error; }
  finally { await client.end(); }
}
main().catch(error => { console.error('Migration failed:', error.code || error.name); process.exitCode = 1; });
