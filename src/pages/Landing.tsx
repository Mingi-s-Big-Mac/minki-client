import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  BrandWordmark,
  IconChat,
  IconRoadmap,
  IconSearch,
} from "@/components/brand";
import { cn } from "@/lib/cn";

const features = [
  {
    icon: <IconSearch />,
    title: "진로 검색",
    desc: "직무·기술·자격증·학과 기준으로 검증된 직무 정보를 검색하세요.",
  },
  {
    icon: <IconChat />,
    title: "AI 질의응답",
    desc: "궁금한 진로 질문에 출처와 함께 즉시 답변을 받아보세요.",
  },
  {
    icon: <IconRoadmap />,
    title: "로드맵 생성",
    desc: "학년·전공·목표에 맞춘 나만의 진로 로드맵을 만들어보세요.",
  },
];

/** 데이터 근거 출처(신뢰 스트립). */
const dataSources = [
  "NCS 국가직무능력표준",
  "워크넷",
  "커리어넷",
  "공공데이터포털",
];

/** 이용 흐름 3단계. */
const steps = [
  {
    n: "01",
    title: "검색하거나 질문하기",
    desc: "직무·기술·자격증·학과로 검색하고, 궁금한 건 AI에게 바로 물어보세요.",
  },
  {
    n: "02",
    title: "근거와 함께 확인하기",
    desc: "모든 정보에 NCS·공공데이터 출처가 붙어 신뢰할 수 있어요.",
  },
  {
    n: "03",
    title: "나만의 로드맵 만들기",
    desc: "학년·전공·목표에 맞춰 학기별 실행 계획을 제안받으세요.",
  },
];

/** 소개 섹션의 핵심 가치 지표. */
const aboutValues = [
  { value: "출처 100%", label: "모든 답변에 근거 자료 제공" },
  { value: "NCS 기반", label: "국가직무능력표준·공공데이터 활용" },
  { value: "대학생 특화", label: "학년·전공·목표 맞춤 로드맵" },
];

/**
 * 스크롤로 뷰포트에 들어오면 페이드업으로 나타나는 래퍼.
 * IntersectionObserver가 없거나 모션 최소화 설정이면 즉시 표시한다.
 */
