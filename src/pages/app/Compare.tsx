import { useNavigate, useSearchParams } from "react-router-dom";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui";
import {
  getOccupation,
  type OccupationDetail,
} from "@/features/occupations/occupationsApi";
import { useQuery } from "@/lib/useQuery";
import { AppShell } from "./AppShell";

interface CompareRowDef {
  label: string;
  cell: (o: OccupationDetail) => { value: string; source?: string };
}

/** 비교 매트릭스 행 정의. 실제 응답에 존재하는 필드만 사용한다. */
const ROWS: CompareRowDef[] = [
  {
    label: "카테고리",
    cell: (o) => ({ value: o.category || "-" }),
  },
  {
    label: "한 줄 요약",
    cell: (o) => ({ value: o.summary || "-" }),
  },
  {
    label: "상세 설명",
    cell: (o) => ({ value: o.description || "-" }),
  },
  {
    label: "전망",
    cell: (o) => ({ value: o.outlook || "-" }),
  },
];

/** 직무 비교 페이지 (Figma node 1:2233). */
export default function Compare() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const ids = (searchParams.get("ids") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const enoughIds = ids.length >= 2;
  // 전용 `/compare` 엔드포인트에 기대지 않고, 확실히 동작하는 상세 조회를
  // id별로 병렬 호출해 비교 대상을 모은다.
  const { data, loading, error, refetch } = useQuery(
    () => Promise.all(ids.map((id) => getOccupation(id))),
    [ids.join(",")],
    { enabled: enoughIds },
  );

  const jobs = data ?? [];

  return (
    <AppShell>
      <div className="flex flex-col gap-6 p-5 sm:p-8 lg:p-10">
        <h1 className="text-[20px] font-bold text-porcelain">직무 비교</h1>

        {!enoughIds && (
          <EmptyState
            message="비교할 직무를 2개 이상 선택해주세요."
            action={
              <button
                type="button"
                onClick={() => navigate("/saved")}
                className="rounded-sm border border-line-outline px-[15px] py-[8px] text-[12px] font-semibold text-porcelain transition-colors hover:border-ink-subtle"
              >
                관심 직무에서 선택하기
              </button>
            }
          />
        )}

        {enoughIds && loading && <LoadingState />}
        {enoughIds && error && (
          <ErrorState message="비교 정보를 불러오지 못했어요." onRetry={refetch} />
        )}
        {enoughIds && !loading && !error && jobs.length === 0 && (
          <EmptyState message="비교할 직무 정보를 찾지 못했어요." />
        )}

        {enoughIds && !loading && !error && jobs.length > 0 && (
          <div className="overflow-x-auto rounded-[14px] border border-line-strong">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-surface">
                  <th className="w-[160px] border-b border-r border-line-strong" />
                  {jobs.map((job) => (
                    <th
                      key={job.id}
                      className="border-b border-line-strong px-4 pb-[18px] pt-4 text-[15px] font-semibold text-porcelain [&:not(:last-child)]:border-r"
                    >
                      {job.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row) => (
                  <tr key={row.label} className="align-top">
                    <th className="w-[160px] border-b border-r border-line-strong px-4 pb-[41px] pt-[17px] text-left text-[13px] font-semibold text-ink-subtle">
                      {row.label}
                    </th>
                    {jobs.map((job) => {
                      const cell = row.cell(job);
                      return (
                        <td
                          key={job.id}
                          className="border-b border-line-strong px-4 py-4 [&:not(:last-child)]:border-r"
                        >
                          <div className="flex flex-col gap-2">
                            <span className="text-[13px] text-geyser">
                              {cell.value}
                            </span>
                            {cell.source && (
                              <span className="text-[11px] text-ink-muted">
                                {cell.source}
                              </span>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppShell>
  );
}
