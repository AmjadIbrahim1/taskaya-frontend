// src/components/CustomDatePicker.tsx
import { useState, useRef, useEffect } from "react";
import { Calendar, X, ChevronLeft, ChevronRight } from "lucide-react";

interface CustomDatePickerProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function CustomDatePicker({
  value,
  onChange,
  disabled,
}: CustomDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(
    value ? new Date(value) : new Date()
  );
  const pickerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const clearButtonRef = useRef<HTMLButtonElement>(null);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "Pick a date";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Pick a date";
    }
  };

  const clearDate = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    setIsOpen(false);
  };

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node) &&
        clearButtonRef.current &&
        !clearButtonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  };

  const handleDateSelect = (day: number) => {
    const selectedDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    onChange(selectedDate.toISOString().split("T")[0]);
    setIsOpen(false);
  };

  const isDateSelected = (day: number) => {
    if (!value) return false;
    try {
      const selectedDate = new Date(value);
      return (
        selectedDate.getDate() === day &&
        selectedDate.getMonth() === currentMonth.getMonth() &&
        selectedDate.getFullYear() === currentMonth.getFullYear()
      );
    } catch {
      return false;
    }
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === currentMonth.getMonth() &&
      today.getFullYear() === currentMonth.getFullYear()
    );
  };

  const isPastDate = (day: number) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    checkDate.setHours(0, 0, 0, 0);
    return checkDate < today;
  };

  const { daysInMonth, startingDayOfWeek, year, month } =
    getDaysInMonth(currentMonth);

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: startingDayOfWeek }, (_, i) => i);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="relative w-full">
      {/* Button Container with Clear Button */}
      <div className="relative w-full">
        <button
          ref={buttonRef}
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`w-full px-4 py-3 rounded-xl bg-background border-2 border-input hover:border-primary transition-all duration-200 flex items-center gap-3 group ${
            disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          } ${value ? "border-primary/50 pr-12" : ""}`}
        >
          <Calendar className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
          <span
            className={`text-sm font-bold flex-1 text-left ${
              value ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            {formatDate(value)}
          </span>
        </button>
        
        {/* Clear Button - OUTSIDE the main button */}
        {value && !disabled && (
          <button
            ref={clearButtonRef}
            type="button"
            onClick={clearDate}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-destructive/10 hover:text-destructive transition-all z-10"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Calendar Popup */}
      {isOpen && !disabled && (
        <div 
          ref={pickerRef}
          className="absolute top-full left-0 mt-2 z-50 bg-card border-2 border-primary/30 rounded-2xl shadow-2xl p-4 w-80 animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-2 rounded-lg hover:bg-accent transition-all hover:scale-110"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h3 className="text-base font-black bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              {monthNames[month]} {year}
            </h3>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-2 rounded-lg hover:bg-accent transition-all hover:scale-110"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Day Names */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map((day, i) => (
              <div
                key={i}
                className="text-center text-xs font-bold text-muted-foreground py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {emptyDays.map((_, index) => (
              <div key={`empty-${index}`} className="aspect-square" />
            ))}
            {days.map((day) => {
              const selected = isDateSelected(day);
              const today = isToday(day);
              const past = isPastDate(day);

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleDateSelect(day)}
                  disabled={past}
                  className={`
                    aspect-square rounded-lg text-sm font-bold transition-all hover:scale-110
                    ${
                      selected
                        ? "bg-gradient-to-br from-primary to-purple-500 text-white shadow-lg scale-110"
                        : today
                        ? "bg-primary/10 text-primary border-2 border-primary/30"
                        : past
                        ? "text-muted-foreground/30 cursor-not-allowed"
                        : "hover:bg-accent text-foreground"
                    }
                  `}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="mt-4 pt-3 border-t border-border flex justify-between items-center">
            <button
              type="button"
              onClick={() => {
                const today = new Date();
                onChange(today.toISOString().split("T")[0]);
                setIsOpen(false);
              }}
              className="text-xs font-bold text-primary hover:underline"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-xs font-bold text-muted-foreground hover:text-foreground"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}