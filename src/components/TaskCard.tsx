// src/components/TaskCard.tsx 
import { memo } from "react";
import {
  CheckCircle2,
  Circle,
  Trash2,
  Edit2,
  Calendar,
  Save,
  X,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Task } from "@/store";
import { CustomDatePicker } from "./CustomDatePicker";

interface TaskCardProps {
  task: Task;
  isEditing: boolean;
  editData: {
    title: string;
    description: string;
    deadline: string;
    isUrgent: boolean;
  };
  onEditChange: (field: string, value: any) => void;
  onToggleComplete: (id: number, status: boolean) => void;
  onToggleUrgent: (id: number, status: boolean) => void;
  onStartEdit: (task: Task) => void;
  onDeleteClick: (id: number) => void;
  onSaveEdit: (id: number) => void;
  onCancelEdit: () => void;
  variant?: "default" | "urgent" | "completed";
}

export const TaskCard = memo(
  ({
    task,
    isEditing,
    editData,
    onEditChange,
    onToggleComplete,
    onToggleUrgent,
    onStartEdit,
    onDeleteClick,
    onSaveEdit,
    onCancelEdit,
    variant = "default",
  }: TaskCardProps) => {
    const borderColor =
      variant === "urgent"
        ? "border-red-500/50 bg-red-500/5"
        : variant === "completed"
        ? "border-green-500/30 bg-green-500/5"
        : task.isUrgent && !task.completed
        ? "border-red-500/50 bg-red-500/5"
        : task.completed
        ? "border-green-500/30 bg-green-500/5"
        : "";

    return (
      <div
        className={cn(
          "group bg-card border-2 rounded-2xl p-4 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5",
          borderColor,
          task.completed && "opacity-75"
        )}
      >
        <div className="flex items-start gap-4">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleComplete(task.id, task.completed);
            }}
            disabled={isEditing}
            className={`mt-1 flex-shrink-0 transition-all hover:scale-110 ${
              task.completed
                ? "text-green-500"
                : "text-muted-foreground hover:text-green-500"
            } ${isEditing ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {task.completed ? (
              <CheckCircle2 className="w-6 h-6" />
            ) : (
              <Circle className="w-6 h-6" />
            )}
          </button>

          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={editData.title}
                  onChange={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onEditChange("title", e.target.value);
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onFocus={(e) => e.target.select()}
                  placeholder="Task title..."
                  className="w-full px-3 py-2 rounded-lg bg-background border-2 border-primary focus:ring-2 focus:ring-primary/20 outline-none font-bold"
                  autoFocus
                />

                <textarea
                  value={editData.description}
                  onChange={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onEditChange("description", e.target.value);
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  placeholder="Description (optional)..."
                  className="w-full px-3 py-2 rounded-lg bg-background border-2 border-input focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                  rows={2}
                />

                <div onClick={(e) => e.stopPropagation()}>
                  <CustomDatePicker
                    value={editData.deadline}
                    onChange={(val) => onEditChange("deadline", val)}
                  />
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onEditChange("isUrgent", !editData.isUrgent);
                  }}
                  className={`w-full px-4 py-2 rounded-lg font-bold transition-all ${
                    editData.isUrgent
                      ? "bg-red-500 text-white"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  {editData.isUrgent ? "🔥 Urgent" : "⭐ Normal"}
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onSaveEdit(task.id);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-purple-500 text-white font-bold hover:opacity-90 transition-all"
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onCancelEdit();
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground font-bold hover:bg-secondary/80 transition-all"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start gap-2">
                  {task.isUrgent && !task.completed && (
                    <span
                      className="text-lg animate-pulse pointer-events-none select-none"
                      aria-label="Urgent task"
                      role="img"
                    >
                      🔥
                    </span>
                  )}
                  {task.completed && (
                    <span
                      className="text-lg pointer-events-none select-none"
                      aria-label="Completed task"
                      role="img"
                    >
                      ✅
                    </span>
                  )}
                  <p
                    className={cn(
                      "text-foreground font-bold text-lg",
                      task.completed && "line-through text-muted-foreground"
                    )}
                  >
                    {task.title}
                  </p>
                </div>
                {task.description && (
                  <p
                    className={cn(
                      "text-sm mt-1",
                      task.completed
                        ? "text-muted-foreground/70 line-through"
                        : "text-muted-foreground"
                    )}
                  >
                    {task.description}
                  </p>
                )}
                {task.deadline && (
                  <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1 font-semibold">
                    <Calendar className="w-3 h-3" />
                    {new Date(task.deadline).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                )}
              </>
            )}
          </div>

          {!isEditing && (
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onToggleComplete(task.id, task.completed);
                }}
                className={`p-2 rounded-lg transition-all hover:scale-110 ${
                  task.completed
                    ? "text-green-500 hover:bg-green-500/10"
                    : "text-muted-foreground hover:text-green-500 hover:bg-green-500/10"
                }`}
                title={task.completed ? "Mark incomplete" : "Mark complete"}
              >
                <CheckCircle2 className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onToggleUrgent(task.id, task.isUrgent);
                }}
                className={`p-2 rounded-lg transition-all hover:scale-110 ${
                  task.isUrgent
                    ? "text-red-500 hover:bg-red-500/10"
                    : "text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                }`}
                title={task.isUrgent ? "Remove urgent" : "Mark urgent"}
              >
                <AlertCircle
                  className={cn("w-4 h-4", task.isUrgent && "fill-red-500")}
                />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onStartEdit(task);
                }}
                className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all hover:scale-110"
              >
                <Edit2 className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDeleteClick(task.id);
                }}
                className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all hover:scale-110"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  },
  (prev, next) => {
    return (
      prev.task.id === next.task.id &&
      prev.task.title === next.task.title &&
      prev.task.completed === next.task.completed &&
      prev.task.isUrgent === next.task.isUrgent &&
      prev.task.description === next.task.description &&
      prev.task.deadline === next.task.deadline &&
      prev.isEditing === next.isEditing &&
      prev.editData.title === next.editData.title &&
      prev.editData.description === next.editData.description &&
      prev.editData.deadline === next.editData.deadline &&
      prev.editData.isUrgent === next.editData.isUrgent
    );
  }
);

TaskCard.displayName = "TaskCard";
