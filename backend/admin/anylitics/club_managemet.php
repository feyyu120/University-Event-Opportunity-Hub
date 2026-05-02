<?php
header("Content-Type: application/json");
require_once __DIR__ . '/../../src/Shared/db.php';
require_once __DIR__ . '/../../src/Shared/adminGuard.php';

$admin_id = Guard::checkAccess();  
$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents('php://input'), true);
$action = $data['action'] ?? null;
$pdo = get_db_connection();

if (!$action || $method !== 'POST') {
    echo json_encode(["success" => false, "message" => "Invalid request"]);
    exit;
}

try {
    switch ($action) {
        case 'add': 
            $user_id = $data['user_id'];
            $club_name = $data['club_name'];
            
            $pdo->beginTransaction(); 
            $uStmt = $pdo->prepare("UPDATE users SET role = 'club_leader' WHERE id = ?");
            $uStmt->execute([$user_id]);
             
            $clStmt = $pdo->prepare("INSERT INTO club_leaders (user_id, club_name) VALUES (?, ?)");
            $clStmt->execute([$user_id, $club_name]);
            
            $pdo->commit();
            echo json_encode(["success" => true, "message" => "Club Leader added successfully"]);
            break;

        case 'update': 
            $leader_id = $data['id']; 
            $new_name = $data['club_name'];
            $is_verified = $data['is_verified'] ?? false;

            $stmt = $pdo->prepare("UPDATE club_leaders SET club_name = ?, is_verified = ? WHERE id = ?");
            $stmt->execute([$new_name, $is_verified ? 'true' : 'false', $leader_id]);
            
            echo json_encode(["success" => true, "message" => "Club updated"]);
            break;

        case 'remove': 
            $leader_id = $data['id'];
            
            $pdo->beginTransaction(); 
            $get = $pdo->prepare("SELECT user_id FROM club_leaders WHERE id = ?");
            $get->execute([$leader_id]);
            $uid = $get->fetchColumn();

            if ($uid) {
                $pdo->prepare("UPDATE users SET role = 'student' WHERE id = ?")->execute([$uid]);
                $pdo->prepare("DELETE FROM club_leaders WHERE id = ?")->execute([$leader_id]);
            }

            $pdo->commit();
            echo json_encode(["success" => true, "message" => "Club Leader removed and demoted"]);
            break;

        default:
            throw new Exception("Unknown action");
    }
} catch (Exception $e) {
    if ($pdo->inTransaction()) $pdo->rollBack();
    http_response_code(500);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}