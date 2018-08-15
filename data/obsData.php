<?php
include 'util.php';

$conn = ConnectObserve();
if (!$conn) {
    die("Connection failed: " . $conn->connect_error);
} 

if(!array_key_exists("year",$_GET) || !array_key_exists("month",$_GET) || !array_key_exists("day",$_GET)){
	$conn->close();
	return"[]";
}

$reqYear = $_GET["year"];
$reqMonth = $_GET["month"];
$reqDay = $_GET["day"];

$sql = "SELECT * FROM epa WHERE year=$reqYear AND month=$reqMonth AND day=$reqDay";
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