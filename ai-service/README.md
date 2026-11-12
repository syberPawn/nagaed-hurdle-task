# AI Service

Run the username suggestion service on its own, without Docker.

## Prerequisites

- [Python](https://www.python.org/downloads/) 3.10 or later
- A free Groq API key from [console.groq.com/keys](https://console.groq.com/keys) (no credit card needed)

All commands below are run from the `ai-service` folder.

## 1. Create and activate a virtual environment

```bash
python3 -m venv .venv          # macOS / Linux
py -m venv .venv               # Windows
```

Activate it:

```bash
source .venv/bin/activate      # macOS / Linux
.venv\Scripts\activate         # Windows Command Prompt
.venv\Scripts\Activate.ps1     # Windows PowerShell
```

Your prompt now starts with `(.venv)`. Activate it again in every new terminal before running the commands below.

## 2. Install dependencies

```bash
python -m pip install -r requirements.txt
```

## 3. Configure environment variables

Copy the example file:

```bash
cp .env.example .env          # macOS / Linux / PowerShell
copy .env.example .env        # Windows Command Prompt
```

Open `.env` and set `GROQ_API_KEY` to your Groq API key. Leave the other values as they are.

## 4. Start the server

```bash
python -m uvicorn app.main:app --reload
```

You should see:

```
Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
```

Open http://localhost:8000/docs, choose **POST /api/suggest-username** → **Try it out** → **Execute**. The response contains 3 username suggestions.

`--reload` restarts the server automatically when files change.

## Troubleshooting

| Error | Fix |
| --- | --- |
| `Missing required environment variable: ...` | Run step 3, and check the variable named in the error is set in `.env`. |
| `No module named 'fastapi'` (or `uvicorn`) | The virtual environment is not active. Run the activate command from step 1, then step 2 if needed. |
| `No module named 'app'` | Run the command from the `ai-service` folder. |
| `python` opens the Microsoft Store or is not recognized (Windows) | Use `py` to create the virtual environment. Once it is activated, `python` works. |
| PowerShell: `running scripts is disabled on this system` | Run `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser` once, or use Command Prompt instead. |
| `502` — "The AI service could not process the request" | The Groq API key is invalid. Check `GROQ_API_KEY`; the server log shows Groq's exact error. |
| `503` — "The AI service is busy" or "unavailable" | Groq is rate-limiting or the model is unavailable. Wait a moment, or check that `GROQ_MODEL` is listed at [console.groq.com/docs/models](https://console.groq.com/docs/models). |
| Port 8000 is in use | Add `--port 8001` to the start command. |
