import Knex from 'knex';

export const knex = Knex({
  client: 'pg',
  connection: process.env.DATABASE_URL,
  pool: { min: 2, max: 10 },
});

export async function runMigrations() {
  await knex.migrate.latest();
}

export async function createPartitionForDate(date: Date) {
  const d = new Date(date);
  const start = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
  const next = new Date(d);
  next.setUTCDate(next.getUTCDate() + 1);
  const end = `${next.getUTCFullYear()}-${String(next.getUTCMonth() + 1).padStart(2, '0')}-${String(next.getUTCDate()).padStart(2, '0')}`;
  const name = `stream_events_${start.replace(/-/g, '_')}`;
  await knex.raw(`
    CREATE TABLE IF NOT EXISTS ${name}
    PARTITION OF stream_events
    FOR VALUES FROM ('${start}') TO ('${end}')
  `);
}

export async function dropPartitionsOlderThan(days: number) {
  const cutoff = new Date();
  cutoff.setUTCDate(cutoff.getUTCDate() - days);
  const rows = await knex.raw<{ rows: { tablename: string }[] }>(`
    SELECT tablename FROM pg_tables
    WHERE tablename LIKE 'stream_events_%'
      AND schemaname = 'public'
  `);
  for (const { tablename } of rows.rows) {
    const match = tablename.match(/stream_events_(\d{4})_(\d{2})_(\d{2})$/);
    if (!match) continue;
    const partDate = new Date(`${match[1]}-${match[2]}-${match[3]}`);
    if (partDate < cutoff) {
      await knex.raw(`DROP TABLE IF EXISTS ${tablename}`);
    }
  }
}

export async function ensureUpcomingPartitions(daysAhead = 7) {
  for (let i = 0; i <= daysAhead; i++) {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() + i);
    await createPartitionForDate(d);
  }
}
