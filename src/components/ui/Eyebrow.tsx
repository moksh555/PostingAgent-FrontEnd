import type { ReactNode } from "react";

type EyebrowProps = {
  children: ReactNode;
  className?: string;
};

const Eyebrow = ({ children, className = "" }: EyebrowProps) => (
  <p
    className={[
      "text-xs font-semibold uppercase tracking-[0.25em] text-black/55 dark:text-white/55",
      className,
    ]
      .filter(Boolean)
      .join(" ")}
  >
    {children}
  </p>
);

export default Eyebrow;
