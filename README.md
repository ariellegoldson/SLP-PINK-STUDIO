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
