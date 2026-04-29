import { useState, useEffect, useLayoutEffect, useRef } from "react";

/** POST body matches FastAPI `AgentRunRequest` at `/api/v1/startAgent`. */
export type StartAgentPayload = {
  userId: string;
  url: string;
  numberOfPosts: number;
  /** ISO datetime string */
  startDate: string;
};

/** POST body matches FastAPI `AgentResumeRunRequest` at `/api/v1/resumeAgent`. */
export type ResumeAgentPayload = {
  threadId: string;
  decision: {
    actions: "Accept" | "Reject" | "Regenerate";
    postChangeDescription?: string;
  };
};

/** FastAPI streamed `APIResponse` JSON lines */
export type AgentStreamEvent = {
  status: string;
  state: string;
  body: unknown;
};

export type UseAgentStreamOptions<T = unknown> = {
  /** Relative or absolute URL (`/api/v1/startAgent` or full `https://…`). */
  url: string;
  method?: "GET" | "POST";
  body?: Record<string, unknown> | unknown;
  headers?: HeadersInit;
  /** When false, no network request runs. Defaults to true. */
  enabled?: boolean;
  /** Increment each submit to open a fresh stream when the URL is unchanged. */
  streamRunId?: number;
  /** Called for each parsed NDJSON line. */
  onChunk?: (event: T) => void;
  /** Non-abort stream failure before the hook resets `error` on the next run. */
  onError?: (err: Error) => void;
};

export interface SSEHookResult<T> {
  data: T | null;
  error: Error | null;
  isConnected: boolean;
}

const joinBaseUrl = (base: string | undefined, path: string): string => {
  const b = (base ?? "").trim();
  const trimmedBase = b.endsWith("/") ? b.slice(0, -1) : b;
  const prefixedPath = path.startsWith("/") ? path : `/${path}`;
  if (!trimmedBase) return prefixedPath;
  return `${trimmedBase}${prefixedPath}`;
};

const decodeStreamLine = (line: string): string | undefined => {
  const trimmed = line.trim();
  if (!trimmed) return undefined;
  // SSE comment / keep-alive lines (e.g. ": ping") — not JSON; must not reach JSON.parse
  if (trimmed.startsWith(":")) return undefined;
  if (trimmed.startsWith("data:")) {
    const rest = trimmed.slice(5).trim();
    // Some proxies send "data: : ping" style lines; treat as non-JSON
    if (rest.startsWith(":")) return undefined;
    return rest;
  }
  return trimmed;
};

/** Verbose NDJSON logging — set `VITE_DEBUG_AGENT_STREAM=true` in `configurations/.env.local` (restart Vite). */
const DEBUG_AGENT_STREAM =
  import.meta.env.VITE_DEBUG_AGENT_STREAM === "true";

function patchStreamDebug(
  partial: Partial<
    Pick<
      NonNullable<Window["__MARKETING_AGENT_STREAM_DEBUG__"]>,
      "targetUrl" | "viteBaseUrl" | "lastParsed" | "lastError" | "phase"
    >
  >,
): void {
  if (!DEBUG_AGENT_STREAM || typeof window === "undefined") return;
  const prev = window.__MARKETING_AGENT_STREAM_DEBUG__;
  window.__MARKETING_AGENT_STREAM_DEBUG__ = {
    ...prev,
    ...partial,
    updatedAt: Date.now(),
  };
}

const previewStr = (s: string, max = 900): string =>
  s.length > max ? `${s.slice(0, max)}… (${s.length} chars total)` : s;

const logStream = (label: string, detail?: unknown) => {
  if (!DEBUG_AGENT_STREAM) return;
  if (detail !== undefined) {
    console.log(`[useAgentStream] ${label}`, detail);
  } else {
    console.log(`[useAgentStream] ${label}`);
  }
};

