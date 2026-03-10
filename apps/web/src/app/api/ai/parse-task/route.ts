export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getAuthUser } from "@/lib/get-auth-user";
import { checkRateLimit } from "@/lib/rate-limit";
import { DEFAULT_CATEGORIES } from "@/types/category";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const categoryDescription = DEFAULT_CATEGORIES.map(
  (c) =>
    `${c.id} (${c.name}) — subcategories: ${c.subcategories.map((s) => s.id).join(", ")}`,
).join("\n");

function buildSystemPrompt(): string {
  return `You are a task parser. Extract structured task information from natural language input.

Available categories:
${categoryDescription}

Available priorities: high, medium, low.
Today's date is ${new Date().toISOString().split("T")[0]}.

Return JSON with these fields (omit if not mentioned):
- title: string (the core task description, cleaned up and concise)
- category: string (one of the category IDs: family-home, personal, work-career)
- subcategory: string (one of the subcategory IDs if applicable)
- priority: "high" | "medium" | "low"
- dueDate: ISO 8601 datetime string (e.g. "2026-03-15T15:00:00.000Z")
- tags: string[] (any relevant tags or labels)
- notes: string (any additional context not captured in other fields)

Return ONLY valid JSON, no markdown, no explanation.`;
}

export async function POST(request: Request) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { allowed, retryAfterMs } = checkRateLimit(user.id);
  if (!allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded", retryAfterMs },
      { status: 429 },
    );
  }

  const body = await request.json().catch(() => ({}));
  const rawText = typeof body.text === "string" ? body.text : "";
  const text = rawText.trim().slice(0, 500);

  if (!text) {
    return NextResponse.json(
      { error: "Text input is required" },
      { status: 400 },
    );
  }

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 512,
      system: buildSystemPrompt(),
      messages: [{ role: "user", content: text }],
    });

    const content = message.content[0];
    if (!content || content.type !== "text") {
      throw new Error("Unexpected response type");
    }

    const parsed = JSON.parse(content.text);

    // Validate category is one of the known IDs
    const validCategoryIds = DEFAULT_CATEGORIES.map((c) => c.id);
    if (parsed.category && !validCategoryIds.includes(parsed.category)) {
      parsed.category = "personal";
    }

    // Validate priority
    const validPriorities = ["high", "medium", "low"];
    if (parsed.priority && !validPriorities.includes(parsed.priority)) {
      parsed.priority = "medium";
    }

    return NextResponse.json({ parsed });
  } catch (error) {
    console.error("AI parse-task error:", error);

    // Fallback: return the raw text as the title
    return NextResponse.json({
      parsed: {
        title: text || "New task",
        category: "personal",
        priority: "medium",
      },
    });
  }
}
