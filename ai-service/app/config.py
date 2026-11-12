"""Application settings, read once from environment variables (.env in local dev)."""

import os
from dataclasses import dataclass

from dotenv import load_dotenv

# Loads ai-service/.env if it exists. Variables already set in the environment
# (for example by Docker Compose) take precedence over the file.
load_dotenv()


@dataclass(frozen=True)
class Settings:
    groq_api_key: str
    groq_model: str
    groq_fallback_model: str | None


def _require(name: str) -> str:
    value = os.getenv(name, "").strip()
    if not value:
        raise RuntimeError(
            f"Missing required environment variable: {name}. "
            "Copy .env.example to .env and fill it in."
        )
    return value


def _optional(name: str) -> str | None:
    value = os.getenv(name, "").strip()
    return value or None


def load_settings() -> Settings:
    api_key = _require("GROQ_API_KEY")
    model = _require("GROQ_MODEL")
    fallback = _optional("GROQ_FALLBACK_MODEL")

    return Settings(
        groq_api_key=api_key,
        groq_model=model,
        # A fallback identical to the main model would just repeat the same call.
        groq_fallback_model=fallback if fallback != model else None,
    )


# Fail fast: the service refuses to start if required settings are missing.
settings = load_settings()
