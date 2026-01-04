// src/components/Urgent.tsx
import { useEffect, useState, useMemo, useCallback, memo } from "react";
import { useAuthStore, useTaskStore } from "@/store";
import type { Task } from "@/store";
import {
  AlertCircle,
  Circle,
  CheckCircle2,
  Trash2,
  Edit2,
  Calendar,
  Save,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ConfirmDialog } from "./ConfirmDialog";
import { CustomDatePicker } from "./CustomDatePicker";

const UrgentTaskCard = memo(
  ({
    task,
    isEditing,
    onToggleComplete,
    onToggleUrgent,
    onStartEdit,
    onDelete,
    onSaveEdit,
    onCancelEdit,
    editData,
    onEditChange,
  }: {
    task: Task;
    isEditing: boolean;
    onToggleComplete: (id: number, status: boolean) => void;
    onToggleUrgent: (id: number, status: boolean) => void;
    onStartEdit: (task: Task) => void;
    onDelete: (id: number) => void;
    onSaveEdit: (id: number) => void;
    onCancelEdit: () => void;
    editData: {
      title: string;
      description: string;
      deadline: string;
      isUrgent: boolean;
    };
    onEditChange: (field: string, value: any) => void;
  }) => {
    return (
      <div
        className={cn(
          "group bg-gradient-to-br from-red-500/5 to-orange-500/5 border-2 border-red-500/30 rounded-2xl p-4 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1",
          task.completed && "opacity-60"
        )}
      >
        <div className="flex items-start gap-4">
          <button
            onClick={() => onToggleComplete(task.id, task.completed)}
            className="mt-1 flex-shrink-0 text-red-500 hover:text-green-500 transition-all hover:scale-125"
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
                  onChange={(e) => onEditChange("title", e.target.value)}
                  placeholder="Task title..."
                  className="w-full px-3 py-2 rounded-lg bg-background border-2 border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none font-bold"
                  autoFocus
                />
                <textarea
                  value={editData.description}
                  onChange={(e) => onEditChange("description", e.target.value)}
                  placeholder="Description (optional)..."
                  className="w-full px-3 py-2 rounded-lg bg-background border-2 border-input focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none resize-none"
                  rows={2}
                />
                <CustomDatePicker
                  value={editData.deadline}
                  onChange={(val) => onEditChange("deadline", val)}
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
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
                    onClick={() => onSaveEdit(task.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold hover:opacity-90 transition-all"
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </button>
                  <button
                    onClick={onCancelEdit}
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
                  <span
                    className="text-2xl animate-pulse pointer-events-none select-none"
                    aria-label="Urgent task"
                    role="img"
                  >
                    🔥
                  </span>
                  {task.completed && (
                    <span
                      className="text-xl pointer-events-none select-none"
                      aria-label="Completed task"
                      role="img"
                    >
                      ✅
                    </span>
                  )}
                  <div className="flex-1">
                    <p
                      className={cn(
                        "text-foreground font-black text-xl",
                        task.completed && "line-through text-muted-foreground"
                      )}
                    >
                      {task.title}
                    </p>
                    {task.description && (
                      <p
                        className={cn(
                          "text-muted-foreground font-semibold text-sm mt-1",
                          task.completed && "line-through"
                        )}
                      >
                        {task.description}
                      </p>
                    )}
                    {task.deadline && (
                      <div className="flex items-center gap-2 mt-3">
                        <div className="px-3 py-1 rounded-lg bg-red-500/20 border border-red-500/30 flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-red-500" />
                          <span className="text-sm font-bold text-red-500">
                            Due:{" "}
                            {new Date(task.deadline).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {!isEditing && (
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onToggleComplete(task.id, task.completed)}
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
                onClick={() => onToggleUrgent(task.id, task.isUrgent)}
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
                onClick={() => onStartEdit(task)}
                className="p-2 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-all hover:scale-110"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(task.id)}
                className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all hover:scale-110"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
);

UrgentTaskCard.displayName = "UrgentTaskCard";

export function Urgent() {
  const { token } = useAuthStore();
  const { tasks, getUrgentTasks, updateTask, deleteTask, isLoading } =
    useTaskStore();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDeadline, setEditDeadline] = useState("");
  const [editIsUrgent, setEditIsUrgent] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  useEffect(() => {
    if (token) {
      getUrgentTasks(token);
    }
  }, [getUrgentTasks, token]);

  const urgentTasks = useMemo(
    () => tasks.filter((t) => t.isUrgent === true),
    [tasks]
  );

  const stats = useMemo(() => {
    const urgentActive = urgentTasks.filter((t) => !t.completed).length;
    const urgentCompleted = urgentTasks.filter((t) => t.completed).length;
    const urgentTotal = urgentTasks.length;

    return {
      urgentActive,
      urgentCompleted,
      urgentTotal,
    };
  }, [urgentTasks]);

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

  const handleDelete = useCallback(async () => {
    if (deleteConfirm && token) {
      await deleteTask(token, deleteConfirm);
      setDeleteConfirm(null);
    }
  }, [deleteConfirm, token, deleteTask]);

  const startEdit = useCallback((task: Task) => {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description || "");
    setEditDeadline(task.deadline || "");
    setEditIsUrgent(task.isUrgent);
  }, []);

  const saveEdit = useCallback(
    async (id: number) => {
      if (editTitle.trim() && token) {
        await updateTask(token, id, {
          title: editTitle,
          description: editDescription || null,
          deadline: editDeadline || null,
          isUrgent: editIsUrgent,
        });
        setEditingId(null);
      }
    },
    [editTitle, editDescription, editDeadline, editIsUrgent, token, updateTask]
  );

  const cancelEdit = useCallback(() => {
    setEditingId(null);
    setEditTitle("");
    setEditDescription("");
    setEditDeadline("");
    setEditIsUrgent(true);
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
      <div className="animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 shadow-lg shadow-red-500/25 animate-pulse">
            <AlertCircle className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              🔥 Urgent Tasks
            </h1>
            <p className="text-muted-foreground font-bold">
              High priority tasks - showing all urgent items
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-4 duration-500 delay-100">
        <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border-2 border-red-500/30 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-muted-foreground mb-1">
                Active Urgent
              </p>
              <p className="text-4xl font-black text-foreground">
                {stats.urgentActive}
              </p>
            </div>
            <div className="text-5xl">⚠️</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-2 border-blue-500/30 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-muted-foreground mb-1">
                Total Urgent
              </p>
              <p className="text-4xl font-black text-foreground">
                {stats.urgentTotal}
              </p>
            </div>
            <div className="text-5xl">📋</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-2 border-green-500/30 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-muted-foreground mb-1">
                Completed
              </p>
              <p className="text-4xl font-black text-foreground">
                {stats.urgentCompleted}
              </p>
            </div>
            <div className="text-5xl">✅</div>
          </div>
        </div>
      </div>

      {urgentTasks.length > 0 ? (
        <div className="space-y-3">
          {urgentTasks.map((task, idx) => (
            <div
              key={task.id}
              className="animate-in fade-in slide-in-from-left-4"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <UrgentTaskCard
                task={task}
                isEditing={editingId === task.id}
                onToggleComplete={handleToggleComplete}
                onToggleUrgent={handleToggleUrgent}
                onStartEdit={startEdit}
                onDelete={setDeleteConfirm}
                onSaveEdit={saveEdit}
                onCancelEdit={cancelEdit}
                editData={editData}
                onEditChange={handleEditChange}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 animate-in fade-in zoom-in duration-500">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-green-500/10 to-emerald-500/10 mb-4">
            <span className="text-6xl">✨</span>
          </div>
          <h3 className="text-2xl font-black text-foreground mb-2">
            No urgent tasks!
          </h3>
          <p className="text-muted-foreground font-bold">
            You're all caught up. Great job! 🎉
          </p>
        </div>
      )}

      {isLoading && urgentTasks.length === 0 && (
        <div className="text-center py-20">
          <div className="inline-block w-10 h-10 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteConfirm !== null}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDelete}
        title="Delete Urgent Task"
        description="Are you sure you want to delete this urgent task? This action cannot be undone."
        confirmText="Yes, Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
}
