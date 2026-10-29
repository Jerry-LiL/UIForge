// Deterministic seed data for the mock API.
// Each user has a unique id, name, email, role, status, and join date.

export interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "editor" | "viewer";
  status: "active" | "inactive";
  joinedAt: string;
}

const firstNames = [
  "Alice", "Bob", "Charlie", "Diana", "Eve", "Frank", "Grace", "Hank",
  "Iris", "Jack", "Karen", "Leo", "Mona", "Nate", "Olivia", "Pete",
  "Quinn", "Rosa", "Sam", "Tina", "Uma", "Vic", "Wendy", "Xander",
  "Yara", "Zane", "Ava", "Ben", "Cleo", "Dan", "Ella", "Finn",
  "Gina", "Hugo", "Ivy", "Jon", "Kate", "Liam", "Maya", "Noah",
];

const lastNames = [
  "Smith", "Johnson", "Lee", "Brown", "Garcia", "Miller", "Davis", "Wilson",
  "Taylor", "Anderson", "Thomas", "Moore", "Martin", "Jackson", "White",
  "Harris", "Clark", "Lewis", "Walker", "Hall", "Allen", "Young", "King",
  "Wright", "Hill", "Scott", "Adams", "Baker", "Nelson", "Carter",
  "Mitchell", "Roberts", "Turner", "Phillips", "Campbell", "Parker",
  "Evans", "Edwards", "Collins", "Stewart",
];

const roles: User["role"][] = ["admin", "editor", "viewer"];

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

function generateUsers(count: number): User[] {
  const rand = seededRandom(42);
  const users: User[] = [];

  for (let i = 1; i <= count; i++) {
    const first = firstNames[Math.floor(rand() * firstNames.length)];
    const last = lastNames[Math.floor(rand() * lastNames.length)];
    const name = `${first} ${last}`;
    const email = `${first.toLowerCase()}.${last.toLowerCase()}@example.com`;
    const role = roles[Math.floor(rand() * roles.length)];
    const status = rand() > 0.25 ? "active" : "inactive";

    // Spread join dates across 2024-2025
    const dayOffset = Math.floor(rand() * 700);
    const date = new Date(2024, 0, 1);
    date.setDate(date.getDate() + dayOffset);
    const joinedAt = date.toISOString().split("T")[0];

    users.push({ id: i, name, email, role, status, joinedAt });
  }

  return users;
}

export const users: User[] = generateUsers(48);

// Stats derived from seed data, used by the dashboard
export function getStats() {
  const total = users.length;
  const active = users.filter((u) => u.status === "active").length;
  const admins = users.filter((u) => u.role === "admin").length;
  const editors = users.filter((u) => u.role === "editor").length;

  // Monthly signups for the chart
  const monthlyCounts: Record<string, number> = {};
  for (const u of users) {
    const month = u.joinedAt.slice(0, 7); // "YYYY-MM"
    monthlyCounts[month] = (monthlyCounts[month] || 0) + 1;
  }

  const signupsByMonth = Object.entries(monthlyCounts)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, count]) => ({ month, count }));

  const roleBreakdown = [
    { name: "Admin", value: admins },
    { name: "Editor", value: editors },
    { name: "Viewer", value: total - admins - editors },
  ];

  return { total, active, inactive: total - active, signupsByMonth, roleBreakdown };
}
