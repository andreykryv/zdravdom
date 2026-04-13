<?php
/**
 * ЗдравДом API - PHP бэкенд для хостинга Timeweb
 * 
 * Конфигурация базы данных и настроек
 */

// Настройки базы данных (измените под ваши данные от Timeweb)
define('DB_HOST', 'localhost');
define('DB_NAME', 'ваша_база_данных');
define('DB_USER', 'ваш_пользователь');
define('DB_PASS', 'ваш_пароль');
define('DB_CHARSET', 'utf8mb4');

// Настройки почты (измените под ваши SMTP данные)
define('SMTP_HOST', 'smtp.yandex.ru');
define('SMTP_PORT', 465);
define('SMTP_SECURE', true); // true для SSL, false для TLS
define('SMTP_USER', 'vash-email@yandex.ru');
define('SMTP_PASS', 'parol-prilozheniya');
define('MAIL_TO', 'poluchatel@example.com');

// Секретный ключ для JWT (замените на случайную строку)
define('JWT_SECRET', 'zdravdom-secret-key-change-this-2024');

// Пароль администратора (замените на свой)
define('ADMIN_PASSWORD', 'admin123');

// CORS настройки
define('ALLOWED_ORIGINS', ['*']); // Для продакшена укажите конкретные домены
