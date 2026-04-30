import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  startTransition,
} from "react";
import { useLocation, Link, useNavigate, useParams } from "react-router-dom";
import CampaignSetupForm from "../components/dashboard/CampaignSetupForm";
import HumanReviewPanel from "../components/dashboard/HumanReviewPanel";
import { buildCampaignSlidesFromResultBody } from "../components/dashboard/campaignPosts";
import { formatPipelineStepLabel } from "../components/dashboard/formatPipelineStepLabel";
import type {
  Draft,
  PipelineStep,
  RunStatus,
} from "../components/dashboard/types";
import useAgentStream, {
  type AgentStreamEvent,
  type ResumeAgentPayload,
  type StartAgentPayload,
  RESUME_AGENT_PATH,
  START_AGENT_PATH,
} from "../hooks/UseAgentStream";
import { readLangGraphUpdateNode } from "./agentStreamNormalize";
import {
  getAgentThreadSnapshot,
  threadsListErrorMessage,
} from "../services/ServicesAgent";

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

function isoToDatetimeLocal(raw: unknown): string {
  if (raw === undefined || raw === null) return "";
  const s =
    typeof raw === "number" && Number.isFinite(raw)
      ? new Date(raw).toISOString()
      : String(raw);
  if (!s.trim()) return "";
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const h = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${day}T${h}:${min}`;
}

/** Short label for checkpoint thread id (full id in tooltip / aria-label). */
function threadIdDisplayLabel(threadId: string): string {
  const t = threadId.trim();
  if (t.length <= 13) return t;
  return `${t.slice(0, 8)}…${t.slice(-4)}`;
}

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
        typeof o.content === "string" && o.content.trim()
          ? o.content
          : undefined;
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
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams<{ threadId?: string }>();
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
  const [runPayload, setRunPayload] = useState<StartAgentPayload | null>(null);
  const [resumePayload, setResumePayload] = useState<ResumeAgentPayload | null>(
    null,
  );
  const [resumeRunId, setResumeRunId] = useState(0);
  const [threadId, setThreadId] = useState<string | null>(null);
  /** True while fetching snapshot after navigating from Past runs OPEN. */
  const [resumeHydrateBusy, setResumeHydrateBusy] = useState(false);

  /** Multi-post carousel from checkpoint `posts` (+ pending draft when paused). */
  const [campaignSlides, setCampaignSlides] = useState<Draft[]>([]);
  const [postViewerIndex, setPostViewerIndex] = useState(0);
  /** Index into `campaignSlides` for Accept/Reject/Regenerate; null when not carousel-gated. */
  const [pendingSlideIndex, setPendingSlideIndex] = useState<number | null>(
    null,
  );

  /** Checkpoint thread id from `/dashboard/resume/:threadId` only (legacy `/form` + state redirects first). */
  const resumeNavTid = useMemo(() => {
    const fromParam =
      typeof params.threadId === "string" ? params.threadId.trim() : "";
    return fromParam;
  }, [params.threadId]);

  /** Old OPEN flow used `/form` + state; send to canonical resume URL. */
  useLayoutEffect(() => {
    if (location.pathname !== "/dashboard/form") return;
    const raw = (
      location.state as { resumeThreadId?: unknown } | null | undefined
    )?.resumeThreadId;
    const tid = typeof raw === "string" && raw.trim() ? raw.trim() : "";
    if (!tid) return;
    navigate(`/dashboard/resume/${encodeURIComponent(tid)}`, {
      replace: true,
      state: {},
    });
  }, [location.pathname, location.state, navigate]);

  const isResumeContext = resumeNavTid.length > 0;

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const handleStreamChunk = useCallback(
    (rawStreamEvent: unknown, hydrateOpts?: { pastRunKeepThread?: string }) => {
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
        clearTimer();

        const extracted = extractAwaitingDraft(b);
        const fbTotal =
          typeof b.numberOfPosts === "number" && Number.isFinite(b.numberOfPosts)
            ? Math.min(9, Math.max(1, Math.floor(b.numberOfPosts)))
            : numberOfPosts;

        const { slides: builtSlides, pendingSlideIndex: builtPending } =
          buildCampaignSlidesFromResultBody(
            b,
            "awaiting_review",
            numberOfPosts,
          );

        let slides = builtSlides;
        let pendIdx = builtPending;
        const content =
          extracted && typeof extracted.content === "string"
            ? extracted.content.trim()
            : "";

        if (slides.length === 0 && content) {
          slides = [
            {
              index: 1,
              total: fbTotal,
              publishAt: extracted
                ? parsePublishAt(extracted.publishDate)
                : undefined,
              body: content,
            },
          ];
          pendIdx = 0;
        }

        if (slides.length > 0) {
          const viewIdx =
            pendIdx !== null
              ? Math.min(Math.max(pendIdx, 0), slides.length - 1)
              : 0;
          const pendingDraft =
            pendIdx !== null && slides[pendIdx]
              ? slides[pendIdx]!
              : slides[slides.length - 1]!;

          setCampaignSlides(slides);
          setPendingSlideIndex(pendIdx);
          setPostViewerIndex(viewIdx);
          setInterrupt(pendingDraft);
          setStatus("paused");
        } else {
          setCampaignSlides([]);
          setPendingSlideIndex(null);
          setPostViewerIndex(0);
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
        const keep = hydrateOpts?.pastRunKeepThread?.trim();
        if (keep) setThreadId(keep);
        else setThreadId(null);

        const { slides } = buildCampaignSlidesFromResultBody(
          b,
          "completed",
          numberOfPosts,
        );
        setCampaignSlides(slides);
        setPendingSlideIndex(null);
        setPostViewerIndex(0);
        setInterrupt(slides[0] ?? null);
        setStatus("complete");
      }
    },
    [clearTimer, numberOfPosts],
  );

  const handleStreamChunkRef = useRef(handleStreamChunk);
  useEffect(() => {
    handleStreamChunkRef.current = handleStreamChunk;
  }, [handleStreamChunk]);

  const prevResumeNavTidRef = useRef<string>("");

  const handleStreamError = useCallback(
    (_error: Error) => {
      setRunError(_error.message);
      clearTimer();
      setInterrupt(null);
      setCampaignSlides([]);
      setPendingSlideIndex(null);
      setPostViewerIndex(0);
      setPipelineSteps([]);
      setRunPayload(null);
      setStreamRunId(0);
      setStatus("error");
    },
    [clearTimer],
  );

  /** Past runs OPEN: hydrate form + interrupt from snapshot (same pathway as streamed `state:result`). */
  useEffect(() => {
    const prev = prevResumeNavTidRef.current;
    prevResumeNavTidRef.current = resumeNavTid;

    if (!resumeNavTid) {
      startTransition(() => setResumeHydrateBusy(false));
      if (prev) {
        startTransition(() => setThreadId(null));
        startTransition(() => {
          setCampaignSlides([]);
          setPendingSlideIndex(null);
          setPostViewerIndex(0);
        });
      }
      return;
    }

    let cancelled = false;

    startTransition(() => {
      setThreadId(resumeNavTid);
      setResumeHydrateBusy(true);
    });

    void (async () => {
      setRunError(null);
      clearTimer();
      setInterrupt(null);
      setCampaignSlides([]);
      setPendingSlideIndex(null);
      setPostViewerIndex(0);
      setPipelineSteps([]);
      setResumePayload(null);
      setResumeRunId(0);
      setRunPayload(null);
      setStreamRunId(0);
      try {
        const raw = await getAgentThreadSnapshot(resumeNavTid);
        if (cancelled) return;

        const b =
          coerceResultBody(raw) ??
          unwrapEnvelopeBody(raw) ??
          (typeof raw === "object" && raw !== null && !Array.isArray(raw)
            ? (raw as Record<string, unknown>)
            : null);
        if (!b) {
          setRunError(
            "Could not parse thread snapshot returned by the server.",
          );
          return;
        }

        if (typeof b.url === "string" && b.url.trim()) setUrl(b.url.trim());
        if (
          typeof b.numberOfPosts === "number" &&
          Number.isFinite(b.numberOfPosts)
        ) {
          setNumberOfPosts(
            Math.min(9, Math.max(1, Math.floor(b.numberOfPosts))),
          );
        }
        const localStart = isoToDatetimeLocal(b.startDate);
        if (localStart) setStartDate(localStart);

        handleStreamChunkRef.current(
          { status: "ok", state: "result", body: b },
          { pastRunKeepThread: resumeNavTid },
        );
      } catch (err: unknown) {
        if (!cancelled) setRunError(threadsListErrorMessage(err));
      } finally {
        if (!cancelled) startTransition(() => setResumeHydrateBusy(false));
      }
    })();

    return () => {
      cancelled = true;
      startTransition(() => setResumeHydrateBusy(false));
    };
  }, [resumeNavTid, clearTimer]);

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
    if (location.pathname.startsWith("/dashboard/resume/")) {
      navigate("/dashboard/form", { replace: true, state: {} });
    } else {
      navigate(".", { replace: true, state: {} });
    }
    clearTimer();
    setInterrupt(null);
    setCampaignSlides([]);
    setPendingSlideIndex(null);
    setPostViewerIndex(0);
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
    setCampaignSlides([]);
    setPendingSlideIndex(null);
    setPostViewerIndex(0);
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
    setCampaignSlides([]);
    setPendingSlideIndex(null);
    setPostViewerIndex(0);
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

  const effectiveViewerIndex = useMemo(() => {
    if (campaignSlides.length === 0) return 0;
    return Math.min(Math.max(postViewerIndex, 0), campaignSlides.length - 1);
  }, [campaignSlides.length, postViewerIndex]);

  const viewedDraft = useMemo((): Draft | null => {
    if (campaignSlides.length > 0)
      return campaignSlides[effectiveViewerIndex] ?? null;
    return interrupt;
  }, [campaignSlides, effectiveViewerIndex, interrupt]);

  const awaitingPaused = status === "paused";

  const decisionButtonsEnabled =
    awaitingPaused &&
    interrupt !== null &&
    (pendingSlideIndex === null ||
      effectiveViewerIndex === pendingSlideIndex);

  const browseHint =
    awaitingPaused &&
    pendingSlideIndex !== null &&
    !decisionButtonsEnabled &&
    viewedDraft !== null
      ? `Accept, Reject, and Regenerate apply to post ${campaignSlides[pendingSlideIndex]?.index ?? "—"} — use the arrows to switch to that post.`
      : null;

  const carouselNav =
    campaignSlides.length > 1
      ? {
          canGoPrev: effectiveViewerIndex > 0,
          canGoNext: effectiveViewerIndex < campaignSlides.length - 1,
          onPrev: () =>
            setPostViewerIndex((i) => {
              if (campaignSlides.length === 0) return 0;
              const capped = Math.min(
                Math.max(i, 0),
                campaignSlides.length - 1,
              );
              return Math.max(0, capped - 1);
            }),
          onNext: () =>
            setPostViewerIndex((i) => {
              const last = campaignSlides.length - 1;
              if (last < 0) return 0;
              const capped = Math.min(Math.max(i, 0), last);
              return Math.min(last, capped + 1);
            }),
        }
      : null;

  return (
    <div className="px-6 py-8 lg:px-10 lg:py-10">
      <header className="mb-8 flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {isResumeContext ? "Resume campaign" : "New run"}
        </h1>
        <p className="max-w-2xl text-base text-black/65 dark:text-white/65">
          {isResumeContext ? (
            <>
              Pick up where you left off—review the draft or continue the run.
            </>
          ) : (
            <>
              Configure your campaign and review AI-generated content before
              publishing.
            </>
          )}
        </p>
        {isResumeContext ? (
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Link
              to="/dashboard/pastRun"
              className="inline-flex items-center gap-2 rounded-xl border border-black/15 bg-white/70 px-3.5 py-2 text-sm font-medium text-neutral-900 shadow-xs transition-colors hover:bg-white dark:border-white/15 dark:bg-white/8 dark:text-neutral-50 dark:hover:bg-white/12"
              aria-label="Back to runs list"
            >
              <span aria-hidden className="-ml-0.5 text-base leading-none">
                ←
              </span>
              Back to runs
            </Link>
            <span
              className="inline-flex items-center rounded-md border border-black/15 bg-black/3 px-2 py-0.5 font-mono text-xs text-black/75 dark:border-white/15 dark:bg-white/6 dark:text-white/75"
              title={resumeNavTid}
              aria-label={`Run id ${resumeNavTid}`}
            >
              Run ID · {threadIdDisplayLabel(resumeNavTid)}
            </span>
          </div>
        ) : null}
        {isResumeContext && resumeHydrateBusy ? (
          <p className="text-sm text-black/60 dark:text-white/60">
            Loading run snapshot…
          </p>
        ) : null}
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
          draft={viewedDraft}
          pipelineSteps={pipelineSteps}
          carouselNav={carouselNav}
          decisionButtonsEnabled={decisionButtonsEnabled}
          browseHint={browseHint}
          onAccept={accept}
          onReject={reject}
          onRegenerate={regenerate}
        />
      </div>
    </div>
  );
};

export default FormPage;
