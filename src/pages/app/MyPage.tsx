import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Modal, TextField } from "@/components/ui";
import { AppShell } from "./AppShell";

/** Publishing-only profile data (no API yet), matching the Figma design. */
const user = {
  name: "김도윤",
  email: "doyoon.kim@university.ac.kr",
  grade: "대학 2학년",
  major: "컴퓨터공학과",
  savedJobs: 4,
  askCount: 27,
  roadmapCount: 2,
  passwordChangedAt: "2026.03.02",
};

const stats = [
  { value: user.savedJobs, label: "저장한 직무 수" },
  { value: user.askCount, label: "AI 질문 수" },
  { value: user.roadmapCount, label: "생성한 로드맵 수" },
] as const;

/** 마이 페이지 (Figma node 1:2482). */
export default function MyPage() {
  const [pwOpen, setPwOpen] = useState(false);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");

  function closePwModal() {
    setPwOpen(false);
    setCurrentPw("");
    setNewPw("");
    setConfirmPw("");
  }

  // No API yet — publishing only. Validate locally and give feedback.
  function handleChangePassword(e: FormEvent) {
    e.preventDefault();
    if (newPw !== confirmPw) {
      toast.error("새 비밀번호가 일치하지 않아요.");
      return;
    }
    toast.success("비밀번호가 변경되었어요.");
    closePwModal();
  }

  return (
    <AppShell>
      <div className="flex flex-col gap-[22px] p-10">
        <div className="flex flex-col items-start gap-[22px] lg:flex-row">
          {/* Profile card */}
          <section className="flex w-full flex-col rounded-[14px] border border-line-strong bg-surface p-[27px] lg:w-[394px]">
            <div className="flex size-14 items-center justify-center rounded-full bg-chip text-[20px] font-bold text-primary">
              {user.name.charAt(0)}
            </div>
            <h1 className="pt-[14px] text-[17px] font-bold text-porcelain">
              {user.name}
            </h1>
            <p className="text-[13px] text-ink-subtle">{user.email}</p>
            <p className="pt-[15px] text-[13px] text-geyser">
              학년: {user.grade}
            </p>
            <p className="pt-[5px] pb-[18px] text-[13px] text-geyser">
              전공: {user.major}
            </p>
            <button
              type="button"
              onClick={() => toast("정보 수정은 준비 중이에요.")}
              className="w-full rounded-sm border border-line-outline py-[11px] text-center text-[13px] font-semibold text-porcelain transition-colors hover:border-ink-subtle"
            >
              정보 수정
            </button>
          </section>

          {/* Stats + password change */}
          <div className="flex w-full flex-1 flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col gap-[6px] rounded-[14px] border border-line-strong bg-surface p-[21px]"
                >
                  <span className="text-[24px] font-bold text-primary">
                    {stat.value}
                  </span>
                  <span className="text-[13px] text-ink-subtle">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between gap-4 rounded-[14px] border border-line-strong bg-surface p-[23px]">
              <div className="flex flex-col gap-1">
                <span className="text-[14px] font-semibold text-porcelain">
                  비밀번호 변경
                </span>
                <span className="text-[12px] text-ink-subtle">
                  마지막 변경일: {user.passwordChangedAt}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setPwOpen(true)}
                className="shrink-0 rounded-sm border border-line-outline px-[19px] py-[11px] text-[13px] font-semibold text-porcelain transition-colors hover:border-ink-subtle"
              >
                변경하기
              </button>
            </div>
          </div>
        </div>

        <p className="text-[12px] text-ink-muted">
          계정을 더 이상 사용하지 않으신다면{" "}
          <button
            type="button"
            onClick={() => toast("회원탈퇴는 준비 중이에요.")}
            className="text-ink-subtle underline transition-colors hover:text-porcelain"
          >
            회원탈퇴
          </button>
          를 진행할 수 있습니다.
        </p>
      </div>

      <Modal open={pwOpen} onClose={closePwModal} labelledBy="password-title">
        <form
          className="flex flex-col gap-2"
          onSubmit={handleChangePassword}
        >
          <h2
            id="password-title"
            className="text-center text-[17px] font-bold text-porcelain"
          >
            비밀번호 변경
          </h2>
          <p className="text-center text-[13px] text-ink-subtle">
            안전을 위해 주기적으로 비밀번호를 변경해 주세요.
          </p>

          <div className="flex flex-col gap-3.5 pt-4">
            <TextField
              label="현재 비밀번호"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={currentPw}
              onChange={(e) => setCurrentPw(e.target.value)}
              required
            />
            <TextField
              label="새 비밀번호"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              required
            />
            <TextField
              label="새 비밀번호 확인"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              value={confirmPw}
              onChange={(e) => setConfirmPw(e.target.value)}
              required
            />
          </div>

          <div className="flex gap-[10px] pt-4">
            <button
              type="submit"
              className="flex-1 rounded-sm bg-primary py-[13px] text-center text-[13px] font-bold text-brand-ink transition-colors hover:bg-primary-light"
            >
              변경
            </button>
            <button
              type="button"
              onClick={closePwModal}
              className="flex-1 rounded-sm border border-line-outline py-[13px] text-center text-[13px] font-semibold text-porcelain transition-colors hover:border-ink-subtle"
            >
              취소
            </button>
          </div>
        </form>
      </Modal>
    </AppShell>
  );
}
