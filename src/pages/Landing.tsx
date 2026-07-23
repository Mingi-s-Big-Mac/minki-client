import { Link } from "react-router-dom";
import {
  BrandWordmark,
  IconChat,
  IconRoadmap,
  IconSearch,
} from "@/components/brand";

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

const footerColumns = [
  { title: "제품", links: ["진로 검색", "AI 질의응답", "로드맵"] },
  { title: "회사", links: ["소개", "블로그"] },
  { title: "지원", links: ["문의하기", "이용약관"] },
];

export default function Landing() {
  return (
    <div className="min-h-full w-full bg-canvas text-porcelain">
      {/* Header */}
      <header className="flex h-[65px] items-center justify-between border-b border-line px-10">
        <Link to="/" aria-label="민기 홈">
          <BrandWordmark size={24} textSize={17} />
        </Link>

        <nav className="hidden items-center gap-8 text-[14px] text-geyser md:flex">
          <a href="#features">기능</a>
          <a href="#about">소개</a>
          <a href="#pricing">요금</a>
        </nav>

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
      </header>

      {/* Hero */}
      <section
        className="flex flex-col items-center gap-[18px] px-10 pb-[90px] pt-[100px] text-center"
        style={{
          backgroundImage:
            "radial-gradient(60% 90% at 50% 0%, rgba(78,205,196,0.08), rgba(78,205,196,0) 60%)",
        }}
      >
        <span className="rounded-full bg-primary/10 px-3.5 py-[7px] text-xs font-bold text-primary">
          NCS · 공공데이터 기반
        </span>

        <h1
          className="text-[44px] font-bold text-porcelain"
          style={{ lineHeight: "57.2px", letterSpacing: "-1px" }}
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
      </section>

      {/* Features */}
      <section
        id="features"
        className="flex flex-col justify-center gap-5 px-10 pb-[90px] md:flex-row md:items-stretch"
      >
        {features.map((f) => (
          <div
            key={f.title}
            className="flex flex-1 flex-col items-start gap-[7px] rounded-2xl border border-line-strong bg-surface p-[29px]"
          >
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
        ))}
      </section>

      {/* Footer */}
      <footer className="flex min-h-[172px] flex-col gap-10 border-t border-line px-10 pb-9 pt-[37px] md:flex-row md:items-start md:justify-between">
        <BrandWordmark size={20} textSize={14} />

        <div className="flex gap-14">
          {footerColumns.map((col) => (
            <div key={col.title} className="flex flex-col gap-[9px]">
              <span className="text-[13px] font-semibold text-porcelain">
                {col.title}
              </span>
              {col.links.map((link) => (
                <a
                  key={link}
                  href="#"
                  className="text-[13px] text-ink-subtle transition-colors hover:text-geyser"
                >
                  {link}
                </a>
              ))}
            </div>
          ))}
        </div>

        <p className="self-end text-xs text-ink-muted">
          © 2026 민기. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
