<?php

$string = file_get_contents("config.json");
$config = json_decode($string, true);
$sqlConfig = $config["mysqlAuth"];
$conn = new mysqli($sqlConfig["host"], $sqlConfig["username"], $sqlConfig["password"], $sqlConfig["dbName"]);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 

$sql = "SELECT * FROM EPAData limit 10;";
$result = $conn->query($sql);

$dataArr = array();
while($row = $result->fetch_assoc()) {
    $dataArr[] = $row;
}
echo json_encode($dataArr);

$conn->close();
?>