/**
 * 카탈로그(필터용 사전 데이터) 엔드포인트 래퍼 (`/api/v1/catalog/*`).
 *
 * ⚠️ 아이템 타입은 `{ id, name }`으로 추론. 실제 응답과 다르면 타입만 교정.
 */
import { apiGetPage } from "@/lib/api";
import type { Paginated } from "@/types/api";

export interface CatalogItem {
  id: string;
  name: string;
}

export function listCategories(): Promise<Paginated<CatalogItem>> {
  return apiGetPage<CatalogItem>("/catalog/categories");
}

export function listSkills(): Promise<Paginated<CatalogItem>> {
  return apiGetPage<CatalogItem>("/catalog/skills");
}

export function listQualifications(): Promise<Paginated<CatalogItem>> {
  return apiGetPage<CatalogItem>("/catalog/qualifications");
}

export function listMajors(): Promise<Paginated<CatalogItem>> {
  return apiGetPage<CatalogItem>("/catalog/majors");
}
