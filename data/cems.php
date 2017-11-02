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

$comp = array();
if(array_key_exists("city",$_GET)){
	$city = $_GET["city"];
	$sql = "SELECT id FROM CEMSComps WHERE city = '$city'";
	$result = $conn->query($sql);
	if(!$result){
		$conn->close();
		return"[]";
	}
	while($row = $result->fetch_assoc()) {
	    $comp[] = $row["id"];
	}
}

$reqDate = $_GET["date"];
$reqHour = $_GET["hour"];
$minTime = "$reqDate $reqHour:00:00";
$maxTime = "$reqDate $reqHour:59:59";
$ids = join("','",$comp); 

$sql = "SELECT * FROM CEMSData WHERE time >= '$minTime' AND time < '$maxTime' AND c_no in ('$ids')";


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