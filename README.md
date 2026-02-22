# URL Shortener

A simple URL shortener that turns long links into short, shareable URLs that redirect to the original destination.

## Prerequisites

- Node.js 18+ and npm

## Setup

1. Install dependencies:

```bash
npm run install:all
```

Or manually:

```bash
npm install
cd backend && npm install
cd ../frontend && npm install
```

2. Start the application:

```bash
npm run dev
```

This runs both the backend (port 3000) and frontend (port 5173). Open [http://localhost:5173](http://localhost:5173) in your browser.

To run separately:

```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

## Troubleshooting

**Port 3000 already in use**

If the backend fails with `EADDRINUSE: address already in use :::3000`, a previous instance is still running. Free the port:

```bash
lsof -i :3000   # find the PID
kill <PID>      # replace <PID> with the number from the output
```

**Frontend type errors**

If `tsconfig.app.json` or `tsconfig.node.json` report missing type definitions, ensure dependencies are installed:

```bash
cd frontend && npm install
```

## Technical Choices

| Area | Choice | Rationale |
|------|--------|-----------|
| Backend | NestJS + TypeScript | Structured, modular, production-ready. |
| Database | SQLite | Zero setup for local dev; single file, easy to run. |
| Frontend | Vite + React + TypeScript | Fast, modern, excellent TS support. |
| Short code | 6-char alphanumeric | ~2B combinations, collision-resistant. |

## API

- **POST** `/api/shorten` — Shorten a URL  
  - Body: `{ "url": "https://example.com/long-path" }`  
  - Returns: `{ "shortUrl": "http://localhost:3000/ABC123", "shortCode": "ABC123" }`

- **GET** `/:shortCode` — Redirects to the original URL (302)

## Assumptions & Shortcuts

- SQLite for simplicity; no auth, no analytics.
- Short URLs use `http://localhost:3000` as base. Set `BASE_URL` env var to override.
- URL validation rejects non-http(s) schemes (e.g. `javascript:`, `data:`).
- CORS allowed for `http://localhost:5173` during development.
