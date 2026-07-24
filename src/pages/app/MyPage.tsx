import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Modal, TextField } from "@/components/ui";
import { useAuth } from "@/features/auth";
import { GRADE_OPTIONS, gradeLabel } from "@/features/users/grade";
import {
  changePassword,
  deleteMyAccount,
  getMyStats,
  updateMyProfile,
} from "@/features/users/usersApi";
import { ApiError } from "@/lib/api";
import { cn } from "@/lib/cn";
import { useMutation, useQuery } from "@/lib/useQuery";
import { AppShell } from "./AppShell";

/** 마이 페이지 (Figma node 1:2482). */
export default function MyPage() {
  const navigate = useNavigate();
  const { user, refresh, signOut } = useAuth();

  const stats = useQuery(() => getMyStats(), []);

  const [pwOpen, setPwOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // 통계 카드: 로딩/에러 시 "–"로 대체.
  const statCards = [
    { value: stats.data?.savedOccupationCount, label: "저장한 직무 수" },
    { value: stats.data?.aiQuestionCount, label: "AI 질문 수" },
    { value: stats.data?.roadmapCount, label: "생성한 로드맵 수" },
  ];

  return (
    <AppShell>
      <div className="flex flex-col gap-[22px] p-5 sm:p-8 lg:p-10">
        <div className="flex flex-col items-start gap-[22px] lg:flex-row">
          {/* Profile card */}
          <section className="flex w-full flex-col rounded-[14px] border border-line-strong bg-surface p-[27px] lg:w-[394px]">
            <div className="flex size-14 items-center justify-center rounded-full bg-chip text-[20px] font-bold text-primary">
              {user?.nickname?.charAt(0) ?? "?"}
            </div>
            <h1 className="pt-[14px] text-[17px] font-bold text-porcelain">
              {user?.nickname ?? "-"}
            </h1>
            <p className="text-[13px] text-ink-subtle">{user?.email ?? "-"}</p>
            <p className="pt-[15px] text-[13px] text-geyser">
              학년: {gradeLabel(user?.grade)}
            </p>
            <p className="pt-[5px] pb-[18px] text-[13px] text-geyser">
              전공: {user?.majorText ?? "-"}
            </p>
            <button
              type="button"
              onClick={() => setEditOpen(true)}
              className="w-full rounded-sm border border-line-outline py-[11px] text-center text-[13px] font-semibold text-porcelain transition-colors hover:border-ink-subtle"
            >
              정보 수정
            </button>
          </section>

          {/* Stats + password change */}
          <div className="flex w-full flex-1 flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {statCards.map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col gap-[6px] rounded-[14px] border border-line-strong bg-surface p-[21px]"
                >
                  <span className="text-[24px] font-bold text-primary">
                    {stats.loading || stat.value == null ? "–" : stat.value}
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
                  안전을 위해 주기적으로 변경해 주세요.
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
            onClick={() => setDeleteOpen(true)}
            className="text-ink-subtle underline transition-colors hover:text-porcelain"
          >
            회원탈퇴
          </button>
          를 진행할 수 있습니다.
        </p>
      </div>

      {pwOpen && <ChangePasswordModal onClose={() => setPwOpen(false)} />}
      {editOpen && (
        <EditProfileModal
          onClose={() => setEditOpen(false)}
          onSaved={async () => {
            setEditOpen(false);
            await refresh();
          }}
        />
      )}
      {deleteOpen && (
        <DeleteAccountModal
          onClose={() => setDeleteOpen(false)}
          onDeleted={async () => {
            setDeleteOpen(false);
            await signOut();
            toast.success("계정이 삭제되었어요.");
            navigate("/", { replace: true });
          }}
        />
      )}
    </AppShell>
  );
}

// ── 비밀번호 변경 ──────────────────────────────────────────────
function ChangePasswordModal({ onClose }: { onClose: () => void }) {
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { mutate, loading } = useMutation(changePassword);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (newPw.length < 8) {
      setError("새 비밀번호는 8자 이상이어야 해요.");
      return;
    }
    if (newPw !== confirmPw) {
      setError("새 비밀번호가 일치하지 않아요.");
      return;
    }
    try {
      await mutate({ currentPassword: currentPw, newPassword: newPw });
      toast.success("비밀번호가 변경되었어요.");
      onClose();
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "비밀번호 변경에 실패했어요.",
      );
    }
  }

  return (
    <Modal open onClose={onClose} labelledBy="password-title">
      <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
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
            label="새 비밀번호 (8자 이상)"
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

        {error && (
          <p role="alert" className="pt-2 text-xs text-red-400">
            {error}
          </p>
        )}

        <div className="flex gap-[10px] pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 rounded-sm bg-primary py-[13px] text-center text-[13px] font-bold text-brand-ink transition-colors hover:bg-primary-light disabled:opacity-60"
          >
            {loading ? "변경 중…" : "변경"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-sm border border-line-outline py-[13px] text-center text-[13px] font-semibold text-porcelain transition-colors hover:border-ink-subtle"
          >
            취소
          </button>
        </div>
      </form>
    </Modal>
  );
}

