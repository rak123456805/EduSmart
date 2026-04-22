# Stage 1: Build Frontend
FROM node:20-slim AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
# We set VITE_API_URL to empty so it uses relative paths in production
ENV VITE_API_URL=""
RUN npm run build

# Stage 2: Final Image
FROM python:3.11-slim
WORKDIR /app

# Install backend system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy backend requirements and install
COPY backend/app/requirements.txt ./backend/requirements.txt
RUN pip install --no-cache-dir -r ./backend/requirements.txt

# Copy built frontend from Stage 1
COPY --from=frontend-builder /app/frontend/dist ./static

# Copy backend code
COPY backend/ ./backend

# Environment variables
ENV PYTHONUNBUFFERED=1
ENV PORT=8000

# Set working directory to backend so imports work
WORKDIR /app/backend

# Run the app
CMD uvicorn app.main:app --host 0.0.0.0 --port $PORT
