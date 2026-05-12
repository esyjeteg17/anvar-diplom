# Образ для Django-бэкенда SBORIKA.
# Python 3.12 slim — лёгкий базовый образ.
FROM python:3.12-slim

# Не писать .pyc и сразу флашить stdout — удобнее в логах docker.
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

# Системные зависимости для psycopg (PostgreSQL клиент) и сборки.
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        build-essential \
        libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Сначала requirements — чтобы кэш слоёв сохранялся между сборками.
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Копируем исходники приложения.
COPY . .

# Порт бэкенда совпадает с тем, что прописан в CLAUDE.md.
EXPOSE 8042

# По умолчанию запускаем dev-сервер Django.
# Миграции прогоняются в docker-compose через command:, чтобы дождаться готовности БД.
CMD ["python", "manage.py", "runserver", "0.0.0.0:8042"]
