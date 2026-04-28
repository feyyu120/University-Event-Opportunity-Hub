<?php
require_once __DIR__ . '/adminGuard.php';
require_once __DIR__ . '/db.php';

class ClubGuard extends Guard {
    public static function checkAccess() { 
        self::checkIP();
        
        $user_id = $_SERVER['HTTP_USER_ID'] ?? null;
        $pdo = get_db_connection();
        
        $stmt = $pdo->prepare("SELECT role FROM users WHERE id = ?");
        $stmt->execute([$user_id]);
        $user = $stmt->fetch(); 

        if (!$user || !in_array($user['role'], ['club_leader', 'admin'])) {
            http_response_code(403);
            die(json_encode(["success" => false, "message" => "Access denied. Club Leader role required."]));
        }
        
        return $user_id;
    }
}