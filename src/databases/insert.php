<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");

include 'config.php';

$data = json_decode(file_get_contents("php://input"), true);

$destination = $data['destination'] ?? '';
$start_date = $data['startDate'] ?? null;
$days = $data['days'] ?? 0;
$interests = $data['interests'] ?? '';
$full_data = json_encode([
    'plan' => $data['plan'] ?? [],
    'prompt' => $data['prompt'] ?? ''
]);

$stmt = $conn->prepare(
    "INSERT INTO plans (destination, start_date, days, interests, full_data)
     VALUES (?, ?, ?, ?, ?)"
);

$stmt->bind_param("ssiss", $destination, $start_date, $days, $interests, $full_data);

if ($stmt->execute()) {
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error"]);
}

$stmt->close();
$conn->close();
?>