<?php
/**
 * ЗдравДом API - PHP бэкенд для хостинга Timeweb
 * 
 * Основной файл обработки API запросов
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Обработка preflight запросов
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'config.php';
require_once 'db.php';

// Получение метода и пути запроса
$method = $_SERVER['REQUEST_METHOD'];
$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$basePath = dirname($_SERVER['SCRIPT_NAME']);
$apiPath = str_replace($basePath, '', $requestUri);

// Убираем ведущий слэш
$apiPath = ltrim($apiPath, '/');

// Маршрутизация
try {
    switch (true) {
        // Health check
        case $apiPath === 'api/health':
            response(['ok' => true]);
            break;
        
        // Admin login
        case $apiPath === 'api/admin/login' && $method === 'POST':
            adminLogin();
            break;
        
        // Booking
        case $apiPath === 'api/book' && $method === 'POST':
            handleBooking();
            break;
        
        // Articles - GET all
        case $apiPath === 'api/articles' && $method === 'GET':
            getArticles();
            break;
        
        // Articles - GET single
        case preg_match('/^api\/articles\/([a-f0-9-]+)$/i', $apiPath, $matches) && $method === 'GET':
            getArticle($matches[1]);
            break;
        
        // Articles - CREATE (admin)
        case $apiPath === 'api/articles' && $method === 'POST':
            requireAuth();
            createArticle();
            break;
        
        // Articles - UPDATE (admin)
        case preg_match('/^api\/articles\/([a-f0-9-]+)$/i', $apiPath, $matches) && $method === 'PUT':
            requireAuth();
            updateArticle($matches[1]);
            break;
        
        // Articles - DELETE (admin)
        case preg_match('/^api\/articles\/([a-f0-9-]+)$/i', $apiPath, $matches) && $method === 'DELETE':
            requireAuth();
            deleteArticle($matches[1]);
            break;
        
        // Content - GET
        case $apiPath === 'api/content' && $method === 'GET':
            getContent();
            break;
        
        // Content - UPDATE (admin)
        case $apiPath === 'api/content' && $method === 'PUT':
            requireAuth();
            updateContent();
            break;
        
        default:
            http_response_code(404);
            response(['error' => 'Endpoint not found']);
    }
} catch (Exception $e) {
    http_response_code(500);
    response(['error' => 'Server error: ' . $e->getMessage()]);
}

/**
 * Проверка авторизации
 */
function requireAuth() {
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? '';
    
    if (!str_starts_with($authHeader, 'Bearer ')) {
        http_response_code(401);
        response(['error' => 'Unauthorized']);
        exit();
    }
    
    $token = substr($authHeader, 7);
    
    try {
        $payload = jwtDecode($token);
        if ($payload['role'] !== 'admin') {
            throw new Exception('Invalid role');
        }
    } catch (Exception $e) {
        http_response_code(401);
        response(['error' => 'Invalid token']);
        exit();
    }
}

/**
 * Простая реализация JWT decode (без внешних библиотек)
 */
function jwtDecode($token) {
    $parts = explode('.', $token);
    if (count($parts) !== 3) {
        throw new Exception('Invalid token format');
    }
    
    $payload = json_decode(base64_decode(strtr($parts[1], '-_', '+/')), true);
    if (!$payload) {
        throw new Exception('Invalid payload');
    }
    
    // Проверка подписи (упрощённая)
    $signature = hash_hmac('sha256', $parts[0] . '.' . $parts[1], JWT_SECRET, true);
    $expectedSignature = rtrim(strtr(base64_encode($signature), '+/', '-_'), '=');
    
    if (!hash_equals($expectedSignature, $parts[2])) {
        throw new Exception('Invalid signature');
    }
    
    return $payload;
}

/**
 * Простая реализация JWT encode (без внешних библиотек)
 */
function jwtEncode($payload) {
    $header = ['alg' => 'HS256', 'typ' => 'JWT'];
    
    $base64Header = rtrim(strtr(base64_encode(json_encode($header)), '+/', '-_'), '=');
    $base64Payload = rtrim(strtr(base64_encode(json_encode($payload)), '+/', '-_'), '=');
    
    $signature = hash_hmac('sha256', $base64Header . '.' . $base64Payload, JWT_SECRET, true);
    $base64Signature = rtrim(strtr(base64_encode($signature), '+/', '-_'), '=');
    
    return $base64Header . '.' . $base64Payload . '.' . $base64Signature;
}

/**
 * Админ логин
 */
function adminLogin() {
    $input = json_decode(file_get_contents('php://input'), true);
    $password = $input['password'] ?? '';
    
    if ($password !== ADMIN_PASSWORD) {
        http_response_code(401);
        response(['error' => 'Неверный пароль']);
        return;
    }
    
    $payload = [
        'role' => 'admin',
        'iat' => time(),
        'exp' => time() + 86400 // 24 часа
    ];
    
    $token = jwtEncode($payload);
    response(['token' => $token]);
}

/**
 * Обработка заявки на приём
 */
function handleBooking() {
    $input = json_decode(file_get_contents('php://input'), true);
    $name = trim($input['name'] ?? '');
    $phone = trim($input['phone'] ?? '');
    
    if (!$name || !$phone) {
        http_response_code(400);
        response(['error' => 'Заполните все поля']);
        return;
    }
    
    // Отправка email (упрощённая, требует настройки mail() или PHPMailer)
    $subject = "🏥 Новая заявка от {$name}";
    $message = "
    <div style='font-family:sans-serif;max-width:480px;padding:24px;background:#f5efe6;border-radius:12px'>
        <h2 style='color:#1a2e1e;margin:0 0 16px'>Новая заявка на приём</h2>
        <p style='margin:8px 0'><strong>Имя:</strong> {$name}</p>
        <p style='margin:8px 0'><strong>Телефон:</strong> <a href='tel:{$phone}'>{$phone}</a></p>
        <p style='margin-top:20px;color:#6a6a5a;font-size:13px'>Заявка с сайта ЗдравДом</p>
    </div>";
    
    $headers = "MIME-Version: 1.0\r\n";
    $headers .= "Content-type: text/html; charset=utf-8\r\n";
    $headers .= "From: ЗдравДом <" . SMTP_USER . ">\r\n";
    
    // Попытка отправки (на реальном хостинге может потребоваться PHPMailer)
    @mail(MAIL_TO, $subject, $message, $headers);
    
    response(['ok' => true]);
}

