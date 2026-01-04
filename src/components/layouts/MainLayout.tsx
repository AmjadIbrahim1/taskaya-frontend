// src/components/layouts/MainLayout.tsx - FIXED
import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
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

  return (
    <div className="flex h-screen bg-background">
      <Side activeView={activeView} onViewChange={handleViewChange} />

      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0 pt-16 lg:pt-0">
        <Breadcrumbs />
        <Search />
        <AddTask />
        <Outlet />
      </div>
    </div>
  );
}