# syntax=docker/dockerfile:1

# ---- Stage 1: install dependencies into a virtual environment ----
FROM python:3.12-slim AS deps
WORKDIR /app

RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Copy only the requirements first, so this layer is cached until dependencies change.
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# ---- Stage 2: runtime image (no pip or build leftovers) ----
FROM python:3.12-slim

# Don't write .pyc files; print logs immediately instead of buffering them.
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PATH="/opt/venv/bin:$PATH"

WORKDIR /app

# Unprivileged user to run the service.
RUN groupadd --system app && useradd --system --gid app --no-create-home app

COPY --from=deps /opt/venv /opt/venv
COPY app ./app

# The app files stay owned by root, so the process cannot modify its own code.
USER app

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
