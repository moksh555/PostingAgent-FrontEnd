import type { ReactNode } from "react";

type ShortCardProps = {
  step: number;
  title: string;
  description: string;
  className?: string;
};

function StepIcon({ step, className }: { step: number; className?: string }): ReactNode {
  const cn = ["h-6 w-6 shrink-0", className].filter(Boolean).join(" ");
  switch (step) {
    case 1:
      return (
        <svg className={cn} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
          />
        </svg>
      );
    case 2:
      return (
        <svg className={cn} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
          />
        </svg>
      );
    case 3:
      return (
        <svg className={cn} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
          />
        </svg>
      );
    default:
      return (
        <svg className={cn} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      );
  }
}

const ShortCard = ({ step, title, description, className = "" }: ShortCardProps) => {
  return (
    <div
      className={[
        "group relative h-full rounded-[1.35rem] p-px transition-all duration-300 ease-out",
        "bg-linear-to-br from-black/30 via-black/10 to-black/0 dark:from-white/30 dark:via-white/10 dark:to-white/0",
        "hover:-translate-y-1 hover:from-black/45 hover:via-black/18 dark:hover:from-white/45 dark:hover:via-white/18",
        className,
      ].join(" ")}
    >
      <article
        className={[
          "relative flex h-full flex-col gap-6 overflow-hidden rounded-[calc(1.35rem-1px)] px-6 pb-7 pt-6",
          "border border-black/15 bg-linear-to-br from-white via-white to-black/[0.07] dark:border-white/15 dark:from-black dark:via-black dark:to-white/8",
          "text-black shadow-[0_24px_48px_-28px_rgba(0,0,0,0.18)] transition-[transform,box-shadow,border-color] duration-300 dark:text-white dark:shadow-[0_24px_48px_-28px_rgba(0,0,0,0.85)]",
          "group-hover:border-black/35 group-hover:shadow-[0_32px_60px_-28px_rgba(0,0,0,0.28)] dark:group-hover:border-white/35 dark:group-hover:shadow-[0_32px_64px_-32px_rgba(0,0,0,1)]",
        ].join(" ")}
      >
        <span className="shimmer" aria-hidden />

        <div
          className="pointer-events-none absolute -right-12 -top-14 h-40 w-40 rounded-full bg-black/6 blur-3xl transition-opacity duration-500 group-hover:opacity-100 dark:bg-white/8"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-black/30 to-transparent dark:via-white/30"
          aria-hidden
        />

        <div className="relative flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-black text-sm font-bold tabular-nums text-white shadow-[inset_0_-2px_0_rgba(255,255,255,0.18)] transition-transform duration-300 group-hover:scale-105 dark:bg-white dark:text-black dark:shadow-[inset_0_-2px_0_rgba(0,0,0,0.18)]"
              aria-hidden
            >
              {step.toString().padStart(2, "0")}
            </span>
            <div className="rounded-xl border border-black/15 bg-black/5 p-2 text-black transition-colors duration-300 group-hover:border-black/30 dark:border-white/15 dark:bg-white/5 dark:text-white dark:group-hover:border-white/30">
              <StepIcon step={step} />
            </div>
          </div>
          <span className="hidden text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-black/45 dark:text-white/45 sm:block">
            Step {step}
          </span>
        </div>

        <div className="relative space-y-2.5">
          <h3 className="text-lg font-semibold tracking-tight sm:text-xl">{title}</h3>
          <p className="text-sm leading-relaxed text-black/70 dark:text-white/70 sm:text-[0.9375rem] sm:leading-relaxed">
            {description}
          </p>
        </div>

        <div className="relative mt-auto flex items-center gap-2 text-xs font-medium text-black/55 transition-transform duration-300 group-hover:translate-x-1 dark:text-white/55">
          <span>Continue</span>
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 5l7 7-7 7" />
          </svg>
        </div>
      </article>
    </div>
  );
};

export default ShortCard;
