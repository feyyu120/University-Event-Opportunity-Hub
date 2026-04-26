<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");

require_once __DIR__ . '/../Shared/db.php';
 

$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (empty($data['email']) || empty($data['password'])) {
    http_response_code(400);
    echo json_encode(["error" => "Email and password are required"]);
    exit;
}

$email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
$password = $data['password'];

$pdo = get_db_connection();

try { 
    $sql = "SELECT u.*, univ.name as university_name 
            FROM users u 
            LEFT JOIN universities univ ON u.university_id = univ.id 
            WHERE u.email = ?";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$email]);
    $user = $stmt->fetch();
 
    if ($user && password_verify($password, $user['password_hash'])) {
         
        $updateStmt = $pdo->prepare("UPDATE users SET last_active_at = NOW() WHERE id = ?");
        $updateStmt->execute([$user['id']]);
 
        echo json_encode([
            "message" => "Login successful",
            "user" => [
                "id" => $user['id'],
                "full_name" => $user['full_name'],
                "email" => $user['email'],
                "role" => $user['role'],
                "university" => $user['university_name'],
                "department" => $user['department'],
                "year" => $user['year']
            ]
        ]);
    } else { 
        http_response_code(401);
        echo json_encode(["error" => "Invalid email or password"]);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Internal Server Error: " . $e->getMessage()]);
}