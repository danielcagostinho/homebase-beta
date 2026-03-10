import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { tasks } from "@/db/schema";
import { and, eq } from "drizzle-orm";

type Params = { params: Promise<{ taskId: string }> };

export async function GET(_request: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { taskId } = await params;

  const [task] = await db
    .select()
    .from(tasks)
    .where(and(eq(tasks.id, taskId), eq(tasks.userId, session.user.id)))
    .limit(1);

  if (!task) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(task);
}

export async function PATCH(request: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { taskId } = await params;
  const body = await request.json();

  const updates: Record<string, unknown> = { updatedAt: new Date() };

  if (body.title !== undefined) updates.title = body.title;
  if (body.category !== undefined) updates.category = body.category;
  if (body.subcategory !== undefined) updates.subcategory = body.subcategory;
  if (body.priority !== undefined) updates.priority = body.priority;
  if (body.notes !== undefined) updates.notes = body.notes;
  if (body.assignee !== undefined) updates.assignee = body.assignee;
  if (body.subtasks !== undefined) updates.subtasks = body.subtasks;
  if (body.tags !== undefined) updates.tags = body.tags;
  if (body.links !== undefined) updates.links = body.links;
  if (body.starred !== undefined) updates.starred = body.starred;
  if (body.recurring !== undefined) updates.recurring = body.recurring;

  if (body.dueDate !== undefined) {
    updates.dueDate = body.dueDate ? new Date(body.dueDate) : null;
  }

  if (body.completed === true) {
    updates.completed = true;
    updates.completedAt = new Date();
    updates.status = "completed";
  } else if (body.completed === false) {
    updates.completed = false;
    updates.completedAt = null;
    updates.status = "active";
  }

  const [task] = await db
    .update(tasks)
    .set(updates)
    .where(and(eq(tasks.id, taskId), eq(tasks.userId, session.user.id)))
    .returning();

  if (!task) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Auto-generate next occurrence for recurring tasks
  if (body.completed === true && task.recurring) {
    const recurring = task.recurring as {
      frequency: string;
      interval?: number;
      daysOfWeek?: number[];
    };

    const baseDate = task.dueDate ? new Date(task.dueDate) : new Date();
    const nextDueDate = calculateNextDueDate(baseDate, recurring);

    const [nextTask] = await db
      .insert(tasks)
      .values({
        userId: session.user.id,
        title: task.title,
        category: task.category,
        subcategory: task.subcategory,
        priority: task.priority,
        dueDate: nextDueDate,
        subtasks: (task.subtasks as { id: string; title: string; completed: boolean }[]).map(
          (s) => ({ ...s, completed: false }),
        ),
        tags: task.tags as string[],
        assignee: task.assignee,
        recurring: task.recurring,
        notes: task.notes,
        links: task.links as string[],
        starred: task.starred,
      })
      .returning();

    return NextResponse.json({ ...task, nextTask });
  }

  return NextResponse.json(task);
}

export async function DELETE(_request: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { taskId } = await params;

  const [task] = await db
    .delete(tasks)
    .where(and(eq(tasks.id, taskId), eq(tasks.userId, session.user.id)))
    .returning({ id: tasks.id });

  if (!task) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}

function calculateNextDueDate(
  baseDate: Date,
  recurring: { frequency: string; interval?: number; daysOfWeek?: number[] },
): Date {
  const next = new Date(baseDate);

  switch (recurring.frequency) {
    case "daily":
      next.setDate(next.getDate() + 1);
      break;
    case "weekly": {
      // Advance by 7 days by default; if daysOfWeek specified, find the next matching day
      if (recurring.daysOfWeek && recurring.daysOfWeek.length > 0) {
        const currentDay = next.getDay();
        const sorted = [...recurring.daysOfWeek].sort();
        const nextDay = sorted.find((d) => d > currentDay);
        if (nextDay !== undefined) {
          next.setDate(next.getDate() + (nextDay - currentDay));
        } else {
          // Wrap to next week
          next.setDate(next.getDate() + (7 - currentDay + sorted[0]!));
        }
      } else {
        next.setDate(next.getDate() + 7);
      }
      break;
    }
    case "biweekly":
      next.setDate(next.getDate() + 14);
      break;
    case "monthly":
      next.setMonth(next.getMonth() + 1);
      break;
    case "custom":
      next.setDate(next.getDate() + (recurring.interval ?? 1));
      break;
    default:
      next.setDate(next.getDate() + 1);
  }

  return next;
}
