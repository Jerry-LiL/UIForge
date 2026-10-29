import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Table, Column } from "@/components/table";

interface Row {
  id: number;
  name: string;
  score: number;
}

const columns: Column<Row>[] = [
  { key: "id", header: "ID" },
  { key: "name", header: "Name", sortable: true },
  { key: "score", header: "Score", render: (row) => <strong>{row.score}</strong> },
];

const data: Row[] = [
  { id: 1, name: "Alice", score: 90 },
  { id: 2, name: "Bob", score: 85 },
];

describe("Table", () => {
  it("renders rows and columns", () => {
    render(<Table columns={columns} data={data} keyExtractor={(r) => r.id} />);
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getByText("90")).toBeInTheDocument();
  });

  it("shows empty state", () => {
    render(<Table columns={columns} data={[]} keyExtractor={(r) => r.id} />);
    expect(screen.getByText("No data")).toBeInTheDocument();
  });

  it("renders custom cell via render function", () => {
    render(<Table columns={columns} data={data} keyExtractor={(r) => r.id} />);
    const scoreCell = screen.getByText("90");
    expect(scoreCell.tagName).toBe("STRONG");
  });

  it("calls onSort for sortable columns", async () => {
    const user = userEvent.setup();
    const onSort = vi.fn();
    render(
      <Table
        columns={columns}
        data={data}
        sortKey="name"
        sortDir="asc"
        onSort={onSort}
        keyExtractor={(r) => r.id}
      />
    );
    await user.click(screen.getByText("Name"));
    expect(onSort).toHaveBeenCalledWith("name");
  });

  it("shows sort indicator", () => {
    render(
      <Table
        columns={columns}
        data={data}
        sortKey="name"
        sortDir="asc"
        onSort={() => {}}
        keyExtractor={(r) => r.id}
      />
    );
    const nameHeader = screen.getByRole("columnheader", { name: /Name/ });
    expect(nameHeader).toHaveAttribute("aria-sort", "ascending");
  });
});
