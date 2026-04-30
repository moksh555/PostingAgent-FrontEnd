import { isAxiosError } from "axios";

import type { RunListStatus, RunSummary } from "../components/runs/types";

import { apiClient } from "./ApiClient";

export type UserThreadStateApiRow = {
  threadId: string;
  status: string;
  startDate: string;
  numberOfPosts: number;
  campaignURL: string;
};

function coercePostsTotal(v: unknown): number {
  if (typeof v === "number" && Number.isFinite(v)) return Math.max(0, Math.floor(v));
  if (typeof v === "string" && /^-?\d+$/.test(v.trim()))
    return Math.max(0, parseInt(v, 10));
  return 0;
}

/** FastAPI emits `Paused` | `Assigned` | `Completed` — map to pills + stats copy. */
function mapApiStatus(apiStatus: string): RunListStatus {
  switch (apiStatus.trim().toLowerCase()) {
    case "paused":
      return "paused";
    case "completed":
      return "complete";
    case "assigned":
      return "running";
    default:
      return "running";
  }
}

/** Turn one GET `/getUserThreadStates/{userId}` element into dashboard row shape. */
export function normalizeUserThreadStateRow(
  raw: unknown,
): RunSummary | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const r = raw as Record<string, unknown>;

  if (
    typeof r.threadId !== "string" ||
    typeof r.status !== "string" ||
    typeof r.campaignURL !== "string"
  ) {
    return null;
  }

  let startedAt: string;
  if (typeof r.startDate === "string") startedAt = r.startDate;
  else if (
    typeof r.startDate === "number" &&
    Number.isFinite(r.startDate)
  ) {
    startedAt = new Date(r.startDate).toISOString();
  } else {
    return null;
  }

  const postsTotal = coercePostsTotal(r.numberOfPosts);
  const status = mapApiStatus(r.status);
  const postsDone =
    status === "complete" ? postsTotal : 0;

  return {
    id: r.threadId,
    threadId: r.threadId,
    status,
    startedAt,
    url: r.campaignURL,
    postsDone,
    postsTotal,
  };
}

/** Extract FastAPI `{ status, code, message }` from Axios error payloads. */
export function threadsListErrorMessage(err: unknown): string {
  if (isAxiosError(err)) {
    const d = err.response?.data;
    if (d && typeof d === "object" && "message" in d) {
      const m = (d as { message?: unknown }).message;
      if (typeof m === "string" && m.trim()) return m;
    }
    if (typeof err.message === "string" && err.message.trim())
      return err.message;
  }
  if (err instanceof Error && err.message) return err.message;
  return "Failed to load runs.";
}

export async function getUserThreadStates(
  userId: string,
): Promise<RunSummary[]> {
  const response = await apiClient.get(`/api/v1/getUserThreadStates/${userId}`);
  const raw = response.data;

  const rows: RunSummary[] = [];
  if (Array.isArray(raw)) {
    for (const item of raw) {
      const n = normalizeUserThreadStateRow(item);
      if (n) rows.push(n);
    }
  }

  rows.sort((a, b) => Date.parse(b.startedAt) - Date.parse(a.startedAt));

  return rows;
}
