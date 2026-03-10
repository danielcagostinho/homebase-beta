export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getAuthUser } from "@/lib/get-auth-user";
import { checkRateLimit } from "@/lib/rate-limit";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are a helpful assistant that suggests relevant web links for tasks.
Given a task title and category, suggest 2-3 useful URLs the user might need.

For example:
- Cooking tasks → recipe sites (allrecipes.com, budgetbytes.com)
- Medical tasks → appointment booking or health info sites
- Work tasks → relevant productivity tools
- Home maintenance → how-to guides (wikihow.com, thisoldhouse.com)
- Fitness → workout resources, tracking apps

Return ONLY valid JSON: an array of objects with "url" and "label" fields.
Example: [{"url":"https://example.com","label":"Example Resource"}]
No markdown, no explanation.`;

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

  try {
    const body = await request.json();
    const title = typeof body.title === "string" ? body.title.trim().slice(0, 200) : "";
    const category = typeof body.category === "string" ? body.category.trim() : "";

    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 },
      );
    }

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 512,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Task: "${title}"\nCategory: ${category || "general"}`,
        },
      ],
    });

    const content = message.content[0];
    if (!content || content.type !== "text") {
      throw new Error("Unexpected response type");
    }

    const links: { url: string; label: string }[] = JSON.parse(content.text);

    // Validate shape
    const validLinks = Array.isArray(links)
      ? links
          .filter(
            (l) =>
              typeof l.url === "string" &&
              typeof l.label === "string" &&
              l.url.startsWith("http"),
          )
          .slice(0, 5)
      : [];

    return NextResponse.json({ links: validLinks });
  } catch (error) {
    console.error("AI suggest-links error:", error);
    return NextResponse.json({ links: [] });
  }
}
