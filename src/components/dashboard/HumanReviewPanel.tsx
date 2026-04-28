import CurrentDraftReview from "./CurrentDraftReview";
import StatusPill from "./StatusPill";
import { FileTextIcon } from "./icons";
import type { Draft, RunStatus } from "./types";

type HumanReviewPanelProps = {
  status: RunStatus;
  draft: Draft | null;
  onAccept: () => void;
  onReject: () => void;
  onRegenerate: (notes: string) => void;
};

const HumanReviewPanel = ({
  status,
  draft,
  onAccept,
  onReject,
  onRegenerate,
}: HumanReviewPanelProps) => {
  const awaitingDecision = status === "paused";

  return (
    <section className="flex h-full min-h-112 flex-col gap-5 rounded-2xl border border-black/10 bg-white/50 p-6 backdrop-blur dark:border-white/10 dark:bg-black/40">
      <header className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 text-black dark:text-white">
          <FileTextIcon size={20} />
          <h2 className="text-lg font-semibold tracking-tight">Review drafts</h2>
        </div>
        <StatusPill status={status} />
      </header>

      <p className="text-[0.625rem] font-semibold uppercase tracking-[0.22em] text-black/55 dark:text-white/55">
        Human in the loop
      </p>

      {draft ? (
        <CurrentDraftReview
          key={draft.index}
          draft={draft}
          awaitingDecision={awaitingDecision}
          onAccept={onAccept}
          onReject={onReject}
          onRegenerate={onRegenerate}
        />
      ) : (
        <EmptyState status={status} />
      )}
    </section>
  );
};

const EmptyState = ({ status }: { status: RunStatus }) => {
  const message =
    status === "complete"
      ? "Run complete. Start a new run to review more drafts."
      : status === "streaming" || status === "connecting"
        ? "Waiting for the next draft…"
        : "Start a run to see the current draft here.";

  return (
    <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-black/10 px-6 py-12 text-center text-sm text-black/55 dark:border-white/10 dark:text-white/55">
      {message}
    </div>
  );
};

export default HumanReviewPanel;
