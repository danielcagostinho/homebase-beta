export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { households, householdMembers } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const code = body.code?.trim()?.toUpperCase();

    if (!code) {
      return NextResponse.json(
        { error: "Invite code is required" },
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

    // Find household by code
    const [household] = await db
      .select()
      .from(households)
      .where(eq(households.code, code))
      .limit(1);

    if (!household) {
      return NextResponse.json(
        { error: "Invalid invite code" },
        { status: 404 },
      );
    }

    await db.insert(householdMembers).values({
      householdId: household.id,
      userId: session.user.id,
      role: "member",
    });

    return NextResponse.json(household, { status: 201 });
  } catch (error) {
    console.error("Failed to join household:", error);
    return NextResponse.json(
      { error: "Failed to join household" },
      { status: 500 },
    );
  }
}
