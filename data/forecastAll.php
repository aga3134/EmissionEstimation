<?php
include 'util.php';

$conn = ConnectForecast();
if (!$conn) {
    die("Connection failed: " . $conn->connect_error);
} 

if(!array_key_exists("offset",$_GET)){
	$conn->close();
	return"[]";
}

$reqOffset = $_GET["offset"];

switch ($reqOffset) {
    case 1:
        $sql = "SELECT d,station_id,obs,PMfstrS,PMfStrL,PMfstrA,oversea FROM report_f1_2017";
        break;
    case 2:
        $sql = "SELECT d,station_id,obs,PMfstrS,PMfStrL,PMfstrA,oversea FROM report_f2_2017";
        break;
    case 3:
        $sql = "SELECT d,station_id,obs,PMfstrS,PMfStrL,PMfstrA,oversea FROM report_f3_2017";
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