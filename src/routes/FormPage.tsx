import { useCallback, useEffect, useRef, useState } from "react";
import CampaignSetupForm from "../components/dashboard/CampaignSetupForm";
import HumanReviewPanel from "../components/dashboard/HumanReviewPanel";
import { formatPipelineStepLabel } from "../components/dashboard/formatPipelineStepLabel";
import type { Draft, PipelineStep, RunStatus } from "../components/dashboard/types";
import useAgentStream, {
  type AgentStreamEvent,
  type ResumeAgentPayload,
  type StartAgentPayload,
  RESUME_AGENT_PATH,
  START_AGENT_PATH,
} from "../hooks/UseAgentStream";
import { readLangGraphUpdateNode } from "./agentStreamNormalize";

const formatPublishDate = (iso: string): string | undefined => {
  if (!iso) return undefined;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const parsePublishAt = (pd: unknown): string | undefined => {
  if (pd === undefined || pd === null) return undefined;
  if (typeof pd === "number" && Number.isFinite(pd)) {
    return formatPublishDate(new Date(pd).toISOString());
  }
  const s = String(pd);
  if (!s.trim()) return undefined;
  return formatPublishDate(s);
};

/** Same as streamed `body` unwrap — doubles as result envelope coercion. */
function unwrapEnvelopeBody(body: unknown): Record<string, unknown> | null {
  let v = body;
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

/** Decode `body` when FastAPI/SSE left it as a nested object or JSON string. */
function coerceResultBody(body: unknown): Record<string, unknown> | null {
  return unwrapEnvelopeBody(body);
}

function extractAwaitingDraft(
  b: Record<string, unknown>,
): { content: string; publishDate: unknown } | null {
  const fromDraft = parseDraftField(b.draft);
  if (fromDraft?.content?.trim()) return fromDraft;

  const fromCache = parseDraftField(b.cacheDraft ?? b.cachedDraft);
  if (fromCache?.content?.trim()) return fromCache;

  const posts = b.posts;
  if (Array.isArray(posts)) {
    const firstObj = posts.find(
      (p) => p && typeof p === "object" && !Array.isArray(p),
    );
    if (firstObj && typeof firstObj === "object") {
      const o = firstObj as Record<string, unknown>;
      const pc =
        typeof o.content === "string" && o.content.trim() ? o.content : undefined;
      if (pc) return { content: pc, publishDate: o.publishDate };
    }
  }
  return null;
}

function parseDraftField(
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

function normalizeStreamEvent(raw: unknown): AgentStreamEvent | null {
  let v = raw;
  if (typeof v === "string") {
    try {
      v = JSON.parse(v) as unknown;
    } catch {
      return null;
    }
  }
  if (!v || typeof v !== "object" || Array.isArray(v)) return null;
  const row = v as Record<string, unknown>;
  if (typeof row.state !== "string") return null;
  return {
    status: typeof row.status === "string" ? row.status : "ok",
    state: row.state,
    body: row.body,
  };
}

const FormPage = () => {
  const [url, setUrl] = useState("");
  const [numberOfPosts, setNumberOfPosts] = useState(3);
  const [startDate, setStartDate] = useState("");
  const [status, setStatus] = useState<RunStatus>("idle");
  const [interrupt, setInterrupt] = useState<Draft | null>(null);
  /** Every `state: "updates"` row from the NDJSON stream (`body.node`). */
  const [pipelineSteps, setPipelineSteps] = useState<PipelineStep[]>([]);
  const timerRef = useRef<number | null>(null);

  /**
   * 0 = idle (hook `enabled: false`).
   * Increment when the user submits so `streamRunId` changes and `useAgentStream` opens a new POST stream.
   */
  const [streamRunId, setStreamRunId] = useState(0);
  const [runError, setRunError] = useState<string | null>(null);
  /** Set only when the user clicks START RUN — POST body for that run (no mocked sample text). */
  const [runPayload, setRunPayload] = useState<StartAgentPayload | null>(
    null,
  );
  const [resumePayload, setResumePayload] =
    useState<ResumeAgentPayload | null>(null);
  const [resumeRunId, setResumeRunId] = useState(0);
  const [threadId, setThreadId] = useState<string | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const handleStreamChunk = useCallback(
    (rawStreamEvent: unknown) => {
      const streamEvent = normalizeStreamEvent(rawStreamEvent);
      if (!streamEvent) {
        setRunError(
          "Agent streamed an event that could not be parsed by the frontend.",
        );
        return;
      }

      if (streamEvent.state === "updates") {
        const node = readLangGraphUpdateNode(streamEvent.body);
        if (node) {
          setPipelineSteps((prev) => [
            ...prev,
            {
              node,
              label: formatPipelineStepLabel(node),
              at: Date.now(),
            },
          ]);
        }
        setStatus("streaming");
        return;
      }

      if (streamEvent.state === "error") {
        const b = coerceResultBody(streamEvent.body);
        const message =
          typeof b?.message === "string"
            ? b.message
            : "Agent stream failed on the backend.";
        setRunError(message);
        clearTimer();
        setStatus("error");
        return;
      }

      if (streamEvent.state !== "result") return;

      const b = coerceResultBody(streamEvent.body);
      if (!b) {
        setRunError(
          "Agent returned a result that could not be parsed — check streamed NDJSON body shape.",
        );
        return;
      }
      const innerState = typeof b.state === "string" ? b.state : "";
      const nextThreadId = typeof b.threadId === "string" ? b.threadId : null;
      if (nextThreadId) setThreadId(nextThreadId);

      if (innerState === "awaiting_review") {
        const extracted = extractAwaitingDraft(b);
        clearTimer();

        const content =
          extracted && typeof extracted.content === "string"
            ? extracted.content
            : undefined;

        if (content?.trim()) {
          const total =
            typeof b.numberOfPosts === "number" ? b.numberOfPosts : numberOfPosts;

          setInterrupt({
            index: 1,
            total,
            publishAt: extracted
              ? parsePublishAt(extracted.publishDate)
              : undefined,
            body: content,
          });
          setStatus("paused");
        } else {
          setInterrupt(null);
          setRunError(
            "Agent paused for review, but no draft content was returned in the payload.",
          );
          setStatus("paused");
        }
        return;
      }

      if (innerState === "completed") {
        clearTimer();
        setThreadId(null);
        const postsRaw = Array.isArray(b.posts)
          ? (b.posts as Array<Record<string, unknown>>)
          : [];
        const first = postsRaw.find(
          (p) =>
            p &&
            typeof p.content === "string" &&
            String(p.content).trim().length > 0,
        );
        if (first && typeof first.content === "string") {
          const idx =
            typeof first.postNumber === "number" && Number.isFinite(first.postNumber)
              ? first.postNumber
              : 1;
          setInterrupt({
            index: idx,
            total:
              typeof b.numberOfPosts === "number" ? b.numberOfPosts : numberOfPosts,
            publishAt: parsePublishAt(first.publishDate),
            body: first.content,
          });
        } else {
          setInterrupt(null);
        }
        setStatus("complete");
      }
    },
    [clearTimer, numberOfPosts],
  );

  const handleStreamError = useCallback(
    (_error: Error) => {
      setRunError(_error.message);
      clearTimer();
      setInterrupt(null);
      setPipelineSteps([]);
      setRunPayload(null);
      setStreamRunId(0);
      setStatus("error");
    },
    [clearTimer],
  );

  const { error: streamError } = useAgentStream<unknown>({
    url: START_AGENT_PATH,
    method: "POST",
    body: runPayload ?? undefined,
    enabled: streamRunId > 0 && runPayload !== null,
    streamRunId,
    onChunk: handleStreamChunk,
    onError: handleStreamError,
  });

  const { error: resumeStreamError } = useAgentStream<unknown>({
    url: RESUME_AGENT_PATH,
    method: "POST",
    body: resumePayload ?? undefined,
    enabled: resumeRunId > 0 && resumePayload !== null,
    streamRunId: resumeRunId,
    onChunk: handleStreamChunk,
    onError: handleStreamError,
  });

  useEffect(() => () => clearTimer(), [clearTimer]);

  const startRun = () => {
    setRunError(null);
    const userId = import.meta.env.VITE_DEV_USER_ID?.trim();
    if (!userId) {
      setRunError(
        "Set VITE_DEV_USER_ID in configurations/.env.local (required for AgentRunRequest.userId).",
      );
      return;
    }
    if (!url.trim()) return;

    setRunPayload({
      userId,
      url: url.trim(),
      numberOfPosts,
      startDate: startDate
        ? new Date(startDate).toISOString()
        : new Date().toISOString(),
    });
    clearTimer();
    setInterrupt(null);
    setThreadId(null);
    setResumePayload(null);
    setResumeRunId(0);
    setPipelineSteps([]);
    setStatus("connecting");
    setStreamRunId((version) => version + 1);
  };

  const cancelRun = () => {
    setRunPayload(null);
    setStreamRunId(0);
    clearTimer();
    setStatus("idle");
    setInterrupt(null);
    setThreadId(null);
    setResumePayload(null);
    setResumeRunId(0);
    setPipelineSteps([]);
  };

  const resumeReview = (
    actions: ResumeAgentPayload["decision"]["actions"],
    postChangeDescription = "",
  ) => {
    if (!interrupt || !threadId) {
      setRunError("Cannot resume: missing thread id for the paused agent run.");
      return;
    }

    setRunError(null);
    setResumePayload({
      threadId,
      decision: {
        actions,
        postChangeDescription,
      },
    });
    clearTimer();
    setInterrupt(null);
    setPipelineSteps([]);
    setStatus("connecting");
    setResumeRunId((version) => version + 1);
  };

  const accept = () => {
    resumeReview("Accept");
  };

  const reject = () => {
    resumeReview("Reject");
  };

  const regenerate = (postChangeDescription: string) => {
    const feedback = postChangeDescription.trim();
    if (!feedback) {
      setRunError("Add feedback before regenerating this draft.");
      return;
    }
    resumeReview("Regenerate", feedback);
  };

  const isRunning = status !== "idle" && status !== "complete";

  return (
    <div className="px-6 py-8 lg:px-10 lg:py-10">
      <header className="mb-8 flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          New run
        </h1>
        <p className="max-w-2xl text-base text-black/65 dark:text-white/65">
          Configure your campaign and review AI-generated content before
          publishing.
        </p>
        {runError ? (
          <p className="mt-2 max-w-2xl text-sm text-red-600 dark:text-red-400">
            {runError}
          </p>
        ) : null}
        {(streamError || resumeStreamError) && !runError ? (
          <p className="mt-2 max-w-2xl text-sm text-red-600 dark:text-red-400">
            {(streamError ?? resumeStreamError)?.message}
          </p>
        ) : null}
      </header>

      <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2 lg:gap-8">
        <CampaignSetupForm
          url={url}
          numberOfPosts={numberOfPosts}
          startDate={startDate}
          isRunning={isRunning}
          onUrlChange={setUrl}
          onNumberOfPostsChange={setNumberOfPosts}
          onStartDateChange={setStartDate}
          onSubmit={startRun}
          onCancel={cancelRun}
        />
        <HumanReviewPanel
          status={status}
          draft={interrupt}
          pipelineSteps={pipelineSteps}
          onAccept={accept}
          onReject={reject}
          onRegenerate={regenerate}
        />
      </div>
    </div>
  );
};

export default FormPage;
