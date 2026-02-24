<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include 'config.php';

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Database connection failed"]);
    exit;
}

// Get limit from query params, default to 100 recent plans
$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 100;
$limit = min($limit, 1000); // Cap at 1000 to prevent overload

$result = $conn->query("SELECT * FROM plans ORDER BY created_at DESC LIMIT " . $limit);

if (!$result) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Query failed: " . $conn->error]);
    exit;
}

$plans = [];

while ($row = $result->fetch_assoc()) {
    $row['plan'] = json_decode($row['plan'], true) ?? [];
    $plans[] = $row;
}

echo json_encode($plans);

$conn->close();