import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ErrorState, LoadingState } from "@/components/ui";
import { addInterest, removeInterest } from "@/features/interests/interestsApi";
import {
  getOccupation,
  type SourcedGroup,
} from "@/features/occupations/occupationsApi";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/cn";
import { useQuery } from "@/lib/useQuery";
import { AppShell } from "./AppShell";

function SourceCard({ title, group }: { title: string; group?: SourcedGroup }) {
  if (!group || group.items.length === 0) return null;
  return (
    <section className="flex flex-col gap-3 rounded-[14px] border border-line-strong bg-surface p-[23px]">
      <h2 className="text-[14px] font-semibold text-porcelain">{title}</h2>
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
      {group.source && (
        <p className="text-[11px] text-ink-muted">{group.source}</p>
      )}
    </section>
  );
}

/** 직무 상세 페이지 (Figma node 1:2072). */
export default function JobDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: job, loading, error, refetch } = useQuery(
    () => getOccupation(id!),
    [id],
    { enabled: !!id },
  );

  const [saved, setSaved] = useState(false);
  useEffect(() => {
    if (job?.saved != null) setSaved(job.saved);
  }, [job]);

  async function toggleSave() {
    if (!job) return;
    const next = !saved;
    setSaved(next);
    try {
      if (next) await addInterest(job.id);
      else await removeInterest(job.id);
      toast.success(
        next ? "관심 직무에 저장했어요." : "관심 직무 저장을 해제했어요.",
      );
    } catch {
      setSaved(!next);
      toast.error("처리하지 못했어요. 잠시 후 다시 시도해주세요.");
    }
  }

  return (
    <AppShell>
      <div className="flex flex-col gap-[26px] p-5 sm:p-8 lg:p-10">
        {loading && <LoadingState />}
        {error && (
          <ErrorState
            message={
              error.status === 404
                ? "존재하지 않는 직무예요."
                : "직무 정보를 불러오지 못했어요."
            }
            onRetry={error.status === 404 ? undefined : refetch}
          />
        )}

        {!loading && !error && job && (
          <>
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex max-w-[640px] flex-col gap-[7px]">
                <h1 className="text-[22px] font-bold text-porcelain sm:text-[26px]">
                  {job.title}
                </h1>
                {job.description && (
                  <p className="text-[14px] leading-[1.7] text-ink-subtle">
                    {job.description}
                  </p>
                )}
              </div>
              <div className="flex shrink-0 gap-[10px]">
                <button
                  type="button"
                  onClick={toggleSave}
                  className={cn(
                    "rounded-sm px-[19px] py-3 text-[13px] font-semibold transition-colors",
                    saved
                      ? "bg-primary text-brand-ink hover:bg-primary-light"
                      : "border border-line-outline text-porcelain hover:border-ink-subtle",
                  )}
                >
                  {saved ? "저장됨" : "관심 직무 저장"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate(`/compare?ids=${job.id}`)}
                  className="rounded-sm bg-primary px-[18px] py-3 text-[13px] font-bold text-brand-ink transition-colors hover:bg-primary-light"
                >
                  비교에 추가
                </button>
              </div>
            </div>

            {/* Sourced facts */}
            <div className="grid grid-cols-1 gap-[22px] md:grid-cols-2">
              <SourceCard title="필요 기술" group={job.skillGroup} />
              <SourceCard title="관련 자격증" group={job.qualificationGroup} />
              <SourceCard title="관련 학과" group={job.majorGroup} />

              {job.salary && (
                <section className="flex flex-col gap-[10px] rounded-[14px] border border-line-strong bg-surface px-[23px] pb-[38px] pt-[23px]">
                  <h2 className="text-[14px] font-semibold text-porcelain">
                    평균 연봉 범위
                  </h2>
                  <div className="flex items-center gap-3 pt-1">
                    <span className="w-11 text-[12px] text-ink-subtle">
                      {formatNumber(job.salary.min)}
                    </span>
                    <div className="relative h-2 flex-1 rounded-full bg-chip">
                      <div
                        className="absolute inset-y-0 rounded-full bg-primary"
                        style={{
                          left: `${job.salary.from ?? 0}%`,
                          right: `${100 - (job.salary.to ?? 100)}%`,
                        }}
                      />
                    </div>
                    <span className="w-11 text-right text-[12px] text-ink-subtle">
                      {formatNumber(job.salary.max)}
                    </span>
                  </div>
                  {job.salary.source && (
                    <p className="text-[11px] text-ink-muted">
                      {job.salary.source}
                    </p>
                  )}
                </section>
              )}
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}
