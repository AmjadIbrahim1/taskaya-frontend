// src/components/Side.tsx - FIXED: All Tasks shows total count
import { useMemo, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore, useTaskStore } from "@/store";
import {
  CheckCircle2,
  Clock,
  LogOut,
  User,
  Menu,
  X,
  AlertCircle,
  ListTodo,
} from "lucide-react";
import { ModeToggle } from "./mode-toggle";
import { useState } from "react";
import { ConfirmDialog } from "./ConfirmDialog";

interface SideProps {
  activeView: "all" | "completed" | "urgent";
  onViewChange: (view: "all" | "completed" | "urgent") => void;
}

const AnimatedLogo = memo(() => {
  const text = "Taskaya";
  return (
    <div className="flex items-center gap-3">
      <span className="text-3xl animate-bounce">📝</span>
      <h1 className="text-2xl font-black overflow-hidden">
        {text.split("").map((char, i) => (
          <span
            key={i}
            className="inline-block bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent animate-wave"
            style={{
              animationDelay: `${i * 0.1}s`,
              fontFamily: "'Righteous', 'Luckiest Guy', cursive",
            }}
          >
            {char}
          </span>
        ))}
      </h1>
    </div>
  );
});

AnimatedLogo.displayName = "AnimatedLogo";

const NavButton = memo(
  ({
    active,
    icon: Icon,
    label,
    count,
    subtitle,
    onClick,
    variant = "default",
  }: {
    active: boolean;
    icon: any;
    label: string;
    count?: number;
    subtitle?: string;
    onClick: () => void;
    variant?: "default" | "urgent";
  }) => {
    const bgClass = useMemo(() => {
      if (!active)
        return "text-muted-foreground hover:bg-accent hover:text-accent-foreground";
      if (variant === "urgent")
        return "bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg shadow-red-500/25";
      return "bg-gradient-to-r from-primary to-purple-500 text-white shadow-lg shadow-primary/25";
    }, [active, variant]);

    const countClass = useMemo(() => {
      if (!active && variant === "urgent") return "bg-red-500/10 text-red-500";
      if (!active) return "bg-primary/10 text-primary";
      return "bg-white/20 text-white";
    }, [active, variant]);

    return (
      <button
        onClick={onClick}
        className={`w-full flex flex-col gap-2 px-4 py-3 rounded-xl transition-all duration-200 ${bgClass}`}
      >
        <div className="flex items-center gap-3 w-full">
          <Icon className="w-5 h-5 flex-shrink-0" />
          <span className="font-bold flex-1 text-left">{label}</span>
          {count !== undefined && count > 0 && (
            <span
              className={`px-3 py-1 rounded-full text-sm font-black ${countClass} ${
                variant === "urgent" && !active ? "animate-pulse" : ""
              }`}
            >
              {count}
            </span>
          )}
        </div>
        {subtitle && (
          <div className="text-xs opacity-80 pl-8 text-left">{subtitle}</div>
        )}
      </button>
    );
  }
);

NavButton.displayName = "NavButton";

