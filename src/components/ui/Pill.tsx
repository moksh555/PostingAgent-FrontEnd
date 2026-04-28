import type { ReactNode } from "react";

type PillProps = {
  children: ReactNode;
  className?: string;
};

const Pill = ({ children, className = "" }: PillProps) => (
  <div
    className={[
      "inline-flex w-fit items-center gap-2 rounded-full border border-black/15 bg-white/70 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-black/70 backdrop-blur-sm",
      "dark:border-white/15 dark:bg-black/40 dark:text-white/70",
      className,
    ]
      .filter(Boolean)
      .join(" ")}
  >
    {children}
  </div>
);

export default Pill;
