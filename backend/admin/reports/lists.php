<?php
header("Content-Type: application/json");
require_once __DIR__ . '/../../src/Shared/db.php';
require_once __DIR__ . '/../../src/Shared/adminGuard.php';

Guard::checkAccess();

$pdo = get_db_connection();

try { 
    $sql = "
        SELECT 
            r.id as report_id,
            r.reason as report_reason,
            r.created_at as reported_at,
            o.id as opportunity_id,
            o.title as opportunity_title,
            o.status as opportunity_status,
            u.full_name as reported_by_name,
            author.full_name as author_name
        FROM reports r
        JOIN opportunities o ON r.opportunity_id = o.id
        JOIN users u ON r.reported_by = u.id
        JOIN users author ON o.created_by = author.id
        WHERE r.status = 'pending'
        ORDER BY r.created_at DESC
    ";

    $stmt = $pdo->query($sql);
    $reports = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "count" => count($reports),
        "data" => $reports
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}