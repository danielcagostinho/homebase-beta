"use client";

import { Spinner } from "@repo/ui/spinner";
import { TaskCard } from "./task-card";
import { TaskFilters } from "./task-filters";
import { useTaskFilters } from "../hooks/use-task-filters";
import { useTasks } from "../api/get-tasks";
import { useUpdateTask } from "../api/update-task";

export function TaskList() {
  const { data: tasks, isLoading } = useTasks();
  const updateTask = useUpdateTask();
  const { view, category, priority, setFilter, filterTasks } =
    useTaskFilters();

  function handleToggleComplete(taskId: string, completed: boolean) {
    updateTask.mutate({ id: taskId, completed });
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner />
      </div>
    );
  }

  const filtered = filterTasks(tasks ?? []);

  return (
    <div className="flex flex-col gap-6">
      <TaskFilters
        view={view}
        category={category}
        priority={priority}
        onFilterChange={setFilter}
      />

      {filtered.length === 0 ? (
        <div className="rounded-lg border border-border bg-muted/50 p-12 text-center body text-muted-foreground">
          {view === "completed"
            ? "No completed tasks yet."
            : "No tasks found. Create one to get started!"}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleComplete={handleToggleComplete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