/**
 * Получить все статьи
 */
function getArticles() {
    $pdo = getDbConnection();
    $stmt = $pdo->query("SELECT * FROM articles ORDER BY created_at DESC");
    $articles = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Декодируем JSON sections
    foreach ($articles as &$article) {
        if ($article['sections']) {
            $article['sections'] = json_decode($article['sections'], true);
        }
    }
    
    response($articles);
}

/**
 * Получить одну статью
 */
function getArticle($id) {
    $pdo = getDbConnection();
    $stmt = $pdo->prepare("SELECT * FROM articles WHERE id = ?");
    $stmt->execute([$id]);
    $article = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$article) {
        http_response_code(404);
        response(['error' => 'Not found']);
        return;
    }
    
    if ($article['sections']) {
        $article['sections'] = json_decode($article['sections'], true);
    }
    
    response($article);
}

/**
 * Создать статью
 */
function createArticle() {
    $input = json_decode(file_get_contents('php://input'), true);
    $tag = trim($input['tag'] ?? '');
    $title = trim($input['title'] ?? '');
    $excerpt = trim($input['excerpt'] ?? '');
    $sections = $input['sections'] ?? [];
    
    if (!$title || !$tag) {
        http_response_code(400);
        response(['error' => 'title and tag required']);
        return;
    }
    
    $id = sprintf(
        '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        mt_rand(0, 0xffff),
        mt_rand(0, 0xffff),
        mt_rand(0, 0xffff),
        mt_rand(0, 0x0fff) | 0x4000,
        mt_rand(0, 0x3fff) | 0x8000,
        mt_rand(0, 0xffff),
        mt_rand(0, 0xffff),
        mt_rand(0, 0xffff)
    );
    
    $pdo = getDbConnection();
    $stmt = $pdo->prepare("INSERT INTO articles (id, tag, title, excerpt, sections) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([$id, $tag, $title, $excerpt, json_encode($sections, JSON_UNESCAPED_UNICODE)]);
    
    $article = [
        'id' => $id,
        'tag' => $tag,
        'title' => $title,
        'excerpt' => $excerpt,
        'sections' => $sections,
        'createdAt' => date('c')
    ];
    
    http_response_code(201);
    response($article);
}

/**
 * Обновить статью
 */
function updateArticle($id) {
    $input = json_decode(file_get_contents('php://input'), true);
    
    $pdo = getDbConnection();
    $stmt = $pdo->prepare("SELECT * FROM articles WHERE id = ?");
    $stmt->execute([$id]);
    $article = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$article) {
        http_response_code(404);
        response(['error' => 'Not found']);
        return;
    }
    
    $updates = [];
    $params = [];
    
    if (isset($input['tag'])) {
        $updates[] = "tag = ?";
        $params[] = $input['tag'];
    }
    if (isset($input['title'])) {
        $updates[] = "title = ?";
        $params[] = $input['title'];
    }
    if (isset($input['excerpt'])) {
        $updates[] = "excerpt = ?";
        $params[] = $input['excerpt'];
    }
    if (isset($input['sections'])) {
        $updates[] = "sections = ?";
        $params[] = json_encode($input['sections'], JSON_UNESCAPED_UNICODE);
    }
    
    if (!empty($updates)) {
        $params[] = $id;
        $sql = "UPDATE articles SET " . implode(', ', $updates) . " WHERE id = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
    }
    
    // Возвращаем обновлённую статью
    $stmt = $pdo->prepare("SELECT * FROM articles WHERE id = ?");
    $stmt->execute([$id]);
    $updated = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($updated['sections']) {
        $updated['sections'] = json_decode($updated['sections'], true);
    }
    
    response($updated);
}

/**
 * Удалить статью
 */
function deleteArticle($id) {
    $pdo = getDbConnection();
    $stmt = $pdo->prepare("DELETE FROM articles WHERE id = ?");
    $stmt->execute([$id]);
    
    response(['ok' => true]);
}

/**
 * Получить контент сайта
 */
function getContent() {
    $pdo = getDbConnection();
    $stmt = $pdo->query("SELECT content FROM site_content WHERE id = 1");
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$row) {
        response([]);
        return;
    }
    
    response(json_decode($row['content'], true));
}

/**
 * Обновить контент сайта
 */
function updateContent() {
    $input = json_decode(file_get_contents('php://input'), true);
    
    $pdo = getDbConnection();
    $stmt = $pdo->prepare("UPDATE site_content SET content = ? WHERE id = 1");
    $stmt->execute([json_encode($input, JSON_UNESCAPED_UNICODE)]);
    
    response($input);
}

/**
 * Функция ответа
 */
function response($data) {
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit();
}

/**
 * Получение всех заголовков
 */
function getallheaders() {
    $headers = [];
    foreach ($_SERVER as $name => $value) {
        if (substr($name, 0, 5) == 'HTTP_') {
            $headers[str_replace(' ', '-', ucwords(strtolower(str_replace('_', ' ', substr($name, 5)))))] = $value;
        }
    }
    return $headers;
}
