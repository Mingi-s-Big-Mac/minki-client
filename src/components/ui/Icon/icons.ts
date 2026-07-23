import type { FunctionComponent, SVGProps } from "react";

// Each SVG is imported as a React component (vite-plugin-svgr) and normalized
// to `currentColor`, so the Icon wrapper controls color via CSS `color`.
import Icon01 from "@/assets/icons/icon-01.svg?react";
import Icon02 from "@/assets/icons/icon-02.svg?react";
import Icon03 from "@/assets/icons/icon-03.svg?react";
import Icon04 from "@/assets/icons/icon-04.svg?react";
import Icon05 from "@/assets/icons/icon-05.svg?react";
import Icon06 from "@/assets/icons/icon-06.svg?react";
import Icon07 from "@/assets/icons/icon-07.svg?react";
import Icon08 from "@/assets/icons/icon-08.svg?react";
import Icon09 from "@/assets/icons/icon-09.svg?react";
import Icon10 from "@/assets/icons/icon-10.svg?react";
import Icon11 from "@/assets/icons/icon-11.svg?react";
import Icon12 from "@/assets/icons/icon-12.svg?react";
import Icon13 from "@/assets/icons/icon-13.svg?react";
import Icon14 from "@/assets/icons/icon-14.svg?react";
import Icon15 from "@/assets/icons/icon-15.svg?react";
import Icon16 from "@/assets/icons/icon-16.svg?react";
import Icon17 from "@/assets/icons/icon-17.svg?react";
import Icon18 from "@/assets/icons/icon-18.svg?react";
import Icon19 from "@/assets/icons/icon-19.svg?react";
import Icon20 from "@/assets/icons/icon-20.svg?react";

type SvgComponent = FunctionComponent<SVGProps<SVGSVGElement>>;

/**
 * Icon registry. Keys map to the Figma component variants (variant=1..20).
 * The glyphs are trend-lines, chat bubbles and dot markers from the design.
 */
export const iconRegistry = {
  variant1: Icon01,
  variant2: Icon02,
  variant3: Icon03,
  variant4: Icon04,
  variant5: Icon05,
  variant6: Icon06,
  variant7: Icon07,
  variant8: Icon08,
  variant9: Icon09,
  variant10: Icon10,
  variant11: Icon11,
  variant12: Icon12,
  variant13: Icon13,
  variant14: Icon14,
  variant15: Icon15,
  variant16: Icon16,
  variant17: Icon17,
  variant18: Icon18,
  variant19: Icon19,
  variant20: Icon20,
} satisfies Record<string, SvgComponent>;

export type IconName = keyof typeof iconRegistry;

export const iconNames = Object.keys(iconRegistry) as IconName[];
