// src/components/AddTask.tsx 
import { useState, useCallback, memo } from "react";
import { useAuthStore, useTaskStore } from "@/store";
import {
  Plus,
  Loader2,
  FileText,
  Calendar as CalendarIcon,
  X,
} from "lucide-react";
import { CustomDatePicker } from "./CustomDatePicker";

export const AddTask = memo(() => {
  const { token } = useAuthStore();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const { addTask, isLoading } = useTaskStore();

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const trimmedTitle = title.trim();

      if (!trimmedTitle || !token) return;

      try {
        await addTask(
          token,
          trimmedTitle,
          description.trim() || undefined,
          deadline || undefined,
          isUrgent
        );

        setTitle("");
        setDescription("");
        setDeadline("");
        setIsUrgent(false);
        setShowDescription(false);
        setShowCalendar(false);
      } catch (error) {
        console.error("Failed to add task:", error);
      }
    },
    [title, description, deadline, isUrgent, addTask, token]
  );

  const handleClearDeadline = useCallback(() => {
    setDeadline("");
  }, []);

  const toggleDescription = useCallback(() => {
    setShowDescription((prev) => !prev);
  }, []);

  const toggleCalendar = useCallback(() => {
    setShowCalendar((prev) => !prev);
  }, []);

  const toggleUrgent = useCallback(() => {
    setIsUrgent((prev) => !prev);
  }, []);

  return (
    <div
      id="mobile-add-task"
      className="p-6 border-b bg-gradient-to-br from-card/50 to-primary/5 backdrop-blur-sm"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="✨ Add a new task..."
            className="flex-1 px-6 py-4 rounded-2xl bg-background border-2 border-input focus:border-primary focus:ring-4 focus:ring-primary/20 outline-none transition-all duration-200 placeholder:text-muted-foreground font-bold text-lg shadow-lg"
            disabled={isLoading}
          />

          <div className="flex gap-3">
            <button
              type="button"
              onClick={toggleDescription}
              className={`flex-1 sm:flex-none p-4 rounded-2xl border-2 transition-all duration-200 shadow-lg hover:scale-105 ${
                showDescription
                  ? "bg-gradient-to-br from-primary to-purple-500 text-white border-primary"
                  : "bg-background text-muted-foreground hover:text-foreground hover:border-primary/50 border-input"
              }`}
              disabled={isLoading}
              title="Add Description"
            >
              <FileText className="w-6 h-6 mx-auto" />
            </button>

            <button
              type="button"
              onClick={toggleCalendar}
              className={`flex-1 sm:flex-none p-4 rounded-2xl border-2 transition-all duration-200 shadow-lg hover:scale-105 ${
                showCalendar || deadline
                  ? "bg-gradient-to-br from-primary to-purple-500 text-white border-primary"
                  : "bg-background text-muted-foreground hover:text-foreground hover:border-primary/50 border-input"
              }`}
              disabled={isLoading}
              title="Set Deadline"
            >
              <CalendarIcon className="w-6 h-6 mx-auto" />
            </button>

            <button
              type="submit"
              disabled={isLoading || !title.trim()}
              className="flex-1 sm:flex-none px-8 py-4 rounded-2xl bg-gradient-to-r from-primary via-purple-500 to-primary text-white font-black text-lg hover:opacity-90 active:scale-95 transition-all duration-200 shadow-xl shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 bg-[length:200%_auto] animate-gradient"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span className="hidden sm:inline">Adding...</span>
                </>
              ) : (
                <>
                  <Plus className="w-6 h-6" />
                  <span className="hidden sm:inline">Add</span>
                </>
              )}
            </button>
          </div>
        </div>

        {showDescription && (
          <div className="animate-in slide-in-from-top-4 duration-300">
            <div className="relative">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add description... (optional)"
                rows={3}
                className="w-full px-6 py-4 pr-12 rounded-2xl bg-background border-2 border-input focus:border-primary focus:ring-4 focus:ring-primary/20 outline-none transition-all duration-200 placeholder:text-muted-foreground resize-none shadow-lg font-semibold"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => {
                  setDescription("");
                  setShowDescription(false);
                }}
                className="absolute top-4 right-4 p-1 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {showCalendar && (
          <div className="flex gap-3 animate-in slide-in-from-top-4 duration-300">
            <div className="flex-1">
              <CustomDatePicker
                value={deadline}
                onChange={setDeadline}
                disabled={isLoading}
              />
            </div>
            <button
              type="button"
              onClick={toggleUrgent}
              className={`px-8 py-4 rounded-2xl border-2 transition-all duration-200 flex items-center gap-3 font-black text-lg shadow-lg hover:scale-105 ${
                isUrgent
                  ? "bg-gradient-to-r from-red-500 to-orange-500 text-white border-red-500 animate-pulse"
                  : "bg-background text-muted-foreground hover:text-foreground hover:border-red-500/50 border-input"
              }`}
              disabled={isLoading}
            >
              <span>{isUrgent ? "🔥 URGENT" : "⭐ Normal"}</span>
            </button>
          </div>
        )}

        {deadline && !showCalendar && (
          <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-xl animate-in fade-in duration-300">
            <CalendarIcon className="w-4 h-4 text-primary" />
            <span className="text-sm font-bold text-primary flex-1">
              Deadline:{" "}
              {new Date(deadline).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <button
              type="button"
              onClick={handleClearDeadline}
              className="p-1 rounded hover:bg-destructive/10 hover:text-destructive transition-all"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
      </form>

      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
});

AddTask.displayName = "AddTask";
