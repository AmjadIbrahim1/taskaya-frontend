// src/components/Search.tsx - FIXED: fetchTasks requires token
import { useState, useEffect, useCallback, memo, useRef } from "react";
import { useAuthStore, useTaskStore } from "@/store";
import { Search as SearchIcon, X, Sparkles, Loader2 } from "lucide-react";

export const Search = memo(() => {
  const { token } = useAuthStore();
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const { tasks, allTasks, filterTasks, fetchTasks } = useTaskStore();
  const debounceTimer = useRef<ReturnType<typeof setTimeout>>();

  // ✅ FIXED: Pass token to fetchTasks
  useEffect(() => {
    const loadAllTasks = async () => {
      if (token) {
        await fetchTasks(token);
      }
    };

    loadAllTasks();
  }, [token, fetchTasks]); // Added fetchTasks to deps

  const debouncedFilter = useCallback(
    (value: string) => {
      setIsSearching(true);

      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      debounceTimer.current = setTimeout(() => {
        filterTasks(value);
        setIsSearching(false);
      }, 300);
    },
    [filterTasks]
  );

  const handleClear = useCallback(() => {
    setQuery("");
    filterTasks("");
    setIsSearching(false);
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
  }, [filterTasks]);

  const handleQueryChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setQuery(value);
      debouncedFilter(value);
    },
    [debouncedFilter]
  );

  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  return (
    <div className="p-6 border-b bg-gradient-to-br from-card/50 to-primary/5 backdrop-blur-sm">
      <div className="relative animate-in fade-in slide-in-from-top-2 duration-500 group">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative">
          <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors z-10" />
          <Sparkles className="absolute left-14 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50 animate-pulse z-10" />
          <input
            type="text"
            value={query}
            onChange={handleQueryChange}
            placeholder="🔍 Search tasks... (instant results)"
            className="w-full pl-24 pr-14 py-4 rounded-2xl bg-background border-2 border-input focus:border-primary focus:ring-4 focus:ring-primary/20 outline-none transition-all duration-200 placeholder:text-muted-foreground font-bold text-lg shadow-lg"
          />
          {isSearching && (
            <Loader2 className="absolute right-14 top-1/2 -translate-y-1/2 w-5 h-5 animate-spin text-primary z-10" />
          )}
          {query && !isSearching && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-5 top-1/2 -translate-y-1/2 p-2 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all hover:scale-110 z-10"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {query && !isSearching && (
          <div className="mt-3 flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="px-4 py-2 rounded-xl bg-primary/10 border border-primary/30">
              <span className="text-sm font-black text-primary">
                {tasks.length === 0 ? (
                  <>😔 No results</>
                ) : (
                  <>
                    ✨ Found {tasks.length}{" "}
                    {tasks.length === 1 ? "task" : "tasks"}
                  </>
                )}
              </span>
            </div>
            <div className="text-xs font-bold text-muted-foreground">
              out of {allTasks.length} total
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

Search.displayName = "Search";
