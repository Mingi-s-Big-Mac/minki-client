import { cn } from "@/lib/cn";

// The logo glyph from the Figma design system (node 1:1265): an upward trend
// line with a marker dot. Both parts are real exported vectors from the design
// system icon set; here they are overlaid at the exact insets from the design.
import TrendLine from "@/assets/icons/icon-02.svg?react";
import Dot from "@/assets/icons/icon-11.svg?react";

export interface BrandLogoProps {
  /** Pixel size of the (square) glyph. Defaults to 24. */
  size?: number;
  className?: string;
}

/** Brand mark only (the trend-line + dot glyph), tinted with the brand teal. */
export function BrandLogo({ size = 24, className }: BrandLogoProps) {
  return (
    <span
      className={cn("relative inline-block shrink-0 text-primary", className)}
      style={{ width: size, height: size }}
      aria-hidden
    >
      {/* Upward trend line */}
      <span
        className="absolute"
        style={{ top: "28.13%", right: "15.63%", bottom: "18.75%", left: "12.5%" }}
      >
        <span
          className="absolute"
          style={{ top: "-7.65%", right: "-5.65%", bottom: "-7.65%", left: "-5.65%" }}
        >
          <TrendLine className="block h-full w-full" />
        </span>
      </span>
      {/* Marker dot at the line's end */}
      <span
        className="absolute"
        style={{ top: "28.13%", right: "5.03%", bottom: "50.63%", left: "73.72%" }}
      >
        <Dot className="block h-full w-full" />
      </span>
    </span>
  );
}

export interface BrandWordmarkProps {
  /** Pixel size of the logo glyph. Defaults to 24. */
  size?: number;
  /** Font size (px) of the wordmark. Defaults to 17. */
  textSize?: number;
  className?: string;
}

/** Logo glyph + "민기" wordmark, used in the header, footer and auth cards. */
export function BrandWordmark({
  size = 24,
  textSize = 17,
  className,
}: BrandWordmarkProps) {
  return (
    <span className={cn("inline-flex items-center gap-[9px]", className)}>
      <BrandLogo size={size} />
      <span
        className="font-bold text-porcelain leading-none"
        style={{ fontSize: textSize }}
      >
        민기
      </span>
    </span>
  );
}
