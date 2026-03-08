import { http, HttpResponse } from "msw";

export const authHandlers = [
  http.post("/api/auth/register", async ({ request }) => {
    const body = await request.json() as Record<string, unknown>;

    if (!body.name || !body.email || !body.password) {
      return HttpResponse.json(
        { error: "Name, email, and password are required." },
        { status: 400 },
      );
    }

    if ((body.password as string).length < 6) {
      return HttpResponse.json(
        { error: "Password must be at least 6 characters." },
        { status: 400 },
      );
    }

    if (body.email === "taken@example.com") {
      return HttpResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 },
      );
    }

    return HttpResponse.json({ id: "new-user-id" }, { status: 201 });
  }),
];
