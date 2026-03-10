import { auth } from "@/lib/auth";
import { getUserFromBearerToken } from "@/lib/auth-mobile";

/**
 * Get the authenticated user from either NextAuth session or mobile Bearer token.
 * Returns { id, email, name } or null if not authenticated.
 */
export async function getAuthUser(
  request?: Request,
): Promise<{ id: string; email?: string | null; name?: string | null } | null> {
  // Try Bearer token first (mobile app)
  if (request) {
    const bearerUser = await getUserFromBearerToken(request);
    if (bearerUser) return bearerUser;
  }

  // Fall back to NextAuth session (web app)
  const session = await auth();
  if (session?.user?.id) {
    return {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
    };
  }

  return null;
}
