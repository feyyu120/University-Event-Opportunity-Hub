<?php
header("Content-Type: application/json");
require_once __DIR__ . '/../../src/Shared/db.php';
require_once __DIR__ . '/../../src/Shared/adminGuard.php'; 
 
$admin_id = Guard::checkAccess(); 

$method = $_SERVER['REQUEST_METHOD'];
if ($method !== 'POST') { 
    http_response_code(405);
    exit; 
}

$data = json_decode(file_get_contents('php://input'), true);
$opp_id = $data['id'] ?? null;
$action = $data['action'] ?? null; 
$reason = $data['reason'] ?? 'No specific reason provided.';

if (!$opp_id || !$action) {
    echo json_encode(["success" => false, "message" => "Opportunity ID and Action are required"]);
    exit;
}

$pdo = get_db_connection();

try {
    $pdo->beginTransaction(); 
    
    if ($action === 'approve') { 
        $stmt = $pdo->prepare("
            UPDATE opportunities o
            SET status = 'live', moderated_by = ?, moderated_at = NOW(), rejection_reason = NULL 
            WHERE o.id = ? 
            RETURNING (SELECT cl.user_id FROM club_leaders cl WHERE cl.id = o.created_by) as target_user_id, o.title
        ");
        $stmt->execute([$admin_id, $opp_id]);
        $opportunity = $stmt->fetch();

        $notifTitle = "Post Approved! 🎉";
        $notifMsg = "Your opportunity '{$opportunity['title']}' has been approved and is now live.";
    } 
    elseif ($action === 'reject') { 
        $stmt = $pdo->prepare("
            UPDATE opportunities o
            SET status = 'rejected', rejection_reason = ?, moderated_by = ?, moderated_at = NOW() 
            WHERE o.id = ? 
            RETURNING (SELECT cl.user_id FROM club_leaders cl WHERE cl.id = o.created_by) as target_user_id, o.title
        ");
        $stmt->execute([$reason, $admin_id, $opp_id]);
        $opportunity = $stmt->fetch();

        $notifTitle = "Post Rejected ⚠️";
        $notifMsg = "Your post '{$opportunity['title']}' was rejected. Reason: " . $reason;
    } 
    else {
        throw new Exception("Invalid action type");
    }

    if (!$opportunity || !$opportunity['target_user_id']) {
        throw new Exception("Opportunity or associated User not found.");
    } 
    $msgStmt = $pdo->prepare("INSERT INTO notifications (user_id, title, message) VALUES (?, ?, ?)");
    $msgStmt->execute([
        $opportunity['target_user_id'], 
        $notifTitle,
        $notifMsg
    ]);

    $pdo->commit();
    echo json_encode(["success" => true, "message" => "Opportunity " . ($action === 'approve' ? "approved" : "rejected")]);

} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(500);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}