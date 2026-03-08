# HomeBase Coding Guidelines

> Adapted from [bulletproof-react](https://github.com/alan2207/bulletproof-react) for our Next.js 16 + React 19 turborepo monorepo.

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Feature Architecture](#feature-architecture)
3. [Naming Conventions](#naming-conventions)
4. [Components & Styling](#components--styling)
5. [API Layer](#api-layer)
6. [State Management](#state-management)
7. [Forms & Validation](#forms--validation)
8. [Error Handling](#error-handling)
9. [Authentication & Authorization](#authentication--authorization)
10. [Testing](#testing)
11. [Performance](#performance)
12. [Security](#security)
13. [Migration Constraints](#migration-constraints)

---

## Project Structure

```
homebase-beta/
├── apps/
│   ├── web/                        # Primary Next.js app (App Router)
│   │   └── src/
│   │       ├── app/                # Next.js App Router (routes, layouts, pages)
│   │       │   ├── (auth)/         # Auth route group (login, register)
│   │       │   ├── (app)/          # Authenticated route group
│   │       │   │   ├── dashboard/
│   │       │   │   ├── tasks/
│   │       │   │   ├── calendar/
│   │       │   │   └── settings/
│   │       │   ├── layout.tsx      # Root layout
│   │       │   └── providers.tsx   # Global providers wrapper
│   │       ├── components/         # Shared app-level components
│   │       │   ├── ui/             # Base UI primitives (re-exported from @repo/ui)
│   │       │   ├── layouts/        # Layout shells (DashboardLayout, AuthLayout)
│   │       │   └── errors/         # Error boundary components
│   │       ├── config/             # App configuration
│   │       │   ├── paths.ts        # Route path definitions with type-safe helpers
│   │       │   └── env.ts          # Environment variable validation (Zod)
│   │       ├── features/           # Feature modules (see below)
│   │       ├── hooks/              # Shared custom hooks
│   │       ├── lib/                # Pre-configured libraries
│   │       │   ├── api-client.ts   # HTTP client setup
│   │       │   ├── auth.tsx        # Auth configuration
│   │       │   ├── authorization.tsx
│   │       │   └── react-query.ts  # TanStack Query config
│   │       ├── stores/             # Global state (Zustand)
│   │       ├── types/              # Shared TypeScript types
│   │       └── utils/              # Shared utilities
│   └── docs/                       # Internal docs site
├── packages/
│   ├── ui/                         # Shared UI component library
│   ├── eslint-config/              # Shared ESLint configuration
│   └── typescript-config/          # Shared TypeScript configuration
└── docs/                           # Project documentation
```

### Import Rules (Enforced via ESLint)

Data flows in one direction: `packages` -> `shared modules` -> `features` -> `app`

- **Features CANNOT import from other features.** This is the most important rule.
- Features import only from shared modules (`components/`, `hooks/`, `lib/`, `types/`, `utils/`).
- The `app/` layer imports from features and shared modules.
- Use absolute imports via `@/` alias (maps to `src/`).
- Never use deep relative imports like `../../../`.

---

## Feature Architecture

Each feature is a self-contained module under `src/features/`. Not every folder is required — only create what you need.

```
src/features/tasks/
├── api/                  # API calls + React Query hooks
│   ├── get-tasks.ts
│   ├── create-task.ts
│   ├── update-task.ts
│   └── delete-task.ts
├── components/           # Feature-specific components
│   ├── task-list.tsx
│   ├── task-card.tsx
│   ├── create-task-form.tsx
│   └── __tests__/
│       └── task-list.test.tsx
├── hooks/                # Feature-specific hooks
├── stores/               # Feature-specific state
├── types/                # Feature-specific types
└── utils/                # Feature-specific utilities
```

### Expected Features for HomeBase

| Feature         | Description                                    |
| --------------- | ---------------------------------------------- |
| `auth`          | Login, register, session management            |
| `tasks`         | CRUD, filtering, sorting, subtasks, recurring  |
| `calendar`      | Month/week/day views, drag-and-drop            |
| `household`     | Household codes, member management, sharing    |
| `notifications` | Reminders, digests, push notifications         |
| `tags`          | Custom tag CRUD, filtering                     |
| `settings`      | User preferences, category management          |
| `onboarding`    | Setup wizard flow                              |
| `ai`            | Server-side AI proxy, NLP parsing, suggestions |
| `gamification`  | Achievements, streaks, stats                   |

---

## Naming Conventions

### Files & Folders

- **All files and folders:** `kebab-case`
  - `create-task-form.tsx`, `use-disclosure.ts`, `api-client.ts`
- **Exception:** `__tests__/` folder for colocated tests

### Code

| Type                  | Convention                   | Example                      |
| --------------------- | ---------------------------- | ---------------------------- |
| React components      | `PascalCase`                 | `TaskCard`, `CreateTaskForm` |
| Hooks                 | `use` prefix, `camelCase`    | `useDisclosure`, `useTasks`  |
| Types / Interfaces    | `PascalCase`                 | `Task`, `CreateTaskInput`    |
| Constants             | `UPPER_SNAKE_CASE`           | `TASK_PRIORITIES`, `ROLES`   |
| Functions / variables | `camelCase`                  | `formatDate`, `taskCount`    |
| API query keys        | Array of descriptive strings | `['tasks', { page }]`        |

### Import Order

1. React / Next.js built-ins
2. External packages
3. Internal shared modules (`@/lib`, `@/components`, `@/hooks`, `@/utils`)
4. Feature-local imports (`./`, `../`)

---

## Components & Styling

### UI Primitives (`@repo/ui` + `src/components/ui/`)

Build on **Radix UI** for accessible, headless primitives. Style with **Tailwind CSS**.

- Use **CVA (Class Variance Authority)** for component variants.
- Use a `cn()` utility combining `clsx` + `tailwind-merge` for class merging.

```tsx
// packages/ui/src/button.tsx
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/cn";

const buttonVariants = cva("inline-flex items-center rounded-md font-medium", {
  variants: {
    variant: {
      primary: "bg-primary text-white hover:bg-primary/90",
      secondary: "bg-secondary text-secondary-foreground",
      destructive: "bg-destructive text-white",
    },
    size: {
      sm: "h-8 px-3 text-sm",
      md: "h-10 px-4",
      lg: "h-12 px-6 text-lg",
    },
  },
  defaultVariants: { variant: "primary", size: "md" },
});
```

### Tailwind Rules

- **Never use `mt-*` or `mb-*` when `gap-*` on a parent flex/grid achieves the same spacing.** Margin creates coupling between siblings; gap is owned by the container.

  ```tsx
  // Bad
  <div>
    <h2>Title</h2>
    <p className="mt-2">Description</p>
  </div>

  // Good
  <div className="flex flex-col gap-2">
    <h2>Title</h2>
    <p>Description</p>
  </div>
  ```

### Typography

Custom utility classes are defined in `globals.css`. They set font family, size, weight, and line height — **never color**. Apply color separately with `text-foreground`, `text-muted-foreground`, etc.

| Class | Font | Size | Weight | Use for |
|---|---|---|---|---|
| `heading-xl` | Display | 4xl | normal | Hero headings |
| `heading-lg` | Display | 3xl | normal | Auth page brand |
| `heading-md` | Display | 2xl | normal | Page titles |
| `heading-sm` | Display | xl | normal | Sidebar brand |
| `heading-xs` | Display | lg | normal | Mobile header brand |
| `title` | Sans | xl | 600 | Section titles (non-display font) |
| `body-lg` | Sans | base | normal | Prominent body text |
| `body` | Sans | sm | normal | Default body text, descriptions |
| `label` | Sans | sm | 500 | Form labels, stat labels, metadata |
| `stat` | Sans | 2xl | 600 | Dashboard stat values |
| `caption` | Sans | xs | normal | Mobile nav labels, fine print |

```tsx
// Usage — always pair with a color class
<h2 className="heading-md text-foreground">Tasks</h2>
<p className="body text-muted-foreground">Manage your tasks.</p>
<p className="label text-muted-foreground">Overdue</p>
<p className="stat text-foreground">12</p>
```

### Import Rules

- **Never use `React.ReactNode`, `React.HTMLAttributes`, etc.** Import the type directly: `import type { ReactNode } from "react"`.
- **Don't import React** unless you actually need the namespace (you almost never do with the JSX transform).

### Comment Rules

- **No obvious comments.** Don't comment what the code already says (`{/* Sidebar */}`, `{/* Main content */}`). Only comment where the logic isn't self-evident.
- **No phase/TODO comments in shipped code.** Placeholder text is fine in the UI ("Coming soon"), but don't leave `{/* will be added in Phase X */}` comments.

### Component Guidelines

- **Colocate** styles, state, and utilities close to where they're used.
- **Avoid nested render functions** — extract them into separate components.
- **Limit props.** If a component has too many props, use composition via `children` or slots.
- **Prefer composition over configuration:**

```tsx
// Prefer this:
<Dialog>
  <Dialog.Header>Title</Dialog.Header>
  <Dialog.Body>Content</Dialog.Body>
</Dialog>

// Over this:
<Dialog title="Title" content={<Content />} footer={<Footer />} />
```

- Mark client components explicitly with `"use client"` only when needed.
- Default to **Server Components** in Next.js App Router. Push interactivity to leaf components.

---

## API Layer

### Where Code Runs

All data access goes through Next.js API routes because the database (Neon Postgres) requires server-side credentials.

| Data Operation     | Where it Runs                 | Why                                      |
| ------------------ | ----------------------------- | ---------------------------------------- |
| Database CRUD      | **Server-side** (API route)   | DATABASE_URL must stay server-side       |
| Authentication     | **Server-side** (Auth.js)     | Session + credentials handled by Auth.js |
| Anthropic AI calls | **Server-side** (API route)   | API key must stay server-side            |
| Email sending      | **Server-side** (API route)   | Email provider key must stay server-side |
| Scheduled jobs     | **Server-side** (Vercel Cron) | Needs reliable scheduling                |

**Rule of thumb:** All mutations and data fetching go through API routes. React Query hooks on the client call these endpoints with `useQuery` and `useMutation`.

### API Request Pattern (3-Part)

Each API operation has three parts:

**1. Schema + Types (Zod)**

```tsx
// src/features/tasks/api/create-task.ts
import { z } from "zod";

export const createTaskInputSchema = z.object({
  title: z.string().min(1, "Required"),
  categoryId: z.string(),
  priority: z.enum(["high", "medium", "low"]).default("medium"),
  dueDate: z.string().datetime().optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskInputSchema>;
```

**2. Fetcher Function**

```tsx
export const createTask = (data: CreateTaskInput): Promise<Task> => {
  return api.post("/tasks", data);
};
```

**3. React Query Hook**

```tsx
export const useCreateTask = ({ mutationConfig }: Options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTask,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      mutationConfig?.onSuccess?.(...args);
    },
    ...mutationConfig,
  });
};
```

### Query Options Pattern

Define reusable query options for consistency:

```tsx
export const getTasksQueryOptions = (filters?: TaskFilters) => {
  return queryOptions({
    queryKey: filters ? ["tasks", filters] : ["tasks"],
    queryFn: () => getTasks(filters),
  });
};
```

---

## State Management

### Categories of State

| Category             | Tool                           | When to Use                           |
| -------------------- | ------------------------------ | ------------------------------------- |
| **Server cache**     | TanStack React Query           | Any data from an API / database       |
| **Component state**  | `useState`, `useReducer`       | UI state local to a component         |
| **Global app state** | Zustand                        | Notifications, modals, theme, sidebar |
| **Form state**       | React Hook Form                | Form inputs and validation            |
| **URL state**        | `useSearchParams`, `useParams` | Filters, pagination, active tabs      |

### Rules

- **Server state is not app state.** Never duplicate API data into Zustand. Use React Query.
- Keep state as close to where it's used as possible. Lift only when necessary.
- Split global stores by domain (e.g., `useNotificationStore`, `useUIStore`). No god stores.
- URL is state. Persist filter/sort/view preferences in query params where it makes sense.

---

## Forms & Validation

Use **React Hook Form** + **Zod** for all forms.

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createTaskInputSchema,
  type CreateTaskInput,
} from "../api/create-task";

const form = useForm<CreateTaskInput>({
  resolver: zodResolver(createTaskInputSchema),
});
```

- Define the Zod schema once in the API layer. Reuse it in the form and on the server.
- Validate at system boundaries (user input, API routes). Trust internal code.

---

## Error Handling

### API Errors

- Handle in the HTTP client interceptor (toast notifications, 401 redirect).
- Use React Query's `onError` for mutation-specific handling.

### Application Errors

- Use **React Error Boundaries** — multiple, scoped to sections (not one global boundary).
- Each route segment in Next.js can have its own `error.tsx`.

```
app/
├── error.tsx              # Global fallback
├── (app)/
│   ├── tasks/
│   │   └── error.tsx      # Tasks-specific error boundary
│   └── calendar/
│       └── error.tsx      # Calendar-specific error boundary
```

### Production Error Tracking

- Integrate **Sentry** for error monitoring and source map uploads.

---

## Authentication & Authorization

### Authentication

- **Auth.js (NextAuth v5)** for identity (email/password credentials, Google OAuth).
- **Neon Postgres** stores users, sessions, and accounts via Drizzle adapter.
- Session strategy: **JWT** — no server-side session lookups needed.
- Auth state provided via `useSession()` from `next-auth/react`, wrapped in a `useUser()` hook.

### Authorization

**RBAC (Role-Based):**

```tsx
<Authorization allowedRoles={["admin"]}>
  <AdminPanel />
</Authorization>
```

**PBAC (Policy-Based):**

```tsx
const POLICIES = {
  "task:delete": (user: User, task: Task) =>
    user.role === "admin" || task.createdBy === user.id,
};
```

- Protect routes with middleware (`middleware.ts`) for server-side checks.
- Protect UI with `<Authorization>` component for client-side rendering.

---

## Testing

### Strategy

Focus on **integration tests** that test real user workflows. Don't over-unit-test.

| Level       | Tool                     | What to Test                                       |
| ----------- | ------------------------ | -------------------------------------------------- |
| Unit        | Vitest                   | Utility functions, hooks, isolated logic           |
| Integration | Vitest + Testing Library | Feature flows (render component, interact, assert) |
| E2E         | Playwright               | Critical user journeys (auth, create task, etc.)   |

### Testing Utilities

- **MSW (Mock Service Worker)** for intercepting API requests in tests.
- **@mswjs/data** for an in-memory mock database.
- Custom `renderApp()` helper that wraps components in all providers.
- `waitForLoadingToFinish()` to handle async rendering.

### Test Writing Pattern

```tsx
test("should create a new task", async () => {
  renderApp(<CreateTaskForm />);

  await userEvent.type(screen.getByLabelText(/title/i), "Buy groceries");
  await userEvent.click(screen.getByRole("button", { name: /save/i }));

  expect(await screen.findByText("Buy groceries")).toBeInTheDocument();
});
```

### Colocate Tests

Place `__tests__/` folders next to the code they test:

```
features/tasks/components/__tests__/task-list.test.tsx
```

---

## Performance

### Code Splitting

- Next.js handles route-level splitting automatically via the App Router.
- Use `next/dynamic` for heavy client components that aren't needed on initial render.

### Data Prefetching

- Prefetch on hover for navigation links:

```tsx
onMouseEnter={() => queryClient.prefetchQuery(getTaskQueryOptions(id))}
```

- Use Server Components to prefetch data and pass it via `HydrationBoundary` + `dehydrate()`.

### Rendering

- Default to **Server Components**. Only use `"use client"` for interactivity.
- Use `React.lazy` and `Suspense` for deferred client component loading.
- Keep state local. Avoid unnecessary context providers that cause re-renders.

### Styling

- Tailwind CSS is zero-runtime (build-time only). No runtime CSS-in-JS overhead.

---

## Security

> These address the critical findings from [AUDIT_FINDINGS.md](./AUDIT_FINDINGS.md).

### Hard Rules

1. **No API keys in the browser.** All LLM/external API calls go through Next.js API routes.
2. **No `innerHTML` or `dangerouslySetInnerHTML`** without explicit sanitization.
3. **No inline event handlers.** Use React's event system.
4. **httpOnly cookies** for auth tokens. Never localStorage.
5. **Validate all inputs** at system boundaries with Zod — client and server.
6. **API routes** must enforce row-level security. Users access only their own data (filter by `session.user.id`).
7. **CSP headers** configured in `next.config.js` or middleware.

### Content Security Policy

Configure in `next.config.js`:

```js
const securityHeaders = [
  { key: "Content-Security-Policy", value: "default-src 'self'; ..." },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
];
```

---

## Migration Constraints

These are non-negotiable rules for migrating the legacy HomeBase app:

1. **Do NOT copy-paste legacy code.** Rewrite everything using the patterns in this document.
2. **Define typed domain models first** before building UI:
   - `Task`, `Subtask`, `Tag`, `Category`, `User`, `Household`, `Settings`
3. **Server-side data.** All CRUD goes through API routes. React Query caches on the client, Neon Postgres persists.
4. **Eliminate the monolith.** The legacy app is ~7,000 lines in one HTML file. Every feature gets its own module.
5. **Add tests early.** Don't wait until the end. Write integration tests alongside feature code.
6. **Server-side AI.** The Anthropic API proxy must be a Next.js API route with server-side key management.

### Migration Order

1. Domain models + types + Zod schemas
2. Auth flow (Auth.js + JWT session)
3. Task CRUD (core feature)
4. Tags, categories, assignees
5. Calendar views
6. Notifications (durable, server-scheduled)
7. Household sharing
8. AI features (server-proxied)
9. Gamification
10. Onboarding wizard

---

## Quick Reference

### Essential Libraries

| Purpose      | Library                                     |
| ------------ | ------------------------------------------- |
| Framework    | Next.js 16 (App Router)                     |
| UI           | React 19                                    |
| Styling      | Tailwind CSS                                |
| Components   | Radix UI + CVA                              |
| Server cache | TanStack React Query                        |
| Global state | Zustand                                     |
| Forms        | React Hook Form                             |
| Validation   | Zod                                         |
| Database     | Neon Postgres + Drizzle ORM                 |
| Auth         | Auth.js (NextAuth v5) + Drizzle adapter      |
| Testing      | Vitest + Testing Library + Playwright + MSW |
| Linting      | ESLint 9 + Prettier                         |
| Monorepo     | Turborepo + pnpm                            |

### File Checklist for a New Feature

- [ ] `src/features/{name}/types/index.ts` — Types and Zod schemas
- [ ] `src/features/{name}/api/` — API fetchers + React Query hooks
- [ ] `src/features/{name}/components/` — UI components
- [ ] `src/features/{name}/components/__tests__/` — Integration tests
- [ ] `src/app/(app)/{name}/page.tsx` — Route page (if feature has its own page)
