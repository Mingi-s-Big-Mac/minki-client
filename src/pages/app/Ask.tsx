import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ErrorState, Modal, Spinner } from "@/components/ui";
import { Markdown } from "@/components/Markdown";
import { AI_NOT_READY_MESSAGE, isAiNotReady } from "@/features/ai/aiStatus";
import {
  createConversation,
  deleteAllConversations,
  deleteConversation,
  getConversation,
  listConversations,
  sendMessage,
  type ConversationMessage,
} from "@/features/conversations/conversationsApi";
import {
  deriveTitle,
  getConversationTitle,
  removeConversationTitle,
  setConversationTitle,
} from "@/features/conversations/conversationTitles";
import { cn } from "@/lib/cn";
import { useQuery } from "@/lib/useQuery";
import { AppShell } from "./AppShell";

function UserBubble({ text }: { text: string }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[703px] whitespace-pre-wrap rounded-[14px] rounded-br-[2px] bg-primary px-4 pb-[14px] pt-3 text-[14px] text-brand-ink">
        {text}
      </div>
    </div>
  );
}

function AiBubble({
  text,
  sources,
  muted,
}: {
  text: string;
  sources?: string[];
  muted?: boolean;
}) {
  return (
    <div className="flex flex-col items-start gap-2">
      <div
        className={cn(
          "max-w-[727px] rounded-[14px] rounded-bl-[2px] border border-line-strong bg-field px-[17px] pb-[15px] pt-[14px] text-[14px] leading-[1.7]",
          muted
            ? "whitespace-pre-wrap italic text-ink-subtle"
            : "text-porcelain",
        )}
      >
        {muted ? text : <Markdown>{text}</Markdown>}
      </div>
      {sources && sources.length > 0 && (
        <div className="flex w-full max-w-[727px] flex-col gap-[7px] rounded-[10px] border border-line-strong bg-surface px-[15px] py-[11px]">
          <span className="text-[12px] font-bold text-primary">
            출처 보기 ({sources.length})
          </span>
          <ol className="text-[12px] leading-[1.8] text-ink-subtle">
            {sources.map((source, i) => (
              <li key={i}>
                {i + 1}. {source}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

/** 로컬 표시용 메시지(서버 메시지 + 낙관적/시스템 메시지). */
interface LocalMessage extends ConversationMessage {
  /** "AI 준비 중" 같은 안내 메시지 여부. */
  muted?: boolean;
}

/** AI 질의응답 페이지 (Figma node 1:2338). */
export default function Ask() {
  const list = useQuery(() => listConversations(), []);
  const conversations = list.data?.data ?? [];

  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<LocalMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [creating, setCreating] = useState(false);
  // 모바일에서 대화 목록 사이드바를 드로어로 열고 닫는다.
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // 전체 삭제 확인 모달 / 진행 상태.
  const [clearOpen, setClearOpen] = useState(false);
  const [clearing, setClearing] = useState(false);

  // 목록 로드 후 활성 대화가 없으면 첫 대화를 연다.
  useEffect(() => {
    if (activeId == null && conversations.length > 0) {
      setActiveId(conversations[0].id);
    }
  }, [activeId, conversations]);

  // 활성 대화의 메시지 로드.
  const detail = useQuery(() => getConversation(activeId!), [activeId], {
    enabled: !!activeId,
  });
  useEffect(() => {
    if (detail.data) setMessages(detail.data.messages ?? []);
  }, [detail.data]);

  // 버튼을 누르면 바로 대화를 만든다. 제목은 첫 질문을 보낼 때 붙는다.
  async function handleNewConversation() {
    if (creating) return;
    setCreating(true);
    try {
      const created = await createConversation();
      await list.refetch();
      setActiveId(created.id);
      setMessages([]);
      setSidebarOpen(false);
    } catch {
      toast.error("새 대화를 만들지 못했어요.");
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteConversation(id);
      removeConversationTitle(id);
      if (id === activeId) {
        setActiveId(null);
        setMessages([]);
      }
      await list.refetch();
      toast.success("대화를 삭제했어요.");
    } catch {
      toast.error("대화를 삭제하지 못했어요.");
    }
  }

  async function handleClearAll() {
    if (clearing) return;
    setClearing(true);
    try {
      const count = await deleteAllConversations();
      setActiveId(null);
      setMessages([]);
      await list.refetch();
      setClearOpen(false);
      toast.success(
        count > 0 ? `대화 ${count}개를 모두 삭제했어요.` : "삭제할 대화가 없어요.",
      );
    } catch {
      // 일부만 지워졌을 수 있으니 목록을 최신화한다.
      await list.refetch();
      toast.error("전체 삭제 중 문제가 생겼어요. 남은 대화는 다시 시도해주세요.");
    } finally {
      setClearing(false);
    }
  }

  async function send() {
    const content = draft.trim();
    if (!content || sending) return;

    // 이 대화의 첫 질문이면 그걸 제목으로 삼는다.
    const isFirstMessage = messages.length === 0;

    setSending(true);
    setDraft("");

    // 활성 대화가 없으면 생성(본문은 비워 보냄 — 백엔드가 title 필드를 거부해
    // 생성이 실패하지 않도록). 제목은 아래에서 로컬에만 저장한다.
    let conversationId = activeId;
    // 목록이 바뀔 때(새 대화 생성·제목 부여)만 refetch해 요청을 아낀다.
    let listChanged = false;
    if (!conversationId) {
      try {
        const created = await createConversation();
        conversationId = created.id;
        setActiveId(created.id);
        listChanged = true;
      } catch {
        toast.error("대화를 시작하지 못했어요.");
        setDraft(content);
        setSending(false);
        return;
      }
    }

    // 첫 질문이고 아직 제목이 없으면 질문에서 제목을 뽑아 사이드바에 반영한다.
    if (isFirstMessage && !getConversationTitle(conversationId)) {
      setConversationTitle(conversationId, deriveTitle(content));
      listChanged = true;
    }
    if (listChanged) await list.refetch();

    // 유저 메시지 낙관적 표시.
    setMessages((prev) => [...prev, { role: "user", content }]);

    try {
      const reply = await sendMessage(conversationId, content);
      setMessages((prev) => [...prev, reply]);
    } catch (err) {
      if (isAiNotReady(err)) {
        // AI 계약 확정 전 — 안내 메시지로 대체(연동 가이드 3번).
        setMessages((prev) => [
          ...prev,
          { role: "ai", content: AI_NOT_READY_MESSAGE, muted: true },
        ]);
      } else {
        toast.error("답변을 받지 못했어요. 잠시 후 다시 시도해주세요.");
      }
    } finally {
      setSending(false);
    }
  }

  return (
    <AppShell>
      <div className="relative flex h-[calc(100dvh-65px)] items-stretch overflow-hidden">
        {/* 모바일 드로어가 열렸을 때의 배경 오버레이 */}
        {sidebarOpen && (
          <button
            type="button"
            aria-label="대화 목록 닫기"
            onClick={() => setSidebarOpen(false)}
            className="absolute inset-0 z-10 bg-black/50 md:hidden"
          />
        )}

        {/* Conversation history sidebar */}
        <aside
          className={cn(
            "absolute inset-y-0 left-0 z-20 flex w-[280px] shrink-0 flex-col gap-2 border-r border-line bg-surface px-5 py-5 transition-transform duration-200 md:static md:z-auto md:w-[321px] md:translate-x-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <button
            type="button"
            onClick={handleNewConversation}
            disabled={creating}
            className="w-full rounded-sm bg-primary pb-3 pt-[11px] text-center text-[13px] font-bold text-brand-ink transition-colors hover:bg-primary-light disabled:opacity-60"
          >
            + 새 대화
          </button>

          {conversations.length > 0 && (
            <button
              type="button"
              onClick={() => setClearOpen(true)}
              className="mb-[10px] w-full rounded-sm border border-line-outline pb-[9px] pt-2 text-center text-[12px] text-ink-subtle transition-colors hover:border-red-400/60 hover:text-red-400"
            >
              전체 대화 삭제
            </button>
          )}

          {list.loading && (
            <div className="pt-4">
              <Spinner size={18} />
            </div>
          )}
          {list.error && (
            <ErrorState
              message="대화 목록을 불러오지 못했어요."
              onRetry={list.refetch}
            />
          )}
          {!list.loading && !list.error && conversations.length === 0 && (
            <p className="px-1 pt-2 text-[13px] text-ink-muted">
              아직 대화가 없어요. 새 대화를 시작해보세요.
            </p>
          )}

          {conversations.map((conversation) => {
            const active = conversation.id === activeId;
            return (
              <div
                key={conversation.id}
                className={cn(
                  "group flex items-center gap-1 rounded-sm",
                  active ? "bg-chip" : "hover:bg-chip/50",
                )}
              >
                <button
                  type="button"
                  onClick={() => {
                    setActiveId(conversation.id);
                    setSidebarOpen(false);
                  }}
                  className={cn(
                    "min-w-0 flex-1 truncate px-3 pb-3 pt-[11px] text-left text-[13px]",
                    active
                      ? "text-porcelain"
                      : "text-ink-subtle transition-colors group-hover:text-geyser",
                  )}
                >
                  {conversation.title || "새 대화"}
                </button>
                <button
                  type="button"
                  aria-label="대화 삭제"
                  onClick={() => handleDelete(conversation.id)}
                  className="shrink-0 px-2 text-[15px] text-ink-muted transition-colors hover:text-porcelain"
                >
                  ×
                </button>
              </div>
            );
          })}
        </aside>

        {/* Chat column */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* 모바일 전용: 대화 목록 열기 */}
          <div className="flex items-center border-b border-line px-4 py-3 md:hidden">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="flex items-center gap-2 text-[13px] text-geyser transition-colors hover:text-porcelain"
            >
              <span className="text-[15px] leading-none">☰</span> 대화 목록
            </button>
          </div>

          <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-4 py-5 sm:px-9 sm:py-7">
            {detail.loading && activeId ? (
              <div className="flex flex-1 items-center justify-center">
                <Spinner />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-1 items-center justify-center">
                <p className="text-[13px] text-ink-muted">
                  궁금한 진로 질문을 입력해 대화를 시작해보세요.
                </p>
              </div>
            ) : (
              messages.map((message, i) =>
                message.role === "user" ? (
                  <UserBubble key={i} text={message.content} />
                ) : (
                  <AiBubble
                    key={i}
                    text={message.content}
                    sources={message.sources}
                    muted={message.muted}
                  />
                ),
              )
            )}
            {sending && (
              <div className="flex items-center gap-2 text-[13px] text-ink-muted">
                <Spinner size={16} /> 답변 생성 중…
              </div>
            )}
          </div>

          {/* Composer */}
          <div className="flex items-stretch gap-[10px] border-t border-line px-4 pb-5 pt-[21px] sm:px-9">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="궁금한 진로 질문을 입력하세요"
              className="min-w-0 flex-1 rounded-[10px] border border-line-strong bg-field px-[17px] py-[13px] text-[14px] text-porcelain placeholder:text-ink-muted outline-none transition-colors focus:border-primary"
            />
            <button
              type="button"
              onClick={send}
              disabled={sending || !draft.trim()}
              className="rounded-[10px] bg-primary px-[22px] text-[14px] font-bold text-brand-ink transition-colors hover:bg-primary-light disabled:opacity-60"
            >
              전송
            </button>
          </div>
        </div>
      </div>

      <Modal
        open={clearOpen}
        onClose={() => !clearing && setClearOpen(false)}
        labelledBy="clear-all-title"
      >
        <div className="flex flex-col items-center gap-2">
          <h2
            id="clear-all-title"
            className="text-center text-[17px] font-bold text-porcelain"
          >
            모든 대화를 삭제할까요?
          </h2>
          <p className="text-center text-[13px] text-ink-subtle">
            저장된 AI 대화 내역이 전부 삭제되며 되돌릴 수 없어요.
          </p>
          <div className="flex w-full justify-center gap-[10px] pt-4">
            <button
              type="button"
              onClick={handleClearAll}
              disabled={clearing}
              className="flex-1 rounded-sm bg-red-500 py-[13px] text-center text-[13px] font-bold text-white transition-colors hover:bg-red-400 disabled:opacity-60"
            >
              {clearing ? "삭제 중…" : "전체 삭제"}
            </button>
            <button
              type="button"
              onClick={() => setClearOpen(false)}
              disabled={clearing}
              className="flex-1 rounded-sm border border-line-outline py-[13px] text-center text-[13px] font-semibold text-porcelain transition-colors hover:border-ink-subtle disabled:opacity-60"
            >
              취소
            </button>
          </div>
        </div>
      </Modal>
    </AppShell>
  );
}
