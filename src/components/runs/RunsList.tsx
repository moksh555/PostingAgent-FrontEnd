import { Button } from "../ui";
import RunCard from "./RunCard";
import RunsTable from "./RunsTable";
import type { RunSummary } from "./types";

type RunsListProps = {
  runs: readonly RunSummary[];
  onOpen: (run: RunSummary) => void;
};

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-black/10 bg-white/30 px-6 py-16 text-center dark:border-white/10 dark:bg-black/20">
    <div>
      <p className="text-lg font-semibold text-black dark:text-white">No runs yet</p>
      <p className="mt-1 text-sm text-black/60 dark:text-white/60">
        Start a campaign to see its drafts and history here.
      </p>
    </div>
    <Button to="/dashboard/form" variant="invert" size="sm">
      Start a run
    </Button>
  </div>
);

const RunsList = ({ runs, onOpen }: RunsListProps) => {
  if (runs.length === 0) return <EmptyState />;

  return (
    <>
      <RunsTable runs={runs} onOpen={onOpen} />
      <div className="flex flex-col gap-3 lg:hidden">
        {runs.map((run) => (
          <RunCard key={run.id} run={run} onOpen={onOpen} />
        ))}
      </div>
    </>
  );
};

export default RunsList;
