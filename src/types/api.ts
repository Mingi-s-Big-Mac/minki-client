/**
 * Shared API contract types for minki-server (`/api/v1`).
 *
 * 응답 포맷은 백엔드 가이드 기준:
 *   성공: { success: true, data, meta? }
 *   실패: { success: false, error: { code, message, details? }, requestId }
 */

/** 성공 응답 봉투. `meta`는 페이지네이션 등 있을 때만 포함. */
export interface ApiSuccess<T, M = unknown> {
  success: true;
  data: T;
  meta?: M;
}

/** 검증 실패(400) 시 `error.details`에 붙는 항목. */
export interface ApiErrorDetail {
  path: string;
  message: string;
}

/** 실패 응답 봉투. */
export interface ApiFailure {
  success: false;
  error: {
    code: string;
    message: string;
    details?: ApiErrorDetail[];
  };
  requestId?: string;
}

export type ApiResponse<T, M = unknown> = ApiSuccess<T, M> | ApiFailure;

/** 목록 응답의 `meta`에 붙는 페이지네이션 정보. */
export interface PageMeta {
  page: number;
  size: number;
  total: number;
  totalPages: number;
}

/** 페이지네이션 목록 응답을 `data`+`meta`로 함께 벗겨낸 형태. */
export interface Paginated<T> {
  data: T[];
  meta: PageMeta;
}

/**
 * 백엔드에서 내려오는 대표 에러 코드. 문자열 유니온으로 좁혀 두되,
 * 목록에 없는 코드도 올 수 있으므로 `(string & {})`로 확장을 허용한다.
 */
export type ApiErrorCode =
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "REFRESH_TOKEN_INVALID"
  | "EMAIL_NOT_VERIFIED"
  | "EMAIL_DOMAIN_NOT_ALLOWED"
  | "EMAIL_VERIFICATION_INVALID"
  | "EMAIL_VERIFICATION_ATTEMPTS_EXCEEDED"
  | "AI_SERVICE_CONTRACT_UNDEFINED"
  | "AI_SERVICE_NOT_CONFIGURED"
  | "RATE_LIMITED"
  // eslint-disable-next-line @typescript-eslint/ban-types
  | (string & {});

/** 인증된 사용자. sign-up / sign-in / refresh / me 응답의 `user`. */
export interface User {
  id: string;
  email: string;
  nickname: string;
  grade: number;
  majorText: string;
  schoolId?: string | null;
  majorId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

/** 인증 성공 응답 (`sign-up` / `sign-in` / `refresh`). */
export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  user: User;
}
