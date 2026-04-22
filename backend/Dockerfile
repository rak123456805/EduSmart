FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install
COPY app/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
# This copies everything from the backend directory into the container's /app directory
COPY . .

# Expose port
EXPOSE 8000

# Run the application
# We use app.main:app because the directory structure is backend/app/main.py
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
