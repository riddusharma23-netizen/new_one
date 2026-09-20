import mysql from "mysql2/promise";

export type DbParam =
  | string
  | number
  | bigint
  | boolean
  | Date
  | null
  | undefined
  | Buffer
  | Uint8Array
  | DbParam[]
  | { [key: string]: DbParam };

declare global {
  var mysqlPool: mysql.Pool | undefined;
}

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function createPool() {
  return mysql.createPool({
    host: requiredEnv("DB_HOST"),
    user: requiredEnv("DB_USER"),
    password: process.env.DB_PASSWORD ?? "",
    database: requiredEnv("DB_NAME"),
    port: Number(process.env.DB_PORT || 3306),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    namedPlaceholders: false,
    timezone: "Z",
  });
}

export function getPool(): mysql.Pool {
  if (!global.mysqlPool) {
    global.mysqlPool = createPool();
  }
  return global.mysqlPool;
}

export async function query<T>(sql: string, params: DbParam = []): Promise<T[]> {
  const [rows] = await getPool().execute(sql, params as never);
  return rows as T[];
}

export async function queryOne<T>(sql: string, params: DbParam = []): Promise<T | null> {
  const rows = await query<T>(sql, params);
  return rows[0] ?? null;
}

export async function execute(sql: string, params: DbParam = []): Promise<mysql.ResultSetHeader> {
  const [result] = await getPool().execute(sql, params as never);
  return result as mysql.ResultSetHeader;
}

const db = {
  query: (sql: string, params?: DbParam) => getPool().query(sql, params as never),
  execute: (sql: string, params?: DbParam) => getPool().execute(sql, params as never),
  getPool,
};

export default db;
