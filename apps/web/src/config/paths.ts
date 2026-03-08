export const paths = {
  landing: {
    path: "/",
    getHref: () => "/",
  },
  auth: {
    login: {
      path: "/login",
      getHref: (redirect?: string) =>
        redirect ? `/login?redirect=${encodeURIComponent(redirect)}` : "/login",
    },
    register: {
      path: "/register",
      getHref: () => "/register",
    },
  },
  app: {
    dashboard: {
      path: "/dashboard",
      getHref: () => "/dashboard",
    },
    tasks: {
      path: "/tasks",
      getHref: () => "/tasks",
    },
    task: {
      path: "/tasks/:taskId",
      getHref: (taskId: string) => `/tasks/${taskId}`,
    },
    calendar: {
      path: "/calendar",
      getHref: () => "/calendar",
    },
    settings: {
      path: "/settings",
      getHref: () => "/settings",
    },
  },
} as const;
