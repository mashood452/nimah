import "server-only";
import type { Pool, RowDataPacket } from "mysql2/promise";
import { createDatabasePool } from "./connection";
import { databaseErrorMessage } from "./errors";

const globalDb = globalThis as typeof globalThis & { nimahPool?: Pool };

export async function queryRows(sql: string, values: string[] = []): Promise<RowDataPacket[]> {
  globalDb.nimahPool ??= createDatabasePool();
  try {
    const [rows] = await globalDb.nimahPool.execute<RowDataPacket[]>(sql, values);
    return rows;
  } catch (error) {
    // Driver errors may contain SQL or credentials. Do not forward them to logs or browsers.
    throw new Error(databaseErrorMessage(error));
  }
}
