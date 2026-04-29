import CurrentDraftReview from "./CurrentDraftReview";
import StatusPill from "./StatusPill";
import { FileTextIcon } from "./icons";
import type { Draft, PipelineStep, RunStatus } from "./types";

type HumanReviewPanelProps = {
  status: RunStatus;
  draft: Draft | null;
  /** Streamed LangGraph node steps (`state === "updates"`). */
  pipelineSteps?: readonly PipelineStep[];
  onAccept: () => void;
  onReject: () => void;
  onRegenerate: (notes: string) => void;
};

const PipelineTimeline = ({
  steps,
  streaming,
  waitingForFirstEvent,
}: {
  steps: readonly PipelineStep[];
  streaming: boolean;
  waitingForFirstEvent: boolean;
}) => (
  <div className="flex min-h-44 flex-1 flex-col gap-3 rounded-xl border border-black/10 bg-black/3 px-4 py-3 dark:border-white/10 dark:bg-white/4">
    <div className="flex items-center justify-between gap-3">
      <p className="text-[0.625rem] font-semibold uppercase tracking-[0.22em] text-black/55 dark:text-white/55">
        Pipeline updates
        {streaming ? (
          <span className="ml-2 inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500 align-middle dark:bg-emerald-400" />
        ) : null}
      </p>
      <span className="rounded-full border border-black/10 bg-white/60 px-2 py-0.5 text-[0.6875rem] font-medium text-black/55 dark:border-white/10 dark:bg-white/5 dark:text-white/55">
        {steps.length} update{steps.length === 1 ? "" : "s"}
      </span>
    </div>
    {waitingForFirstEvent ? (
      <p className="text-xs text-black/50 italic dark:text-white/50">
        Waiting for streamed graph updates…
      </p>
    ) : null}
    <ul className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1 text-sm text-black/80 dark:text-white/85">
      {steps.map((s, i) => {
        const isLast = i === steps.length - 1;
        return (
          <li
            key={`${s.at}-${i}-${s.node}`}
            className={`flex gap-2.5 border-l-2 py-0.5 pl-3 leading-snug dark:border-white/15 ${
              isLast && streaming
                ? "border-emerald-500 dark:border-emerald-400"
                : "border-black/15"
            }`}
          >
            <span
              className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-500/85 dark:bg-emerald-400/90"
              aria-hidden
            />
            <div className="min-w-0 flex-1">
              <span className="font-medium">{s.label}</span>
              <span className="mt-0.5 block break-all font-mono text-[0.6875rem] text-black/45 dark:text-white/45">
                {s.node}
              </span>
            </div>
          </li>
        );
      })}
    </ul>
  </div>
);

const HumanReviewPanel = ({
  status,
  draft,
  pipelineSteps = [],
  onAccept,
  onReject,
  onRegenerate,
}: HumanReviewPanelProps) => {
  const awaitingDecision = status === "paused";
  const streaming = status === "connecting" || status === "streaming";
  const pipelineActive =
    status !== "idle" && status !== "error" && !draft;
  const waitingForPipeline =
    pipelineActive &&
    pipelineSteps.length === 0 &&
    (status === "connecting" || status === "streaming");
  const showPipeline = pipelineActive;

  return (
    <section className="flex h-full min-h-112 flex-col gap-5 overflow-hidden rounded-2xl border border-black/10 bg-white/50 p-6 backdrop-blur dark:border-white/10 dark:bg-black/40">
      <header className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 text-black dark:text-white">
          <FileTextIcon size={20} />
          <h2 className="text-lg font-semibold tracking-tight">
            Review drafts
          </h2>
        </div>
        <StatusPill status={status} />
      </header>

      <p className="text-[0.625rem] font-semibold uppercase tracking-[0.22em] text-black/55 dark:text-white/55">
        Human in the loop
      </p>

      {showPipeline ? (
        <PipelineTimeline
          steps={pipelineSteps}
          streaming={streaming}
          waitingForFirstEvent={waitingForPipeline}
        />
      ) : null}

      {draft ? (
        <div className="flex min-h-0 flex-1 flex-col gap-0 overflow-hidden">
          <CurrentDraftReview
            key={draft.index}
            draft={draft}
            awaitingDecision={awaitingDecision}
            onAccept={onAccept}
            onReject={onReject}
            onRegenerate={onRegenerate}
          />
        </div>
      ) : (
        <EmptyState
          status={status}
          hasPipelineSteps={pipelineSteps.length > 0}
        />
      )}
    </section>
  );
};

const EmptyState = ({
  status,
  hasPipelineSteps,
}: {
  status: RunStatus;
  hasPipelineSteps: boolean;
}) => {
  const message =
    status === "complete"
      ? "Run complete. Start a new run to review more drafts."
      : status === "streaming" || status === "connecting"
        ? hasPipelineSteps
          ? "Generating draft — pipeline steps shown above."
          : "Connecting to agent…"
        : "Start a run to see the current draft here.";

  return (
    <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-black/10 px-6 py-12 text-center text-sm text-black/55 dark:border-white/10 dark:text-white/55">
      {message}
    </div>
  );
};

export default HumanReviewPanel;
