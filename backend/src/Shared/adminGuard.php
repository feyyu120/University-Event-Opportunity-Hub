<?php 

require_once __DIR__ . '/db.php';

class Guard {  
    public static function checkIP($userId = null) {
        $pdo = get_db_connection();
        $ip = $_SERVER['REMOTE_ADDR'];
          
        if (!$userId) {
            $userId = $_SERVER['HTTP_X_USER_ID'] ?? null;
        }

        $stmt = $pdo->prepare("
            SELECT reason FROM ip_blacklist 
            WHERE ip_address = ? 
            OR (user_id = ? AND user_id IS NOT NULL)
        ");
        $stmt->execute([$ip, $userId]);
        $blacklist = $stmt->fetch();
        
        if ($blacklist) {
            http_response_code(403);
            die(json_encode([
                "success" => false, 
                "message" => "Access denied. Security risk identified.",
                "reason" => $blacklist['reason']
            ]));
        }
    } 
    public static function checkAccess($requiredRole = 'admin') { 
        $authId = $_SERVER['HTTP_X_USER_ID'] ?? $_SERVER['HTTP_USER_ID'] ?? null;
    
        if (!$authId) {
            self::denyAccess("Authentication required. Header missing.");
        }   

        $pdo = get_db_connection(); 
        $stmt = $pdo->prepare("SELECT id, role FROM users WHERE id = ?");
        $stmt->execute([$authId]);
        $user = $stmt->fetch();

        if (!$user) {
            self::denyAccess("User account not found.");
        }
 
        if ($user['role'] !== $requiredRole) {
            // Non-admin hitting an admin endpoint: check IP and punish
            self::checkIP($authId);
            if ($requiredRole === 'admin') {
                self::blockCurrentIP("Unauthorized role escalation attempt", $authId);
            }
            self::denyAccess("Access denied. $requiredRole privileges required.");
        }

        // Confirmed admin: skip IP check.
        // Admins manage the blacklist so an IP collision must not lock them out.
        return $user['id'];
    } 

    public static function blockCurrentIP($reason, $userId = null) {
        $pdo = get_db_connection();
        $ip = $_SERVER['REMOTE_ADDR']; 
        $stmt = $pdo->prepare("
            INSERT INTO ip_blacklist (ip_address, reason, user_id) 
            VALUES (?, ?, ?) 
            ON CONFLICT (ip_address) 
            DO UPDATE SET reason = EXCLUDED.reason, user_id = EXCLUDED.user_id
        ");
        $stmt->execute([$ip, $reason, $userId]);
    }

    private static function denyAccess($msg) {
        http_response_code(200);
        die(json_encode(["success" => false, "message" => $msg]));
    }
}