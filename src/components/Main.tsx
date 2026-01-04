// src/components/Main.tsx
import { useEffect, useState, useMemo, useCallback, memo } from "react";
import { useAuthStore, useTaskStore } from "@/store";
import type { Task } from "@/store";
import {
  CheckCircle2,
  Circle,
  Clock,
  Trash2,
  Edit2,
  Calendar,
  Save,
  X,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ConfirmDialog } from "./ConfirmDialog";
import { CustomDatePicker } from "./CustomDatePicker";

const TaskCard = memo(
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
  }: {
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
    onToggleUrgent: (id: number, currentStatus: boolean) => void;
    onStartEdit: (task: Task) => void;
    onDeleteClick: (id: number) => void;
    onSaveEdit: (id: number) => void;
    onCancelEdit: () => void;
  }) => {
    return (
      <div
        className={cn(
          "group bg-card border-2 rounded-2xl p-4 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5",
          task.isUrgent && !task.completed && "border-red-500/50 bg-red-500/5",
          task.completed && "border-green-500/30 bg-green-500/5 opacity-75"
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

export function Main() {
  const { token } = useAuthStore();
  const { tasks, fetchTasks, updateTask, deleteTask, isLoading } =
    useTaskStore();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDeadline, setEditDeadline] = useState("");
  const [editIsUrgent, setEditIsUrgent] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  useEffect(() => {
    if (token) {
      fetchTasks(token, true);
    }
  }, [fetchTasks, token]);

  const stats = useMemo(() => {
    const urgentActive = tasks.filter((t) => t.isUrgent && !t.completed).length;
    const normalActive = tasks.filter(
      (t) => !t.isUrgent && !t.completed
    ).length;
    const completed = tasks.filter((t) => t.completed).length;
    const urgentTotal = tasks.filter((t) => t.isUrgent).length;

    return {
      urgentCount: urgentActive,
      normalCount: normalActive,
      completedCount: completed,
      urgentTotal,
      totalTasks: tasks.length,
    };
  }, [tasks]);

  const sortedTasks = useMemo(() => {
    const urgentActive = tasks.filter((t) => t.isUrgent && !t.completed);
    const normalActive = tasks.filter((t) => !t.isUrgent && !t.completed);
    const completed = tasks.filter((t) => t.completed);
    return [...urgentActive, ...normalActive, ...completed];
  }, [tasks]);

  const handleToggleComplete = useCallback(
    async (id: number, currentStatus: boolean) => {
      if (token) {
        await updateTask(token, id, { completed: !currentStatus });
      }
    },
    [token, updateTask]
  );

  const handleToggleUrgent = useCallback(
    async (id: number, currentStatus: boolean) => {
      if (token) {
        await updateTask(token, id, { isUrgent: !currentStatus });
      }
    },
    [token, updateTask]
  );

  const handleStartEdit = useCallback((task: Task) => {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description || "");
    setEditDeadline(task.deadline || "");
    setEditIsUrgent(task.isUrgent);
  }, []);

  const handleSaveEdit = useCallback(
    async (id: number) => {
      if (!editTitle.trim() || !token) return;

      await updateTask(token, id, {
        title: editTitle,
        description: editDescription || null,
        deadline: editDeadline || null,
        isUrgent: editIsUrgent,
      });
      setEditingId(null);
    },
    [editTitle, editDescription, editDeadline, editIsUrgent, token, updateTask]
  );

  const handleCancelEdit = useCallback(() => {
    setEditingId(null);
  }, []);

  const handleEditChange = useCallback((field: string, value: any) => {
    switch (field) {
      case "title":
        setEditTitle(value);
        break;
      case "description":
        setEditDescription(value);
        break;
      case "deadline":
        setEditDeadline(value);
        break;
      case "isUrgent":
        setEditIsUrgent(value);
        break;
    }
  }, []);

  const handleDelete = useCallback(async () => {
    if (!deleteConfirm || !token) return;
    await deleteTask(token, deleteConfirm);
    setDeleteConfirm(null);
  }, [deleteConfirm, token, deleteTask]);

  const editData = useMemo(
    () => ({
      title: editTitle,
      description: editDescription,
      deadline: editDeadline,
      isUrgent: editIsUrgent,
    }),
    [editTitle, editDescription, editDeadline, editIsUrgent]
  );

  return (
    <div className="flex-1 p-6 space-y-6 overflow-auto">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-3xl font-black text-foreground">
                {stats.totalTasks}
              </p>
              <p className="text-sm font-bold text-muted-foreground">Total</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-orange-500">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-3xl font-black text-foreground">
                {stats.urgentTotal}
              </p>
              <p className="text-sm font-bold text-muted-foreground">Urgent</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-primary/10 to-purple-500/10 border border-primary/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-purple-500">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-3xl font-black text-foreground">
                {stats.normalCount}
              </p>
              <p className="text-sm font-bold text-muted-foreground">Pending</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-3xl font-black text-foreground">
                {stats.completedCount}
              </p>
              <p className="text-sm font-bold text-muted-foreground">
                Completed
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      {sortedTasks.length > 0 ? (
        <div className="space-y-3">
          {stats.urgentCount > 0 && (
            <div className="flex items-center gap-2 px-2 py-1">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <h3 className="text-sm font-black text-red-500 uppercase tracking-wide">
                Urgent Tasks ({stats.urgentCount})
              </h3>
              <div className="flex-1 h-px bg-red-500/30" />
            </div>
          )}

          {sortedTasks
            .filter((t) => t.isUrgent && !t.completed)
            .map((task, idx) => (
              <div
                key={task.id}
                className="animate-in fade-in slide-in-from-left-4"
                style={{ animationDelay: `${idx * 30}ms` }}
              >
                <TaskCard
                  task={task}
                  isEditing={editingId === task.id}
                  editData={editData}
                  onEditChange={handleEditChange}
                  onToggleComplete={handleToggleComplete}
                  onToggleUrgent={handleToggleUrgent}
                  onStartEdit={handleStartEdit}
                  onDeleteClick={setDeleteConfirm}
                  onSaveEdit={handleSaveEdit}
                  onCancelEdit={handleCancelEdit}
                />
              </div>
            ))}

          {stats.normalCount > 0 && (
            <div className="flex items-center gap-2 px-2 py-1 mt-4">
              <Clock className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-black text-primary uppercase tracking-wide">
                Pending Tasks ({stats.normalCount})
              </h3>
              <div className="flex-1 h-px bg-primary/30" />
            </div>
          )}

          {sortedTasks
            .filter((t) => !t.isUrgent && !t.completed)
            .map((task, idx) => (
              <div
                key={task.id}
                className="animate-in fade-in slide-in-from-left-4"
                style={{
                  animationDelay: `${(idx + stats.urgentCount) * 30}ms`,
                }}
              >
                <TaskCard
                  task={task}
                  isEditing={editingId === task.id}
                  editData={editData}
                  onEditChange={handleEditChange}
                  onToggleComplete={handleToggleComplete}
                  onToggleUrgent={handleToggleUrgent}
                  onStartEdit={handleStartEdit}
                  onDeleteClick={setDeleteConfirm}
                  onSaveEdit={handleSaveEdit}
                  onCancelEdit={handleCancelEdit}
                />
              </div>
            ))}

          {stats.completedCount > 0 && (
            <div className="flex items-center gap-2 px-2 py-1 mt-4">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <h3 className="text-sm font-black text-green-500 uppercase tracking-wide">
                Completed Tasks ({stats.completedCount})
              </h3>
              <div className="flex-1 h-px bg-green-500/30" />
            </div>
          )}

          {sortedTasks
            .filter((t) => t.completed)
            .map((task, idx) => (
              <div
                key={task.id}
                className="animate-in fade-in slide-in-from-left-4"
                style={{
                  animationDelay: `${
                    (idx + stats.urgentCount + stats.normalCount) * 30
                  }ms`,
                }}
              >
                <TaskCard
                  task={task}
                  isEditing={editingId === task.id}
                  editData={editData}
                  onEditChange={handleEditChange}
                  onToggleComplete={handleToggleComplete}
                  onToggleUrgent={handleToggleUrgent}
                  onStartEdit={handleStartEdit}
                  onDeleteClick={setDeleteConfirm}
                  onSaveEdit={handleSaveEdit}
                  onCancelEdit={handleCancelEdit}
                />
              </div>
            ))}
        </div>
      ) : (
        <div className="text-center py-20 animate-in fade-in zoom-in duration-500">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-primary/10 to-purple-500/10 mb-4">
            <span className="text-5xl">📝</span>
          </div>
          <h3 className="text-2xl font-black text-foreground mb-2">
            No tasks yet
          </h3>
          <p className="text-muted-foreground font-semibold">
            Create your first task to get started! 🚀
          </p>
        </div>
      )}

      {isLoading && (
        <div className="text-center py-20">
          <div className="inline-block w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteConfirm !== null}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDelete}
        title="Delete Task"
        description="Are you sure you want to delete this task?"
        confirmText="Yes, Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
}
