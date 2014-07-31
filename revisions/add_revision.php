<?php
header("Content-type: application/javascript");

$pdo = new PDO('sqlite:db/revisions.db');
$sql = file_get_contents('init.sql');
$pdo->exec($sql);

$course_id = $_GET["course_id"];
$module_id = $_GET["module_id"];
$user_id   = $_GET["user_id"];
$action    = $_GET["action_name"];
$callback    = $_GET["callback"];

$excluded_keys = array("course_id" => 1, "module_id" => 1, "user_id" => 1,
                       "action_name" => 1, "callback" => 1);

// $data = json_encode(array_diff_key($_GET, $excluded_keys));
$data = $_GET["data"];

$sql = "insert into revisions
    ( date, course_id, activity_id, user_id, action, revision_body)
    VALUES
    (:date,:course_id,:module_id,:user_id,:action,:revision_body);";

$stmt = $pdo->prepare($sql);
$stmt->bindParam(":date", date(c));
$stmt->bindParam(":course_id", $course_id);
$stmt->bindParam(":module_id", $module_id);
$stmt->bindParam(":user_id", $user_id);
$stmt->bindParam(":action", $action);
$stmt->bindParam(":revision_body", $data);
if($stmt->execute()) {
    echo "$callback($data);"; 
} else {
    $info = json_encode($stmt->errorInfo());
    echo "$callback($info);";
}
