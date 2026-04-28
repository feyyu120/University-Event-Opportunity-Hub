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
    case 'users/saved':
        require __DIR__ . '/users/saved.php';
        break;


    case 'auth/logout':
        require __DIR__ . '/src/auth/logout.php';
        break;
    case 'users/interests':
        require __DIR__ . '/users/interests.php';
        break;
    
    case 'users/applications':
        require __DIR__ . '/users/applications.php';
        break; 

    case 'opportunities/feed': 
        require __DIR__ . '/opportunities/feed.php';
        break;
    case 'opportunities/report': 
        require __DIR__ . '/opportunities/report.php';
        break;

    // case '':
    //     echo json_encode(["status" => "online", "message" => "University Hub API Gateway"]);
    //     break;

    default:
        http_response_code(404);
        echo json_encode(["error" => "Endpoint not found", "route" => $route]);
        break;
}