import { useState } from "react";
import { toast } from "sonner";
import {
  activeConversationId,
  conversations,
  messages,
  type ChatMessage,
} from "@/data/ask";
import { AppShell } from "./AppShell";

function UserBubble({ text }: { text: string }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[703px] rounded-[14px] rounded-br-[2px] bg-primary px-4 pb-[14px] pt-3 text-[14px] text-brand-ink">
        {text}
      </div>
    </div>
  );
}

function AiBubble({ text, sources }: { text: string; sources?: string[] }) {
  return (
    <div className="flex flex-col items-start gap-2">
      <div className="max-w-[727px] rounded-[14px] rounded-bl-[2px] border border-line-strong bg-field px-[17px] pb-[15px] pt-[14px] text-[14px] leading-[1.7] text-porcelain">
        {text}
      </div>
      {sources && (
        <div className="flex w-full max-w-[727px] flex-col gap-[7px] rounded-[10px] border border-line-strong bg-surface px-[15px] py-[11px]">
          <span className="text-[12px] font-bold text-primary">
            출처 보기 ({sources.length})
          </span>
          <ol className="text-[12px] leading-[1.8] text-ink-subtle">
            {sources.map((source, i) => (
              <li key={source}>
                {i + 1}. {source}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

/** AI 질의응답 페이지 (Figma node 1:2338). */
export default function Ask() {
  const [activeId, setActiveId] = useState(activeConversationId);
  const [draft, setDraft] = useState("");

  function send() {
    if (!draft.trim()) return;
    toast("AI 응답은 준비 중이에요.");
    setDraft("");
  }

  return (
    <AppShell>
      <div className="flex h-[760px] items-stretch">
        {/* Conversation history sidebar */}
        <aside className="flex w-[321px] shrink-0 flex-col gap-2 border-r border-line bg-surface px-5 py-5">
          <button
            type="button"
            onClick={() => toast("새 대화는 준비 중이에요.")}
            className="mb-[10px] w-full rounded-sm bg-primary pb-3 pt-[11px] text-center text-[13px] font-bold text-brand-ink transition-colors hover:bg-primary-light"
          >
            + 새 대화
          </button>
          {conversations.map((conversation) => {
            const active = conversation.id === activeId;
            return (
              <button
                key={conversation.id}
                type="button"
                onClick={() => setActiveId(conversation.id)}
                className={
                  active
                    ? "w-full rounded-sm bg-chip px-3 pb-3 pt-[11px] text-left text-[13px] text-porcelain"
                    : "w-full rounded-sm px-3 pb-3 pt-[11px] text-left text-[13px] text-ink-subtle transition-colors hover:text-geyser"
                }
              >
                {conversation.title}
              </button>
            );
          })}
        </aside>

        {/* Chat column */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-9 py-7">
            {messages.map((message: ChatMessage, i) =>
              message.role === "user" ? (
                <UserBubble key={i} text={message.text} />
              ) : (
                <AiBubble key={i} text={message.text} sources={message.sources} />
              ),
            )}
          </div>

          {/* Composer */}
          <div className="flex items-stretch gap-[10px] border-t border-line px-9 pb-5 pt-[21px]">
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
              className="rounded-[10px] bg-primary px-[22px] text-[14px] font-bold text-brand-ink transition-colors hover:bg-primary-light"
            >
              전송
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
