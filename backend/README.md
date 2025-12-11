# KrisSite Backend

Go backend для личного дневника с REST API и PostgreSQL.

## Технологии

- **Go 1.21+**
- **PostgreSQL 15**
- **gorilla/mux** - роутинг
- **lib/pq** - PostgreSQL драйвер
- **rs/cors** - CORS middleware

## Локальная разработка

### Вариант 1: Docker Compose (рекомендуется)

```bash
# Запустить всё (API + PostgreSQL)
docker-compose up --build

# API будет доступен на http://localhost:8080
# PostgreSQL на localhost:5432
```

### Вариант 2: Локальный запуск

1. Установи PostgreSQL
2. Создай базу данных:
```bash
createdb krissite
psql krissite < migrations/001_create_letters_table.up.sql
```

3. Скопируй .env:
```bash
cp .env.example .env
```

4. Запусти сервер:
```bash
go run cmd/api/main.go
```

## API Endpoints

```
GET    /api/letters       - все записи
GET    /api/letters/:id   - одна запись
POST   /api/letters       - создать запись
PUT    /api/letters/:id   - обновить запись
DELETE /api/letters/:id   - удалить запись
```

## Структура проекта

```
backend/
├── cmd/api/           # точка входа приложения
├── internal/
│   ├── handlers/      # HTTP handlers
│   ├── models/        # модели данных
│   ├── repository/    # работа с БД
│   ├── service/       # бизнес-логика
│   └── config/        # конфигурация
├── migrations/        # SQL миграции
├── Dockerfile
└── docker-compose.yml
```

## Деплой

### Railway (рекомендуется)

1. Создай проект на railway.app
2. Добавь PostgreSQL плагин
3. Deploy from GitHub
4. Настрой переменные окружения (берутся автоматически из PostgreSQL плагина)

### Render

1. Создай Web Service
2. Добавь PostgreSQL базу
3. Настрой переменные окружения из дашборда PostgreSQL

## Переменные окружения

```env
DB_HOST=localhost       # хост PostgreSQL
DB_PORT=5432           # порт PostgreSQL
DB_USER=postgres       # пользователь
DB_PASSWORD=postgres   # пароль
DB_NAME=krissite       # имя базы
SERVER_PORT=8080       # порт API сервера
```
