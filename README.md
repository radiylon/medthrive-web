# Medthrive Web

A companion app for caregivers to manage patient medications and dosage schedules.

## Features

- **Patient Management** - Create, view, and edit patient profiles with medical details, allergies, emergency contacts, and avatars
- **Medication Management** - Add and manage medications with dosage, quantity, RX numbers, and configurable schedules
- **Dose Tracking** - Track doses as taken/untaken with undo functionality and progress indicators
- **Today's Dashboard** - View all scheduled doses across patients organized by time of day with completion progress
- **Search & Filter** - Find patients quickly by name

## Tech Stack

- **Framework**: Next.js, React, TypeScript
- **Styling**: Tailwind CSS, daisyUI
- **API**: tRPC
- **Database**: Drizzle ORM, Neon (PostgreSQL)
- **Testing**: Vitest, React Testing Library

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## Database Setup

Create a `.env` file with your Neon database URL:

```
DATABASE_URL=postgresql://...
```

Push the schema to your database:

```bash
pnpm db:push
```
