"use client";

import { useTasks } from "@/features/tasks/api/get-tasks";
import { Spinner } from "@repo/ui/spinner";
import { TaskCard } from "@/features/tasks/components/task-card";
import { useUpdateTask } from "@/features/tasks/api/update-task";
import type { Task } from "@/types/task";

function getDateString(date: string | Date | null | undefined): string {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0] ?? "";
}

export default function DashboardPage() {
  const { data: tasks, isLoading } = useTasks();
  const updateTask = useUpdateTask();

  const allTasks = (tasks ?? []) as Task[];
  const today = getDateString(new Date());
  const activeTasks = allTasks.filter((t) => !t.completed);
  const overdueTasks = activeTasks.filter(
    (t) => t.dueDate && getDateString(t.dueDate) < today,
  );
  const todayTasks = activeTasks.filter(
    (t) => t.dueDate && getDateString(t.dueDate) === today,
  );
  const completedCount = allTasks.filter((t) => t.completed).length;

  function handleToggleComplete(taskId: string, completed: boolean) {
    updateTask.mutate({ id: taskId, completed });
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <h2 className="heading-md text-foreground">Here&apos;s the Rundown</h2>
        <p className="body text-muted-foreground">
          Your daily overview at a glance.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="flex flex-col gap-1 rounded-lg border border-border p-5">
          <p className="label text-muted-foreground">Overdue</p>
          <p className="stat text-destructive">
            {isLoading ? "—" : overdueTasks.length}
          </p>
        </div>
        <div className="flex flex-col gap-1 rounded-lg border border-border p-5">
          <p className="label text-muted-foreground">Due Today</p>
          <p className="stat text-foreground">
            {isLoading ? "—" : todayTasks.length}
          </p>
        </div>
        <div className="flex flex-col gap-1 rounded-lg border border-border p-5">
          <p className="label text-muted-foreground">Completed</p>
          <p className="stat text-foreground">
            {isLoading ? "—" : completedCount}
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Spinner />
        </div>
      ) : (
        <>
          {overdueTasks.length > 0 && (
            <div className="flex flex-col gap-3">
              <h3 className="heading-xs text-destructive">Overdue</h3>
              {overdueTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggleComplete={handleToggleComplete}
                />
              ))}
            </div>
          )}

          {todayTasks.length > 0 && (
            <div className="flex flex-col gap-3">
              <h3 className="heading-xs text-foreground">Due Today</h3>
              {todayTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggleComplete={handleToggleComplete}
                />
              ))}
            </div>
          )}

          {overdueTasks.length === 0 && todayTasks.length === 0 && (
            <div className="rounded-lg border border-border bg-muted/50 p-12 text-center body text-muted-foreground">
              You&apos;re all caught up! No tasks due today.
            </div>
          )}
        </>
      )}
    </div>
  );
}
