<?php
header("Content-Type: application/json");
require_once __DIR__ . '/../src/Shared/db.php';
require_once __DIR__ . '/../src/Shared/validator.php';

$data = json_decode(file_get_contents('php://input'), true);
$user_id = $data['user_id'] ?? null;
$action = $data['action'] ?? null;  
$interest = $data['interest'] ?? null;

if (empty($user_id) || Validator::ischeckedUserId($user_id)) {
    echo json_encode(["message" => "Unknown user"]);
    exit;
}

$pdo = get_db_connection();

if ($action === 'add') { 
    $sql = "UPDATE users SET interests = array_append(array_remove(interests, ?), ?) WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$interest, $interest, $user_id]);
} else {
    $sql = "UPDATE users SET interests = array_remove(interests, ?) WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$interest, $user_id]);
}

echo json_encode(["message" => "Interests updated"]);