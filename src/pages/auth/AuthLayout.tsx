import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { BrandWordmark } from "@/components/brand";

interface AuthLayoutProps {
  /** Card title, e.g. "로그인" / "회원가입". */
  title: string;
  /** Sub-title line under the title. */
  subtitle: string;
  children: ReactNode;
}

/**
 * Full-page dark background with a centered card, matching the login /
 * signup screens from the Figma design (494px card, azure/8 surface).
 */
export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-full w-full items-center justify-center bg-canvas px-4 py-16">
      <div className="flex w-full max-w-[494px] flex-col gap-1 rounded-[18px] border border-line-strong bg-surface p-[37px]">
        <Link to="/" className="flex justify-center" aria-label="민기 홈">
          <BrandWordmark size={22} textSize={16} />
        </Link>

        <h1 className="pt-6 text-center text-[19px] font-bold text-porcelain">
          {title}
        </h1>
        <p className="pt-px text-center text-[13px] text-ink-subtle">
          {subtitle}
        </p>

        <div className="pt-[22px]">{children}</div>
      </div>
    </div>
  );
}
