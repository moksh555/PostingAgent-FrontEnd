import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import RunsList from "../components/runs/RunsList";
import RunsSummaryStats, {
  type RunsSummaryStat,
} from "../components/runs/RunsSummaryStats";
import { formatRunStartedAt } from "../components/runs/format";
import type { RunSummary } from "../components/runs/types";
import {
  getUserThreadStates,
  threadsListErrorMessage,
} from "../services/ServicesAgent";

function devUserOrEmpty(): string {
  const v = import.meta.env.VITE_DEV_USER_ID?.trim();
  return v && v.length > 0 ? v : "";
}

const buildStats = (
  runs: readonly RunSummary[],
): readonly RunsSummaryStat[] => {
  const total = runs.length;
  const completed = runs.filter((r) => r.status === "complete").length;
  const successRate = total === 0 ? 0 : Math.round((completed / total) * 100);
  const lastRun = runs[0];

  return [
    { label: "Total runs", value: String(total), hint: "All time" },
    {
      label: "Completed",
      value: String(completed),
      hint: total === 0 ? "—" : `${successRate}% success rate`,
    },
    {
      label: "Last run",
      value: lastRun ? formatRunStartedAt(lastRun.startedAt) : "—",
      hint: lastRun ? "Most recent campaign" : "No runs yet",
    },
  ];
};

const PastRun = () => {
  const navigate = useNavigate();
  const [runs, setRuns] = useState<RunSummary[]>([]);
  const resolvedUserId = devUserOrEmpty();
  const [loading, setLoading] = useState(() => resolvedUserId.length > 0);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (!resolvedUserId.length)
      return () => {
        cancelled = true;
      };

    void (async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const rows = await getUserThreadStates(resolvedUserId);
        if (!cancelled) setRuns(rows);
      } catch (err: unknown) {
        if (!cancelled) setLoadError(threadsListErrorMessage(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [resolvedUserId]);

  const stats = useMemo(() => buildStats(runs), [runs]);

  const configError =
    resolvedUserId.length === 0
      ? "Set VITE_DEV_USER_ID in configurations/.env.local so Past runs knows which backend user id to query."
      : null;

  const handleOpen = (run: RunSummary) => {
    navigate(`/dashboard/resume/${encodeURIComponent(run.threadId)}`);
  };

  return (
    <div className="px-6 py-8 lg:px-10 lg:py-10">
      <header className="mb-8 flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Runs
        </h1>
        <p className="max-w-2xl text-base text-black/65 dark:text-white/65">
          Past and active runs for your account.
        </p>
      </header>

      {(configError ?? loadError) ? (
        <div
          className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-950 dark:bg-red-500/15 dark:text-red-100"
          role="alert"
        >
          {configError ?? loadError}
        </div>
      ) : null}

      <RunsSummaryStats cards={stats} />

      <div className="mt-8">
        {loading ? (
          <p className="text-sm text-black/60 dark:text-white/60">
            Loading runs…
          </p>
        ) : (
          <RunsList runs={runs} onOpen={handleOpen} />
        )}
      </div>
    </div>
  );
};

export default PastRun;
