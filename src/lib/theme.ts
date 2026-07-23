import { useEffect, useState } from "react";

/**
 * App theme. The Figma design is dark-first, so `dark` is the default; the
 * `light` value re-maps the semantic CSS tokens in `global.css` via the
 * `data-theme="light"` attribute on <html>.
 */
export type Theme = "dark" | "light";

const STORAGE_KEY = "theme";

/** Read the persisted preference, falling back to the dark design default. */
export function getInitialTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === "light" || stored === "dark" ? stored : "dark";
}

/** Reflect the theme onto <html> so the CSS token overrides take effect. */
export function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  if (theme === "light") {
    root.setAttribute("data-theme", "light");
  } else {
    root.removeAttribute("data-theme");
  }
}

/**
 * Theme state hook — applies the theme to <html> and persists it. Call the
 * returned `toggle` to switch between light and dark.
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggle = () =>
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  return { theme, toggle } as const;
}
