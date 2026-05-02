<?php
header("Content-Type: application/json");
require_once __DIR__ . '/../../src/Shared/db.php';
require_once __DIR__ . '/./../Shared/adminGuard.php';
 
ini_set('session.cookie_httponly', 1);  
ini_set('session.cookie_secure', 1);    
ini_set('session.use_only_cookies', 1);
session_start();
 
Guard::checkIP();

$method = $_SERVER['REQUEST_METHOD'];
if ($method !== 'POST') { exit; }

$data = json_decode(file_get_contents('php://input'), true);
$email = $data['email'] ?? '';
$password = $data['password'] ?? '';

$pdo = get_db_connection();

try {
    $stmt = $pdo->prepare("SELECT id, password_hash, role, full_name FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();
 
    if (!$user || !password_verify($password, $user['password_hash'])) {
        http_response_code(401);
        echo json_encode(["success" => false, "message" => "Invalid credentials"]);
        exit;
    }

    $role = $user['role'];
 
    if ($role === 'admin') {  
        session_regenerate_id(true);  
        $_SESSION['admin_id'] = $user['id'];
        $_SESSION['last_activity'] = time(); 
        
        echo json_encode([
            "success" => true, 
            "message" => "Welcome, Admin",
            "redirect" => "admin_dashboard.php"  
        ]);
    }
    elseif ($role === 'club_leader') {
        echo json_encode([
            "success" => true, 
            "user" => ["id" => $user['id'], "name" => $user['full_name'], "role" => $role]
        ]);
    } 
    elseif ($role === 'student') { 
        Guard::blockCurrentIP("Student attempted to access restricted web portal");
        http_response_code(403);
        echo json_encode(["success" => false, "message" => "Access restricted to staff only. IP Logged."]);
    }

} catch (PDOException $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}