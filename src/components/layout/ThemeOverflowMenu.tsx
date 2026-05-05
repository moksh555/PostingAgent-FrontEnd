import { useEffect, useRef, useState } from "react";
import { setTheme, type Theme } from "../../lib/theme";
import { useThemeChoice } from "../../hooks/useThemeChoice";

const DotsIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <circle cx="6" cy="12" r="1.75" />
    <circle cx="12" cy="12" r="1.75" />
    <circle cx="18" cy="12" r="1.75" />
  </svg>
);

const CheckIcon = ({ className = "" }: { className?: string }) => (
  <svg
    className={`h-4 w-4 shrink-0 ${className}`}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    aria-hidden
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

/** Three-dot menu: Light / Dark — updates `document.documentElement` for the whole app. */
const ThemeOverflowMenu = () => {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const theme = useThemeChoice();

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const chooseTheme = (t: Theme) => {
    setTheme(t);
    setOpen(false);
  };

  return (
    <div className="relative shrink-0" ref={wrapRef}>
      <button
        type="button"
        className="surface-outline flex h-10 w-10 items-center justify-center rounded-lg p-0"
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="Menu"
        onClick={() => setOpen((v) => !v)}
      >
        <DotsIcon />
      </button>

      {open ? (
        <div
          role="menu"
          aria-label="Options"
          className="absolute right-0 top-full mt-2 w-52 overflow-hidden rounded-xl border border-black/10 bg-white py-1 text-sm shadow-lg dark:border-white/10 dark:bg-neutral-950"
        >
          <p className="mx-3 mb-1 mt-2 text-[0.65rem] font-semibold uppercase tracking-wider text-black/50 dark:text-white/45">
            Theme
          </p>
          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left font-medium text-black hover:bg-black/6 dark:text-white dark:hover:bg-white/10"
            onClick={() => chooseTheme("light")}
          >
            Light
            {theme === "light" ? <CheckIcon /> : <span className="w-4" />}
          </button>
          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left font-medium text-black hover:bg-black/6 dark:text-white dark:hover:bg-white/10"
            onClick={() => chooseTheme("dark")}
          >
            Dark
            {theme === "dark" ? <CheckIcon /> : <span className="w-4" />}
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default ThemeOverflowMenu;
