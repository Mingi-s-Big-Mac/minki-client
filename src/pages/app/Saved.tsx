import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui";
import {
  listInterests,
  removeInterest,
  type InterestOccupation,
} from "@/features/interests/interestsApi";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/cn";
import { useMutation, useQuery } from "@/lib/useQuery";
import { AppShell } from "./AppShell";

/** 관심 직무 저장 목록 (Figma node 1:2165). */
export default function Saved() {
  const navigate = useNavigate();
  const { data, loading, error, refetch, setData } = useQuery(
    () => listInterests(),
    [],
  );
  const remove = useMutation(removeInterest);

  // 비교 선택 상태(직업 id 집합).
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const items = data?.data ?? [];

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleRemove(job: InterestOccupation) {
    try {
      await remove.mutate(job.id);
      setData((prev) =>
        prev
          ? { ...prev, data: prev.data.filter((it) => it.id !== job.id) }
          : prev,
      );
      setSelected((prev) => {
        const next = new Set(prev);
        next.delete(job.id);
        return next;
      });
      toast.success(`'${job.title}'을(를) 목록에서 삭제했어요.`);
    } catch {
      toast.error("삭제하지 못했어요. 잠시 후 다시 시도해주세요.");
    }
  }

  function compareSelected() {
    if (selected.size < 2) {
      toast("비교하려면 2개 이상 선택해주세요.");
      return;
    }
    navigate(`/compare?ids=${[...selected].join(",")}`);
  }

  return (
    <AppShell>
      <div className="flex flex-col gap-6 p-5 sm:p-8 lg:p-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-[20px] font-bold text-porcelain">
            저장한 관심 직무 ({items.length})
          </h1>
          {items.length > 0 && (
            <button
              type="button"
              onClick={compareSelected}
              disabled={selected.size < 2}
              className="rounded-sm bg-primary px-[18px] py-[10px] text-[13px] font-bold text-brand-ink transition-colors hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-50"
            >
              선택한 {selected.size}개 비교
            </button>
          )}
        </div>

        {loading && <LoadingState />}
        {error && (
          <ErrorState message="목록을 불러오지 못했어요." onRetry={refetch} />
        )}

        {!loading && !error && items.length === 0 && (
          <EmptyState
            message="저장한 관심 직무가 없어요."
            action={
              <button
                type="button"
                onClick={() => navigate("/search")}
                className="rounded-sm border border-line-outline px-[15px] py-[8px] text-[12px] font-semibold text-porcelain transition-colors hover:border-ink-subtle"
              >
                진로 검색하러 가기
              </button>
            }
          />
        )}

        {!loading && !error && items.length > 0 && (
          <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-4">
            {items.map((job) => {
              const isSelected = selected.has(job.id);
              return (
                <article
                  key={job.id}
                  className={cn(
                    "flex flex-col gap-[6px] rounded-[14px] border bg-surface p-[21px] transition-colors",
                    isSelected ? "border-primary" : "border-line-strong",
                  )}
                >
                  <h2 className="text-[15px] font-semibold text-porcelain">
                    <button
                      type="button"
                      onClick={() => navigate(`/jobs/${job.id}`)}
                      className="text-left transition-colors hover:text-primary"
                    >
                      {job.title}
                    </button>
                  </h2>
                  <p className="text-[12px] text-ink-muted">
                    {formatDate(job.savedAt)}
                  </p>
                  <div className="flex gap-2 pt-[10px]">
                    <button
                      type="button"
                      onClick={() => toggleSelect(job.id)}
                      aria-pressed={isSelected}
                      className={cn(
                        "flex-1 rounded-[7px] py-[10px] text-center text-[12px] font-bold transition-colors",
                        isSelected
                          ? "bg-primary text-brand-ink hover:bg-primary-light"
                          : "border border-line-outline text-geyser hover:border-ink-subtle",
                      )}
                    >
                      {isSelected ? "선택됨" : "비교 선택"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemove(job)}
                      className="flex-1 rounded-[7px] border border-line-outline py-[10px] text-center text-[12px] text-geyser transition-colors hover:border-ink-subtle"
                    >
                      삭제
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}
