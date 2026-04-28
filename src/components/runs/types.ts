export type RunListStatus =
  | "running"
  | "paused"
  | "complete"
  | "failed"
  | "cancelled";

export type RunSummary = {
  id: string;
  status: RunListStatus;
  startedAt: string;
  url: string;
  postsDone: number;
  postsTotal: number;
  threadId: string;
};

export type RunsStats = {
  totalRuns: number;
  postsPublished: number;
  completed: number;
  successRate: number;
  lastRunAt?: string;
};
