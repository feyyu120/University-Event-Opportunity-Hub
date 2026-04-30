<?php
header("Content-Type: application/json");
require_once __DIR__ . '/../src/Shared/db.php';
require_once __DIR__ . '/../src/Shared/clubGuard.php';

$user_id = ClubGuard::checkAccessclub();
$pdo = get_db_connection();
 

$stmt = $pdo->prepare("SELECT id, title, message, created_at FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 10");
$stmt->execute([$user_id]);
echo json_encode(["success" => true, "data" => $stmt->fetchAll(PDO::FETCH_ASSOC)]);