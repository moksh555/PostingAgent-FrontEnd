export type Stat = { value: string; label: string };

type StatGridProps = {
  stats: Stat[];
  className?: string;
};

const StatGrid = ({ stats, className = "" }: StatGridProps) => (
  <section
    className={[
      "relative border-y border-black/10 bg-black/2 dark:border-white/10 dark:bg-white/2",
      className,
    ]
      .filter(Boolean)
      .join(" ")}
  >
    <div className="mx-auto grid max-w-5xl grid-cols-2 gap-px overflow-hidden bg-black/10 sm:grid-cols-4 dark:bg-white/10">
      {stats.map((s) => (
        <div
          key={s.label}
          className="group relative bg-white p-6 text-center transition-colors hover:bg-black/3 dark:bg-black dark:hover:bg-white/4"
        >
          <div className="text-3xl font-semibold tracking-tight text-black sm:text-4xl dark:text-white">
            {s.value}
          </div>
          <div className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-black/55 dark:text-white/55">
            {s.label}
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default StatGrid;
