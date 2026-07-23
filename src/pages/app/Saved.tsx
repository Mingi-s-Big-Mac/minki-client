import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { savedJobs as initialSavedJobs } from "@/data/jobs";
import { AppShell } from "./AppShell";

/** 관심 직무 저장 목록 (Figma node 1:2165). */
export default function Saved() {
  const navigate = useNavigate();
  const [items, setItems] = useState(initialSavedJobs);

  function remove(id: string, title: string) {
    setItems((prev) => prev.filter((item) => item.id !== id));
    toast.success(`'${title}'을(를) 목록에서 삭제했어요.`);
  }

  return (
    <AppShell>
      <div className="flex flex-col gap-6 p-10">
        <h1 className="text-[20px] font-bold text-porcelain">
          저장한 관심 직무 ({items.length})
        </h1>

        <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-4">
          {items.map((job) => (
            <article
              key={job.id}
              className="flex flex-col gap-[6px] rounded-[14px] border border-line-strong bg-surface p-[21px]"
            >
              <h2 className="text-[15px] font-semibold text-porcelain">
                {job.title}
              </h2>
              <p className="text-[12px] text-ink-muted">{job.savedAt}</p>
              <div className="flex gap-2 pt-[10px]">
                <button
                  type="button"
                  onClick={() => navigate("/compare")}
                  className="flex-1 rounded-[7px] bg-primary py-[10px] text-center text-[12px] font-bold text-brand-ink transition-colors hover:bg-primary-light"
                >
                  비교하기
                </button>
                <button
                  type="button"
                  onClick={() => remove(job.id, job.title)}
                  className="flex-1 rounded-[7px] border border-line-outline py-[10px] text-center text-[12px] text-geyser transition-colors hover:border-ink-subtle"
                >
                  삭제
                </button>
              </div>
            </article>
          ))}
        </div>

        {items.length === 0 && (
          <p className="py-16 text-center text-[13px] text-ink-subtle">
            저장한 관심 직무가 없어요.
          </p>
        )}
      </div>
    </AppShell>
  );
}
