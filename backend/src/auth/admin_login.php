<?php
header("Content-Type: application/json");
require_once __DIR__ . '/../src/Shared/db.php';
require_once __DIR__ . '/../src/Shared/Guard.php';
 
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
        echo json_encode([
            "success" => true,
            "redirect" => "/admin/dashboard",
            "api_key" => "YOUR_SUPER_SECRET_KEY_FROM_ENV", 
            "user" => ["id" => $user['id'], "name" => $user['full_name'], "role" => $role]
        ]);
    } 
    elseif ($role === 'club_leader') {
        echo json_encode([
            "success" => true,
            "redirect" => "/club/management",
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