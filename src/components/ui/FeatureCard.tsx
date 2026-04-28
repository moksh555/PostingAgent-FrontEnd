import type { ReactNode } from "react";

type FeatureCardProps = {
  title: ReactNode;
  description: ReactNode;
  className?: string;
};

const FeatureCard = ({ title, description, className = "" }: FeatureCardProps) => (
  <article
    className={[
      "group relative h-full overflow-hidden rounded-2xl border border-black/15 bg-linear-to-br from-white via-white to-black/6 p-6 transition-[transform,border-color,box-shadow] hover:-translate-y-0.5 hover:border-black/35 hover:shadow-[0_24px_48px_-28px_rgba(0,0,0,0.25)]",
      "dark:border-white/15 dark:from-black dark:via-black dark:to-white/8 dark:hover:border-white/35 dark:hover:shadow-[0_24px_48px_-28px_rgba(0,0,0,1)]",
      className,
    ]
      .filter(Boolean)
      .join(" ")}
  >
    <span className="shimmer" aria-hidden />
    <div
      className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-black/25 to-transparent dark:via-white/25"
      aria-hidden
    />
    <h3 className="text-lg font-semibold tracking-tight text-black dark:text-white">{title}</h3>
    <p className="mt-2 text-sm leading-relaxed text-black/70 dark:text-white/70">{description}</p>
  </article>
);

export default FeatureCard;
