/** Unwrap `body` when the stream line used a nested JSON string. */
export function unwrapJSONRecord(x: unknown): Record<string, unknown> | null {
  let v = x;
  if (typeof v === "string") {
    try {
      v = JSON.parse(v) as unknown;
    } catch {
      return null;
    }
  }
  if (v && typeof v === "object" && !Array.isArray(v))
    return v as Record<string, unknown>;
  return null;
}

export function readLangGraphUpdateNode(body: unknown): string | undefined {
  const record = unwrapJSONRecord(body);
  if (!record) return undefined;
  const n = record.node;
  return typeof n === "string" && n.trim().length > 0 ? n : undefined;
}
