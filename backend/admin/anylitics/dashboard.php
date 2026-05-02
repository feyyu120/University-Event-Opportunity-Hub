<?php
// dahsboard API
header("Content-Type: application/json");

require_once __DIR__ . '/../../src/Shared/adminGuard.php';
require_once __DIR__ . '/../../src/Shared/db.php';


try {
    Guard::checkAccess();
    Guard::checkIP();

    $pdo = get_db_connection();

    $stats = []; 
    $userStats = $pdo->query("
        SELECT 
            COUNT(*) as total_users,
            COUNT(*) FILTER (WHERE role = 'student') as student_count,
            COUNT(*) FILTER (WHERE role = 'club_leader') as club_leader_count
        FROM users
    ")->fetch(PDO::FETCH_ASSOC);
    $stats['users'] = $userStats;
 
    $oppStats = $pdo->query("
        SELECT 
            COUNT(*) as total_opportunities,
            COUNT(*) FILTER (WHERE status = 'live') as live_posts,
            COUNT(*) FILTER (WHERE status = 'pending') as pending_moderation
        FROM opportunities
    ")->fetch(PDO::FETCH_ASSOC);
    $stats['opportunities'] = $oppStats;
 
    $engagement = $pdo->query("
        SELECT 
            (SELECT COUNT(*) FROM user_applications) as total_applications,
            (SELECT COUNT(*) FROM saved_opportunities) as total_saves
    ")->fetch(PDO::FETCH_ASSOC);
    $stats['engagement'] = $engagement;
 
    $topTags = $pdo->query("
        SELECT t.name, COUNT(ot.opportunity_id) as usage_count
        FROM tags t
        JOIN opportunity_tags ot ON t.id = ot.tag_id
        GROUP BY t.name
        ORDER BY usage_count DESC
        LIMIT 5
    ")->fetchAll(PDO::FETCH_ASSOC);
    $stats['top_tags'] = $topTags;
 
    $reports = $pdo->query("SELECT COUNT(*) as unresolved_reports FROM reports WHERE status = 'pending'")->fetch();
    $stats['system_health'] = [
        "unresolved_reports" => $reports['unresolved_reports']
    ];
    
 
    echo json_encode([
        "success" => true,
        "timestamp" => date('c'),
        "dashboard" => $stats
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Could not generate dashboard analytics",
        "error" => $e->getMessage()
    ]);
}