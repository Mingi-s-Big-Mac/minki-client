import { useState, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { BrandWordmark, IconSearch } from "@/components/brand";
import { Modal } from "@/components/ui";

interface AppShellProps {
  children: ReactNode;
}

/**
 * Authenticated app frame from the Figma design (nodes 1:1876 등): a fixed
 * top bar with the brand mark, a center search field that routes to 진로 검색,
 * and 마이페이지 / 로그아웃 links, over the dark canvas. The 로그아웃 link opens
 * the confirmation modal from node 1:2596.
 */
export function AppShell({ children }: AppShellProps) {
  const navigate = useNavigate();
  const [logoutOpen, setLogoutOpen] = useState(false);

  function confirmLogout() {
    setLogoutOpen(false);
    toast.success("로그아웃되었어요.");
    navigate("/");
  }

  return (
    <div className="min-h-full w-full bg-canvas text-porcelain">
      <header className="flex h-[65px] items-center justify-between gap-4 border-b border-line bg-surface px-8">
        <Link
          to="/home"
          aria-label="민기 홈"
          className="flex w-[200px] items-center"
        >
          <BrandWordmark size={22} textSize={16} />
        </Link>

        <button
          type="button"
          onClick={() => navigate("/search")}
          className="flex w-full max-w-[450px] items-center gap-2 rounded-sm border border-line-strong bg-field px-[15px] py-[11px] text-left transition-colors hover:border-ink-subtle"
        >
          <IconSearch size={14} />
          <span className="text-[13px] text-ink-muted">
            직무, 기술, 자격증 검색
          </span>
        </button>

        <nav className="flex w-[200px] items-center justify-end gap-[22px] text-[13px] text-geyser">
          <Link
            to="/mypage"
            className="transition-colors hover:text-porcelain"
          >
            마이페이지
          </Link>
          <button
            type="button"
            className="transition-colors hover:text-porcelain"
            onClick={() => setLogoutOpen(true)}
          >
            로그아웃
          </button>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-[1240px]">{children}</main>

      <Modal
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        labelledBy="logout-title"
      >
        <div className="flex flex-col items-center gap-2">
          <h2
            id="logout-title"
            className="text-center text-[17px] font-bold text-porcelain"
          >
            로그아웃 하시겠습니까?
          </h2>
          <p className="text-center text-[13px] text-ink-subtle">
            다시 로그인하려면 이메일과 비밀번호가 필요합니다.
          </p>
          <div className="flex w-full justify-center gap-[10px] pt-4">
            <button
              type="button"
              onClick={confirmLogout}
              className="flex-1 rounded-sm bg-primary py-[13px] text-center text-[13px] font-bold text-brand-ink transition-colors hover:bg-primary-light"
            >
              확인
            </button>
            <button
              type="button"
              onClick={() => setLogoutOpen(false)}
              className="flex-1 rounded-sm border border-line-outline py-[13px] text-center text-[13px] font-semibold text-porcelain transition-colors hover:border-ink-subtle"
            >
              취소
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
