<?php
header("Content-Type: application/json");
 
require_once __DIR__ . '/../../src/Shared/db.php';
require_once __DIR__ . '/../../src/Shared/adminGuard.php';
 
Guard::checkAccess();

$pdo = get_db_connection();

try { 
    $sql = "
SELECT 
    o.id, 
    o.title, 
    o.organization_name, 
    o.description,
    o.deadline,
    o.created_at,
    o.status,
    cl.club_name as author_name, -- Fetched directly from club_leaders table
    u.email as author_email,      -- Fetched from users table via club_leaders
    univ.name as university_name
FROM opportunities o
-- First, join the club profile that created the post
JOIN club_leaders cl ON o.created_by = cl.id 
-- Second, join the user associated with that club profile for contact info
JOIN users u ON cl.user_id = u.id
-- Third, join the university via the user's profile
JOIN universities univ ON u.university_id = univ.id
WHERE o.status = 'pending'
ORDER BY o.created_at ASC";

    $stmt = $pdo->query($sql);
    $pendingList = $stmt->fetchAll(PDO::FETCH_ASSOC);
 
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