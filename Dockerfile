FROM python:3.11-alpine

WORKDIR /app

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN adduser -D appuser && \
    chown -R appuser:appuser /app

USER appuser

EXPOSE 1337

CMD ["python", "app.py"]
