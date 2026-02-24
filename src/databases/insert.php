<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");

include 'config.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["status" => "error", "message" => "Invalid JSON input"]);
    exit;
}

$destination = trim($data['destination'] ?? '');
$start_date  = !empty($data['startDate']) ? $data['startDate'] : date('Y-m-d');
$days        = isset($data['days']) ? (int)$data['days'] : 0;
$interests   = trim($data['interests'] ?? '');
$plan_json   = json_encode($data['plan'] ?? []);
$prompt      = trim($data['prompt'] ?? '');

if ($destination === '') {
    echo json_encode(["status" => "error", "message" => "Destination is required"]);
    exit;
}

if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Database connection failed"]);
    exit;
}

$stmt = $conn->prepare(
    "INSERT INTO plans (destination, start_date, days, interests, plan, prompt)
     VALUES (?, ?, ?, ?, ?, ?)"
);

if (!$stmt) {
    echo json_encode(["status" => "error", "message" => "Database error: " . $conn->error]);
    exit;
}

$stmt->bind_param(
    "ssisss",
    $destination,
    $start_date,
    $days,
    $interests,
    $plan_json,
    $prompt
);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "id" => $stmt->insert_id]);
} else {
    echo json_encode(["status" => "error", "message" => "Failed to save plan: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>