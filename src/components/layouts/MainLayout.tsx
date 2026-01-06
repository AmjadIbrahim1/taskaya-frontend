// src/components/layouts/MainLayout.tsx - FIXED: Mobile FAB
import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Plus } from "lucide-react";
import { Side } from "../Side";
import { AddTask } from "../AddTask";
import { Search } from "../Search";
import { Breadcrumbs } from "../Breadcrumbs";

const pageTitles: Record<string, string> = {
  "/app": "All Tasks",
  "/app/completed": "Completed Tasks",
  "/app/urgent": "Urgent Tasks",
};

export function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  // Update page title
  useEffect(() => {
    const title = pageTitles[location.pathname] || "Taskaya";
    document.title = `${title} | Taskaya`;
  }, [location.pathname]);

  const getActiveView = (): "all" | "completed" | "urgent" => {
    if (location.pathname === "/app/completed") return "completed";
    if (location.pathname === "/app/urgent") return "urgent";
    return "all";
  };

  const [activeView, setActiveView] = useState<"all" | "completed" | "urgent">(
    getActiveView()
  );

  useEffect(() => {
    setActiveView(getActiveView());
  }, [location.pathname]);

  const handleViewChange = (view: "all" | "completed" | "urgent") => {
    setActiveView(view);

    switch (view) {
      case "all":
        navigate("/app");
        break;
      case "completed":
        navigate("/app/completed");
        break;
      case "urgent":
        navigate("/app/urgent");
        break;
    }
  };

  const scrollToAddTask = () => {
    const addTaskElement = document.getElementById("mobile-add-task");
    if (addTaskElement) {
      addTaskElement.scrollIntoView({ behavior: "smooth", block: "start" });
      // Focus on the input after scrolling
      setTimeout(() => {
        const input = addTaskElement.querySelector("input");
        if (input) {
          input.focus();
        }
      }, 500);
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Side activeView={activeView} onViewChange={handleViewChange} />

      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0 pt-16 lg:pt-0">
        <Breadcrumbs />
        <Search />

        {/* Desktop: AddTask at top */}
        <div className="hidden lg:block">
          <AddTask />
        </div>

        <Outlet />

        {/* Mobile: AddTask at bottom */}
        <div className="lg:hidden">
          <AddTask />
        </div>
      </div>

      {/* Mobile Floating Add Button (FAB) */}
      <button
        onClick={scrollToAddTask}
        className="lg:hidden fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-r from-primary via-purple-500 to-primary text-white shadow-2xl shadow-primary/40 flex items-center justify-center active:scale-95 transition-all hover:shadow-primary/60 animate-bounce-subtle"
        aria-label="Add new task"
      >
        <Plus className="w-8 h-8" strokeWidth={3} />
      </button>

      <style>{`
        @keyframes bounce-subtle {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        
        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease-in-out infinite;
        }
        
        .animate-bounce-subtle:active {
          animation: none;
        }
      `}</style>
    </div>
  );
}
