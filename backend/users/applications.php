<?php
header("Content-Type: application/json");

require_once __DIR__ . '/../src/Shared/db.php';
require_once __DIR__ . '/../src/Shared/validator.php';

$method = $_SERVER['REQUEST_METHOD'];

$pdo = get_db_connection();

if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
      
    if (empty($data['user_id']) || empty($data['opportunity_id'])) {
        http_response_code(400);
        echo json_encode(["message" => "User ID and Opportunity ID are required"]);
        exit;   
    }
 
    if (Validator::ischeckedUserId($data['user_id'])) {
        http_response_code(404);
        echo json_encode(["message" => "User Unknown"]);
        exit;   
    }

    $pdo = get_db_connection();

    try { 
        $checkStmt = $pdo->prepare("SELECT id FROM opportunities WHERE id = ?");
        $checkStmt->execute([$data['opportunity_id']]);
        
        if (!$checkStmt->fetch()) {
            http_response_code(404);
            echo json_encode([
                'success'=> false,
                "message" => "This opportunity does not exist or has been removed"]);
            exit;
        } 
        $stmt = $pdo->prepare("INSERT INTO user_applications (user_id, opportunity_id, notes, status, applied_at) 
                               VALUES (?, ?, ?, 'applied', NOW()) 
                               ON CONFLICT (user_id, opportunity_id) 
                               DO UPDATE SET applied_at = NOW(), notes = EXCLUDED.notes");
         
        $notes = $data['notes'] ?? '';

        $stmt->execute([$data['user_id'], $data['opportunity_id'], $notes]);
        
        echo json_encode([
            'success'=> true,
            "message" => "Application submitted successfully"]);

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'success'=> false,
            "error" => "Database error: " . $e->getMessage()]);
    }
}

if ($method === 'GET') {
    $user_id = $_GET['user_id']; 
    $limit = $_GET['limit'] ?? 10;
    $offset = $_GET['offset'] ?? 0;

    if(empty($user_id) || !Validator::ischeckedUserId($user_id)) {
        echo json_encode(["message" => "user Unknown"]);
        exit;   
    }

    $stmt = $pdo->prepare("SELECT * FROM user_applications WHERE user_id = ? LIMIT ? OFFSET ?");
    $stmt->execute([$user_id, $limit, $offset]);
    
    echo json_encode([
        "message" => "users applications list",
       "applications" =>$stmt->fetchAll()
    ]);
}