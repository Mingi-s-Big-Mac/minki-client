/**
 * Mock AI 질의응답 dataset backing the AI 질의응답 screen (Figma node 1:2338).
 * Publishing only — no API yet, so the content mirrors the Figma sample data.
 */

export interface Conversation {
  id: string;
  title: string;
}

/** Conversation history shown in the left sidebar. */
export const conversations: Conversation[] = [
  { id: "cs-career", title: "컴퓨터공학과 진로 질문" },
  { id: "data-analyst", title: "데이터 분석가 준비 방법" },
  { id: "grad-vs-job", title: "대학원 진학 vs 취업" },
];

/** Id of the conversation open by default. */
export const activeConversationId = "cs-career";

export interface ChatMessage {
  role: "user" | "ai";
  text: string;
  /** Cited sources, shown in an attribution box under an AI answer. */
  sources?: string[];
}

/** Messages of the currently open conversation. */
export const messages: ChatMessage[] = [
  {
    role: "user",
    text: "컴퓨터공학과 졸업하면 어떤 직무로 갈 수 있어?",
  },
  {
    role: "ai",
    text: "컴퓨터공학과 졸업생은 주로 백엔드 개발자, 프론트엔드 개발자, 데이터 엔지니어, AI 엔지니어 직무로 진출합니다. NCS 정보기술 직무 분류 기준으로는 소프트웨어개발과 정보보호 직군의 채용 비중이 가장 높습니다.",
    sources: [
      "NCS 2024 국가직무능력표준 — 정보기술 분류체계",
      "워크넷 2024 학과별 진출 직무 통계",
    ],
  },
];
