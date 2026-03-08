import { describe, it, expect } from "vitest";
import { renderApp, screen, waitFor, userEvent } from "@/testing/test-utils";
import { RegisterForm } from "../register-form";

describe("RegisterForm", () => {
  it("renders all form fields", () => {
    renderApp(<RegisterForm />, { session: null });
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm password")).toBeInTheDocument();
  });

  it("renders submit and Google buttons", () => {
    renderApp(<RegisterForm />, { session: null });
    expect(screen.getByText("Create account")).toBeInTheDocument();
    expect(screen.getByText("Continue with Google")).toBeInTheDocument();
  });

  it("shows validation error for empty name", async () => {
    const user = userEvent.setup();
    renderApp(<RegisterForm />, { session: null });

    await user.click(screen.getByText("Create account"));

    await waitFor(() => {
      expect(screen.getByText("Name is required")).toBeInTheDocument();
    });
  });

  it("shows error when passwords don't match", async () => {
    const user = userEvent.setup();
    renderApp(<RegisterForm />, { session: null });

    await user.type(screen.getByLabelText("Name"), "Test User");
    await user.type(screen.getByLabelText("Email"), "test@example.com");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.type(screen.getByLabelText("Confirm password"), "different");
    await user.click(screen.getByText("Create account"));

    await waitFor(() => {
      expect(screen.getByText("Passwords don't match")).toBeInTheDocument();
    });
  });
});
