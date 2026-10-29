import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "@/components/button";
import { Badge } from "@/components/badge";
import { Card } from "@/components/card";
import { Input } from "@/components/input";
import { Select } from "@/components/select";
import { Modal } from "@/components/modal";
import { Tabs } from "@/components/tabs";
import { ToastProvider, useToast } from "@/components/toast";
import { Pagination } from "@/components/pagination";

describe("Button", () => {
  it("renders with children", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
  });

  it("applies variant classes", () => {
    render(<Button variant="danger">Delete</Button>);
    const btn = screen.getByRole("button");
    expect(btn.className).toContain("bg-red-600");
  });

  it("disables when loading", () => {
    render(<Button loading>Saving</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("is disabled when disabled prop is set", () => {
    render(<Button disabled>Nope</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("calls onClick handler", async () => {
    const user = userEvent.setup();
    let clicked = false;
    render(<Button onClick={() => { clicked = true; }}>Go</Button>);
    await user.click(screen.getByRole("button"));
    expect(clicked).toBe(true);
  });
});

describe("Badge", () => {
  it("renders text", () => {
    render(<Badge>Active</Badge>);
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("applies success variant", () => {
    render(<Badge variant="success">Done</Badge>);
    expect(screen.getByText("Done").className).toContain("bg-green-100");
  });
});

describe("Card", () => {
  it("renders children", () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText("Card content")).toBeInTheDocument();
  });

  it("applies padding class", () => {
    const { container } = render(<Card padding="lg">Content</Card>);
    expect(container.firstChild).toHaveClass("p-7");
  });
});

describe("Input", () => {
  it("renders with label", () => {
    render(<Input label="Email" />);
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });

  it("shows error message", () => {
    render(<Input label="Email" error="Required field" />);
    expect(screen.getByRole("alert")).toHaveTextContent("Required field");
  });

  it("sets aria-invalid when there is an error", () => {
    render(<Input label="Name" error="Too short" />);
    expect(screen.getByLabelText("Name")).toHaveAttribute("aria-invalid", "true");
  });

  it("accepts user input", async () => {
    const user = userEvent.setup();
    render(<Input label="Name" />);
    const input = screen.getByLabelText("Name");
    await user.type(input, "Alice");
    expect(input).toHaveValue("Alice");
  });
});

describe("Select", () => {
  const options = [
    { value: "a", label: "Alpha" },
    { value: "b", label: "Beta" },
  ];

  it("renders options", () => {
    render(<Select label="Pick" options={options} />);
    expect(screen.getByLabelText("Pick")).toBeInTheDocument();
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("Beta")).toBeInTheDocument();
  });

  it("renders placeholder", () => {
    render(<Select label="Pick" options={options} placeholder="Choose..." defaultValue="" />);
    expect(screen.getByText("Choose...")).toBeInTheDocument();
  });
});

describe("Modal", () => {
  it("renders content and title when open", () => {
    render(
      <Modal open={true} onClose={() => {}} title="Test Modal">
        <p>Modal body content</p>
      </Modal>
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Test Modal")).toBeInTheDocument();
    expect(screen.getByText("Modal body content")).toBeInTheDocument();
  });

  it("does not render when closed", () => {
    render(
      <Modal open={false} onClose={() => {}} title="Test Modal">
        <p>Modal body content</p>
      </Modal>
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("calls onClose when clicking close button", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <Modal open={true} onClose={onClose} title="Test Modal">
        <p>Modal body content</p>
      </Modal>
    );
    await user.click(screen.getByRole("button", { name: "Close dialog" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when pressing Escape key", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <Modal open={true} onClose={onClose} title="Test Modal">
        <p>Modal body content</p>
      </Modal>
    );
    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

describe("Tabs", () => {
  const sampleTabs = [
    { id: "tab1", label: "Tab 1", content: <div>Content 1</div> },
    { id: "tab2", label: "Tab 2", content: <div>Content 2</div> },
  ];

  it("renders tab labels and default tab content", () => {
    render(<Tabs tabs={sampleTabs} />);
    expect(screen.getByRole("tab", { name: "Tab 1" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Tab 2" })).toBeInTheDocument();
    expect(screen.getByText("Content 1")).toBeInTheDocument();
    expect(screen.queryByText("Content 2")).not.toBeInTheDocument();
  });

  it("switches tab content when clicking another tab", async () => {
    const user = userEvent.setup();
    render(<Tabs tabs={sampleTabs} />);
    await user.click(screen.getByRole("tab", { name: "Tab 2" }));
    expect(screen.getByText("Content 2")).toBeInTheDocument();
    expect(screen.queryByText("Content 1")).not.toBeInTheDocument();
  });

  it("switches tabs with keyboard navigation", async () => {
    const user = userEvent.setup();
    render(<Tabs tabs={sampleTabs} />);
    const firstTab = screen.getByRole("tab", { name: "Tab 1" });
    firstTab.focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByText("Content 2")).toBeInTheDocument();
  });
});

function ToastTestConsumer() {
  const { addToast } = useToast();
  return (
    <div>
      <button onClick={() => addToast("Item updated successfully", "success")}>
        Trigger Toast
      </button>
    </div>
  );
}

describe("Toast", () => {
  it("renders toast when triggered", async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <ToastTestConsumer />
      </ToastProvider>
    );
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    await user.click(screen.getByText("Trigger Toast"));
    expect(screen.getByRole("status")).toHaveTextContent("Item updated successfully");
  });
});

describe("Pagination", () => {
  it("renders page buttons", () => {
    render(<Pagination page={1} totalPages={3} onPageChange={() => {}} />);
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("marks current page", () => {
    render(<Pagination page={2} totalPages={3} onPageChange={() => {}} />);
    expect(screen.getByText("2")).toHaveAttribute("aria-current", "page");
  });

  it("disables prev on first page", () => {
    render(<Pagination page={1} totalPages={3} onPageChange={() => {}} />);
    expect(screen.getByLabelText("Previous page")).toBeDisabled();
  });

  it("disables next on last page", () => {
    render(<Pagination page={3} totalPages={3} onPageChange={() => {}} />);
    expect(screen.getByLabelText("Next page")).toBeDisabled();
  });

  it("calls onPageChange when clicking a page", async () => {
    const user = userEvent.setup();
    let selected = 0;
    render(<Pagination page={1} totalPages={3} onPageChange={(p) => { selected = p; }} />);
    await user.click(screen.getByText("2"));
    expect(selected).toBe(2);
  });

  it("returns null when totalPages is 1", () => {
    const { container } = render(<Pagination page={1} totalPages={1} onPageChange={() => {}} />);
    expect(container.innerHTML).toBe("");
  });
});
