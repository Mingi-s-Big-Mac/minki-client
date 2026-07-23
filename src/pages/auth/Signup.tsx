import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { TextField } from "@/components/ui";
import { cn } from "@/lib/cn";
import { AuthLayout } from "./AuthLayout";

const GRADES = ["고3", "대학 1학년", "대학 2학년", "대학 3학년", "대학 4학년"];

export default function Signup() {
  const navigate = useNavigate();
  const [grade, setGrade] = useState(GRADES[0]);

  // No API yet — publishing only. Give feedback and route to login.
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    toast.success("가입이 완료되었어요! 로그인해주세요.");
    navigate("/login");
  }

  return (
    <AuthLayout title="회원가입" subtitle="출처 기반 진로 탐색을 시작해보세요">
      <form className="flex flex-col gap-3.5" onSubmit={handleSubmit}>
        <TextField
          label="이메일"
          type="email"
          autoComplete="email"
          placeholder="example@university.ac.kr"
        />
        <TextField
          label="비밀번호"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
        />
        <TextField
          label="비밀번호 확인"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
        />

        {/* 학년 선택 */}
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-ink-subtle">학년</span>
          <div className="flex flex-wrap gap-2">
            {GRADES.map((g) => {
              const selected = g === grade;
              return (
                <button
                  key={g}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setGrade(g)}
                  className={cn(
                    "rounded-[7px] border px-[13px] py-[9px] text-xs transition-colors",
                    selected
                      ? "border-primary bg-primary/[0.12] font-bold text-primary"
                      : "border-line-strong bg-field text-geyser hover:border-ink-subtle",
                  )}
                >
                  {g}
                </button>
              );
            })}
          </div>
        </div>

        <TextField label="전공" placeholder="예: 컴퓨터공학과" />

        <button
          type="submit"
          className="mt-1.5 w-full rounded-[9px] bg-primary py-3.5 text-[14px] font-bold text-brand-ink transition-colors hover:bg-primary-light"
        >
          가입하기
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
