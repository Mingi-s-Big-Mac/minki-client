/**
 * 인증 관련 엔드포인트 래퍼 (`/api/v1/auth/*`).
 * 백엔드 가이드의 "인증 플로우 (순서 고정)"를 그대로 옮겼다.
 */
import { apiGet, apiPost } from "@/lib/api";
import type { AuthSession, User } from "@/types/api";

export interface SignUpBody {
  email: string;
  password: string;
  nickname: string;
  grade: number;
  majorText: string;
  schoolId?: string;
  majorId?: string;
}

export interface SignInBody {
  email: string;
  password: string;
}

/** 회원가입. 성공 시 세션을 바로 반환(별도 로그인 불필요). */
export function signUp(body: SignUpBody) {
  return apiPost<AuthSession>("/auth/sign-up", body);
}

/** 로그인. */
export function signIn(body: SignInBody) {
  return apiPost<AuthSession>("/auth/sign-in", body);
}

/** 로그아웃 — stateless JWT라 서버 상태 없음. 클라이언트 토큰만 지우면 됨. */
export function signOut(refreshToken: string) {
  return apiPost<unknown>("/auth/sign-out", { refreshToken });
}

/** 로그인 상태 확인 (Bearer 필요). */
export function getMe() {
  return apiGet<User>("/auth/me");
}
