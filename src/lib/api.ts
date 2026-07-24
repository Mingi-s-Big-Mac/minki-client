import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";
import type {
  ApiErrorCode,
  ApiErrorDetail,
  ApiResponse,
  AuthSession,
  PageMeta,
  Paginated,
} from "@/types/api";
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setTokens,
} from "@/lib/tokens";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api/v1";

/**
 * 백엔드 실패 응답을 정규화한 에러. 화면에서는 `error.code`로 분기하고
 * `error.message`(서버 문구)를 그대로 노출할 수 있다.
 */
export class ApiError extends Error {
  readonly code: ApiErrorCode;
  readonly status: number;
  readonly details?: ApiErrorDetail[];
  readonly requestId?: string;

  constructor(params: {
    code: ApiErrorCode;
    message: string;
    status: number;
    details?: ApiErrorDetail[];
    requestId?: string;
  }) {
    super(params.message);
    this.name = "ApiError";
    this.code = params.code;
    this.status = params.status;
    this.details = params.details;
    this.requestId = params.requestId;
  }
}

/** 세션이 완전히 끊겼을 때(로그인 화면으로 보내야 할 때) 발생하는 전역 이벤트. */
export const AUTH_LOGOUT_EVENT = "auth:logout";

function emitLogout(): void {
  clearTokens();
  window.dispatchEvent(new Event(AUTH_LOGOUT_EVENT));
}

/** AxiosError → ApiError 정규화. 응답 없는 네트워크 오류도 감싼다. */
function toApiError(error: AxiosError): ApiError {
  const data = error.response?.data as
    | Extract<ApiResponse<unknown>, { success: false }>
    | undefined;

  if (data && data.success === false && data.error) {
    return new ApiError({
      code: data.error.code,
      message: data.error.message,
      status: error.response?.status ?? 0,
      details: data.error.details,
      requestId: data.requestId,
    });
  }

  return new ApiError({
    code: error.response ? "UNKNOWN_ERROR" : "NETWORK_ERROR",
    message: error.message || "요청을 처리하지 못했어요.",
    status: error.response?.status ?? 0,
  });
}

/** 공유 axios 인스턴스. 요청에 Bearer 토큰을 붙이고 응답 오류를 정규화한다. */
export const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15_000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── refresh 단일 비행 (single-flight) ──────────────────────────────
// 동시에 여러 요청이 401을 받아도 refresh 호출은 한 번만 나가도록 공유한다.
let refreshPromise: Promise<string> | null = null;

/**
 * refresh 토큰으로 새 세션을 발급받아 저장한다.
 * 반드시 인터셉터를 타지 않는 bare axios로 호출해 재귀를 막는다.
 * 받은 새 refreshToken으로 즉시 교체 저장(1회용 로테이션).
 */
async function refreshAccessToken(): Promise<string> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new ApiError({
      code: "REFRESH_TOKEN_INVALID",
      message: "세션이 만료되었어요. 다시 로그인해주세요.",
      status: 401,
    });
  }

  const { data } = await axios.post<ApiResponse<AuthSession>>(
    `${BASE_URL}/auth/refresh`,
    { refreshToken },
    { headers: { "Content-Type": "application/json" } },
  );

  if (!data.success) {
    throw new ApiError({
      code: data.error.code,
      message: data.error.message,
      status: 401,
    });
  }

  setTokens(data.data.accessToken, data.data.refreshToken);
  return data.data.accessToken;
}

const isAuthRoute = (url?: string) =>
  !!url && (url.includes("/auth/refresh") || url.includes("/auth/sign-in"));

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;
    const apiError = toApiError(error);

    // 429(rate limit)는 자동 재시도하지 않는다. 서버 한도가 "분당 10건"이라
    // 창(60초)이 열릴 때까지 몇 초 뒤 재시도해봐야 소용없고, 오히려 남은
    // 예산만 갉아먹는다. 사용자에게 서버 메시지("요청이 너무 많습니다")를 그대로
    // 노출하고, 근본적으로는 요청량 자체를 줄인다(StrictMode 제거 등).

    const shouldRefresh =
      apiError.status === 401 &&
      apiError.code === "UNAUTHORIZED" &&
      !!original &&
      !original._retry &&
      !isAuthRoute(original.url) &&
      !!getRefreshToken();

    if (shouldRefresh && original) {
      original._retry = true;
      try {
        refreshPromise ??= refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
        const newToken = await refreshPromise;
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      } catch {
        // refresh 실패(REFRESH_TOKEN_INVALID 등) → 세션 종료
        emitLogout();
        return Promise.reject(apiError);
      }
    }

    // refresh로도 살릴 수 없는 401 → 세션 종료
    if (apiError.status === 401 && apiError.code === "UNAUTHORIZED") {
      emitLogout();
    }

    return Promise.reject(apiError);
  },
);

/** 성공 응답 봉투에서 `data`만 꺼낸다. 실패 봉투는 ApiError로 던진다. */
export function unwrap<T>(res: { data: ApiResponse<T> }): T {
  if (!res.data.success) {
    throw new ApiError({
      code: res.data.error.code,
      message: res.data.error.message,
      status: 200,
      details: res.data.error.details,
      requestId: res.data.requestId,
    });
  }
  return res.data.data;
}

/** GET 후 봉투를 벗겨 `data`를 반환하는 헬퍼. */
export async function apiGet<T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<T> {
  return unwrap<T>(await api.get<ApiResponse<T>>(url, config));
}

/** POST 후 봉투를 벗겨 `data`를 반환하는 헬퍼. */
export async function apiPost<T>(
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> {
  return unwrap<T>(await api.post<ApiResponse<T>>(url, body, config));
}

/** PATCH 후 봉투를 벗겨 `data`를 반환하는 헬퍼. */
export async function apiPatch<T>(
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> {
  return unwrap<T>(await api.patch<ApiResponse<T>>(url, body, config));
}

/** DELETE 후 봉투를 벗겨 `data`를 반환하는 헬퍼. */
export async function apiDelete<T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<T> {
  return unwrap<T>(await api.delete<ApiResponse<T>>(url, config));
}

const EMPTY_META: PageMeta = { page: 1, size: 0, total: 0, totalPages: 0 };

/**
 * 페이지네이션 목록 GET. `data`(배열)와 `meta`(페이지 정보)를 함께 반환한다.
 * `meta`가 없는 응답은 전체를 1페이지로 간주한다.
 */
export async function apiGetPage<T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<Paginated<T>> {
  const res = await api.get<ApiResponse<T[], PageMeta>>(url, config);
  if (!res.data.success) {
    throw new ApiError({
      code: res.data.error.code,
      message: res.data.error.message,
      status: 200,
      details: res.data.error.details,
      requestId: res.data.requestId,
    });
  }
  const list = res.data.data;
  return {
    data: list,
    meta: res.data.meta ?? { ...EMPTY_META, size: list.length, total: list.length, totalPages: 1 },
  };
}
