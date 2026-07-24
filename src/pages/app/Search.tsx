import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui";
import {
  listMajors,
  listQualifications,
  listSkills,
  type CatalogItem,
} from "@/features/catalog/catalogApi";
import { addInterest, removeInterest } from "@/features/interests/interestsApi";
import {
  listOccupations,
  type OccupationFilter,
  type OccupationSummary,
} from "@/features/occupations/occupationsApi";
import { addRecentSearch } from "@/features/search/recentSearches";
import type { Paginated } from "@/types/api";
import { cn } from "@/lib/cn";
import { useQuery } from "@/lib/useQuery";
import { AppShell } from "./AppShell";

const FILTERS: { label: string; value: OccupationFilter }[] = [
  { label: "직무명", value: "title" },
  { label: "기술", value: "skill" },
  { label: "자격증", value: "qualification" },
  { label: "학과", value: "major" },
];

/**
 * 직무명 외 필터는 해당 카탈로그(기술/자격증/학과) 목록을 보여준다.
 * 항목을 누르면 그 이름으로 직무를 검색한다.
 */
const CATALOG_BY_FILTER: Record<
  Exclude<OccupationFilter, "title">,
  { label: string; fetch: () => Promise<Paginated<CatalogItem>> }
> = {
  skill: { label: "기술", fetch: listSkills },
  qualification: { label: "자격증", fetch: listQualifications },
  major: { label: "학과", fetch: listMajors },
};

/** 페이지네이션에 표시할 페이지 번호 목록(현재 기준 최대 5개 창). */
function pageWindow(current: number, total: number): number[] {
  if (total <= 1) return [];
  const start = Math.max(1, Math.min(current - 2, total - 4));
  const end = Math.min(total, start + 4);
  const out: number[] = [];
  for (let p = start; p <= end; p++) out.push(p);
  return out;
}