export function Side({ activeView, onViewChange }: SideProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { allTasks } = useTaskStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const taskStats = useMemo(() => {
    const urgentActive = allTasks.filter(
      (t) => t.isUrgent && !t.completed
    ).length;
    const urgentCompleted = allTasks.filter(
      (t) => t.isUrgent && t.completed
    ).length;
    const urgentTotal = urgentActive + urgentCompleted;

    const normalPending = allTasks.filter(
      (t) => !t.isUrgent && !t.completed
    ).length;
    const completedTotal = allTasks.filter((t) => t.completed).length;
    const pendingTotal = urgentActive + normalPending;
    const totalTasks = allTasks.length; // This includes ALL tasks: completed, urgent, pending

    return {
      urgentActive,
      urgentCompleted,
      urgentTotal,
      normalPending,
      completedTotal,
      pendingTotal,
      totalTasks, // Total count = all tasks
    };
  }, [allTasks]);

  const handleLogout = useCallback(async () => {
    await logout();
    setShowLogoutConfirm(false);
    navigate("/auth", { replace: true });
  }, [logout, navigate]);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  const handleViewChange = useCallback(
    (view: "all" | "completed" | "urgent") => {
      onViewChange(view);
      setIsMobileMenuOpen(false);
    },
    [onViewChange]
  );

  const SidebarContent = useMemo(
    () => (
      <>
        <div className="p-6 border-b animate-in fade-in slide-in-from-left-4 duration-500">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center shadow-lg">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-foreground truncate">
                {user?.email}
              </p>
              <p className="text-xs text-muted-foreground">Task Master 🚀</p>
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="bg-gradient-to-br from-primary/10 to-purple-500/10 border-2 border-primary/30 rounded-2xl p-4 animate-in fade-in duration-500">
            <div className="flex items-center gap-2 mb-3">
              <ListTodo className="w-5 h-5 text-primary" />
              <h3 className="font-black text-foreground">Task Overview</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground font-semibold">
                  🔥 Urgent (Total)
                </span>
                <span className="font-black text-red-500 text-lg">
                  {taskStats.urgentTotal}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground font-semibold">
                  📋 Pending Tasks
                </span>
                <span className="font-black text-primary text-lg">
                  {taskStats.pendingTotal}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground font-semibold">
                  ✅ Completed
                </span>
                <span className="font-black text-green-500 text-lg">
                  {taskStats.completedTotal}
                </span>
              </div>
              <div className="pt-2 mt-2 border-t border-border flex justify-between items-center">
                <span className="text-foreground font-bold">Total Tasks</span>
                <span className="font-black text-foreground text-xl">
                  {taskStats.totalTasks}
                </span>
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-auto">
          <div className="animate-in fade-in slide-in-from-left-4 duration-500 delay-100">
            <NavButton
              active={activeView === "all"}
              icon={Clock}
              label="All Tasks"
              count={taskStats.totalTasks}
              subtitle={`${taskStats.urgentTotal} urgent • ${taskStats.completedTotal} completed`}
              onClick={() => handleViewChange("all")}
            />
          </div>

          <div className="animate-in fade-in slide-in-from-left-4 duration-500 delay-150">
            <NavButton
              active={activeView === "urgent"}
              icon={AlertCircle}
              label="Urgent"
              count={taskStats.urgentTotal}
              subtitle={`${taskStats.totalTasks} all tasks • ${taskStats.completedTotal} completed`}
              onClick={() => handleViewChange("urgent")}
              variant="urgent"
            />
          </div>

          <div className="animate-in fade-in slide-in-from-left-4 duration-500 delay-200">
            <NavButton
              active={activeView === "completed"}
              icon={CheckCircle2}
              label="Completed"
              count={taskStats.completedTotal}
              subtitle={`${taskStats.totalTasks} all tasks • ${taskStats.urgentTotal} urgent`}
              onClick={() => handleViewChange("completed")}
            />
          </div>
        </nav>

        <div className="p-4 border-t space-y-3">
          <div className="flex items-center justify-between animate-in fade-in slide-in-from-left-4 duration-500 delay-300">
            <span className="text-sm font-bold text-muted-foreground">
              Theme
            </span>
            <ModeToggle />
          </div>
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200 animate-in fade-in slide-in-from-left-4 duration-500 delay-400"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-bold">Logout</span>
          </button>
        </div>
      </>
    ),
    [user, activeView, taskStats, handleViewChange]
  );

  return (
    <>
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b p-4 flex items-center justify-between">
        <AnimatedLogo />
        <button
          onClick={toggleMobileMenu}
          className="p-2 rounded-lg hover:bg-accent transition-colors"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-72 bg-card border-r flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${
            isMobileMenuOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        <div className="hidden lg:block p-6 border-b animate-in fade-in slide-in-from-left-4 duration-500">
          <AnimatedLogo />
          <p className="text-xs text-muted-foreground mt-2 font-semibold">
            Your productivity companion ✨
          </p>
        </div>

        {SidebarContent}
      </aside>

      <ConfirmDialog
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
        title="Logout Confirmation"
        description="Are you sure you want to logout? You'll need to sign in again to access your tasks."
        confirmText="Yes, Logout"
        cancelText="Cancel"
        variant="warning"
      />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Righteous&display=swap');
        
        @keyframes wave {
          0%, 100% { 
            transform: translateY(0px);
            opacity: 1;
          }
          50% { 
            transform: translateY(-10px);
            opacity: 0.7;
          }
        }
        
        .animate-wave {
          animation: wave 3s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}
