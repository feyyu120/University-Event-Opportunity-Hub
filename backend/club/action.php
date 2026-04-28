<?php
header("Content-Type: application/json");

require_once __DIR__ . '/../src/Shared/db.php';
require_once __DIR__ . '/../src/Shared/clubGuard.php';

$user_id = ClubGuard::checkAccess();
$data = json_decode(file_get_contents('php://input'), true);
$action = $data['action'] ?? null;
$opp_id = $data['opportunity_id'] ?? null;

$pdo = get_db_connection();

try { 
    $check = $pdo->prepare("SELECT created_by, status FROM opportunities WHERE id = ?");
    $check->execute([$opp_id]);
    $opp = $check->fetch();

    if (!$opp || $opp['created_by'] !== $user_id) {
        throw new Exception("You do not have permission to modify this post.");
    }

    switch ($action) {
        case 'delete':
            $pdo->prepare("DELETE FROM opportunities WHERE id = ?")->execute([$opp_id]);
            echo json_encode(["success" => true, "message" => "Post deleted successfully."]);
            break;

        case 'resubmit': 
            if ($opp['status'] !== 'rejected') throw new Exception("Only rejected posts can be resubmitted.");
            
            $pdo->prepare("UPDATE opportunities SET status = 'pending', rejection_reason = NULL WHERE id = ?")
                ->execute([$opp_id]);
            echo json_encode(["success" => true, "message" => "Post resubmitted for approval."]);
            break;

        default:
            throw new Exception("Invalid action.");
    }
} catch (Exception $e) {
    http_response_code(403);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}