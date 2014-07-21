<?
$name = $_POST["name"];
$request = $_POST["request"];

$devemail = "joshua.david.723@my.csun.edu";
$subject = "Moodle Feature Request from $name";
$message = $request;
$problem = 0;
if(mail($devemail, $subject, $message)) {
    echo "<h1>Request Successfully Made</h1>";
} else {
    $problem = 1;
    echo "Sorry, there was a problem.";
}

?>
<form method="post">
    <h1>Make a Feature Request</h1>
    <table>
        <tr>
            <th><label for="name">Your Name</label></th>
            <td><input type="text" name="name" id="name" value="
<?
if($problem) echo $name;
?>
            "/></td>
        </tr>
        <tr>
            <th><label for="request">Your Request</label></th>
            <td>
                <textarea rows="20" cols="80" name="request" id="request">
<?
if($problem) echo $request;
?>
                </textarea></td>
        </tr>
    </table>
    <button type="submit">Make Request</button>
</form>
