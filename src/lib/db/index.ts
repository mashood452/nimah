import "server-only";
import type { Pool, PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { createDatabasePool } from "./connection";
import { databaseErrorMessage } from "./errors";

const globalDb = globalThis as typeof globalThis & { nimahPool?: Pool };
type SqlValue = string | number | null;

export class DatabaseError extends Error {
  readonly code: string;
  constructor(error: unknown) {
    super(databaseErrorMessage(error));
    this.name = "DatabaseError";
    this.code = error && typeof error === "object" && "code" in error ? String(error.code) : "UNKNOWN";
  }
}

function pool() {
  globalDb.nimahPool ??= createDatabasePool();
  return globalDb.nimahPool;
}

export async function queryRows(sql: string, values: SqlValue[] = []): Promise<RowDataPacket[]> {
  try {
    const [rows] = await pool().execute<RowDataPacket[]>(sql, values);
    return rows;
  } catch (error) {
    // Driver errors may contain SQL or credentials. Do not forward them to logs or browsers.
    throw new DatabaseError(error);
  }
}

export async function executeWrite(sql: string, values: SqlValue[] = []): Promise<ResultSetHeader> {
  try {
    const [result] = await pool().execute<ResultSetHeader>(sql, values);
    return result;
  } catch (error) { throw new DatabaseError(error); }
}

export async function transaction<T>(work: (connection: PoolConnection) => Promise<T>): Promise<T> {
  const connection = await pool().getConnection();
  try {
    await connection.beginTransaction();
    const result = await work(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw new DatabaseError(error);
  } finally { connection.release(); }
}
