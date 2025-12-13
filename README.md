# KrisSite - Personal Diary

Личный дневник с красивым UI и полноценным backend. Проект позволяет создавать, редактировать и удалять записи прямо через веб-интерфейс.

## Возможности

- ✅ **Просмотр списка записей** - все записи в одном месте
- ✅ **Чтение записей** - полный текст с красивым оформлением
- ✅ **CRUD операции** - создание, редактирование, удаление записей
- ✅ **Теги и даты** - организация записей по категориям
- ✅ **Статус "Пишется..."** - для незавершенных записей
- ✅ **REST API** - полноценный backend на Go
- ✅ **PostgreSQL** - надежное хранение данных
- ✅ **Адаптивный дизайн** - работает на всех устройствах

## Быстрый старт

### 1. Запуск Backend

```bash
cd backend
docker-compose up -d
```

Backend будет доступен на `http://localhost:8080`

### 2. Запуск Frontend

```bash
npm install
npm run dev
```

Frontend будет доступен на `http://localhost:5173`

### 3. Миграция существующих данных (опционально)

```bash
npm run migrate
```

## Технологии

### Frontend
- React 18
- Vite
- Framer Motion (анимации)
- CSS (градиенты, backdrop-filter)

### Backend
- Go 1.21
- PostgreSQL 15
- Docker & Docker Compose
- Clean Architecture (handlers → services → repository)

### Библиотеки Go
- `gorilla/mux` - роутинг
- `lib/pq` - PostgreSQL драйвер
- `rs/cors` - CORS middleware

## API Endpoints

- `GET /api/letters` - Получить все записи
- `GET /api/letters/:id` - Получить одну запись
- `POST /api/letters` - Создать запись
- `PUT /api/letters/:id` - Обновить запись
- `DELETE /api/letters/:id` - Удалить запись

## База данных

PostgreSQL таблица `letters`:

| Поле | Тип | Описание |
|------|-----|----------|
| id | SERIAL | Автоинкремент ID |
| title | VARCHAR(255) | Название записи |
| text | TEXT | Текст записи |
| date | VARCHAR(50) | Дата (строка) |
| tag | VARCHAR(100) | Тег категории |
| in_progress | BOOLEAN | Статус "пишется" |
| created_at | TIMESTAMP | Дата создания |
| updated_at | TIMESTAMP | Дата обновления |

## Конфигурация

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8080/api
```

### Backend (backend/.env или docker-compose.yml)
```env
DB_HOST=postgres
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=krissite
SERVER_PORT=8080
```

## Деплой

Смотрите подробную инструкцию в [DEPLOYMENT.md](./DEPLOYMENT.md)

Варианты деплоя:
- VPS с Nginx
- Vercel (Frontend) + Railway (Backend)
- Docker Compose на одном сервере

## Структура проекта

```
KrisSite/
├── src/                      # Frontend исходники
│   ├── components/           # React компоненты
│   │   ├── LetterPage.jsx    # Главная страница с записями
│   │   ├── LetterForm.jsx    # Форма создания/редактирования
│   │   └── ...
│   ├── api/                  # API клиент
│   │   └── lettersApi.js     # HTTP запросы к backend
│   └── letterText.js         # Старые данные (fallback)
│
├── backend/                  # Go backend
│   ├── cmd/api/              # Точка входа
│   │   └── main.go
│   ├── internal/             # Бизнес-логика
│   │   ├── models/           # Модели данных
│   │   ├── repository/       # Работа с БД
│   │   ├── services/         # Бизнес-логика
│   │   └── handlers/         # HTTP обработчики
│   ├── migrations/           # SQL миграции
│   ├── Dockerfile            # Docker образ для API
│   └── docker-compose.yml    # Docker Compose конфиг
│
└── scripts/                  # Утилиты
    └── migrate-to-db.js      # Миграция данных в БД
```

## Разработка

### Локальная разработка

1. Backend запущен в Docker
2. Frontend в dev режиме с HMR
3. Изменения применяются автоматически

### Добавление новых полей

1. Обновите модель в `backend/internal/models/letter.go`
2. Создайте новую миграцию в `backend/migrations/`
3. Обновите repository и handlers
4. Обновите frontend формы и отображение

## License

Personal project
