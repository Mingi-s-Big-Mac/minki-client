import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { IconChat, IconRoadmap, IconSearch } from "@/components/brand";
import { AppShell } from "./AppShell";

const recentSearches = [
  { label: "백엔드 개발자", when: "3시간 전" },
  { label: "데이터 분석가", when: "어제" },
  { label: "SQLD 자격증", when: "3일 전" },
];

const savedJobs = [
  { label: "UX/UI 디자이너", when: "2026.07.20 저장" },
  { label: "프로덕트 매니저", when: "2026.07.18 저장" },
  { label: "AI 엔지니어", when: "2026.07.12 저장" },
];

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

/** 로그인 후 메인 홈 (Figma node 1:1875). */
export default function Home() {
  return (
    <AppShell>
      <div className="flex flex-col px-10 py-9">
        <h1 className="text-[22px] font-bold text-porcelain">
          안녕하세요, 김도윤님
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

        {/* Recent + saved */}
        <div className="grid grid-cols-1 gap-[18px] pt-7 md:grid-cols-2">
          <section className="flex flex-col gap-[14px] rounded-[14px] border border-line-strong bg-surface p-[23px]">
            <h2 className="text-[14px] font-semibold text-porcelain">
              최근 검색 기록
            </h2>
            <ul className="flex flex-col gap-[10px]">
              {recentSearches.map((item) => (
                <li
                  key={item.label}
                  className="flex items-center justify-between gap-4"
                >
                  <span className="text-[13px] text-geyser">{item.label}</span>
                  <span className="text-[13px] text-ink-muted">{item.when}</span>
                </li>
              ))}
            </ul>
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
            <ul className="flex flex-col gap-[10px]">
              {savedJobs.map((item) => (
                <li
                  key={item.label}
                  className="flex items-center justify-between gap-4"
                >
                  <span className="text-[13px] text-geyser">{item.label}</span>
                  <span className="text-[13px] text-ink-muted">{item.when}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
