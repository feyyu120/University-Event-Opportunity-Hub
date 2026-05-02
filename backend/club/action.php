<?php
header("Content-Type: application/json");

require_once __DIR__ . '/../src/Shared/db.php';
require_once __DIR__ . '/../src/Shared/clubGuard.php';
 
$user_id = ClubGuard::checkAccessclub();

$data = json_decode(file_get_contents('php://input'), true);
$action = $data['action'] ?? null;
$opp_id = $data['opp_id'] ?? null;  

$pdo = get_db_connection();

try {  
    $stmtLeader = $pdo->prepare("SELECT id FROM club_leaders WHERE user_id = ?");
    $stmtLeader->execute([$user_id]);
    $leader_id = $stmtLeader->fetchColumn();

    if (!$leader_id) {
        throw new Exception("Club profile not found.");
    }
 
    $check = $pdo->prepare("SELECT created_by, status FROM opportunities WHERE id = ?");
    $check->execute([$opp_id]);
    $opp = $check->fetch();

    if (!$opp || $opp['created_by'] !== $leader_id) {
        throw new Exception("You do not have permission to modify this post.");
    }

    switch ($action) {
        case 'delete':
            $pdo->beginTransaction(); 
            
            $stmtDel = $pdo->prepare("DELETE FROM opportunities WHERE id = ?");
            $stmtDel->execute([$opp_id]);
     
            $updateCount = $pdo->prepare("
                UPDATE club_leaders 
                SET posts_count = GREATEST(0, posts_count - 1) 
                WHERE id = ?
            ");
            $updateCount->execute([$leader_id]);
    
            $pdo->commit();
            echo json_encode(["success" => true, "message" => "Post deleted successfully."]);
            break;

        case 'resubmit':  
            if ($opp['status'] !== 'rejected') {
                throw new Exception("Only rejected posts can be resubmitted.");
            }
             
            $stmt = $pdo->prepare("
                UPDATE opportunities 
                SET 
                    title = ?, 
                    organization_name = ?, 
                    description = ?, 
                    deadline = ?, 
                    target_departments = ?::text[], 
                    min_year = ?, 
                    status = 'pending',
                    rejection_reason = NULL,
                    created_at = NOW() 
                WHERE id = ? AND created_by = ?
            ");
        
            $stmt->execute([
                $data['title'],
                $data['organization_name'],
                $data['description'],
                $data['deadline'],
                $data['target_departments'], 
                $data['min_year'],
                $opp_id,
                $leader_id  
            ]);
        
            echo json_encode(["success" => true, "message" => "Changes saved and post resubmitted!"]);
            break;

        default:
            throw new Exception("Invalid action.");
    }
} catch (Exception $e) {
    if ($pdo->inTransaction()) $pdo->rollBack();
    http_response_code(403);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}