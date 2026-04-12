# 🚀 Инструкция по развёртыванию

## Требования
- Docker >= 24
- Docker Compose >= 2.x
- Сервер: Linux (Ubuntu 22.04+ рекомендуется)

---

## 1. Подготовка сервера

```bash
# Клонируем репозиторий
git clone <REPO_URL> /opt/website
cd /opt/website
```

---

## 2. Настройка переменных окружения

```bash
# Копируем шаблон
cp .env.example .env

# Открываем для редактирования
nano .env
```

**Обязательно заменить:**

| Переменная | Что сделать |
|---|---|
| `JWT_SECRET` | Сгенерировать: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` |
| `ADMIN_PASSWORD` | Установить надёжный пароль (мин. 16 символов) |
| `SMTP_PASS` | App Password из Google Account |
| `SMTP_USER` / `MAIL_TO` | Ваш email |

---

## 3. Запуск

```bash
# Сборка и старт
docker compose up -d --build

# Проверить статус
docker compose ps

# Посмотреть логи
docker compose logs -f app
```

---

## 4. Обновление сайта

```bash
cd /opt/website
git pull
docker compose up -d --build
```

---

## 5. Настройка Nginx (обратный прокси + HTTPS)

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate     /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass         http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection 'upgrade';
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Получить SSL-сертификат (Let's Encrypt)
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## 6. Полезные команды

```bash
# Остановить
docker compose down

# Перезапустить
docker compose restart app

# Войти в контейнер
docker compose exec app sh

# Очистить старые образы
docker image prune -f
```
