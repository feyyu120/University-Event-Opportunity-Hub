<?php
header("Content-Type: application/json");
require_once __DIR__ . '/../../src/Shared/db.php';
require_once __DIR__ . '/../../src/Shared/Guard.php';

// 1. Strict Security Check
Guard::moderateAccess('admin');

$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents('php://input'), true);
$action = $data['action'] ?? null;
$target_id = $data['user_id'] ?? null;

$pdo = get_db_connection();

try {
    switch ($action) {
        
        // --- ACTION: UPDATE ROLE ---
        case 'update_role':
            $new_role = $data['role'] ?? null;
            if (!in_array($new_role, ['student', 'club_leader', 'admin'])) {
                throw new Exception("Invalid role specified.");
            }

            $stmt = $pdo->prepare("UPDATE users SET role = ? WHERE id = ? RETURNING full_name");
            $stmt->execute([$new_role, $target_id]);
            $user = $stmt->fetch();

            if (!$user) throw new Exception("User not found.");

            // Notify User
            $msg = "Your account has been promoted to " . strtoupper($new_role);
            $pdo->prepare("INSERT INTO notifications (user_id, title, message) VALUES (?, 'Role Updated', ?)")
                ->execute([$target_id, $msg]);

            echo json_encode(["success" => true, "message" => "Role updated for {$user['full_name']}"]);
            break;

        // --- ACTION: DELETE USER ---
        case 'delete':
            // Check if Admin is trying to delete themselves
            if ($target_id === $_SERVER['HTTP_X_USER_ID']) {
                throw new Exception("You cannot delete your own administrative account.");
            }

            $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
            $stmt->execute([$target_id]);

            echo json_encode(["success" => true, "message" => "User and all associated data removed."]);
            break;

        // --- ACTION: ADD USER (MANUAL) ---
        case 'add':
            $email = $data['email'] ?? null;
            $pass = password_hash($data['password'] ?? 'Temporary123!', PASSWORD_BCRYPT);
            $name = $data['full_name'] ?? 'New Staff';
            $role = $data['role'] ?? 'club_leader';
            $univ = $data['university_id'] ?? null;

            $stmt = $pdo->prepare("INSERT INTO users (email, password_hash, full_name, role, university_id) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([$email, $pass, $name, $role, $univ]);

            echo json_encode(["success" => true, "message" => "New $role account created for $name"]);
            break;

        default:
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Unknown action requested."]);
            break;
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}