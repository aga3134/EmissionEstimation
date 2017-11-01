<?php
include 'util.php';

$conn = ConnectMySql();
if (!$conn) {
    die("Connection failed: " . $conn->connect_error);
} 

if(!array_key_exists("date",$_GET)){
	$conn->close();
	return"[]";
}

$reqDate = $_GET["date"];
$minTime = $reqDate . " 00:00:00";
$maxTime = $reqDate . " 23:59:59";

$sql = "SELECT * FROM PowerGens WHERE time > '$minTime' AND time < '$maxTime'";
if(array_key_exists("type",$_GET)){
	$type = $_GET["type"];
	$sql .= "AND stationID LIKE '$type%'";
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