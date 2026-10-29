"use client";

import dynamic from "next/dynamic";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components";

const SignupsChart = dynamic(() => import("@/components/charts/signups-chart"), {
  loading: () => <div className="h-64 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />,
  ssr: false,
});

const RoleChart = dynamic(() => import("@/components/charts/role-chart"), {
  loading: () => <div className="h-64 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />,
  ssr: false,
});

interface Stats {
  total: number;
  active: number;
  inactive: number;
  signupsByMonth: { month: string; count: number }[];
  roleBreakdown: { name: string; value: number }[];
}

export default function DashboardPage() {
  const { data: stats, isLoading } = useQuery<Stats>({
    queryKey: ["stats"],
    queryFn: async () => {
      const res = await fetch("/api/stats");
      if (!res.ok) throw new Error("Failed to fetch stats");
      return res.json();
    },
  });

  if (isLoading || !stats) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800" />
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    { label: "Total Users", value: stats.total },
    { label: "Active", value: stats.active },
    { label: "Inactive", value: stats.inactive },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-3">
        {statCards.map((s) => (
          <Card key={s.label}>
            <p className="text-sm text-gray-500 dark:text-gray-400">{s.label}</p>
            <p className="mt-1 text-3xl font-semibold">{s.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 text-lg font-semibold">Monthly Signups</h2>
          <SignupsChart data={stats.signupsByMonth} />
        </Card>
        <Card>
          <h2 className="mb-4 text-lg font-semibold">Roles</h2>
          <RoleChart data={stats.roleBreakdown} />
        </Card>
      </div>
    </div>
  );
}
