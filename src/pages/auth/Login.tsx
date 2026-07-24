import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { TextField } from "@/components/ui";
import { useAuth } from "@/features/auth";
import { ApiError } from "@/lib/api";
import { AuthLayout } from "./AuthLayout";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 가드에 막혀 넘어온 경우 원래 목적지로 되돌려보낸다.
  const from = (location.state as { from?: Location })?.from?.pathname ?? "/home";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setError(null);
    setSubmitting(true);
    try {
      await signIn({ email, password });
      toast.success("로그인되었어요!");
      navigate(from, { replace: true });
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "로그인에 실패했어요. 잠시 후 다시 시도해주세요.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout title="로그인" subtitle="다시 만나서 반가워요">
      <form className="flex flex-col gap-3.5" onSubmit={handleSubmit}>
        <TextField
          label="이메일"
          type="email"
          autoComplete="email"
          placeholder="example@university.ac.kr"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          label="비밀번호"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && (
          <p role="alert" className="text-xs text-red-400">
            {error}
          </p>
        )}

        <div className="flex justify-end">
          <button
            type="button"
            className="text-xs text-primary transition-colors hover:text-primary-light"
            onClick={() => toast("비밀번호 재설정은 준비 중이에요.")}
          >
            비밀번호를 잊으셨나요?
          </button>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-[9px] bg-primary py-3.5 text-[14px] font-bold text-brand-ink transition-colors hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "로그인 중…" : "로그인"}
        </button>

        <p className="pt-px text-center text-[13px] text-ink-subtle">
          계정이 없으신가요?{" "}
          <Link to="/signup" className="text-primary hover:text-primary-light">
            회원가입
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
