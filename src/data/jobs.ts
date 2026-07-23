/**
 * Mock job (직무) dataset backing the 진로 검색 / 직무 상세 / 관심 직무 screens.
 * Publishing only — no API yet, so the content mirrors the Figma sample data.
 */

export interface JobSourceGroup {
  /** Card title, e.g. "필요 기술". */
  title: string;
  /** Tag chips shown under the title. */
  items: string[];
  /** Attribution line, e.g. "출처: NCS 2024 …". */
  source: string;
}

export interface JobSalary {
  min: number;
  max: number;
  /** Fill start/end as a percentage of the track (0–100). */
  from: number;
  to: number;
  source: string;
}

export interface Job {
  id: string;
  title: string;
  /** Data-origin badge, e.g. "NCS 2024" / "워크넷 2024". */
  badge: string;
  /** Skills shown as chips on the search result card. */
  skills: string[];
  /** One-line related-certification summary on the search result card. */
  certSummary: string;
  /** Long description shown on the detail page. */
  description: string;
  /** Grouped, sourced facts shown on the detail page. */
  groups: {
    skills: JobSourceGroup;
    certs: JobSourceGroup;
    majors: JobSourceGroup;
  };
  salary: JobSalary;
}

export const jobs: Job[] = [
  {
    id: "data-analyst",
    title: "데이터 분석가",
    badge: "NCS 2024",
    skills: ["SQL", "Python", "통계분석"],
    certSummary: "SQLD, ADsP, 사회조사분석사 2급",
    description:
      "기업의 데이터를 수집·가공하여 인사이트를 도출하고, 의사결정에 필요한 지표와 리포트를 설계하는 직무입니다.",
    groups: {
      skills: {
        title: "필요 기술",
        items: ["SQL", "Python", "통계분석", "데이터 시각화"],
        source: "출처: NCS 2024 국가직무능력표준 — 정보기술 분류체계",
      },
      certs: {
        title: "관련 자격증",
        items: ["SQLD", "ADsP", "사회조사분석사 2급"],
        source: "출처: 한국산업인력공단 자격정보서비스 2024",
      },
      majors: {
        title: "관련 학과",
        items: ["통계학과", "산업공학과", "컴퓨터공학과"],
        source: "출처: 커리어넷 학과정보 2024",
      },
    },
    salary: {
      min: 3200,
      max: 5600,
      from: 22,
      to: 70,
      source: "출처: 잡코리아 2024 연봉 리포트 (단위: 만원)",
    },
  },
  {
    id: "backend-developer",
    title: "백엔드 개발자",
    badge: "NCS 2024",
    skills: ["Java", "Spring", "DB 설계"],
    certSummary: "정보처리기사",
    description:
      "서버와 데이터베이스를 설계·구현하여 안정적인 서비스 로직과 API를 제공하는 직무입니다.",
    groups: {
      skills: {
        title: "필요 기술",
        items: ["Java", "Spring", "DB 설계", "REST API"],
        source: "출처: NCS 2024 국가직무능력표준 — 정보기술 분류체계",
      },
      certs: {
        title: "관련 자격증",
        items: ["정보처리기사", "SQLD"],
        source: "출처: 한국산업인력공단 자격정보서비스 2024",
      },
      majors: {
        title: "관련 학과",
        items: ["컴퓨터공학과", "소프트웨어학과", "정보통신공학과"],
        source: "출처: 커리어넷 학과정보 2024",
      },
    },
    salary: {
      min: 3400,
      max: 6000,
      from: 25,
      to: 75,
      source: "출처: 잡코리아 2024 연봉 리포트 (단위: 만원)",
    },
  },
  {
    id: "uxui-designer",
    title: "UX/UI 디자이너",
    badge: "워크넷 2024",
    skills: ["Figma", "사용자 리서치"],
    certSummary: "GTQ, 웹디자인기능사",
    description:
      "사용자 경험을 설계하고 인터페이스를 시각화하여 제품의 사용성과 완성도를 높이는 직무입니다.",
    groups: {
      skills: {
        title: "필요 기술",
        items: ["Figma", "사용자 리서치", "프로토타이핑", "인터랙션 디자인"],
        source: "출처: 워크넷 2024 직업정보",
      },
      certs: {
        title: "관련 자격증",
        items: ["GTQ", "웹디자인기능사", "컬러리스트기사"],
        source: "출처: 한국산업인력공단 자격정보서비스 2024",
      },
      majors: {
        title: "관련 학과",
        items: ["시각디자인학과", "산업디자인학과", "HCI학과"],
        source: "출처: 커리어넷 학과정보 2024",
      },
    },
    salary: {
      min: 3000,
      max: 5200,
      from: 18,
      to: 67,
      source: "출처: 잡코리아 2024 연봉 리포트 (단위: 만원)",
    },
  },
];

export function getJob(id: string | undefined): Job {
  return jobs.find((job) => job.id === id) ?? jobs[0];
}

/** 관심 직무로 저장된 목록 (저장 날짜 포함). */
export interface SavedJob {
  id: string;
  title: string;
  savedAt: string;
}

export const savedJobs: SavedJob[] = [
  { id: "data-analyst", title: "데이터 분석가", savedAt: "2026.07.20 저장" },
  { id: "backend-developer", title: "백엔드 개발자", savedAt: "2026.07.18 저장" },
  { id: "uxui-designer", title: "UX/UI 디자이너", savedAt: "2026.07.12 저장" },
  { id: "product-manager", title: "프로덕트 매니저", savedAt: "2026.07.05 저장" },
];
