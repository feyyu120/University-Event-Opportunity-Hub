<?php
header("Content-Type: application/json");
require_once __DIR__ . '/../src/Shared/db.php';  

$method = $_SERVER['REQUEST_METHOD'];
 
if ($method !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$pdo = get_db_connection();
 
$opp_id = $data['opportunity_id'] ?? null;
$user_id = $data['user_id'] ?? null;
$reason = trim($data['reason'] ?? '');

if (!$opp_id || !$user_id || empty($reason)) {
    http_response_code(400);
    echo json_encode([
        "success" => false, 
        "message" => "Missing required fields: opportunity_id, user_id, and reason are mandatory."
    ]);
    exit;
}
 
if (strlen($reason) < 10) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Please provide a more detailed reason (min 10 characters)."]);
    exit;
}

try { 
    $userCheck = $pdo->prepare("SELECT id FROM users WHERE id = ?");
    $userCheck->execute([$user_id]);
    if (!$userCheck->fetch()) {
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "User account not found."]);
        exit;
    }
 
    $oppCheck = $pdo->prepare("SELECT id FROM opportunities WHERE id = ?");
    $oppCheck->execute([$opp_id]);
    if (!$oppCheck->fetch()) {
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "The opportunity you are trying to report does not exist."]);
        exit;
    } 
    $dupCheck = $pdo->prepare("SELECT id FROM reports WHERE opportunity_id = ? AND reported_by = ? AND status = 'pending'");
    $dupCheck->execute([$opp_id, $user_id]);
    if ($dupCheck->fetch()) {
        http_response_code(409);  
        echo json_encode(["success" => false, "message" => "You have already reported this opportunity. Our team is reviewing it."]);
        exit;
    } 
    
    $stmt = $pdo->prepare("INSERT INTO reports (opportunity_id, reported_by, reason, status) VALUES (?, ?, ?, 'pending')");
    $stmt->execute([$opp_id, $user_id, htmlspecialchars($reason)]);  

    echo json_encode([
        "success" => true, 
        "message" => "Report submitted. Thank you for keeping the community safe."
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false, 
        "error" => "Internal Server Error",
        "debug" => $e->getMessage()  
      ]);
}