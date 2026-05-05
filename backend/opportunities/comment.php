<?php
header("Content-Type: application/json");
require_once __DIR__ . '/../src/Shared/db.php';

$data = json_decode(file_get_contents('php://input'), true);
$opportunity_id = $data['opportunity_id'] ?? null;
$user_id = $data['user_id'] ?? null;
$content = trim($data['content'] ?? '');
$parent_id = $data['parent_id'] ?? null;

if (!$opportunity_id || !$user_id || empty($content)) {
    http_response_code(400);
    echo json_encode(["error" => "Missing required fields"]);
    exit;
}

$pdo = get_db_connection();

try {
    $stmt = $pdo->prepare("
        INSERT INTO opportunity_comments (opportunity_id, user_id, content, parent_id) 
        VALUES (?, ?, ?, ?) 
        RETURNING id, created_at
    ");
    $stmt->execute([$opportunity_id, $user_id, htmlspecialchars($content), $parent_id]);
    $newComment = $stmt->fetch();

    echo json_encode([
        "success" => true,
        "message" => "Comment posted successfully",
        "data" => array_merge($newComment, [
            "content" => $content,
            "user_id" => $user_id,
            "parent_id" => $parent_id
        ])
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>
