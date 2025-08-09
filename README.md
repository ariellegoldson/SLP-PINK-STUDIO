# SLP Pink Studio

A Next.js application with Prisma and Tailwind.

## Development

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
