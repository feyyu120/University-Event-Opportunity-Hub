<?php
header("Content-Type: application/json");
require_once __DIR__ . '/../../src/Shared/db.php';
require_once __DIR__ . '/../../src/Shared/adminGuard.php';
 
Guard::checkAccess();

$pdo = get_db_connection();
 
$search = $_GET['search'] ?? null;  
$role_filter = $_GET['role'] ?? null;  
$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 20;
$offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;

try {
    $params = [];
    $query = "SELECT id, full_name, email, role, department, year, created_at FROM users WHERE 1=1";
 
    if ($role_filter) {
        $query .= " AND role = ?";
        $params[] = $role_filter;
    }
 
    if ($search) {
        $query .= " AND (full_name ILIKE ? OR email ILIKE ?)";
        $params[] = "%$search%";
        $params[] = "%$search%";
    }

    $query .= " ORDER BY created_at DESC LIMIT ? OFFSET ?";
    $params[] = $limit;
    $params[] = $offset;

    $stmt = $pdo->prepare($query);
    $stmt->execute($params);
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "count" => count($users),
        "data" => $users
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}