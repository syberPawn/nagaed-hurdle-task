# User API

Run the user registration and authentication API on its own, without Docker.

## Prerequisites

- [Node.js](https://nodejs.org/) 22 or later
- [MySQL](https://dev.mysql.com/downloads/) 8 or later, running locally
- The `mysql` command-line client on your `PATH`

All commands below are run from the `user-api` folder.

## 1. Install dependencies

```bash
npm install
```

## 2. Configure environment variables

Copy the example file:

```bash
cp .env.example .env          # macOS / Linux / PowerShell
copy .env.example .env        # Windows Command Prompt
```

Open `.env` and set:

- `DB_USER` and `DB_PASSWORD` — your MySQL username and password. If the password contains `#`, wrap it in double quotes: `DB_PASSWORD="pass#word"`.
- `JWT_SECRET` — a long random string. Generate one with:

  ```bash
  node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
  ```

Leave the other values as they are.

## 3. Create the database

Create the database (enter your MySQL password when prompted):

```bash
mysql -u root -p -e "CREATE DATABASE nagaed"
```

Create the `users` table:

```bash
mysql -u root -p nagaed < sql/init.sql                    # macOS / Linux / Command Prompt
Get-Content sql/init.sql | mysql -u root -p nagaed        # PowerShell
```

Replace `root` with your MySQL username if it is different. The database name must match `DB_NAME` in `.env` (default `nagaed`).

## 4. Start the server

```bash
npm start
```

You should see:

```
Connected to MySQL
user-api listening on http://localhost:5000
```

Open http://localhost:5000/health — it should return `{"status":"ok"}`.

For development, `npm run dev` restarts the server automatically when files change.

## Troubleshooting

| Error | Fix |
| --- | --- |
| `Could not connect to MySQL: Access denied` | Check `DB_USER` / `DB_PASSWORD` in `.env` (quote the password if it contains `#`). |
| `Could not connect to MySQL: Unknown database` | Run step 3, and make sure the database name matches `DB_NAME`. |
| `Table 'nagaed.users' doesn't exist` | Run the second command in step 3. |
| `EADDRINUSE` | Port 5000 is in use (on macOS, often by AirPlay Receiver). Set a different `PORT` in `.env`, e.g. `PORT=5001`. |
| `mysql` is not recognized | Add MySQL's `bin` folder to your `PATH` (Windows default: `C:\Program Files\MySQL\MySQL Server <version>\bin`), then open a new terminal. Or run the commands from the MySQL Command Line Client. |
