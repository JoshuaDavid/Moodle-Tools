<?php
//header('Content-Type: application/javascript');
header("Content-Type: text/javascript; charset=UTF-8");

function create_collab_sheet($courseinfo, $sessions, $callback) {
    $data = array(
        "columns" => array(
            array( "title" => "Instructor & Course Information", "type" => "TEXT_NUMBER", "primary" => false, "width" => 300),
            array( "title" => "Week # / Title", "type"  => "TEXT_NUMBER", "primary" => true, "width" => 300),
            array( "title" => "Day", "type" => "TEXT_NUMBER", "primary" => false),
            array( "title" => "Date", "type"  => "DATE", "primary" => false),
            array( "title" => "Time", "type" => "TEXT_NUMBER", "primary" => false),
            array( "title" => "Link", "type"  => "TEXT_NUMBER", "primary" => false, "width" => 300)
        )
    );

    $course = $courseinfo["course"];
    $term = $courseinfo["term"];
    $instructor = $courseinfo["instructor"];
    $start = $sessions[0]["Date"];
    if(empty($instructor["email"])) {
        $instructor["email"] = strtolower("{$instructor["firstname"]}.{$instructor["lastname"]}@csun.edu");
    }
    if(empty($courseinfo["term"])) {
        $month = date('m', strtotime($sessions[0]["date"]));
        $year  = date('y', strtotime($sessions[0]["date"]));
        if($month < 5) {
            $courseinfo["term"] = "Sp{$year}";
        } else if($month < 8) {
            $courseinfo["term"] = "Su{$year}";
        } else {
            $courseinfo["term"] = "Fa{$year}";
        }
    }

    $name = "Coll-{$course}-{$instructor["lastname"]}-{$term}-{$start}";
    $data["name"] = $name;

    $data_string = json_encode($data);

    $ch = curl_init('https://api.smartsheet.com/1.1/workspace/7047871515125636/sheets');
    //$ch = curl_init('https://api.smartsheet.com/1.1/sheets');
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        'Authorization: Bearer ' . trim(file_get_contents('../.smartsheet_api_key.txt')),
        'Content-Type: application/json',
        'Content-Length: ' . strlen($data_string))
    );

    $raw_result = curl_exec($ch);

    $sheet = json_decode($raw_result, true, 512, JSON_BIGINT_AS_STRING);
    $sheet_id = $sheet["result"]["id"];
    $columns = array();
    foreach($sheet["result"]["columns"] as $col) {
        $columns[$col["title"]] = $col["id"];
    }

    $row_request_data = array(
        "toBottom" => true,
        "rows" => array()
    );


    foreach($sessions as $i => $row) {
        $cells = array();
        foreach($row as $key => $value) {
            $cells[] = array(
                "columnId" => $columns[$key],
                "value" => $value
            );
        }
        if($i == 0) {
            $cells[] = array(
                "columnId" => $columns["Instructor & Course Information"],
                "value" => "{$instructor["firstname"]} {$instructor["lastname"]}"
            );
        } else if($i == 1) {
            $cells[] = array(
                "columnId" => $columns["Instructor & Course Information"],
                "value" => "{$instructor["phone"]} / {$instructor["email"]}"
            );
        } else if($i == 2) {
            $cells[] = array(
                "columnId" => $columns["Instructor & Course Information"],
                "value" => "{$course} / {$term}"
            );
        } else if($i == 3) {
            $cells[] = array(
                "columnId" => $columns["Instructor & Course Information"],
                "value" => "{$term} / {$start}"
            );
        }
        $row_request_data["rows"][] = array("cells" => $cells);
    }

    $data_string = json_encode($row_request_data);
    $ch = curl_init("https://api.smartsheet.com/1.1/sheet/$sheet_id/rows");
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        'Authorization: Bearer ' . trim(file_get_contents('../.smartsheet_api_key.txt')),
        'Content-Type: application/json',
        'Content-Length: ' . strlen($data_string))
    );
    $raw_result = curl_exec($ch);
    $rows = json_decode($raw_result, true, 512, JSON_BIGINT_AS_STRING);
    //echo "{$callback}(".json_encode($sheet, JSON_PRETTY_PRINT).");";
    echo "{$callback}(".json_encode($sheet["result"]["permalink"], JSON_PRETTY_PRINT).");";
    //echo "{$callback}(".json_encode($rows, JSON_PRETTY_PRINT).");";
}

$courseinfo = json_decode($_GET["courseinfo"], true);
$sessions = json_decode($_GET["sessions"], true);
$callback = $_GET["callback"];
create_collab_sheet($courseinfo, $sessions, $callback);
?>