export function useAgentStream<T = unknown>(
  options: UseAgentStreamOptions<T>,
): SSEHookResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const controllerRef = useRef<AbortController | null>(null);
  const optionsRef = useRef(options);

  useLayoutEffect(() => {
    optionsRef.current = options;
  });

  const enabled = options.enabled ?? true;
  const streamRunId = options.streamRunId ?? 0;
  const { url } = options;

  useEffect(() => {
    if (!enabled || !url.trim()) return undefined;

    let cancelled = false;

    const run = async () => {
      const opts = optionsRef.current;
      controllerRef.current?.abort();
      const controller = new AbortController();
      controllerRef.current = controller;

      setError(null);
      setIsConnected(true);

      const targetUrl =
        url.startsWith("http://") || url.startsWith("https://")
          ? url
          : joinBaseUrl(import.meta.env.VITE_BASE_URL, url);

      logStream("fetch start", {
        targetUrl,
        viteBaseUrl: import.meta.env.VITE_BASE_URL ?? "(empty)",
        method: opts.method ?? "POST",
        body: opts.body,
      });
      patchStreamDebug({
        targetUrl,
        viteBaseUrl:
          typeof import.meta.env.VITE_BASE_URL === "string"
            ? import.meta.env.VITE_BASE_URL
            : undefined,
        phase: "fetch_start",
        lastError: undefined,
      });

      try {
        const method = opts.method ?? "POST";
        const init: RequestInit = {
          method,
          credentials: "omit",
          headers: opts.headers ?? {
            "Content-Type": "application/json",
            Accept: "application/x-ndjson, text/event-stream, application/json;q=0.9, */*",
            "Cache-Control": "no-cache",
          },
          signal: controller.signal,
          body:
            method === "GET" || opts.body === undefined
              ? undefined
              : JSON.stringify(opts.body),
        };

        const response = await fetch(targetUrl, init);

        logStream("response headers", {
          ok: response.ok,
          status: response.status,
          statusText: response.statusText,
          contentType: response.headers.get("content-type"),
          hasBody: response.body !== null,
        });
        patchStreamDebug({
          phase: response.ok ? "streaming_body" : `http_${response.status}`,
        });

        if (!response.ok || !response.body) {
          throw new Error(
            `Stream request failed: ${response.status} ${response.statusText}`,
          );
        }

        const reader = response.body
          .pipeThrough(new TextDecoderStream())
          .getReader();

        let buffer = "";
        while (!cancelled) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += value;
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            const payload = decodeStreamLine(line);
            if (!payload) {
              logStream("skipped line (ping/empty/SSE)", previewStr(line, 160));
              continue;
            }
            logStream("NDJSON line (string)", previewStr(payload));
            try {
              const parsed = JSON.parse(payload) as T;
              patchStreamDebug({
                lastParsed: parsed as unknown,
                phase: "ndjson_chunk",
              });
              logStream("parsed NDJSON row", parsed as Record<string, unknown>);
              setData(parsed);
              opts.onChunk?.(parsed);
            } catch (e) {
              logStream("JSON.parse failed for line", previewStr(payload, 400));
              console.error("[useAgentStream] Failed to parse streamed line:", e);
            }
          }
        }

        logStream("stream reader done", { leftoverBufferChars: buffer.length });

        const tail = decodeStreamLine(buffer);
        if (tail && !cancelled) {
          logStream("final buffer (tail) string", previewStr(tail));
          try {
            const parsed = JSON.parse(tail) as T;
            patchStreamDebug({
              lastParsed: parsed as unknown,
              phase: "ndjson_tail",
            });
            logStream("parsed tail NDJSON row", parsed as Record<string, unknown>);
            setData(parsed);
            opts.onChunk?.(parsed);
          } catch (e) {
            logStream("tail JSON.parse failed", previewStr(tail, 400));
            console.error("[useAgentStream] Failed to parse stream tail:", e);
          }
        } else if (buffer.trim() && !cancelled) {
          logStream("leftover buffer with no parsable tail", previewStr(buffer));
        }

        logStream("fetch stream ended");
        patchStreamDebug({ phase: "stream_closed_ok" });
      } catch (err: unknown) {
        if (
          !cancelled &&
          !(err instanceof DOMException && err.name === "AbortError")
        ) {
          const e =
            err instanceof Error ? err : new Error(String(err));
          patchStreamDebug({
            lastError: e.message,
            phase: "error",
          });
          logStream("error", e);
          setError(e);
          opts.onError?.(e);
        } else if (err instanceof DOMException && err.name === "AbortError") {
          patchStreamDebug({
            phase: cancelled ? "aborted_cleanup" : "aborted_strict_mode_or_cancel",
          });
          logStream("aborted (unmount Strict Mode / cancel)");
        }
      } finally {
        if (!cancelled && controllerRef.current === controller) {
          controllerRef.current = null;
        }
        setIsConnected(false);
      }
    };

    void run();

    return () => {
      cancelled = true;
      controllerRef.current?.abort();
      controllerRef.current = null;
      setIsConnected(false);
    };
  }, [url, enabled, streamRunId]);

  return { data, error, isConnected };
}

export default useAgentStream;

/** Path appended to `VITE_BASE_URL` unless you pass an absolute hook `url`. */
export const START_AGENT_PATH = "/api/v1/startAgent";

/** Path appended to `VITE_BASE_URL` unless you pass an absolute hook `url`. */
export const RESUME_AGENT_PATH = "/api/v1/resumeAgent";
