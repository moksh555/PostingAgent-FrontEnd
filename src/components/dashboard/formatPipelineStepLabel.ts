/**
 * Readable label for streamed graph node ids (e.g. `Building_Marketing_Brief`).
 */
export function formatPipelineStepLabel(node: string): string {
  const t = node.trim();
  if (!t) return "Pipeline step";

  const lower = t.toLowerCase();
  if (lower === "__interrupt__") return "Interrupt (review checkpoint)";

  return t
    .replace(/_/g, " ")
    .replace(/\b\w/g, (ch) => ch.toUpperCase());
}
