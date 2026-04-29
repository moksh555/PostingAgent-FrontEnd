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

/** LangGraph node streamed as `APIResponse(state=updates, body.node=…)`. */
export type PipelineStep = {
  node: string;
  label: string;
  /** ms since epoch when the update was received */
  at: number;
};
