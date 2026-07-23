import axios, { type AxiosError, type AxiosInstance } from "axios";
import { toast } from "sonner";

/**
 * Shared axios instance for the app.
 * Base URL comes from `VITE_API_BASE_URL` (see `.env`), falling back to `/api`.
 */
export const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "/api",
  timeout: 15_000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach an auth token if present.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Surface errors with a toast so the user always gets feedback.
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    const message =
      error.response?.data?.message ??
      error.message ??
      "요청을 처리하지 못했어요.";
    toast.error(message);
    return Promise.reject(error);
  },
);
