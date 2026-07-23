/**
 * Design tokens extracted from the Figma design system.
 * Source: Figma variables (colors, typography, radius, shadows).
 *
 * These are the single source of truth for the design system. The same
 * values are mirrored as CSS custom properties in `src/styles/global.css`
 * (as `--color-*`, `--radius-*`, etc.) for use in plain CSS.
 */

export const colors = {
  /** Puerto Rico — primary brand teal */
  primary: "#4ECDC4",
  /** Viking — lighter teal, used for hover/emphasis */
  primaryLight: "#6FDBD3",

  /** Oxford Blue — darkest text / dark surfaces */
  ink: "#2E3946",
  /** Shuttle Gray — secondary text */
  inkMuted: "#5C6975",
  /** Regent Gray — tertiary / placeholder text */
  inkSubtle: "#8B98A5",

  /** Porcelain — light neutral background */
  porcelain: "#F3F6F7",
  white: "#FFFFFF",

  /** Dark card surface (from the shadow card design) */
  surfaceDark: "#0D1117",
} as const;

export const fonts = {
  sans: "Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
} as const;

export const fontSizes = {
  xs: "12px",
  sm: "13px",
  base: "14px",
  md: "16px",
  lg: "20px",
} as const;

export const fontWeights = {
  regular: 400,
  semibold: 600,
} as const;

export const radii = {
  sm: "8px",
  lg: "20px",
  pill: "9999px",
} as const;

export const shadows = {
  /** Elevated card shadow from the design */
  card: "0px 40px 80px -30px rgba(0, 0, 0, 0.6)",
} as const;

export const tokens = {
  colors,
  fonts,
  fontSizes,
  fontWeights,
  radii,
  shadows,
} as const;

export type Tokens = typeof tokens;
