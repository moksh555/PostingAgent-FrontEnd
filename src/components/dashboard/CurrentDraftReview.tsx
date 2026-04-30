import { useState } from "react";
import { Button } from "../ui";
import { CheckIcon, ChevronLeftIcon, ChevronRightIcon, RefreshIcon, XIcon } from "./icons";
import type { Draft } from "./types";

type CurrentDraftReviewProps = {
  draft: Draft;
  awaitingDecision: boolean;
  /** When false, paused but user is viewing another post in the carousel. */
  decisionButtonsEnabled: boolean;
  browseHint?: string | null;
  onAccept: () => void;
  onReject: () => void;
  onRegenerate: (notes: string) => void;
  carouselNav?: {
    canGoPrev: boolean;
    canGoNext: boolean;
    onPrev: () => void;
    onNext: () => void;
  } | null;
};

const CurrentDraftReview = ({
  draft,
  awaitingDecision,
  decisionButtonsEnabled,
  browseHint = null,
  carouselNav = null,
  onAccept,
  onReject,
  onRegenerate,
}: CurrentDraftReviewProps) => {
  const [notesOpen, setNotesOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [notesError, setNotesError] = useState<string | null>(null);

  const handleRegenerate = () => {
    const feedback = notes.trim();
    if (!feedback) {
      setNotesOpen(true);
      setNotesError("Add feedback before regenerating this draft.");
      return;
    }

    onRegenerate(feedback);
    setNotes("");
    setNotesError(null);
    setNotesOpen(false);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-5">
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 flex-wrap items-baseline gap-3">
          <h3
            className="text-xl font-semibold tracking-tight"
            aria-live="polite"
          >
            Post {draft.index} of {draft.total}
          </h3>
          {draft.publishAt && (
            <span className="text-xs text-black/55 dark:text-white/55">
              {draft.publishAt}
            </span>
          )}
        </div>
        {carouselNav ? (
          <div className="flex shrink-0 items-center gap-1 rounded-xl border border-black/10 bg-white/60 p-0.5 dark:border-white/10 dark:bg-white/6">
            <button
              type="button"
              aria-label="Previous post"
              onClick={carouselNav.onPrev}
              disabled={!carouselNav.canGoPrev}
              className="rounded-lg p-2 text-black/70 transition enabled:hover:bg-black/6 enabled:hover:text-black disabled:opacity-35 dark:text-white/75 dark:enabled:hover:bg-white/10 dark:enabled:hover:text-white"
            >
              <ChevronLeftIcon size={20} />
            </button>
            <button
              type="button"
              aria-label="Next post"
              onClick={carouselNav.onNext}
              disabled={!carouselNav.canGoNext}
              className="rounded-lg p-2 text-black/70 transition enabled:hover:bg-black/6 enabled:hover:text-black disabled:opacity-35 dark:text-white/75 dark:enabled:hover:bg-white/10 dark:enabled:hover:text-white"
            >
              <ChevronRightIcon size={20} />
            </button>
          </div>
        ) : null}
      </div>

      <article
        className={[
          "max-h-[min(70vh,42rem)] min-h-48 flex-1 overflow-y-auto whitespace-pre-line rounded-xl border px-5 py-4 text-sm leading-relaxed",
          "border-black/10 bg-white/60 text-black/80",
          "dark:border-white/10 dark:bg-white/3 dark:text-white/80",
        ].join(" ")}
      >
        {draft.body}
      </article>

      {browseHint ? (
        <p className="text-xs leading-snug text-black/55 dark:text-white/55">
          {browseHint}
        </p>
      ) : null}

      {notesOpen && (
        <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-black/55 dark:text-white/55">
          Notes for regenerate
          <textarea
            value={notes}
            onChange={(event) => {
              setNotes(event.target.value);
              if (event.target.value.trim()) setNotesError(null);
            }}
            placeholder="What should change in the next version?"
            rows={3}
            className="rounded-xl border border-black/10 bg-white/70 px-3.5 py-3 text-sm font-normal normal-case tracking-normal text-black placeholder:text-black/40 outline-none transition focus:border-black/40 focus:ring-2 focus:ring-black/10 dark:border-white/10 dark:bg-white/4 dark:text-white dark:placeholder:text-white/35 dark:focus:border-white/40 dark:focus:ring-white/10"
          />
          {notesError ? (
            <span className="text-xs font-medium normal-case tracking-normal text-red-600 dark:text-red-400">
              {notesError}
            </span>
          ) : null}
        </label>
      )}

      <div className="grid grid-cols-1 gap-3 pt-1 sm:grid-cols-3">
        <Button
          variant="outline"
          onClick={onAccept}
          disabled={!decisionButtonsEnabled}
          className="w-full justify-center"
        >
          <CheckIcon />
          ACCEPT
        </Button>
        <Button
          variant="outline"
          onClick={onReject}
          disabled={!decisionButtonsEnabled}
          className="w-full justify-center"
        >
          <XIcon />
          REJECT
        </Button>
        <Button
          variant="outline"
          onClick={handleRegenerate}
          disabled={!decisionButtonsEnabled}
          className="w-full justify-center"
        >
          <RefreshIcon />
          REGENERATE
        </Button>
      </div>

      {awaitingDecision && decisionButtonsEnabled && (
        <button
          type="button"
          onClick={() => setNotesOpen((open) => !open)}
          className="self-start text-xs font-medium text-black/60 underline-offset-4 hover:underline dark:text-white/60"
        >
          {notesOpen ? "Hide notes" : "Add notes for regenerate"}
        </button>
      )}
    </div>
  );
};

export default CurrentDraftReview;
