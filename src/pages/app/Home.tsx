import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { IconChat, IconRoadmap, IconSearch } from "@/components/brand";
import { ErrorState, LoadingState } from "@/components/ui";
import { useAuth } from "@/features/auth";
import { getDashboard } from "@/features/dashboard/dashboardApi";
import { formatDate } from "@/lib/format";
import { useQuery } from "@/lib/useQuery";
import { AppShell } from "./AppShell";

interface ActionCardProps {
  icon: ReactNode;
  title: string;
  desc: string;
}

/** 탐색 유도용 추천 키워드. 검색 페이지로 바로 넘겨 추가 API 호출은 없다. */
const POPULAR_KEYWORDS = [
  "소프트웨어 개발",
  "데이터 분석",
  "UX/UI 디자인",
  "인공지능",
  "디지털 마케팅",
  "회계·재무",
  "생명공학",
  "전기·전자",
];

function actionCardClass() {
  return "flex flex-col items-start gap-1 rounded-[14px] border border-line-strong bg-surface p-[23px] text-left transition-colors hover:border-ink-subtle";
}

function ActionCardBody({ icon, title, desc }: ActionCardProps) {
  return (
    <>
      {icon}
      <h3 className="pt-3 text-[15px] font-semibold text-porcelain">{title}</h3>
      <p className="text-[12px] text-ink-subtle">{desc}</p>
    </>
  );
}

/** 로그인 후 메인 홈 (Figma node 1:1875). 대시보드 API 연동. */
export default function Home() {
  const { user } = useAuth();
  const { data, loading, error, refetch } = useQuery(() => getDashboard(), []);

  const nickname = data?.nickname ?? user?.nickname ?? "";
  const recentSearches = data?.recentSearches ?? [];
  const savedOccupations = data?.savedOccupations ?? [];

  return (
    <AppShell>
      <div className="flex flex-col px-5 py-7 sm:px-10 sm:py-9">
        <h1 className="text-[22px] font-bold text-porcelain">
          안녕하세요, {nickname}님
        </h1>
        <p className="pt-1 text-[13px] text-ink-subtle">
          오늘도 목표를 향해 한 걸음 나아가볼까요?
        </p>

        {/* Quick actions */}
        <div className="grid grid-cols-1 gap-[18px] pt-6 md:grid-cols-3">
          <Link to="/search" className={actionCardClass()}>
            <ActionCardBody
              icon={<IconSearch size={24} />}
              title="진로 검색"
              desc="직무·자격증·학과별 정보 탐색"
            />
          </Link>
          <Link to="/ask" className={actionCardClass()}>
            <ActionCardBody
              icon={<IconChat size={24} />}
              title="AI에게 질문하기"
              desc="궁금한 진로 질문, 바로 답변 받기"
            />
          </Link>
          <Link to="/roadmap" className={actionCardClass()}>
            <ActionCardBody
              icon={<IconRoadmap size={24} />}
              title="내 로드맵 보기"
              desc="생성한 진로 로드맵 확인"
            />
          </Link>
        </div>

        {loading && <LoadingState />}
        {error && (
          <ErrorState message="대시보드를 불러오지 못했어요." onRetry={refetch} />
        )}

        {/* Recent + saved */}
        {!loading && !error && (
          <div className="grid grid-cols-1 gap-[18px] pt-7 md:grid-cols-2">
            <section className="flex flex-col gap-[14px] rounded-[14px] border border-line-strong bg-surface p-[23px]">
              <h2 className="text-[14px] font-semibold text-porcelain">
                최근 검색 기록
              </h2>
              {recentSearches.length === 0 ? (
                <p className="py-2 text-[13px] text-ink-muted">
                  아직 검색 기록이 없어요.
                </p>
              ) : (
                <ul className="flex flex-col gap-[10px]">
                  {recentSearches.map((item, i) => (
                    <li
                      key={`${item.keyword}-${i}`}
                      className="flex items-center justify-between gap-4"
                    >
                      <Link
                        to={`/search?query=${encodeURIComponent(item.keyword)}`}
                        className="text-[13px] text-geyser transition-colors hover:text-porcelain"
                      >
                        {item.keyword}
                      </Link>
                      <span className="text-[13px] text-ink-muted">
                        {formatDate(item.searchedAt)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="flex flex-col gap-[14px] rounded-[14px] border border-line-strong bg-surface p-[23px]">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-[14px] font-semibold text-porcelain">
                  저장한 관심 직무
                </h2>
                <Link
                  to="/saved"
                  className="text-[12px] text-primary transition-colors hover:text-primary-light"
                >
                  전체보기
                </Link>
              </div>
              {savedOccupations.length === 0 ? (
                <p className="py-2 text-[13px] text-ink-muted">
                  저장한 관심 직무가 없어요.
                </p>
              ) : (
                <ul className="flex flex-col gap-[10px]">
                  {savedOccupations.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center justify-between gap-4"
                    >
                      <Link
                        to={`/jobs/${item.id}`}
                        className="text-[13px] text-geyser transition-colors hover:text-porcelain"
                      >
                        {item.title}
                      </Link>
                      <span className="text-[13px] text-ink-muted">
                        {formatDate(item.savedAt)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        )}

        {/* 인기 키워드 (정적 탐색 유도 — 추가 API 없음) */}
        <section className="mt-7 flex flex-col gap-[14px] rounded-[14px] border border-line-strong bg-surface p-[23px]">
          <h2 className="text-[14px] font-semibold text-porcelain">
            이런 키워드로 찾아보세요
          </h2>
          <div className="flex flex-wrap gap-2">
            {POPULAR_KEYWORDS.map((keyword) => (
              <Link
                key={keyword}
                to={`/search?query=${encodeURIComponent(keyword)}`}
                className="rounded-full border border-line-strong px-3.5 py-1.5 text-[13px] text-geyser transition-colors hover:border-ink-subtle hover:text-porcelain"
              >
                {keyword}
              </Link>
            ))}
          </div>
        </section>

        {/* 로드맵 생성 유도 배너 */}
        <section className="mt-[18px] flex flex-col items-start gap-4 rounded-[14px] border border-primary/30 bg-primary/5 p-[23px] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <h2 className="text-[15px] font-semibold text-porcelain">
              나만의 진로 로드맵을 만들어보세요
            </h2>
            <p className="text-[13px] text-ink-subtle">
              학년·전공·목표를 입력하면 학기별 실행 계획을 제안해드려요.
            </p>
          </div>
          <Link
            to="/roadmap"
            className="shrink-0 rounded-[9px] bg-primary px-[22px] py-2.5 text-[13px] font-bold text-brand-ink transition-colors hover:bg-primary-light"
          >
            로드맵 만들기
          </Link>
        </section>
      </div>
    </AppShell>
  );
}
