<?php   
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE, PUT"); 
header("Access-Control-Allow-Headers: Content-Type, X-User-ID, Authorization");
 
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

function get_db_connection() { 
    $dbUrl = getenv('DATABASE_URL');

    if ($dbUrl) { 
        $conn = parse_url($dbUrl);
        $dsn = "pgsql:host=" . $conn['host'] . ";port=" . ($conn['port'] ?? 5432) . ";dbname=" . ltrim($conn['path'], '/') . ";sslmode=require";
        $user = $conn['user'];
        $pass = $conn['pass'];
        
    } else { 
        $dsn = "pgsql:host=localhost;port=5432;dbname=uni_hub";
        $user = "abuki"; 
        $pass = "your_password";  
    }
    
    try {
        $pdo = new PDO($dsn, $user, $pass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);
 
        $pdo->exec("SET search_path TO public"); 
        return $pdo;

    } catch (PDOException $e) { 
        header('Content-Type: application/json');
        die(json_encode(["error" => "Connection Failed: " . $e->getMessage()]));
    }
}