/** 진로 검색 페이지 (Figma node 1:1978). */
export default function Search() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get("query") ?? "";
  const filter = (searchParams.get("filter") as OccupationFilter) ?? "title";
  const page = Number(searchParams.get("page")) || 1;

  const [input, setInput] = useState(query);
  useEffect(() => setInput(query), [query]);

  // 검색어가 있으면 로컬 최근 검색 기록에 남긴다(홈 대시보드 폴백용, 추가 API 없음).
  useEffect(() => {
    if (query) addRecentSearch(query);
  }, [query]);

  const { data, loading, error, refetch } = useQuery(
    () => listOccupations({ query: query || undefined, filter, page }),
    [query, filter, page],
  );

  // 직무명 외 필터가 선택되면 해당 카탈로그(기술/자격증/학과) 목록을 불러온다.
  const catalogDef =
    filter === "title" ? null : CATALOG_BY_FILTER[filter];
  const catalog = useQuery(() => catalogDef!.fetch(), [filter], {
    enabled: catalogDef !== null,
  });
  const catalogItems = catalog.data?.data ?? [];

  // `data?.data ?? []`를 그대로 쓰면 매 렌더마다 새 배열 참조가 되어
  // 아래 effect가 무한 루프에 빠지므로 useMemo로 참조를 고정한다.
  const results = useMemo(() => data?.data ?? [], [data]);
  const totalPages = data?.meta.totalPages ?? 0;

  // 저장된 직업 id 집합(응답의 `saved`로 시드, 클릭으로 낙관적 갱신).
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  useEffect(() => {
    setSavedIds((prev) => {
      // 실제로 추가할 id가 있을 때만 새 Set을 만든다. 변화가 없으면 prev를
      // 그대로 반환해 불필요한 리렌더(→ 무한 루프)를 막는다.
      let next: Set<string> | null = null;
      for (const job of results) {
        if (job.saved && !prev.has(job.id)) {
          next ??= new Set(prev);
          next.add(job.id);
        }
      }
      return next ?? prev;
    });
  }, [results]);

  const windowPages = useMemo(
    () => pageWindow(page, totalPages),
    [page, totalPages],
  );

  function updateParams(next: Record<string, string | undefined>) {
    const merged = new URLSearchParams(searchParams);
    for (const [k, v] of Object.entries(next)) {
      if (v == null || v === "") merged.delete(k);
      else merged.set(k, v);
    }
    setSearchParams(merged);
  }

  function submitSearch() {
    updateParams({ query: input.trim(), page: "1" });
  }

  async function toggleSave(job: OccupationSummary) {
    const isSaved = savedIds.has(job.id);
    // 낙관적 반영 후 실패 시 롤백.
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (isSaved) next.delete(job.id);
      else next.add(job.id);
      return next;
    });
    try {
      if (isSaved) await removeInterest(job.id);
      else await addInterest(job.id);
      toast.success(
        isSaved
          ? `'${job.title}' 저장을 해제했어요.`
          : `'${job.title}'을(를) 관심 직무에 저장했어요.`,
      );
    } catch {
      setSavedIds((prev) => {
        const next = new Set(prev);
        if (isSaved) next.add(job.id);
        else next.delete(job.id);
        return next;
      });
      toast.error("처리하지 못했어요. 잠시 후 다시 시도해주세요.");
    }
  }

  return (
    <AppShell>
      <div className="flex flex-col gap-[14px] px-5 py-7 sm:px-10 sm:py-9">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submitSearch()}
          placeholder="예: 백엔드 개발자, 데이터 분석, SQLD..."
          className="w-full rounded-[10px] border border-line-strong bg-field px-[17px] py-[13px] text-[14px] text-porcelain placeholder:text-ink-muted outline-none transition-colors focus:border-primary"
        />

        {/* Category filters */}
        <div className="flex flex-wrap gap-[10px]">
          {FILTERS.map(({ label, value }) => {
            const active = value === filter;
            return (
              <button
                key={value}
                type="button"
                onClick={() => updateParams({ filter: value, page: "1" })}
                className={
                  active
                    ? "rounded-full border border-primary bg-primary/12 px-[15px] py-[9px] text-[12px] font-semibold text-primary"
                    : "rounded-full border border-line-strong bg-field px-[15px] py-[9px] text-[12px] text-geyser transition-colors hover:border-ink-subtle"
                }
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* 카탈로그 목록 (기술/자격증/학과) — 누르면 그 이름으로 직무 검색 */}
        {catalogDef && (
          <section className="flex flex-col gap-[10px] rounded-[14px] border border-line-strong bg-surface p-[19px]">
            <h2 className="text-[13px] font-semibold text-porcelain">
              {catalogDef.label} 선택
            </h2>
            {catalog.loading && <LoadingState />}
            {catalog.error && (
              <ErrorState
                message={`${catalogDef.label} 목록을 불러오지 못했어요.`}
                onRetry={catalog.refetch}
              />
            )}
            {!catalog.loading &&
              !catalog.error &&
              catalogItems.length === 0 && (
                <p className="text-[13px] text-ink-muted">
                  등록된 {catalogDef.label} 데이터가 없어요.
                </p>
              )}
            {catalogItems.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {catalogItems.map((item) => {
                  const selected = item.name === query;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setInput(item.name);
                        updateParams({ query: item.name, page: "1" });
                      }}
                      className={cn(
                        "rounded-full border px-[13px] py-[7px] text-[12px] transition-colors",
                        selected
                          ? "border-primary bg-primary/12 font-semibold text-primary"
                          : "border-line-strong bg-field text-geyser hover:border-primary hover:text-primary",
                      )}
                    >
                      {item.name}
                    </button>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {loading && <LoadingState />}
        {error && (
          <ErrorState message="검색 결과를 불러오지 못했어요." onRetry={refetch} />
        )}
        {!loading && !error && results.length === 0 && (
          <EmptyState
            message={
              query
                ? `'${query}'에 대한 결과가 없어요.`
                : "검색어를 입력해 직무를 찾아보세요."
            }
          />
        )}

        {/* Results */}
        {!loading && !error && results.length > 0 && (
          <ul className="flex flex-col gap-[14px] pt-3">
            {results.map((job) => {
              const isSaved = savedIds.has(job.id);
              return (
                <li
                  key={job.id}
                  className="flex flex-col gap-4 rounded-[14px] border border-line-strong bg-surface p-[23px] sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <div className="flex items-center gap-[10px]">
                      <button
                        type="button"
                        onClick={() => navigate(`/jobs/${job.id}`)}
                        className="text-left text-[16px] font-semibold text-porcelain transition-colors hover:text-primary"
                      >
                        {job.title}
                      </button>
                      {job.badge && (
                        <span className="rounded-full bg-primary/12 px-[9px] py-[3px] text-[11px] font-bold text-primary">
                          {job.badge}
                        </span>
                      )}
                      {job.category && (
                        <span className="rounded-full bg-chip px-[9px] py-[3px] text-[11px] font-semibold text-geyser">
                          {job.category}
                        </span>
                      )}
                    </div>
                    {job.summary && (
                      <p className="text-[13px] leading-[1.6] text-ink-subtle">
                        {job.summary}
                      </p>
                    )}
                    {job.skills && job.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {job.skills.map((skill) => (
                          <span
                            key={skill}
                            className="rounded-md bg-chip px-[11px] py-[5px] text-[12px] text-geyser"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                    {job.qualificationSummary && (
                      <p className="text-[12px] text-ink-subtle">
                        관련 자격증: {job.qualificationSummary}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleSave(job)}
                    className={cn(
                      "shrink-0 self-start rounded-sm px-[19px] py-[11px] text-[13px] font-semibold transition-colors sm:self-auto",
                      isSaved
                        ? "bg-primary text-brand-ink hover:bg-primary-light"
                        : "border border-line-outline text-porcelain hover:border-ink-subtle",
                    )}
                  >
                    {isSaved ? "저장됨" : "관심 직무 저장"}
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        {/* Pagination */}
        {!loading && !error && totalPages > 1 && (
          <nav
            className="flex items-center justify-center gap-2 pt-3"
            aria-label="페이지네이션"
          >
            {windowPages.map((p) => (
              <button
                key={p}
                type="button"
                aria-current={p === page ? "page" : undefined}
                onClick={() => updateParams({ page: String(p) })}
                className={
                  p === page
                    ? "flex size-[30px] items-center justify-center rounded-sm bg-primary text-[13px] font-bold text-brand-ink"
                    : "flex size-8 items-center justify-center rounded-sm border border-line-strong text-[13px] text-ink-subtle transition-colors hover:border-ink-subtle"
                }
              >
                {p}
              </button>
            ))}
          </nav>
        )}
      </div>
    </AppShell>
  );
}
