import type { ReactNode } from "react";
import { Button } from "../ui";
import { CalendarIcon, ChevronDownIcon, MapPinIcon } from "./icons";

type CampaignSetupFormProps = {
  url: string;
  numberOfPosts: number;
  startDate: string;
  isRunning: boolean;
  onUrlChange: (value: string) => void;
  onNumberOfPostsChange: (value: number) => void;
  onStartDateChange: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
};

const POST_COUNTS = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

const fieldShell =
  "rounded-xl border border-black/10 bg-white/70 px-3.5 py-3 text-sm text-black placeholder:text-black/40 outline-none transition focus-within:border-black/40 focus-within:ring-2 focus-within:ring-black/10 dark:border-white/10 dark:bg-white/4 dark:text-white dark:placeholder:text-white/35 dark:focus-within:border-white/40 dark:focus-within:ring-white/10";

const Field = ({ label, htmlFor, children }: { label: string; htmlFor: string; children: ReactNode }) => (
  <div className="flex flex-col gap-2">
    <label
      htmlFor={htmlFor}
      className="text-xs font-semibold uppercase tracking-[0.18em] text-black/55 dark:text-white/55"
    >
      {label}
    </label>
    {children}
  </div>
);

const CampaignSetupForm = ({
  url,
  numberOfPosts,
  startDate,
  isRunning,
  onUrlChange,
  onNumberOfPostsChange,
  onStartDateChange,
  onSubmit,
  onCancel,
}: CampaignSetupFormProps) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex h-full flex-col gap-6 rounded-2xl border border-black/10 bg-white/50 p-6 backdrop-blur dark:border-white/10 dark:bg-black/40"
    >
      <header className="flex items-center gap-2.5 text-black dark:text-white">
        <MapPinIcon size={20} />
        <h2 className="text-lg font-semibold tracking-tight">Campaign setup</h2>
      </header>

      <div className="flex flex-col gap-5">
        <Field label="URL" htmlFor="campaign-url">
          <input
            id="campaign-url"
            type="url"
            inputMode="url"
            placeholder="https://example.com"
            value={url}
            onChange={(event) => onUrlChange(event.target.value)}
            className={fieldShell}
          />
        </Field>

        <Field label="Number of posts" htmlFor="campaign-posts">
          <div className="relative">
            <select
              id="campaign-posts"
              value={numberOfPosts}
              onChange={(event) => onNumberOfPostsChange(Number(event.target.value))}
              className={`${fieldShell} w-full appearance-none pr-10`}
            >
              {POST_COUNTS.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            <span
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-black/55 dark:text-white/55"
              aria-hidden
            >
              <ChevronDownIcon />
            </span>
          </div>
        </Field>

        <Field label="Campaign start" htmlFor="campaign-start">
          <div className="relative">
            <span
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-black/55 dark:text-white/55"
              aria-hidden
            >
              <CalendarIcon />
            </span>
            <input
              id="campaign-start"
              type="datetime-local"
              value={startDate}
              onChange={(event) => onStartDateChange(event.target.value)}
              className={`${fieldShell} w-full pl-11 scheme-light dark:scheme-dark`}
            />
          </div>
        </Field>
      </div>

      <div className="mt-auto grid grid-cols-2 gap-3 pt-2">
        <Button type="submit" variant="invert" disabled={isRunning} className="w-full justify-center">
          START RUN
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="w-full justify-center">
          CANCEL
        </Button>
      </div>
    </form>
  );
};

export default CampaignSetupForm;
