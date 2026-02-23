<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include 'config.php';


$result = $conn->query("SELECT * FROM plans ORDER BY created_at DESC");

$plans = [];

while ($row = $result->fetch_assoc()) {
    $decoded = json_decode($row['full_data'], true);
    $row['plan'] = $decoded['plan'] ?? [];
    $row['prompt'] = $decoded['prompt'] ?? '';
    $plans[] = $row;
}

echo json_encode($plans);

$conn->close();
?>