<?php
header("Content-Type: application/json");
require_once __DIR__ . '/../src/Shared/db.php';

$method = $_SERVER['REQUEST_METHOD'];
if ($method !== 'POST') {
    http_response_code(405);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$pdo = get_db_connection();

try {
    $stmt = $pdo->prepare("INSERT INTO reports (opportunity_id, reported_by, reason) VALUES (?, ?, ?)");
    $stmt->execute([
        $data['opportunity_id'],
        $data['user_id'],
        $data['reason']
    ]);

    echo json_encode(["message" => "Report submitted. Thank you for keeping the community safe."]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>