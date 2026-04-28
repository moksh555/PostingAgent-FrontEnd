import Button from "./Button";

type Action = {
  label: string;
  to: string;
};

type CTABannerProps = {
  title: string;
  description?: string;
  primary?: Action;
  secondary?: Action;
  className?: string;
};

const CTABanner = ({
  title,
  description,
  primary,
  secondary,
  className = "",
}: CTABannerProps) => (
  <section className={["relative", className].filter(Boolean).join(" ")}>
    <div className="relative overflow-hidden rounded-[1.75rem] p-px bg-linear-to-br from-black/30 via-black/10 to-black/0 dark:from-white/30 dark:via-white/10 dark:to-white/0">
      <div className="surface-invert relative overflow-hidden rounded-[calc(1.75rem-1px)] px-8 py-14 text-center sm:px-12 sm:py-20">
        <div className="pointer-events-none absolute inset-0 bg-dots opacity-30" aria-hidden />
        <div
          className="pointer-events-none absolute -bottom-24 left-1/2 h-72 w-xl -translate-x-1/2 rounded-full bg-white/15 blur-3xl dark:bg-black/15"
          aria-hidden
        />

        <h2 className="relative text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          {title}
        </h2>
        {description && (
          <p className="relative mx-auto mt-3 max-w-xl text-pretty opacity-75">{description}</p>
        )}

        {(primary || secondary) && (
          <div className="relative mt-8 flex flex-wrap items-center justify-center gap-3">
            {primary && (
              <Button to={primary.to} variant="revert" showArrow>
                {primary.label}
              </Button>
            )}
            {secondary && (
              <Button to={secondary.to} variant="revertOutline">
                {secondary.label}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  </section>
);

export default CTABanner;
