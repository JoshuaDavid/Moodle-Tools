<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta http-equiv="Content-type" content="text/html;charset=UTF-8"/>
</head>
</html>
<?php
//header("Content-type: application/javascript");
header("Content-Type: text/javascript; charset=utf-8");
function ls_r_js($path) {
    $fullpaths = array();
    $files = scandir($path);
    foreach($files as $file) {
        if($file == "." or $file == "..") {
            continue;
        } else {
            $fullpath = $path . "/" . $file;
            if(is_dir($fullpath)) {
                $subpaths = ls_r_js($fullpath);
                foreach($subpaths as $subpath) {
                    $fullpaths[] = $subpath;
                }
            } else {
                if(preg_match('/\.js$/', $fullpath)) {
                    $fullpaths[] = $fullpath;
                }
            }
        }
    }
    return $fullpaths;
}

$scripts = ls_r_js('.');
$contents = array();
foreach($scripts as $script) {
    $contents[$script] = file_get_contents($script);
}

$loaded = array();
$maxn = sizeof($scripts) * sizeof($scripts);
for($i = 0; $i < sizeof($scripts); $i++) {
    if($i > $maxn) break;
    $script = $scripts[$i];
    $lines = explode("\n", $contents[$script]);
    $requires = array();
    foreach($lines as $line) {
        if(substr($line, 0, 12) == "// Require: ") {
            $requires[] = "./" . substr($line, 12);
        }
    }
    $requirements_met = true;
    foreach($requires as $require) {
        if(!array_key_exists($require, $loaded)) {
            $requirements_met = false;
        }
    }
    if($requirements_met) {
        echo $contents[$script] . "\n";
        $loaded[$script] = true;
    } else {
        $scripts[] = $script;
    }
}
?>