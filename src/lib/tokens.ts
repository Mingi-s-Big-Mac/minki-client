/**
 * 토큰 저장 계층 (localStorage 기반).
 *
 * - accessToken: JWT, 기본 만료 15분.
 * - refreshToken: opaque, 1회용 로테이션 → refresh 응답으로 받은 새 값으로 항상 교체.
 * - user: 빠른 부팅용 캐시 (진위는 `GET /auth/me`로 검증).
 */

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const USER_KEY = "user";

import type { User } from "@/types/api";

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setTokens(accessToken: string, refreshToken: string): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function getCachedUser(): User | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function setCachedUser(user: User): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

/** access·refresh·user 모두 제거 (로그아웃 / refresh 실패 시). */
export function clearTokens(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
