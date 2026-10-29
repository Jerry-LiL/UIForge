import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { GET as getUsers, PATCH as patchUser } from "@/app/api/users/route";
import { GET as getStats } from "@/app/api/stats/route";

describe("API: /api/users", () => {
  it("returns default paginated list of users", async () => {
    const req = new NextRequest("http://localhost:3000/api/users");
    const res = await getUsers(req);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.page).toBe(1);
    expect(body.data.length).toBeLessThanOrEqual(10);
    expect(body.total).toBe(48);
    expect(body.totalPages).toBe(5);
  });

  it("filters users by search query", async () => {
    const req = new NextRequest("http://localhost:3000/api/users?search=Alice");
    const res = await getUsers(req);
    expect(res.status).toBe(200);

    const body = await res.json();
    for (const u of body.data) {
      const match =
        u.name.toLowerCase().includes("alice") ||
        u.email.toLowerCase().includes("alice") ||
        u.role.includes("alice");
      expect(match).toBe(true);
    }
  });

  it("sorts users by specified column", async () => {
    const reqAsc = new NextRequest("http://localhost:3000/api/users?sortBy=name&sortDir=asc&limit=5");
    const resAsc = await getUsers(reqAsc);
    const bodyAsc = await resAsc.json();

    const reqDesc = new NextRequest("http://localhost:3000/api/users?sortBy=name&sortDir=desc&limit=5");
    const resDesc = await getUsers(reqDesc);
    const bodyDesc = await resDesc.json();

    expect(bodyAsc.data[0].name.localeCompare(bodyDesc.data[0].name)).toBeLessThanOrEqual(0);
  });

  it("updates user status via PATCH", async () => {
    const req = new NextRequest("http://localhost:3000/api/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: 1, status: "inactive" }),
    });

    const res = await patchUser(req);
    expect(res.status).toBe(200);

    const updated = await res.json();
    expect(updated.id).toBe(1);
    expect(updated.status).toBe("inactive");
  });

  it("returns 404 when patching non-existent user", async () => {
    const req = new NextRequest("http://localhost:3000/api/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: 9999, status: "active" }),
    });

    const res = await patchUser(req);
    expect(res.status).toBe(404);
  });
});

describe("API: /api/stats", () => {
  it("returns aggregate stats and breakdown data", async () => {
    const res = await getStats();
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body).toHaveProperty("total", 48);
    expect(body).toHaveProperty("active");
    expect(body).toHaveProperty("inactive");
    expect(body).toHaveProperty("signupsByMonth");
    expect(body).toHaveProperty("roleBreakdown");
  });
});
