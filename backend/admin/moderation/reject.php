<?php
header("Content-Type: application/json");
require_once __DIR__ . '/../../src/Shared/db.php';
require_once __DIR__ . '/../../src/Shared/Guard.php';

Guard::moderateAccess('admin');

$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents('php://input'), true);

$opp_id = $_GET['id'] ?? null;
$reason = $data['reason'] ?? 'No specific reason provided.';
$admin_id = $_SERVER['HTTP_X_USER_ID'];

if (!$opp_id) {
    echo json_encode(["success" => false, "message" => "Opportunity ID required"]);
    exit;
}

$pdo = get_db_connection();

try {
    $pdo->beginTransaction();

    // 1. Update status and store rejection reason
    $stmt = $pdo->prepare("UPDATE opportunities SET status = 'rejected', rejection_reason = ?, moderated_by = ?, moderated_at = NOW() WHERE id = ? RETURNING created_by, title");
    $stmt->execute([$reason, $admin_id, $opp_id]);
    $opportunity = $stmt->fetch();

    // 2. Send Panel Message (The "Notification")
    $msgStmt = $pdo->prepare("INSERT INTO notifications (user_id, title, message) VALUES (?, ?, ?)");
    $msgStmt->execute([
        $opportunity['created_by'],
        "Post Rejected ⚠️",
        "Your post '{$opportunity['title']}' was rejected. Reason: " . $reason
    ]);

    $pdo->commit();
    echo json_encode(["success" => true, "message" => "Opportunity rejected and author notified."]);

} catch (Exception $e) {
    $pdo->rollBack();
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}