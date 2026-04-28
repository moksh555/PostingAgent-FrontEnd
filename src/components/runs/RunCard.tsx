import { Button } from "../ui";
import RunStatusPill from "./RunStatusPill";
import {
  formatPostsProgress,
  formatRunStartedAt,
  stripScheme,
  truncateThreadId,
} from "./format";
import type { RunSummary } from "./types";

type RunCardProps = {
  run: RunSummary;
  onOpen: (run: RunSummary) => void;
};

const RunCard = ({ run, onOpen }: RunCardProps) => (
  <article className="flex flex-col gap-3 rounded-2xl border border-black/10 bg-white/40 p-4 backdrop-blur dark:border-white/10 dark:bg-black/40">
    <header className="flex items-start justify-between gap-3">
      <h3 className="truncate text-sm font-semibold text-black dark:text-white" title={run.url}>
        {stripScheme(run.url)}
      </h3>
      <RunStatusPill status={run.status} />
    </header>

    <dl className="grid grid-cols-2 gap-2 text-xs">
      <div className="flex flex-col">
        <dt className="text-black/55 dark:text-white/55">Started</dt>
        <dd className="text-black/80 dark:text-white/80">
          {formatRunStartedAt(run.startedAt)}
        </dd>
      </div>
      <div className="flex flex-col">
        <dt className="text-black/55 dark:text-white/55">Posts</dt>
        <dd className="tabular-nums text-black/80 dark:text-white/80">
          {formatPostsProgress(run.postsDone, run.postsTotal)}
        </dd>
      </div>
      <div className="col-span-2 flex flex-col">
        <dt className="text-black/55 dark:text-white/55">Thread ID</dt>
        <dd className="font-mono text-black/60 dark:text-white/60" title={run.threadId}>
          {truncateThreadId(run.threadId)}
        </dd>
      </div>
    </dl>

    <Button
      size="sm"
      variant="outline"
      onClick={() => onOpen(run)}
      className="w-full justify-center"
      aria-label={`Open run ${run.id}`}
    >
      OPEN
    </Button>
  </article>
);

export default RunCard;
