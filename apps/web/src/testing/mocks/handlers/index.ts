import { taskHandlers } from "./tasks";
import { authHandlers } from "./auth";

export const handlers = [...taskHandlers, ...authHandlers];
