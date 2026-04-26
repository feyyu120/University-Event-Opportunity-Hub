<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");

require_once __DIR__ . '/../Shared/db.php';
 

$json = file_get_contents('php://input');
$data = json_decode($json, true); 
if (empty($data['user_id']) || empty($data['role'])) {
    http_response_code(400);
    echo json_encode([
        "authorized" => false,
        "error" => "Missing user_id or required_role"]);
    exit;
}
try { 
$user_id = $data['user_id'];
$required_role = $data['role'];  
$pdo = get_db_connection();


    $stmt = $pdo->prepare("SELECT id, role FROM users WHERE id = ?");
    $stmt->execute([$user_id]);
    $user = $stmt->fetch();

    if (!$user) {
        http_response_code(404);
        echo json_encode(["authorized" => false, "error" => "User not found"]);
        exit;
    }
 
    if ($user['role'] === $required_role) {
        echo json_encode([
            "authorized" => true,
            "message" => "User has the required permissions",
            "current_role" => $user['role']
        ]);
    } else {
        http_response_code(403);  
        echo json_encode([
            "authorized" => false, 
            "error" => "Permission denied. Required: $required_role, Found: " . $user['role']
        ]);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}