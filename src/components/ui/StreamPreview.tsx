export type StreamPreviewItem = {
  label?: string;
  body: string;
};

type StreamPreviewProps = {
  url?: string;
  status?: string;
  items: StreamPreviewItem[];
  className?: string;
};

const StreamPreview = ({
  url = "/dashboard/output",
  status = "streaming",
  items,
  className = "",
}: StreamPreviewProps) => (
  <div className={["relative", className].filter(Boolean).join(" ")}>
    <div
      className="pointer-events-none absolute -inset-x-12 -bottom-10 -top-10 -z-10 rounded-[2.25rem] bg-linear-to-b from-black/0 via-black/10 to-black/0 blur-2xl dark:via-white/10"
      aria-hidden
    />
    <div className="rounded-[1.75rem] p-px bg-linear-to-br from-black/30 via-black/10 to-black/0 dark:from-white/30 dark:via-white/10 dark:to-white/0">
      <div className="relative overflow-hidden rounded-[calc(1.75rem-1px)] border border-black/15 bg-white/90 backdrop-blur-md dark:border-white/15 dark:bg-black/80">
        <div className="flex items-center gap-1.5 border-b border-black/10 px-4 py-2.5 dark:border-white/10">
          <span className="h-2.5 w-2.5 rounded-full border border-black/30 dark:border-white/30" />
          <span className="h-2.5 w-2.5 rounded-full border border-black/30 dark:border-white/30" />
          <span className="h-2.5 w-2.5 rounded-full border border-black/30 dark:border-white/30" />
          <span className="ml-3 truncate text-xs font-medium text-black/60 dark:text-white/60">
            {url}
          </span>
          {status && (
            <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-black/20 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider text-black/70 dark:border-white/20 dark:text-white/70">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-black dark:bg-white" />
              {status}
            </span>
          )}
        </div>
        <div className="grid gap-3 p-5 sm:grid-cols-3">
          {items.map((item, i) => (
            <div
              key={`${item.label ?? "step"}-${i}`}
              className="rounded-xl border border-black/10 bg-black/3 p-3 text-xs leading-relaxed text-black/75 dark:border-white/10 dark:bg-white/5 dark:text-white/75"
            >
              <div className="mb-2 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-black/60 dark:bg-white/60" />
                <span className="text-[0.65rem] font-semibold uppercase tracking-widest text-black/50 dark:text-white/50">
                  {item.label ?? `step ${i + 1}`}
                </span>
              </div>
              {item.body}
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default StreamPreview;
