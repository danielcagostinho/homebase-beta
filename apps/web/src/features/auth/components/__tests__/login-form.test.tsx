import { describe, it, expect } from "vitest";
import { renderApp, screen, waitFor, userEvent } from "@/testing/test-utils";
import { LoginForm } from "../login-form";

describe("LoginForm", () => {
  it("renders email and password fields", () => {
    renderApp(<LoginForm />, { session: null });
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });

  it("renders login and Google buttons", () => {
    renderApp(<LoginForm />, { session: null });
    expect(screen.getByText("Log in")).toBeInTheDocument();
    expect(screen.getByText("Continue with Google")).toBeInTheDocument();
  });

  it("shows validation errors for empty fields", async () => {
    const user = userEvent.setup();
    renderApp(<LoginForm />, { session: null });

    await user.click(screen.getByText("Log in"));

    await waitFor(() => {
      expect(screen.getByText("Enter a valid email")).toBeInTheDocument();
    });
  });

  it("shows password validation error", async () => {
    const user = userEvent.setup();
    renderApp(<LoginForm />, { session: null });

    await user.type(screen.getByLabelText("Email"), "test@example.com");
    await user.type(screen.getByLabelText("Password"), "123");
    await user.click(screen.getByText("Log in"));

    await waitFor(() => {
      expect(
        screen.getByText("Password must be at least 6 characters"),
      ).toBeInTheDocument();
    });
  });
});
