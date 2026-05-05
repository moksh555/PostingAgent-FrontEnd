const STORAGE_KEY = "marketing-agent-theme";

export const THEME_CHANGE_EVENT = "marketing-agent-theme";

export type Theme = "light" | "dark";

/** Call once on startup; respects `localStorage` or leaves `<html class="dark">` default. */
export function initTheme(): void {
  const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
  if (stored === "light") document.documentElement.classList.remove("dark");
  else if (stored === "dark") document.documentElement.classList.add("dark");
}

export function getTheme(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function setTheme(theme: Theme): void {
  document.documentElement.classList.toggle("dark", theme === "dark");
  localStorage.setItem(STORAGE_KEY, theme);
  window.dispatchEvent(new CustomEvent(THEME_CHANGE_EVENT));
}

export function toggleTheme(): void {
  setTheme(getTheme() === "dark" ? "light" : "dark");
}
