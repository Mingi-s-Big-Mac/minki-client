/**
 * Mock 진로 로드맵 dataset backing the 진로 로드맵 생성 screen (Figma node 1:2396).
 * Publishing only — no API yet, so the content mirrors the Figma sample data.
 */

export interface RoadmapField {
  /** Field label, e.g. "현재 학년". */
  label: string;
  /** Filled-in value, e.g. "대학 2학년". */
  value: string;
}

/** Profile inputs shown in the generator form row. */
export const roadmapProfile: RoadmapField[] = [
  { label: "현재 학년", value: "대학 2학년" },
  { label: "전공", value: "컴퓨터공학과" },
  { label: "관심 직무", value: "백엔드 개발자" },
  { label: "보유 스킬", value: "Java, SQL" },
];

export interface RoadmapStep {
  /** Timeline period, e.g. "2학년 2학기". */
  term: string;
  /** What to do that term. */
  title: string;
  /** Target certification chip, e.g. "정보처리기사" / "없음". */
  tag: string;
  /** Attribution line. */
  source: string;
}

/** Generated roadmap steps, top to bottom. */
export const roadmapSteps: RoadmapStep[] = [
  {
    term: "2학년 2학기",
    title: "자료구조·알고리즘 심화 학습, 정보처리기사 필기 준비",
    tag: "정보처리기사",
    source: "출처: NCS 2024 학습모듈 — 응용SW엔지니어링",
  },
  {
    term: "3학년 1학기",
    title: "Spring 기반 백엔드 프로젝트 수행, 정보처리기사 실기 취득",
    tag: "정보처리기사",
    source: "출처: NCS 2024 학습모듈 — 응용SW엔지니어링",
  },
  {
    term: "4학년 1학기",
    title: "채용연계형 인턴십 지원, 포트폴리오 최종 정리",
    tag: "없음",
    source: "출처: 워크넷 2024 채용동향 리포트",
  },
];
