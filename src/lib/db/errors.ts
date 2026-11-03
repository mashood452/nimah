/** Safe diagnostics for server/build logs. Never forward driver SQL or full error messages. */
export function databaseErrorMessage(error: unknown): string {
  const rawCode = error && typeof error === "object" && "code" in error ? String(error.code) : "UNKNOWN";
  const code = /^[A-Z0-9_]+$/.test(rawCode) ? rawCode : "UNKNOWN";
  if (code === "ER_ACCESS_DENIED_ERROR") {
    const sourceHost = error instanceof Error
      ? error.message.match(/Access denied for user '[^']*'@'([a-zA-Z0-9.:_%\-]{1,255})'/)?.[1]
      : undefined;
    return `Database authentication failed (${code})${sourceHost ? ` for source host ${sourceHost}` : ""}. Check deployment DATABASE_URL credentials, DB_HOST and database-user access. Hostinger-hosted apps use DB_HOST=127.0.0.1.`;
  }
  if (code === "ER_NO_SUCH_TABLE" || code === "ER_BAD_FIELD_ERROR") {
    return `Database schema is out of date (${code}). Run db:migrate against the application database.`;
  }
  return `Database connection or read failed (${code}). Check the deployment database settings and connectivity.`;
}
