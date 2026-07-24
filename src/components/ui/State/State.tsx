import type { ReactNode } from "react";

/** 공용 로딩/빈/에러 상태 블록. 카드·리스트 영역에 공통으로 쓴다. */

function Wrap({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      {children}
    </div>
  );
}

/** 회전 스피너. */
export function Spinner({ size = 22 }: { size?: number }) {
  return (
    <span
      role="status"
      aria-label="불러오는 중"
      className="inline-block animate-spin rounded-full border-2 border-line-strong border-t-primary"
      style={{ width: size, height: size }}
    />
  );
}

export function LoadingState({ label = "불러오는 중…" }: { label?: string }) {
  return (
    <Wrap>
      <Spinner />
      <p className="text-[13px] text-ink-subtle">{label}</p>
    </Wrap>
  );
}

export function ErrorState({
  message = "정보를 불러오지 못했어요.",
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <Wrap>
      <p className="text-[13px] text-ink-subtle">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-sm border border-line-outline px-[15px] py-[8px] text-[12px] font-semibold text-porcelain transition-colors hover:border-ink-subtle"
        >
          다시 시도
        </button>
      )}
    </Wrap>
  );
}

export function EmptyState({
  message = "표시할 내용이 없어요.",
  action,
}: {
  message?: string;
  action?: ReactNode;
}) {
  return (
    <Wrap>
      <p className="text-[13px] text-ink-subtle">{message}</p>
      {action}
    </Wrap>
  );
}
