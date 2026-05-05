import { useEffect, useState } from "react";
import { getTheme, THEME_CHANGE_EVENT, type Theme } from "../lib/theme";

/** Re-renders when `setTheme` / `toggleTheme` runs (same tab). */
export function useThemeChoice(): Theme {
  const [theme, setThemeState] = useState<Theme>(getTheme);
  useEffect(() => {
    const onChange = () => setThemeState(getTheme());
    window.addEventListener(THEME_CHANGE_EVENT, onChange);
    return () => window.removeEventListener(THEME_CHANGE_EVENT, onChange);
  }, []);
  return theme;
}
