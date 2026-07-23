import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AUTH_LOGOUT_EVENT } from "@/lib/api";
import {
  clearTokens,
  getCachedUser,
  getRefreshToken,
  setCachedUser,
  setTokens,
} from "@/lib/tokens";
import type { AuthSession, User } from "@/types/api";
import {
  getMe,
  signIn as signInRequest,
  signOut as signOutRequest,
  signUp as signUpRequest,
  type SignInBody,
  type SignUpBody,
} from "./authApi";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface AuthContextValue {
  user: User | null;
  status: AuthStatus;
  isAuthenticated: boolean;
  signIn: (body: SignInBody) => Promise<User>;
  signUp: (body: SignUpBody) => Promise<User>;
  signOut: () => Promise<void>;
  /** 서버에서 최신 유저 정보를 다시 불러와 상태를 갱신. */
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => getCachedUser());
  const [status, setStatus] = useState<AuthStatus>(() =>
    getRefreshToken() ? "loading" : "unauthenticated",
  );
  const mounted = useRef(true);

  const applySession = useCallback((session: AuthSession) => {
    setTokens(session.accessToken, session.refreshToken);
    setCachedUser(session.user);
    setUser(session.user);
    setStatus("authenticated");
    return session.user;
  }, []);

  const clearSession = useCallback(() => {
    clearTokens();
    setUser(null);
    setStatus("unauthenticated");
  }, []);

  // 부팅 시 refresh 토큰이 있으면 /auth/me로 세션 유효성 검증.
  useEffect(() => {
    mounted.current = true;
    if (!getRefreshToken()) {
      setStatus("unauthenticated");
      return;
    }
    getMe()
      .then((me) => {
        if (!mounted.current) return;
        setCachedUser(me);
        setUser(me);
        setStatus("authenticated");
      })
      .catch(() => {
        if (!mounted.current) return;
        // 401은 인터셉터가 refresh를 시도하고, 실패하면 logout 이벤트를 쏜다.
        // 여기 도달했다는 건 갱신 불가 → 미인증 처리.
        clearSession();
      });
    return () => {
      mounted.current = false;
    };
  }, [clearSession]);

  // 인터셉터가 세션 종료를 알리면 상태를 비운다.
  useEffect(() => {
    const onLogout = () => clearSession();
    window.addEventListener(AUTH_LOGOUT_EVENT, onLogout);
    return () => window.removeEventListener(AUTH_LOGOUT_EVENT, onLogout);
  }, [clearSession]);

  const signIn = useCallback(
    async (body: SignInBody) => applySession(await signInRequest(body)),
    [applySession],
  );

  const signUp = useCallback(
    async (body: SignUpBody) => applySession(await signUpRequest(body)),
    [applySession],
  );

  const signOut = useCallback(async () => {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      // 서버 폐기 실패해도 클라이언트 토큰은 반드시 정리.
      await signOutRequest(refreshToken).catch(() => undefined);
    }
    clearSession();
  }, [clearSession]);

  const refresh = useCallback(async () => {
    const me = await getMe();
    setCachedUser(me);
    setUser(me);
    setStatus("authenticated");
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      status,
      isAuthenticated: status === "authenticated",
      signIn,
      signUp,
      signOut,
      refresh,
    }),
    [user, status, signIn, signUp, signOut, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an <AuthProvider>.");
  }
  return ctx;
}
