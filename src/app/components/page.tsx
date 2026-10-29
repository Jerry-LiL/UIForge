"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import {
  Button,
  Card,
  Badge,
  Input,
  Select,
  Modal,
  Tabs,
  Table,
  Pagination,
} from "@/components";
import { useToast } from "@/components/toast";
import type { Column } from "@/components";

const SignupsChart = dynamic(() => import("@/components/charts/signups-chart"), {
  loading: () => <div className="h-64 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />,
  ssr: false,
});

const RoleChart = dynamic(() => import("@/components/charts/role-chart"), {
  loading: () => <div className="h-64 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />,
  ssr: false,
});

function ButtonShowcase() {
  return (
    <div className="flex flex-wrap gap-3">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="danger">Danger</Button>
      <Button variant="ghost">Ghost</Button>
      <Button size="sm">Small</Button>
      <Button size="lg">Large</Button>
      <Button loading>Loading</Button>
      <Button disabled>Disabled</Button>
    </div>
  );
}

function BadgeShowcase() {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge>Default</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="error">Error</Badge>
      <Badge variant="info">Info</Badge>
    </div>
  );
}

function InputShowcase() {
  return (
    <div className="grid max-w-md gap-4">
      <Input label="Name" placeholder="Enter your name" />
      <Input label="Email" type="email" placeholder="you@example.com" error="Invalid email address" />
      <Select
        label="Country"
        placeholder="Select a country"
        options={[
          { value: "us", label: "United States" },
          { value: "uk", label: "United Kingdom" },
          { value: "ca", label: "Canada" },
        ]}
      />
    </div>
  );
}

function ModalShowcase() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setOpen(true)}>Open Modal</Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Example Modal">
        <p className="text-gray-600 dark:text-gray-400">
          This is an accessible modal dialog. Press Escape, click the close button, or click outside to dismiss.
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={() => setOpen(false)}>Confirm</Button>
        </div>
      </Modal>
    </div>
  );
}

function TabsShowcase() {
  return (
    <Tabs
      tabs={[
        { id: "overview", label: "Overview", content: <p className="text-sm text-gray-600 dark:text-gray-400">Overview content goes here.</p> },
        { id: "settings", label: "Settings", content: <p className="text-sm text-gray-600 dark:text-gray-400">Settings panel content.</p> },
        { id: "logs", label: "Logs", content: <p className="text-sm text-gray-600 dark:text-gray-400">Log entries would appear here.</p> },
      ]}
    />
  );
}

function ToastShowcase() {
  const { addToast } = useToast();

  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="primary" onClick={() => addToast("Operation succeeded", "success")}>
        Success Toast
      </Button>
      <Button variant="danger" onClick={() => addToast("Something went wrong", "error")}>
        Error Toast
      </Button>
      <Button variant="secondary" onClick={() => addToast("Informational update", "info")}>
        Info Toast
      </Button>
    </div>
  );
}

interface SampleRow {
  id: number;
  item: string;
  qty: number;
}

function TableShowcase() {
  const [page, setPage] = useState(1);
  const rows: SampleRow[] = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    item: `Item ${i + 1}`,
    qty: (i + 1) * 3,
  }));

  const cols: Column<SampleRow>[] = [
    { key: "id", header: "ID" },
    { key: "item", header: "Item" },
    { key: "qty", header: "Quantity" },
  ];

  const perPage = 5;
  const totalPages = Math.ceil(rows.length / perPage);
  const visible = rows.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="space-y-3">
      <Table columns={cols} data={visible} keyExtractor={(r) => r.id} />
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}

function ChartShowcase() {
  const sampleSignups = [
    { month: "2024-01", count: 4 },
    { month: "2024-02", count: 7 },
    { month: "2024-03", count: 12 },
    { month: "2024-04", count: 9 },
    { month: "2024-05", count: 15 },
  ];
  const sampleRoles = [
    { name: "Admin", value: 6 },
    { name: "Editor", value: 14 },
    { name: "Viewer", value: 28 },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div>
        <h3 className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">Monthly Signups (Bar)</h3>
        <SignupsChart data={sampleSignups} />
      </div>
      <div>
        <h3 className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">Role Distribution (Donut)</h3>
        <RoleChart data={sampleRoles} />
      </div>
    </div>
  );
}

const sections = [
  { title: "Button", component: <ButtonShowcase /> },
  { title: "Badge", component: <BadgeShowcase /> },
  { title: "Input & Select", component: <InputShowcase /> },
  { title: "Modal", component: <ModalShowcase /> },
  { title: "Tabs", component: <TabsShowcase /> },
  { title: "Toast", component: <ToastShowcase /> },
  { title: "Table & Pagination", component: <TableShowcase /> },
  { title: "Chart Widgets", component: <ChartShowcase /> },
];

export default function ComponentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Components</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Interactive showcase of the UIForge component library.
        </p>
      </div>

      {sections.map((s) => (
        <Card key={s.title}>
          <h2 className="mb-4 text-lg font-semibold">{s.title}</h2>
          {s.component}
        </Card>
      ))}
    </div>
  );
}
