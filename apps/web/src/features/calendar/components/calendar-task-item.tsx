"use client";

import Link from "next/link";
import { Checkbox } from "@repo/ui/checkbox";
import { Badge } from "@repo/ui/badge";
import { cn } from "@/utils/cn";
import type { Task } from "@/types/task";
import { DEFAULT_CATEGORIES } from "@/types/category";

type CalendarTaskItemProps = {
  task: Task;
  onToggleComplete: (taskId: string, completed: boolean) => void;
  compact?: boolean;
};

const PRIORITY_COLORS: Record<string, string> = {
  high: "bg-priority-high",
  medium: "bg-priority-medium",
  low: "bg-priority-low",
};

const PRIORITY_VARIANTS = {
  high: "high",
  medium: "medium",
  low: "low",
} as const;

const CATEGORY_VARIANTS: Record<string, "home" | "personal" | "work"> = {
  "family-home": "home",
  personal: "personal",
  "work-career": "work",
};

export function CalendarTaskItem({
  task,
  onToggleComplete,
  compact = false,
}: CalendarTaskItemProps) {
  const categoryName =
    DEFAULT_CATEGORIES.find((c) => c.id === task.category)?.name ??
    task.category;

  if (compact) {
    return (
      <Link
        href={`/tasks/${task.id}`}
        className={cn(
          "flex items-center gap-1.5 rounded px-1.5 py-0.5 text-xs transition-colors hover:bg-muted",
          task.completed && "opacity-50 line-through",
        )}
      >
        <span
          className={cn(
            "h-1.5 w-1.5 shrink-0 rounded-full",
            PRIORITY_COLORS[task.priority] ?? "bg-muted-foreground",
          )}
        />
        <span className="truncate text-foreground">{task.title}</span>
      </Link>
    );
  }

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/50",
        task.completed && "opacity-60",
      )}
    >
      <Checkbox
        checked={task.completed}
        onCheckedChange={(checked) =>
          onToggleComplete(task.id, checked === true)
        }
        className="mt-0.5"
      />

      <div className="flex flex-1 flex-col gap-1">
        <Link
          href={`/tasks/${task.id}`}
          className={cn(
            "text-sm font-medium text-foreground hover:text-primary transition-colors",
            task.completed && "line-through",
          )}
        >
          {task.title}
        </Link>

        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant={CATEGORY_VARIANTS[task.category] ?? "default"}>
            {categoryName}
          </Badge>
          <Badge variant={PRIORITY_VARIANTS[task.priority]}>
            {task.priority}
          </Badge>
        </div>
      </div>
    </div>
  );
}
