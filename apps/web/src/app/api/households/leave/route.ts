export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { households, householdMembers } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Find the user's membership
    const [membership] = await db
      .select()
      .from(householdMembers)
      .where(eq(householdMembers.userId, session.user.id))
      .limit(1);

    if (!membership) {
      return NextResponse.json(
        { error: "You are not in a household" },
        { status: 400 },
      );
    }

    // Check how many members remain
    const allMembers = await db
      .select()
      .from(householdMembers)
      .where(eq(householdMembers.householdId, membership.householdId));

    // Remove the user's membership
    await db
      .delete(householdMembers)
      .where(
        and(
          eq(householdMembers.householdId, membership.householdId),
          eq(householdMembers.userId, session.user.id),
        ),
      );

    // If this was the last member, delete the household
    if (allMembers.length <= 1) {
      await db
        .delete(households)
        .where(eq(households.id, membership.householdId));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to leave household:", error);
    return NextResponse.json(
      { error: "Failed to leave household" },
      { status: 500 },
    );
  }
}
