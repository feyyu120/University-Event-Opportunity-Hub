<?php
header("Content-Type: application/json");

require_once __DIR__ . '/../src/Shared/db.php';

$data = json_decode(file_get_contents('php://input'), true);

$user_id = $data['user_id'] ?? null;
$limit = $data['limit'] ?? 10;
$offset = (($data['page'] ?? 1) - 1) * $limit;

if (!$user_id) {
    echo json_encode(["error" => "User ID required"]);
    exit;
}

$pdo = get_db_connection();

try { 
    $userStmt = $pdo->prepare("SELECT interests, department, year FROM users WHERE id = ?");
    $userStmt->execute([$user_id]);
    $user = $userStmt->fetch();

    if (!$user) {
        echo json_encode(["error" => "User not found"]);
        exit;
    }

    // 2. The Scoring Query (The Formula)
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
        
        -- A. Interest Match (0.35)
        -- Uses cardinality of the intersection of user interests and opportunity tags
        (CASE 
            WHEN CARDINALITY(COALESCE(ot.tags, '{}')) = 0 THEN 0
            ELSE (
                SELECT COUNT(*) FROM UNNEST(ot.tags) t 
                WHERE t = ANY(?)
            )::float / GREATEST(CARDINALITY(?::text[]), 1)
         END * 0.35) as interest_score,

        -- B. Department Match (0.25)
        (CASE 
            WHEN o.target_departments IS NULL OR ? = ANY(o.target_departments) THEN 0.25 
            ELSE 0 
         END) as dept_score,

        -- C. Recency Score (0.15) - Decay over 14 days
        (EXP(-EXTRACT(DAY FROM (NOW() - o.created_at)) / 14.0) * 0.15) as recency_score,

        -- D. Popularity (0.10)
        (LEAST(o.save_count / 100.0, 1.0) * 0.10) as popularity_score,

        -- Final Score Calculation
        (
            -- We add a huge boost for Pinned items to handle 'Cold Start'
            (CASE WHEN o.is_pinned THEN 2.0 ELSE 0 END) +
            (CASE WHEN o.target_departments IS NULL OR ? = ANY(o.target_departments) THEN 0.25 ELSE 0 END) +
            (EXP(-EXTRACT(DAY FROM (NOW() - o.created_at)) / 14.0) * 0.15) +
            (LEAST(o.save_count / 100.0, 1.0) * 0.10)
        ) as total_score

    FROM opportunities o
    LEFT JOIN OppTags ot ON o.id = ot.opportunity_id
    ORDER BY o.is_pinned DESC, total_score DESC
    LIMIT ? OFFSET ?;
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $user['interests'], // For interest match
        $user['interests'], // For normalization
        $user['department'], // For dept match
        $user['department'], // For final calculation
        $limit,
        $offset
    ]);

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