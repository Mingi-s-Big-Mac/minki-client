/**
 * 최소 데이터 패칭 훅 (react-query 없이). 로딩·에러·데이터 상태와
 * refetch를 제공하고, 언마운트·연속 호출 시의 경쟁 상태를 막는다.
 */
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { ApiError } from "@/lib/api";

/** 알 수 없는 예외도 화면에서 다루기 쉽도록 ApiError로 정규화. */
export function toApiError(err: unknown): ApiError {
  if (err instanceof ApiError) return err;
  return new ApiError({
    code: "UNKNOWN_ERROR",
    message:
      err instanceof Error ? err.message : "요청을 처리하지 못했어요.",
    status: 0,
  });
}

export interface QueryState<T> {
  data: T | undefined;
  error: ApiError | null;
  loading: boolean;
  /** 다시 불러오기. */
  refetch: () => void;
  /** 로컬에서 데이터를 낙관적으로 갱신(예: 저장/삭제 반영). */
  setData: Dispatch<SetStateAction<T | undefined>>;
}

export interface UseQueryOptions {
  /** false면 자동 실행하지 않는다(수동 refetch 대기). 기본 true. */
  enabled?: boolean;
}

/**
 * `fn`을 실행해 결과를 상태로 노출한다. `deps`가 바뀌면 다시 실행한다.
 * (`fn`은 매 렌더 새로 만들어도 되도록 ref로 최신값을 잡는다.)
 */
export function useQuery<T>(
  fn: () => Promise<T>,
  deps: unknown[],
  options: UseQueryOptions = {},
): QueryState<T> {
  const { enabled = true } = options;
  const [data, setDataState] = useState<T | undefined>(undefined);
  const [error, setError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState<boolean>(enabled);

  const fnRef = useRef(fn);
  fnRef.current = fn;
  // 최신 실행만 상태에 반영하기 위한 세대 카운터.
  const runId = useRef(0);

  const run = useCallback(() => {
    const id = ++runId.current;
    setLoading(true);
    setError(null);
    fnRef
      .current()
      .then((result) => {
        if (id !== runId.current) return;
        setDataState(result);
        setLoading(false);
      })
      .catch((err) => {
        if (id !== runId.current) return;
        setError(toApiError(err));
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }
    run();
    return () => {
      // 진행 중 요청 결과를 무시(언마운트/의존성 변경).
      runId.current++;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, run, ...deps]);

  return { data, error, loading, refetch: run, setData: setDataState };
}

export interface MutationState<Args extends unknown[], T> {
  mutate: (...args: Args) => Promise<T>;
  loading: boolean;
  error: ApiError | null;
}

/**
 * 쓰기 작업(저장/삭제/전송)용 훅. 진행 상태와 에러를 노출하고,
 * 성공/실패 결과는 호출부에서 await로 받아 처리한다.
 */
export function useMutation<Args extends unknown[], T>(
  fn: (...args: Args) => Promise<T>,
): MutationState<Args, T> {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const fnRef = useRef(fn);
  fnRef.current = fn;

  const mutate = useCallback(async (...args: Args) => {
    setLoading(true);
    setError(null);
    try {
      return await fnRef.current(...args);
    } catch (err) {
      const apiErr = toApiError(err);
      setError(apiErr);
      throw apiErr;
    } finally {
      setLoading(false);
    }
  }, []);

  return { mutate, loading, error };
}
