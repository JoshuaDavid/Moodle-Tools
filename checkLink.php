<?
header("content-type: application/x-javascript");
$url = $_GET["url"];
$username = $_GET["username"];
$password = $_GET["password"];
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
if(sizeof($username) && sizeof($password)) {
    curl_setopt($ch, CURLOPT_USERPWD, "{$username}:{$password}");
}
if(! $result = curl_exec($ch)) {
    $result = "null";
}
echo "http[\"{$url}\"] = " . json_encode($result) . ";\n";
echo "http_info[\"{$url}\"] = \n" . json_encode(curl_getinfo($ch)) . ";";
curl_close($ch);
?>
