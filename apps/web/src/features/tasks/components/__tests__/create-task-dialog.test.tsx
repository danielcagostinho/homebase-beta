import { describe, it, expect, vi } from "vitest";
import { renderApp, screen, waitFor, userEvent } from "@/testing/test-utils";
import { CreateTaskDialog } from "../create-task-dialog";

describe("CreateTaskDialog", () => {
  it("renders the dialog when open", () => {
    renderApp(
      <CreateTaskDialog open={true} onOpenChange={vi.fn()} />,
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByLabelText("Title")).toBeInTheDocument();
  });

  it("does not render when closed", () => {
    renderApp(
      <CreateTaskDialog open={false} onOpenChange={vi.fn()} />,
    );
    expect(screen.queryByText("Create task")).not.toBeInTheDocument();
  });

  it("shows validation error when submitting empty title", async () => {
    const user = userEvent.setup();
    renderApp(
      <CreateTaskDialog open={true} onOpenChange={vi.fn()} />,
    );

    await user.click(screen.getByText("Create task", { selector: "button" }));

    await waitFor(() => {
      expect(screen.getByText("Title is required")).toBeInTheDocument();
    });
  });

  it("submits form with valid data", async () => {
    const onOpenChange = vi.fn();
    const user = userEvent.setup();

    renderApp(
      <CreateTaskDialog open={true} onOpenChange={onOpenChange} />,
    );

    await user.type(screen.getByLabelText("Title"), "New test task");
    await user.click(screen.getByText("Create task", { selector: "button" }));

    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  it("renders category and priority selects", () => {
    renderApp(
      <CreateTaskDialog open={true} onOpenChange={vi.fn()} />,
    );
    expect(screen.getByText("Category")).toBeInTheDocument();
    expect(screen.getByText("Priority")).toBeInTheDocument();
  });
});
