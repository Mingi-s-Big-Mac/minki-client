import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import App from "./App.tsx";
import { ThemeToggle } from "@/components/ui";
import { applyTheme, getInitialTheme } from "@/lib/theme";
import "./styles/global.css";

// Apply the persisted theme before first paint to avoid a flash of the
// wrong theme.
applyTheme(getInitialTheme());

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    <ThemeToggle />
    <Toaster position="top-center" richColors />
  </StrictMode>,
);
