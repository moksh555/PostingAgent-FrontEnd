/** Shared styles for top-level marketing / auth nav tabs. */
export const marketingNavLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    "rounded-lg px-3 py-2 text-sm font-medium no-underline transition-colors",
    isActive
      ? "surface-invert"
      : "text-black/80 hover:bg-black/[0.06] hover:text-black dark:text-white/80 dark:hover:bg-white/10 dark:hover:text-white",
  ].join(" ");
