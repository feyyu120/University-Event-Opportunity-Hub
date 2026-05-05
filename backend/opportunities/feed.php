<?php
header("Content-Type: application/json");

require_once __DIR__ . '/../src/Shared/db.php';

$data = json_decode(file_get_contents('php://input'), true);

$user_id = $data['user_id'] ?? null;
$limit = $data['limit'] ?? 10;
$offset = (($data['page'] ?? 1) - 1) * $limit;
$is_saved = $data['is_saved'] ?? false;
$is_applied = $data['is_applied'] ?? false;

$pdo = get_db_connection();

try { 
    $user = null;
    if ($user_id) {
        $userStmt = $pdo->prepare("SELECT interests, department, year FROM users WHERE id = ?");
        $userStmt->execute([$user_id]);
        $user = $userStmt->fetch();
    }

    $sql = "
    WITH OppTags AS (
        SELECT ot.opportunity_id, ARRAY_AGG(t.name) as tags
        FROM opportunity_tags ot
        JOIN tags t ON ot.tag_id = t.id
        GROUP BY ot.opportunity_id
    )
    SELECT 
        o.*,
        COALESCE(ot.tags, '{}') as tags,
        
        -- Scoring
        (CASE 
            WHEN ? IS NULL THEN 0 -- Anonymous users get 0 for interest match
            WHEN CARDINALITY(COALESCE(ot.tags, '{}')) = 0 THEN 0
            ELSE (
                SELECT COUNT(*) FROM UNNEST(ot.tags) t 
                WHERE t = ANY(?)
            )::float / GREATEST(CARDINALITY(?::text[]), 1)
         END * 0.35) as interest_score,

        (CASE 
            WHEN ? IS NULL THEN 0
            WHEN o.target_departments IS NULL OR ? = ANY(o.target_departments) THEN 0.25 
            ELSE 0 
         END) as dept_score,

        (EXP(-EXTRACT(DAY FROM (NOW() - o.created_at)) / 14.0) * 0.15) as recency_score,
        (LEAST(o.save_count / 100.0, 1.0) * 0.10) as popularity_score,

        (
            (CASE WHEN o.is_pinned THEN 2.0 ELSE 0 END) +
            (CASE WHEN ? IS NOT NULL AND (o.target_departments IS NULL OR ? = ANY(o.target_departments)) THEN 0.25 ELSE 0 END) +
            (EXP(-EXTRACT(DAY FROM (NOW() - o.created_at)) / 14.0) * 0.15) +
            (LEAST(o.save_count / 100.0, 1.0) * 0.10)
        ) as total_score

    FROM opportunities o
    LEFT JOIN OppTags ot ON o.id = ot.opportunity_id
    WHERE 1=1
    ";

    if ($is_saved && $user_id) {
        $sql .= " AND o.id IN (SELECT opportunity_id FROM saved_opportunities WHERE user_id = ?)";
    }
    if ($is_applied && $user_id) {
        $sql .= " AND o.id IN (SELECT opportunity_id FROM applications WHERE user_id = ?)";
    }

    $sql .= " ORDER BY o.is_pinned DESC, total_score DESC LIMIT ? OFFSET ?;";

    $stmt = $pdo->prepare($sql);
    
    $params = [
        $user_id, // interest_score check
        $user ? $user['interests'] : [], 
        $user ? $user['interests'] : [],
        $user_id, // dept_score check
        $user ? $user['department'] : null,
        $user_id, // total_score check
        $user ? $user['department'] : null,
    ];

    if ($is_saved && $user_id) $params[] = $user_id;
    if ($is_applied && $user_id) $params[] = $user_id;
    
    $params[] = $limit;
    $params[] = $offset;

    $stmt->execute($params);
    $results = $stmt->fetchAll();

    echo json_encode([
        "page" => $data['page'] ?? 1,
        "results" => $results
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>