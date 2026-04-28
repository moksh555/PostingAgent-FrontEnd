export type RunStatus =
  | "idle"
  | "connecting"
  | "streaming"
  | "paused"
  | "complete"
  | "error";

export type Draft = {
  index: number;
  total: number;
  publishAt?: string;
  body: string;
};
