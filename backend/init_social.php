<?php
require_once __DIR__ . '/src/Shared/db.php';

$pdo = get_db_connection();

try {
    // 1. Likes Table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS opportunity_likes (
            id SERIAL PRIMARY KEY,
            user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            opportunity_id UUID NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(user_id, opportunity_id)
        );
    ");
    echo "Table 'opportunity_likes' ready.\n";

    // 2. Comments Table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS opportunity_comments (
            id SERIAL PRIMARY KEY,
            opportunity_id UUID NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
            user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            parent_id INTEGER REFERENCES opportunity_comments(id) ON DELETE CASCADE,
            content TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    ");
    echo "Table 'opportunity_comments' ready.\n";

    // 3. Saved Table
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

    // 4. Applications Table
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

    echo "\nAll social tables initialized successfully!";

} catch (PDOException $e) {
    die("Social Tables Init Failed: " . $e->getMessage());
}
?>
