// src/App.tsx
import { useEffect } from "react";
import { useAuthStore } from "./store";
import { AppRouter } from "./router";
import { ThemeProvider } from "./components/theme-provider";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ToastContainer } from "./components/Toast";

function App() {
  const { initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="system" storageKey="taskaya-theme">
        <ToastContainer />
        <AppRouter />
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;