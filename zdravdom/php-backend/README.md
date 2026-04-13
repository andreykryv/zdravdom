# ЗдравДом PHP - Инструкция по развёртыванию на Timeweb

## 📋 Обзор

Этот пакет содержит PHP-бэкенд для сайта ЗдравДом, адаптированный для работы на хостинге Timeweb.

### Структура файлов

```
php-backend/
├── api.php          # Основной файл API (все endpoints)
├── config.php       # Конфигурация (БД, почта, JWT)
├── db.php           # Подключение к базе данных
├── database.sql     # SQL-дамп для создания таблиц
└── README.md        # Эта инструкция
```

---

## 🚀 Установка на Timeweb

### Шаг 1: Создание базы данных

1. Войдите в панель управления Timeweb
2. Перейдите в раздел **Базы данных MySQL**
3. Создайте новую базу данных:
   - Запомните имя базы данных
   - Запомните имя пользователя
   - Запомните пароль (или задайте свой)

### Шаг 2: Импорт данных

1. Откройте **phpMyAdmin** в панели Timeweb
2. Выберите созданную базу данных
3. Перейдите на вкладку **Импорт**
4. Загрузите файл `database.sql`
5. Нажмите **Вперёд**

Или выполните SQL через консоль:
```bash
mysql -u пользователь -p база_данных < database.sql
```

### Шаг 3: Настройка конфигурации

Откройте файл `config.php` и измените следующие параметры:

```php
// Настройки базы данных
define('DB_HOST', 'localhost');                    // обычно localhost
define('DB_NAME', 'ваша_база_данных');            // из шага 1
define('DB_USER', 'ваш_пользователь');            // из шага 1
define('DB_PASS', 'ваш_пароль');                  // из шага 1
define('DB_CHARSET', 'utf8mb4');

// Настройки почты
define('SMTP_HOST', 'smtp.yandex.ru');            // ваш SMTP сервер
define('SMTP_PORT', 465);                         // порт SMTP
define('SMTP_SECURE', true);                      // SSL
define('SMTP_USER', 'vash-email@yandex.ru');      // ваш email
define('SMTP_PASS', 'parol-prilozheniya');        // пароль приложения
define('MAIL_TO', 'poluchatel@example.com');      // куда отправлять заявки

// Безопасность
define('JWT_SECRET', 'уникальная-случайная-строка-2024');
define('ADMIN_PASSWORD', 'ваш-надёжный-пароль');  // смените admin123!
```

### Шаг 4: Загрузка файлов на хостинг

1. Подключитесь к хостингу по FTP или через файловый менеджер Timeweb
2. Загрузите все файлы из папки `php-backend/` в корень сайта или поддомен
3. Убедитесь, что файлы имеют права доступа **644** (файлы) и **755** (папки)

### Шаг 5: Проверка работы

Откройте в браузере:
```
https://ваш-сайт.ru/api/health
```

Должен вернуться ответ:
```json
{"ok":true}
```

---

## 🔧 Интеграция с фронтендом

### Обновление client/vite.config.js

Для локальной разработки добавьте проксирование:

```javascript
export default {
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost/php-backend',
        changeOrigin: true
      }
    }
  }
}
```

### Для продакшена

В файлах React измените базовый URL API или настройте проксирование через `.htaccess`:

Создайте файл `.htaccess` в корне сайта:

```apache
RewriteEngine On

# Перенаправление API запросов на PHP бэкенд
RewriteRule ^api/(.*)$ php-backend/api.php [L,QSA]

# Для React Router (SPA)
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.html [QSA,L]
```

---

## 📡 API Endpoints

Все endpoints соответствуют оригинальному Node.js API:

| Метод | Endpoint | Описание | Auth |
|-------|----------|----------|------|
| GET | `/api/health` | Проверка работоспособности | ❌ |
| POST | `/api/admin/login` | Логин администратора | ❌ |
| POST | `/api/book` | Отправка заявки на приём | ❌ |
| GET | `/api/articles` | Получить все статьи | ❌ |
| GET | `/api/articles/:id` | Получить одну статью | ❌ |
| POST | `/api/articles` | Создать статью | ✅ |
| PUT | `/api/articles/:id` | Обновить статью | ✅ |
| DELETE | `/api/articles/:id` | Удалить статью | ✅ |
| GET | `/api/content` | Получить контент сайта | ❌ |
| PUT | `/api/content` | Обновить контент сайта | ✅ |

---

## 🔐 Админ-панель

1. Перейдите на `/admin` (если используете React роутинг)
2. Введите пароль из `config.php` (по умолчанию `admin123`)
3. После входа доступны:
   - Управление статьями (создание, редактирование, удаление)
   - Редактирование текстов на сайте

---

## ✉️ Настройка почты

### Вариант 1: Через Yandex Mail

1. Создайте пароль приложения в Яндекс ID
2. Настройте `config.php`:
   ```php
   define('SMTP_HOST', 'smtp.yandex.ru');
   define('SMTP_PORT', 465);
   define('SMTP_SECURE', true);
   define('SMTP_USER', 'vash-email@yandex.ru');
   define('SMTP_PASS', 'parol-prilozheniya');
   ```

### Вариант 2: Через почту хостинга

Timeweb предоставляет SMTP:
```php
define('SMTP_HOST', 'localhost');
define('SMTP_PORT', 25);
define('SMTP_SECURE', false);
```

### Вариант 3: PHPMailer (рекомендуется)

Для надёжной отправки установите PHPMailer:

```bash
composer require phpmailer/phpmailer
```

И замените функцию `handleBooking()` в `api.php` на использование PHPMailer.

---

## 🛡️ Безопасность

1. **Смените пароль администратора** в `config.php`
2. **Укажите уникальный JWT_SECRET** (генератор: https://generate-secret.vercel.app/32)
3. **Ограничьте CORS** в продакшене:
   ```php
   define('ALLOWED_ORIGINS', ['https://zdravdom.ru']);
   ```
4. **Защитите config.php** через `.htaccess`:
   ```apache
   <Files "config.php">
     Order Allow,Deny
     Deny from all
   </Files>
   ```

---

## 🐛 Решение проблем

### Ошибка "Database connection failed"
- Проверьте данные БД в `config.php`
- Убедитесь, что база данных создана и импортирован `database.sql`

### Заявки не отправляются
- Проверьте SMTP настройки
- На некоторых хостингах функция `mail()` отключена — используйте PHPMailer

### Ошибка 404 на API endpoints
- Проверьте путь к `api.php`
- Настройте `.htaccess` для перезаписи URL

### Ошибка CORS
- Убедитесь, что заголовки отправляются правильно
- Проверьте настройки в `api.php`

---

## 📞 Поддержка

При возникновении проблем:
1. Проверьте логи ошибок PHP в панели Timeweb
2. Включите отображение ошибок для отладки:
   ```php
   error_reporting(E_ALL);
   ini_set('display_errors', 1);
   ```
3. Проверьте версию PHP (требуется 7.4+)

---

## 📝 Changelog

### v1.0.0
- Полная совместимость с оригинальным Node.js API
- Поддержка MySQL через PDO
- JWT аутентификация без внешних библиотек
- Интеграция с существующим React фронтендом
