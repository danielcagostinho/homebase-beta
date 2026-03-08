"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useMemo } from "react";
import type { Task, TaskPriority } from "@/types/task";

export type TaskView = "all" | "today" | "upcoming" | "completed";

export function useTaskFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const view = (searchParams.get("view") as TaskView) || "all";
  const category = searchParams.get("category") || "";
  const priority = (searchParams.get("priority") as TaskPriority) || "";

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
    return (tasks: Task[]) => {
      let filtered = tasks;

      if (view === "completed") {
        filtered = filtered.filter((t) => t.completed);
      } else {
        filtered = filtered.filter((t) => !t.completed);
      }

      if (view === "today") {
        const today = new Date().toISOString().split("T")[0] ?? "";
        filtered = filtered.filter((t) => {
          if (!t.dueDate) return false;
          const due = t.dueDate.split("T")[0] ?? "";
          return due <= today;
        });
      }

      if (view === "upcoming") {
        const today = new Date().toISOString().split("T")[0] ?? "";
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
        if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate);
        if (a.dueDate) return -1;
        if (b.dueDate) return 1;
        return b.createdAt.localeCompare(a.createdAt);
      });
    };
  }, [view, category, priority]);

  return { view, category, priority, setFilter, filterTasks };
}
