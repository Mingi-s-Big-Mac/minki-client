import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { TextField } from "@/components/ui";
import { AuthLayout } from "./AuthLayout";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // No API yet — publishing only. Give feedback and route to the home dashboard.
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    toast.success("로그인되었어요!");
    navigate("/home");
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
        />
        <TextField
          label="비밀번호"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

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
          className="w-full rounded-[9px] bg-primary py-3.5 text-[14px] font-bold text-brand-ink transition-colors hover:bg-primary-light"
        >
          로그인
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
