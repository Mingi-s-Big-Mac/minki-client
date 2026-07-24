import { useState } from "react";
import { toast } from "sonner";
import { EmptyState, ErrorState, LoadingState, Spinner } from "@/components/ui";
import { AI_NOT_READY_MESSAGE, isAiNotReady } from "@/features/ai/aiStatus";
import { useAuth } from "@/features/auth";
import { gradeLabel } from "@/features/users/grade";
import { listOccupations } from "@/features/occupations/occupationsApi";
import {
  createRoadmap,
  deleteRoadmap,
  getRoadmap,
  listRoadmaps,
} from "@/features/roadmaps/roadmapsApi";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/cn";
import { useMutation, useQuery } from "@/lib/useQuery";
import { AppShell } from "./AppShell";

/** 진로 로드맵 생성 페이지 (Figma node 1:2396). */
export default function Roadmap() {
  const { user } = useAuth();

  const roadmaps = useQuery(() => listRoadmaps(), []);
  // 검색 화면과 동일한 기본 size로 조회한다. (size=100은 백엔드 검증에 걸려
  // 목록이 비면 관심 직무 select가 통째로 비활성화되던 원인이었다.)
  const occupations = useQuery(() => listOccupations(), []);
  const create = useMutation(createRoadmap);

  const [major, setMajor] = useState(user?.majorText ?? "");
  const [targetOccupationId, setTargetOccupationId] = useState("");
  const [aiNotReady, setAiNotReady] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const detail = useQuery(() => getRoadmap(selectedId!), [selectedId], {
    enabled: !!selectedId,
  });

  const occupationOptions = occupations.data?.data ?? [];
  const roadmapList = roadmaps.data?.data ?? [];

  async function handleGenerate() {
    setAiNotReady(false);
    if (!targetOccupationId) {
      toast("관심 직무를 선택해주세요.");
      return;
    }
    try {
      const created = await create.mutate({
        grade: user?.grade ?? 0,
        major,
        targetOccupationId,
        currentSkillIds: [],
      });
      toast.success("로드맵을 생성했어요.");
      await roadmaps.refetch();
      setSelectedId(created.id);
    } catch (err) {
      if (isAiNotReady(err)) setAiNotReady(true);
      else toast.error("로드맵 생성에 실패했어요. 잠시 후 다시 시도해주세요.");
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteRoadmap(id);
      if (id === selectedId) setSelectedId(null);
      await roadmaps.refetch();
      toast.success("로드맵을 삭제했어요.");
    } catch {
      toast.error("삭제하지 못했어요.");
    }
  }

  return (
    <AppShell>
      <div className="flex flex-col gap-5 p-5 sm:p-8 lg:p-10">
        <h1 className="text-[20px] font-bold text-porcelain">진로 로드맵 생성</h1>

        {/* Generator form */}
        <div className="flex flex-wrap items-end gap-4 rounded-[14px] border border-line-strong bg-surface p-[25px]">
          <div className="flex min-w-[120px] flex-col gap-[6px]">
            <label className="text-[12px] text-ink-subtle">현재 학년</label>
            <div className="rounded-sm border border-line-strong bg-field px-[13px] py-3 text-[13px] text-porcelain">
              {gradeLabel(user?.grade)}
            </div>
          </div>

          <div className="flex min-w-[160px] flex-1 flex-col gap-[6px]">
            <label className="text-[12px] text-ink-subtle">전공</label>
            <input
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              placeholder="예: 컴퓨터공학과"
              className="rounded-sm border border-line-strong bg-field px-[13px] py-3 text-[13px] text-porcelain placeholder:text-ink-muted outline-none transition-colors focus:border-primary"
            />
          </div>

          <div className="flex min-w-[180px] flex-1 flex-col gap-[6px]">
            <label className="text-[12px] text-ink-subtle">관심 직무</label>
            <select
              value={targetOccupationId}
              onChange={(e) => setTargetOccupationId(e.target.value)}
              disabled={occupations.loading || occupationOptions.length === 0}
              className="rounded-sm border border-line-strong bg-field px-[13px] py-3 text-[13px] text-porcelain outline-none transition-colors focus:border-primary disabled:opacity-60"
            >
              <option value="">
                {occupations.loading
                  ? "불러오는 중…"
                  : occupations.error
                    ? "목록을 불러오지 못했어요"
                    : occupationOptions.length === 0
                      ? "선택 가능한 직무 없음"
                      : "직무 선택"}
              </option>
              {occupationOptions.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.title}
                </option>
              ))}
            </select>
            {occupations.error && (
              <button
                type="button"
                onClick={occupations.refetch}
                className="self-start text-[11px] text-primary transition-colors hover:text-primary-light"
              >
                다시 불러오기
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={create.loading}
            className="shrink-0 rounded-sm bg-primary px-[22px] py-[12px] text-[13px] font-bold text-brand-ink transition-colors hover:bg-primary-light disabled:opacity-60"
          >
            {create.loading ? "생성 중…" : "로드맵 생성"}
          </button>
        </div>

        {/* AI 준비 중 안내 (503 케이스) */}
        {aiNotReady && (
          <div className="rounded-[14px] border border-primary/40 bg-primary/[0.08] px-[23px] py-4 text-[13px] text-geyser">
            {AI_NOT_READY_MESSAGE} 지금은 로드맵 생성 결과를 제공할 수 없어요.
          </div>
        )}

        {/* 생성된 로드맵 목록 */}
        <section className="flex flex-col gap-3">
          <h2 className="text-[14px] font-semibold text-porcelain">
            생성한 로드맵
          </h2>
          {roadmaps.loading && <LoadingState />}
          {roadmaps.error && (
            <ErrorState
              message="로드맵 목록을 불러오지 못했어요."
              onRetry={roadmaps.refetch}
            />
          )}
          {!roadmaps.loading && !roadmaps.error && roadmapList.length === 0 && (
            <EmptyState message="아직 생성한 로드맵이 없어요." />
          )}
          {roadmapList.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {roadmapList.map((r) => (
                <div
                  key={r.id}
                  className={cn(
                    "flex items-center gap-2 rounded-sm border px-[13px] py-[9px] text-[13px] transition-colors",
                    selectedId === r.id
                      ? "border-primary text-primary"
                      : "border-line-strong text-geyser hover:border-ink-subtle",
                  )}
                >
                  <button type="button" onClick={() => setSelectedId(r.id)}>
                    {r.title}
                    {r.createdAt && (
                      <span className="pl-2 text-[11px] text-ink-muted">
                        {formatDate(r.createdAt)}
                      </span>
                    )}
                  </button>
                  <button
                    type="button"
                    aria-label="로드맵 삭제"
                    onClick={() => handleDelete(r.id)}
                    className="text-ink-muted transition-colors hover:text-porcelain"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 선택한 로드맵 타임라인 */}
        {selectedId && detail.loading && <Spinner />}
        {selectedId && detail.error && (
          <ErrorState
            message="로드맵을 불러오지 못했어요."
            onRetry={detail.refetch}
          />
        )}
        {selectedId &&
          !detail.loading &&
          !detail.error &&
          detail.data &&
          detail.data.semesters.length === 0 && (
            <EmptyState message="이 로드맵에는 표시할 단계가 없어요." />
          )}
        {selectedId && detail.data && detail.data.semesters.length > 0 && (
          <div className="relative flex flex-col pl-[26px] pt-[14px]">
            {/* Connecting line */}
            <span className="absolute bottom-[6px] left-[5px] top-[20px] w-[2px] bg-line-strong" />

            {detail.data.semesters.map((sem, i) => (
              <div
                key={sem.id ?? i}
                className={
                  i < detail.data!.semesters.length - 1
                    ? "relative pb-[30px]"
                    : "relative"
                }
              >
                {/* Waypoint dot */}
                <span className="absolute left-[-26px] top-[2px] size-[18px] rounded-full border-[3px] border-canvas bg-primary" />

                <div className="flex flex-col gap-3 rounded-[14px] border border-line-strong bg-surface p-[21px]">
                  <div className="flex flex-col gap-1">
                    <span className="text-[13px] font-bold text-primary">
                      {sem.title}
                    </span>
                    {sem.description && (
                      <p className="text-[13px] leading-[1.6] text-ink-subtle">
                        {sem.description}
                      </p>
                    )}
                  </div>

                  {sem.items.length > 0 && (
                    <ul className="flex flex-col gap-[10px]">
                      {sem.items.map((item, j) => (
                        <li
                          key={item.id ?? j}
                          className="flex flex-col gap-1 rounded-[10px] bg-chip/60 p-[13px]"
                        >
                          <p className="text-[14px] font-semibold text-porcelain">
                            {item.title}
                          </p>
                          {item.description && (
                            <p className="text-[12px] leading-[1.6] text-ink-subtle">
                              {item.description}
                            </p>
                          )}
                          {item.source && (
                            <p className="pt-[2px] text-[11px] text-ink-muted">
                              {item.source}
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
