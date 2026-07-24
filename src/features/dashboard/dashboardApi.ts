/**
 * 대시보드 홈 엔드포인트 래퍼 (`/api/v1/dashboard`).
 *
 * ⚠️ 응답 타입은 홈 화면(`src/pages/app/Home.tsx`) 목 데이터 기반 추론.
 * 실제 응답과 다르면 타입만 교정.
 */
import { apiGet } from "@/lib/api";
import {
  listInterests,
  toInterest,
  type InterestOccupation,
  type RawInterest,
} from "@/features/interests/interestsApi";

/** 최근 검색 기록 1건. */
export interface RecentSearch {
  /** 검색어. */
  keyword: string;
  /** 검색 시각(ISO 또는 표시 문자열). */
  searchedAt?: string;
}

/** 대시보드 응답. 없을 수 있는 필드는 화면에서 방어적으로 렌더한다. */
export interface DashboardData {
  /** 인사말용 닉네임(없으면 AuthContext user로 대체). */
  nickname?: string;
  recentSearches?: RecentSearch[];
  savedOccupations?: InterestOccupation[];
}

/** 대시보드 원본 응답. 저장 직무는 관심목록과 같은 직업 객체 형태로 온다. */
interface RawDashboard extends Omit<DashboardData, "savedOccupations"> {
  savedOccupations?: RawInterest[];
  /** 필드명이 다를 수 있어 후보들도 받아둔다. */
  savedJobs?: RawInterest[];
  interests?: RawInterest[];
}

/**
 * 대시보드 데이터. `/dashboard`가 저장 직무를 안 주거나 필드명이 달라도
 * 메인의 "저장한 관심 직무"가 비지 않도록, 실제 소스인 관심목록을 함께
 * 불러와 채운다. `/dashboard` 자체가 실패해도 관심목록은 살린다.
 */
export async function getDashboard(): Promise<DashboardData> {
  const [dashRes, interestsRes] = await Promise.allSettled([
    apiGet<RawDashboard>("/dashboard"),
    listInterests(),
  ]);

  const raw = dashRes.status === "fulfilled" ? dashRes.value : {};
  const fromDashboard = (
    raw.savedOccupations ??
    raw.savedJobs ??
    raw.interests ??
    []
  ).map(toInterest);
  const fromInterests =
    interestsRes.status === "fulfilled" ? interestsRes.value.data : [];

  return {
    ...raw,
    // 대시보드가 저장 직무를 주면 그걸, 아니면 관심목록을 사용.
    savedOccupations: fromDashboard.length > 0 ? fromDashboard : fromInterests,
  };
}
