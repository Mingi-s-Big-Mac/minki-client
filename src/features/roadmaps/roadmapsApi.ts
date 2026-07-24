/**
 * 로드맵(roadmaps) 엔드포인트 래퍼 (`/api/v1/roadmaps`).
 *
 * 실제 응답(2026-07-24 실측): 로드맵은 `semesters`(학기) 배열을 갖고, 각 학기는
 * `title`/`description`과 `items`(할 일 + 출처)를 갖는다. 생성(`POST /roadmaps`)은
 * AI가 시간이 걸려 응답이 느리므로 호출부에서 긴 타임아웃을 준다.
 */
import { apiDelete, apiGet, apiGetPage, apiPost } from "@/lib/api";
import type { Paginated } from "@/types/api";

/** AI 생성은 오래 걸려 기본 15초 타임아웃으론 부족하다. */
const AI_TIMEOUT_MS = 120_000;

/** 학기 안의 할 일 1건. */
export interface RoadmapItem {
  id?: string;
  /** 항목 종류(TASK 등). */
  type?: string;
  title: string;
  description?: string;
  /** 출처 문구(기관 · 제목). */
  source?: string;
}

/** 로드맵 타임라인의 한 학기. */
export interface RoadmapSemester {
  id?: string;
  /** 표시 순서(1부터). */
  order: number;
  /** 학기 제목(예: "1학년 1학기"). */
  title: string;
  description?: string;
  items: RoadmapItem[];
}

/** 로드맵 목록 카드. */
export interface RoadmapSummary {
  id: string;
  /** 목표 직업/제목. */
  title: string;
  createdAt?: string;
}

/** 로드맵 상세(학기별 할 일 포함). */
export interface RoadmapDetail extends RoadmapSummary {
  semesters: RoadmapSemester[];
}

/** 로드맵 생성 입력. */
export interface CreateRoadmapBody {
  grade: number;
  major: string;
  targetOccupationId: string;
  currentSkillIds: string[];
}

// ── 응답 정규화 ────────────────────────────────────────────────────
interface RawSource {
  organization?: string | null;
  title?: string | null;
  url?: string | null;
}

interface RawRoadmapItem {
  id?: string;
  type?: string;
  title?: string | null;
  description?: string | null;
  source?: RawSource | null;
}

interface RawSemester {
  id?: string;
  semesterOrder?: number;
  title?: string | null;
  description?: string | null;
  items?: RawRoadmapItem[];
}

interface RawRoadmap {
  id: string;
  title?: string | null;
  name?: string | null;
  targetOccupation?: { name?: string } | null;
  createdAt?: string;
  created_at?: string;
  semesters?: RawSemester[];
}

/** 출처 객체 → 표시 문구("기관 — 제목" / 제목 / 기관 / url). */
function sourceLabel(s?: RawSource | null): string | undefined {
  if (!s) return undefined;
  const org = s.organization?.trim();
  const title = s.title?.trim();
  if (org && title) return `${org} — ${title}`;
  return title || org || s.url?.trim() || undefined;
}

function toItem(r: RawRoadmapItem): RoadmapItem {
  return {
    id: r.id,
    type: r.type,
    title: r.title ?? "",
    description: r.description ?? undefined,
    source: sourceLabel(r.source),
  };
}

function toSemester(r: RawSemester, idx: number): RoadmapSemester {
  return {
    id: r.id,
    order: r.semesterOrder ?? idx + 1,
    title: r.title ?? `${idx + 1}단계`,
    description: r.description ?? undefined,
    items: (r.items ?? []).map(toItem),
  };
}

function toRoadmapSummary(r: RawRoadmap): RoadmapSummary {
  return {
    id: r.id,
    title: r.title ?? r.name ?? r.targetOccupation?.name ?? "로드맵",
    createdAt: r.createdAt ?? r.created_at,
  };
}

function toRoadmapDetail(r: RawRoadmap): RoadmapDetail {
  const semesters = (r.semesters ?? [])
    .map(toSemester)
    .sort((a, b) => a.order - b.order);
  return { ...toRoadmapSummary(r), semesters };
}

export async function listRoadmaps(): Promise<Paginated<RoadmapSummary>> {
  const page = await apiGetPage<RawRoadmap>("/roadmaps");
  return { ...page, data: page.data.map(toRoadmapSummary) };
}

export async function getRoadmap(id: string): Promise<RoadmapDetail> {
  return toRoadmapDetail(await apiGet<RawRoadmap>(`/roadmaps/${id}`));
}

/** 로드맵 생성. AI 생성이 느려 긴 타임아웃으로 호출한다. */
export async function createRoadmap(
  body: CreateRoadmapBody,
): Promise<RoadmapDetail> {
  return toRoadmapDetail(
    await apiPost<RawRoadmap>("/roadmaps", body, { timeout: AI_TIMEOUT_MS }),
  );
}

export function deleteRoadmap(id: string): Promise<unknown> {
  return apiDelete<unknown>(`/roadmaps/${id}`);
}
