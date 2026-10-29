"use client";

import { useState } from "react";
import { Input, Badge, Card, Table, Pagination } from "@/components";
import type { Column } from "@/components";
import { useUsers, useUpdateUser } from "@/hooks/use-users";
import { useDebounce } from "@/hooks/use-debounce";
import { useToast } from "@/components/toast";
import type { User } from "@/data/seed";

const PAGE_SIZE = 10;

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("id");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const debouncedSearch = useDebounce(search, 300);
  const { addToast } = useToast();

  const { data, isLoading } = useUsers({
    search: debouncedSearch,
    page,
    limit: PAGE_SIZE,
    sortBy,
    sortDir,
  });

  const updateUser = useUpdateUser();

  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(key);
      setSortDir("asc");
    }
    setPage(1);
  };

  const toggleStatus = (user: User) => {
    const newStatus = user.status === "active" ? "inactive" : "active";
    updateUser.mutate(
      { id: user.id, status: newStatus },
      {
        onSuccess: () => addToast(`${user.name} is now ${newStatus}`, "success"),
        onError: () => addToast("Failed to update user", "error"),
      }
    );
  };

  const columns: Column<User>[] = [
    { key: "id", header: "ID", sortable: true },
    { key: "name", header: "Name", sortable: true },
    { key: "email", header: "Email", sortable: true },
    {
      key: "role",
      header: "Role",
      sortable: true,
      render: (row) => (
        <Badge
          variant={
            row.role === "admin" ? "info" : row.role === "editor" ? "warning" : "default"
          }
        >
          {row.role}
        </Badge>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (row) => (
        <button
          onClick={() => toggleStatus(row)}
          className="cursor-pointer"
          title={`Click to toggle status`}
        >
          <Badge variant={row.status === "active" ? "success" : "error"}>
            {row.status}
          </Badge>
        </button>
      ),
    },
    { key: "joinedAt", header: "Joined", sortable: true },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Users</h1>
        <div className="w-full sm:w-72">
          <Input
            placeholder="Search by name, email, or role..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            aria-label="Search users"
          />
        </div>
      </div>

      <Card padding="none">
        {isLoading ? (
          <div className="p-8 text-center text-gray-400">Loading...</div>
        ) : (
          <>
            <Table
              columns={columns}
              data={data?.data || []}
              sortKey={sortBy}
              sortDir={sortDir}
              onSort={handleSort}
              keyExtractor={(row) => row.id}
            />
            {data && (
              <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3 dark:border-gray-700">
                <span className="text-sm text-gray-500">
                  {data.total} user{data.total !== 1 ? "s" : ""} total
                </span>
                <Pagination
                  page={data.page}
                  totalPages={data.totalPages}
                  onPageChange={setPage}
                />
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
}
