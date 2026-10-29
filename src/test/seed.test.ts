import { describe, it, expect } from "vitest";
import { users, getStats } from "@/data/seed";

describe("Seed data", () => {
  it("generates 48 users", () => {
    expect(users).toHaveLength(48);
  });

  it("each user has required fields", () => {
    for (const u of users) {
      expect(u.id).toBeGreaterThan(0);
      expect(u.name).toBeTruthy();
      expect(u.email).toContain("@");
      expect(["admin", "editor", "viewer"]).toContain(u.role);
      expect(["active", "inactive"]).toContain(u.status);
      expect(u.joinedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("produces deterministic output", () => {
    // The first user should always be the same with seed 42
    expect(users[0].id).toBe(1);
    expect(users[0].name).toBeTruthy();
  });

  it("has unique ids", () => {
    const ids = users.map((u) => u.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("getStats", () => {
  it("returns correct totals", () => {
    const stats = getStats();
    expect(stats.total).toBe(48);
    expect(stats.active + stats.inactive).toBe(48);
  });

  it("has signupsByMonth data", () => {
    const stats = getStats();
    expect(stats.signupsByMonth.length).toBeGreaterThan(0);
    for (const entry of stats.signupsByMonth) {
      expect(entry.month).toMatch(/^\d{4}-\d{2}$/);
      expect(entry.count).toBeGreaterThan(0);
    }
  });

  it("role breakdown sums to total", () => {
    const stats = getStats();
    const sum = stats.roleBreakdown.reduce((s, r) => s + r.value, 0);
    expect(sum).toBe(stats.total);
  });
});
