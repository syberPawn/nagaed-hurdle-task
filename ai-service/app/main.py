"""FastAPI app: wires up the router, health check and error handlers."""

import logging

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.routers import suggestions
from app.services.suggestion_service import SuggestionError

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(name)s: %(message)s")
logger = logging.getLogger(__name__)

app = FastAPI(
    title="NagaEd AI Service",
    version="1.0.0",
    description="Suggests creative usernames from a list of interests, using an LLM through the Groq API.",
)

app.include_router(suggestions.router)


# Used by the Docker health check; hidden from /docs, which documents the public API only.
@app.get("/health", include_in_schema=False)
async def health() -> dict[str, str]:
    return {"status": "ok"}


# ---------- Error handlers: every error uses { "error": { "message", "details"? } } ----------


def error_response(status_code: int, message: str, details: dict[str, str] | None = None) -> JSONResponse:
    body: dict = {"message": message}
    if details:
        body["details"] = details
    return JSONResponse(status_code=status_code, content={"error": body})


@app.exception_handler(RequestValidationError)
async def handle_validation_error(request: Request, exc: RequestValidationError) -> JSONResponse:
    errors = exc.errors()
    if any(error["type"] == "json_invalid" for error in errors):
        return error_response(400, "Malformed JSON in request body")

    details: dict[str, str] = {}
    for error in errors:
        # ("body", "interests", 0) -> "interests.0"; a missing body has no field -> "body"
        field = ".".join(str(part) for part in error["loc"][1:]) or "body"
        details.setdefault(field, error["msg"])
    return error_response(422, "Validation failed", details)


@app.exception_handler(SuggestionError)
async def handle_suggestion_error(request: Request, exc: SuggestionError) -> JSONResponse:
    return error_response(exc.status_code, exc.message)


@app.exception_handler(StarletteHTTPException)
async def handle_http_error(request: Request, exc: StarletteHTTPException) -> JSONResponse:
    if exc.status_code == 404:
        return error_response(404, f"Route not found: {request.method} {request.url.path}")
    return error_response(exc.status_code, str(exc.detail))


@app.exception_handler(Exception)
async def handle_unexpected_error(request: Request, exc: Exception) -> JSONResponse:
    logger.exception("Unhandled error on %s %s", request.method, request.url.path)
    return error_response(500, "Internal server error")
