<?php
require_once __DIR__ . '/src/Shared/db.php';

$pdo = get_db_connection();

try {
    // 1. Saved Opportunities Table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS saved_opportunities (
            id SERIAL PRIMARY KEY,
            user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            opportunity_id UUID NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(user_id, opportunity_id)
        );
    ");
    echo "Table 'saved_opportunities' ready.\n";

    // 2. Applications Table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS applications (
            id SERIAL PRIMARY KEY,
            user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            opportunity_id UUID NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
            status VARCHAR(50) DEFAULT 'applied',
            applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(user_id, opportunity_id)
        );
    ");
    echo "Table 'applications' ready.\n";

} catch (PDOException $e) {
    die("Social Tables Init Failed: " . $e->getMessage());
}
?>
