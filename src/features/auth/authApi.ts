/**
 * 인증 관련 엔드포인트 래퍼 (`/api/v1/auth/*`).
 * 백엔드 가이드의 "인증 플로우 (순서 고정)"를 그대로 옮겼다.
 */
import { apiGet, apiPost } from "@/lib/api";
import type { AuthSession, User } from "@/types/api";

export type VerificationPurpose = "SIGN_UP" | (string & {});

export interface RequestEmailVerificationBody {
  email: string;
  purpose: VerificationPurpose;
}

/** SMTP 미설정 시 개발 환경에서 실제 발송이 안 됨을 감지 가능. */
export interface RequestEmailVerificationResult {
  delivery: "email" | "not_configured";
}

export interface ConfirmEmailVerificationBody {
  email: string;
  code: string;
  purpose: VerificationPurpose;
}

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

/** 1) 인증 코드 메일 발송. */
export function requestEmailVerification(body: RequestEmailVerificationBody) {
  return apiPost<RequestEmailVerificationResult>(
    "/auth/email-verifications",
    body,
  );
}

/** 2) 6자리 코드 검증. 실패 시 EMAIL_VERIFICATION_INVALID / _ATTEMPTS_EXCEEDED. */
export function confirmEmailVerification(body: ConfirmEmailVerificationBody) {
  return apiPost<unknown>("/auth/email-verifications/confirm", body);
}

/** 3) 회원가입. 성공 시 세션을 바로 반환(별도 로그인 불필요). */
export function signUp(body: SignUpBody) {
  return apiPost<AuthSession>("/auth/sign-up", body);
}

/** 4) 로그인. */
export function signIn(body: SignInBody) {
  return apiPost<AuthSession>("/auth/sign-in", body);
}

/** 6) 로그아웃 — 서버에서 해당 refresh token 폐기. */
export function signOut(refreshToken: string) {
  return apiPost<unknown>("/auth/sign-out", { refreshToken });
}

/** 7) 로그인 상태 확인 (Bearer 필요). */
export function getMe() {
  return apiGet<User>("/auth/me");
}
