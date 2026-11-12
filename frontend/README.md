# Frontend

Run the React frontend on its own, without Docker.

## Prerequisites

- [Node.js](https://nodejs.org/) 22 or later
- The User API running at `http://localhost:5000` — see [`user-api/README.md`](../user-api/README.md)
- The AI service running at `http://localhost:8000` for username suggestions on the Register page — see [`ai-service/README.md`](../ai-service/README.md). Everything else works without it.

All commands below are run from the `frontend` folder.

## 1. Install dependencies

```bash
npm install
```

## 2. Start the development server

```bash
npm run dev
```

Open http://localhost:5173 — you will be taken to the login page.

The Vite dev server forwards `/api/suggest-username` to the AI service and all other `/api` requests to the User API, so no CORS setup or API URL is needed in the code.

## Configuration (optional)

If a service runs on a different address, create a `.env` file in the `frontend` folder and set the one you need:

```
API_PROXY_TARGET=http://localhost:5001
AI_PROXY_TARGET=http://localhost:8001
```

Then restart `npm run dev`.

## Production build

```bash
npm run build
```

The static files are written to `dist/`.

## Troubleshooting

| Error | Fix |
| --- | --- |
| "Cannot reach the server" or "The server is unavailable" on submit | The User API is not running. Start it with `npm run dev` in `user-api`. |
| "The server is unavailable" after clicking **Suggest usernames** | The AI service is not running. Start it as described in `ai-service/README.md`. |
| Port 5173 is in use | Vite picks the next free port automatically — use the URL it prints. |
