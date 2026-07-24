/** 표시용 포맷 유틸. 응답 필드가 ISO일 수도, 이미 사람이 읽는 문자열일 수도 있어 방어적으로 처리한다. */

/** ISO 날짜/시각 문자열을 "YYYY.MM.DD"로. 파싱 불가하면 원문 그대로 반환. */
export function formatDate(value: string | null | undefined): string {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
}

/** 만원 단위 정수를 "3,200"처럼 천단위 콤마로. */
export function formatNumber(value: number): string {
  return value.toLocaleString("ko-KR");
}
