<?php
class Validator {
    public static function isUniversityEmail($email) {
        $allowedDomains = ['astu.edu.et', 'aau.edu.et', 'university.edu.et']; 
        $parts = explode('@', $email);
        $domain = array_pop($parts);
        
        return in_array($domain, $allowedDomains);
    }
    public static function ischeckedUserId($user_id) { 
        return !preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i', $user_id);
    }
}

?>