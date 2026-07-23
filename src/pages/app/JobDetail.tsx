import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { getJob, type JobSourceGroup } from "@/data/jobs";
import { AppShell } from "./AppShell";

function SourceCard({ group }: { group: JobSourceGroup }) {
  return (
    <section className="flex flex-col gap-3 rounded-[14px] border border-line-strong bg-surface p-[23px]">
      <h2 className="text-[14px] font-semibold text-porcelain">{group.title}</h2>
      <div className="flex flex-wrap gap-2">
        {group.items.map((item) => (
          <span
            key={item}
            className="rounded-md bg-chip px-[11px] py-[5px] text-[12px] text-geyser"
          >
            {item}
          </span>
        ))}
      </div>
      <p className="text-[11px] text-ink-muted">{group.source}</p>
    </section>
  );
}

/** 직무 상세 페이지 (Figma node 1:2072). */
export default function JobDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const job = getJob(id);
  const { salary } = job;

  return (
    <AppShell>
      <div className="flex flex-col gap-[26px] p-10">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex max-w-[640px] flex-col gap-[7px]">
            <h1 className="text-[26px] font-bold text-porcelain">{job.title}</h1>
            <p className="text-[14px] leading-[1.7] text-ink-subtle">
              {job.description}
            </p>
          </div>
          <div className="flex shrink-0 gap-[10px]">
            <button
              type="button"
              onClick={() => toast.success("관심 직무에 저장했어요.")}
              className="rounded-sm border border-line-outline px-[19px] py-3 text-[13px] font-semibold text-porcelain transition-colors hover:border-ink-subtle"
            >
              관심 직무 저장
            </button>
            <button
              type="button"
              onClick={() => navigate("/compare")}
              className="rounded-sm bg-primary px-[18px] py-3 text-[13px] font-bold text-brand-ink transition-colors hover:bg-primary-light"
            >
              비교에 추가
            </button>
          </div>
        </div>

        {/* Sourced facts */}
        <div className="grid grid-cols-1 gap-[22px] md:grid-cols-2">
          <SourceCard group={job.groups.skills} />
          <SourceCard group={job.groups.certs} />
          <SourceCard group={job.groups.majors} />

          <section className="flex flex-col gap-[10px] rounded-[14px] border border-line-strong bg-surface px-[23px] pb-[38px] pt-[23px]">
            <h2 className="text-[14px] font-semibold text-porcelain">
              평균 연봉 범위
            </h2>
            <div className="flex items-center gap-3 pt-1">
              <span className="w-11 text-[12px] text-ink-subtle">
                {salary.min.toLocaleString()}
              </span>
              <div className="relative h-2 flex-1 rounded-full bg-chip">
                <div
                  className="absolute inset-y-0 rounded-full bg-primary"
                  style={{ left: `${salary.from}%`, right: `${100 - salary.to}%` }}
                />
              </div>
              <span className="w-11 text-right text-[12px] text-ink-subtle">
                {salary.max.toLocaleString()}
              </span>
            </div>
            <p className="text-[11px] text-ink-muted">{salary.source}</p>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
