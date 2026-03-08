"use client";

import { Plus } from "lucide-react";
import { Button } from "@repo/ui/button";
import { TaskList } from "@/features/tasks/components/task-list";
import { CreateTaskDialog } from "@/features/tasks/components/create-task-dialog";
import { useState } from "react";

export default function TasksPage() {
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <h2 className="heading-md text-foreground">Tasks</h2>
          <Button onClick={() => setCreateOpen(true)} size="sm">
            <Plus className="mr-1.5 h-4 w-4" />
            New task
          </Button>
        </div>
        <p className="body text-muted-foreground">
          Manage your tasks and stay on top of things.
        </p>
      </div>

      <TaskList />
      <CreateTaskDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
