<?php
include 'util.php';

$conn = ConnectMySql();
if (!$conn) {
    die("Connection failed: " . $conn->connect_error);
} 

$sql = "SELECT * FROM PowerStations limit 10;";
$result = $conn->query($sql);

$dataArr = array();
while($row = $result->fetch_assoc()) {
    $dataArr[] = $row;
}
echo json_encode($dataArr);

$conn->close();
?>