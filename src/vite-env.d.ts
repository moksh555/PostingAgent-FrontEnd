interface ImportMetaEnv {
  readonly VITE_BASE_URL?: string;
  readonly VITE_DEBUG_AGENT_STREAM?: string;
  /** Optional; POST /startAgent expects `userId` — set for local demos if you have none. */
  readonly VITE_DEV_USER_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/** Set by `useAgentStream` when `VITE_DEBUG_AGENT_STREAM=true` — inspect `window.__MARKETING_AGENT_STREAM_DEBUG__`. */
interface Window {
  __MARKETING_AGENT_STREAM_DEBUG__?: {
    targetUrl?: string;
    viteBaseUrl?: string;
    lastParsed?: unknown;
    lastError?: string;
    phase?: string;
    updatedAt: number;
  };
}
