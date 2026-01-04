// src/router/index.tsx - FIXED
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { useAuthStore } from "@/store";
import { LandingPage } from "@/pages/LandingPage";
import { MainLayout } from "@/components/layouts/MainLayout";
import { Login } from "@/components/Login";
import { Register } from "@/components/Register";
import { Main } from "@/components/Main";
import { Completed } from "@/components/Completed";
import { Urgent } from "@/components/Urgent";

function RootRedirect() {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to="/app" replace />;
  }

  return <Navigate to="/landing" replace />;
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/landing" replace />;
  }

  return <>{children}</>;
}

function AuthRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to="/app" replace />;
  }

  return <>{children}</>;
}

function ProtectedLayout() {
  return (
    <ProtectedRoute>
      <MainLayout />
    </ProtectedRoute>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootRedirect />,
  },
  {
    path: "/landing",
    element: <LandingPage />,
  },
  {
    path: "/app",
    element: <ProtectedLayout />,
    children: [
      { index: true, element: <Main /> },
      { path: "completed", element: <Completed /> },
      { path: "urgent", element: <Urgent /> },
    ],
  },
  {
    path: "/auth/login",
    element: (
      <AuthRoute>
        <Login
          onSwitchToRegister={() => (window.location.href = "/auth/register")}
          onBack={() => (window.location.href = "/landing")}
        />
      </AuthRoute>
    ),
  },
  {
    path: "/auth/register",
    element: (
      <AuthRoute>
        <Register
          onSwitchToLogin={() => (window.location.href = "/auth/login")}
          onBack={() => (window.location.href = "/landing")}
        />
      </AuthRoute>
    ),
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}