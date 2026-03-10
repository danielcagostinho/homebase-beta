"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { cn } from "@/utils/cn";
import type { Task, TaskPriority } from "@/types/task";
import { getTasksForDate, isToday } from "../hooks/use-calendar-state";
import { CalendarTaskItem } from "./calendar-task-item";

const PRIORITY_ORDER: TaskPriority[] = ["high", "medium", "low"];

const PRIORITY_LABELS: Record<TaskPriority, string> = {
  high: "High Priority",
  medium: "Medium Priority",
  low: "Low Priority",
};

const PRIORITY_INDICATOR: Record<TaskPriority, string> = {
  high: "bg-priority-high",
  medium: "bg-priority-medium",
  low: "bg-priority-low",
};

type DayViewProps = {
  currentDate: Date;
  tasks: Task[];
  onToggleComplete: (taskId: string, completed: boolean) => void;
  onQuickAdd?: (title: string, date: Date) => void;
};

export function DayView({
  currentDate,
  tasks,
  onToggleComplete,
  onQuickAdd,
}: DayViewProps) {
  const [quickAddTitle, setQuickAddTitle] = useState("");
  const dayTasks = getTasksForDate(tasks, currentDate);
  const today = isToday(currentDate);

  const grouped = PRIORITY_ORDER.map((priority) => ({
    priority,
    tasks: dayTasks.filter((t) => t.priority === priority),
  })).filter((g) => g.tasks.length > 0);

  const noTasks = dayTasks.length === 0;

  function handleQuickAdd() {
    const title = quickAddTitle.trim();
    if (!title || !onQuickAdd) return;
    onQuickAdd(title, currentDate);
    setQuickAddTitle("");
  }

  const formattedDate = currentDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Date header */}
      <div className="flex items-center gap-3">
        <h3 className="heading-xs text-foreground">{formattedDate}</h3>
        {today && (
          <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
            Today
          </span>
        )}
      </div>

      {/* Quick add */}
      {onQuickAdd && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleQuickAdd();
          }}
          className="flex gap-2"
        >
          <div className="flex-1">
            <Input
              placeholder="Quick add a task for this day..."
              value={quickAddTitle}
              onChange={(e) => setQuickAddTitle(e.target.value)}
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={!quickAddTitle.trim()}
          >
            <Plus className="mr-1.5 h-4 w-4" />
            Add
          </Button>
        </form>
      )}

      {/* Tasks by priority */}
      {noTasks ? (
        <div className="rounded-lg border border-border bg-muted/50 p-12 text-center body text-muted-foreground">
          No tasks scheduled for this day.
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {grouped.map(({ priority, tasks: groupTasks }) => (
            <div key={priority} className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "h-2.5 w-2.5 rounded-full",
                    PRIORITY_INDICATOR[priority],
                  )}
                />
                <h4 className="label text-foreground">
                  {PRIORITY_LABELS[priority]}
                </h4>
                <span className="caption text-muted-foreground">
                  ({groupTasks.length})
                </span>
              </div>

              <div className="flex flex-col gap-2">
                {groupTasks.map((task) => (
                  <CalendarTaskItem
                    key={task.id}
                    task={task}
                    onToggleComplete={onToggleComplete}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
