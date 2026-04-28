import { useEffect, useRef, useState } from "react";
import CampaignSetupForm from "../components/dashboard/CampaignSetupForm";
import HumanReviewPanel from "../components/dashboard/HumanReviewPanel";
import type { Draft, RunStatus } from "../components/dashboard/types";

const SAMPLE_BODY = `Small updates can lead to big impact.

We just shipped a new feature that saves time, reduces manual work, and helps teams stay in sync.

Keep building. Keep improving.
#Productivity #Teamwork #BuiltForImpact`;

const STREAM_PAUSE_MS = 600;

const formatPublishDate = (iso: string): string | undefined => {
  if (!iso) return undefined;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const FormPage = () => {
  const [url, setUrl] = useState("");
  const [numberOfPosts, setNumberOfPosts] = useState(3);
  const [startDate, setStartDate] = useState("");
  const [status, setStatus] = useState<RunStatus>("idle");
  const [draft, setDraft] = useState<Draft | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    },
    [],
  );

  const clearTimer = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const streamThenPause = () => {
    clearTimer();
    setStatus("streaming");
    timerRef.current = window.setTimeout(() => setStatus("paused"), STREAM_PAUSE_MS);
  };

  const startRun = () => {
    setDraft({
      index: 1,
      total: numberOfPosts,
      publishAt: formatPublishDate(startDate),
      body: SAMPLE_BODY,
    });
    streamThenPause();
  };

  const cancelRun = () => {
    clearTimer();
    setStatus("idle");
    setDraft(null);
  };

  const advance = () => {
    if (!draft) return;
    const next = draft.index + 1;
    if (next > draft.total) {
      clearTimer();
      setStatus("complete");
      setDraft(null);
      return;
    }
    setDraft({ ...draft, index: next });
    streamThenPause();
  };

  const regenerate = (postChangeDescription: string) => {
    if (!draft) return;
    void postChangeDescription;
    streamThenPause();
  };

  const isRunning = status !== "idle" && status !== "complete";

  return (
    <div className="px-6 py-8 lg:px-10 lg:py-10">
      <header className="mb-8 flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">New run</h1>
        <p className="max-w-2xl text-base text-black/65 dark:text-white/65">
          Configure your campaign and review AI-generated content before publishing.
        </p>
      </header>

      <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2 lg:gap-8">
        <CampaignSetupForm
          url={url}
          numberOfPosts={numberOfPosts}
          startDate={startDate}
          isRunning={isRunning}
          onUrlChange={setUrl}
          onNumberOfPostsChange={setNumberOfPosts}
          onStartDateChange={setStartDate}
          onSubmit={startRun}
          onCancel={cancelRun}
        />
        <HumanReviewPanel
          status={status}
          draft={draft}
          onAccept={advance}
          onReject={advance}
          onRegenerate={regenerate}
        />
      </div>
    </div>
  );
};

export default FormPage;
