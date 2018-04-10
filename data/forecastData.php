<?php
include 'util.php';

$conn = ConnectForecast();
if (!$conn) {
    die("Connection failed: " . $conn->connect_error);
} 

if(!array_key_exists("date",$_GET) || !array_key_exists("offset",$_GET)){
	$conn->close();
	return"[]";
}

$reqDate = $_GET["date"];
$reqOffset = $_GET["offset"];

switch ($reqOffset) {
    case 0:
        $sql = "SELECT * FROM report_day WHERE d = '$reqDate'";
        break;
    case 1:
        $sql = "SELECT * FROM report_f1_2017 WHERE d = '$reqDate'";
        break;
    case 2:
        $sql = "SELECT * FROM report_f2_2017 WHERE d = '$reqDate'";
        break;
    case 3:
        $sql = "SELECT * FROM report_f3_2017 WHERE d = '$reqDate'";
        break;
    default:
    	$conn->close();
		return"[]";
}

$result = $conn->query($sql);

if(!$result){
	$conn->close();
	return"[]";
}

$dataArr = array();
while($row = $result->fetch_assoc()) {
    $dataArr[] = $row;
}
echo json_encode($dataArr);

$conn->close();
?>