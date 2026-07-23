import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type CardSurface = "light" | "dark";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Surface color. `dark` matches the shadowed card in the Figma design. */
  surface?: CardSurface;
  /** Apply the elevated `shadow-card` from the design. Defaults to true. */
  elevated?: boolean;
}

const surfaceStyles: Record<CardSurface, string> = {
  light: "bg-white text-ink",
  dark: "bg-surface-dark text-porcelain",
};

/**
 * Elevated, rounded container. Implements the `div:shadow` node (1:1500)
 * from the Figma design: 20px radius + the design's drop shadow.
 */
export function Card({
  surface = "dark",
  elevated = true,
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "overflow-clip rounded-lg",
        surfaceStyles[surface],
        elevated && "shadow-card",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
