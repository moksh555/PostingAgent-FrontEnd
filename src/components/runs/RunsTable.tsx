import { Button } from "../ui";
import RunStatusPill from "./RunStatusPill";
import {
  formatPostsProgress,
  formatRunStartedAt,
  stripScheme,
  truncateThreadId,
} from "./format";
import type { RunSummary } from "./types";

type RunsTableProps = {
  runs: readonly RunSummary[];
  onOpen: (run: RunSummary) => void;
};

const headCellClass =
  "px-4 py-3 text-left text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-black/55 dark:text-white/55";

const cellClass = "px-4 py-4 align-middle text-sm";

const RunsTable = ({ runs, onOpen }: RunsTableProps) => (
  <div className="hidden overflow-hidden rounded-2xl border border-black/10 bg-white/40 backdrop-blur lg:block dark:border-white/10 dark:bg-black/40">
    <table className="w-full table-fixed border-collapse">
      <colgroup>
        <col className="w-44" />
        <col className="w-44" />
        <col />
        <col className="w-24" />
        <col className="w-40" />
        <col className="w-28" />
      </colgroup>
      <thead>
        <tr className="border-b border-black/10 dark:border-white/10">
          <th className={headCellClass}>Status</th>
          <th className={headCellClass}>Started</th>
          <th className={headCellClass}>Campaign URL</th>
          <th className={headCellClass}>Posts</th>
          <th className={headCellClass}>Thread ID</th>
          <th className={`${headCellClass} text-right`}>
            <span className="sr-only">Actions</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {runs.map((run) => (
          <tr
            key={run.id}
            className="border-b border-black/5 last:border-b-0 dark:border-white/5"
          >
            <td className={cellClass}>
              <RunStatusPill status={run.status} />
            </td>
            <td className={`${cellClass} text-black/70 dark:text-white/70`}>
              {formatRunStartedAt(run.startedAt)}
            </td>
            <td className={cellClass}>
              <a
                href={run.url}
                target="_blank"
                rel="noreferrer"
                title={run.url}
                className="block truncate text-black hover:underline dark:text-white"
              >
                {stripScheme(run.url)}
              </a>
            </td>
            <td className={`${cellClass} tabular-nums text-black/80 dark:text-white/80`}>
              {formatPostsProgress(run.postsDone, run.postsTotal)}
            </td>
            <td className={`${cellClass} font-mono text-xs text-black/60 dark:text-white/60`}>
              <span title={run.threadId}>{truncateThreadId(run.threadId)}</span>
            </td>
            <td className={`${cellClass} text-right`}>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onOpen(run)}
                aria-label={`Open run ${run.id}`}
              >
                OPEN
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default RunsTable;
