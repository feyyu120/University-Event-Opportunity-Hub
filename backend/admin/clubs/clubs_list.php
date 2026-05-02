<?php
header("Content-Type: application/json");
require_once __DIR__ . '/../../src/Shared/db.php';
require_once __DIR__ . '/../../src/Shared/adminGuard.php';

Guard::checkAccess();  

$pdo = get_db_connection();

try { 
    $stmt = $pdo->query("
        SELECT 
            cl.*, 
            u.full_name, 
            u.email 
        FROM club_leaders cl
        JOIN users u ON cl.user_id = u.id
        ORDER BY cl.club_name ASC
    ");
    $leaders = $stmt->fetchAll();

    echo json_encode(["success" => true, "data" => $leaders]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}