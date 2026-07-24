import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

/**
 * 로그인이 필요한 라우트를 감싸는 가드.
 * - loading: 세션 검증 중 → 아무 것도 렌더하지 않음(깜빡임 방지).
 * - unauthenticated: /login으로 리다이렉트하며 원래 목적지를 state로 전달.
 */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { status } = useAuth();
  const location = useLocation();

  if (status === "loading") return null;

  if (status === "unauthenticated") {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
