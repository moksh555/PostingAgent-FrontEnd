import { useNavigate } from "react-router-dom";
import RunsList from "../components/runs/RunsList";
import RunsSummaryStats, {
  type RunsSummaryStat,
} from "../components/runs/RunsSummaryStats";
import { formatRunStartedAt } from "../components/runs/format";
import type { RunSummary } from "../components/runs/types";

const SAMPLE_RUNS: readonly RunSummary[] = [
  {
    id: "run_01",
    status: "complete",
    startedAt: "2026-04-12T14:04:00Z",
    url: "https://acme.com/blog/launch-q2",
    postsDone: 3,
    postsTotal: 3,
    threadId: "thr_8a3c92f0e1f2d",
  },
  {
    id: "run_02",
    status: "paused",
    startedAt: "2026-04-12T13:47:00Z",
    url: "https://acme.com/blog/spring-sale",
    postsDone: 2,
    postsTotal: 3,
    threadId: "thr_4f99c7821a8be",
  },
  {
    id: "run_03",
    status: "running",
    startedAt: "2026-04-12T13:32:00Z",
    url: "https://acme.com/blog/feature-update",
    postsDone: 1,
    postsTotal: 4,
    threadId: "thr_7c1ab02d35e10",
  },
  {
    id: "run_04",
    status: "failed",
    startedAt: "2026-04-12T12:18:00Z",
    url: "https://acme.com/blog/brand-march",
    postsDone: 0,
    postsTotal: 4,
    threadId: "thr_1290bbe58af44",
  },
  {
    id: "run_05",
    status: "cancelled",
    startedAt: "2026-04-12T11:03:00Z",
    url: "https://acme.com/about/founder-story",
    postsDone: 1,
    postsTotal: 3,
    threadId: "thr_5dde4017c0a83",
  },
];

const buildStats = (runs: readonly RunSummary[]): readonly RunsSummaryStat[] => {
  const total = runs.length;
  const postsPublished = runs.reduce((sum, r) => sum + r.postsDone, 0);
  const completed = runs.filter((r) => r.status === "complete").length;
  const successRate = total === 0 ? 0 : Math.round((completed / total) * 100);
  const lastRun = runs[0];

  return [
    { label: "Total runs", value: String(total), hint: "All time" },
    {
      label: "Posts published",
      value: String(postsPublished),
      hint: "Across all campaigns",
    },
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
  const stats = buildStats(SAMPLE_RUNS);

  const handleOpen = (run: RunSummary) => {
    navigate(`/dashboard/pastRun/${run.id}`);
  };

  return (
    <div className="px-6 py-8 lg:px-10 lg:py-10">
      <header className="mb-8 flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Runs</h1>
        <p className="max-w-2xl text-base text-black/65 dark:text-white/65">
          Past and active runs for your account.
        </p>
      </header>

      <RunsSummaryStats cards={stats} />

      <div className="mt-8">
        <RunsList runs={SAMPLE_RUNS} onOpen={handleOpen} />
      </div>
    </div>
  );
};

export default PastRun;
