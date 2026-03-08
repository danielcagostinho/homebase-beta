"use client";

import { use } from "react";
import { TaskDetail } from "@/features/tasks/components/task-detail";

type TaskDetailPageProps = {
  params: Promise<{ taskId: string }>;
};

export default function TaskDetailPage({ params }: TaskDetailPageProps) {
  const { taskId } = use(params);

  return <TaskDetail taskId={taskId} />;
}
