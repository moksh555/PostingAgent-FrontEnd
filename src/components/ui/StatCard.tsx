export type StatCardProps = {
  label: string;
  value: string;
  hint: string;
};

const cardClass =
  "flex flex-col gap-1 rounded-2xl border border-black/10 bg-white/50 p-5 backdrop-blur dark:border-white/10 dark:bg-black/40";

const StatCard = ({ label, value, hint }: StatCardProps) => (
  <div className={cardClass}>
    <p className="text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-black/55 dark:text-white/55">
      {label}
    </p>
    <p className="text-2xl font-semibold leading-tight tracking-tight text-black sm:text-3xl dark:text-white">
      {value}
    </p>
    <p className="text-sm text-black/55 dark:text-white/55">{hint}</p>
  </div>
);

export default StatCard;
