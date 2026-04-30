<?php
require_once __DIR__ . '/db.php';

class Guard { 
    public static function checkIP() {
        $pdo = get_db_connection();
        $ip = $_SERVER['REMOTE_ADDR'];
         
        $userId = $_SESSION['admin_id'] ?? null;

        $stmt = $pdo->prepare("SELECT reason FROM ip_blacklist WHERE ip_address = ? OR (user_id = ? AND user_id IS NOT NULL)");
        $stmt->execute([$ip, $userId]);
        $blacklist = $stmt->fetch();
        
        if ($blacklist) {
            http_response_code(403);
            die(json_encode(["success" => false, "message" => "Access denied. Reason: " . $blacklist['reason']]));
        }
    }
 
    public static function checkAccess() {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        self::checkIP();  
        $admin_id = $_SESSION['admin_id'] ?? null;

        if (!$admin_id) {
            self::denyAccess("Authentication required.");
        }

        $pdo = get_db_connection();
        $stmt = $pdo->prepare("SELECT role FROM users WHERE id = ?");
        $stmt->execute([$admin_id]);
        $user = $stmt->fetch();

        if (!$user || $user['role'] !== 'admin') {
            self::denyAccess("Admin role required.");
        }

        return $admin_id;
    } 
    public static function moderateAccess($requiredRole = 'admin') {
        self::checkIP();
 
        $apiKey = $_SERVER['HTTP_API_KEY'] ?? null;
        $envKey = 'admin';  
        if (!$apiKey || $apiKey !== $envKey) {
            http_response_code(401);
            die(json_encode(["success" => false, "message" => "Invalid or missing API Key"]));
        }
 
        $user_id = $_SERVER['HTTP_USER_ID'] ?? null;
        if (!$user_id) {
            http_response_code(400);
            die(json_encode(["success" => false, "message" => "User ID header missing"]));
        }

        $pdo = get_db_connection();
        $stmt = $pdo->prepare("SELECT role FROM users WHERE id = ?");
        $stmt->execute([$user_id]);
        $user = $stmt->fetch();

        if (!$user || $user['role'] !== $requiredRole) {
            self::blockCurrentIP("Unauthorized access attempt to $requiredRole endpoint", $user_id);
            http_response_code(403);
            die(json_encode(["success" => false, "message" => "Access denied."]));
        }

        return $user_id;
    }

    public static function blockCurrentIP($reason, $userId = null) {
        $pdo = get_db_connection();
        $ip = $_SERVER['REMOTE_ADDR']; 
        $stmt = $pdo->prepare("INSERT INTO ip_blacklist (ip_address, reason, user_id) VALUES (?, ?, ?) ON CONFLICT (ip_address) DO UPDATE SET reason = EXCLUDED.reason");
        $stmt->execute([$ip, $reason, $userId]);
    }

    private static function denyAccess($msg) {
        http_response_code(403);
        die(json_encode(["success" => false, "message" => $msg]));
    }
}