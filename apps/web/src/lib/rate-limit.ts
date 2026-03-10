const requests = new Map<string, { count: number; resetAt: number }>();

const MAX_REQUESTS = 20;
const WINDOW_MS = 60_000; // 1 minute

export function checkRateLimit(userId: string): { allowed: boolean; retryAfterMs?: number } {
  const now = Date.now();
  const entry = requests.get(userId);

  if (!entry || now >= entry.resetAt) {
    requests.set(userId, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true };
  }

  if (entry.count >= MAX_REQUESTS) {
    return { allowed: false, retryAfterMs: entry.resetAt - now };
  }

  entry.count++;
  return { allowed: true };
}
