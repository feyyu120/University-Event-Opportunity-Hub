<?php
header("Content-Type: application/json");

require_once __DIR__ . '/../src/Shared/db.php';
 
$user_id = $_GET['user_id'] ?? null;

if (!$user_id) {
    http_response_code(400);
    echo json_encode([
        'authorized'=> false,
        "message" => "User ID is required"]);
    exit;
}

$pdo = get_db_connection();

try {
    $sql = "SELECT u.id, u.email, u.full_name, u.department, u.year, u.role, 
                   u.interests, u.goals, u.is_active, u.created_at,
                   univ.name as university_name
            FROM users u
            LEFT JOIN universities univ ON u.university_id = univ.id
            WHERE u.id = ?";
            
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$user_id]);
    $user = $stmt->fetch();

    if ($user) {
        echo json_encode([
            'authorized'=> true,
            'data'=> $user
        ]);
    } else {
        http_response_code(404);
        echo json_encode([
            'authorized'=> false,
            "error" => "User not found"]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}