// src/store/index.ts - CRITICAL FIX: Use Clerk Token properly
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "@/lib/toast";

// ============================================
// API CONFIGURATION
// ============================================
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const CACHE_TIME = 5000;

console.log("🔗 API URL:", API_URL);

// ============================================
// TYPES
// ============================================
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

// ============================================
// API HELPERS - FIXED: Better error handling
// ============================================
const fetchAPI = async (
  url: string,
  token: string,
  options: RequestInit = {}
) => {
  console.log(`🌐 API Request: ${options.method || "GET"} ${url}`);
  console.log(`🔑 Using token: ${token.substring(0, 20)}...`);

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  // Check if response has content
  const contentType = response.headers.get("content-type");
  const hasJsonContent =
    contentType && contentType.includes("application/json");

  let data;
  if (hasJsonContent) {
    try {
      data = await response.json();
    } catch (e) {
      console.error("❌ Failed to parse JSON response");
      data = { error: "Invalid response from server" };
    }
  } else {
    const text = await response.text();
    console.error("❌ Non-JSON response:", text);
    data = { error: text || "Invalid response from server" };
  }

  if (!response.ok) {
    console.error(`❌ API Error (${response.status}):`, data);
    throw new Error(
      data.error || data.message || `Request failed: ${response.status}`
    );
  }

  console.log(`✅ API Success:`, data);
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

  const data = await response.json();

  if (!response.ok) {
    console.error(`❌ API Error (${response.status}):`, data);
    throw new Error(data.error || `Request failed: ${response.status}`);
  }

  console.log(`✅ API Success:`, data);
  return data;
};

// ============================================
// AUTH STORE (JWT Legacy)
// ============================================
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
        console.log(
          "🔐 Initializing auth - Token exists:",
          !!token,
          "User exists:",
          !!user
        );
        if (token && user) {
          set({ isAuthenticated: true });
        } else {
          set({ isAuthenticated: false });
        }
      },

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          console.log("🔑 Attempting login for:", email);
          const data = await fetchAPINoAuth(`${API_URL}/auth/login`, {
            method: "POST",
            body: JSON.stringify({ email, password }),
          });

          console.log("✅ Login successful!");
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
          const message =
            error instanceof Error ? error.message : "Login failed";
          console.error("❌ Login failed:", message);
          set({ error: message, isLoading: false });
          toast.error(message);
          throw error;
        }
      },

      register: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          console.log("📝 Attempting registration for:", email);
          const data = await fetchAPINoAuth(`${API_URL}/auth/register`, {
            method: "POST",
            body: JSON.stringify({ email, password }),
          });

          console.log("✅ Registration successful!");
          set({
            user: data.user,
            token: data.accessToken,
            refreshToken: data.refreshToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          toast.success(`Account created successfully! Welcome! 🎉`);
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Registration failed";
          console.error("❌ Registration failed:", message);
          set({ error: message, isLoading: false });
          toast.error(message);
          throw error;
        }
      },

      refreshAccessToken: async () => {
        const { refreshToken } = get();

        if (!refreshToken) {
          console.log("❌ No refresh token available");
          set({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
          });
          return false;
        }

        try {
          console.log("🔄 Refreshing access token...");
          const data = await fetchAPINoAuth(`${API_URL}/auth/refresh`, {
            method: "POST",
            body: JSON.stringify({ refreshToken }),
          });

          console.log("✅ Token refreshed successfully");
          set({
            token: data.accessToken,
            refreshToken: data.refreshToken,
            isAuthenticated: true,
          });

          return true;
        } catch (error) {
          console.error("❌ Token refresh failed:", error);
          set({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
            error: "Session expired. Please login again.",
          });
          toast.warning("Session expired. Please login again.");
          return false;
        }
      },

      logout: async () => {
        const { refreshToken } = get();

        if (refreshToken) {
          try {
            console.log("👋 Logging out...");
            await fetchAPINoAuth(`${API_URL}/auth/logout`, {
              method: "POST",
              body: JSON.stringify({ refreshToken }),
            });
          } catch (error) {
            console.error("⚠️ Logout request failed:", error);
          }
        }

        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          error: null,
        });

        useTaskStore.getState().resetTasks();
        toast.info("Logged out successfully. See you soon! 👋");
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
      }),
    }
  )
);

