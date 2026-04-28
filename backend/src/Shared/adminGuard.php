<?php
require_once __DIR__ . '/db.php';

class Guard {
    public static function checkIP() {
        $pdo = get_db_connection();
        $ip = $_SERVER['REMOTE_ADDR'];
        
        $stmt = $pdo->prepare("SELECT 1 FROM ip_blacklist WHERE ip_address = ?");
        $stmt->execute([$ip]);
        
        if ($stmt->fetch()) {
            http_response_code(403);
            die(json_encode(["success" => false, "message" => "Your IP is permanently blocked."]));
        }
    }

    public static function blockCurrentIP($reason) {
        $pdo = get_db_connection();
        $ip = $_SERVER['REMOTE_ADDR'];
        $stmt = $pdo->prepare("INSERT INTO ip_blacklist (ip_address, reason) VALUES (?, ?) ON CONFLICT DO NOTHING");
        $stmt->execute([$ip, $reason]);
    }

    public static function moderateAccess($requiredRole = 'admin') {
        self::checkIP();
 
        $apiKey = $_SERVER['ADMIN_ACCESIBLE_API_KEY'] ?? null;
        $envKey = trim(explode('=', preg_grep('/^ADMIN_API_KEY=/', file('.env'))[0] ?? '')[1] ?? null);

 
        if (!$apiKey || $apiKey !== $envKey) {
            http_response_code(401);
            die(json_encode(["success" => false, "message" => "Invalid or missing API Key"]));
        }
 
        $user_id = $_SERVER['USER_ID'] ?? null;
        if (!$user_id) {
            http_response_code(400);
            die(json_encode(["success" => false, "message" => "User ID header missing"]));
        }

        $pdo = get_db_connection();
        $stmt = $pdo->prepare("SELECT role FROM users WHERE id = ?");
        $stmt->execute([$user_id]);
        $user = $stmt->fetch();

        if (!$user || $user['role'] !== $requiredRole) {
            self::blockCurrentIP("Unauthorized access attempt to $requiredRole endpoint");
            http_response_code(403);
            die(json_encode(["success" => false, "message" => "Access denied. Role mismatch."]));
        }
    }
}