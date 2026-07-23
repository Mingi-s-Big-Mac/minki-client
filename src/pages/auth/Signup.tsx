import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { TextField } from "@/components/ui";
import { useAuth, authApi } from "@/features/auth";
import { ApiError } from "@/lib/api";
import { cn } from "@/lib/cn";
import { AuthLayout } from "./AuthLayout";

/**
 * 학년 선택지 → 백엔드 `grade`(정수) 매핑.
 * TODO(백엔드 확인): grade 정수 인코딩이 확정되면 value만 맞추면 된다.
 */
const GRADE_OPTIONS = [
  { label: "고3", value: 0 },
  { label: "대학 1학년", value: 1 },
  { label: "대학 2학년", value: 2 },
  { label: "대학 3학년", value: 3 },
  { label: "대학 4학년", value: 4 },
] as const;

const RESEND_COOLDOWN_SEC = 30;

export default function Signup() {
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [majorText, setMajorText] = useState("");
  const [grade, setGrade] = useState<number>(GRADE_OPTIONS[0].value);

  const [emailSent, setEmailSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const [sending, setSending] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 재발송 쿨다운 카운트다운.
  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => setCooldown((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  // 이메일을 다시 건드리면 인증 상태를 초기화.
  function handleEmailChange(value: string) {
    setEmail(value);
    if (verified || emailSent) {
      setVerified(false);
      setEmailSent(false);
      setCode("");
      setVerifyError(null);
    }
  }

  async function handleSendCode() {
    if (sending || cooldown > 0 || !email) return;
    setVerifyError(null);
    setSending(true);
    try {
      const res = await authApi.requestEmailVerification({
        email,
        purpose: "SIGN_UP",
      });
      setEmailSent(true);
      setCooldown(RESEND_COOLDOWN_SEC);
      if (res.delivery === "not_configured") {
        toast("개발 환경: SMTP 미설정으로 메일이 실제 발송되지 않았어요.");
      } else {
        toast.success("인증 코드를 보냈어요. 메일함을 확인해주세요.");
      }
    } catch (err) {
      setVerifyError(
        err instanceof ApiError
          ? err.message
          : "인증 코드 발송에 실패했어요.",
      );
    } finally {
      setSending(false);
    }
  }

  async function handleConfirmCode() {
    if (confirming || code.length < 6) return;
    setVerifyError(null);
    setConfirming(true);
    try {
      await authApi.confirmEmailVerification({
        email,
        code,
        purpose: "SIGN_UP",
      });
      setVerified(true);
      toast.success("이메일 인증이 완료됐어요.");
    } catch (err) {
      setVerifyError(
        err instanceof ApiError
          ? err.message
          : "인증 코드 확인에 실패했어요.",
      );
    } finally {
      setConfirming(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setError(null);

    if (!verified) {
      setError("이메일 인증을 먼저 완료해주세요.");
      return;
    }
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
        {/* 이메일 + 인증코드 발송 */}
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-ink-subtle">이메일</span>
          <div className="flex gap-2">
            <input
              type="email"
              autoComplete="email"
              placeholder="example@university.ac.kr"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              required
              disabled={verified}
              className={cn(
                "w-full rounded-sm border border-line-strong bg-field px-[13px] py-[11px]",
                "text-[14px] text-porcelain placeholder:text-ink-muted",
                "outline-none transition-colors focus:border-primary disabled:opacity-60",
              )}
            />
            <button
              type="button"
              onClick={handleSendCode}
              disabled={verified || sending || cooldown > 0 || !email}
              className="shrink-0 rounded-sm border border-line-strong px-3 text-[12px] font-semibold text-geyser transition-colors hover:border-ink-subtle disabled:cursor-not-allowed disabled:opacity-50"
            >
              {verified
                ? "인증완료"
                : cooldown > 0
                  ? `${cooldown}초`
                  : emailSent
                    ? "재발송"
                    : "인증코드"}
            </button>
          </div>
        </div>

        {/* 인증코드 입력 (발송 후 노출) */}
        {emailSent && !verified && (
          <div className="flex flex-col gap-1.5">
            <span className="text-xs text-ink-subtle">인증 코드 (6자리)</span>
            <div className="flex gap-2">
              <input
                inputMode="numeric"
                maxLength={6}
                placeholder="000000"
                value={code}
                onChange={(e) =>
                  setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                className={cn(
                  "w-full rounded-sm border border-line-strong bg-field px-[13px] py-[11px]",
                  "text-[14px] tracking-[0.3em] text-porcelain placeholder:tracking-normal placeholder:text-ink-muted",
                  "outline-none transition-colors focus:border-primary",
                )}
              />
              <button
                type="button"
                onClick={handleConfirmCode}
                disabled={confirming || code.length < 6}
                className="shrink-0 rounded-sm bg-primary px-4 text-[12px] font-bold text-brand-ink transition-colors hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-50"
              >
                {confirming ? "확인 중…" : "확인"}
              </button>
            </div>
          </div>
        )}

        {verifyError && (
          <p role="alert" className="text-xs text-red-400">
            {verifyError}
          </p>
        )}

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
