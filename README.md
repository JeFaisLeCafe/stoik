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

1. Start the application:

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

## Technical Choices


| Area       | Choice                    | Rationale                                           |
| ---------- | ------------------------- | --------------------------------------------------- |
| Backend    | NestJS + TypeScript       | Structured, modular, well-documented                |
| Database   | SQLite                    | Zero setup for local dev; single file, easy to run. |
| Frontend   | Vite + React + TypeScript | Fast, modern, excellent TS support.                 |
| Short code | 6-char alphanumeric       | ~2B combinations, collision-resistant.              |


## API

- **POST** `/api/shorten` — Shorten a URL  
  - Body: `{ "url": "https://example.com/long-path" }`  
  - Returns: `{ "shortUrl": "http://localhost:3000/ABC123", "shortCode": "ABC123" }`
- **GET** `/:shortCode` — Redirects to the original URL (302)

## Assumptions & Shortcuts

- SQLite for simplicity; no auth, no analytics.
- URL validation rejects non-http(s) schemes (e.g. `javascript:`, `data:`).
- The unique URL mini-code is only 6 alphanums long. That's around 2B possibility, enough for a demo, probably not for a full-scale app.

