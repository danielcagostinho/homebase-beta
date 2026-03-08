import { vi } from "vitest";

const push = vi.fn();
const replace = vi.fn();
const back = vi.fn();

export const useRouter = vi.fn(() => ({ push, replace, back }));
export const usePathname = vi.fn(() => "/tasks");
export const useSearchParams = vi.fn(() => new URLSearchParams());
