<?php
include 'util.php';

$conn = ConnectMySql();
if (!$conn) {
    die("Connection failed: " . $conn->connect_error);
} 

if(!array_key_exists("date",$_GET) || !array_key_exists("hour",$_GET)){
	$conn->close();
	return"[]";
}

$reqDate = $_GET["date"];
$reqHour = $_GET["hour"];
$minTime = "$reqDate $reqHour:00:00";
$maxTime = "$reqDate $reqHour:59:59";

$sql = "SELECT * FROM WeatherData WHERE time >= '$minTime' AND time < '$maxTime'";
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