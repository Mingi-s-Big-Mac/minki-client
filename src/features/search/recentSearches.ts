/**
 * 로컬 최근 검색 기록 (localStorage 기반).
 *
 * 서버 `/dashboard`의 `recentSearches`는 시드가 비어 있고 검색 시 서버에 기록을
 * 남기는 경로도 없다. 레이트 리밋(분당 10건)을 고려해 추가 API 호출 없이
 * 클라이언트에서 최근 검색어를 보관해 홈 대시보드의 폴백으로 쓴다.
 */
import type { RecentSearch } from "@/features/dashboard/dashboardApi";

const STORAGE_KEY = "minki:recentSearches";
const MAX_ENTRIES = 8;

/** 저장된 최근 검색어(최신순). 파싱 실패/비브라우저 환경에선 빈 배열. */
export function getRecentSearches(): RecentSearch[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (e): e is RecentSearch =>
        !!e && typeof (e as RecentSearch).keyword === "string",
    );
  } catch {
    return [];
  }
}

/** 검색어를 최근 기록 맨 앞에 추가한다(중복 제거, 최대 {@link MAX_ENTRIES}건). */
export function addRecentSearch(keyword: string): void {
  const k = keyword.trim();
  if (!k) return;
  try {
    const next = [
      { keyword: k, searchedAt: new Date().toISOString() },
      ...getRecentSearches().filter((e) => e.keyword !== k),
    ].slice(0, MAX_ENTRIES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* 저장 실패는 조용히 무시 (기록은 부가 기능) */
  }
}
