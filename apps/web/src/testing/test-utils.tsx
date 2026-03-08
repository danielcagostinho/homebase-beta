import {
  render,
  type RenderOptions,
  type RenderResult,
} from "@testing-library/react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import type { ReactElement, ReactNode } from "react";
import type { Session } from "next-auth";

const mockSession: Session = {
  user: { id: "test-user-id", name: "Test User", email: "test@example.com" },
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
};

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });
}

type AppRenderOptions = Omit<RenderOptions, "wrapper"> & {
  session?: Session | null;
};

function createWrapper(session: Session | null = mockSession) {
  return function Wrapper({ children }: { children: ReactNode }) {
    const queryClient = createTestQueryClient();
    return (
      <SessionProvider session={session}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </SessionProvider>
    );
  };
}

export function renderApp(
  ui: ReactElement,
  { session, ...options }: AppRenderOptions = {},
): RenderResult {
  return render(ui, { wrapper: createWrapper(session ?? mockSession), ...options });
}

export { screen, waitFor, within } from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";
