import type { CSSProperties } from "react";
import { iconRegistry, type IconName } from "./icons";

export interface IconProps {
  name: IconName;
  /** Pixel size applied to both width and height. Defaults to 24. */
  size?: number;
  /** Icon color. Any CSS color; defaults to the current text color. */
  color?: string;
  className?: string;
  "aria-label"?: string;
}

/**
 * Renders a design-system icon. The underlying SVGs use `currentColor`,
 * so `color` (or the inherited text color) drives the glyph color.
 */
export function Icon({
  name,
  size = 24,
  color,
  className,
  "aria-label": ariaLabel,
}: IconProps) {
  const Svg = iconRegistry[name];
  const style: CSSProperties = {
    width: size,
    height: size,
    color,
    flexShrink: 0,
  };

  return (
    <span
      className={className}
      style={style}
      role={ariaLabel ? "img" : undefined}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
    >
      <Svg width="100%" height="100%" />
    </span>
  );
}
