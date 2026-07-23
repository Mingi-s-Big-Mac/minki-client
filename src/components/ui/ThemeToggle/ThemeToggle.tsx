import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/cn";

/** Sun glyph — shown in dark mode (click to go light). */
function SunIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      width="100%"
      height="100%"
    >
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.5v2.2M12 19.3v2.2M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6" />
    </svg>
  );
}

/** Moon glyph — shown in light mode (click to go dark). */
function MoonIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      width="100%"
      height="100%"
    >
      <path d="M20 14.5A8 8 0 0 1 9.5 4a7 7 0 1 0 10.5 10.5z" />
    </svg>
  );
}

interface ThemeToggleProps {
  className?: string;
}

/**
 * Floating light/dark theme toggle. Mounted once at the app root so it is
 * available on every page. Flips the semantic CSS tokens defined in
 * `global.css` and persists the choice via `useTheme`.
 */
export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "라이트 모드로 전환" : "다크 모드로 전환"}
      title={isDark ? "라이트 모드로 전환" : "다크 모드로 전환"}
      className={cn(
        "fixed bottom-5 right-5 z-50 flex size-11 items-center justify-center rounded-full border border-line-strong bg-surface text-porcelain shadow-card transition-colors hover:border-ink-subtle hover:text-primary",
        className,
      )}
    >
      <span className="size-5">{isDark ? <SunIcon /> : <MoonIcon />}</span>
    </button>
  );
}
