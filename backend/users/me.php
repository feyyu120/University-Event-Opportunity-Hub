<?php
header("Content-Type: application/json");

require_once __DIR__ . '/../src/Shared/db.php';
require_once __DIR__ . '/../src/Shared/validator.php';

$method = $_SERVER['REQUEST_METHOD'];
$pdo = get_db_connection();


$user_id = $_GET['user_id'] ?? null; 

if (!$user_id || Validator::isUniversityEmail($user_id)) {
    http_response_code(400);
    echo json_encode([
        'authorized'=> false,
        "message" => "User ID is required"]);
    exit;
}
switch ($method) {
    case 'GET':

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
    break;

    case 'PUT':
        $data = json_decode(file_get_contents('php://input'), true);
         
        $fields = [];
        $params = [];
        
        $allowedFields = ['full_name', 'department', 'year'];
        foreach ($allowedFields as $field) {
            if (isset($data[$field])) {
                $fields[] = "$field = ?";
                $params[] = $data[$field];
            }
        }

        if (empty($fields)) {
            echo json_encode(["message" => "No changes made"]);
            exit;
        }

        $params[] = $user_id;
        $sql = "UPDATE users SET " . implode(', ', $fields) . " WHERE id = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        
        echo json_encode(["message" => "Profile updated successfully"]);
        break;

    case 'DELETE': 
        $sql = "UPDATE users SET 
                full_name = 'Anonymized User', 
                email = CONCAT(id, '@deleted.com'), 
                is_active = false 
                WHERE id = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$user_id]);
        
        echo json_encode(["message" => "Account deleted and data anonymized"]);
        break;

}
?>