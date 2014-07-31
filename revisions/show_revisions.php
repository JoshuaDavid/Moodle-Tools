<?php
header("Content-type: application/javascript");

$pdo = new PDO('sqlite:db/revisions.db');
$sql = file_get_contents('init.sql');
$pdo->exec($sql);

$where = array();
if(array_key_exists("module_id", $_GET)) {
    $module_id = $_GET["module_id"];
    $where[] = "activity_id=:module_id";
}
if(array_key_exists("course_id", $_GET)) {
    $course_id = $_GET["course_id"];
    $where[] = "course_id=:course_id";
}
if(array_key_exists("user_id", $_GET)) {
    $user_id = $_GET["user_id"];
    $where[] = "user_id=:user_id";
}
if(array_key_exists("action", $_GET)) {
    $action = $_GET["action"];
    $where[] = "action=:action";
}

$query = "select * from revisions";
if(count($where)) {
    $query .= " WHERE " . implode(" AND ", $where);
}
$query .= ";";

$statement = $pdo->prepare($query);
if(!empty($module_id)) $statement->bindParam(":module_id", $module_id);
if(!empty($course_id)) $statement->bindparam(":course_id", $course_id);
if(!empty($user_id))   $statement->bindParam(":user_id",   $user_id);
if(!empty($action))    $statement->bindParam(":action",    $action);
if($statement->execute()) {
    $revisions = $statement->fetchAll();

    $callback = $_GET['callback'];
    $responses = array();
    foreach($revisions as $revision) {
        $response = array();
        $response["date"] = $revision["date"];
        $response["action"] = $revision["action"];
        $response["module_id"] = $revision["activity_id"];
        $response["data"] = $revision["revision_body"];
        $responses[] = $response;
    }
    echo $callback . "(" . json_encode($responses, JSON_PRETTY_PRINT) . ");\n";
} else {
    $info = json_encode($statement->errorInfo());
    echo "$callback($info);";
}

