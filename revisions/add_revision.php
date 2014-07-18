<?php
global $pdo;
$pdo = new PDO('sqlite:db/revisions.db');
$sql = file_get_contents('init.sql');
$pdo->exec($sql);

function show_all_revisions() {
    global $pdo;
    $statement = $pdo->prepare("select * from revisions;");
    $revisions = $statement->fetchAll();
}

$sql = "insert into revisions
    ( course_id, activity_id, user_id, action, revision_body )
    VALUES
    (         0,           0,       0, 'none', '{\"key\": \"value\"}');";
$pdo->exec($sql);

show_all_revisions();
