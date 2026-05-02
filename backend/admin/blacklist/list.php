<?php
header("Content-Type: application/json");
require_once __DIR__ . '/../../src/Shared/db.php';
require_once __DIR__ . '/../../src/Shared/adminGuard.php';

Guard::checkAccess(); 

$pdo = get_db_connection();
 
try { 
    $stmt = $pdo->query("
        SELECT 
            b.id, 
            b.ip_address, 
            b.user_id, 
            b.reason, 
            b.blocked_at,
            u.full_name as target_name, 
            admin.full_name as blocked_by_name 
        FROM ip_blacklist b
        LEFT JOIN users u ON b.user_id = u.id
        LEFT JOIN users admin ON b.blocked_by = admin.id
        ORDER BY b.blocked_at DESC
    ");
    $list = $stmt->fetchAll();
    echo json_encode(["success" => true, "data" => $list]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}