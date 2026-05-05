<?php
header("Content-Type: application/json");
require_once __DIR__ . '/../src/Shared/db.php';

$opportunity_id = $_GET['id'] ?? null;
$user_id = $_GET['user_id'] ?? null;

if (!$opportunity_id) {
    http_response_code(400);
    echo json_encode(["error" => "Opportunity ID required"]);
    exit;
}

$pdo = get_db_connection();

try {
    // 1. Fetch Opportunity Detail
    $stmt = $pdo->prepare("
        SELECT 
            o.*,
            (SELECT COUNT(*) FROM opportunity_likes WHERE opportunity_id = o.id) as real_like_count,
            (SELECT COUNT(*) FROM opportunity_comments WHERE opportunity_id = o.id) as real_comment_count,
            EXISTS(SELECT 1 FROM opportunity_likes WHERE opportunity_id = o.id AND user_id = ?) as is_liked,
            EXISTS(SELECT 1 FROM saved_opportunities WHERE opportunity_id = o.id AND user_id = ?) as is_saved,
            EXISTS(SELECT 1 FROM applications WHERE opportunity_id = o.id AND user_id = ?) as is_applied
        FROM opportunities o
        WHERE o.id = ?
    ");
    $stmt->execute([$user_id, $user_id, $user_id, $opportunity_id]);
    $opportunity = $stmt->fetch();

    if (!$opportunity) {
        http_response_code(404);
        echo json_encode(["error" => "Opportunity not found"]);
        exit;
    }

    // 2. Fetch Comments (Threaded)
    $commentStmt = $pdo->prepare("
        SELECT 
            c.*, 
            u.full_name as user_name,
            u.profile_image
        FROM opportunity_comments c
        JOIN users u ON c.user_id = u.id
        WHERE c.opportunity_id = ?
        ORDER BY c.created_at ASC
    ");
    $commentStmt->execute([$opportunity_id]);
    $comments = $commentStmt->fetchAll();

    echo json_encode([
        "success" => true,
        "data" => $opportunity,
        "comments" => $comments
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>
