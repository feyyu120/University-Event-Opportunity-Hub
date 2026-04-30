<?php
require_once __DIR__ . '/adminGuard.php';
require_once __DIR__ . '/db.php';

class ClubGuard extends Guard {
    public static function checkAccessclub() { 
        self::checkIP();
         
        $club_leader_id = $_SERVER['HTTP_USER_ID'] ?? null; 
        
        if (!$club_leader_id) {
            self::deny();
        }

        $pdo = get_db_connection();
  
        $cstmt = $pdo->prepare("SELECT user_id FROM club_leaders WHERE id = ?");
        $cstmt->execute([$club_leader_id]);
        $cuser = $cstmt->fetch(); 

        if (!$cuser) {
            self::deny();
        } 

        $stmt = $pdo->prepare("SELECT id FROM users WHERE id = ? AND role = 'club_leader'");
        $stmt->execute([$cuser["user_id"]]);
        $user = $stmt->fetch();

        if (!$user) {
            self::deny();
        }
 
        return $user["id"]; 
    }

    private static function deny() {
        http_response_code(403);
        die(json_encode([
            "success" => false, 
            "message" => "Access denied. Unknown or unauthorized club leader."
        ]));
    }
}