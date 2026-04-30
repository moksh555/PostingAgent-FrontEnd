export type RunListStatus = "running" | "paused" | "complete";

export type RunSummary = {
  id: string;
  threadId: string;
  status: RunListStatus;
  startedAt: string;
  url: string;
  postsDone: number;
  postsTotal: number;
};

export type RunsStats = {
  totalRuns: number;
  postsPublished: number;
  completed: number;
  successRate: number;
  lastRunAt?: string;
};
