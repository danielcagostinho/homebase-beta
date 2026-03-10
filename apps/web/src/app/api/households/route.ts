export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { households, householdMembers } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const membership = await db
    .select({
      id: households.id,
      name: households.name,
      code: households.code,
      createdBy: households.createdBy,
      createdAt: households.createdAt,
      role: householdMembers.role,
    })
    .from(householdMembers)
    .innerJoin(households, eq(householdMembers.householdId, households.id))
    .where(eq(householdMembers.userId, session.user.id))
    .limit(1);

  if (membership.length === 0) {
    return NextResponse.json(null);
  }

  return NextResponse.json(membership[0]);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const name = body.name?.trim();

    if (!name) {
      return NextResponse.json(
        { error: "Household name is required" },
        { status: 400 },
      );
    }

    // Check if user already belongs to a household
    const existing = await db
      .select()
      .from(householdMembers)
      .where(eq(householdMembers.userId, session.user.id))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "You already belong to a household" },
        { status: 400 },
      );
    }

    const code = Math.random().toString(36).substring(2, 8).toUpperCase();

    const [household] = await db
      .insert(households)
      .values({
        name,
        code,
        createdBy: session.user.id,
      })
      .returning();

    if (!household) {
      return NextResponse.json(
        { error: "Failed to create household" },
        { status: 500 },
      );
    }

    await db.insert(householdMembers).values({
      householdId: household.id,
      userId: session.user.id,
      role: "owner",
    });

    return NextResponse.json(household, { status: 201 });
  } catch (error) {
    console.error("Failed to create household:", error);
    return NextResponse.json(
      { error: "Failed to create household" },
      { status: 500 },
    );
  }
}
