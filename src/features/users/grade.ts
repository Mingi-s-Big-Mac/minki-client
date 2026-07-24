/**
 * 학년(`grade`) 정수 인코딩 ↔ 라벨 매핑. 회원가입·마이페이지가 공유한다.
 * (백엔드가 grade 정수 의미를 확정하면 이 표만 맞추면 된다.)
 */
export const GRADE_OPTIONS = [
  { label: "고3", value: 1 },
  { label: "대학 1학년", value: 2 },
  { label: "대학 2학년", value: 3 },
  { label: "대학 3학년", value: 4 },
  { label: "대학 4학년", value: 5 },
] as const;

/** grade 정수를 사람이 읽는 라벨로. 미지의 값은 "{n}학년"으로 대체. */
export function gradeLabel(grade: number | null | undefined): string {
  if (grade == null) return "-";
  const found = GRADE_OPTIONS.find((g) => g.value === grade);
  return found ? found.label : `${grade}학년`;
}
