<?php
class Validator {
    public static function isUniversityEmail($email) {
        $allowedDomains = ['astu.edu.et', 'aau.edu.et', 'university.edu.et']; 
        $parts = explode('@', $email);
        $domain = array_pop($parts);
        
        return in_array($domain, $allowedDomains);
    }
}

?>