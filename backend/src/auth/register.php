<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");

require_once __DIR__ . '/../Shared/db.php';
require_once __DIR__ . '/../Shared/validator.php';
// in this $data it acceps data like this json structure in the readme  before so use this structure 

$data = json_decode(file_get_contents('php://input'), true);
 
if (empty($data['email']) || empty($data['password']) || empty($data['full_name'])) {
    http_response_code(400);
    echo json_encode(["error" => "Missing required fields"]);
    exit;
}

$email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
$domain = substr(strrchr($email, "@"), 1); 
$pdo = get_db_connection();

try { 
    $univStmt = $pdo->prepare("SELECT id FROM universities WHERE email_domain = ? AND is_active = true");
    $univStmt->execute([$domain]);
    $university = $univStmt->fetch();

    if (!$university && Validator::isUniversityEmail($email)) {
        http_response_code(403);
        echo json_encode(["error" => "Your email is not yet supported. Please use a university email."]);
        exit;
    }
 
    $checkStmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $checkStmt->execute([$email]);
    if ($checkStmt->fetch()) {
        http_response_code(409);
        echo json_encode(["error" => "Email already registered"]);
        exit;
    }
 
    $hashedPassword = password_hash($data['password'], PASSWORD_BCRYPT);
    
    $sql = "INSERT INTO users (email, password_hash, full_name, department, year, university_id) 
            VALUES (?, ?, ?, ?, ?, ?)";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $email, 
        $hashedPassword, 
        $data['full_name'], 
        $data['department'] ?? null, 
        $data['year'] ?? null,
        $university['id']
    ]);

    echo json_encode(["message" => "Registration successful! continue to login"]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database failure: " . $e->getMessage()]);
}