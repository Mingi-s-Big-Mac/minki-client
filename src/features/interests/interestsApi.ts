/**
 * 관심 직업(interests) 엔드포인트 래퍼 (`/api/v1/interests/occupations`).
 *
 * 응답은 occupations와 같은 직업 객체(`name`/`category`…)를 그대로 품는다고 보고
 * `toSummary`로 정규화한다. 직업 객체가 `occupation`으로 한 겹 감싸여 오거나
 * 저장 시각 필드명이 달라도(`savedAt`/`createdAt`/`interestedAt`) 흡수한다.
 */
import { apiDelete, apiGetPage, apiPost } from "@/lib/api";
import type { Paginated } from "@/types/api";
import {
  toSummary,
  type OccupationSummary,
  type RawOccupation,
} from "@/features/occupations/occupationsApi";

/** 저장된 관심 직업 1건(직업 요약 + 저장 시각). */
export interface InterestOccupation extends OccupationSummary {
  /** 저장 시각(ISO 문자열로 가정). */
  savedAt?: string;
}

/** 관심목록 원본 1건. 직업 필드가 그대로 오거나 `occupation`으로 감싸여 온다. */
export type RawInterest = RawOccupation & {
  occupation?: RawOccupation;
  savedAt?: string;
  createdAt?: string;
  interestedAt?: string;
};

/** 원본 관심 항목 → 화면 타입. */
export function toInterest(raw: RawInterest): InterestOccupation {
  const occ = raw.occupation ?? raw;
  return {
    ...toSummary(occ),
    savedAt: raw.savedAt ?? raw.createdAt ?? raw.interestedAt,
  };
}

/** 관심 직업 목록. */
export async function listInterests(): Promise<Paginated<InterestOccupation>> {
  const page = await apiGetPage<RawInterest>("/interests/occupations");
  return { ...page, data: page.data.map(toInterest) };
}

/** 관심 직업 저장. */
export function addInterest(occupationId: string): Promise<unknown> {
  return apiPost<unknown>(`/interests/occupations/${occupationId}`);
}

/** 관심 직업 해제. */
export function removeInterest(occupationId: string): Promise<unknown> {
  return apiDelete<unknown>(`/interests/occupations/${occupationId}`);
}
