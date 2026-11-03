import "server-only";
import type { Pool, RowDataPacket } from "mysql2/promise";
import { createDatabasePool } from "./connection";

const globalDb = globalThis as typeof globalThis & { nimahPool?: Pool };

export async function queryRows(sql: string, values: string[] = []): Promise<RowDataPacket[]> {
  globalDb.nimahPool ??= createDatabasePool();
  try {
    const [rows] = await globalDb.nimahPool.execute<RowDataPacket[]>(sql, values);
    return rows;
  } catch (error) {
    // Driver errors may contain SQL or credentials. Do not forward them to logs or browsers.
    const code = error && typeof error === "object" && "code" in error ? String(error.code) : "UNKNOWN";
    throw new Error(`Database read failed (${code}). Check database connectivity and run db:migrate.`);
  }
}
