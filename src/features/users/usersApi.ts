/**
 * 내 정보(users) 엔드포인트 래퍼 (`/api/v1/users/me`).
 *
 * ⚠️ stats/activities 응답 타입은 마이페이지(`src/pages/app/MyPage.tsx`) 목
 * 데이터 기반 추론. 실제 응답과 다르면 타입만 교정.
 */
import { apiDelete, apiGet, apiPatch } from "@/lib/api";
import type { User } from "@/types/api";

/** 내 프로필 조회. */
export function getMyProfile(): Promise<User> {
  return apiGet<User>("/users/me");
}

export interface UpdateProfileBody {
  nickname?: string;
  grade?: number;
  majorText?: string;
  schoolId?: string;
  majorId?: string;
}

/** 내 프로필 수정. */
export function updateMyProfile(body: UpdateProfileBody): Promise<User> {
  return apiPatch<User>("/users/me", body);
}

export interface ChangePasswordBody {
  currentPassword: string;
  newPassword: string;
}

/** 비밀번호 변경. */
export function changePassword(body: ChangePasswordBody): Promise<unknown> {
  return apiPatch<unknown>("/users/me/password", body);
}

/** 회원 탈퇴. */
export function deleteMyAccount(): Promise<unknown> {
  return apiDelete<unknown>("/users/me");
}

/** 마이페이지 통계 카드 값. */
export interface UserStats {
  /** 저장한 관심 직업 수. */
  savedOccupationCount: number;
  /** AI 질문/대화 수. */
  aiQuestionCount: number;
  /** 생성한 로드맵 수. */
  roadmapCount: number;
}

/** 통계 원본. 필드명이 확정 전이라 흔한 후보들을 모두 흡수한다. */
interface RawUserStats {
  savedOccupationCount?: number;
  savedCount?: number;
  interestCount?: number;
  aiQuestionCount?: number;
  questionCount?: number;
  conversationCount?: number;
  roadmapCount?: number;
}

export async function getMyStats(): Promise<UserStats> {
  const r = await apiGet<RawUserStats>("/users/me/stats");
  return {
    savedOccupationCount:
      r.savedOccupationCount ?? r.savedCount ?? r.interestCount ?? 0,
    aiQuestionCount:
      r.aiQuestionCount ?? r.questionCount ?? r.conversationCount ?? 0,
    roadmapCount: r.roadmapCount ?? 0,
  };
}

/** 활동 이력 1건(비밀번호 변경 등). */
export interface UserActivity {
  type: string;
  label?: string;
  /** 발생 시각(ISO). */
  at?: string;
}

export function getMyActivities(): Promise<UserActivity[]> {
  return apiGet<UserActivity[]>("/users/me/activities");
}
