# SLP Pink Studio

A Next.js application with Prisma and Tailwind.

## Development

### Installation

```bash
npm install
npx prisma db push
npm run prisma:seed
npm run dev
```

### Database

Run Prisma migrations and generate the client:

```bash
npm run prisma:migrate
```

### Seeding

```bash
npm run prisma:seed
```

## Session Templates

The app now supports saving common session setups as templates.

- API endpoints under `/api/templates` provide CRUD operations.
- In the schedule session modal you can apply a template or save the current setup as a template.
- Templates can be managed under **Settings → Manage Session Templates**.

## Tests

Run unit tests with:

```bash
npm test
```

## Keyboard Shortcuts

- **N** – New session
- **S** – Save note
- **⌘K / Ctrl+K** – Quick search

## QA Notes

- Initialize the database with `npx prisma db push` or POST to `/api/admin/init-db`.
- Create a session by clicking a 10:00 slot and confirm default time 10:00–10:30.
- Attempt to save a session without times – the client blocks save and the server returns `400`.
- Mark a session seen only when valid times are present.
- Drag and drop a session to reschedule and verify the time persists.
- Keyboard shortcuts: **N** for new session, **S** to save note, **⌘K / Ctrl+K** for search.

## School Closure CSV Format

Upload CSV files with the following columns:

```
date,reason
2024-05-01,Weather
```

## Features

- Student, teacher and classroom management
- Goal tracking and session notes
- Session templates and scheduling
- Quick search with keyboard shortcuts
