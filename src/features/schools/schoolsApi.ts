/**
 * 학교 검색 엔드포인트 래퍼 (`/api/v1/schools`, 인증 불필요).
 * 회원가입 시 학교 선택용. 현재 DB 시드가 비어 있으면 빈 목록을 반환한다.
 *
 * ⚠️ 아이템 타입은 추론. 실제 응답과 다르면 타입만 교정.
 */
import { apiGetPage } from "@/lib/api";
import type { Paginated } from "@/types/api";

export interface School {
  id: string;
  name: string;
  /** 이메일 화이트리스트 도메인(예: "university.ac.kr"). */
  domain?: string;
}

export function listSchools(query?: string): Promise<Paginated<School>> {
  return apiGetPage<School>("/schools", {
    params: query ? { query } : undefined,
  });
}
