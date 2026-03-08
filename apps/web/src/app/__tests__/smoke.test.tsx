import { describe, it, expect } from "vitest";
import { renderApp, screen } from "@/testing/test-utils";
import LandingPage from "../page";

describe("Smoke test", () => {
  it("renders the landing page", () => {
    renderApp(<LandingPage />);
    expect(screen.getByText("HomeBase")).toBeInTheDocument();
    expect(screen.getByText("Log in")).toBeInTheDocument();
    expect(screen.getByText("Sign up")).toBeInTheDocument();
  });
});
