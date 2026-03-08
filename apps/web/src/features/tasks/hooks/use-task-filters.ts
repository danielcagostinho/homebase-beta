"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useMemo } from "react";
import type { Task, TaskPriority } from "@/types/task";

export type TaskView = "all" | "overdue" | "today" | "upcoming" | "completed";
export type TaskSort = "due-date" | "priority" | "created" | "alphabetical";

export function useTaskFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const view = (searchParams.get("view") as TaskView) || "all";
  const category = searchParams.get("category") || "";
  const priority = (searchParams.get("priority") as TaskPriority) || "";
  const sort = (searchParams.get("sort") as TaskSort) || "due-date";

  const setFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.replace(`${pathname}?${params.toString()}`);
    },
    [searchParams, router, pathname],
  );

  const filterTasks = useMemo(() => {
    const priorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };

    return (tasks: Task[]) => {
      let filtered = tasks;

      if (view === "completed") {
        filtered = filtered.filter((t) => t.completed);
      } else {
        filtered = filtered.filter((t) => !t.completed);
      }

      const today = new Date().toISOString().split("T")[0] ?? "";

      if (view === "overdue") {
        filtered = filtered.filter((t) => {
          if (!t.dueDate) return false;
          const due = t.dueDate.split("T")[0] ?? "";
          return due < today;
        });
      }

      if (view === "today") {
        filtered = filtered.filter((t) => {
          if (!t.dueDate) return false;
          const due = t.dueDate.split("T")[0] ?? "";
          return due <= today;
        });
      }

      if (view === "upcoming") {
        filtered = filtered.filter((t) => {
          if (!t.dueDate) return false;
          const due = t.dueDate.split("T")[0] ?? "";
          return due > today;
        });
      }

      if (category) {
        filtered = filtered.filter((t) => t.category === category);
      }

      if (priority) {
        filtered = filtered.filter((t) => t.priority === priority);
      }

      return filtered.sort((a, b) => {
        if (sort === "priority") {
          const diff = (priorityOrder[a.priority] ?? 1) - (priorityOrder[b.priority] ?? 1);
          if (diff !== 0) return diff;
        }

        if (sort === "alphabetical") {
          return a.title.localeCompare(b.title);
        }

        if (sort === "created") {
          return b.createdAt.localeCompare(a.createdAt);
        }

        // Default: due-date
        if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate);
        if (a.dueDate) return -1;
        if (b.dueDate) return 1;
        return b.createdAt.localeCompare(a.createdAt);
      });
    };
  }, [view, category, priority, sort]);

  return { view, category, priority, sort, setFilter, filterTasks };
}
