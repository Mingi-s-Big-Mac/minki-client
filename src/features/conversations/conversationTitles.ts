/**
 * 로컬 대화 제목 저장 (localStorage 기반).
 *
 * 백엔드가 대화 제목을 저장·반환하는지 확정 전이라, 새 대화를 만들 때 첫 질문에서
 * 뽑은 제목을 클라이언트에도 보관해 사이드바에서 대화를 구분할 수 있게 한다.
 * 서버가 실제 제목을 주면 그쪽을 우선하고, 없을 때만 이 로컬 제목을 폴백으로 쓴다.
 */
const STORAGE_KEY = "minki:conversationTitles";
const MAX_TITLE_LEN = 30;

type TitleMap = Record<string, string>;

function readMap(): TitleMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as TitleMap) : {};
  } catch {
    return {};
  }
}

/** 대화 id의 로컬 제목. 없으면 undefined. */
export function getConversationTitle(id: string): string | undefined {
  const t = readMap()[id];
  return t && t.trim() ? t : undefined;
}

/** 대화 id에 로컬 제목을 저장한다. */
export function setConversationTitle(id: string, title: string): void {
  const t = title.trim();
  if (!t) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...readMap(), [id]: t }));
  } catch {
    /* 저장 실패는 조용히 무시 */
  }
}

/** 저장한 로컬 제목을 지운다(대화 삭제 시 정리용). */
export function removeConversationTitle(id: string): void {
  try {
    const map = readMap();
    if (!(id in map)) return;
    delete map[id];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    /* 무시 */
  }
}

/** 메시지 본문에서 대화 제목을 만든다(한 줄, 최대 {@link MAX_TITLE_LEN}자). */
export function deriveTitle(content: string): string {
  const oneLine = content.trim().replace(/\s+/g, " ");
  return oneLine.length > MAX_TITLE_LEN
    ? `${oneLine.slice(0, MAX_TITLE_LEN)}…`
    : oneLine;
}
