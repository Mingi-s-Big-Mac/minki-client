import { toast } from "sonner";
import { roadmapProfile, roadmapSteps } from "@/data/roadmap";
import { AppShell } from "./AppShell";

/** 진로 로드맵 생성 페이지 (Figma node 1:2396). */
export default function Roadmap() {
  return (
    <AppShell>
      <div className="flex flex-col gap-5 p-10">
        <h1 className="text-[20px] font-bold text-porcelain">진로 로드맵 생성</h1>

        {/* Generator form */}
        <div className="flex items-end gap-4 rounded-[14px] border border-line-strong bg-surface p-[25px]">
          {roadmapProfile.map((field) => (
            <div key={field.label} className="flex min-w-0 flex-1 flex-col gap-[6px]">
              <label className="text-[12px] text-ink-subtle">{field.label}</label>
              <div className="rounded-sm border border-line-strong bg-field px-[13px] py-3 text-[13px] text-porcelain">
                {field.value}
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => toast("로드맵을 생성했어요.")}
            className="shrink-0 rounded-sm bg-primary px-[22px] py-[12px] text-[13px] font-bold text-brand-ink transition-colors hover:bg-primary-light"
          >
            로드맵 생성
          </button>
        </div>

        {/* Timeline */}
        <div className="relative flex flex-col pl-[26px] pt-[14px]">
          {/* Connecting line */}
          <span className="absolute bottom-[6px] left-[5px] top-[20px] w-[2px] bg-line-strong" />

          {roadmapSteps.map((step, i) => (
            <div
              key={step.term}
              className={i < roadmapSteps.length - 1 ? "relative pb-[30px]" : "relative"}
            >
              {/* Waypoint dot */}
              <span className="absolute left-[-26px] top-[2px] size-[18px] rounded-full border-[3px] border-canvas bg-primary" />

              <div className="flex flex-col gap-[6px] rounded-[14px] border border-line-strong bg-surface p-[21px]">
                <span className="text-[12px] font-bold text-primary">
                  {step.term}
                </span>
                <p className="text-[15px] font-semibold text-porcelain">
                  {step.title}
                </p>
                <div>
                  <span className="inline-block rounded-md bg-chip px-[11px] py-[6px] text-[12px] text-geyser">
                    {step.tag}
                  </span>
                </div>
                <p className="pt-[5px] text-[11px] text-ink-muted">{step.source}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
