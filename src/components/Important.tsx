// src/components/Important.tsx
import { useEffect } from 'react';
import { useTaskStore } from '@/store';
import { Star, Circle, CheckCircle2, Trash2, Edit2, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Important() {
  const { tasks, fetchTasks, completeTask, deleteTask, isLoading } = useTaskStore();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Filter tasks with deadlines (important tasks)
  const importantTasks = tasks.filter(t => t.deadline && !t.completed);

  const handleComplete = async (id: number) => {
    await completeTask(id);
  };

  const handleDelete = async (id: number) => {
    await deleteTask(id);
  };

  return (
    <div className="flex-1 p-6 space-y-6 overflow-auto">
      {/* Header */}
      <div className="animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-amber-500/10">
            <Star className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Important Tasks</h1>
            <p className="text-muted-foreground">Tasks with deadlines</p>
          </div>
        </div>
      </div>

      {/* Important Tasks List */}
      {importantTasks.length > 0 ? (
        <div className="space-y-3">
          {importantTasks.map((task, idx) => (
            <div
              key={task.id}
              className={cn(
                "group bg-card border border-amber-500/20 rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5",
                "animate-in fade-in slide-in-from-left-4"
              )}
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className="flex items-start gap-4">
                <button
                  onClick={() => handleComplete(task.id)}
                  className="mt-1 flex-shrink-0 text-muted-foreground hover:text-primary transition-colors"
                >
                  <Circle className="w-5 h-5" />
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <p className="text-foreground font-medium">{task.description}</p>
                      {task.deadline && (
                        <p className="text-sm text-amber-600 dark:text-amber-400 mt-2 flex items-center gap-1 font-medium">
                          <Calendar className="w-4 h-4" />
                          Due: {new Date(task.deadline).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 animate-in fade-in zoom-in duration-500">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-500/10 mb-4">
            <Star className="w-10 h-10 text-amber-500" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">No important tasks</h3>
          <p className="text-muted-foreground">Add deadlines to tasks to mark them as important</p>
        </div>
      )}

      {isLoading && importantTasks.length === 0 && (
        <div className="text-center py-20">
          <div className="inline-block w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}