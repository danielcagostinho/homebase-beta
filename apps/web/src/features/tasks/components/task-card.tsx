"use client";

import Link from "next/link";
import { Checkbox } from "@repo/ui/checkbox";
import { Badge } from "@repo/ui/badge";
import { cn } from "@/utils/cn";
import type { Task } from "@/types/task";
import { DEFAULT_CATEGORIES } from "@/types/category";

type TaskCardProps = {
  task: Task;
  onToggleComplete: (taskId: string, completed: boolean) => void;
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

function isOverdue(dueDate: string | undefined): boolean {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date(new Date().toDateString());
}

export function TaskCard({ task, onToggleComplete }: TaskCardProps) {
  const categoryName =
    DEFAULT_CATEGORIES.find((c) => c.id === task.category)?.name ??
    task.category;

  const overdue = isOverdue(task.dueDate);

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-muted/50",
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

      <div className="flex flex-1 flex-col gap-1.5">
        <Link
          href={`/tasks/${task.id}`}
          className={cn(
            "body font-medium text-foreground hover:text-primary",
            task.completed && "line-through",
          )}
        >
          {task.title}
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={CATEGORY_VARIANTS[task.category] ?? "default"}>
            {categoryName}
          </Badge>
          <Badge variant={PRIORITY_VARIANTS[task.priority]}>
            {task.priority}
          </Badge>
          {task.dueDate && (
            <span
              className={cn(
                "caption",
                overdue ? "text-destructive" : "text-muted-foreground",
              )}
            >
              {overdue && "Overdue: "}
              {new Date(task.dueDate).toLocaleDateString()}
            </span>
          )}
          {task.subtasks.length > 0 && (
            <span className="caption text-muted-foreground">
              {task.subtasks.filter((s) => s.completed).length}/
              {task.subtasks.length} subtasks
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
