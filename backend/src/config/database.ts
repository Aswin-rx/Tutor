import { Pool } from 'pg';
import { config } from './config';

const pool = new Pool({
  host: config.database.host,
  port: config.database.port,
  user: config.database.user,
  password: config.database.password,
  database: config.database.database
});

export const db = pool; 