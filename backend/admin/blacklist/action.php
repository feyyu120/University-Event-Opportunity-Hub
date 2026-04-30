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
$action = $data['action'] ?? null;
$pdo = get_db_connection();

if (!$action) {
    echo json_encode(["success" => false, "message" => "Action (ban/unban) is required"]);
    exit;
}

try {
    switch ($action) {
        case 'ban':
            $target_user_id = $data['user_id'] ?? null;
            $reason = $data['reason'] ?? 'Violation of community guidelines';

            if (!$target_user_id) {
                throw new Exception("Target User ID is required for banning");
            }

            $pdo->beginTransaction();
 
            $stmt = $pdo->prepare("SELECT last_login_ip FROM users WHERE id = ?");
            $stmt->execute([$target_user_id]);
            $user = $stmt->fetch();
            $ip_to_block = $user['last_login_ip'] ?? $_SERVER['REMOTE_ADDR']; 
            if (!$ip_to_block) {
                $ip_to_block = '0.0.0.0'; 
            } 
            
            $blockStmt = $pdo->prepare("
                INSERT INTO ip_blacklist (ip_address, user_id, reason, blocked_by) 
                VALUES (?, ?, ?, ?)    ");
            $blockStmt->execute([$ip_to_block, $target_user_id, $reason, $admin_id]); 


            $updateUser = $pdo->prepare("UPDATE users SET role = 'banned' WHERE id = ?");
            $updateUser->execute([$target_user_id]);
 
            $pdo->commit();
            echo json_encode(["success" => true, "message" => "User and IP successfully blacklisted"]);
            break;

        case 'unban':
            $record_id = $data['id'] ?? null;  

            if (!$record_id) {
                throw new Exception("Record ID is required for unbanning");
            }

            $pdo->beginTransaction();
 
            $findStmt = $pdo->prepare("SELECT user_id FROM ip_blacklist WHERE id = ?");
            $findStmt->execute([$record_id]);
            $blacklistEntry = $findStmt->fetch();

            if ($blacklistEntry && $blacklistEntry['user_id']) {
                $restoreUser = $pdo->prepare("UPDATE users SET role = 'student' WHERE id = ?");
                $restoreUser->execute([$blacklistEntry['user_id']]);
            }

            $deleteStmt = $pdo->prepare("DELETE FROM ip_blacklist WHERE id = ?");
            $deleteStmt->execute([$record_id]);

            $pdo->commit();
            echo json_encode(["success" => true, "message" => "Access restored and user role reset."]);
            break;

        default:
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Invalid action: $action"]);
            break;
    }

} catch (Exception $e) {
    if ($pdo->inTransaction()) $pdo->rollBack();
    http_response_code(500);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}