// ============================================
// TASK STORE (Clerk Primary + JWT Legacy)
// ============================================
interface TaskState {
  tasks: Task[];
  allTasks: Task[];
  completedTasks: Task[];
  urgentTasks: Task[];
  isLoading: boolean;
  error: string | null;
  lastFetch: number;
  lastCompletedFetch: number;
  lastUrgentFetch: number;
  searchQuery: string;
  currentView: "all" | "completed" | "urgent";
  pendingRequests: Set<string>;

  fetchTasks: (token: string, force?: boolean) => Promise<void>;
  addTask: (
    token: string,
    title: string,
    description?: string,
    deadline?: string,
    isUrgent?: boolean
  ) => Promise<void>;
  updateTask: (token: string, id: number, data: Partial<Task>) => Promise<void>;
  deleteTask: (token: string, id: number) => Promise<void>;
  completeTask: (token: string, id: number) => Promise<void>;
  filterTasks: (query: string) => void;
  setViewTasks: (view: "all" | "completed" | "urgent") => void;
  setCurrentView: (view: "all" | "completed" | "urgent") => void;
  clearError: () => void;
  resetTasks: () => void;
  getCompletedTasks: (token: string) => Promise<void>;
  getUrgentTasks: (token: string) => Promise<void>;
}

export const useTaskStore = create<TaskState>()((set, get) => ({
  tasks: [],
  allTasks: [],
  completedTasks: [],
  urgentTasks: [],
  isLoading: false,
  error: null,
  lastFetch: 0,
  lastCompletedFetch: 0,
  lastUrgentFetch: 0,
  searchQuery: "",
  currentView: "all",
  pendingRequests: new Set(),

  setCurrentView: (view) => {
    set({ currentView: view });
    get().setViewTasks(view);
  },

  setViewTasks: (view: "all" | "completed" | "urgent") => {
    const { allTasks, completedTasks, urgentTasks } = get();
    let filtered: Task[];

    switch (view) {
      case "completed":
        filtered = completedTasks;
        break;
      case "urgent":
        filtered = urgentTasks;
        break;
      case "all":
      default:
        filtered = allTasks;
        break;
    }

    set({ tasks: filtered, currentView: view });
  },

  fetchTasks: async (token: string, force = false) => {
    if (!token) {
      set({ error: "Please login to view tasks" });
      return;
    }

    const requestKey = "fetch-all-tasks";
    const { pendingRequests, lastFetch, allTasks } = get();

    if (pendingRequests.has(requestKey)) {
      console.log("⏳ Fetch already in progress, skipping...");
      return;
    }

    const now = Date.now();

    if (!force && now - lastFetch < CACHE_TIME && allTasks.length > 0) {
      console.log("📦 Using cached tasks");
      return;
    }

    pendingRequests.add(requestKey);
    set({
      isLoading: true,
      error: null,
      pendingRequests: new Set(pendingRequests),
    });

    try {
      console.log("📥 Fetching all tasks from backend...");

      const [pendingData, completedData, urgentData] = await Promise.all([
        fetchAPI(`${API_URL}/tasks`, token),
        fetchAPI(`${API_URL}/tasks/completed`, token),
        fetchAPI(`${API_URL}/tasks/urgent`, token),
      ]);

      const allTasksMap = new Map<number, Task>();

      [
        ...pendingData.tasks,
        ...completedData.tasks,
        ...urgentData.tasks,
      ].forEach((task) => {
        allTasksMap.set(task.id, task);
      });

      const combinedTasks = Array.from(allTasksMap.values());

      console.log(`✅ Fetched ${combinedTasks.length} tasks total`);

      pendingRequests.delete(requestKey);
      set({
        tasks: combinedTasks,
        allTasks: combinedTasks,
        isLoading: false,
        lastFetch: now,
        searchQuery: "",
        pendingRequests: new Set(pendingRequests),
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch tasks";
      console.error("❌ Fetch tasks error:", message);
      pendingRequests.delete(requestKey);
      set({
        error: message,
        isLoading: false,
        pendingRequests: new Set(pendingRequests),
      });
      toast.error(message);
    }
  },

  getCompletedTasks: async (token: string) => {
    if (!token) {
      set({ error: "Please login to view tasks" });
      return;
    }

    const requestKey = "fetch-completed-tasks";
    const { pendingRequests, lastCompletedFetch, completedTasks } = get();

    if (pendingRequests.has(requestKey)) {
      return;
    }

    const now = Date.now();

    if (now - lastCompletedFetch < CACHE_TIME && completedTasks.length > 0) {
      set({ tasks: completedTasks, currentView: "completed" });
      return;
    }

    pendingRequests.add(requestKey);
    set({
      isLoading: true,
      error: null,
      pendingRequests: new Set(pendingRequests),
    });

    try {
      console.log("📥 Fetching completed tasks...");
      const data = await fetchAPI(`${API_URL}/tasks/completed`, token);

      pendingRequests.delete(requestKey);
      set({
        tasks: data.tasks,
        completedTasks: data.tasks,
        isLoading: false,
        lastCompletedFetch: now,
        currentView: "completed",
        pendingRequests: new Set(pendingRequests),
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to fetch completed tasks";
      pendingRequests.delete(requestKey);
      set({
        error: message,
        isLoading: false,
        pendingRequests: new Set(pendingRequests),
      });
      toast.error(message);
    }
  },

  getUrgentTasks: async (token: string) => {
    if (!token) {
      set({ error: "Please login to view tasks" });
      return;
    }

    const requestKey = "fetch-urgent-tasks";
    const { pendingRequests, lastUrgentFetch, urgentTasks } = get();

    if (pendingRequests.has(requestKey)) {
      return;
    }

    const now = Date.now();

    if (now - lastUrgentFetch < CACHE_TIME && urgentTasks.length > 0) {
      set({ tasks: urgentTasks, currentView: "urgent" });
      return;
    }

    pendingRequests.add(requestKey);
    set({
      isLoading: true,
      error: null,
      pendingRequests: new Set(pendingRequests),
    });

    try {
      console.log("📥 Fetching urgent tasks...");
      const data = await fetchAPI(`${API_URL}/tasks/urgent`, token);

      pendingRequests.delete(requestKey);
      set({
        tasks: data.tasks,
        urgentTasks: data.tasks,
        isLoading: false,
        lastUrgentFetch: now,
        currentView: "urgent",
        pendingRequests: new Set(pendingRequests),
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch urgent tasks";
      pendingRequests.delete(requestKey);
      set({
        error: message,
        isLoading: false,
        pendingRequests: new Set(pendingRequests),
      });
      toast.error(message);
    }
  },

  filterTasks: (query: string) => {
    const { allTasks } = get();

    if (!query.trim()) {
      set({ tasks: allTasks, searchQuery: "" });
      return;
    }

    const trimmedQuery = query.trim().toLowerCase();
    const filtered = allTasks.filter((task) => {
      const titleMatch = task.title.toLowerCase().includes(trimmedQuery);
      const descriptionMatch = task.description
        ?.toLowerCase()
        .includes(trimmedQuery);
      return titleMatch || descriptionMatch;
    });

    set({ tasks: filtered, searchQuery: query });
  },

  addTask: async (token, title, description, deadline, isUrgent) => {
    if (!token) {
      set({ error: "Please login to add tasks" });
      throw new Error("Please login to add tasks");
    }

    if (!title || !title.trim()) {
      set({ error: "Task title is required" });
      throw new Error("Task title is required");
    }

    set({ isLoading: true, error: null });
    try {
      console.log("➕ Adding new task...");
      await fetchAPI(`${API_URL}/tasks`, token, {
        method: "POST",
        body: JSON.stringify({
          title: title.trim(),
          description: description?.trim() || undefined,
          deadline,
          is_urgent: isUrgent || false,
        }),
      });

      await get().fetchTasks(token, true);
      const { currentView } = get();
      get().setViewTasks(currentView);

      set({ isLoading: false });
      toast.success("Task added successfully! ✅");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to add task";
      set({ error: message, isLoading: false });
      toast.error(message);
      throw error;
    }
  },

  updateTask: async (token, id, taskData) => {
    if (!token) {
      set({ error: "Please login to update tasks" });
      throw new Error("Please login to update tasks");
    }

    const { tasks, allTasks, completedTasks, urgentTasks, currentView } = get();

    const updateTaskInArray = (arr: Task[]) =>
      arr.map((t) => (t.id === id ? { ...t, ...taskData } : t));

    set({
      tasks: updateTaskInArray(tasks),
      allTasks: updateTaskInArray(allTasks),
      completedTasks: updateTaskInArray(completedTasks),
      urgentTasks: updateTaskInArray(urgentTasks),
    });

    try {
      console.log("✏️ Updating task:", id);

      const backendData: any = {};
      if (taskData.title !== undefined) backendData.title = taskData.title;
      if (taskData.description !== undefined)
        backendData.description = taskData.description;
      if (taskData.deadline !== undefined)
        backendData.deadline = taskData.deadline;
      if (taskData.isUrgent !== undefined)
        backendData.is_urgent = taskData.isUrgent;
      if (taskData.completed !== undefined)
        backendData.completed = taskData.completed;
      if (taskData.status !== undefined) backendData.status = taskData.status;

      await fetchAPI(`${API_URL}/tasks/${id}`, token, {
        method: "PUT",
        body: JSON.stringify(backendData),
      });

      set({
        lastFetch: 0,
        lastCompletedFetch: 0,
        lastUrgentFetch: 0,
      });

      toast.success("Task updated successfully! ✨");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update task";
      set({ error: message });
      toast.error(message);

      if (currentView === "completed") {
        await get().getCompletedTasks(token);
      } else if (currentView === "urgent") {
        await get().getUrgentTasks(token);
      } else {
        await get().fetchTasks(token, true);
      }

      throw error;
    }
  },

  deleteTask: async (token, id) => {
    if (!token) {
      set({ error: "Please login to delete tasks" });
      throw new Error("Please login to delete tasks");
    }

    const { tasks, allTasks, completedTasks, urgentTasks, currentView } = get();

    const removeTaskFromArray = (arr: Task[]) => arr.filter((t) => t.id !== id);

    set({
      tasks: removeTaskFromArray(tasks),
      allTasks: removeTaskFromArray(allTasks),
      completedTasks: removeTaskFromArray(completedTasks),
      urgentTasks: removeTaskFromArray(urgentTasks),
    });

    try {
      console.log("🗑️ Deleting task:", id);
      await fetchAPI(`${API_URL}/tasks/${id}`, token, {
        method: "DELETE",
      });

      set({
        lastFetch: 0,
        lastCompletedFetch: 0,
        lastUrgentFetch: 0,
      });

      toast.success("Task deleted successfully! 🗑️");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete task";
      set({ error: message });
      toast.error(message);

      if (currentView === "completed") {
        await get().getCompletedTasks(token);
      } else if (currentView === "urgent") {
        await get().getUrgentTasks(token);
      } else {
        await get().fetchTasks(token, true);
      }

      throw error;
    }
  },

  completeTask: async (token, id) => {
    if (!token) {
      set({ error: "Please login to complete tasks" });
      throw new Error("Please login to complete tasks");
    }

    const { tasks, allTasks, completedTasks, urgentTasks, currentView } = get();

    const updateTaskInArray = (arr: Task[]) =>
      arr.map((t) => (t.id === id ? { ...t, completed: true } : t));

    set({
      tasks: updateTaskInArray(tasks),
      allTasks: updateTaskInArray(allTasks),
      completedTasks: updateTaskInArray(completedTasks),
      urgentTasks: updateTaskInArray(urgentTasks),
    });

    try {
      console.log("✅ Completing task:", id);
      await fetchAPI(`${API_URL}/tasks/${id}`, token, {
        method: "PUT",
        body: JSON.stringify({ completed: true }),
      });

      set({
        lastFetch: 0,
        lastCompletedFetch: 0,
        lastUrgentFetch: 0,
      });

      toast.success("Task completed! Great job! 🎉");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to complete task";
      set({ error: message });
      toast.error(message);

      if (currentView === "completed") {
        await get().getCompletedTasks(token);
      } else if (currentView === "urgent") {
        await get().getUrgentTasks(token);
      } else {
        await get().fetchTasks(token, true);
      }

      throw error;
    }
  },

  clearError: () => set({ error: null }),

  resetTasks: () => {
    set({
      tasks: [],
      allTasks: [],
      completedTasks: [],
      urgentTasks: [],
      isLoading: false,
      error: null,
      lastFetch: 0,
      lastCompletedFetch: 0,
      lastUrgentFetch: 0,
      searchQuery: "",
      currentView: "all",
      pendingRequests: new Set(),
    });
  },
}));
