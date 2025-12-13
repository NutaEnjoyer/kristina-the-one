# Инструкция по деплою

## Архитектура

Проект состоит из двух частей:
- **Frontend**: React + Vite (статические файлы)
- **Backend**: Go API + PostgreSQL в Docker

## Локальная разработка

### 1. Запуск Backend

```bash
cd backend
docker-compose up -d
```

Backend будет доступен на `http://localhost:8080`
PostgreSQL на порту `5433`

### 2. Запуск Frontend

```bash
npm install
npm run dev
```

Frontend будет доступен на `http://localhost:5173`

### 3. Миграция данных (один раз)

```bash
npm run migrate
```

## Продакшн деплой

### Вариант 1: VPS (Digital Ocean, Hetzner, etc.)

#### 1. Подготовка сервера

```bash
# Установка Docker и Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Установка Node.js (для сборки frontend)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### 2. Клонирование репозитория

```bash
git clone <your-repo-url>
cd KrisSite
```

#### 3. Настройка переменных окружения

Создайте файл `backend/.env`:

```env
DB_HOST=postgres
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_secure_password_here
DB_NAME=krissite
SERVER_PORT=8080
```

Обновите `backend/docker-compose.yml` с новым паролем.

#### 4. Сборка Frontend

```bash
npm install
npm run build
```

#### 5. Запуск Backend

```bash
cd backend
docker-compose up -d
```

#### 6. Настройка Nginx (опционально)

Создайте файл `/etc/nginx/sites-available/krissite`:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend (статика)
    location / {
        root /path/to/KrisSite/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Активируйте конфиг:

```bash
sudo ln -s /etc/nginx/sites-available/krissite /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### 7. SSL с Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### Вариант 2: Vercel (Frontend) + Railway/Render (Backend)

#### Frontend на Vercel

1. Подключите GitHub репозиторий к Vercel
2. Настройте переменные окружения:
   - `VITE_API_URL=https://your-backend-url.railway.app/api`
3. Deploy!

#### Backend на Railway

1. Создайте новый проект на Railway
2. Добавьте PostgreSQL сервис
3. Добавьте сервис из GitHub репозитория (папка `backend`)
4. Настройте переменные окружения:
   - `DB_HOST` (из Railway PostgreSQL)
   - `DB_PORT` (из Railway PostgreSQL)
   - `DB_USER` (из Railway PostgreSQL)
   - `DB_PASSWORD` (из Railway PostgreSQL)
   - `DB_NAME=krissite`
   - `SERVER_PORT=8080`
5. Deploy!

### Вариант 3: Docker Compose на одном сервере

Самый простой вариант - все в Docker:

1. Создайте `docker-compose.production.yml`:

```yaml
services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: krissite
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backend/migrations:/docker-entrypoint-initdb.d
    restart: unless-stopped

  api:
    build: ./backend
    environment:
      DB_HOST: postgres
      DB_PORT: 5432
      DB_USER: postgres
      DB_PASSWORD: ${DB_PASSWORD}
      DB_NAME: krissite
      SERVER_PORT: 8080
    ports:
      - "8080:8080"
    depends_on:
      - postgres
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./dist:/usr/share/nginx/html
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - api
    restart: unless-stopped

volumes:
  postgres_data:
```

2. Запустите:

```bash
docker-compose -f docker-compose.production.yml up -d
```

## Миграция данных в продакшн

После первого деплоя:

```bash
# Локально обновите API_URL в scripts/migrate-to-db.js
# Затем запустите:
npm run migrate
```

## Мониторинг

### Проверка статуса

```bash
# Backend
cd backend
docker-compose ps
docker-compose logs api

# База данных
docker-compose exec postgres psql -U postgres -d krissite -c "SELECT COUNT(*) FROM letters;"
```

### Резервное копирование БД

```bash
docker-compose exec postgres pg_dump -U postgres krissite > backup.sql
```

### Восстановление БД

```bash
cat backup.sql | docker-compose exec -T postgres psql -U postgres krissite
```

## Полезные команды

```bash
# Перезапуск backend
cd backend && docker-compose restart api

# Просмотр логов
docker-compose logs -f api

# Остановка всех сервисов
docker-compose down

# Остановка с удалением данных
docker-compose down -v
```

## Обновление продакшна

```bash
# Frontend
git pull
npm install
npm run build

# Backend
cd backend
git pull
docker-compose build api
docker-compose up -d
```

## Troubleshooting

### API не отвечает
```bash
docker-compose logs api
# Проверьте порты и переменные окружения
```

### CORS ошибки
Убедитесь что в `backend/cmd/api/main.go` настроен правильный origin для production URL

### База данных не подключается
```bash
docker-compose exec postgres psql -U postgres
# Проверьте пароли и хост
```
