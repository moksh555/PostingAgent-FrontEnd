type StatCard = {
  label: string;
  value: string;
  hint: string;
};

type RunsSummaryStatsProps = {
  cards: readonly StatCard[];
};

const cardClass =
  "flex flex-col gap-1 rounded-2xl border border-black/10 bg-white/50 p-5 backdrop-blur dark:border-white/10 dark:bg-black/40";

const RunsSummaryStats = ({ cards }: RunsSummaryStatsProps) => (
  <section
    aria-label="Run summary"
    className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
  >
    {cards.map((c) => (
      <div key={c.label} className={cardClass}>
        <p className="text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-black/55 dark:text-white/55">
          {c.label}
        </p>
        <p className="text-2xl font-semibold leading-tight tracking-tight text-black sm:text-3xl dark:text-white">
          {c.value}
        </p>
        <p className="text-sm text-black/55 dark:text-white/55">{c.hint}</p>
      </div>
    ))}
  </section>
);

export default RunsSummaryStats;
export type { StatCard as RunsSummaryStat };
