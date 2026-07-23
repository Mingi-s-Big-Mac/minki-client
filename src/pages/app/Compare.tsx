import { compareJobs, compareRows } from "@/data/compare";
import { AppShell } from "./AppShell";

/** 직무 비교 페이지 (Figma node 1:2233). */
export default function Compare() {
  return (
    <AppShell>
      <div className="flex flex-col gap-6 p-10">
        <h1 className="text-[20px] font-bold text-porcelain">직무 비교</h1>

        {/* Comparison matrix: leading label column + one column per job. */}
        <div className="overflow-x-auto rounded-[14px] border border-line-strong">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-surface">
                <th className="w-[160px] border-b border-r border-line-strong" />
                {compareJobs.map((job) => (
                  <th
                    key={job}
                    className="border-b border-line-strong px-4 pb-[18px] pt-4 text-[15px] font-semibold text-porcelain [&:not(:last-child)]:border-r"
                  >
                    {job}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {compareRows.map((row) => (
                <tr key={row.label} className="align-top">
                  <th className="w-[160px] border-b border-r border-line-strong px-4 pb-[41px] pt-[17px] text-left text-[13px] font-semibold text-ink-subtle">
                    {row.label}
                  </th>
                  {row.cells.map((cell, i) => (
                    <td
                      key={compareJobs[i]}
                      className="border-b border-line-strong px-4 py-4 [&:not(:last-child)]:border-r"
                    >
                      <div className="flex flex-col gap-2">
                        <span className="text-[13px] text-geyser">
                          {cell.value}
                        </span>
                        <span className="text-[11px] text-ink-muted">
                          {cell.source}
                        </span>
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
