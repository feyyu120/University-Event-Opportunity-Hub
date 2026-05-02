<?php
header("Content-Type: application/json");
require_once __DIR__ . '/../../src/Shared/db.php';
require_once __DIR__ . '/../../src/Shared/adminGuard.php';

Guard::moderateAccess('admin');

$data = json_decode(file_get_contents('php://input'), true);
$report_id = $data['report_id'] ?? null;
$action = $data['action'] ?? null;  

if (!$report_id || !$action) {
    echo json_encode(["success" => false, "message" => "Missing report_id or action"]);
    exit;
}

$pdo = get_db_connection();

try {
    $pdo->beginTransaction();
 
    $stmt = $pdo->prepare("SELECT opportunity_id FROM reports WHERE id = ?");
    $stmt->execute([$report_id]);
    $report = $stmt->fetch();
    $opp_id = $report['opportunity_id'];

    switch ($action) {
        case 'dismiss': 
            $pdo->prepare("UPDATE reports SET status = 'dismissed' WHERE id = ?")->execute([$report_id]);
            $message = "Report dismissed. No action taken against the post.";
            break;

        case 'remove_post': 
            $pdo->prepare("UPDATE opportunities SET status = 'archived' WHERE id = ?")->execute([$opp_id]);
            $pdo->prepare("UPDATE reports SET status = 'resolved' WHERE id = ?")->execute([$report_id]);
            
 
            $pdo->prepare("INSERT INTO notifications (user_id, title, message) 
                           SELECT created_by, 'Post Removed', 'Your post has been removed due to community reports.' 
                           FROM opportunities WHERE id = ?")->execute([$opp_id]);
            
            $message = "Opportunity removed and status set to archived.";
            break;

        default:
            throw new Exception("Invalid action type.");
    }

    $pdo->commit();
    echo json_encode(["success" => true, "message" => $message]);

} catch (Exception $e) {
    $pdo->rollBack();
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}