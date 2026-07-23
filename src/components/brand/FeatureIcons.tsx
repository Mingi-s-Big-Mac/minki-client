import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

// Feature glyphs from the Figma design system, each composed from the exact
// exported vector fragments used in the design (search = lens + handle,
// chat = speech bubble, roadmap = route line + waypoint dots).
import Lens from "@/assets/icons/icon-07.svg?react";
import Handle from "@/assets/icons/icon-12.svg?react";
import Bubble from "@/assets/icons/icon-09.svg?react";
import RouteLine from "@/assets/icons/icon-13.svg?react";
import Waypoint from "@/assets/icons/icon-10.svg?react";

interface FeatureIconProps {
  /** Pixel size of the (square) icon. Defaults to 30. */
  size?: number;
  className?: string;
}

function IconFrame({
  size = 30,
  className,
  children,
}: FeatureIconProps & { children: ReactNode }) {
  return (
    <span
      className={cn("relative inline-block shrink-0 text-primary", className)}
      style={{ width: size, height: size }}
      aria-hidden
    >
      {children}
    </span>
  );
}

/** Magnifying-glass search icon (진로 검색). */
export function IconSearch(props: FeatureIconProps) {
  return (
    <IconFrame {...props}>
      <span
        className="absolute"
        style={{ top: "14.58%", right: "31.25%", bottom: "31.25%", left: "14.58%" }}
      >
        <span
          className="absolute"
          style={{ inset: "-7.69%" }}
        >
          <Lens className="block h-full w-full" />
        </span>
      </span>
      <span
        className="absolute"
        style={{ top: "62.5%", right: "14.58%", bottom: "14.58%", left: "62.5%" }}
      >
        <span className="absolute" style={{ inset: "-18.18%" }}>
          <Handle className="block h-full w-full" />
        </span>
      </span>
    </IconFrame>
  );
}

/** Speech-bubble icon (AI 질의응답). */
export function IconChat(props: FeatureIconProps) {
  return (
    <IconFrame {...props}>
      <span
        className="absolute"
        style={{ top: "12.5%", right: "12.5%", bottom: "16.67%", left: "12.5%" }}
      >
        <span
          className="absolute"
          style={{ top: "-5.29%", right: "-5%", bottom: "-5.29%", left: "-5%" }}
        >
          <Bubble className="block h-full w-full" />
        </span>
      </span>
    </IconFrame>
  );
}

/** Route / roadmap icon — waypoints connected by a line (로드맵 생성). */
export function IconRoadmap(props: FeatureIconProps) {
  return (
    <IconFrame {...props}>
      {/* Connecting route line */}
      <span
        className="absolute"
        style={{ top: "20.83%", right: "16.67%", bottom: "16.67%", left: "16.67%" }}
      >
        <span
          className="absolute"
          style={{ top: "-5.33%", right: "-5%", bottom: "-5.33%", left: "-5%" }}
        >
          <RouteLine className="block h-full w-full" />
        </span>
      </span>
      {/* Bottom-left waypoint */}
      <span
        className="absolute"
        style={{ top: "75%", right: "75%", bottom: "8.33%", left: "8.33%" }}
      >
        <Waypoint className="block h-full w-full" />
      </span>
      {/* Center waypoint */}
      <span className="absolute" style={{ inset: "41.67%" }}>
        <Waypoint className="block h-full w-full" />
      </span>
      {/* Top-right waypoint */}
      <span
        className="absolute"
        style={{ top: "12.5%", right: "8.33%", bottom: "70.83%", left: "75%" }}
      >
        <Waypoint className="block h-full w-full" />
      </span>
    </IconFrame>
  );
}
