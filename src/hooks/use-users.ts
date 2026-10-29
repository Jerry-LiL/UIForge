"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { User } from "@/data/seed";

interface UsersResponse {
  data: User[];
  total: number;
  page: number;
  totalPages: number;
}

interface UsersParams {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
}

async function fetchUsers(params: UsersParams): Promise<UsersResponse> {
  const qs = new URLSearchParams();
  if (params.search) qs.set("search", params.search);
  if (params.page) qs.set("page", String(params.page));
  if (params.limit) qs.set("limit", String(params.limit));
  if (params.sortBy) qs.set("sortBy", params.sortBy);
  if (params.sortDir) qs.set("sortDir", params.sortDir);

  const res = await fetch(`/api/users?${qs}`);
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}

async function updateUser(data: Partial<User> & { id: number }): Promise<User> {
  const res = await fetch("/api/users", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update user");
  return res.json();
}

export function useUsers(params: UsersParams) {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => fetchUsers(params),
    placeholderData: (prev) => prev,
  });
}

// Optimistic update with rollback
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUser,
    onMutate: async (updated) => {
      await queryClient.cancelQueries({ queryKey: ["users"] });

      const previous = queryClient.getQueriesData<UsersResponse>({ queryKey: ["users"] });

      queryClient.setQueriesData<UsersResponse>({ queryKey: ["users"] }, (old) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.map((u) => (u.id === updated.id ? { ...u, ...updated } : u)),
        };
      });

      return { previous };
    },
    onError: (_err, _updated, context) => {
      // Rollback on failure
      if (context?.previous) {
        for (const [key, data] of context.previous) {
          queryClient.setQueryData(key, data);
        }
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
