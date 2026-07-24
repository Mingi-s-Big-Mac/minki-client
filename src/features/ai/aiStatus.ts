/**
 * AI 연동 공통 상태 유틸.
 *
 * 로드맵 생성(`POST /roadmaps`)과 대화 메시지 전송
 * (`POST /conversations/:id/messages`)은 AI 서버 계약이 확정되기 전까지
 * 항상 503으로 실패한다(연동 가이드 3번). 이 두 코드를 잡아 "준비 중" UI로
 * 안내하고, 그 밖의 에러는 일반 에러로 처리한다.
 */
import { ApiError } from "@/lib/api";

/**
 * AI 서버가 아직 붙지 않아 기능이 준비 중임을 뜻하는 코드.
 * (AI provider 스텁 상태라 호출 시 이 코드들로 503이 난다.)
 */
export const AI_NOT_READY_CODES = [
  "AI_SERVICE_CONTRACT_UNDEFINED",
  "AI_SERVICE_NOT_CONFIGURED",
  "AI_RESPONSE_FAILED",
] as const;

/** 해당 에러가 "AI 준비 중" 케이스인지 판별. */
export function isAiNotReady(error: unknown): boolean {
  return (
    error instanceof ApiError &&
    (AI_NOT_READY_CODES as readonly string[]).includes(error.code)
  );
}

/** "AI 준비 중" 안내 문구. */
export const AI_NOT_READY_MESSAGE =
  "AI 기능을 준비 중이에요. 곧 실제 답변을 제공할게요.";
