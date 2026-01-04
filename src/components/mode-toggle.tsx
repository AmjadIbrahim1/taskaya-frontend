// src/components/mode-toggle.tsx
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      className="relative flex h-10 w-20 items-center rounded-full border bg-background p-1 shadow-sm transition-colors"
    >
      {/* Sliding indicator */}
      <span
        className={cn(
          "absolute left-1 top-1 h-8 w-8 rounded-full bg-primary shadow transition-all duration-300 ease-in-out",
          isDark ? "translate-x-10" : "translate-x-0"
        )}
      />

      {/* Light */}
      <span
        onClick={() => setTheme("light")}
        className="relative z-10 flex h-8 w-8 items-center justify-center"
      >
        <Sun
          className={cn(
            "h-5 w-5 transition-colors",
            isDark ? "text-muted-foreground" : "text-primary-foreground"
          )}
        />
      </span>

      {/* Dark */}
      <span
        onClick={() => setTheme("dark")}
        className="relative z-10 flex h-8 w-8 items-center justify-center"
      >
        <Moon
          className={cn(
            "h-5 w-5 transition-colors",
            isDark ? "text-primary-foreground" : "text-muted-foreground"
          )}
        />
      </span>
    </button>
  );
}
