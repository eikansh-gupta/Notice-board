# Notice Board

A full-stack CRUD Notice Board built with Next.js (Pages Router) and Prisma, backed by a hosted PostgreSQL database (Neon).

## Live Demo

- App: [add your Vercel URL here after deployment]
- Repo: [add your GitHub URL here]

## Features

- Create, read, update, and delete notices
- Categories: Exam, Event, General
- Priority levels: Normal, Urgent — Urgent notices always appear above Normal ones (sorted at the database level via Prisma `orderBy`, not in the browser)
- Optional image (via URL) per notice
- Responsive card grid (mobile, tablet, desktop)
- Delete requires explicit confirmation
- Server-side validation on every write operation — never relies on frontend checks alone
- Data persists in a hosted PostgreSQL database; nothing is lost on refresh or redeploy

## Tech Stack

- **Framework:** Next.js (Pages Router)
- **ORM:** Prisma
- **Database:** PostgreSQL, hosted on Neon
- **Styling:** Tailwind CSS
- **Hosting:** Vercel
- **Language:** JavaScript

## Folder Structure

notice-board/
├── prisma/
│   └── schema.prisma
├── lib/
│   └── prisma.js
├── components/
│   ├── NoticeCard.js
│   ├── NoticeForm.js
│   ├── PriorityBadge.js
│   └── EmptyState.js
├── pages/
│   ├── index.js
│   ├── notice/
│   │   ├── new.js
│   │   └── [id].js
│   └── api/
│       └── notices/
│           ├── index.js
│           └── [id].js
├── styles/
│   └── globals.css
└── README.md

## API Endpoints

| Method | Route | Description |
|---|---|---|
| GET | `/api/notices` | Returns all notices, Urgent-first |
| POST | `/api/notices` | Creates a new notice |
| GET | `/api/notices/[id]` | Returns a single notice by id |
| PUT | `/api/notices/[id]` | Updates a notice by id |
| DELETE | `/api/notices/[id]` | Deletes a notice by id |

All write operations validate `title`, `body`, `category`, `priority`, and `publishDate` on the server and return `400` with field-level errors on failure.

## Installation

```bash
git clone <your-repo-url>
cd notice-board
npm install
```

## Environment Variables

Create a `.env` file in the project root:

DATABASE_URL="postgresql://<user>:<password>@<host>/<database>?sslmode=require"

Use `.env.example` as a reference. Never commit `.env` — it's already in `.gitignore`.

## Prisma Setup

```bash
npx prisma generate
npx prisma migrate dev --name init
```

This creates the `Notice` table in your database based on `prisma/schema.prisma`.

## Database Setup

This project uses [Neon](https://neon.tech) (free tier, PostgreSQL-compatible, no credit card required).

1. Create a free Neon account and a new project
2. Copy the connection string it provides
3. Paste it into `.env` as `DATABASE_URL`
4. Run the Prisma migration command above

## Run Locally

```bash
npm run dev
```

Visit `http://localhost:3000`.

## Deployment

1. Push the repository to GitHub
2. Import the repo into [Vercel](https://vercel.com)
3. Add the `DATABASE_URL` environment variable in Vercel's project settings
4. Deploy — Vercel builds and hosts the app automatically on every push

## AI Usage Disclosure

This project was built with the assistance of Claude (Anthropic). AI was used to:
- Plan the architecture, database schema, and API design
- Generate the initial implementation of components, API routes, and pages
- Explain design decisions (e.g., why Urgent-first sorting uses Prisma `orderBy` with a `desc` sort on a string field, why a singleton Prisma client is needed in Next.js dev mode)

All code was reviewed, tested locally, and verified against the project requirements before deployment. Database provisioning (Neon), environment variable setup, and final deployment steps were carried out manually.