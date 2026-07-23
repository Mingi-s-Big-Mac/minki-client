import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { jobs } from "@/data/jobs";
import { AppShell } from "./AppShell";

const filters = ["직무명", "기술", "자격증", "학과"] as const;

/** 진로 검색 페이지 (Figma node 1:1978). */
export default function Search() {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("직무명");

  return (
    <AppShell>
      <div className="flex flex-col gap-[14px] px-10 py-9">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="예: 백엔드 개발자, 데이터 분석, SQLD..."
          className="w-full rounded-[10px] border border-line-strong bg-field px-[17px] py-[13px] text-[14px] text-porcelain placeholder:text-ink-muted outline-none transition-colors focus:border-primary"
        />

        {/* Category filters */}
        <div className="flex flex-wrap gap-[10px]">
          {filters.map((filter) => {
            const active = filter === activeFilter;
            return (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={
                  active
                    ? "rounded-full border border-primary bg-primary/12 px-[15px] py-[9px] text-[12px] font-semibold text-primary"
                    : "rounded-full border border-line-strong bg-field px-[15px] py-[9px] text-[12px] text-geyser transition-colors hover:border-ink-subtle"
                }
              >
                {filter}
              </button>
            );
          })}
        </div>

        {/* Results */}
        <ul className="flex flex-col gap-[14px] pt-3">
          {jobs.map((job) => (
            <li
              key={job.id}
              className="flex items-center justify-between gap-4 rounded-[14px] border border-line-strong bg-surface p-[23px]"
            >
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <div className="flex items-center gap-[10px]">
                  <Link
                    to={`/jobs/${job.id}`}
                    className="text-[16px] font-semibold text-porcelain transition-colors hover:text-primary"
                  >
                    {job.title}
                  </Link>
                  <span className="rounded-full bg-primary/12 px-[9px] py-[3px] text-[11px] font-bold text-primary">
                    {job.badge}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-md bg-chip px-[11px] py-[5px] text-[12px] text-geyser"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                <p className="text-[12px] text-ink-subtle">
                  관련 자격증: {job.certSummary}
                </p>
              </div>

              <button
                type="button"
                onClick={() => toast.success(`'${job.title}'을(를) 관심 직무에 저장했어요.`)}
                className="shrink-0 rounded-sm border border-line-outline px-[19px] py-[11px] text-[13px] font-semibold text-porcelain transition-colors hover:border-ink-subtle"
              >
                관심 직무 저장
              </button>
            </li>
          ))}
        </ul>

        {/* Pagination */}
        <nav
          className="flex items-center justify-center gap-2 pt-3"
          aria-label="페이지네이션"
        >
          <button
            type="button"
            aria-current="page"
            className="flex size-[30px] items-center justify-center rounded-sm bg-primary text-[13px] font-bold text-brand-ink"
          >
            1
          </button>
          {[2, 3].map((page) => (
            <button
              key={page}
              type="button"
              className="flex size-8 items-center justify-center rounded-sm border border-line-strong text-[13px] text-ink-subtle transition-colors hover:border-ink-subtle"
            >
              {page}
            </button>
          ))}
        </nav>
      </div>
    </AppShell>
  );
}
