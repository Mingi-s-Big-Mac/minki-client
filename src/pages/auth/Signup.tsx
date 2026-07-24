import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { TextField } from "@/components/ui";
import { useAuth } from "@/features/auth";
import { GRADE_OPTIONS } from "@/features/users/grade";
import { ApiError } from "@/lib/api";
import { cn } from "@/lib/cn";
import { AuthLayout } from "./AuthLayout";

export default function Signup() {
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [majorText, setMajorText] = useState("");
  const [grade, setGrade] = useState<number>(GRADE_OPTIONS[0].value);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setError(null);

    if (password.length < 8) {
      setError("비밀번호는 8자 이상이어야 해요.");
      return;
    }
    if (password !== passwordConfirm) {
      setError("비밀번호가 일치하지 않아요.");
      return;
    }

    setSubmitting(true);
    try {
      await signUp({ email, password, nickname, grade, majorText });
      toast.success("가입이 완료되었어요!");
      navigate("/home", { replace: true });
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "회원가입에 실패했어요. 잠시 후 다시 시도해주세요.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout title="회원가입" subtitle="출처 기반 진로 탐색을 시작해보세요">
      <form className="flex flex-col gap-3.5" onSubmit={handleSubmit}>
        {/* 이메일 */}
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-ink-subtle">이메일</span>
          <input
            type="email"
            autoComplete="email"
            placeholder="example@university.ac.kr"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={cn(
              "w-full rounded-sm border border-line-strong bg-field px-[13px] py-[11px]",
              "text-[14px] text-porcelain placeholder:text-ink-muted",
              "outline-none transition-colors focus:border-primary",
            )}
          />
        </div>

        <TextField
          label="닉네임"
          autoComplete="nickname"
          placeholder="사용할 닉네임"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          required
        />
        <TextField
          label="비밀번호 (8자 이상)"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <TextField
          label="비밀번호 확인"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          required
        />

        {/* 학년 선택 */}
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
          placeholder="예: 컴퓨터공학과"
          value={majorText}
          onChange={(e) => setMajorText(e.target.value)}
          required
        />

        {error && (
          <p role="alert" className="text-xs text-red-400">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="mt-1.5 w-full rounded-[9px] bg-primary py-3.5 text-[14px] font-bold text-brand-ink transition-colors hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "가입 중…" : "가입하기"}
        </button>

        <p className="text-center text-[13px] text-ink-subtle">
          이미 계정이 있으신가요?{" "}
          <Link to="/login" className="text-primary hover:text-primary-light">
            로그인
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