// ── 정보 수정 ──────────────────────────────────────────────────
function EditProfileModal({
  onClose,
  onSaved,
}: {
  onClose: () => void;
  onSaved: () => void | Promise<void>;
}) {
  const { user } = useAuth();
  const [nickname, setNickname] = useState(user?.nickname ?? "");
  const [grade, setGrade] = useState<number>(user?.grade ?? 0);
  const [majorText, setMajorText] = useState(user?.majorText ?? "");
  const [error, setError] = useState<string | null>(null);
  const { mutate, loading } = useMutation(updateMyProfile);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await mutate({ nickname, grade, majorText });
      toast.success("정보가 수정되었어요.");
      await onSaved();
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "정보 수정에 실패했어요.",
      );
    }
  }

  return (
    <Modal open onClose={onClose} labelledBy="edit-title">
      <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
        <h2
          id="edit-title"
          className="text-center text-[17px] font-bold text-porcelain"
        >
          정보 수정
        </h2>

        <div className="flex flex-col gap-3.5 pt-4">
          <TextField
            label="닉네임"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            required
          />
          <div className="flex flex-col gap-1.5">
            <span className="text-xs text-ink-subtle">학년</span>
            <div className="flex flex-wrap gap-2">
              {GRADE_OPTIONS.map((g) => {
                const selected = g.value === grade;
                return (
                  <button
                    key={g.label}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setGrade(g.value)}
                    className={cn(
                      "rounded-[7px] border px-[13px] py-[9px] text-xs transition-colors",
                      selected
                        ? "border-primary bg-primary/[0.12] font-bold text-primary"
                        : "border-line-strong bg-field text-geyser hover:border-ink-subtle",
                    )}
                  >
                    {g.label}
                  </button>
                );
              })}
            </div>
          </div>
          <TextField
            label="전공"
            value={majorText}
            onChange={(e) => setMajorText(e.target.value)}
            required
          />
        </div>

        {error && (
          <p role="alert" className="pt-2 text-xs text-red-400">
            {error}
          </p>
        )}

        <div className="flex gap-[10px] pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 rounded-sm bg-primary py-[13px] text-center text-[13px] font-bold text-brand-ink transition-colors hover:bg-primary-light disabled:opacity-60"
          >
            {loading ? "저장 중…" : "저장"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-sm border border-line-outline py-[13px] text-center text-[13px] font-semibold text-porcelain transition-colors hover:border-ink-subtle"
          >
            취소
          </button>
        </div>
      </form>
    </Modal>
  );
}

// ── 회원 탈퇴 ──────────────────────────────────────────────────
function DeleteAccountModal({
  onClose,
  onDeleted,
}: {
  onClose: () => void;
  onDeleted: () => void | Promise<void>;
}) {
  const [error, setError] = useState<string | null>(null);
  const { mutate, loading } = useMutation(deleteMyAccount);

  async function confirmDelete() {
    setError(null);
    try {
      await mutate();
      await onDeleted();
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "회원 탈퇴에 실패했어요.",
      );
    }
  }

  return (
    <Modal open onClose={onClose} labelledBy="delete-title">
      <div className="flex flex-col items-center gap-2">
        <h2
          id="delete-title"
          className="text-center text-[17px] font-bold text-porcelain"
        >
          정말 탈퇴하시겠어요?
        </h2>
        <p className="text-center text-[13px] text-ink-subtle">
          계정과 저장한 직무·로드맵·대화가 모두 삭제되며 되돌릴 수 없어요.
        </p>
        {error && (
          <p role="alert" className="pt-1 text-xs text-red-400">
            {error}
          </p>
        )}
        <div className="flex w-full justify-center gap-[10px] pt-4">
          <button
            type="button"
            onClick={confirmDelete}
            disabled={loading}
            className="flex-1 rounded-sm bg-red-500 py-[13px] text-center text-[13px] font-bold text-white transition-colors hover:bg-red-400 disabled:opacity-60"
          >
            {loading ? "처리 중…" : "탈퇴"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-sm border border-line-outline py-[13px] text-center text-[13px] font-semibold text-porcelain transition-colors hover:border-ink-subtle"
          >
            취소
          </button>
        </div>
      </div>
    </Modal>
  );
}
