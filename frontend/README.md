# Frontend

Run the React frontend on its own, without Docker.

## Prerequisites

- [Node.js](https://nodejs.org/) 22 or later
- The User API running at `http://localhost:5000` — see [`user-api/README.md`](../user-api/README.md)

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

Requests to `/api` are forwarded to the User API by the Vite dev server, so no CORS setup or API URL is needed in the code.

## Configuration (optional)

If the User API runs on a different address, create a `.env` file in the `frontend` folder:

```
API_PROXY_TARGET=http://localhost:5001
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
| Port 5173 is in use | Vite picks the next free port automatically — use the URL it prints. |
