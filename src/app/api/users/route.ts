import { NextRequest, NextResponse } from "next/server";
import { users, User } from "@/data/seed";

// In-memory store so mutations persist across requests within one server session
const store = [...users];

export async function GET(req: NextRequest) {
  const url = req.nextUrl;
  const search = (url.searchParams.get("search") || "").toLowerCase();
  const sortBy = url.searchParams.get("sortBy") || "id";
  const sortDir = url.searchParams.get("sortDir") || "asc";
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
  const limit = Math.min(50, Math.max(1, parseInt(url.searchParams.get("limit") || "10", 10)));

  let filtered = store;
  if (search) {
    filtered = filtered.filter(
      (u) =>
        u.name.toLowerCase().includes(search) ||
        u.email.toLowerCase().includes(search) ||
        u.role.includes(search)
    );
  }

  // Sort
  const dir = sortDir === "desc" ? -1 : 1;
  filtered = [...filtered].sort((a, b) => {
    const aVal = a[sortBy as keyof User];
    const bVal = b[sortBy as keyof User];
    if (typeof aVal === "number" && typeof bVal === "number") return (aVal - bVal) * dir;
    return String(aVal).localeCompare(String(bVal)) * dir;
  });

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const data = filtered.slice(start, start + limit);

  return NextResponse.json({ data, total, page, totalPages });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, ...updates } = body;

  const index = store.findIndex((u) => u.id === id);
  if (index === -1) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  store[index] = { ...store[index], ...updates };
  return NextResponse.json(store[index]);
}
