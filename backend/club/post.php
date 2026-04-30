<?php
header("Content-Type: application/json");
require_once __DIR__ . '/../src/Shared/db.php';
require_once __DIR__ . '/../src/Shared/clubGuard.php';

$user_id = ClubGuard::checkAccessclub();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') exit;

$data = json_decode(file_get_contents('php://input'), true);
$pdo = get_db_connection();

try { 
    $stmt = $pdo->prepare('SELECT id FROM club_leaders WHERE user_id = ?');
    $stmt->execute([$user_id]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

$deadline = !empty($data['deadline']) ? $data['deadline'] : null;

if (!$deadline) {
    echo json_encode(["success" => false, "message" => "Deadline date is required."]);
    exit;
}
 
$stmt = $pdo->prepare("
    INSERT INTO opportunities 
    (title, description, organization_name, deadline, target_departments, min_year, created_by, status) 
    VALUES (?, ?, ?, ?, ?::text[], ?, ?, 'pending')
");

$stmt->execute([
    $data['title'],
    $data['description'],
    $data['organization_name'],
    $deadline,  
    $data['target_departments'], 
    $data['min_year'],
    $row['id'],
]);
    $updateCount = $pdo->prepare("
    UPDATE club_leaders 
    SET posts_count = posts_count + 1 
    WHERE id = ?    
    ");
    $updateCount->execute([$row["id"]]);

    echo json_encode(["success" => true, "message" => "Post submitted and awaiting admin approval."]);
} catch (PDOException $e) {
    http_response_code(403);
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}

?>