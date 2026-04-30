import type { Draft } from "./types";

function formatPublishDate(iso: string): string | undefined {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function parsePublishAtForSlides(pd: unknown): string | undefined {
  if (pd === undefined || pd === null) return undefined;
  if (typeof pd === "number" && Number.isFinite(pd)) {
    return formatPublishDate(new Date(pd).toISOString());
  }
  const s = String(pd);
  if (!s.trim()) return undefined;
  return formatPublishDate(s);
}

function parseDraftFieldForSlides(
  draftRaw: unknown,
): { content: string; publishDate: unknown } | null {
  let d: unknown = draftRaw;
  if (typeof d === "string") {
    try {
      d = JSON.parse(d) as unknown;
    } catch {
      return null;
    }
  }
  if (!d || typeof d !== "object" || Array.isArray(d)) return null;
  const obj = d as Record<string, unknown>;
  const content = typeof obj.content === "string" ? obj.content : undefined;
  if (!content?.trim()) return null;
  return { content, publishDate: obj.publishDate };
}

function coerceTotalFromBody(
  b: Record<string, unknown>,
  fallback: number,
): number {
  const n = b.numberOfPosts;
  if (typeof n === "number" && Number.isFinite(n)) {
    return Math.min(9, Math.max(1, Math.floor(n)));
  }
  return Math.min(9, Math.max(1, fallback));
}

/**
 * Build ordered review slides from stream/snapshot `posts` plus optional pending `draft`
 * when `state === awaiting_review`. Pending slot uses max(postNumber)+1 (same as graph).
 */
export function buildCampaignSlidesFromResultBody(
  b: Record<string, unknown>,
  innerState: "awaiting_review" | "completed",
  fallbackTotal: number,
): { slides: Draft[]; pendingSlideIndex: number | null } {
  const total = coerceTotalFromBody(b, fallbackTotal);
  const postsRaw = Array.isArray(b.posts) ? b.posts : [];

  const seen = new Map<number, Draft>();

  for (let i = 0; i < postsRaw.length; i++) {
    const p = postsRaw[i];
    if (!p || typeof p !== "object" || Array.isArray(p)) continue;
    const o = p as Record<string, unknown>;
    const rawContent = o.content;
    const content =
      typeof rawContent === "string" && rawContent.trim()
        ? rawContent.trim()
        : "";
    if (!content) continue;

    let idx =
      typeof o.postNumber === "number" &&
      Number.isFinite(o.postNumber) &&
      Math.floor(o.postNumber) >= 1
        ? Math.floor(o.postNumber)
        : 0;

    if (idx === 0) idx = seen.size + 1;

    seen.set(idx, {
      index: idx,
      total,
      publishAt: parsePublishAtForSlides(o.publishDate),
      body: content,
    });
  }

  let slides = [...seen.values()].sort((a, c) => a.index - c.index);

  let pendingSlideIndex: number | null = null;

  if (innerState === "awaiting_review") {
    const extracted =
      parseDraftFieldForSlides(b.draft) ??
      parseDraftFieldForSlides(b.cacheDraft) ??
      parseDraftFieldForSlides(b.cachedDraft);

    const body = extracted?.content?.trim() ?? "";

    if (body) {
      const maxPn =
        slides.length > 0 ? Math.max(...slides.map((s) => s.index)) : 0;
      const draftPn = maxPn + 1;
      const publishAt = extracted
        ? parsePublishAtForSlides(extracted.publishDate)
        : undefined;
      const pendingDraft: Draft = {
        index: draftPn,
        total,
        publishAt,
        body,
      };
      const at = slides.findIndex((s) => s.index === draftPn);
      if (at >= 0) {
        slides = [...slides];
        slides[at] = pendingDraft;
        pendingSlideIndex = at;
      } else {
        slides = [...slides, pendingDraft].sort((a, c) => a.index - c.index);
        pendingSlideIndex = slides.findIndex((s) => s.index === draftPn);
      }
    }
  }

  return { slides, pendingSlideIndex };
}
