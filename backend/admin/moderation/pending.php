<?php
header("Content-Type: application/json");

// 1. Load the Guard and DB
require_once __DIR__ . '/../../src/Shared/db.php';
require_once __DIR__ . '/../../src/Shared/Guard.php';

// 2. Security Check: API Key + Role + IP Blacklist
// This will die() and return 401/403 if the request is unauthorized
Guard::moderateAccess('admin');

$pdo = get_db_connection();

try {
    // 3. The Query
    // We fetch everything an admin needs to make a decision:
    // - Opportunity details
    // - The name/university of the Club Leader who posted it
    $sql = "
        SELECT 
            o.id, 
            o.title, 
            o.organization_name, 
            o.description,
            o.deadline,
            o.created_at,
            o.status,
            u.full_name as author_name,
            u.email as author_email,
            univ.name as university_name
        FROM opportunities o
        JOIN users u ON o.created_by = u.id
        JOIN universities univ ON u.university_id = univ.id
        WHERE o.status = 'pending'
        ORDER BY o.created_at ASC
    ";

    $stmt = $pdo->query($sql);
    $pendingList = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // 4. Response
    echo json_encode([
        "success" => true,
        "count" => count($pendingList),
        "data" => $pendingList
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Failed to retrieve moderation queue",
        "error" => $e->getMessage()
    ]);
}