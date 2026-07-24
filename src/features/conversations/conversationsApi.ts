/**
 * AI 대화(conversations) 엔드포인트 래퍼 (`/api/v1/conversations`).
 *
 * AI가 실제 답변을 주기 시작해, 응답 필드명이 확정 전이라도 화면에 답변이
 * 뜨도록 방어적으로 정규화한다(내용은 content/message/answer/text 중,
 * 출처는 sources/citations/references 중, 전송 응답은 메시지 단건/배열/
 * 래핑 어떤 형태든 마지막 AI 메시지를 뽑아낸다).
 */
import { apiDelete, apiGet, apiGetPage, apiPost } from "@/lib/api";
import type { Paginated } from "@/types/api";

/** 대화 메시지 1건. */
export interface ConversationMessage {
  id?: string;
  /** 화자. 백엔드가 "assistant"/"ai" 중 무엇을 쓸지 확정 전이라 둘 다 허용. */
  role: "user" | "assistant" | "ai";
  content: string;
  /** 인용 출처(AI 답변에 붙을 수 있음). */
  sources?: string[];
  createdAt?: string;
}

/** 좌측 사이드바에 뜨는 대화 목록 카드. */
export interface ConversationSummary {
  id: string;
  title: string;
  updatedAt?: string;
}

/** 대화 상세(메시지 포함). */
export interface ConversationDetail extends ConversationSummary {
  messages: ConversationMessage[];
}

// ── 응답 정규화 ────────────────────────────────────────────────────
interface RawMessage {
  id?: string;
  role?: string;
  sender?: string;
  content?: string | null;
  message?: string | null;
  answer?: string | null;
  text?: string | null;
  // 출처는 문자열 배열이 아니라 인용 메타데이터 객체 배열로 올 수 있다.
  sources?: unknown[];
  citations?: unknown[];
  references?: unknown[];
  createdAt?: string;
}

/**
 * 출처 항목 하나를 표시용 문자열로 만든다. 문자열이면 그대로, 객체면
 * (중첩 `source` 포함) title/name/url/label/quotedText 순으로 라벨을 찾는다.
 * 실제 응답 예: `{ source: {...}, sourceChunk, quotedText, citationNumber, … }`
 */
function sourceLabel(s: unknown): string {
  if (typeof s === "string") return s.trim();
  if (!s || typeof s !== "object") return "";
  const o = s as Record<string, unknown>;
  const pick = (v: unknown): string =>
    typeof v === "string" && v.trim() ? v.trim() : "";

  // 중첩된 source가 문자열이거나 {title,name,url} 객체일 수 있다.
  const nested = o.source;
  if (pick(nested)) return pick(nested);
  if (nested && typeof nested === "object") {
    const n = nested as Record<string, unknown>;
    const label = pick(n.title) || pick(n.name) || pick(n.url) || pick(n.label);
    if (label) return label;
  }
  return (
    pick(o.title) ||
    pick(o.name) ||
    pick(o.url) ||
    pick(o.label) ||
    pick(o.quotedText)
  );
}

/** 출처 배열 → 표시용 문자열 배열(빈 라벨 제거). 없으면 undefined. */
function normalizeSources(raw: unknown): string[] | undefined {
  if (!Array.isArray(raw)) return undefined;
  const out = raw.map(sourceLabel).filter((s) => s.length > 0);
  return out.length > 0 ? out : undefined;
}

interface RawConversation {
  id: string;
  title?: string | null;
  name?: string | null;
  updatedAt?: string;
  messages?: RawMessage[];
  // 전송 응답이 대화 전체가 아니라 답변만 래핑해 줄 때의 후보들.
  reply?: RawMessage;
  aiMessage?: RawMessage;
  data?: RawMessage;
}

/**
 * 화자 문자열 정규화. 백엔드가 대소문자/표기를 어떻게 주든
 * (USER/user/human/me…) 사용자면 "user", 그 외(assistant/ai/bot…)는 "ai".
 */
