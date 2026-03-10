"use client";

import { cn } from "@/utils/cn";
import type { Task } from "@/types/task";
import {
  getMonthDays,
  getTasksForDate,
  isToday,
} from "../hooks/use-calendar-state";
import { CalendarTaskItem } from "./calendar-task-item";

const DAY_HEADERS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MAX_VISIBLE_TASKS = 3;

type MonthViewProps = {
  currentDate: Date;
  tasks: Task[];
  onDayClick: (date: Date) => void;
  onToggleComplete: (taskId: string, completed: boolean) => void;
};

export function MonthView({
  currentDate,
  tasks,
  onDayClick,
  onToggleComplete,
}: MonthViewProps) {
  const days = getMonthDays(currentDate.getFullYear(), currentDate.getMonth());
  const currentMonth = currentDate.getMonth();

  return (
    <div className="flex flex-col">
      {/* Day headers */}
      <div className="grid grid-cols-7 border-b border-border">
        {DAY_HEADERS.map((day) => (
          <div
            key={day}
            className="px-2 py-2 text-center caption font-medium text-muted-foreground"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7">
        {days.map((day, i) => {
          const dayTasks = getTasksForDate(tasks, day);
          const isCurrentMonth = day.getMonth() === currentMonth;
          const today = isToday(day);
          const overflow = dayTasks.length - MAX_VISIBLE_TASKS;

          return (
            <button
              key={i}
              type="button"
              onClick={() => onDayClick(day)}
              className={cn(
                "flex min-h-[120px] flex-col border-b border-r border-border p-1.5 text-left transition-colors hover:bg-muted/50",
                !isCurrentMonth && "bg-muted/30",
                i % 7 === 0 && "border-l",
              )}
            >
              <span
                className={cn(
                  "mb-1 inline-flex h-7 w-7 items-center justify-center rounded-full text-sm",
                  today && "bg-primary text-primary-foreground font-semibold",
                  !today && isCurrentMonth && "text-foreground",
                  !today && !isCurrentMonth && "text-muted-foreground",
                )}
              >
                {day.getDate()}
              </span>

              <div className="flex flex-1 flex-col gap-0.5 overflow-hidden">
                {dayTasks.slice(0, MAX_VISIBLE_TASKS).map((task) => (
                  <CalendarTaskItem
                    key={task.id}
                    task={task}
                    onToggleComplete={onToggleComplete}
                    compact
                  />
                ))}
                {overflow > 0 && (
                  <span className="px-1.5 text-xs text-muted-foreground">
                    +{overflow} more
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
