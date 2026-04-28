<?php
header("Content-Type: application/json");
require_once __DIR__ . '/../../src/Shared/db.php';
require_once __DIR__ . '/../../src/Shared/Guard.php';

Guard::moderateAccess('admin');

$method = $_SERVER['REQUEST_METHOD'];
if ($method !== 'PUT') { exit; }

// Get ID from URL or Body (Assuming /approve.php?id=UUID)
$opp_id = $_GET['id'] ?? null;
$admin_id = $_SERVER['HTTP_X_USER_ID']; 

if (!$opp_id) {
    echo json_encode(["success" => false, "message" => "Opportunity ID is required"]);
    exit;
}

$pdo = get_db_connection();

try {
    $pdo->beginTransaction();

    // 1. Update Status
    $stmt = $pdo->prepare("UPDATE opportunities SET status = 'live', moderated_by = ?, moderated_at = NOW() WHERE id = ? RETURNING created_by, title");
    $stmt->execute([$admin_id, $opp_id]);
    $opportunity = $stmt->fetch();

    if (!$opportunity) {
        throw new Exception("Opportunity not found");
    }

    // 2. Send Panel Message to Club Leader
    $msgStmt = $pdo->prepare("INSERT INTO notifications (user_id, title, message) VALUES (?, ?, ?)");
    $msgStmt->execute([
        $opportunity['created_by'],
        "Post Approved! 🎉",
        "Your opportunity '{$opportunity['title']}' has been approved and is now live for students."
    ]);

    $pdo->commit();
    echo json_encode(["success" => true, "message" => "Opportunity is now live"]);

} catch (Exception $e) {
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}