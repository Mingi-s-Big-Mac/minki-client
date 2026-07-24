/**
 * 직업(occupation) 엔드포인트 래퍼 (`/api/v1/occupations`).
 *
 * 실제 백엔드 응답은 `name`/`category(객체)`/`interested` 형태라, 화면이 쓰는
 * `title`/`category(문자열)`/`saved` 요약 타입으로 이 파일에서 정규화한다.
 * (화면 컴포넌트는 `OccupationSummary`/`OccupationDetail`만 알면 된다.)
 */
import { apiGet, apiGetPage } from "@/lib/api";
import type { Paginated } from "@/types/api";

/** 카탈로그 필터 종류. 백엔드 `/catalog/*` 및 검색 카테고리와 대응. */
export type OccupationFilter = "title" | "skill" | "qualification" | "major";

/** 검색 결과 카드 1건. */
export interface OccupationSummary {
  id: string;
  title: string;
  /** 데이터 출처 배지(예: "NCS 2024"). 없을 수 있음. */
  badge?: string;
  /** 카테고리 이름(예: "정보기술"). */
  category?: string;
  /** 한 줄 요약/설명. */
  summary?: string;
  /** 대표 기술 칩. */
  skills?: string[];
  /** 관련 자격증 요약 문구. */
  qualificationSummary?: string;
  /** 이미 관심 직업으로 저장돼 있는지(응답에 포함될 때만). */
  saved?: boolean;
}

/** 출처가 달린 사실 묶음(상세 페이지의 "필요 기술/자격증/학과" 카드). */
export interface SourcedGroup {
  items: string[];
  /** 출처 문구(예: "출처: NCS 2024 …"). */
  source?: string;
}

/** 연봉 범위. `from`/`to`는 트랙 대비 채움 위치(%)로 없으면 min/max로 계산. */
export interface SalaryRange {
  min: number;
  max: number;
  from?: number;
  to?: number;
  source?: string;
}

/** 직업 상세. */
export interface OccupationDetail extends OccupationSummary {
  description?: string;
  /** 직업 전망 문구(있을 때만). */
  outlook?: string;
  skillGroup?: SourcedGroup;
  qualificationGroup?: SourcedGroup;
  majorGroup?: SourcedGroup;
  salary?: SalaryRange;
}

// ── 응답 정규화 ────────────────────────────────────────────────────
// 백엔드 원본 응답 1건. 목록/상세 공통 필드.
// 관심목록·대시보드 등 다른 도메인도 이 형태의 직업 객체를 그대로 품는다.
export interface RawOccupation {
  id: string;
  name: string;
  slug?: string;
  summary?: string | null;
  description?: string | null;
  outlook?: string | null;
  category?: { id: string; name: string; slug: string } | null;
  interested?: boolean;
}

/** 원본 응답 → 검색 카드 요약 타입. 다른 도메인에서도 재사용한다. */
export function toSummary(r: RawOccupation): OccupationSummary {
  return {
    id: r.id,
    title: r.name,
    category: r.category?.name,
    summary: r.summary ?? undefined,
    saved: r.interested,
  };
}

/** 원본 응답 → 상세 타입. */
function toDetail(r: RawOccupation): OccupationDetail {
  return {
    ...toSummary(r),
    description: r.description ?? undefined,
    outlook: r.outlook ?? undefined,
  };
}

export interface ListOccupationsParams {
  query?: string;
  /** 검색 대상 필터(직무명/기술/자격증/학과). */
  filter?: OccupationFilter;
  /** 카테고리 id로 좁힐 때. */
  categoryId?: string;
  page?: number;
  size?: number;
}

/** 직업 목록/검색. 페이지네이션 meta 포함. */
export async function listOccupations(
  params: ListOccupationsParams = {},
): Promise<Paginated<OccupationSummary>> {
  const page = await apiGetPage<RawOccupation>("/occupations", { params });
  return { ...page, data: page.data.map(toSummary) };
}

/** 직업 상세. */
export async function getOccupation(id: string): Promise<OccupationDetail> {
  return toDetail(await apiGet<RawOccupation>(`/occupations/${id}`));
}

/** 직업 비교(최소 2개 id). `data`는 상세 배열로 가정. */
export async function compareOccupations(
  ids: string[],
): Promise<OccupationDetail[]> {
  const raw = await apiGet<RawOccupation[]>("/occupations/compare", {
    params: { ids: ids.join(",") },
  });
  return raw.map(toDetail);
}
