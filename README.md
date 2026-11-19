# UIForge

A React component library and admin dashboard built with Next.js App Router and Tailwind CSS. It includes reusable UI primitives, an interactive showcase, and an admin view with data tables and charts.

## Stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- TanStack Query v5
- Recharts
- Vitest and React Testing Library

## Getting Started

Install dependencies and start the development server:

```bash
npm install
cp .env.example .env.local
npm run dev
```

The application runs on `http://localhost:3000`.

To create a production build:

```bash
npm run build
npm start
```

## Testing

Run tests, typechecking, and linting:

```bash
npm test
npm run typecheck
npm run lint
```

## Features

- Reusable UI components including Button, Card, Badge, Modal, Table, Input, Select, Tabs, Toast, and Pagination
- Admin dashboard displaying monthly signups and role distribution charts
- Users management table with debounced search, column sorting, and pagination
- Optimistic updates with rollback for user status changes
- Theme toggle with light and dark mode support
- Interactive component showcase at `/components`
- Mock REST endpoints backed by deterministic seed data

## API

- `GET /api/users` - Paginated user list supporting `search`, `page`, `limit`, `sortBy`, and `sortDir`
- `PATCH /api/users` - Update user fields by ID
- `GET /api/stats` - Summary counts and chart datasets

## TODO

- Replace the in-memory data store with a persistent database
- Add form validation using Zod and React Hook Form
- Add multi-field filtering and column visibility toggles to the users table
