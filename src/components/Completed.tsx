// src/components/Completed.tsx
import { useEffect, useState, useMemo, useCallback, memo } from "react";
import { useAuthStore, useTaskStore } from "@/store";
import { useNavigate } from "react-router-dom";
import type { Task } from "@/store";
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
import { ConfirmDialog } from "./ConfirmDialog";
import { CustomDatePicker } from "./CustomDatePicker";

const CompletedTaskCard = memo(
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
      <div className="group bg-gradient-to-br from-green-500/5 to-emerald-500/5 border-2 border-green-500/30 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <div className="flex items-start gap-4">
          <button
            onClick={() => onToggleComplete(task.id, task.completed)}
            className="mt-1 flex-shrink-0 text-green-500 hover:text-muted-foreground transition-all hover:scale-125"
          >
            <CheckCircle2 className="w-6 h-6" />
          </button>

          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={editData.title}
                  onChange={(e) => onEditChange("title", e.target.value)}
                  placeholder="Task title..."
                  className="w-full px-3 py-2 rounded-lg bg-background border-2 border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none font-bold"
                  autoFocus
                />
                <textarea
                  value={editData.description}
                  onChange={(e) => onEditChange("description", e.target.value)}
                  placeholder="Description (optional)..."
                  className="w-full px-3 py-2 rounded-lg bg-background border-2 border-input focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none resize-none"
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
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold hover:opacity-90 transition-all"
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
                    className="text-2xl pointer-events-none select-none"
                    aria-label="Completed task"
                    role="img"
                  >
                    ✅
                  </span>
                  {task.isUrgent && (
                    <span
                      className="text-lg pointer-events-none select-none"
                      aria-label="Urgent task"
                      role="img"
                    >
                      🔥
                    </span>
                  )}
                  <div className="flex-1">
                    <p className="text-muted-foreground font-black text-xl line-through">
                      {task.title}
                    </p>
                    {task.description && (
                      <p className="text-muted-foreground/70 font-semibold text-sm mt-1 line-through">
                        {task.description}
                      </p>
                    )}
                    {task.deadline && (
                      <div className="flex items-center gap-2 mt-3">
                        <div className="px-3 py-1 rounded-lg bg-green-500/20 border border-green-500/30 flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-green-500" />
                          <span className="text-sm font-bold text-green-500">
                            Completed:{" "}
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
                className="p-2 rounded-lg text-green-500 hover:bg-green-500/10 transition-all hover:scale-110"
                title="Mark as incomplete"
              >
                <Circle className="w-4 h-4" />
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
                className="p-2 rounded-lg text-muted-foreground hover:text-green-500 hover:bg-green-500/10 transition-all hover:scale-110"
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

CompletedTaskCard.displayName = "CompletedTaskCard";

export function Completed() {
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const { tasks, getCompletedTasks, updateTask, deleteTask, isLoading } =
    useTaskStore();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDeadline, setEditDeadline] = useState("");
  const [editIsUrgent, setEditIsUrgent] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  useEffect(() => {
    if (token) {
      getCompletedTasks(token);
    }
  }, [getCompletedTasks, token]);

  const completedTasks = useMemo(
    () => tasks.filter((t) => t.completed === true),
    [tasks]
  );

  const stats = useMemo(() => {
    const completedTotal = completedTasks.length;
    const completedUrgent = completedTasks.filter((t) => t.isUrgent).length;
    const completedNormal = completedTotal - completedUrgent;

    return {
      completedTotal,
      completedUrgent,
      completedNormal,
    };
  }, [completedTasks]);

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
        const newUrgentStatus = !currentStatus;
        await updateTask(token, id, { isUrgent: newUrgentStatus });

        if (newUrgentStatus) {
          navigate("/app/urgent");
        }
      }
    },
    [token, updateTask, navigate]
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
          completed: true,
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
    setEditIsUrgent(false);
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
          <div className="p-4 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg shadow-green-500/25">
            <CheckCircle2 className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
              ✅ Completed Tasks
            </h1>
            <p className="text-muted-foreground font-bold">
              Well done! Your finished tasks
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-4 duration-500 delay-100">
        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-2 border-green-500/30 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-muted-foreground mb-1">
                Total Completed
              </p>
              <p className="text-4xl font-black text-foreground">
                {stats.completedTotal}
              </p>
            </div>
            <div className="text-5xl">✅</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border-2 border-red-500/30 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-muted-foreground mb-1">
                Urgent Done
              </p>
              <p className="text-4xl font-black text-foreground">
                {stats.completedUrgent}
              </p>
            </div>
            <div className="text-5xl">🔥</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-2 border-blue-500/30 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-muted-foreground mb-1">
                Normal Done
              </p>
              <p className="text-4xl font-black text-foreground">
                {stats.completedNormal}
              </p>
            </div>
            <div className="text-5xl">📝</div>
          </div>
        </div>
      </div>

      {completedTasks.length > 0 ? (
        <div className="space-y-3">
          {completedTasks.map((task, idx) => (
            <div
              key={task.id}
              className="animate-in fade-in slide-in-from-left-4"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <CompletedTaskCard
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
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-primary/10 to-purple-500/10 mb-4">
            <span className="text-6xl">📝</span>
          </div>
          <h3 className="text-2xl font-black text-foreground mb-2">
            No completed tasks yet
          </h3>
          <p className="text-muted-foreground font-bold">
            Complete some tasks to see them here! 💪
          </p>
        </div>
      )}

      {isLoading && completedTasks.length === 0 && (
        <div className="text-center py-20">
          <div className="inline-block w-10 h-10 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin" />
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteConfirm !== null}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDelete}
        title="Delete Completed Task"
        description="Are you sure you want to delete this completed task? This action cannot be undone."
        confirmText="Yes, Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
}
