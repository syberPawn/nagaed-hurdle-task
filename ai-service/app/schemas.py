"""Pydantic models for request/response validation and the /docs page."""

from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field, StringConstraints, field_validator

SUGGESTION_COUNT = 3

# Same rules as user-api's registerSchema, so every suggestion can be used to register.
USERNAME_MIN_LENGTH = 3
USERNAME_MAX_LENGTH = 50
USERNAME_PATTERN = r"^[A-Za-z0-9_.-]+$"

Interest = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=50)]

Username = Annotated[
    str,
    StringConstraints(
        min_length=USERNAME_MIN_LENGTH,
        max_length=USERNAME_MAX_LENGTH,
        pattern=USERNAME_PATTERN,
    ),
]


class SuggestUsernameRequest(BaseModel):
    model_config = ConfigDict(
        extra="forbid",
        json_schema_extra={"examples": [{"interests": ["music", "hiking", "coffee"]}]},
    )

    interests: list[Interest] = Field(
        min_length=1,
        max_length=10,
        description="1 to 10 interests, each 1-50 characters.",
    )

    @field_validator("interests")
    @classmethod
    def remove_duplicates(cls, interests: list[str]) -> list[str]:
        # Case-insensitive, keeps the first spelling and the original order.
        seen: set[str] = set()
        unique: list[str] = []
        for interest in interests:
            key = interest.lower()
            if key not in seen:
                seen.add(key)
                unique.append(interest)
        return unique


class SuggestUsernameResponse(BaseModel):
    model_config = ConfigDict(
        json_schema_extra={"examples": [{"suggestions": ["TrailTunes", "BrewAndBeats", "summit.sips"]}]},
    )

    suggestions: list[Username] = Field(
        min_length=SUGGESTION_COUNT,
        max_length=SUGGESTION_COUNT,
        description=(
            f"Exactly {SUGGESTION_COUNT} unique usernames, each {USERNAME_MIN_LENGTH}-"
            f"{USERNAME_MAX_LENGTH} characters using letters, numbers, '_', '.' or '-'."
        ),
    )

    @field_validator("suggestions")
    @classmethod
    def require_unique(cls, suggestions: list[str]) -> list[str]:
        # user-api treats usernames case-insensitively, so "Hiker" and "hiker" are the same.
        if len({s.lower() for s in suggestions}) != len(suggestions):
            raise ValueError("Suggestions must be unique")
        return suggestions


# Same error shape as user-api: { "error": { "message": ..., "details"?: ... } }
class ErrorBody(BaseModel):
    message: str
    details: dict[str, str] | None = None


class ErrorResponse(BaseModel):
    error: ErrorBody
