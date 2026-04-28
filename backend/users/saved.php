<?php
header("Content-Type: application/json");

require_once __DIR__ . '/../src/Shared/db.php';
require_once __DIR__ . '/../src/Shared/validator.php';

$method = $_SERVER['REQUEST_METHOD'];
$pdo = get_db_connection();

if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $user_id = $data['user_id'] ?? null;
    $opp_id = $data['opportunity_id'] ?? null;

    if (!$user_id || Validator::ischeckedUserId($user_id)|| !$opp_id) {
        echo json_encode(["error" => "Missing IDs"]);
        exit;
    }

    try { 
        $check = $pdo->prepare("SELECT 1 FROM saved_opportunities WHERE user_id = ? AND opportunity_id = ?");
        $check->execute([$user_id, $opp_id]);

        if ($check->fetch()) { 
            $stmt = $pdo->prepare("DELETE FROM saved_opportunities WHERE user_id = ? AND opportunity_id = ?");
            $stmt->execute([$user_id, $opp_id]);
            echo json_encode(["saved" => false, "message" => "Opportunity unsaved"]);
        } else { 
            $stmt = $pdo->prepare("INSERT INTO saved_opportunities (user_id, opportunity_id) VALUES (?, ?)");
            $stmt->execute([$user_id, $opp_id]);
            echo json_encode(["saved" => true, "message" => "Opportunity saved"]);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
}
 
if ($method === 'GET') {
    $user_id = $_GET['user_id'] ?? null;
     
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
    $offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;
 
    if (!$user_id) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "User ID is required"]);
        exit;
    }
 
    if (Validator::ischeckedUserId($user_id)) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Invalid User ID format"]);
        exit;
    }

    try { 
        $userCheck = $pdo->prepare("SELECT 1 FROM users WHERE id = ?");
        $userCheck->execute([$user_id]);
        if (!$userCheck->fetch()) {
            http_response_code(404);
            echo json_encode(["success" => false, "message" => "User not found"]);
            exit;
        }
 
        $sql = "
            SELECT o.id, o.title, o.organization_name, o.deadline, o.save_count, s.saved_at 
            FROM opportunities o
            JOIN saved_opportunities s ON o.id = s.opportunity_id
            WHERE s.user_id = ?
            ORDER BY s.saved_at DESC
            LIMIT ? OFFSET ?
        ";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$user_id, $limit, $offset]);
        $savedItems = $stmt->fetchAll(); 
        echo json_encode([
            "success" => true,
            "count" => count($savedItems),
            "data" => $savedItems
        ]);

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            "success" => false, 
            "message" => "Database error occurred",
            "debug" => $e->getMessage() 
        ]);
    }
}
?>