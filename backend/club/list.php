<?php
header("Content-Type: application/json");
require_once __DIR__ . '/../src/Shared/db.php';
require_once __DIR__ . '/../src/Shared/clubGuard.php';

$user_id = ClubGuard::checkAccess();
$pdo = get_db_connection();

try {
    $stmt = $pdo->prepare("
    SELECT 
        id, title, status, description, organization_name, 
        deadline, target_departments, min_year, 
        rejection_reason, created_at 
    FROM opportunities 
    WHERE created_by = ? 
    ORDER BY created_at DESC
");
    $stmt->execute([$user_id]);
    $my_posts = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "data" => $my_posts
    ]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}