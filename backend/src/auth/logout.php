<?php
header("Content-Type: application/json");

// require_once __DIR__ . '/../Shared/db.php';

$data = json_decode(file_get_contents('php://input'), true);
$user_id = $data['user_id'] ?? null;

if (!$user_id) {
    http_response_code(400);
    echo json_encode(["error" => "User ID required for logout"]);
    exit;
}


try {
    $pdo = get_db_connection();
    $stmt = $pdo->prepare("UPDATE users SET is_active = FALSE, last_active_at = NOW() WHERE id = ?");
    $stmt->execute([$user_id]);

    echo json_encode([
        "success" => true,
        "message" => "Logged out successfully. Account status set to inactive."
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}

?>