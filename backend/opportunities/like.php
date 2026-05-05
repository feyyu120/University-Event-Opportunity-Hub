<?php
header("Content-Type: application/json");
require_once __DIR__ . '/../src/Shared/db.php';

$data = json_decode(file_get_contents('php://input'), true);
$opportunity_id = $data['opportunity_id'] ?? null;
$user_id = $data['user_id'] ?? null;

if (!$opportunity_id || !$user_id) {
    http_response_code(400);
    echo json_encode(["error" => "Opportunity ID and User ID required"]);
    exit;
}

$pdo = get_db_connection();

try {
    // Check if already liked
    $stmt = $pdo->prepare("SELECT id FROM opportunity_likes WHERE opportunity_id = ? AND user_id = ?");
    $stmt->execute([$opportunity_id, $user_id]);
    $existing = $stmt->fetch();

    if ($existing) {
        // Unlike
        $del = $pdo->prepare("DELETE FROM opportunity_likes WHERE id = ?");
        $del->execute([$existing['id']]);
        $liked = false;
    } else {
        // Like
        $ins = $pdo->prepare("INSERT INTO opportunity_likes (opportunity_id, user_id) VALUES (?, ?)");
        $ins->execute([$opportunity_id, $user_id]);
        $liked = true;
    }

    // Get updated count
    $countStmt = $pdo->prepare("SELECT COUNT(*) FROM opportunity_likes WHERE opportunity_id = ?");
    $countStmt->execute([$opportunity_id]);
    $count = $countStmt->fetchColumn();

    echo json_encode([
        "success" => true,
        "liked" => $liked,
        "like_count" => $count
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>
