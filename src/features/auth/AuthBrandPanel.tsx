import type { ReactNode } from "react";

type AuthBrandPanelProps = {
  eyebrow?: ReactNode;
};

const AuthBrandPanel = ({ eyebrow }: AuthBrandPanelProps) => {
  return (
    <div className="relative flex flex-col gap-12 px-6 py-10 sm:px-10 lg:py-14">
      <div
        className="pointer-events-none absolute inset-0 bg-grid opacity-[0.35] mask-[radial-gradient(ellipse_70%_65%_at_50%_40%,black_25%,transparent_70%)]"
        aria-hidden
      />
      <div className="relative">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-black/45 dark:text-white/45">
          Marketing agent
        </p>
        <h1 className="mt-4 max-w-sm text-balance text-3xl font-semibold leading-tight tracking-tight text-black dark:text-white sm:text-4xl">
          Run campaigns with a clear brief and human checkpoints.
        </h1>
        {eyebrow ? (
          <div className="mt-6">{eyebrow}</div>
        ) : null}
      </div>
    </div>
  );
};

export default AuthBrandPanel;
