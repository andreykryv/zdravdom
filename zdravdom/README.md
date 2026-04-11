# ЗдравДом — React приложение

## Структура
zdravdom/
├── client/   # React + Vite
└── server/   # Express API

## Быстрый старт

### 1. Настройка сервера
```bash
cd server
cp .env.example .env
# Отредактируйте .env: SMTP, пароль, JWT_SECRET
npm install
npm start
```

### 2. Запуск клиента (разработка)
```bash
cd client
npm install
npm run dev
# → http://localhost:5173
```

### 3. Сборка для продакшена
```bash
cd client
npm run build
# dist/ — статические файлы для деплоя
```

## Деплой (production)

### Вариант A: VPS / сервер

**Сервер:**
```bash
cd server
npm install
node index.js  # или: pm2 start index.js --name zdravdom-api
```

**Клиент (Nginx):**
```nginx
server {
    listen 80;
    server_name yourdomain.ru;

    root /var/www/zdravdom/client/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }
}
```

### Вариант B: Docker
```dockerfile
# В корне проекта создайте docker-compose.yml
version: '3.8'
services:
  api:
    build: ./server
    env_file: ./server/.env
    ports:
      - "5000:5000"
  client:
    build: ./client
    ports:
      - "80:80"
    depends_on:
      - api
```

## Добавление изображений

Поместите в `client/public/images/`:
- `hero-bg.jpg` — фоновое фото для hero
- `kirill.jpg` — фото Кирилла
- `denis.jpg` — фото Дениса
- `about.jpg` — фото кабинета

## Настройка почты (.env)

### Яндекс.Почта
SMTP_HOST=smtp.yandex.ru
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your@yandex.ru
SMTP_PASS=пароль_приложения  # создаётся в настройках аккаунта

### Gmail
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your@gmail.com
SMTP_PASS=app_password  # App Password в Google Account

## Админ-панель

Адрес: `http://yoursite.ru/admin`
Пароль: из `.env` переменной `ADMIN_PASSWORD`

Функции:
- Список статей
- Создание новой статьи (тег, заголовок, описание, разделы)
- Редактирование статей
- Удаление статей