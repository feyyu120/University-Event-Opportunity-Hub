<?php
// 1. GLOBAL MIDDLEWARE: Headers
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
 
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}
 
$requestUri = $_SERVER['REQUEST_URI'];
$basePath = 'University-Event-Opportunity-Hub/backend'; 
 
$route = str_replace($basePath, '', parse_url($requestUri, PHP_URL_PATH));
$route = trim($route, '/');
 
file_put_contents('requests.log', "[" . date('Y-m-d H:i:s') . "] " . $route . "\n", FILE_APPEND);
 
switch ($route) {
    case 'auth/register':
        require __DIR__ . '/src/auth/register.php';
        break;

    case 'auth/login':
        require __DIR__ . '/src/auth/login.php';
        break;
    case 'auth/autorize':
            require __DIR__ . '/src/auth/check_autorization.php';
            break;
    case 'users/me':
        require __DIR__ . '/users/me.php';
        break;
    
    case 'auth/logout':
        require __DIR__ . '/src/auth/logout.php';
        break;

            // i will work with those cases next
    // case 'opportunities': 
    //     require __DIR__ . '/opportunities/list.php';
    //     break;

    // case '':
    //     echo json_encode(["status" => "online", "message" => "University Hub API Gateway"]);
    //     break;

    default:
        http_response_code(404);
        echo json_encode(["error" => "Endpoint not found", "route" => $route]);
        break;
}