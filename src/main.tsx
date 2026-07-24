import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import App from "./App.tsx";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ThemeToggle } from "@/components/ui";
import { AuthProvider } from "@/features/auth";
import { applyTheme, getInitialTheme } from "@/lib/theme";
import "./styles/global.css";

// Apply the persisted theme before first paint to avoid a flash of the
// wrong theme.
applyTheme(getInitialTheme());

// NOTE: StrictMode를 의도적으로 제거했다. 서버 rate limit이 "분당 10건"으로
// 매우 빡빡한데, dev의 StrictMode는 모든 effect(=데이터 요청)를 2번씩 실행해
// 요청량을 배로 늘려 한도를 쉽게 넘긴다. 요청 예산을 아끼려 뺐다.
createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <ErrorBoundary>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ErrorBoundary>
    <ThemeToggle />
    <Toaster position="top-center" richColors />
  </BrowserRouter>,
);
