// src/store/index.ts - PRODUCTION-READY FIXED API URL
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "@/lib/toast";

// ✅ FIXED: Remove trailing slash from API URL to avoid double-slash
const API_URL = (import.meta.env.VITE_API_URL || "https://taskaya-backend-production.up.railway.app").replace(/\/+$/, "");
const CACHE_TIME = 5000;

console.log("🔗 API Configuration:");
console.log("   Environment:", import.meta.env.MODE);
console.log("   API URL:", API_URL);

// --- Types ---
interface User {
  id: number;
  email: string;
}

export interface Task {
  id: number;
  userId: number;
  title: string;
  description: string | null;
  status: string;
  deadline: string | null;
  isUrgent: boolean;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  created_at: string;
  updated_at: string;
}

// --- API Helpers ---
const fetchAPI = async (url: string, token: string, options: RequestInit = {}) => {
  console.log(`🌐 API Request: ${options.method || "GET"} ${url}`);
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  const contentType = response.headers.get("content-type");
  const hasJsonContent = contentType && contentType.includes("application/json");

  let data;
  if (hasJsonContent) {
    try { data = await response.json(); } 
    catch { data = { error: "Invalid response from server" }; }
  } else {
    const text = await response.text();
    data = { error: text || "Invalid response from server" };
  }

  if (!response.ok) {
    console.error(`❌ API Error (${response.status}):`, data);
    throw new Error(data.error || data.message || `Request failed: ${response.status}`);
  }

  return data;
};

const fetchAPINoAuth = async (url: string, options: RequestInit = {}) => {
  console.log(`🌐 API Request (No Auth): ${options.method || "GET"} ${url}`);
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const contentType = response.headers.get("content-type");
  const hasJsonContent = contentType && contentType.includes("application/json");

  let data;
  if (hasJsonContent) {
    try { data = await response.json(); } 
    catch { data = { error: "Invalid response from server" }; }
  } else {
    const text = await response.text();
    data = { error: text || "Invalid response from server" };
  }

  if (!response.ok) {
    console.error(`❌ API Error (${response.status}):`, data);
    throw new Error(data.error || data.message || `Request failed: ${response.status}`);
  }

  return data;
};

// --- Auth Store ---
interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<boolean>;
  clearError: () => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      initializeAuth: () => {
        const { token, user } = get();
        set({ isAuthenticated: !!token && !!user });
      },

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const data = await fetchAPINoAuth(`${API_URL}/api/auth/login`, {
            method: "POST",
            body: JSON.stringify({ email, password }),
          });

          set({
            user: data.user,
            token: data.accessToken,
            refreshToken: data.refreshToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          toast.success(`Welcome back, ${data.user.email}! 👋`);
        } catch (error) {
          const message = error instanceof Error ? error.message : "Login failed";
          set({ error: message, isLoading: false });
          toast.error(message);
          throw error;
        }
      },

      register: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const data = await fetchAPINoAuth(`${API_URL}/api/auth/register`, {
            method: "POST",
            body: JSON.stringify({ email, password }),
          });

          set({
            user: data.user,
            token: data.accessToken,
            refreshToken: data.refreshToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          toast.success(`Account created successfully! 🎉`);
        } catch (error) {
          const message = error instanceof Error ? error.message : "Registration failed";
          set({ error: message, isLoading: false });
          toast.error(message);
          throw error;
        }
      },

      refreshAccessToken: async () => {
        const { refreshToken } = get();
        if (!refreshToken) return false;

        try {
          const data = await fetchAPINoAuth(`${API_URL}/api/auth/refresh`, {
            method: "POST",
            body: JSON.stringify({ refreshToken }),
          });
          set({ token: data.accessToken, refreshToken: data.refreshToken, isAuthenticated: true });
          return true;
        } catch {
          set({ user: null, token: null, refreshToken: null, isAuthenticated: false, error: "Session expired. Please login again." });
          toast.warning("Session expired. Please login again.");
          return false;
        }
      },

      logout: async () => {
        const { refreshToken } = get();
        if (refreshToken) {
          try { await fetchAPINoAuth(`${API_URL}/api/auth/logout`, { method: "POST", body: JSON.stringify({ refreshToken }) }); }
          catch (e) { console.error("Logout error:", e); }
        }
        set({ user: null, token: null, refreshToken: null, isAuthenticated: false, error: null });
        useTaskStore.getState().resetTasks();
        toast.info("Logged out successfully. See you soon! 👋");
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user, token: state.token, refreshToken: state.refreshToken }),
    }
  )
);

// --- Task Store ---
// ... بقيت TaskStore بدون تغيير (كما في الكود السابق) ...
