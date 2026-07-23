/**
 * Mock 직무 비교 dataset backing the 직무 비교 screen (Figma node 1:2233).
 * Publishing only — no API yet, so the content mirrors the Figma sample data.
 */

export interface CompareCell {
  /** The compared value for this job, e.g. "SQL, Python, 통계분석". */
  value: string;
  /** Attribution line, e.g. "출처: NCS 2024". */
  source: string;
}

export interface CompareRow {
  /** Row label shown in the leading column, e.g. "필요 기술". */
  label: string;
  /** One cell per compared job, in the same order as `compareJobs`. */
  cells: CompareCell[];
}

/** Job column headers, left to right. */
export const compareJobs = ["데이터 분석가", "백엔드 개발자", "AI 엔지니어"] as const;

export const compareRows: CompareRow[] = [
  {
    label: "필요 기술",
    cells: [
      { value: "SQL, Python, 통계분석", source: "출처: NCS 2024" },
      { value: "Java, Spring, DB 설계", source: "출처: NCS 2024" },
      { value: "PyTorch, 딥러닝, MLOps", source: "출처: NCS 2024" },
    ],
  },
  {
    label: "자격증",
    cells: [
      { value: "SQLD, ADsP", source: "출처: 한국산업인력공단" },
      { value: "정보처리기사", source: "출처: 한국산업인력공단" },
      { value: "정보처리기사, ADsP", source: "출처: 한국산업인력공단" },
    ],
  },
  {
    label: "관련 학과",
    cells: [
      { value: "통계학과, 산업공학과", source: "출처: 커리어넷 2024" },
      { value: "컴퓨터공학과", source: "출처: 커리어넷 2024" },
      { value: "컴퓨터공학과, 수학과", source: "출처: 커리어넷 2024" },
    ],
  },
  {
    label: "평균 연봉",
    cells: [
      { value: "3,200~5,600만원", source: "출처: 잡코리아 2024" },
      { value: "3,600~6,200만원", source: "출처: 잡코리아 2024" },
      { value: "4,000~7,000만원", source: "출처: 잡코리아 2024" },
    ],
  },
];
