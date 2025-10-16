import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:password@localhost:5432/kubiciranje'
});

export const query = (text: string, params?: any[]) => pool.query(text, params);

export const initDb = async () => {
  const sql = fs.readFileSync(path.join(__dirname, 'migrations', 'init.sql'), 'utf-8');
  await pool.query(sql);
};
