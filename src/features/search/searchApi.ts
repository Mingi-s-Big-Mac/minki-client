/**
 * 통합 검색 자동완성 엔드포인트 래퍼 (`/api/v1/search/suggestions`).
 *
 * ⚠️ 응답 타입 추론. 실제 응답과 다르면 타입만 교정.
 */
import { apiGet } from "@/lib/api";

export interface SearchSuggestion {
  /** 표시 문구. */
  label: string;
  /** 대상 종류(직업/기술/자격증 등). 있을 때만. */
  type?: string;
  /** 바로 이동 가능한 대상 id(직업 등). 있을 때만. */
  id?: string;
}

/** 검색어 자동완성 후보. */
export function getSuggestions(query: string): Promise<SearchSuggestion[]> {
  return apiGet<SearchSuggestion[]>("/search/suggestions", {
    params: { query },
  });
}
