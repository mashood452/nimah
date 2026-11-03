import { createPool, type Pool } from "mysql2/promise";

// Shared by the server-only repository and local maintenance scripts.
export function createDatabasePool(env: Record<string, string | undefined> = process.env): Pool {
  if (!env.DATABASE_URL) throw new Error("Set DATABASE_URL in .env.local (or the hosting environment) before using MySQL.");
  let url: URL;
  try { url = new URL(env.DATABASE_URL); } catch {
    throw new Error("DATABASE_URL must be a valid mysql:// URL with an encoded password.");
  }
  if (url.protocol !== "mysql:" || !url.hostname || !url.username || !url.password || url.pathname.length <= 1) {
    throw new Error("DATABASE_URL must include the MySQL host, username, password and database name.");
  }
  let user: string;
  let password: string;
  let database: string;
  try {
    user = decodeURIComponent(url.username);
    password = decodeURIComponent(url.password);
    database = decodeURIComponent(url.pathname.slice(1));
  } catch {
    throw new Error("DATABASE_URL contains invalid password escaping. Percent-encode special characters before saving it.");
  }
  const pool = createPool({
    host: url.hostname, port: Number(url.port || 3306), user, password, database,
    charset: "utf8mb4", timezone: "Z", dateStrings: true,
    connectionLimit: 5, maxIdle: 2, idleTimeout: 60_000, connectTimeout: 10_000,
    waitForConnections: true, queueLimit: 100, multipleStatements: false,
    ...(env.DATABASE_SSL === "true" ? { ssl: { rejectUnauthorized: true } } : {}),
  });
  pool.on("connection", (connection) => {
    connection.query("SET time_zone = '+00:00'");
  });
  return pool;
}