function normalizeRole(raw?: string): ConversationMessage["role"] {
  const r = (raw ?? "").trim().toLowerCase();
  return r === "user" || r === "human" || r === "me" ? "user" : "ai";
}

/** 원본 메시지 → 화면 메시지. 내용/출처 필드명 변형을 흡수. */
function toMessage(r: RawMessage): ConversationMessage {
  return {
    id: r.id,
    role: normalizeRole(r.role ?? r.sender),
    content: r.content ?? r.message ?? r.answer ?? r.text ?? "",
    sources: normalizeSources(r.sources ?? r.citations ?? r.references),
    createdAt: r.createdAt,
  };
}

function toSummary(r: RawConversation): ConversationSummary {
  return {
    id: r.id,
    title: r.title ?? r.name ?? "새 대화",
    updatedAt: r.updatedAt,
  };
}

function toDetail(r: RawConversation): ConversationDetail {
  return {
    ...toSummary(r),
    messages: (r.messages ?? []).map(toMessage),
  };
}

export async function listConversations(): Promise<
  Paginated<ConversationSummary>
> {
  const page = await apiGetPage<RawConversation>("/conversations");
  return { ...page, data: page.data.map(toSummary) };
}

/** 새 대화 생성. 첫 메시지/제목은 선택. */
export async function createConversation(
  body: { title?: string } = {},
): Promise<ConversationDetail> {
  return toDetail(await apiPost<RawConversation>("/conversations", body));
}

export async function getConversation(id: string): Promise<ConversationDetail> {
  return toDetail(await apiGet<RawConversation>(`/conversations/${id}`));
}

export function deleteConversation(id: string): Promise<unknown> {
  return apiDelete<unknown>(`/conversations/${id}`);
}

/**
 * 모든 대화를 삭제한다. 목록을 반복 조회하며 하나씩 지우고, 삭제 사이에
 * 짧은 간격을 둬 rate limit(429)을 피한다. 삭제한 개수를 반환한다.
 * (429는 api 인터셉터가 Retry-After를 존중해 자동 재시도한다.)
 */
export async function deleteAllConversations(): Promise<number> {
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
  let deleted = 0;
  // guard: 삭제 실패로 목록이 안 줄어도 무한 루프에 빠지지 않도록 상한.
  for (let guard = 0; guard < 100; guard++) {
    const page = await listConversations();
    if (page.data.length === 0) break;
    for (const c of page.data) {
      await deleteConversation(c.id);
      deleted++;
      await sleep(150);
    }
  }
  return deleted;
}

/**
 * 메시지 전송. 성공 시 AI 답변 메시지를 반환한다. 응답이 메시지 단건이든,
 * 대화 전체(messages 배열)든, `reply`/`aiMessage`/`data`로 래핑돼 오든
 * 마지막 AI 메시지를 골라 반환한다.
 */
export async function sendMessage(
  conversationId: string,
  content: string,
): Promise<ConversationMessage> {
  const raw = await apiPost<RawConversation & RawMessage>(
    `/conversations/${conversationId}/messages`,
    { content },
    // AI 답변 생성이 느려 기본 15초 타임아웃으론 끊긴다.
    { timeout: 120_000 },
  );

  // 대화 전체를 돌려준 경우: 마지막 AI 메시지 사용.
  if (Array.isArray(raw.messages) && raw.messages.length > 0) {
    const aiMsgs = raw.messages.filter((m) => normalizeRole(m.role ?? m.sender) !== "user");
    return toMessage(aiMsgs[aiMsgs.length - 1] ?? raw.messages[raw.messages.length - 1]);
  }
  // 답변만 래핑해 준 경우.
  const wrapped = raw.reply ?? raw.aiMessage ?? raw.data;
  if (wrapped) return toMessage(wrapped);
  // 메시지 단건을 그대로 준 경우.
  return toMessage(raw);
}
