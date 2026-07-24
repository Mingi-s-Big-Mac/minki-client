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
      </div>
    </AppShell>
  );
}
