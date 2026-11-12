"""POST /api/suggest-username — the HTTP layer; the work happens in the service."""

from fastapi import APIRouter

from app.schemas import ErrorResponse, SuggestUsernameRequest, SuggestUsernameResponse
from app.services.suggestion_service import suggest_usernames

router = APIRouter(prefix="/api", tags=["Usernames"])


@router.post(
    "/suggest-username",
    response_model=SuggestUsernameResponse,
    summary="Suggest usernames from interests",
    description=(
        "Sends the interests to an LLM through the Groq API and returns 3 unique, "
        "creative usernames that meet the User API's registration rules."
    ),
    responses={
        400: {"model": ErrorResponse, "description": "The request body is not valid JSON."},
        422: {"model": ErrorResponse, "description": "The interests are missing or invalid."},
        502: {"model": ErrorResponse, "description": "The AI service returned an error or an invalid response."},
        503: {"model": ErrorResponse, "description": "The AI service is busy, timed out or unavailable."},
    },
)
async def suggest_username(body: SuggestUsernameRequest) -> SuggestUsernameResponse:
    return await suggest_usernames(body.interests)