function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700 ease-out motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0",
        shown ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
        className,
      )}
      style={{ transitionDelay: shown ? `${delay}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}

/** 섹션 상단 라벨 + 제목 묶음. */
function SectionHeading({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <span className="rounded-full bg-primary/10 px-3.5 py-[7px] text-xs font-bold text-primary">
        {eyebrow}
      </span>
      <h2
        className="text-[26px] font-bold leading-[1.35] text-porcelain sm:text-[32px]"
        style={{ letterSpacing: "-0.5px" }}
      >
        {title}
      </h2>
    </div>
  );
}

export default function Landing() {
  return (
    <div className="min-h-full w-full bg-canvas text-porcelain">
      {/* Header (내비게이션 링크 없이 브랜드 + 인증 버튼만) */}
      <header className="sticky top-0 z-50 border-b border-line bg-canvas/80 backdrop-blur">
        <div className="mx-auto flex h-[65px] w-full max-w-[1240px] items-center justify-between px-5 sm:px-10">
          <Link to="/" aria-label="민기 홈">
            <BrandWordmark size={24} textSize={17} />
          </Link>

          <div className="flex items-center gap-2.5">
            <Link
              to="/login"
              className="rounded-sm border border-line-outline px-[17px] py-2.5 text-[13px] font-semibold text-porcelain transition-colors hover:border-ink-subtle"
            >
              로그인
            </Link>
            <Link
              to="/signup"
              className="rounded-sm bg-primary px-4 py-2.5 text-[13px] font-bold text-brand-ink transition-colors hover:bg-primary-light"
            >
              시작하기
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section
        className="flex min-h-[calc(100svh-65px)] flex-col items-center justify-center gap-[18px] px-5 py-16 text-center sm:px-10 sm:py-[90px]"
        style={{
          backgroundImage:
            "radial-gradient(60% 90% at 50% 0%, rgba(78,205,196,0.08), rgba(78,205,196,0) 60%)",
        }}
      >
        <Reveal className="flex flex-col items-center gap-[18px]">
          <span className="rounded-full bg-primary/10 px-3.5 py-[7px] text-xs font-bold text-primary">
            NCS · 공공데이터 기반
          </span>

          <h1
            className="text-[32px] font-bold leading-[1.25] text-porcelain sm:text-[44px] sm:leading-[1.3]"
            style={{ letterSpacing: "-1px" }}
          >
            모든 답변에
            <br />
            출처가 있습니다
          </h1>

          <p
            className="max-w-[520px] text-[15px] text-ink-subtle"
            style={{ lineHeight: "25.5px" }}
          >
            국가직무능력표준(NCS)과 공공 데이터를 기반으로, 근거 있는 진로·전공
            정보를 제공하는 대학생 전용 커리어 플랫폼입니다.
          </p>

          <div className="flex items-start gap-3 pt-2">
            <Link
              to="/signup"
              className="rounded-[9px] bg-primary px-[26px] py-3 text-[14px] font-bold text-brand-ink transition-colors hover:bg-primary-light"
            >
              시작하기
            </Link>
            <Link
              to="/login"
              className="rounded-[9px] border border-line-outline px-[27px] py-[13px] text-[14px] font-semibold text-porcelain transition-colors hover:border-ink-subtle"
            >
              로그인
            </Link>
          </div>
        </Reveal>
      </section>

      {/* Data source strip */}
      <section className="border-y border-line px-5 py-9 sm:px-10">
        <Reveal className="mx-auto flex w-full max-w-[1240px] flex-col items-center gap-4">
          <span className="text-[12px] text-ink-muted">
            이런 공공 데이터를 근거로 합니다
          </span>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[14px] font-semibold text-geyser">
            {dataSources.map((src) => (
              <span key={src}>{src}</span>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Features */}
      <section className="px-5 py-16 sm:px-10 sm:py-[90px]">
        <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-12">
          <Reveal>
            <SectionHeading
              eyebrow="핵심 기능"
              title="진로 탐색에 필요한 모든 것"
            />
          </Reveal>
          <div className="flex flex-col justify-center gap-5 md:flex-row md:items-stretch">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={i * 120} className="flex flex-1">
                <div className="flex flex-1 flex-col items-start gap-[7px] rounded-2xl border border-line-strong bg-surface p-[29px] transition-colors hover:border-ink-subtle">
                  {f.icon}
                  <h3 className="pt-[15px] text-[17px] font-semibold text-porcelain">
                    {f.title}
                  </h3>
                  <p
                    className="text-[13px] text-ink-subtle"
                    style={{ lineHeight: "22.1px" }}
                  >
                    {f.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-line px-5 py-16 sm:px-10 sm:py-[90px]">
        <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-12">
          <Reveal>
            <SectionHeading eyebrow="이용 방법" title="세 단계면 충분해요" />
          </Reveal>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 120} className="flex">
                <div className="flex flex-1 flex-col gap-3 rounded-2xl border border-line-strong bg-surface p-[29px]">
                  <span className="text-[26px] font-bold text-primary">
                    {s.n}
                  </span>
                  <h3 className="text-[16px] font-semibold text-porcelain">
                    {s.title}
                  </h3>
                  <p
                    className="text-[13px] text-ink-subtle"
                    style={{ lineHeight: "22.1px" }}
                  >
                    {s.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="border-t border-line px-5 py-16 sm:px-10 sm:py-[90px]">
        <Reveal className="mx-auto flex w-full max-w-[760px] flex-col items-center gap-5 text-center">
          <SectionHeading
            eyebrow="민기 소개"
            title="진로 정보에도 근거가 필요합니다"
          />
          <p className="text-[15px] text-ink-subtle" style={{ lineHeight: "26px" }}>
            민기는 국가직무능력표준(NCS)과 공공 데이터를 바탕으로, 검증된 진로·전공
            정보를 대학생에게 제공하는 커리어 플랫폼입니다. 출처 없는 조언 대신,
            근거를 함께 확인할 수 있는 정보를 지향합니다.
          </p>

          <div className="grid w-full grid-cols-1 gap-5 pt-6 sm:grid-cols-3">
            {aboutValues.map((v) => (
              <div key={v.label} className="flex flex-col items-center gap-1">
                <span className="text-[22px] font-bold text-primary">
                  {v.value}
                </span>
                <span className="text-[13px] text-ink-subtle">{v.label}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Final CTA */}
      <section className="px-5 py-20 sm:px-10 sm:py-24">
        <Reveal className="mx-auto flex w-full max-w-[720px] flex-col items-center gap-5 rounded-[24px] border border-primary/30 bg-primary/5 px-6 py-14 text-center sm:px-10">
          <h2
            className="text-[26px] font-bold text-porcelain sm:text-[32px]"
            style={{ letterSpacing: "-0.5px" }}
          >
            진로 고민, 근거로 시작하세요
          </h2>
          <p
            className="max-w-[460px] text-[15px] text-ink-subtle"
            style={{ lineHeight: "25px" }}
          >
            회원가입하고 NCS 기반 진로 검색과 AI 질의응답, 맞춤 로드맵을 지금 바로
            이용해보세요.
          </p>
          <Link
            to="/signup"
            className="rounded-[9px] bg-primary px-[28px] py-3 text-[14px] font-bold text-brand-ink transition-colors hover:bg-primary-light"
          >
            무료로 시작하기
          </Link>
        </Reveal>
      </section>

      {/* Footer (내비게이션 링크 없이 브랜드 + 저작권만) */}
      <footer className="border-t border-line">
        <div className="mx-auto flex min-h-[92px] w-full max-w-[1240px] flex-col items-center justify-between gap-4 px-5 py-8 sm:flex-row sm:px-10">
          <BrandWordmark size={20} textSize={14} />
          <p className="text-xs text-ink-muted">
            © 2026 민기. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
