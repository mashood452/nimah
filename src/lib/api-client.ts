/** Posts JSON to one of our own API routes and returns the status together with the parsed reply. Never throws. */
export async function postJson<T = Record<string, unknown>>(path: string, body: object): Promise<{ ok: boolean; status: number; data: T & { message?: string; errors?: Record<string, string> } }> {
  try {
    const response = await fetch(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const data = await response.json().catch(() => ({}));
    return { ok: response.ok, status: response.status, data };
  } catch {
    return { ok: false, status: 0, data: { message: "We could not reach the server. Check your connection and try again." } as never };
  }
}
