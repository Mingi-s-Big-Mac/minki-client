import { Link } from "react-router-dom";
import { BrandWordmark } from "@/components/brand";

/** 404 페이지 (Figma node 1:2610). */
export default function NotFound() {
  return (
    <div className="flex min-h-full w-full flex-col items-center justify-center gap-[14px] bg-canvas px-4 text-center">
      <div className="pb-2">
        <BrandWordmark size={22} textSize={16} />
      </div>

      <p className="text-[64px] font-bold leading-none tracking-[4px] text-line-strong">
        404
      </p>
      <p className="text-[16px] font-semibold text-porcelain">
        페이지를 찾을 수 없습니다
      </p>
      <p className="pb-[18px] text-[13px] text-ink-subtle">
        요청하신 페이지가 삭제되었거나 주소가 변경되었을 수 있습니다.
      </p>

      <Link
        to="/"
        className="rounded-[9px] bg-primary px-6 py-[12px] text-[14px] font-bold text-brand-ink transition-colors hover:bg-primary-light"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}
